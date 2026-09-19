# Use Better Auth for managed email and password authentication

The initial product gives each DJ an application-owned account registered with an email address and password. Better Auth handles credential storage, password verification, reset flows, and session security; the application does not implement password cryptography itself. Discogs identity is not involved.

## Consequences

DJs receive a conventional registration and sign-in experience, and their private Library and Transitions are available across devices. The product must configure Better Auth's password reset and email-verification flows and maintain a stable internal Account identifier independently of email-address changes. Better Auth session credentials are never stored in IndexedDB, and sign-out completes both session invalidation and private local-data removal. Authentication records and app-owned DJ data remain separate concerns even when they are stored in the same database.
