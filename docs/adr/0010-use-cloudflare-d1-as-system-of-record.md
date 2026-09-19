# Use Cloudflare D1 as the system of record

The initial product stores the authoritative Account, Library, and Transition data in Cloudflare D1. D1 fits the relational constraints between Tracks and Transitions and integrates with the existing Cloudflare Worker through a binding; browser clients access it only through the Worker API.

## Consequences

Database schema changes use versioned migrations. Every app-owned row is scoped to a stable Account identifier, and the Worker enforces that boundary. A DJ-initiated mutation is saved only after the Worker commits it to D1; a browser cache is never authoritative.
