jest.mock('@/lib/auth', () => ({
  deleteSession: jest.fn(),
  clearSessionCookie: jest.fn(),
}));
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

const { cookies } = require('next/headers');
const { POST } = require('./route');
const authLib = require('@/lib/auth');

describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('clears the session and returns a success response', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'session-123' }),
    });

    (authLib.deleteSession as jest.Mock).mockResolvedValue(undefined);
    (authLib.clearSessionCookie as jest.Mock).mockResolvedValue(undefined);

    const response = await POST();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: 'Logged out' });
    expect(authLib.deleteSession).toHaveBeenCalledWith('session-123');
    expect(authLib.clearSessionCookie).toHaveBeenCalled();
  });

  it('still succeeds when there is no session cookie', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    (authLib.deleteSession as jest.Mock).mockResolvedValue(undefined);
    (authLib.clearSessionCookie as jest.Mock).mockResolvedValue(undefined);

    const response = await POST();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: 'Logged out' });
    expect(authLib.deleteSession).not.toHaveBeenCalled();
  });
});
