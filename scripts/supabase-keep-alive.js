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
  // Use the health endpoint — always reachable, no table/RLS dependency
  const endpoint = `${SUPABASE_URL}/rest/v1/`;

  console.log(`[${new Date().toISOString()}] Pinging Supabase at: ${SUPABASE_URL}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);
    console.log(`[${new Date().toISOString()}] HTTP Status: ${response.status} ${response.statusText}`);

    if (response.ok || response.status === 400) {
      // 400 is fine — it means Supabase responded (project is alive)
      console.log(`[${new Date().toISOString()}] Success — Supabase is online. Inactivity timer reset.`);
    } else {
      const body = await response.text();
      console.error(`[${new Date().toISOString()}] Unexpected response: ${body}`);
      process.exit(1);
    }
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      console.error(`[${new Date().toISOString()}] ERROR: Request timed out after 15s. Supabase project may be paused — restore it manually at supabase.com`);
    } else {
      console.error(`[${new Date().toISOString()}] ERROR: ${err.message}`);
      console.error(`[${new Date().toISOString()}] Cause: ${err.cause?.message || "unknown"}`);
      console.error(`[${new Date().toISOString()}] If this is a network error, your Supabase project may be paused — restore it manually at supabase.com`);
    }
    process.exit(1);
  }
}

keepAlive();
