jest.mock('@/lib/auth', () => ({
  requireUserFromRequest: jest.fn(),
}));
jest.mock('@/lib/services/server/tracking-service', () => ({
  getTrackingByExternalId: jest.fn(),
  updateTrackingEntry: jest.fn(),
  deleteTrackingEntry: jest.fn(),
}));

const { DELETE, GET, PATCH } = require('./route');
const authLib = require('@/lib/auth');
const trackingService = require('@/lib/services/server/tracking-service');

describe('tracking detail routes', () => {
  const makeRequest = (body?: unknown, headers: Record<string, string> = {}) => ({
    json: jest.fn().mockResolvedValue(body),
    headers: {
      get: (name: string) => headers[name] ?? null,
    },
  }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET returns the tracking entry for the authenticated user', async () => {
    (authLib.requireUserFromRequest as jest.Mock).mockReturnValue({ user: { id: 3 } });
    (trackingService.getTrackingByExternalId as jest.Mock).mockResolvedValue({ id: 9, externalId: 'tmdb-550' });

    const response = await GET(makeRequest(undefined, { 'x-user': JSON.stringify({ id: 3 }) }), { params: Promise.resolve({ externalId: 'tmdb-550' }) } as any);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: 9, externalId: 'tmdb-550' });
  });

  it('PATCH updates the tracking entry', async () => {
    (authLib.requireUserFromRequest as jest.Mock).mockReturnValue({ user: { id: 3 } });
    (trackingService.updateTrackingEntry as jest.Mock).mockResolvedValue({
      ok: true,
      tracking: { id: 9, status: 'completed' },
    });

    const response = await PATCH(makeRequest({ status: 'completed' }, { 'x-user': JSON.stringify({ id: 3 }) }), { params: Promise.resolve({ externalId: 'tmdb-550' }) } as any);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: 9, status: 'completed' });
  });

  it('DELETE removes the tracking entry', async () => {
    (authLib.requireUserFromRequest as jest.Mock).mockReturnValue({ user: { id: 3 } });
    (trackingService.deleteTrackingEntry as jest.Mock).mockResolvedValue({ ok: true });

    const response = await DELETE(makeRequest(undefined, { 'x-user': JSON.stringify({ id: 3 }) }), { params: Promise.resolve({ externalId: 'tmdb-550' }) } as any);

    expect(response.status).toBe(204);
  });
});
