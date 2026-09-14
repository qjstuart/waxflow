# Make Track the primary app-owned identity

Track is the primary unit of the Library, and the app assigns its own identity to every Track deliberately imported into it. A Release Track has an optional relationship to an app-owned Release carrying the Discogs Release identity and retains a snapshot of its embedded tracklist entry; Release is supporting provenance rather than the main app unit. A Manual Track has no active Discogs Release relationship. This is necessary because Discogs exposes tracks as embedded tracklist entries rather than stable standalone entities, and the Transition Graph must also include music that does not exist on Discogs. The app does not import every tracklist in the Discogs Collection wholesale, and it permits Tracks from Discogs Releases the Vinyl DJ does not own.

## Consequences

Discogs imports become snapshots and are not refreshed or reconciled automatically. Only explicit Track Deletion removes Track Knowledge. The app stores metadata representing a Track, never an uploaded audio file.
