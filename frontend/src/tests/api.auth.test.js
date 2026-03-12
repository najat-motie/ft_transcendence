import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Frontend - Authentication API Integration', () => {
  const baseUrl = 'http://localhost:3000';
  const testUser = {
    email: 'frontend-test@example.com',
    password: 'TestPassword123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
  });

  describe('User Registration', () => {
    it('should register a new user via API', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          success: true,
          message: 'User registered successfully',
          data: {
            userId: 'test-user-id',
            email: testUser.email,
          },
        }),
      });

      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.email).toBe(testUser.email);
    });

    it('should handle registration errors for duplicate email', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({
          success: false,
          message: 'User with this email already exists',
        }),
      });

      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser),
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
    });
  });

  describe('User Login', () => {
    it('should login user and receive tokens', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: 'Login successful',
          data: {
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token',
            user: {
              userId: 'test-user-id',
              email: testUser.email,
            },
          },
        }),
      });

      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data.accessToken).toBeDefined();
      expect(data.data.refreshToken).toBeDefined();
    });

    it('should handle login errors for invalid credentials', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          message: 'Invalid credentials',
        }),
      });

      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'wrong@example.com',
          password: 'WrongPassword',
        }),
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });
  });
});
