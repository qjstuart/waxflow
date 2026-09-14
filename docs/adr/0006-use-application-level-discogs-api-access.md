# Use application-level Discogs API access

The initial product authenticates Discogs Database Search requests on the server with the application's registered consumer key and secret. Vinyl DJs do not authorize personal Discogs accounts, and Discogs identity is not used as application identity. The search UI accepts one free-text query and never requires the Vinyl DJ to choose an Artist, Release, or Track search mode. Whether Discogs' general `q` parameter searches all required fields, and whether `type=release` reliably restricts results, are API assumptions to verify with authenticated contract tests before fixing the request strategy.

## Consequences

Discogs access receives the authenticated rate-limit tier but is treated as a shared application budget. Search requests must be debounced, cached where appropriate, and throttled using Discogs' rate-limit response headers. The implementation must validate returned result types rather than trusting an undocumented interpretation of `type`; field-specific parameters or a fallback request strategy may be needed without changing the initial one-box interaction. App Account authentication is handled separately as recorded in [ADR 0007](./0007-use-managed-email-and-password-authentication.md).
