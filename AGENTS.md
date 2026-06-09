# Agent Instructions

## Recommended agent skills

Install these skills and use the relevant skill before implementing changes:

- React Router framework mode: <https://www.skills.sh/remix-run/agent-skills/react-router-framework-mode>
- Better Auth best practices: <https://www.skills.sh/better-auth/skills/better-auth-best-practices>
- Drizzle ORM patterns: <https://www.skills.sh/giuseppe-trisciuoglio/developer-kit/drizzle-orm-patterns>
- Hono: <https://www.skills.sh/yusukebe/hono-skill/hono>
- Bun: <https://www.skills.sh/site/bun.sh/bun>
- Vitest: <https://www.skills.sh/antfu/skills/vitest>

Project-specific server notes are documented in [`server/README.md`](server/README.md).

When working in `server/`, consult that file for:

- the current tech stack
- Better Auth and Drizzle locations
- how to generate and apply Drizzle migrations
- how to run Vitest integration tests

When creating a GitHub PR, default to using `main` as the target branch.
