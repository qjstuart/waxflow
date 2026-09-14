# Reference Discogs artwork and cache it best-effort

The initial product stores the Discogs-hosted artwork URL and corresponding Release URL rather than copying release artwork into durable application storage. Devices may keep a disposable, size-limited, periodically revalidated image cache, but artwork is a best-effort convenience and core Library or Transition workflows never depend on it.

## Consequences

Backups contain artwork references rather than image binaries, and an offline cache miss displays a placeholder. A future explicit offline-download feature may prepare all data and images for a remote performance, subject to Discogs' then-current API terms and image-use requirements.
