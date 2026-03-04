-- Empty all tables (PostgreSQL)
DELETE FROM "friendships";
DELETE FROM "friend_requests";
DELETE FROM "user_profiles";
DELETE FROM "users";
-- Add other tables if needed (e.g., refreshTokens, resetTokens, oauthAccounts, messages)
DELETE FROM "refreshTokens";
DELETE FROM "resetTokens";
DELETE FROM "oauthAccounts";
DELETE FROM "messages";
