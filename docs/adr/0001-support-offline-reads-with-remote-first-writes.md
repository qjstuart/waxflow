# Support offline reads with remote-first writes

On a Trusted Device, the app keeps cached Library Search, Track details, and saved Transitions readable when connectivity is poor or absent. All creates, edits, and deletions require connectivity and are committed through the Worker API to D1 before the application reports success because offline mutation is not essential to the initial product.

## Consequences

Persistent offline data is opt-in after an explicit warning that it remains on the device and should be enabled only on a private or trusted device. All DJ-initiated mutations go exclusively to D1; after D1 confirms one, Waxflow may mirror the confirmed result into an enabled account-scoped IndexedDB read cache. The application does not maintain a local mutation outbox or perform cross-device conflict resolution. Automatic refreshes and a DJ-triggered pre-gig refresh replace the cache from a complete Account snapshot; a failed refresh preserves the previous complete cache. Signing out, changing Accounts, or explicitly removing offline data clears private local data. The interface communicates offline read-only state, mutation failures, refresh status, and the last successful refresh time clearly. Discogs Search also requires connectivity but does not block access to previously cached app data.
