# Waxflow

Waxflow is a private DJ Transition memory aid built as a React SPA and Cloudflare Worker.

## Development

Copy `.dev.vars.example` to `.dev.vars`, replace its placeholders, then run `npm run dev`. The development command applies pending migrations to local D1 before starting Vite. See `docs/authentication.md` for D1, Better Auth, and Resend setup.

Tailwind CSS is available throughout the React application through the Vite plugin and the global import in `src/index.css`. This project uses Tailwind CSS v4's CSS-first configuration, so there is no `tailwind.config.js` file by default.

Quality checks:

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run test:e2e`

## React starter notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
