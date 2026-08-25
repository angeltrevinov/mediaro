# Mediaro

Mediaro is a Next.js application using the App Router, shadcn/ui, and pnpm.

## Getting started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Available commands

```bash
pnpm dev        # Start the development server
pnpm build      # Create a production build
pnpm start      # Start the production server
pnpm lint       # Run ESLint
pnpm typecheck  # Run TypeScript checks
```

## API documentation

The API uses `next-openapi-gen` to generate an OpenAPI specification from the
Next.js route handlers and their schemas.

Generate the specification with:

```bash
pnpm exec openapi-gen generate
```

This writes the specification to `public/openapi.json`. Start the app with
`pnpm dev`, then open [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
to view the interactive Scalar documentation.

Route handlers can be included with OpenAPI metadata such as `@openapi`,
`@path`, `@requestBody`, and `@response` in their JSDoc comments. The generator
configuration is in `openapi-gen.config.ts`.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
