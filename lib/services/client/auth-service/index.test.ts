import * as authService from '@/lib/services/client/auth-service';
import { apiRoutes } from '@/lib/routes';

global.fetch = jest.fn();

describe('Client Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should send login request with correct payload', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        name: 'Test User',
        role: 'user',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockUser,
      });

      const result = await authService.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith(apiRoutes.auth.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'password123',
        }),
      });
    });

    it('should throw error on failed login', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Invalid credentials' }),
      });

      await expect(
        authService.login({
          username: 'testuser',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(
        authService.login({
          username: 'testuser',
          password: 'password123',
        })
      ).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    it('should send register request with correct payload', async () => {
      const mockUser = {
        id: 1,
        username: 'newuser',
        name: 'New User',
        role: 'user',
        created_at: '2024-01-01T00:00:00Z',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockUser,
      });

      const result = await authService.register({
        username: 'newuser',
        name: 'New User',
        password: 'password123',
      });

      expect(result).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith(apiRoutes.auth.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'newuser',
          name: 'New User',
          password: 'password123',
        }),
      });
    });

    it('should throw error when username already taken', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ error: 'Username already taken' }),
      });

      await expect(
        authService.register({
          username: 'existinguser',
          name: 'Existing User',
          password: 'password123',
        })
      ).rejects.toThrow('Username already taken');
    });
  });

  describe('updateAccountName', () => {
    it('should send update account name request', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ message: 'Updated' }),
      });

      const result = await authService.updateAccountName('Updated Name');

      expect(result).toEqual({ message: 'Updated' });
      expect(global.fetch).toHaveBeenCalledWith(apiRoutes.auth.account, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated Name' }),
      });
    });

    it('should throw error on failed update', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' }),
      });

      await expect(
        authService.updateAccountName('New Name')
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('resetPassword', () => {
    it('should send password reset request', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ message: 'Password reset successful' }),
      });

      const result = await authService.resetPassword({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
      });

      expect(result).toEqual({ message: 'Password reset successful' });
      expect(global.fetch).toHaveBeenCalledWith(apiRoutes.auth.resetPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: 'oldpassword',
          newPassword: 'newpassword',
        }),
      });
    });

    it('should throw error on incorrect current password', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Current password is incorrect' }),
      });

      await expect(
        authService.resetPassword({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword',
        })
      ).rejects.toThrow('Current password is incorrect');
    });
  });
});
