import * as movieService from '@/lib/services/client/movie-service';
import { apiRoutes } from '@/lib/routes';
import { createMockMovieSearchResult, createMockMovieDetails } from '@/lib/test-utils';

global.fetch = jest.fn();

describe('Client Movie Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchMovies', () => {
    it('should search movies with query and page', async () => {
      const mockResults = {
        page: 1,
        results: [createMockMovieSearchResult()],
        totalResults: 1,
        totalPages: 1,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResults,
      });

      const result = await movieService.searchMovies('Fight Club', 1);

      expect(result).toEqual(mockResults);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${apiRoutes.movie.search}?`),
        undefined
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('query=Fight+Club'),
        undefined
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'),
        undefined
      );
    });

    it('should handle pagination', async () => {
      const mockResults = {
        page: 2,
        results: [createMockMovieSearchResult()],
        totalResults: 100,
        totalPages: 10,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResults,
      });

      const result = await movieService.searchMovies('Action Movies', 2);

      expect(result.page).toBe(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        undefined
      );
    });

    it('should return empty results when no movies found', async () => {
      const mockResults = {
        page: 1,
        results: [],
        totalResults: 0,
        totalPages: 0,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResults,
      });

      const result = await movieService.searchMovies('NonexistentMovie123', 1);

      expect(result.results).toEqual([]);
    });

    it('should throw error on failed search', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      });

      await expect(movieService.searchMovies('Fight Club', 1)).rejects.toThrow(
        'Server error'
      );
    });

    it('should use default page of 1', async () => {
      const mockResults = {
        page: 1,
        results: [createMockMovieSearchResult()],
        totalResults: 1,
        totalPages: 1,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResults,
      });

      await movieService.searchMovies('Fight Club');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'),
        undefined
      );
    });
  });

  describe('getMovieDetails', () => {
    it('should fetch movie details by ID', async () => {
      const mockMovie = createMockMovieDetails();

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockMovie,
      });

      const result = await movieService.getMovieDetails('550');

      expect(result).toEqual(mockMovie);
      expect(global.fetch).toHaveBeenCalledWith(
        apiRoutes.movie.byId('550'),
        undefined
      );
    });

    it('should return movie with all details', async () => {
      const mockMovie = createMockMovieDetails({
        runtime: 139,
        budget: 63000000,
        revenue: 100853753,
      });

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockMovie,
      });

      const result = await movieService.getMovieDetails('550');

      expect(result.runtime).toBe(139);
      expect(result.budget).toBe(63000000);
      expect(result.revenue).toBe(100853753);
    });

    it('should throw error when movie not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Movie not found' }),
      });

      await expect(movieService.getMovieDetails('999999')).rejects.toThrow(
        'Movie not found'
      );
    });

    it('should handle server errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      });

      await expect(movieService.getMovieDetails('550')).rejects.toThrow(
        'Internal server error'
      );
    });
  });
});
