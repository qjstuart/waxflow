# Use TanStack Router for client-side navigation

Waxflow will use TanStack Router for URL-backed navigation between its SPA destinations because its type-safe paths, path parameters, and search parameters fit Library Search and the contextual Track and Transition screens. The dependency and route tree will be introduced when the application adds navigation beyond its current single authenticated destination; the router will not replace the application's data-access boundaries or change the React SPA and Cloudflare Worker architecture.
