# Make Track the primary Library entity

Track is the primary unit of the Library, and the app assigns its own identifier
to every Track. A Release Track may retain a snapshot and provenance from an
app-owned Discogs Release, while a Manual Track has no active Discogs Release
relationship. This lets both sources participate equally in the Transition
Graph despite Discogs exposing tracks as embedded tracklist entries rather than
stable standalone entities.
