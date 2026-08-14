# Testing Guide - Mediaro

This guide explains the Jest testing setup and how to write tests for your Mediaro project.

## ✅ What's Already Set Up

- **Jest** with TypeScript support (`ts-jest`)
- **React Testing Library** for component testing
- **Jest Mock Extended** for mocking Prisma and services
- **Test utilities library** with mock data factories
- **96 passing tests** covering services, hooks, and utilities
- **Coverage thresholds** configured (85% statements, 75% branches, 85% functions, 85% lines)

## Running Tests

```bash
# Run all tests
npm test

# Watch mode (re-runs on file changes)
npm test:watch

# Coverage report
npm test:coverage

# Run tests matching a pattern
npm test -- --testNamePattern="login"

# Run tests in a specific file
npm test -- lib/utils.test.ts
```

## Project Structure

```
project-root/
├── jest.config.ts                    # Jest configuration
├── jest.setup.ts                     # Test environment setup
├── lib/
│   ├── __tests__/
│   │   └── utils.test.ts            # ✅ Utility function tests
│   ├── services/
│   │   ├── server/
│   │   │   └── __tests__/           # ✅ Server service tests (auth, movie, tracking)
│   │   └── client/
│   │       └── __tests__/           # ✅ Client service tests (auth, movie, tracking, http-client)
│   └── test-utils.ts                # Test utilities, factories, render helpers
├── hooks/
│   └── __tests__/                   # ✅ React hook tests (useMediaSearch, useLibraryItems)
├── components/
│   └── __tests__/                   # 📝 Component tests (to be added)
├── app/
│   └── api/
│       └── **/__tests__/            # 📝 API route tests (to be added)
└── __mocks__/
    ├── prisma.ts                    # Mocked Prisma client
    ├── tmdb.ts                      # Mocked TMDB API
    └── fileMock.js                  # Mocked file/CSS imports
```

## Test Coverage Summary

| Module | Coverage | Tests |
|--------|----------|-------|
| `lib/utils.ts` | 100% | ✅ Covered |
| `lib/services/server/*` | 79% | ✅ Covered (6 tests) |
| `lib/services/client/*` | 93% | ✅ Covered (26 tests) |
| `hooks/*` | 98% | ✅ Covered (13 tests) |
| **Components** | 0% | 📝 TODO (feature-level only, not UI primitives) |
| **API Routes** | 0% | 📝 TODO |

## Writing New Tests

### 1. Testing Services (Recommended: Start Here)

Services are the easiest to test. Mock Prisma and external APIs.

**Pattern:** `lib/services/server/__tests__/my-service.test.ts`

```typescript
import '@/__mocks__/prisma';
import { prismaMock } from '@/__mocks__/prisma';
import { myFunction } from '@/lib/services/server/my-service';
import { createMockUser } from '@/lib/test-utils';

describe('My Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should do something', async () => {
    const mockUser = createMockUser();
    prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

    const result = await myFunction('input');

    expect(result).toEqual(mockUser);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
```

### 2. Testing Custom Hooks

Use `renderHook` and `waitFor` from test-utils. Mock services they depend on.

**Pattern:** `hooks/__tests__/my-hook.test.ts`

```typescript
import { renderHook, waitFor } from '@/lib/test-utils';
import { useMyHook } from '@/hooks/my-hook';
import * as myService from '@/lib/services/client/my-service';

jest.mock('@/lib/services/client/my-service');

describe('useMyHook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load data on mount', async () => {
    (myService.fetch as jest.Mock).mockResolvedValue({ data: 'test' });

    const { result } = renderHook(() => useMyHook());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ data: 'test' });
  });
});
```

### 3. Testing Components (Feature-level only)

Test composed components (`media-search`, `library-table`, etc.), NOT shadcn primitives.

**Pattern:** `components/__tests__/my-component.test.tsx`

```typescript
import { render, screen } from '@/lib/test-utils';
import { MyComponent } from '@/components/my-component';
import * as myService from '@/lib/services/client/my-service';

jest.mock('@/lib/services/client/my-service');

describe('MyComponent', () => {
  it('should render component with data', async () => {
    (myService.fetch as jest.Mock).mockResolvedValue({
      items: [{ id: 1, name: 'Item 1' }],
    });

    render(<MyComponent />);

    const heading = await screen.findByRole('heading', { name: /items/i });
    expect(heading).toBeInTheDocument();
  });
});
```

### 4. Testing API Routes (Advanced)

Mock services and Prisma, return mocked Response objects.

**Pattern:** `app/api/my-route/__tests__/route.test.ts`

```typescript
jest.mock('@/lib/services/server/my-service');
jest.mock('@/lib/prisma', () => ({ prisma: {} }));

import { POST } from '@/app/api/my-route/route';
import * as myService from '@/lib/services/server/my-service';

describe('POST /api/my-route', () => {
  it('should return 200 on success', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ data: 'test' }),
    };

    const response = await POST(mockRequest as any);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.data).toEqual('test');
  });
});
```

## Mock Data Factories

Use provided factories from `lib/test-utils.ts` to create consistent test data:

```typescript
import {
  createMockUser,
  createMockMedia,
  createMockTracking,
  createMockMovieSearchResult,
} from '@/lib/test-utils';

// Create with defaults
const user = createMockUser();

// Override specific fields
const admin = createMockUser({ role: 'admin' });

// Chain factories for related data
const tracking = createMockTracking({
  media: createMockMedia(),
});
```

## Mocking Strategies

### Mocking Prisma

```typescript
import '@/__mocks__/prisma';
import { prismaMock } from '@/__mocks__/prisma';

// Mock a successful query
prismaMock.user.findUnique.mockResolvedValue(mockUser);

// Mock an error
prismaMock.user.create.mockRejectedValue(new Error('DB Error'));

// Verify calls
expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
  where: { id: 1 },
});
```

### Mocking External APIs (TMDB)

```typescript
import '@/__mocks__/tmdb';
import { mockSearchMovies } from '@/__mocks__/tmdb';

mockSearchMovies.mockResolvedValue([
  createMockMovieSearchResult(),
]);

// Use in tests
const results = await searchMovies('Fight Club', 1);
```

### Mocking Fetch (HTTP Client)

```typescript
global.fetch = jest.fn();

// Mock successful response
(global.fetch as jest.Mock).mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => ({ id: 1, name: 'Test' }),
});

// Mock error response
(global.fetch as jest.Mock).mockResolvedValue({
  ok: false,
  status: 401,
  json: async () => ({ error: 'Unauthorized' }),
});
```

## Best Practices

### ✅ DO

- **Test behavior, not implementation**: Focus on what the function does, not how it does it
- **Use descriptive test names**: `should return null when user not found` (not `test1`)
- **Isolate tests**: Each test should be independent; use `beforeEach` to reset mocks
- **Follow AAA pattern**: Arrange (setup), Act (call function), Assert (check results)
- **Test error cases**: Include happy path AND error scenarios
- **Use factories**: Create consistent test data with `createMock*` functions
- **Mock external dependencies**: Prisma, APIs, fetch, etc.

### ❌ DON'T

- **Test implementation details**: Avoid testing private methods or internal state
- **Couple tests to implementation**: Refactor code without breaking tests
- **Skip error testing**: Always test both success and failure paths
- **Share state between tests**: Each test should be able to run independently
- **Test third-party code**: Don't test shadcn primitives or library code
- **Hardcode test data**: Use factories instead

## Common Testing Patterns

### Testing Async Functions

```typescript
it('should handle async operations', async () => {
  mockFetch.mockResolvedValue({ data: 'test' });

  const result = await myAsyncFunction();

  await expect(result).resolves.toEqual({ data: 'test' });
});
```

### Testing Error Handling

```typescript
it('should throw error on failure', async () => {
  mockFetch.mockRejectedValue(new Error('Network error'));

  await expect(myFunction()).rejects.toThrow('Network error');
});
```

### Testing Hook State Updates

```typescript
it('should update state', async () => {
  const { result } = renderHook(() => useMyHook());

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeDefined();
  });
});
```

### Testing Form Submission

```typescript
it('should submit form', async () => {
  render(<MyForm onSubmit={mockSubmit} />);

  const input = screen.getByLabelText(/name/i);
  await userEvent.type(input, 'Test');

  const button = screen.getByRole('button', { name: /submit/i });
  await userEvent.click(button);

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({ name: 'Test' });
  });
});
```

## Debugging Tests

### Run a Single Test

```bash
npm test -- --testNamePattern="should handle async"
```

### Run Tests in Debug Mode

```bash
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome.

### Print Debug Info

```typescript
import { screen, debug } from '@testing-library/react';

// Log full DOM
debug();

// Log specific element
debug(screen.getByRole('button'));

// Use console.log in tests
console.log('Debug info:', myVar);
```

### Check Mock Calls

```typescript
// See all calls
console.log(mockFn.mock.calls);

// See last call arguments
console.log(mockFn.mock.lastCall);
```

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Run tests
  run: npm test -- --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Jest Mock Extended](https://github.com/marchaos/jest-mock-extended)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Need Help?

- Check existing tests in `__tests__/` directories for examples
- Use `createMock*` factories from `lib/test-utils.ts`
- Run `npm test:watch` to iterate quickly
- Check coverage with `npm run test:coverage`
