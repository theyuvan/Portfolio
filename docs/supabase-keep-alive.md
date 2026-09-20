# Supabase keep-alive

The workflow reads at most one ID from the existing public `projects` table every
six hours (00:17, 06:17, 12:17, 18:17 UTC). It also runs manually and when its
implementation is pushed to `main`. It uses the same anonymous access as the
portfolio; no new table, write permission, service-role key, or dependency is needed.
An empty result is valid: the database query still executed.

The previous script only called `/auth/v1/health`. A healthy Auth service does
not demonstrate a user database query or prove that an inactivity timer reset.
[Supabase bases inactivity on user database activity](https://supabase.com/docs/guides/platform/free-project-pausing).

## Activate

1. Push these changes to the repository's default branch (`main`).
2. In [repository Actions secrets](https://github.com/theyuvan/Portfolio/settings/secrets/actions),
   keep `SUPABASE_URL` and `SUPABASE_ANON_KEY` set to the same project URL and
   anonymous/publishable API key used by the portfolio.
3. To enable automatic recovery, create a [Supabase personal access token](https://supabase.com/dashboard/account/tokens)
   for an account allowed to read and resume this project. Save it as the
   **repository Actions secret** `SUPABASE_ACCESS_TOKEN`. This is a management
   token, not the anonymous key or service-role key. Do not put it in source code
   or a `NEXT_PUBLIC_` variable.
4. Open [Supabase Keep-Alive](https://github.com/theyuvan/Portfolio/actions/workflows/supabase-keep-alive.yml),
   enable the workflow if disabled, and select **Run workflow** on `main`.
   Both jobs should succeed; the database job should log
   `Success: portfolio database query completed.`

Without the management token, database reads still work. If the project is
already paused, resume it from the [Supabase dashboard](https://supabase.com/dashboard)
before running the workflow.

## Failure and recovery behavior

- Requests time out after 15 seconds and transient failures retry four times
  with backoff. Invalid credentials or missing table errors fail immediately.
- Persistent connection failures, including `ENOTFOUND`, can indicate a paused
  project, an incorrect URL, or a DNS/service outage. They do not prove a pause.
- With the management token, the script checks the project's status through
  `api.supabase.com`. Only an `INACTIVE` project receives a resume request.
  A project already restoring is monitored without another resume request.
- Recovery polls until the project is healthy and then verifies a database
  read. Unfinished recovery or a failed read leaves the run failed.
  The job is limited to 20 minutes.
- The independent renewal job calls GitHub's workflow-enable API using the
  built-in `GITHUB_TOKEN` with `actions: write`. This is an API-based workaround
  for GitHub's 60-day repository-inactivity cutoff; it does not create commits.
  Repository or organization restrictions on write permissions can make that
  job fail. An already-disabled workflow needs manual enabling once.

GitHub schedules can be delayed or dropped, and the renewal workaround is not
an uptime guarantee. Monitor failed runs and Supabase's pause-warning emails.
Free-tier keep-alive is best effort; [Supabase's paid plans exclude automatic
inactivity pausing](https://supabase.com/docs/guides/platform/free-project-pausing).

References: [Management API](https://supabase.com/docs/reference/api/introduction),
[GitHub schedule behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule),
[workflow-enable API](https://docs.github.com/en/rest/actions/workflows#enable-a-workflow),
[workflow renewal approach](https://github.com/liskin/gh-workflow-keepalive).

## Local verification (Node.js 24)

```sh
node --test scripts/supabase-keep-alive.test.js
node --env-file=.env.local scripts/supabase-keep-alive.js
```

The script accepts the portfolio's existing `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` locally. Explicit `SUPABASE_*` variables take
precedence. Tests simulate outages and restoration without contacting or
pausing any real project.
