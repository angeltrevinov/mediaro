# Contribution Module

This document defines the exact setup needed to run Trackarr locally and start Contribution Module development.

## Related Documentation

- Project structure and architecture:
	- [docs/project-structure.md](../project-structure.md)

## Prerequisites

- Node.js 20+
- npm 10+
- A TMDB v4 Bearer token

## Development Quickstart

Run these steps in order from the project root.

### 1) Install dependencies

```bash
npm install
```

### 2) Create environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./prisma/dev.db"
TMDB_API_KEY="your_tmdb_bearer_token"
```

Requirements:

- `DATABASE_URL` is required by Prisma.
- `TMDB_API_KEY` must be a TMDB v4 Bearer token because requests use `Authorization: Bearer ...`.

### 3) Initialize database and Prisma client

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 4) Start the project

```bash
npm run dev
```

Open http://localhost:3000.

