# Server

BHVR server package built with:

- [Bun](https://bun.sh/) for package/runtime tooling
- [Hono](https://hono.dev/) for the HTTP API
- [Better Auth](https://www.better-auth.com/) for authentication
- [Drizzle ORM](https://orm.drizzle.team/) for PostgreSQL schema and migrations
- [Vitest](https://vitest.dev/) for integration tests

## Environment

The server expects these environment variables:

```sh
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
BETTER_AUTH_SECRET=<at-least-32-characters>
BETTER_AUTH_URL=http://localhost:5173
```

## Install

From the repository root:

```sh
bun install
```

## Run

From the repository root:

```sh
bun run dev:server
```

Or from `server/`:

```sh
bun run dev
```

The auth API is mounted at `/api/auth/*`.

## Database migrations

Drizzle schema lives in:

```sh
server/src/db/schema.ts
```

After changing the schema, create a migration from `server/`:

```sh
bun run db:generate
```

This writes migration files into:

```sh
server/drizzle/
```

Apply migrations from `server/`:

```sh
bun run db:migrate
```

## Tests

Integration tests use Vitest and exercise Better Auth signup, signin, session lookup, and signout.

Run server tests from `server/`:

```sh
bun run test
```

Or run all workspace tests from the repository root:

```sh
bun run test
```

The auth integration test uses `TEST_DATABASE_URL` if set, otherwise `DATABASE_URL`. It resets the Better Auth tables/schema before running.
