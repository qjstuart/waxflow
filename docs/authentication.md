# Account access operations

Waxflow uses Better Auth email-and-password Accounts backed by the `DB` D1 binding. Better Auth's generated UUID is the stable internal Account identifier; email addresses are login and delivery attributes, not identifiers for app-owned data.

## Verification email delivery

Production uses Resend. The Worker schedules Resend delivery with `ExecutionContext.waitUntil()` so the authentication response does not reveal delivery timing. Delivery failures are written as structured Worker errors without logging the recipient, verification URL, or token.

Workers observability is configured to redact query strings so verification tokens are not retained in request logs or traces.

Before deploying:

1. Verify the sending domain in Resend and set `EMAIL_FROM` in `wrangler.jsonc` to an address on that domain.
2. Create the D1 database with `npx wrangler d1 create waxflow`, then add the returned `database_id` to the top-level `d1_databases` entry in `wrangler.jsonc`.
3. Apply the schema with `npx wrangler d1 migrations apply DB --remote`.
4. Set `BETTER_AUTH_SECRET` and `RESEND_API_KEY` with `npx wrangler secret put <NAME>`. Generate `BETTER_AUTH_SECRET` with at least 32 high-entropy characters, for example `openssl rand -base64 32`.
5. Keep `EMAIL_DELIVERY_MODE` set to `resend` in production.

Secrets are declared by name in `wrangler.jsonc` so deploys fail when they are missing, but their values are never committed. For local development, copy `.dev.vars.example` to `.dev.vars` and replace every placeholder.

## Deterministic browser delivery

The `e2e` Cloudflare environment sets `EMAIL_DELIVERY_MODE` to `capture`. In that mode only, verification messages are written to the disposable local D1 database and can be read from `/api/test/emails/latest`. The endpoint returns 404 in production mode. Browser tests use the captured Better Auth verification URL and never call Resend.

Run the Worker integration tests with `npm test` and the phone-and-laptop browser journey with `npm run test:e2e`.
