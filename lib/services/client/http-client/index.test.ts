import { requestJson, requestNoContent } from '@/lib/services/client/http-client';

global.fetch = jest.fn();

describe('HTTP Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestJson', () => {
    it('should make successful JSON request', async () => {
      const mockData = { id: 1, name: 'Test' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await requestJson('/api/test');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith('/api/test', undefined);
    });

    it('should pass request options to fetch', async () => {
      const mockData = { id: 1 };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test' }),
      };

      await requestJson('/api/test', options);

      expect(global.fetch).toHaveBeenCalledWith('/api/test', options);
    });

    it('should throw error on failed response', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Bad request' }),
      });

      await expect(requestJson('/api/test')).rejects.toThrow('Bad request');
    });

    it('should handle error response with message field', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      });

      await expect(requestJson('/api/test')).rejects.toThrow(
        'Internal server error'
      );
    });

    it('should return status code when error parsing fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(requestJson('/api/test')).rejects.toThrow(
        'Request failed (500)'
      );
    });

    it('should return undefined for 204 No Content responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 204,
      });

      const result = await requestJson('/api/test');

      expect(result).toBeUndefined();
    });

    it('should handle URL object', async () => {
      const mockData = { id: 1 };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const url = new URL('https://example.com/api/test');
      await requestJson(url);

      expect(global.fetch).toHaveBeenCalledWith(url, undefined);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      (global.fetch as jest.Mock).mockRejectedValue(networkError);

      await expect(requestJson('/api/test')).rejects.toThrow('Network error');
    });
  });

  describe('requestNoContent', () => {
    it('should make successful no-content request', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 204,
      });

      await expect(requestNoContent('/api/test')).resolves.toBeUndefined();
      expect(global.fetch).toHaveBeenCalledWith('/api/test', undefined);
    });

    it('should pass request options to fetch', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 204,
      });

      const options = {
        method: 'DELETE',
      };

      await requestNoContent('/api/test', options);

      expect(global.fetch).toHaveBeenCalledWith('/api/test', options);
    });

    it('should throw error on failed response', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' }),
      });

      await expect(requestNoContent('/api/test')).rejects.toThrow('Unauthorized');
    });

    it('should handle error response with message field', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ message: 'Forbidden' }),
      });

      await expect(requestNoContent('/api/test')).rejects.toThrow('Forbidden');
    });

    it('should return status code when error parsing fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(requestNoContent('/api/test')).rejects.toThrow(
        'Request failed (500)'
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      (global.fetch as jest.Mock).mockRejectedValue(networkError);

      await expect(requestNoContent('/api/test')).rejects.toThrow('Network error');
    });
  });
});
