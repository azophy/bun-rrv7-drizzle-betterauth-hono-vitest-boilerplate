# Client

React + TypeScript frontend using Vite, Tailwind CSS, and React Router framework mode in SPA mode.

## Routing

Routes use the official React Router file route conventions via `@react-router/fs-routes`.

Key files:

- `react-router.config.ts` — React Router config. `appDirectory` is `src` and `ssr` is disabled for SPA output.
- `src/root.tsx` — root document shell/layout. Add global providers, metadata shell, and app-wide wrappers here.
- `src/routes.ts` — exports `flatRoutes()` so route modules are discovered from `src/routes/`.
- `src/routes/` — route modules.

Current route examples:

- `src/routes/_index.tsx` → `/`
- `src/routes/dashboard.tsx` → `/dashboard`
- `src/routes/login.tsx` → `/login`
- `src/routes/register.tsx` → `/register`
- `src/routes/users.tsx` → `/users`

Useful naming conventions:

- `_index.tsx` creates an index route.
- `about.tsx` creates `/about`.
- `$id.tsx` creates `/:id`.
- `projects.$projectId.tsx` creates `/projects/:projectId`.

See: <https://reactrouter.com/how-to/file-route-conventions>

## Scripts

```bash
bun run dev      # Start React Router dev server
bun run build    # Type-check and build the SPA to build/client
bun run preview  # Preview build/client with Vite
bun run lint     # Run ESLint
```

## Generated files

React Router generates type/build artifacts in `.react-router/` and `build/`. These are ignored by Git and ESLint.
