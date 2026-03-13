import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Frontend - User Search API Integration', () => {
  const baseUrl = 'http://localhost';
  const token = 'test-access-token';

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
  });

  describe('Search Users', () => {
    it('should search for users by username', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: {
            users: [
              {
                userId: 'user-id-1',
                username: 'bob_user',
                bio: 'Hey, I am Bob!',
                email: 'bob@example.com',
              },
            ],
          },
        }),
      });

      const response = await fetch(`${baseUrl}/users/search?q=bob`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.users)).toBe(true);
      expect(data.data.users[0].username).toContain('bob');
    });

    it('should search for users by email', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: {
            users: [
              {
                userId: 'user-id-1',
                username: 'bob_user',
                email: 'bob@example.com',
              },
            ],
          },
        }),
      });

      const response = await fetch(
        `${baseUrl}/users/search?q=bob@example.com`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.data.users[0].email).toBe('bob@example.com');
    });

    it('should handle missing search query', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          message: 'Query is required',
        }),
      });

      const response = await fetch(`${baseUrl}/users/search`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should handle missing authentication token', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          message: 'Unauthorized',
        }),
      });

      const response = await fetch(`${baseUrl}/users/search?q=bob`);

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });

    it('should return empty results for non-matching query', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: {
            users: [],
          },
        }),
      });

      const response = await fetch(
        `${baseUrl}/users/search?q=nonexistentuser12345`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.data.users.length).toBe(0);
    });
  });
});
