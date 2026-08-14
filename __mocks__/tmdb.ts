jest.mock('@/lib/tmdb', () => ({
  __esModule: true,
  searchMovies: jest.fn(),
  getMovieDetails: jest.fn(),
}));

export const mockSearchMovies = jest.mocked(
  require('@/lib/tmdb').searchMovies,
);

export const mockGetMovieDetails = jest.mocked(
  require('@/lib/tmdb').getMovieDetails,
);
