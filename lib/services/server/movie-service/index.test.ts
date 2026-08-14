import '@/__mocks__/tmdb';
import { mockSearchMovies, mockGetMovieDetails } from '@/__mocks__/tmdb';
import {
  searchMoviesService,
  getMovieDetailsService,
} from '@/lib/services/server/movie-service';
import { createMockMovieSearchResult, createMockMovieDetails } from '@/lib/test-utils';

describe('Movie Service', () => {
  describe('searchMoviesService', () => {
    it('should call searchMovies with correct parameters', async () => {
      const mockResults = [
        createMockMovieSearchResult(),
        createMockMovieSearchResult({ id: 551, title: 'Fight Club 2' }),
      ];

      mockSearchMovies.mockResolvedValue(mockResults);

      const result = await searchMoviesService('Fight Club', 1, 'en-US');

      expect(result).toEqual(mockResults);
      expect(mockSearchMovies).toHaveBeenCalledWith('Fight Club', 1, 'en-US');
    });

    it('should return empty array when no results found', async () => {
      mockSearchMovies.mockResolvedValue([]);

      const result = await searchMoviesService('NonexistentMovie', 1, 'en-US');

      expect(result).toEqual([]);
    });

    it('should handle search errors', async () => {
      const error = new Error('API Error');
      mockSearchMovies.mockRejectedValue(error);

      await expect(searchMoviesService('Fight Club', 1, 'en-US')).rejects.toThrow('API Error');
    });

    it('should support different languages', async () => {
      const mockResults = [createMockMovieSearchResult()];
      mockSearchMovies.mockResolvedValue(mockResults);

      await searchMoviesService('Fight Club', 1, 'es-ES');

      expect(mockSearchMovies).toHaveBeenCalledWith('Fight Club', 1, 'es-ES');
    });

    it('should support pagination', async () => {
      const mockResults = [createMockMovieSearchResult()];
      mockSearchMovies.mockResolvedValue(mockResults);

      await searchMoviesService('Fight Club', 2, 'en-US');

      expect(mockSearchMovies).toHaveBeenCalledWith('Fight Club', 2, 'en-US');
    });
  });

  describe('getMovieDetailsService', () => {
    it('should call getMovieDetails with correct parameters', async () => {
      const mockMovie = createMockMovieDetails();
      mockGetMovieDetails.mockResolvedValue(mockMovie);

      const result = await getMovieDetailsService('550', 'en-US');

      expect(result).toEqual(mockMovie);
      expect(mockGetMovieDetails).toHaveBeenCalledWith('550', 'en-US');
    });

    it('should return movie details with all fields', async () => {
      const mockMovie = createMockMovieDetails({
        runtime: 139,
        budget: 63000000,
        revenue: 100853753,
      });
      mockGetMovieDetails.mockResolvedValue(mockMovie);

      const result = await getMovieDetailsService('550', 'en-US');

      expect(result.runtime).toBe(139);
      expect(result.budget).toBe(63000000);
      expect(result.revenue).toBe(100853753);
    });

    it('should handle movie not found', async () => {
      mockGetMovieDetails.mockResolvedValue(null);

      const result = await getMovieDetailsService('999999', 'en-US');

      expect(result).toBeNull();
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockGetMovieDetails.mockRejectedValue(error);

      await expect(getMovieDetailsService('550', 'en-US')).rejects.toThrow('API Error');
    });

    it('should support different languages', async () => {
      const mockMovie = createMockMovieDetails();
      mockGetMovieDetails.mockResolvedValue(mockMovie);

      await getMovieDetailsService('550', 'es-ES');

      expect(mockGetMovieDetails).toHaveBeenCalledWith('550', 'es-ES');
    });
  });
});
