# Use a React SPA on Cloudflare Workers

The initial application uses the React + Vite starter from Cloudflare's
`create-cloudflare` tooling. It deploys the single-page application, static
assets, and a Worker API together on Cloudflare Workers. This provides a browser
UI for phone and laptop and a server boundary that keeps Discogs credentials
and other server-side responsibilities out of the client.
