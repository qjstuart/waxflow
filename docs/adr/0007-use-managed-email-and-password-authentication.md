# Use managed email and password authentication

The initial product gives each Vinyl DJ an application-owned account registered with an email address and password. A managed authentication library or service handles credential storage, password verification, reset flows, and session security; the application does not implement password cryptography itself. Discogs identity is not involved.

## Consequences

Vinyl DJs receive a conventional registration and sign-in experience, and their private Library and Transition Graph can synchronize across devices. The product must select and configure an authentication component, provide password reset and email-verification flows appropriate to that component, and maintain a stable internal App Account identifier independently of email-address changes. Authentication records and app-owned DJ data remain separate concerns.
