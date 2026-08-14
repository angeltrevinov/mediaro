jest.mock('@/lib/auth', () => ({
  requireUserFromRequest: jest.fn(),
}));
jest.mock('@/lib/services/server/tracking-service', () => ({
  listTrackingForUser: jest.fn(),
  createTrackingEntry: jest.fn(),
}));

const { GET, POST } = require('./route');
const authLib = require('@/lib/auth');
const trackingService = require('@/lib/services/server/tracking-service');

describe('tracking routes', () => {
  const makeRequest = (body?: unknown, headers: Record<string, string> = {}) => ({
    json: jest.fn().mockResolvedValue(body),
    headers: {
      get: (name: string) => headers[name] ?? null,
    },
  }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET returns the tracking list for the authenticated user', async () => {
    (authLib.requireUserFromRequest as jest.Mock).mockReturnValue({ user: { id: 3 } });
    (trackingService.listTrackingForUser as jest.Mock).mockResolvedValue([{ id: 1, status: 'watching' }]);

    const response = await GET(makeRequest(undefined, { 'x-user': JSON.stringify({ id: 3 }) }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([{ id: 1, status: 'watching' }]);
  });

  it('POST creates a tracking entry', async () => {
    (authLib.requireUserFromRequest as jest.Mock).mockReturnValue({ user: { id: 3 } });
    (trackingService.createTrackingEntry as jest.Mock).mockResolvedValue({
      ok: true,
      tracking: { id: 15, externalId: 'tmdb-550', status: 'watching' },
    });

    const response = await POST(makeRequest({
      externalId: 'tmdb-550',
      mediaSource: 'tmdb',
      mediaType: 'movie',
      status: 'watching',
      rating: 8,
    }, { 'x-user': JSON.stringify({ id: 3 }) }));

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ id: 15, externalId: 'tmdb-550', status: 'watching' });
  });
});
