# Workday — Employee Dashboard

A mobile-friendly employee dashboard built with TanStack Start, React, TypeScript, and Tailwind CSS. Features punch in/out, quick actions, announcements, and a face registration flow.

## Stack

- **Framework**: TanStack Start (SSR + file-based routing)
- **UI**: React 19, shadcn/ui (Radix UI), Tailwind CSS v4
- **Language**: TypeScript
- **Package manager**: Bun
- **Build/dev**: Vite 8 via `@lovable.dev/vite-tanstack-config`

## Running the app

```sh
bun run dev
```

The dev server runs on **port 5000**. The workflow "Start application" is pre-configured and starts automatically.

## Project structure

```
src/
  routes/         # File-based routes (TanStack Router)
  components/     # App-level components (AppHeader, RequireAuth, etc.)
  components/ui/  # shadcn/ui primitives
  lib/            # Auth helpers, quick-actions config
```

## Notes

- Auth is in demo mode — any credentials will sign in.
- All data (announcements, quick actions) is currently mocked locally.
- The vite.config.ts sets `server.port: 5000` and `server.host: true` so the app works in Replit's proxied preview pane.

## User preferences

_None recorded yet._
