import '@/__mocks__/prisma';
import { prismaMock } from '@/__mocks__/prisma';
import bcrypt from 'bcrypt';
import { authenticateUser, registerUser } from '@/lib/services/server/auth-service';
import { createMockUser, createMockAdminUser } from '@/lib/test-utils';

jest.mock('bcrypt');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.compare as jest.Mock).mockClear();
    (bcrypt.hash as jest.Mock).mockClear();
  });

  describe('authenticateUser', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = createMockUser();
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authenticateUser('testuser', 'password123');

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password_hash);
    });

    it('should return null when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await authenticateUser('nonexistent', 'password123');

      expect(result).toBeNull();
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'nonexistent' },
      });
    });

    it('should return null when password is invalid', async () => {
      const mockUser = createMockUser();
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authenticateUser('testuser', 'wrongpassword');

      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockUser.password_hash);
    });
  });

  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      const input = {
        username: 'newuser',
        name: 'New User',
        password: 'password123',
      };

      const passwordHash = '$2b$12$hashedpassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(passwordHash);
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.count.mockResolvedValue(0);

      const expectedUser = {
        id: 1,
        username: 'newuser',
        name: 'New User',
        role: 'admin',
        created_at: new Date('2024-01-01'),
      };
      prismaMock.user.create.mockResolvedValue(expectedUser as any);

      const result = await registerUser(input);

      expect(result).toEqual({ ok: true, user: expectedUser });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          username: 'newuser',
          name: 'New User',
          password_hash: passwordHash,
          role: 'admin',
        },
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          created_at: true,
        },
      });
    });

    it('should return error if username already exists', async () => {
      const input = {
        username: 'existinguser',
        name: 'Existing User',
        password: 'password123',
      };

      const existingUser = createMockUser({ username: 'existinguser' });
      prismaMock.user.findUnique.mockResolvedValue(existingUser as any);

      const result = await registerUser(input);

      expect(result).toEqual({ ok: false, error: 'Username already taken' });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });

    it('should assign admin role to first user', async () => {
      const input = {
        username: 'firstuser',
        name: 'First User',
        password: 'password123',
      };

      const passwordHash = '$2b$12$hashedpassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(passwordHash);
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.count.mockResolvedValue(0); // First user

      const expectedUser = {
        id: 1,
        username: 'firstuser',
        name: 'First User',
        role: 'admin',
        created_at: new Date('2024-01-01'),
      };
      prismaMock.user.create.mockResolvedValue(expectedUser as any);

      await registerUser(input);

      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ role: 'admin' }),
        })
      );
    });

    it('should assign user role to subsequent users', async () => {
      const input = {
        username: 'seconduser',
        name: 'Second User',
        password: 'password123',
      };

      const passwordHash = '$2b$12$hashedpassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(passwordHash);
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.count.mockResolvedValue(1); // Not first user

      const expectedUser = {
        id: 2,
        username: 'seconduser',
        name: 'Second User',
        role: 'user',
        created_at: new Date('2024-01-01'),
      };
      prismaMock.user.create.mockResolvedValue(expectedUser as any);

      await registerUser(input);

      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ role: 'user' }),
        })
      );
    });
  });
});
