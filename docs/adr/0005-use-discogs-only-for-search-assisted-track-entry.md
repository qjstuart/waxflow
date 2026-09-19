# Use Discogs only for search-assisted Track entry

The initial product queries Discogs only when a DJ explicitly searches its global database to avoid entering Tracks manually. A DJ may open a Release result to select one or more tracklist entries, but Release data is transient integration data: Waxflow retains only the artist and title of each selected entry and does not store the Release, the addition method, a metadata snapshot, or artwork. It does not add a Discogs Collection, refresh saved Tracks from Discogs, or run a Discogs synchronization process.
