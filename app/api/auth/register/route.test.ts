jest.mock('@/lib/services/server/auth-service', () => ({
  registerUser: jest.fn(),
}));
jest.mock('@/lib/auth', () => ({
  createSession: jest.fn(),
  setSessionCookie: jest.fn(),
}));

const { POST } = require('./route');
const authService = require('@/lib/services/server/auth-service');
const authLib = require('@/lib/auth');

describe('POST /api/auth/register', () => {
  const makeRequest = (body: unknown) => ({
    json: jest.fn().mockResolvedValue(body),
  }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 201 and stores the session for a valid registration', async () => {
    const user = {
      id: 14,
      username: 'newuser',
      name: 'New User',
      role: 'user',
      created_at: '2024-01-01T00:00:00.000Z',
    };

    (authService.registerUser as jest.Mock).mockResolvedValue({
      ok: true,
      user,
    });
    (authLib.createSession as jest.Mock).mockResolvedValue('token-456');

    const response = await POST(makeRequest({
      username: 'newuser',
      name: 'New User',
      password: 'password123',
    }));

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(user);
    expect(authLib.createSession).toHaveBeenCalledWith(14);
    expect(authLib.setSessionCookie).toHaveBeenCalledWith('token-456');
  });

  it('returns 409 when the username is already taken', async () => {
    (authService.registerUser as jest.Mock).mockResolvedValue({
      ok: false,
      error: 'Username already taken',
    });

    const response = await POST(makeRequest({
      username: 'existing',
      name: 'Existing User',
      password: 'password123',
    }));

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: 'Username already taken' });
  });

  it('returns 400 when the request payload is invalid', async () => {
    const response = await POST(makeRequest({
      username: 'validuser',
      name: '',
      password: '123',
    }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Name is required' });
  });
});
