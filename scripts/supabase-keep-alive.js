#!/usr/bin/env node
// Node.js 24+, no dependencies. Read real portfolio data to generate DB activity.
const { setTimeout: sleep } = require('node:timers/promises');

function readConfig(env) {
  const rawUrl = (env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const key = (env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  if (!rawUrl || !key) {
    throw new Error('Set SUPABASE_URL and SUPABASE_ANON_KEY in GitHub Actions secrets.');
  }
  const url = new URL(rawUrl);
  if (url.protocol !== 'https:' || url.username || url.password ||
      url.search || url.hash || url.pathname !== '/') {
    throw new Error('SUPABASE_URL must be the HTTPS project base URL, without a path or credentials.');
  }
  const accessToken = (env.SUPABASE_ACCESS_TOKEN || '').trim();
  const projectRef = url.hostname.match(/^([a-z]{20})\.supabase\.co$/)?.[1];
  if (accessToken && !projectRef) {
    throw new Error('Automatic recovery requires the standard https://<project-ref>.supabase.co URL.');
  }
  return { url: url.origin, key, accessToken, projectRef };
}

function httpError(label, status) {
  let hint = '';
  if (status === 401 || status === 403) hint = ' Check the API key/token and access permissions.';
  if (label === 'Database query' && status === 404) hint = ' Check SUPABASE_URL and the public.projects table.';
  const error = new Error(`${label} returned HTTP ${status}.${hint}`);
  error.retryable = status === 408 || status === 429 || status >= 500;
  return error;
}

async function keepAlive(config, { fetchImpl = fetch, wait = sleep,
  log = message => console.log(`[${new Date().toISOString()}] ${message}`) } = {}) {
  async function request(url, options, label, json = true) {
    // Timeout covers headers AND response body. Never log keys or returned rows.
    const response = await fetchImpl(url, {
      ...options, redirect: 'error', signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw httpError(label, response.status);
    }
    if (json) return response.json();
    await response.body?.cancel();
  }

  async function retry(operation, label) {
    for (let attempt = 1; attempt <= 4; attempt++) {
      try { return await operation(); } catch (error) {
        if (error.retryable === false || attempt === 4) throw error;
        log(`${label}: attempt ${attempt}/4 failed (${error.cause?.code || error.message}); retrying.`);
        await wait(5000 * 2 ** (attempt - 1));
      }
    }
  }

  async function queryDatabase() {
    const rows = await request(`${config.url}/rest/v1/projects?select=id&limit=1`, {
      headers: { apikey: config.key, Accept: 'application/json', 'Cache-Control': 'no-cache' },
    }, 'Database query');
    if (!Array.isArray(rows)) throw new Error('Database query did not return a JSON array. Check SUPABASE_URL.');
    // Empty results are valid (empty table or RLS filtering); the SQL query still ran.
    log('Success: portfolio database query completed.');
  }

  try {
    await retry(queryDatabase, 'Database query');
    if (!config.accessToken) log('Automatic resume is disabled: add SUPABASE_ACCESS_TOKEN to Actions secrets to enable it.');
    return;
  } catch (error) {
    if (error.retryable === false) throw error;
    if (!config.accessToken) {
      throw new Error(`Database unreachable after retries (${error.cause?.code || error.message}). ` +
        'Check the project URL and Supabase status. If paused, resume it in the Supabase dashboard, ' +
        'or add the SUPABASE_ACCESS_TOKEN Actions secret for automatic recovery.');
    }
  }

  // A DNS failure alone is NOT proof of pausing. Verify via the separate control plane.
  const projectUrl = `https://api.supabase.com/v1/projects/${config.projectRef}`;
  const headers = { Authorization: `Bearer ${config.accessToken}` };
  const getProject = () => retry(() => request(projectUrl, { headers }, 'Project status'), 'Project status');
  const project = await getProject();
  log(`Supabase project status: ${project.status}`);
  if (project.status === 'INACTIVE') {
    log('Project is paused; requesting resume.');
    // Send once: a lost response may still mean the server accepted the request.
    try {
      await request(`${projectUrl}/restore`, { method: 'POST', headers }, 'Project resume', false);
    } catch (error) {
      if (error.retryable === false) throw error;
      log('Resume response was interrupted; checking status before any future resume request.');
    }
  } else if (!['RESTORING', 'COMING_UP'].includes(project.status)) {
    throw new Error(`Project status is ${project.status}, not paused. ` +
      'Check Supabase service status, DNS, project URL, and database access; no resume was attempted.');
  }

  // Wait for restoration and DNS propagation, bounded by the workflow timeout.
  for (let attempt = 1; attempt <= 20; attempt++) {
    await wait(30000);
    const current = await getProject();
    log(`Recovery check ${attempt}/20: ${current.status}`);
    if (current.status === 'ACTIVE_HEALTHY') {
      try { await queryDatabase(); return; } catch (error) {
        if (error.retryable === false) throw error;
        log('Project is healthy; waiting for the database endpoint to become reachable.');
      }
    } else if (!['INACTIVE', 'RESTORING', 'COMING_UP'].includes(current.status)) {
      throw new Error(`Recovery stopped with project status ${current.status}. Check the Supabase dashboard.`);
    }
  }
  throw new Error('Recovery did not finish in time. Check the Supabase dashboard; the next scheduled run will check again.');
}

if (require.main === module) {
  Promise.resolve().then(() => keepAlive(readConfig(process.env))).catch(error => {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { readConfig, keepAlive };
