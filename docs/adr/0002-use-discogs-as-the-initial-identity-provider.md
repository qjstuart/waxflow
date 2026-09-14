# Use Discogs as the initial identity provider

Superseded by [ADR 0006](./0006-use-application-level-discogs-api-access.md).

The initial product uses Discogs OAuth as its only sign-in mechanism and keys each App Account to the numeric identity verified by Discogs. Revoking authorization does not delete or replace the App Account; reauthorizing the same Discogs identity restores access with the new credentials. This avoids maintaining application passwords while Discogs access is already necessary for the core workflow.

## Consequences

Discogs credentials and app-owned data have separate lifecycles. Permanent loss of a Discogs identity cannot be recovered through online identity proof in the initial product, so a complete Backup is the supported recovery route into another authenticated account. A future first-party authentication method may provide an additional recovery path.
