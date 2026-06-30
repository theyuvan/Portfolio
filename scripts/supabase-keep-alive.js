#!/usr/bin/env node
// Pings Supabase REST API to prevent free-tier project from pausing due to inactivity.
// Requires Node.js 18+ (native fetch). No external dependencies.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("ERROR: SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set.");
  process.exit(1);
}

async function keepAlive() {
  const endpoint = `${SUPABASE_URL}/rest/v1/projects?select=id&limit=1`;

  console.log(`[${new Date().toISOString()}] Pinging Supabase...`);

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
  });

  console.log(`[${new Date().toISOString()}] HTTP Status: ${response.status} ${response.statusText}`);

  if (response.ok) {
    const data = await response.json();
    console.log(`[${new Date().toISOString()}] Success — rows returned: ${data.length}. Supabase inactivity timer reset.`);
  } else {
    const body = await response.text();
    console.error(`[${new Date().toISOString()}] Ping failed. Response body: ${body}`);
    process.exit(1);
  }
}

keepAlive().catch((err) => {
  console.error(`[${new Date().toISOString()}] Unexpected error:`, err.message);
  process.exit(1);
});
