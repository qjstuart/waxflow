# Waxflow — MVP

## Outcome

Help a DJ remember personally tested Track-to-Track combinations so they can retrieve them during practice, set preparation, or performance. The product is a private memory aid, not an automatic recommendation engine.

## Acceptance target

With a realistic personal Library, a DJ can:

- find the playing Track and see which Tracks work after it within 10 seconds; and
- record a newly discovered Transition between existing Tracks within 30 seconds.

Both targets apply on phone and laptop.

## Core workflow

1. Register or sign in with an application email address and password.
2. Add Tracks deliberately, either by selecting them through Discogs search or by entering artist and title manually.
3. Find a Track in the Library using artist or title.
4. Open the Track to see which Tracks work before and after it.
5. Link it directionally to another Track already in the Library, optionally adding a Transition Note.
6. Optionally maintain BPM and a Track Note.

## Navigation

Library Search is the default destination after sign-in. Persistent navigation contains:

- Library Search
- Discogs Search
- Add Track

A Theme control is available in authenticated navigation on phone and laptop.
System is the default and follows operating-system changes live, including
before sign-in. Light and Dark are browser-profile overrides stored locally,
work without connectivity, and remain in effect across sign-out and Account
changes even though the control is not shown before sign-in. Theme preference
is not Account data and is not stored in D1.

Track details and Transition creation are contextual screens reached through the Library.

Library Search returns only Tracks. It matches case-insensitive substrings in artist, title, Track Notes, and Transition Notes. A Transition Note match returns both participating Tracks as ordinary results without displaying match context; a Self-Transition returns its Track once. Each distinct Track record appears at most once even when several values match, while deliberately separate Potential Duplicates remain separate results. BPM is not searchable in the MVP.

## Discogs search

- The server uses registered application-level Discogs credentials. DJs do not connect personal Discogs accounts.
- One free-text search box must find relevant Releases from artist names, Release titles, or Track titles; users never choose a search mode.
- A DJ opens a Release result and selects one or more tracklist entries. Release data is transient and a Release is never added to the Library.
- For each selected entry, Waxflow retains only the artist and Track title. It does not retain a Discogs Release link, identifier, snapshot, artwork, format, label, catalogue number, or track position.
- Waxflow does not retain whether a Track was entered manually or selected through Discogs search.
- The app does not track Discogs Collection ownership, add an entire Collection, or refresh saved Tracks from Discogs later.
- Authenticated contract tests must establish how Discogs `q`, field-specific parameters, and `type` actually behave. The implementation validates returned result types and may change its backend request strategy without changing the one-box UI.

## Track and Transition rules

- Track is the primary app-owned entity; artist and title are required.
- Every Track has the same role in the Library regardless of whether the DJ entered it manually or selected it through Discogs search.
- Artist is a required, editable string on Track rather than a separate entity. Title is also required and editable, including after selection through Discogs.
- BPM is one optional positive integer. Track Notes and Transition Notes are optional free-text fields.
- A Transition is unique by ordered source/destination pair. `A → B` and `B → A` are independent, and variations for the same pair belong in the Transition Note.
- A Track may transition to itself.
- Both endpoints must already exist in the Library before a Transition is created.
- A Transition's source, destination, and Transition Note are editable. Both Track views refer to the same Transition record, but the editing entry point is a UI design decision.
- An endpoint edit that would duplicate an existing ordered pair is rejected with a clear message and does not merge, overwrite, or redirect to the existing Transition.
- A Transition can be deleted from either Track's details after confirmation; deleting either view removes the same shared Transition.
- Potential duplicates produce a warning during Track creation and editing but may still be saved. The MVP compares artist and title case-insensitively after trimming and collapsing whitespace; it never merges Tracks, and fuzzy matching is outside the MVP.
- Deleting a Track permanently cascades every Transition in which it is the source or destination after an explicit count warning.

## Data, privacy, and resilience

- Every Library and its saved Transitions are private to its Account.
- Better Auth handles email/password credential security and recovery.
- Cloudflare D1 is the system of record. All creates, edits, and deletions require connectivity and are committed through the Worker API before the application reports success.
- Persistent offline data is opt-in per Trusted Device. Until enabled, private Account data remains in application memory and Waxflow does not write it to IndexedDB.
- Before enabling offline data, Waxflow warns: “Offline data will remain on this device. Enable this only on a private or trusted device.”
- Once enabled, IndexedDB contains a complete, account-scoped, disposable read cache. A DJ can search the cached Library and inspect cached Track details and Transitions while offline, but cannot change app-owned data.
- All DJ-initiated mutations are committed exclusively to D1 through the Worker. IndexedDB never accepts optimistic, pending, or offline mutations. After D1 confirms a mutation, Waxflow mirrors only the confirmed result into the enabled offline cache; it does not trigger a complete cache download.
- Cache refresh downloads a complete snapshot of the authenticated Account and atomically replaces that Account's IndexedDB cache. Incremental cursor-based synchronization is outside the MVP unless measured Library size or refresh performance demonstrates a need.
- The application can refresh an enabled cache automatically at appropriate connectivity lifecycle events, and the DJ can explicitly refresh before a gig or any situation where connectivity may be unavailable. If offline data is not yet enabled, this action first requests Trusted Device confirmation.
- An explicit refresh reports success or failure and shows when the cache was last refreshed successfully. A failed or interrupted refresh preserves the previous complete cache.
- Signing out, changing Accounts, or choosing Remove Offline Data clears all private Waxflow data from IndexedDB and private browser caches before another Account's data is displayed. Better Auth session credentials are never stored in IndexedDB.

## Explicitly outside the MVP

- Shared or public Transitions
- AI playlist or Transition suggestions
- AI/fuzzy duplicate detection
- Personal Discogs OAuth, Collection ownership, bulk Collection import, or Discogs synchronization
- Audio uploads or playback
- Musical key tracking or analysis
- Track Tags
- Recycle bin
- Backup and Restore
- Advanced Library filters or search by BPM

## Remaining implementation decisions

- Contract-test Discogs search and choose the lowest-request backend strategy that satisfies the single-box search requirement.
- Define the full Account snapshot format and exact automatic cache-refresh
  triggers. The explicit DJ-triggered refresh, Trusted Device confirmation,
  and local-data removal flows are required for the MVP.
