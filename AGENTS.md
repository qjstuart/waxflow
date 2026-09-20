# Repository guidance

## Product documentation

- Read `CONTEXT.md` before changing domain concepts or terminology.
- Read `docs/MVP.md` before planning or implementing product behavior.
- Consult relevant files in `docs/adr/` before changing an established decision.
- Use the canonical terms defined in `CONTEXT.md`.
- Do not add implementation details to `CONTEXT.md`.
- Do not implement features listed outside the MVP unless explicitly requested.

## Current phase

The initial application is a React single-page application created from
Cloudflare's React starter.

### Decided

- Deploy the React SPA, static assets, and Worker API together on Cloudflare Workers.
- Use Better Auth for application-owned email-and-password Accounts.
- Use Resend to deliver Better Auth email-verification and password-reset messages.
- Use Cloudflare D1 as the system of record for Account, Library, and Transition data.
- Use IndexedDB only as an opt-in, Account-scoped offline read cache on a Trusted Device; all mutations remain remote-first and authoritative only after D1 commits them.
- Use TanStack Router for client-side navigation once the SPA has multiple application destinations.

### Still open

- The Discogs backend request strategy, pending contract tests of its search API.
- The full Account snapshot format and exact automatic cache-refresh triggers.
- The interface entry point for editing a Transition.

Do not silently assume or encode undecided choices.

## Agent skills

### Issue tracker

Issues and specs are tracked in GitHub Issues. See `docs/agents/issue-tracker.md`.

### Domain docs

This repository uses a single-context domain-doc layout. See `docs/agents/domain.md`.
