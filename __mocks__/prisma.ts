import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@/generated/prisma/client';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = jest.mocked(
  require('@/lib/prisma').prisma,
) as unknown as DeepMockProxy<PrismaClient>;
