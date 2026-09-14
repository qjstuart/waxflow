# Repository guidance

## Product documentation

- Read `CONTEXT.md` before changing domain concepts or terminology.
- Read `docs/MVP.md` before planning or implementing product behavior.
- Consult relevant files in `docs/adr/` before changing an established decision.
- Use the canonical terms defined in `CONTEXT.md`.
- Do not add implementation details to `CONTEXT.md`.
- Do not implement features listed outside the MVP unless explicitly requested.

## Current phase

The project is still defining its implementation. Authentication provider,
application stack, and persistence technology remain open decisions. Do not
silently assume or encode choices for them.
