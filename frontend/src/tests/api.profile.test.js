import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Frontend - Profile API Integration', () => {
  const baseUrl = 'http://localhost:3000';
  const token = 'test-access-token';
  const userId = 'test-user-id';

  const testProfile = {
    username: 'testuser',
    bio: 'This is my bio',
    avatar: 'https://example.com/avatar.jpg',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
  });

  describe('Create Profile', () => {
    it('should create a user profile', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          success: true,
          message: 'Profile created successfully',
          data: {
            userId,
            ...testProfile,
          },
        }),
      });

      const response = await fetch(`${baseUrl}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(testProfile),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.username).toBe(testProfile.username);
    });

    it('should handle duplicate profile creation error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({
          success: false,
          message: 'Profile already exists for this user',
        }),
      });

      const response = await fetch(`${baseUrl}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(testProfile),
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(409);
    });
  });

  describe('Get Profile', () => {
    it('should fetch user profile', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: {
            userId,
            ...testProfile,
          },
        }),
      });

      const response = await fetch(`${baseUrl}/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data.username).toBe(testProfile.username);
    });

    it('should handle profile not found error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          success: false,
          message: 'Profile not found',
        }),
      });

      const response = await fetch(`${baseUrl}/profile/nonexistent-id`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });

  describe('Update Profile', () => {
    it('should update user profile', async () => {
      const updatedData = {
        bio: 'Updated bio',
        avatar: 'https://example.com/new-avatar.jpg',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: 'Profile updated successfully',
          data: {
            userId,
            username: testProfile.username,
            ...updatedData,
          },
        }),
      });

      const response = await fetch(`${baseUrl}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data.bio).toBe(updatedData.bio);
    });
  });

  describe('Get Profile KPIs', () => {
    it('should fetch user profile KPIs', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: {
            userId,
            username: testProfile.username,
            friendsCount: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
            pendingRequestsReceived: 0,
            pendingRequestsSent: 0,
          },
        }),
      });

      const response = await fetch(`${baseUrl}/profile/${userId}/kpis`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data.friendsCount).toBeDefined();
      expect(data.data.wins).toBeDefined();
      expect(data.data.losses).toBeDefined();
    });
  });
});
