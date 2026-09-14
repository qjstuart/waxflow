# Use Discogs only for search and import

The initial product queries Discogs only when a Vinyl DJ explicitly searches its global database and imports selected Tracks from a Release. It does not import an entire Discogs Collection, refresh previously imported Tracks, or run a Discogs synchronization process. This keeps the first iteration lightweight and treats imported metadata as a snapshot rather than an external source of truth.

## Consequences

Discogs changes are not propagated into existing Library Tracks, and the app does not detect broken Discogs mappings in the initial product. App-owned cross-device synchronization remains automatic and separate from Discogs access.
