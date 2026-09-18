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
Cloudflare's React starter and deployed to Cloudflare Workers. The client-side
router, authentication component, and local/synchronized persistence
technology remain open decisions. TanStack Router and Better Auth are leading
candidates, not accepted choices. Do not silently assume or encode undecided
choices.
