jest.mock('@/lib/auth', () => ({
  getUserFromRequest: jest.fn(),
  clearSessionCookie: jest.fn(),
}));
jest.mock('@/lib/services/server/auth-service', () => ({
  resetUserPassword: jest.fn(),
}));

const { POST } = require('./route');
const authLib = require('@/lib/auth');
const authService = require('@/lib/services/server/auth-service');

describe('POST /api/auth/reset-password', () => {
  const makeRequest = (body: unknown, headers: Record<string, string> = {}) => ({
    json: jest.fn().mockResolvedValue(body),
    headers: {
      get: (name: string) => headers[name] ?? null,
    },
  }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('resets the password and clears the session for an authenticated user', async () => {
    (authLib.getUserFromRequest as jest.Mock).mockReturnValue({ id: 11, username: 'alice' });
    (authService.resetUserPassword as jest.Mock).mockResolvedValue({ ok: true });

    const response = await POST(makeRequest({
      currentPassword: 'oldpass',
      newPassword: 'newpass123',
    }, { 'x-user': JSON.stringify({ id: 11, username: 'alice' }) }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: 'Password updated successfully' });
    expect(authLib.clearSessionCookie).toHaveBeenCalled();
  });

  it('returns 401 for an unauthenticated request', async () => {
    (authLib.getUserFromRequest as jest.Mock).mockReturnValue(null);

    const response = await POST(makeRequest({
      currentPassword: 'oldpass',
      newPassword: 'newpass123',
    }));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });

  it('returns 401 when the current password is wrong', async () => {
    (authLib.getUserFromRequest as jest.Mock).mockReturnValue({ id: 11, username: 'alice' });
    (authService.resetUserPassword as jest.Mock).mockResolvedValue({
      ok: false,
      error: 'Current password is incorrect',
    });

    const response = await POST(makeRequest({
      currentPassword: 'badpass',
      newPassword: 'newpass123',
    }));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Current password is incorrect' });
  });
});
