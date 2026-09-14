# Support offline transition work

The app must keep Library Search and the private Transition Graph available when connectivity is poor or absent, including creating, editing, and deleting Transitions and notes. App-owned changes are stored locally and synchronized after connectivity returns because live DJ environments cannot be assumed to have reliable internet access. Synchronization also makes Transitions authored on a laptop available on the same Vinyl DJ's phone without manual backup and restoration.

## Consequences

The application needs durable local data and account-scoped cross-device synchronization. For the initial product, conflicting offline edits use last-write-wins at the smallest practical field or relationship level; there is no conflict-resolution interface. A synchronized Track Deletion wins over a later stale edit from an offline device: synchronization returns a Track-not-found error and never resurrects the Track. Discogs search and import require connectivity, but they must not block access to previously synchronized app data.
