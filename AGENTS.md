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

## Code organization

- Keep files under roughly 300 lines wherever practical. This is a guideline,
  not a hard limit, but treat a longer file as a prompt to consider splitting it
  along cohesive responsibilities so the code remains easy to read and reason
  about.
- Do not split a file merely to satisfy the line count when doing so would make
  the code less cohesive or harder to navigate.
- Prefer `async`/`await` with `try`/`catch` over Promise `.then()`/`.catch()`
  chains wherever practical. Use Promise chaining only when it makes the code
  meaningfully clearer or is required by an API.

## App-owned UI

- Read `docs/design-system.md` before changing app-owned UI or design tokens.
- Follow its Tailwind, token, component, responsive, interaction, motion, and
  accessibility conventions.
- Generated or imported UI primitive internals are exempt unless they are being
  deliberately customized for Waxflow.

## Agent skills

### Issue tracker

Issues and specs are tracked in GitHub Issues. See `docs/agents/issue-tracker.md`.

### Domain docs

This repository uses a single-context domain-doc layout. See `docs/agents/domain.md`.
