# bhvr 🦫

![cover](https://cdn.stevedylan.dev/ipfs/bafybeievx27ar5qfqyqyud7kemnb5n2p4rzt2matogi6qttwkpxonqhra4)

A full-stack TypeScript monorepo boilerplate for agentic coding-ready projects, with shared types and a modern Bun, Hono, Vite, React, and React Router file-based routing stack.

## Why bhvr?

While there are plenty of existing app building stacks out there, many of them are either bloated, outdated, or have too much vendor lock-in. bhvr is a boilerplate for building agentic coding-ready projects: clear workspace boundaries, shared TypeScript contracts, predictable client/server structure, and deployment flexibility without sacrificing type safety.

## Features

- **Agentic Coding-Ready Boilerplate**: Predictable structure and conventions that make it easy for coding agents to inspect, modify, and extend the project
- **Full-Stack TypeScript**: End-to-end type safety between client and server
- **Shared Types**: Common type definitions shared between client and server
- **Monorepo Structure**: Organized as a workspaces-based monorepo with Turbo for build orchestration
- **Modern Stack**:
  - [Bun](https://bun.sh) as the JavaScript runtime and package manager
  - [Hono](https://hono.dev) as the backend framework
  - [Vite](https://vitejs.dev) for frontend bundling
  - [React](https://react.dev) for the frontend UI
  - [React Router](https://reactrouter.com) for client-side file-based routing
  - [Turbo](https://turbo.build) for monorepo build orchestration and caching

## Project Structure

```
.
├── client/               # React frontend with React Router file-based routing
├── server/               # Hono backend
├── shared/               # Shared TypeScript definitions
│   └── src/types/        # Type definitions used by both client and server
├── package.json          # Root package.json with workspaces
└── turbo.json            # Turbo configuration for build orchestration
```

### Server

bhvr uses Hono as a backend API for its simplicity and massive ecosystem of plugins. If you have ever used Express then it might feel familiar. Declaring routes and returning data is easy.

```
server
├── bun.lock
├── package.json
├── README.md
├── src
│   └── index.ts
└── tsconfig.json
```


If you wanted to add a database to Hono you can do so with a multitude of Typescript libraries like [Supabase](https://supabase.com), or ORMs like [Drizzle](https://orm.drizzle.team/docs/get-started) or [Prisma](https://www.prisma.io/orm)

### Client

bhvr uses React + TypeScript on Vite with [React Router framework mode](https://reactrouter.com/start/framework/routing). Routes follow the official [file route conventions](https://reactrouter.com/how-to/file-route-conventions) through `@react-router/fs-routes`: add `.tsx` route modules under `client/src/routes/` and they are automatically discovered by `client/src/routes.ts`. For example, `client/src/routes/_index.tsx` maps to `/`, `dashboard.tsx` maps to `/dashboard`, and `$id.tsx` maps to `/:id`.

```
client
├── eslint.config.js
├── package.json
├── public
│   └── vite.svg
├── react-router.config.ts  # React Router framework config; SPA mode enabled
├── README.md
├── src
│   ├── assets
│   ├── components
│   ├── index.css
│   ├── root.tsx            # Root layout and document shell
│   ├── routes.ts           # Uses @react-router/fs-routes flatRoutes()
│   ├── routes              # File route convention route modules
│   │   ├── _index.tsx
│   │   ├── dashboard.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── users.tsx
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```


### Shared

The Shared package is used for anything you want to share between the Server and Client. This could be types or libraries that you use in both environments.

```
shared
├── package.json
├── src
│   ├── index.ts
│   └── types
│       └── index.ts
└── tsconfig.json
```


By running `bun run dev` or `bun run build` it will compile and export the packages from `shared` so it can be used in either `client` or `server`

```typescript
import { ApiResponse } from 'shared'
```

## Getting Started

### Recommended Agent Skills

For agentic coding workflows, install these skills and use the relevant skill before implementing changes:

- React Router framework mode: <https://www.skills.sh/remix-run/agent-skills/react-router-framework-mode>
- Better Auth best practices: <https://www.skills.sh/better-auth/skills/better-auth-best-practices>
- Drizzle ORM patterns: <https://www.skills.sh/giuseppe-trisciuoglio/developer-kit/drizzle-orm-patterns>
- Hono: <https://www.skills.sh/yusukebe/hono-skill/hono>
- Bun: <https://www.skills.sh/site/bun.sh/bun>
- Vitest: <https://www.skills.sh/antfu/skills/vitest>

### Installation

```bash
# Install dependencies for all workspaces
bun install
```

### Development

```bash
# Run all workspaces in development mode with Turbo
bun run dev

# Or run individual workspaces directly
bun run dev:client    # Run the React Router dev server for the client
bun run dev:server    # Run the Hono backend
```

### Building

```bash
# Build all workspaces with Turbo
bun run build

# Or build individual workspaces directly
bun run build:client  # Type-check and build the React Router SPA
bun run build:server  # Build the Hono backend
```

### Additional Commands

```bash
# Lint all workspaces
bun run lint

# Type check all workspaces
bun run type-check

# Run tests across all workspaces
bun run test
```

### Deployment

Deplying each piece is very versatile and can be done numerous ways, and exploration into automating these will happen at a later date. Here are some references in the meantime.

**Client**
- [Orbiter](https://orbiter.host)
- [GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
- [Netlify](https://vite.dev/guide/static-deploy.html#netlify)
- [Cloudflare Pages](https://vite.dev/guide/static-deploy.html#cloudflare-pages)

**Server**
- [Cloudflare Worker](https://gist.github.com/stevedylandev/4aa1fc569bcba46b7169193c0498d0b3)
- [Bun](https://hono.dev/docs/getting-started/bun)
- [Node.js](https://hono.dev/docs/getting-started/nodejs)

## Type Sharing

Types are automatically shared between the client and server thanks to the shared package and TypeScript path aliases. You can import them in your code using:

```typescript
import { ApiResponse } from 'shared/types';
```

## Learn More

- [Bun Documentation](https://bun.sh/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/learn)
- [React Router Documentation](https://reactrouter.com/start/framework/routing)
- [React Router File Route Conventions](https://reactrouter.com/how-to/file-route-conventions)
- [Hono Documentation](https://hono.dev/docs)
- [Turbo Documentation](https://turbo.build/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
