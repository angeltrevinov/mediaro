jest.mock('@/lib/services/server/auth-service', () => ({
  authenticateUser: jest.fn(),
}));
jest.mock('@/lib/auth', () => ({
  createSession: jest.fn(),
  setSessionCookie: jest.fn(),
}));

const { POST } = require('./route');
const authService = require('@/lib/services/server/auth-service');
const authLib = require('@/lib/auth');

describe('POST /api/auth/login', () => {
  const makeRequest = (body: unknown) => ({
    json: jest.fn().mockResolvedValue(body),
  }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 and user payload for valid credentials', async () => {
    const user = {
      id: 7,
      username: 'alice',
      name: 'Alice Example',
      role: 'user',
    };

    (authService.authenticateUser as jest.Mock).mockResolvedValue(user);
    (authLib.createSession as jest.Mock).mockResolvedValue('token-123');

    const response = await POST(makeRequest({
      username: 'alice',
      password: 'password123',
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(user);
    expect(authLib.createSession).toHaveBeenCalledWith(7);
    expect(authLib.setSessionCookie).toHaveBeenCalledWith('token-123');
  });

  it('returns 401 for invalid credentials', async () => {
    (authService.authenticateUser as jest.Mock).mockResolvedValue(null);

    const response = await POST(makeRequest({
      username: 'alice',
      password: 'wrongpassword',
    }));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Invalid username or password' });
  });

  it('returns 400 when the payload is invalid', async () => {
    const response = await POST(makeRequest({
      username: 'ab',
      password: '123',
    }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Username must be at least 3 characters' });
  });
});
