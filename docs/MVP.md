# Vinyl DJ Transition App — MVP

## Outcome

Help a Vinyl DJ quickly capture and retrieve personally proven, directional Track-to-Track Transitions during set preparation and live selection. The product is a private memory aid, not an automatic recommendation engine.

## Acceptance target

With a realistic personal Library, a Vinyl DJ can:

- find the playing Track and see its outgoing Transition options within 10 seconds; and
- record a newly discovered Transition between existing Tracks within 30 seconds.

Both targets apply on phone and laptop.

## Core workflow

1. Register or sign in with an application email address and password.
2. Add Tracks deliberately, either by importing selected tracklist entries from a Discogs Release or by entering artist and title manually.
3. Find a Track in the Library using artist or title.
4. Open the Track to see both incoming and outgoing Transitions.
5. Link it directionally to another Track already in the Library, optionally adding a Transition note.
6. Optionally maintain BPM, flexible Track tags, and comments.

## Navigation

Library Search is the default destination after sign-in. Persistent navigation contains:

- Library Search
- Discogs Import
- Add Manual Track
- Backup/Restore

Track details and Transition creation are contextual screens reached through the Library.

## Discogs import

- The server uses registered application-level Discogs credentials. Users do not connect personal Discogs accounts.
- One free-text search box must find relevant Releases from artist names, Release titles, or Track titles; users never choose a search mode.
- A user opens a Release, checks one or more tracklist entries, and imports only those Tracks.
- Imported data is a snapshot with Discogs Release provenance and artwork/Release URLs.
- The app does not track Discogs Collection ownership, import an entire Collection, or synchronize imported metadata later.
- Authenticated contract tests must establish how Discogs `q`, field-specific parameters, and `type` actually behave. The implementation validates returned result types and may change its backend request strategy without changing the one-box UI.

## Track and Transition rules

- Track is the primary app-owned entity; artist and title are required.
- A Discogs Release Track and a manually added Manual Track participate equally in the Library.
- BPM, tags, comments, and Transition notes are optional. Tags belong only to Tracks.
- A Transition is unique by ordered source/destination pair. `A → B` and `B → A` are independent.
- A Track may transition to itself.
- Both endpoints must already exist in the Library before a Transition is created.
- Potential duplicates produce a warning but may still be added. MVP detection is deterministic, not AI-based.
- Deleting a Track permanently cascades its incoming and outgoing Transitions after an explicit count warning.

## Data, privacy, and resilience

- Every Library and Transition Graph is private to its App Account.
- A managed authentication component handles email/password credential security and recovery.
- Core Library and Transition work remains available offline through durable device storage, then synchronizes across the account's devices.
- Initial conflict handling is granular last-write-wins. A synchronized Track deletion defeats stale offline edits and never resurrects the Track.
- A manual, versioned JSON backup contains all app-owned data. Restore completely replaces current account data after confirmation.
- Discogs artwork remains a referenced URL with best-effort disposable device caching; it is not copied into durable server storage or guaranteed in backups.

## Explicitly outside the MVP

- Shared or public Transitions
- AI playlist or Transition suggestions
- AI/fuzzy duplicate detection
- Personal Discogs OAuth, Collection ownership, bulk Collection import, or Discogs synchronization
- Audio uploads or playback
- Musical key tracking or analysis
- Copying or synchronizing user-authored knowledge between editions
- Recycle bin
- Backup merging, schedules, reminders, or cloud destinations
- Guaranteed offline artwork download
- Advanced Library filters or search by BPM/tags

## Remaining implementation decisions

- Decide whether the SPA needs a client-side router; TanStack Router is the
  current candidate.
- Select the managed authentication component; Better Auth is the current
  candidate.
- Contract-test Discogs search and choose the lowest-request backend strategy that satisfies the single-box search requirement.
- Select the concrete local and synchronized persistence mechanisms required
  by the offline-first behavior.
