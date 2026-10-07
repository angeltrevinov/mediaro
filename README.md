# Mediaro

Mediaro is a Next.js application using the App Router, shadcn/ui, and npm.

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Available commands

```bash
npm run dev        # Start the development server
npm run build      # Create a production build
npm run start      # Start the production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript checks
```

## Adding componentshttp://localhost:3000/http://localhost:3000/

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
