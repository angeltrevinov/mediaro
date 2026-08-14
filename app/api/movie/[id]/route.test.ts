jest.mock('@/lib/services/server/movie-service');

import { GET } from './route';
import * as movieService from '@/lib/services/server/movie-service';

describe('GET /api/movie/[id]', () => {
  const makeRequest = (language = 'en-US') => ({
    nextUrl: {
      searchParams: new URLSearchParams(`language=${language}`),
    },
  }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the movie details payload for a valid id', async () => {
    const payload = {
      id: 550,
      title: 'Fight Club',
      overview: 'A classic thriller.',
    };

    (movieService.getMovieDetailsService as jest.Mock).mockResolvedValue(payload);

    const response = await GET(makeRequest('fr-FR'), { params: Promise.resolve({ id: '550' }) } as any);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(payload);
    expect(movieService.getMovieDetailsService).toHaveBeenCalledWith('550', 'fr-FR');
  });

  it('returns 500 when the movie details lookup fails', async () => {
    (movieService.getMovieDetailsService as jest.Mock).mockRejectedValue(new Error('Movie not found'));

    const response = await GET(makeRequest(), { params: Promise.resolve({ id: '999999' }) } as any);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Movie not found' });
  });
});
