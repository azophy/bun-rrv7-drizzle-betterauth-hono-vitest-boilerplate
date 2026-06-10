# Client authentication

This client integrates with Better Auth through the Hono server package. Use this document before changing client-side signup, signin, signout, session loading, or protected routes.

## Architecture

- Server auth endpoints are mounted in `server/src/index.ts` under `/api/auth/*`.
- Client auth calls live in `client/src/lib/auth.ts`.
- `client/src/lib/auth.ts` calls Better Auth endpoints with `fetch` and `credentials: "include"`.
- Client response types are imported from `server/client`, where they are inferred from Better Auth server APIs. Do not manually duplicate auth response shapes in the client.
- Auth cookies are managed by Better Auth and must be sent with cross-origin requests using `credentials: "include"`.
- Protected-route helpers live in `client/src/lib/require-user.ts`.
- `redirectIfAuthenticated()` accepts an optional redirect target and defaults to `/`, where the homepage renders the dashboard.

Default local origins:

- Server / Better Auth base URL: `http://localhost:3000`
- Client origin: `http://localhost:5173`

Relevant env vars:

```sh
BETTER_AUTH_URL=http://localhost:3000
CLIENT_ORIGIN=http://localhost:5173
VITE_SERVER_URL=http://localhost:3000 # optional client override
```

## Current client auth API

Use these functions from `@/lib/auth` instead of calling auth endpoints directly from route components:

```ts
getSession();
signIn({ email, password });
signUp({ name, email, password });
signOut();
```

Endpoint mapping:

| Client function | Server endpoint |
| --- | --- |
| `getSession()` | `GET /api/auth/get-session` |
| `signIn()` | `POST /api/auth/sign-in/email` |
| `signUp()` | `POST /api/auth/sign-up/email` |
| `signOut()` | `POST /api/auth/sign-out` |

## Route patterns

Auth routes use React Router framework mode client data APIs because this app is configured with `ssr: false`.

- Use `clientLoader` for session checks and redirects.
- Use `clientAction` for signup/signin/signout mutations.
- Use React Router `<Form method="post">` for auth forms.
- Do not sign out in a loader; always sign out from an action.

Protected routes, including the homepage dashboard, should call `requireUser()` in their `clientLoader`:

```ts
import { requireUser } from "@/lib/require-user";

export async function clientLoader() {
  return await requireUser();
}
```

Public auth pages should redirect authenticated users away from login/register:

```ts
import { redirectIfAuthenticated } from "@/lib/require-user";

export async function clientLoader() {
  return await redirectIfAuthenticated();
}
```

## Better Auth client package

The client does **not** currently install or use `better-auth/client` or `better-auth/react`.

That is intentional: the current integration calls Better Auth HTTP endpoints directly and imports server-derived response types. Install Better Auth client only if you need Better Auth's client helpers/hooks/plugins directly in React. If you add it, document why and update tests accordingly.

## Auth endpoint typing notes

`server/src/index.ts` mounts Better Auth once with the `/api/auth/*` wildcard and delegates behavior to `auth.handler(request)`.

`server/client` exports auth response types derived from `auth.api.*` / `auth.$Infer`. `client/src/lib/auth.ts` imports those types while making plain `fetch` calls to the Better Auth endpoints.

If an auth endpoint response shape changes, update the exported server auth response type first so the server remains the source of truth.

## Tests

Client auth integration tests live in:

```sh
client/src/auth.integration.test.ts
```

They mock the auth HTTP fetch layer by stubbing `globalThis.fetch`.

Run client tests:

```sh
cd client
bun run test
```

Or run all workspace tests from the repo root:

```sh
bun run test
```

When adding auth behavior, add or update client tests for:

- success and failure responses from auth endpoints
- redirects after signin/signup/signout
- protected route redirects when unauthenticated
- protected route access when authenticated
