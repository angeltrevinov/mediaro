# Project Structure and Architecture

This guide explains how Mediaro is organized so pages, APIs, and UI components are easy to find and extend.

## High-level layout

- `app/`: Next.js App Router pages, layouts, and API routes.
- `components/`: Reusable UI and feature components.
- `hooks/`: Client-side hooks for reusable data and state logic.
- `lib/`: Server/client shared helpers (auth, prisma, tmdb, routes, HTTP helpers).
- `lib/services/client/`: frontend service modules that call API routes by domain.
- `lib/services/server/`: backend domain services used by API route handlers.
- `interfaces/`: Domain interfaces used across features.
- `prisma/`: Database schema and migrations.
- `docs/`: Contributor documentation.

## Route groups and pages

Mediaro uses App Router route groups to separate authenticated and unauthenticated experiences:

- `app/(auth)/`: unauthenticated pages.
  - `/login`
  - `/register`
- `app/(dashboard)/`: authenticated app shell with `Nav`.
  - `/library`
  - `/search`
  - `/movie/[id]`
  - `/settings/account`
- `app/page.tsx`: entry redirect route.
  - logged in users -> `/library`
  - logged out users -> `/login`

## API structure

API routes live under `app/api/` and are grouped by domain:

- `app/api/auth/*`: login, register, logout, account updates, password reset.
- `app/api/movie/*`: TMDB movie lookup and search.
- `app/api/tracking/*`: user tracking CRUD and library data.

Shared API helpers:

- `lib/api-route-helpers.ts`
  - `parseJsonBody` for schema-based parsing/validation.
  - `jsonResponse` and `errorResponse` for consistent response formatting.
- `lib/auth.ts`
  - `requireUserFromRequest` to enforce auth in route handlers.
- `lib/routes.ts`
  - `apiRoutes` for API endpoint constants.

## Component layering

- `components/ui/*`: low-level primitives and building blocks.
- `components/*`: feature components that compose UI primitives.
  - examples: `nav.tsx`, `media-search.tsx`, `library-table.tsx`.

General rule:

- Keep page files focused on composition.
- Move reusable rendering/state logic into `components/` and `hooks/`.

## Client hooks

Place non-trivial client logic in hooks to keep pages readable.

Examples:

- `hooks/use-media-search.ts`: URL-synced search state + pagination behavior.
- `hooks/use-library-items.ts`: library loading + metadata enrichment.

## Service architecture

Mediaro now separates frontend and backend service concerns:

- Frontend domain services (`lib/services/client/*`)
  - `auth-service.ts`: login/register/account/password calls
  - `movie-service.ts`: movie search/details calls
  - `tracking-service.ts`: tracking CRUD calls
  - `http-client.ts`: shared client request/error behavior
- Backend domain services (`lib/services/server/*`)
  - `auth-service.ts`: auth/account/password business logic
  - `movie-service.ts`: movie provider access abstraction
  - `tracking-service.ts`: tracking/media persistence logic

API route handlers in `app/api/*` should remain thin and delegate domain work to server service modules.

## Routing constants

Use `lib/routes.ts` instead of hardcoding path strings in multiple files.

Benefits:

- easier global path changes
- fewer typos and broken links
- clearer navigation intent
- one place for page routes and API endpoint constants

## Prisma and persistence

- Prisma client setup: `lib/prisma.ts`
- Schema: `prisma/schema.prisma`
- Generated client: `generated/prisma/*`

## Suggested conventions for new code

1. Keep API handlers linear:
   - parse request body
   - authorize user
   - perform domain logic
   - return `jsonResponse` or `errorResponse`
2. Prefer small helpers over repeating the same validation/response blocks.
3. Keep route/page constants in `lib/routes.ts`.
4. Keep data fetching and transformation logic out of page components when possible.
5. Update docs in `docs/` when adding new top-level features or route groups.
