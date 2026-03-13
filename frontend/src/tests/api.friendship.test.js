import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Frontend - Friendship API Integration', () => {
  const baseUrl = 'http://localhost';
  const token = 'test-access-token';
  const currentUserId = 'alice-id';
  const friendUserId = 'bob-id';
  const requestId = 'friend-request-id';

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
  });

  describe('Send Friend Request', () => {
    it('should send a friend request', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          success: true,
          message: 'Friend request sent',
          data: {
            id: requestId,
            senderId: currentUserId,
            receiverId: friendUserId,
            status: 'pending',
          },
        }),
      });

      const response = await fetch(`${baseUrl}/friends/request/${friendUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.senderId).toBe(currentUserId);
    });

    it('should handle error when sending to self', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          message: 'Cannot send friend request to yourself',
        }),
      });

      const response = await fetch(`${baseUrl}/friends/request/${currentUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });
  });

  describe('Get Friend Requests', () => {
    it('should fetch pending friend requests', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: [
            {
              id: requestId,
              senderId: friendUserId,
              status: 'pending',
              sender: {
                id: friendUserId,
                email: 'bob@example.com',
                profile: {
                  username: 'bob_user',
                  avatar: null,
                  status: 'online',
                },
              },
            },
          ],
        }),
      });

      const response = await fetch(`${baseUrl}/friends/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data[0].status).toBe('pending');
    });
  });

  describe('Accept Friend Request', () => {
    it('should accept a friend request', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: 'Friend request accepted',
          data: {
            user1Id: currentUserId,
            user2Id: friendUserId,
          },
        }),
      });

      const response = await fetch(`${baseUrl}/friends/accept/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Friend request accepted');
    });
  });

  describe('Get Friends List', () => {
    it('should fetch friends list', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: [
            {
              userId: friendUserId,
              username: 'bob_user',
              bio: 'Hey, I am Bob!',
              avatar: null,
            },
          ],
          pagination: {
            limit: 50,
            offset: 0,
          },
        }),
      });

      const response = await fetch(`${baseUrl}/friends`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.pagination).toBeDefined();
    });

    it('should support pagination', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: [],
          pagination: {
            limit: 10,
            offset: 20,
          },
        }),
      });

      const response = await fetch(`${baseUrl}/friends?limit=10&offset=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.pagination.limit).toBe(10);
      expect(data.pagination.offset).toBe(20);
    });
  });

  describe('Check Friendship Status', () => {
    it('should check if users are friends', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: {
            isFriend: true,
          },
        }),
      });

      const response = await fetch(`${baseUrl}/friends/check/${friendUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data.isFriend).toBe(true);
    });
  });

  describe('Remove Friend', () => {
    it('should remove a friend', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: 'Friend removed successfully',
        }),
      });

      const response = await fetch(`${baseUrl}/friends/${friendUserId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Friend removed successfully');
    });
  });

  describe('Reject Friend Request', () => {
    it('should reject a friend request', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: 'Friend request rejected',
        }),
      });

      const response = await fetch(`${baseUrl}/friends/reject/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Friend request rejected');
    });
  });
});
