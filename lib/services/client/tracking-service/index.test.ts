import * as trackingService from '@/lib/services/client/tracking-service';
import { apiRoutes } from '@/lib/routes';
import { createMockTracking } from '@/lib/test-utils';

global.fetch = jest.fn();

describe('Client Tracking Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listTracking', () => {
    it('should fetch all tracking items for user', async () => {
      const mockTrackingList = [createMockTracking()];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockTrackingList,
      });

      const result = await trackingService.listTracking();

      expect(result).toEqual(mockTrackingList);
      expect(global.fetch).toHaveBeenCalledWith(apiRoutes.tracking.root, undefined);
    });

    it('should return empty array when user has no tracking items', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      });

      const result = await trackingService.listTracking();

      expect(result).toEqual([]);
    });

    it('should throw error on failed request', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' }),
      });

      await expect(trackingService.listTracking()).rejects.toThrow('Unauthorized');
    });
  });

  describe('getTrackingByExternalId', () => {
    it('should fetch tracking item by external ID', async () => {
      const mockTracking = createMockTracking();

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockTracking,
      });

      const result = await trackingService.getTrackingByExternalId('tmdb-550');

      expect(result).toEqual(mockTracking);
      expect(global.fetch).toHaveBeenCalledWith(
        apiRoutes.tracking.byExternalId('tmdb-550'),
        undefined
      );
    });

    it('should return null when tracking item not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => null,
      });

      const result = await trackingService.getTrackingByExternalId('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createTracking', () => {
    it('should create tracking entry', async () => {
      const payload = {
        externalId: 'tmdb-550',
        mediaSource: 'tmdb',
        mediaType: 'MOVIE' as const,
        status: 'WATCHED' as const,
        rating: 8,
      };

      const mockTracking = createMockTracking();

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockTracking,
      });

      const result = await trackingService.createTracking(payload);

      expect(result).toEqual(mockTracking);
      expect(global.fetch).toHaveBeenCalledWith(apiRoutes.tracking.root, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    });

    it('should throw error when creating duplicate tracking entry', async () => {
      const payload = {
        externalId: 'tmdb-550',
        mediaSource: 'tmdb',
        mediaType: 'MOVIE' as const,
        status: 'WATCHED' as const,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ error: 'Tracking entry already exists' }),
      });

      await expect(trackingService.createTracking(payload)).rejects.toThrow(
        'Tracking entry already exists'
      );
    });
  });

  describe('updateTracking', () => {
    it('should update tracking entry', async () => {
      const payload = {
        status: 'WATCHED' as const,
        rating: 9,
      };

      const updatedTracking = createMockTracking({ rating: 9 });

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => updatedTracking,
      });

      const result = await trackingService.updateTracking('tmdb-550', payload);

      expect(result).toEqual(updatedTracking);
      expect(global.fetch).toHaveBeenCalledWith(
        apiRoutes.tracking.byExternalId('tmdb-550'),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
    });

    it('should throw error when tracking entry not found', async () => {
      const payload = {
        status: 'WATCHED' as const,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Tracking entry not found' }),
      });

      await expect(
        trackingService.updateTracking('nonexistent', payload)
      ).rejects.toThrow('Tracking entry not found');
    });
  });

  describe('deleteTracking', () => {
    it('should delete tracking entry', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 204,
      });

      await trackingService.deleteTracking('tmdb-550');

      expect(global.fetch).toHaveBeenCalledWith(
        apiRoutes.tracking.byExternalId('tmdb-550'),
        {
          method: 'DELETE',
        }
      );
    });

    it('should throw error when tracking entry not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Tracking entry not found' }),
      });

      await expect(trackingService.deleteTracking('nonexistent')).rejects.toThrow(
        'Tracking entry not found'
      );
    });
  });
});
