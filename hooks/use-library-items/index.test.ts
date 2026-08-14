import { renderHook, waitFor } from '@/lib/test-utils';
import { useLibraryItems } from '@/hooks/use-library-items';
import * as trackingService from '@/lib/services/client/tracking-service';
import * as movieService from '@/lib/services/client/movie-service';
import { createMockTracking, createMockMovieDetails } from '@/lib/test-utils';

jest.mock('@/lib/services/client/tracking-service');
jest.mock('@/lib/services/client/movie-service');

describe('useLibraryItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load library items on mount', async () => {
    const mockTracking = createMockTracking();
    (trackingService.listTracking as jest.Mock).mockResolvedValue([mockTracking]);

    const { result } = renderHook(() => useLibraryItems());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(1);
  });

  it('should enrich items with metadata', async () => {
    const mockTracking = createMockTracking({
      media: {
        id: 1,
        external_id: '550',
        media_source: 'tmdb',
        media_type: 'MOVIE',
      },
    });

    const mockMovie = createMockMovieDetails({
      title: 'Fight Club',
      poster_path: '/poster.jpg',
    });

    (trackingService.listTracking as jest.Mock).mockResolvedValue([mockTracking]);
    (movieService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    const { result } = renderHook(() => useLibraryItems());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items[0].metadata).toBeDefined();
    expect(result.current.items[0].metadata?.title).toBe('Fight Club');
  });

  it('should handle items with existing metadata', async () => {
    const mockTracking = createMockTracking({
      media: {
        id: 1,
        external_id: '550',
        media_source: 'tmdb',
        media_type: 'MOVIE',
        title: 'Fight Club',
        poster_path: '/poster.jpg',
      },
    });

    (trackingService.listTracking as jest.Mock).mockResolvedValue([mockTracking]);

    const { result } = renderHook(() => useLibraryItems());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // getMovieDetails may or may not be called depending on hook logic
    expect(result.current.items).toHaveLength(1);
  });

  it('should handle metadata fetch errors gracefully', async () => {
    const mockTracking = createMockTracking({
      media: {
        id: 1,
        external_id: '550',
        media_source: 'tmdb',
        media_type: 'MOVIE',
      },
    });

    (trackingService.listTracking as jest.Mock).mockResolvedValue([mockTracking]);
    (movieService.getMovieDetails as jest.Mock).mockRejectedValue(
      new Error('API Error')
    );

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useLibraryItems());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should still return the item even if metadata fetch fails
    expect(result.current.items).toHaveLength(1);

    consoleErrorSpy.mockRestore();
  });

  it('should handle empty library', async () => {
    (trackingService.listTracking as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useLibraryItems());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should handle multiple items', async () => {
    const mockTracking1 = createMockTracking({ id: 1 });
    const mockTracking2 = createMockTracking({ id: 2 });
    const mockTracking3 = createMockTracking({ id: 3 });

    (trackingService.listTracking as jest.Mock).mockResolvedValue([
      mockTracking1,
      mockTracking2,
      mockTracking3,
    ]);

    const { result } = renderHook(() => useLibraryItems());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(3);
  });
});
