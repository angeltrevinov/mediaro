import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MediaType, TrackingStatus } from '@/generated/prisma/enums';

/**
 * Custom render function that wraps React Testing Library's render
 * with any necessary providers (can be extended with theme providers, etc.)
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, null, children);
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

/**
 * Mock data factories for tests
 */

export const createMockUser = (overrides?: Partial<any>) => ({
  id: 1,
  username: 'testuser',
  name: 'Test User',
  password_hash: '$2b$12$hashedpassword',
  role: 'user',
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
  ...overrides,
});

export const createMockAdminUser = (overrides?: Partial<any>) => ({
  ...createMockUser(overrides),
  id: 0,
  role: 'admin',
});

export const createMockSession = (overrides?: Partial<any>) => ({
  id: 'session-123',
  user_id: 1,
  token: 'token-abc123',
  created_at: new Date('2024-01-01'),
  expires_at: new Date('2024-02-01'),
  ...overrides,
});

export const createMockMedia = (overrides?: Partial<any>) => ({
  id: 1,
  external_id: 'tmdb-550',
  media_source: 'tmdb',
  media_type: 'MOVIE' as MediaType,
  title: 'Test Movie',
  poster_url: 'https://example.com/poster.jpg',
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
  ...overrides,
});

export const createMockTracking = (overrides?: Partial<any>) => ({
  id: 1,
  user_id: 1,
  media_id: 1,
  external_id: 'tmdb-550',
  media_source: 'tmdb',
  media_type: 'MOVIE' as MediaType,
  status: 'WATCHED' as TrackingStatus,
  rating: 8,
  started_date: '2024-01-01',
  completed_date: '2024-01-02',
  notes: 'Great movie!',
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
  ...overrides,
});

export const createMockMovieSearchResult = (overrides?: Partial<any>) => ({
  id: 550,
  title: 'Fight Club',
  overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into much more.',
  poster_path: '/pB8BM7pdSp6B6Ie8kZQrdc3AIzc.jpg',
  release_date: '1999-10-15',
  vote_average: 8.8,
  vote_count: 26280,
  ...overrides,
});

export const createMockMovieDetails = (overrides?: Partial<any>) => ({
  id: 550,
  title: 'Fight Club',
  overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into much more.',
  poster_path: '/pB8BM7pdSp6B6Ie8kZQrdc3AIzc.jpg',
  release_date: '1999-10-15',
  vote_average: 8.8,
  vote_count: 26280,
  runtime: 139,
  budget: 63000000,
  revenue: 100853753,
  genres: [{ id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
  ...overrides,
});

/**
 * API Response shape helpers
 */
export const createMockApiError = (message: string = 'Test error') => ({
  error: message,
});

export const createMockApiSuccess = <T,>(data: T) => ({
  ok: true,
  data,
});
