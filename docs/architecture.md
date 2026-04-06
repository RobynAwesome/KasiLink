# Architecture

This document is the canonical structure reference for the runtime codebase.

## Runtime Layers

- `app/`: Next.js App Router entry points (`page.tsx`, `layout.tsx`, route handlers).
- `features/`: Domain services and feature logic reused by route/page entry points.
- `components/`: Shared UI components.
- `lib/`: Cross-feature infrastructure (db, models, auth config, validation, logging, utilities).
- `public/`: Static assets and PWA assets.

## Route Handler Rule

Route handlers in `app/api/**/route.ts` should stay thin:

- Authenticate and parse request input.
- Delegate domain work to `features/**`.
- Translate domain errors into HTTP responses.

## Documentation Rule

- `README.md` is the quick onboarding source.
- `docs/` contains stable architecture docs.
- `Structure/` is historical/project-vault content and is not canonical for runtime architecture.
