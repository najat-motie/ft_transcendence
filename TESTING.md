# Testing Documentation

This document outlines the complete testing infrastructure for the Tic Tac Toe Platform.

## Backend Tests

The backend uses **Jest** as the testing framework with **supertest** for API endpoint testing.

### Setup

To run tests, first install dependencies (if not already done):

```bash
cd backend
npm install
```

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Generate coverage report:**
```bash
npm run test:coverage
```

### Test Files

#### 1. **Authentication Tests** (`tests/auth.test.js`)
Tests the user authentication system:
- ✅ User Registration
  - Successful registration
  - Duplicate email handling
  - Missing required fields
  
- ✅ User Login
  - Successful login with tokens
  - Invalid email handling
  - Invalid password handling

**Endpoints tested:**
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get tokens

#### 2. **Profile Tests** (`tests/profile.test.js`)
Tests user profile management:
- ✅ Create Profile
  - Successful profile creation
  - Duplicate profile prevention
  - Authentication requirement
  - Duplicate username handling
  
- ✅ Get Profile
  - Fetch existing profile
  - Handle non-existent profile
  
- ✅ Update Profile
  - Update bio and avatar
  
- ✅ Profile KPIs
  - Fetch performance metrics (wins, losses, friends count, etc.)

**Endpoints tested:**
- `POST /profile` - Create a new profile
- `GET /profile/:userId` - Get user profile
- `PUT /profile` - Update user profile
- `GET /profile/:userId/kpis` - Get profile KPIs

#### 3. **Friendship Tests** (`tests/friendship.test.js`)
Tests the complete friendship system:
- ✅ Send Friend Request
  - Successful request sending
  - Self-request prevention
  - Duplicate request prevention
  
- ✅ Get Friend Requests
  - Fetch pending requests
  
- ✅ Accept Friend Request
  - Accept pending request
  - Handle non-existent request
  
- ✅ Get Friends List
  - Fetch friends with pagination
  
- ✅ Check Friendship Status
  - Verify if users are friends
  
- ✅ Remove Friend
  - Delete a friend
  
- ✅ Reject Friend Request
  - Reject pending request

**Endpoints tested:**
- `POST /friends/request/:userId` - Send friend request
- `GET /friends/requests` - Get pending requests
- `POST /friends/accept/:requestId` - Accept request
- `GET /friends` - Get friends list
- `GET /friends/check/:userId` - Check friendship
- `DELETE /friends/:userId` - Remove friend
- `POST /friends/reject/:requestId` - Reject request

#### 4. **User Search Tests** (`tests/user.test.js`)
Tests user search functionality:
- ✅ Search by Username
  - Find users by username
  
- ✅ Search by Email
  - Find users by email
  
- ✅ Error Handling
  - Missing query parameter
  - Missing authentication token
  - Empty search results

**Endpoints tested:**
- `GET /users/search?q=query` - Search users

---

## Frontend Tests

The frontend uses **Vitest** as the testing framework with **React Testing Library** for component testing.

### Setup

To run frontend tests, install dependencies:

```bash
cd frontend
npm install
```

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run tests with UI:**
```bash
npm run test:ui
```

**Generate coverage report:**
```bash
npm run test:coverage
```

### Test Files

#### 1. **Authentication API Integration Tests** (`src/tests/api.auth.test.js`)
Tests authentication API calls from the frontend:
- ✅ User Registration
  - Mock successful registration
  - Mock duplicate email error
  
- ✅ User Login
  - Mock successful login with tokens
  - Mock invalid credentials error

#### 2. **Profile API Integration Tests** (`src/tests/api.profile.test.js`)
Tests profile API calls:
- ✅ Create Profile
  - Mock successful creation
  - Mock duplicate profile error
  
- ✅ Get Profile
  - Mock fetching profile
  - Mock profile not found
  
- ✅ Update Profile
  - Mock profile update
  
- ✅ Profile KPIs
  - Mock KPI fetch with all metrics

#### 3. **Friendship API Integration Tests** (`src/tests/api.friendship.test.js`)
Tests friendship system API calls:
- ✅ Send Friend Request
  - Mock successful request
  - Mock self-request error
  
- ✅ Get Friend Requests
  - Mock pending requests fetch
  
- ✅ Accept Friend Request
  - Mock successful acceptance
  
- ✅ Get Friends List
  - Mock friends list with pagination
  
- ✅ Check Friendship Status
  - Mock friendship status check
  
- ✅ Remove Friend
  - Mock friend removal
  
- ✅ Reject Friend Request
  - Mock request rejection

#### 4. **User Search API Integration Tests** (`src/tests/api.user.test.js`)
Tests user search API calls:
- ✅ Search by Username
  - Mock username search
  
- ✅ Search by Email
  - Mock email search
  
- ✅ Error Handling
  - Mock missing query error
  - Mock missing auth error
  - Mock empty results

---

## HTTP API Tests

The `api-test.http` file in the backend folder contains manual REST API tests that can be run with REST Client extensions (like Thunder Client or REST Client for VS Code).

### Using `api-test.http`

1. **Install REST Client Extension**
   - For VS Code: Install "REST Client" extension

2. **Run Tests**
   - Open `backend/api-test.http`
   - Click "Send Request" above each test block
   - Follow the ordered steps (1-19) for complete flow

3. **Test Flow**
   - Register Alice
   - Register Bob
   - Create profiles
   - Search users
   - Send friend requests
   - Accept/reject requests
   - Manage friends list
   - Test error cases

### Variables to Track

As you run tests, save these variables in the HTTP file header:
- `@aliceAccessToken` - Alice's JWT token
- `@aliceUserId` - Alice's user ID
- `@bobAccessToken` - Bob's JWT token
- `@bobUserId` - Bob's user ID
- `@friendRequestId` - Friend request ID

---

## Test Coverage Strategy

### Backend Test Coverage
- **Authentication**: Login/Register flows
- **Profiles**: CRUD operations
- **Friendships**: Complete lifecycle (request → accept/reject → remove)
- **Search**: Username and email search
- **Error Handling**: 400, 401, 404, 409 status codes
- **Authorization**: Token validation

### Frontend Test Coverage
- **API Mocking**: All fetch calls are mocked
- **Response Handling**: Success and error scenarios
- **Pagination**: List endpoints with offset/limit
- **Authentication**: Token-based requests
- **Error States**: Network and validation errors

---

## Continuous Integration

### Pre-requisites

1. **Database**: Ensure PostgreSQL/Prisma is configured
2. **Environment**: Set `NODE_ENV=test` for tests
3. **Ports**: Backend tests run on in-memory/test DB

### Running Full Test Suite

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## Troubleshooting

### Backend Tests Fail
1. **Check database connection**: Ensure Prisma migrations are run
2. **Clear test data**: Tests clean up automatically, but check for orphaned records
3. **Port conflicts**: Make sure port 3000 is available

### Frontend Tests Fail
1. **Missing dependencies**: Run `npm install` in frontend folder
2. **Vitest issues**: Update vitest with `npm install --save-dev vitest@latest`
3. **Mock issues**: Check that fetch is properly mocked in setup.js

---

## Adding New Tests

### Backend Tests
1. Create a new test file in `backend/tests/`
2. Import `app` from `../src/server.js`
3. Use supertest for API calls
4. Clean up test data in `afterAll` hook

Example:
```javascript
const request = require('supertest');
const app = require('../src/server');

describe('New Feature', () => {
  it('should work correctly', async () => {
    const response = await request(app)
      .post('/endpoint')
      .send({ data: 'test' });
    expect(response.status).toBe(200);
  });
});
```

### Frontend Tests
1. Create a new test file in `src/tests/`
2. Use `vitest` and mock fetch
3. Test API calls, not components

Example:
```javascript
import { describe, it, expect, vi } from 'vitest';

describe('Feature', () => {
  it('should call API correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    const response = await fetch('/endpoint');
    expect(response.ok).toBe(true);
  });
});
```

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
