import '@/__mocks__/prisma';
import { prismaMock } from '@/__mocks__/prisma';
import {
  createTrackingEntry,
  updateTrackingEntry,
  deleteTrackingEntry,
  listTrackingForUser,
  getTrackingByExternalId,
} from '@/lib/services/server/tracking-service';
import { createMockMedia, createMockTracking, createMockUser } from '@/lib/test-utils';

describe('Tracking Service', () => {
  const mockUser = createMockUser();
  const mockMedia = createMockMedia();
  const mockTracking = createMockTracking();

  describe('listTrackingForUser', () => {
    it('should return all tracking entries for a user', async () => {
      const trackingList = [
        mockTracking,
        createMockTracking({ id: 2, media_id: 2 }),
      ];
      prismaMock.tracking.findMany.mockResolvedValue(trackingList as any);

      const result = await listTrackingForUser(mockUser.id);

      expect(result).toEqual(trackingList);
      expect(prismaMock.tracking.findMany).toHaveBeenCalledWith({
        where: { user_id: mockUser.id },
        include: { media: true },
      });
    });

    it('should return empty array when user has no tracking entries', async () => {
      prismaMock.tracking.findMany.mockResolvedValue([]);

      const result = await listTrackingForUser(999);

      expect(result).toEqual([]);
    });
  });

  describe('getTrackingByExternalId', () => {
    it('should return tracking entry by external ID', async () => {
      prismaMock.tracking.findFirst.mockResolvedValue(mockTracking as any);

      const result = await getTrackingByExternalId(mockUser.id, 'tmdb-550');

      expect(result).toEqual(mockTracking);
      expect(prismaMock.tracking.findFirst).toHaveBeenCalledWith({
        where: {
          user_id: mockUser.id,
          media: { external_id: 'tmdb-550' },
        },
        include: { media: true },
      });
    });

    it('should return null when tracking entry not found', async () => {
      prismaMock.tracking.findFirst.mockResolvedValue(null);

      const result = await getTrackingByExternalId(mockUser.id, 'nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createTrackingEntry', () => {
    it('should create a new tracking entry', async () => {
      const input = {
        userId: mockUser.id,
        externalId: 'tmdb-550',
        mediaSource: 'tmdb',
        mediaType: 'MOVIE' as const,
        status: 'WATCHED' as const,
        rating: 8,
      };

      prismaMock.media.findUnique.mockResolvedValue(null);
      prismaMock.media.create.mockResolvedValue(mockMedia as any);
      prismaMock.tracking.findUnique.mockResolvedValue(null);
      prismaMock.tracking.create.mockResolvedValue(mockTracking as any);

      const result = await createTrackingEntry(input);

      expect(result).toEqual({ ok: true, tracking: mockTracking });
      expect(prismaMock.media.create).toHaveBeenCalledWith({
        data: {
          external_id: 'tmdb-550',
          media_source: 'tmdb',
          media_type: 'MOVIE',
        },
      });
      expect(prismaMock.tracking.create).toHaveBeenCalled();
    });

    it('should use existing media if already in database', async () => {
      const input = {
        userId: mockUser.id,
        externalId: 'tmdb-550',
        mediaSource: 'tmdb',
        mediaType: 'MOVIE' as const,
        status: 'WATCHED' as const,
      };

      prismaMock.media.findUnique.mockResolvedValue(mockMedia as any);
      prismaMock.tracking.findUnique.mockResolvedValue(null);
      prismaMock.tracking.create.mockResolvedValue(mockTracking as any);

      const result = await createTrackingEntry(input);

      expect(result).toEqual({ ok: true, tracking: mockTracking });
      expect(prismaMock.media.create).not.toHaveBeenCalled();
    });

    it('should return error if tracking entry already exists', async () => {
      const input = {
        userId: mockUser.id,
        externalId: 'tmdb-550',
        mediaSource: 'tmdb',
        mediaType: 'MOVIE' as const,
        status: 'WATCHED' as const,
      };

      prismaMock.media.findUnique.mockResolvedValue(mockMedia as any);
      prismaMock.tracking.findUnique.mockResolvedValue(mockTracking as any);

      const result = await createTrackingEntry(input);

      expect(result).toEqual({
        ok: false,
        error: 'Tracking entry already exists',
      });
      expect(prismaMock.tracking.create).not.toHaveBeenCalled();
    });

    it('should handle optional fields', async () => {
      const input = {
        userId: mockUser.id,
        externalId: 'tmdb-550',
        mediaSource: 'tmdb',
        mediaType: 'MOVIE' as const,
        status: 'WATCHING' as const,
        rating: undefined,
        startedDate: '2024-01-01',
        completedDate: undefined,
        notes: 'In progress',
      };

      prismaMock.media.findUnique.mockResolvedValue(mockMedia as any);
      prismaMock.tracking.findUnique.mockResolvedValue(null);
      prismaMock.tracking.create.mockResolvedValue(mockTracking as any);

      await createTrackingEntry(input);

      expect(prismaMock.tracking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            started_date: new Date('2024-01-01'),
            completed_date: null,
            notes: 'In progress',
          }),
        })
      );
    });
  });

  describe('updateTrackingEntry', () => {
    it('should update tracking entry', async () => {
      const input = {
        userId: mockUser.id,
        externalId: 'tmdb-550',
        status: 'WATCHED' as const,
        rating: 9,
      };

      prismaMock.media.findUnique.mockResolvedValue(mockMedia as any);
      const updatedTracking = createMockTracking({ rating: 9 });
      prismaMock.tracking.update.mockResolvedValue(updatedTracking as any);

      const result = await updateTrackingEntry(input);

      expect(result).toEqual({ ok: true, tracking: updatedTracking });
      expect(prismaMock.tracking.update).toHaveBeenCalled();
    });

    it('should return error if media not found', async () => {
      const input = {
        userId: mockUser.id,
        externalId: 'nonexistent',
        status: 'WATCHED' as const,
      };

      prismaMock.media.findUnique.mockResolvedValue(null);

      const result = await updateTrackingEntry(input);

      expect(result).toEqual({ ok: false, error: 'Media not found' });
      expect(prismaMock.tracking.update).not.toHaveBeenCalled();
    });

    it('should clear optional fields when not provided', async () => {
      const input = {
        userId: mockUser.id,
        externalId: 'tmdb-550',
        status: 'WATCHING' as const,
        rating: undefined,
        notes: undefined,
      };

      prismaMock.media.findUnique.mockResolvedValue(mockMedia as any);
      prismaMock.tracking.update.mockResolvedValue(mockTracking as any);

      await updateTrackingEntry(input);

      expect(prismaMock.tracking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            rating: null,
            notes: null,
          }),
        })
      );
    });
  });

  describe('deleteTrackingEntry', () => {
    it('should delete tracking entry', async () => {
      prismaMock.media.findUnique.mockResolvedValue(mockMedia as any);
      prismaMock.tracking.delete.mockResolvedValue(mockTracking as any);

      const result = await deleteTrackingEntry(mockUser.id, 'tmdb-550');

      expect(result).toEqual({ ok: true });
      expect(prismaMock.tracking.delete).toHaveBeenCalledWith({
        where: {
          user_id_media_id: {
            user_id: mockUser.id,
            media_id: mockMedia.id,
          },
        },
      });
    });

    it('should return error if media not found', async () => {
      prismaMock.media.findUnique.mockResolvedValue(null);

      const result = await deleteTrackingEntry(mockUser.id, 'nonexistent');

      expect(result).toEqual({ ok: false, error: 'Media not found' });
      expect(prismaMock.tracking.delete).not.toHaveBeenCalled();
    });
  });
});
