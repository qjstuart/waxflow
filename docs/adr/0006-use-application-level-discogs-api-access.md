# Use application-level Discogs API access

The server authenticates Discogs Database Search with the application's
registered credentials. DJs do not connect personal Discogs accounts,
and Discogs identity is not used as application identity. This makes the
Discogs rate limit a shared application budget and keeps Account
authentication separate, as recorded in [ADR 0007](./0007-use-managed-email-and-password-authentication.md).
