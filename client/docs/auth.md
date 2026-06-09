# Client authentication

This client integrates with Better Auth through the Hono server package. Use this document before changing client-side signup, signin, signout, session loading, or protected routes.

## Architecture

- Server auth endpoints are mounted in `server/src/index.ts` under `/api/auth/*`.
- Client auth calls live in `client/src/lib/auth.ts`.
- `client/src/lib/auth.ts` uses the typed Hono client exported by `server/client` (`hcWithType`).
- Client response types are inferred from the Hono RPC client endpoint return types. Do not manually duplicate auth response shapes in the client.
- Auth cookies are managed by Better Auth and must be sent with cross-origin requests using `credentials: "include"`.
- Protected-route helpers live in `client/src/lib/require-user.ts`.

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

Protected routes should call `requireUser()` in their `clientLoader`:

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

That is intentional: the current integration uses Hono RPC-style calls to the server package plus Better Auth HTTP endpoints. Install Better Auth client only if you need Better Auth's client helpers/hooks/plugins directly in React. If you add it, document why and update tests accordingly.

## Hono RPC notes

The client can use `hcWithType` for auth calls because `server/src/index.ts` declares explicit auth endpoint routes before the Better Auth wildcard. Keep those explicit routes in sync with `client/src/lib/auth.ts`.

Better Auth still handles the actual request via `auth.handler(request)`, so Hono provides route-path integration while Better Auth owns the auth behavior and response format.

`server/src/index.ts` annotates the explicit auth routes with response types derived from `auth.api.*` / `auth.$Infer`. The client then derives its exported auth response types from each Hono client endpoint's `json()` return type:

```ts
type SignInResponse = InferResponseType<
  typeof authApi["sign-in"]["email"]["$post"]
>;
```

If an auth endpoint response shape changes, update the server route annotation first so the Hono client type remains the source of truth.

## Tests

Client auth integration tests live in:

```sh
client/src/auth.integration.test.ts
```

They mock the HTTP/Hono fetch layer by stubbing `globalThis.fetch`.

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
