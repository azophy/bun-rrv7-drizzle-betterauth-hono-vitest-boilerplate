# Agent Instructions

## Recommended agent skills

Install these skills and use the relevant skill before implementing changes:

- React Router framework mode: <https://www.skills.sh/remix-run/agent-skills/react-router-framework-mode>
- Better Auth best practices: <https://www.skills.sh/better-auth/skills/better-auth-best-practices>
- Drizzle ORM patterns: <https://www.skills.sh/giuseppe-trisciuoglio/developer-kit/drizzle-orm-patterns>
- Hono: <https://www.skills.sh/yusukebe/hono-skill/hono>
- Bun: <https://www.skills.sh/site/bun.sh/bun>
- Vitest: <https://www.skills.sh/antfu/skills/vitest>

## Common commands

Run commands with Bun from the repository root unless noted otherwise:

```bash
bun install
bun run dev
bun run dev:client
bun run dev:server
bun run build
bun run build:client
bun run build:server
bun run lint
bun run type-check
bun run test
```

For client-only commands, you can also run from `client/`:

```bash
bun run dev
bun run build
bun run preview
bun run lint
```

Project-specific server notes are documented in [`server/README.md`](server/README.md).

When working in `server/`, consult that file for:

- the current tech stack
- Better Auth and Drizzle locations
- how to generate and apply Drizzle migrations
- how to run Vitest integration tests

When creating a GitHub PR, default to using `main` as the target branch.
