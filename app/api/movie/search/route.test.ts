jest.mock('@/lib/services/server/movie-service');

import { GET } from './route';
import * as movieService from '@/lib/services/server/movie-service';

describe('GET /api/movie/search', () => {
  const makeRequest = (queryString: string) => ({
    nextUrl: {
      searchParams: new URLSearchParams(queryString),
    },
  }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the service payload for a successful search', async () => {
    const payload = {
      page: 2,
      results: [{ id: 550, title: 'Fight Club' }],
      totalResults: 1,
      totalPages: 1,
    };

    (movieService.searchMoviesService as jest.Mock).mockResolvedValue(payload);

    const response = await GET(makeRequest('query=fight+club&page=2&language=es-ES'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(payload);
    expect(movieService.searchMoviesService).toHaveBeenCalledWith('fight club', 2, 'es-ES');
  });

  it('returns 500 when the service throws', async () => {
    (movieService.searchMoviesService as jest.Mock).mockRejectedValue(new Error('TMDB failed'));

    const response = await GET(makeRequest('query=matrix&page=1'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'TMDB failed' });
  });
});
