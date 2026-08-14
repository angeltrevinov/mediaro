jest.mock('@/lib/auth', () => ({
  requireUserFromRequest: jest.fn(),
}));
jest.mock('@/lib/services/server/auth-service', () => ({
  updateAccountName: jest.fn(),
}));

const { PATCH } = require('./route');
const authLib = require('@/lib/auth');
const authService = require('@/lib/services/server/auth-service');

describe('PATCH /api/auth/account', () => {
  const makeRequest = (body: unknown, headers: Record<string, string> = {}) => ({
    json: jest.fn().mockResolvedValue(body),
    headers: {
      get: (name: string) => headers[name] ?? null,
    },
  }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates the name for an authenticated user', async () => {
    (authLib.requireUserFromRequest as jest.Mock).mockReturnValue({ user: { id: 3 } });
    (authService.updateAccountName as jest.Mock).mockResolvedValue(undefined);

    const response = await PATCH(makeRequest({ name: 'Updated Name' }, { 'x-user': JSON.stringify({ id: 3 }) }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: 'Name updated successfully' });
    expect(authService.updateAccountName).toHaveBeenCalledWith(3, 'Updated Name');
  });

  it('returns 401 when no authenticated user is present', async () => {
    (authLib.requireUserFromRequest as jest.Mock).mockReturnValue({ response: new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }) });

    const response = await PATCH(makeRequest({ name: 'Updated Name' }));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });
});
