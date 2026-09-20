const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readConfig, keepAlive } = require('./supabase-keep-alive');

const env = {
  SUPABASE_URL: 'https://abcdefghijklmnopqrst.supabase.co',
  SUPABASE_ANON_KEY: 'test-anon-key',
};
const json = (data, status = 200) => new Response(JSON.stringify(data), { status });
const dnsError = () => Object.assign(new TypeError('fetch failed'), { cause: { code: 'ENOTFOUND' } });

function harness(replies, recovery = false) {
  const calls = [], waits = [], logs = [];
  return {
    calls, waits, logs,
    run: () => keepAlive(readConfig({ ...env, ...(recovery ? { SUPABASE_ACCESS_TOKEN: 'test-management-token' } : {}) }), {
      fetchImpl: async (url, options) => {
        calls.push({ url, ...options });
        assert.ok(replies.length, 'Unexpected extra request');
        const reply = replies.shift();
        if (reply instanceof Error) throw reply;
        return reply;
      },
      wait: async ms => { waits.push(ms); },
      log: message => logs.push(message),
    }),
  };
}

test('configuration accepts portfolio env names and rejects unsafe base URLs', () => {
  assert.equal(readConfig({
    NEXT_PUBLIC_SUPABASE_URL: env.SUPABASE_URL + '/',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY,
  }).url, env.SUPABASE_URL);
  assert.throws(() => readConfig({}), /Actions secrets/);
  for (const url of ['http://example.com', 'https://user:pass@example.com', env.SUPABASE_URL + '/rest/v1']) {
    assert.throws(() => readConfig({ ...env, SUPABASE_URL: url }), /HTTPS project base URL/);
  }
});

test('queries the database with a bounded read, accepts no visible rows, and keeps tokens separate', async () => {
  const h = harness([json([])], true);
  await h.run();
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].url, env.SUPABASE_URL + '/rest/v1/projects?select=id&limit=1');
  assert.equal(h.calls[0].headers.apikey, env.SUPABASE_ANON_KEY);
  assert.equal(h.calls[0].headers.Authorization, undefined);
  assert.equal(h.calls[0].redirect, 'error');
  assert.ok(h.calls[0].signal instanceof AbortSignal);
});

test('retries DNS, timeout and rate-limit failures before succeeding', async () => {
  const h = harness([dnsError(), new DOMException('Timed out', 'TimeoutError'), json({}, 429), json([])]);
  await h.run();
  assert.deepEqual(h.waits, [5000, 10000, 20000]);
});

test('permanent query failures fail immediately without trying to resume', async () => {
  for (const status of [401, 403, 404]) {
    const h = harness([json({}, status)], true);
    await assert.rejects(h.run(), new RegExp('HTTP ' + status));
    assert.equal(h.calls.length, 1);
  }
});

test('unreachable without a management token gives actionable guidance and never claims paused', async () => {
  const h = harness(Array.from({ length: 4 }, dnsError));
  await assert.rejects(h.run(), /ENOTFOUND.*If paused.*SUPABASE_ACCESS_TOKEN/);
  assert.equal(h.calls.length, 4);
  assert.ok(!h.logs.some(line => line.includes('Success')));
});

test('confirmed pause triggers one resume, waits for health, then verifies the database', async () => {
  const h = harness([
    ...Array.from({ length: 4 }, dnsError), json({ status: 'INACTIVE' }),
    new Response(null, { status: 200 }), json({ status: 'RESTORING' }),
    json({ status: 'ACTIVE_HEALTHY' }), dnsError(),
    json({ status: 'ACTIVE_HEALTHY' }), json([{ id: 'private-id' }]),
  ], true);
  await h.run();
  const posts = h.calls.filter(call => call.method === 'POST');
  assert.equal(posts.length, 1);
  assert.equal(posts[0].url, 'https://api.supabase.com/v1/projects/abcdefghijklmnopqrst/restore');
  assert.equal(posts[0].headers.Authorization, 'Bearer test-management-token');
  assert.ok(h.logs.at(-1).includes('Success'));
  assert.ok(!h.logs.join(' ').includes('private-id'));
  assert.ok(!h.logs.join(' ').includes('test-management-token'));
});

test('already restoring projects are monitored without duplicate resume requests', async () => {
  const h = harness([
    ...Array.from({ length: 4 }, dnsError), json({ status: 'RESTORING' }),
    json({ status: 'ACTIVE_HEALTHY' }), json([]),
  ], true);
  await h.run();
  assert.ok(h.calls.every(call => call.method !== 'POST'));
});

test('a healthy or failed project is not resumed because of a DNS failure', async () => {
  for (const status of ['ACTIVE_HEALTHY', 'RESTORE_FAILED', 'REMOVED']) {
    const h = harness([...Array.from({ length: 4 }, dnsError), json({ status })], true);
    await assert.rejects(h.run(), /not paused/);
    assert.ok(h.calls.every(call => call.method !== 'POST'));
  }
});

test('invalid management token fails clearly without requesting resume', async () => {
  const h = harness([...Array.from({ length: 4 }, dnsError), json({}, 401)], true);
  await assert.rejects(h.run(), /Project status returned HTTP 401/);
  assert.ok(h.calls.every(call => call.method !== 'POST'));
});

test('lost resume response polls status instead of repeating the POST', async () => {
  const h = harness([
    ...Array.from({ length: 4 }, dnsError), json({ status: 'INACTIVE' }),
    dnsError(), json({ status: 'ACTIVE_HEALTHY' }), json([]),
  ], true);
  await h.run();
  assert.equal(h.calls.filter(call => call.method === 'POST').length, 1);
});

test('recovery times out with failure rather than reporting false success', async () => {
  const h = harness([
    ...Array.from({ length: 4 }, dnsError), json({ status: 'RESTORING' }),
    ...Array.from({ length: 20 }, () => json({ status: 'RESTORING' })),
  ], true);
  await assert.rejects(h.run(), /Recovery did not finish/);
  assert.equal(h.waits.filter(ms => ms === 30000).length, 20);
  assert.ok(!h.logs.some(line => line.includes('Success')));
});
