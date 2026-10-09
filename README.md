# Mediaro

Mediaro is a Next.js application using the App Router, shadcn/ui, Prisma ORM 7, and SQLite.

## Prerequisites

- Node.js 22.x
- npm

## Getting started

Install dependencies:

```bash
npm install
```

If you don't already have a local `.env` file, create one from the example. Also create the SQLite database directory:

```bash
cp .env.example .env
mkdir -p data
```

Set `TMDB_API_KEY` in `.env` to a valid API key from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api). The app requires this key to make TMDB requests.

`DATABASE_URL` in `.env.example` is set to `file:./data/mediaro.db`. Prisma uses this SQLite file for both migrations and application queries; no separate database server is needed. Change this value if you want to store the database elsewhere.

Apply the existing database migrations and generate Prisma Client:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the development server:

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Prisma workflow

The Prisma schema is in [`prisma/schema.prisma`](./prisma/schema.prisma), CLI configuration (including loading `.env`) is in [`prisma.config.ts`](./prisma.config.ts), and migrations are stored in `prisma/migrations/`. Prisma Client is generated into `generated/prisma/`, which is ignored by Git.

After changing the schema, create and apply a named migration, then regenerate the client:

```bash
npx prisma migrate dev --name describe_your_change
npx prisma generate
```

For deployment, apply committed migrations with:

```bash
npx prisma migrate deploy
```

Set `DATABASE_URL` in the deployment environment to the intended SQLite database URL. Because SQLite stores data in a file, deployments need persistent storage for that file; use storage and a database configuration supported by your hosting platform.

## Available commands

```bash
npm run dev        # Start the development server
npm run build      # Create a production build
npm run start      # Start the production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript checks
npm test           # Run tests
```

## Adding components

To add components to your app, run:

```bash
npx shadcn@latest add button
```

This places UI components in the `components` directory. Import them like this:

```tsx
import { Button } from "@/components/ui/button";
```
