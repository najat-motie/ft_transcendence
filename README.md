# ft_transcendence — Real-Time Tic-Tac-Toe Platform

Full-stack web app built for the 42 curriculum. It delivers multiplayer and solo Tic-Tac-Toe, account management, and a modern React UI backed by an Express API and PostgreSQL.

## Contents
- Overview
- Architecture
- Features
- Gameplay Modes
- Tech Stack
- Getting Started
- Environment Variables
- Useful Scripts
- API Surface (high level)
- Data Model (Prisma)
- Frontend Routes
- Development Notes
- Project Structure
- Contributors
- Notes & Next Steps

## Overview
- Multiplayer Tic-Tac-Toe with WebSocket-ready flow plus offline local and AI modes.
- Secure auth (JWT access/refresh), password reset, and 42 OAuth hook.
- Social layer: profiles, friend requests, friendships, and basic messaging.
- Responsive UI with sidebar navigation and protected routes.
- Containerized with Docker Compose for one-command setup.

## Architecture
- **frontend/**: React 19 + Vite. Routing via `react-router-dom`; protected routes gate game and social areas. Theme/settings persisted client-side.
- **backend/**: Express API with Prisma ORM. Authentication, profile, friends, and messaging endpoints. Rate limiting + Helmet + CORS.
- **database**: PostgreSQL managed via Prisma migrations/client.
- **realtime**: WebSocket service planned; client stubs exist for online rooms and matchmaking.
- **orchestration**: `docker-compose.yml` wires frontend (5173), backend (3000), and PostgreSQL (5432) on a shared bridge network.

## Features
- **Accounts**: Email/password sign-up & login, refresh tokens, logout, password reset, 42 OAuth callback route.
- **Profiles & KPIs**: Username/avatar/bio plus wins, losses, level, rank, win-rate, account age, presence status.
- **Friends**: Send/accept/reject requests, friendship creation with duplicate/loop protections, counts of pending requests and unread messages.
- **Messaging**: Basic send/read tracking via Prisma message model.
- **Security**: Helmet, CORS allowlist, rate limiting on auth routes, bcrypt password hashing, JWT secrets and expiries configurable via env.

## Gameplay Modes
- **Local**: Two players share the same device (no auth required).
- **AI**: Play versus an AI opponent locally.
- **Online (scaffolded)**: Protected route; UI and backend routes are prepared for WebSocket-powered remote play and matchmaking.

## Tech Stack
- Frontend: React 19, Vite 6, React Router 7, React Icons.
- Backend: Node.js 20+, Express 4, Prisma 5, bcrypt, JWT, express-validator, express-rate-limit, Helmet, CORS, passport-42.
- Database: PostgreSQL 14 (Docker image).
- Tooling: npm, Docker, Docker Compose, Makefile helpers.

## Getting Started
> Prereqs: Docker & Docker Compose installed. Node 20+ if running locally without containers.

Clone and enter the repo:
```bash
git clone <repo-url>
cd ft_transcendence2
```

### 1) Configure env
Copy `.env` (already provided) or edit the values. Key entries are detailed below.

### 2) Launch with Docker (recommended)
```bash
docker-compose up --build
```
- Frontend: http://localhost:5173  
- Backend API: http://localhost:3000  
- PostgreSQL: localhost:5432 (credentials from `.env`)

### 3) Local (without Docker)
- **Backend**
  ```bash
  cd backend
  npm install
  npx prisma generate
  npm run dev
  ```
- **Frontend**
  ```bash
  cd frontend
  npm install
  npm run dev -- --host
  ```

## Environment Variables
All live in root `.env` and are mounted into containers.

| Variable | Purpose | Default |
| --- | --- | --- |
| `NODE_ENV` | runtime mode | `development` |
| `PORT` | backend port | `3000` |
| `CORS_ORIGIN` | allowed frontend origin | `http://localhost:5173` |
| `POSTGRES_*` | DB credentials/host/port/name | `user/password/ft_transcendence/db/5432` |
| `DATABASE_URL` | Prisma connection string | matches above |
| `JWT_ACCESS_SECRET` | access token secret | change in prod |
| `JWT_REFRESH_SECRET` | refresh token secret | change in prod |
| `JWT_ACCESS_EXPIRY` | e.g. `15m` | `15m` |
| `JWT_REFRESH_EXPIRY` | e.g. `7d` | `7d` |
| `OAUTH_42_CLIENT_ID` / `OAUTH_42_CLIENT_SECRET` | 42 OAuth creds | required for 42 login |
| `OAUTH_42_CALLBACK_URL` | backend callback URL | `http://localhost:3000/api/auth/callback/42` |
| `VITE_API_BASE_URL` | frontend API base | `http://localhost:3000` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_USERNAME` | optional seed admin | `admin@admin.com` / `admin` / `admin` |

## Useful Scripts
- Root (Makefile shortcuts): `make up`, `make down`, `make dev`, `make logs`, `make shell-backend`, `make shell-db`, `make migrate`, `make migrate-dev`, `make migrate-reset`, `make db-seed`.
- Backend: `npm run dev` (nodemon), `npm start`, `npm run prisma:push`, `npm run prisma:studio`, `npm run seed:admin`.
- Frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`.

## API Surface (high level)
**Auth**  
- `POST /auth/register` — email + password signup with validation.  
- `POST /auth/login` — returns access and refresh tokens.  
- `POST /auth/logout` — blacklists current refresh token.  
- `POST /auth/refresh` — issues new access token if refresh token is valid.  
- `POST /auth/reset-password` — begin password reset; `POST /auth/reset-password/:token` — complete reset.  
- `GET /auth/42/callback` — 42 OAuth handoff.

**Profile** (all JWT protected)  
- `POST /profile` — create profile for current user.  
- `PUT /profile` — update username/avatar/bio.  
- `PATCH /profile/status` — update presence.  
- `POST /profile/stats` — update wins/losses/etc.  
- `GET /profile/:userId` — profile details.  
- `GET /profile/:userId/kpis` — computed stats (win rate, counts).  
- `GET /profile/leaderboard` — leaderboard listing.

**Friends** (JWT)  
- `POST /friends/request/:userId` — send request (self/duplicate guarded).  
- `POST /friends/accept/:requestId` — accept and create friendship.  
- `POST /friends/reject/:requestId` — reject request.  
- `GET /friends/requests` — list incoming/outgoing pending requests.  
- `GET /friends` — list friends.  
- `GET /friends/check/:userId` — check friendship status.  
- `DELETE /friends/:userId` — remove friendship.

**Users** (JWT)  
- `GET /users/search?q=term` — search available users (excluding existing friends and self).

## Data Model (Prisma)
- `User`: id, email, optional password, isActive, timestamps. Relations to tokens, profile, friend requests, friendships, messages, OAuth accounts.
- `UserProfile`: userId (unique), username, avatar, bio, level, experience, wins, losses, rank, status, lastSeen, timestamps.
- `FriendRequest`: senderId, receiverId, status (pending/accepted/rejected), optional message.
- `Friendship`: unordered pair (user1Id, user2Id) ensuring uniqueness.
- `Message`: senderId, receiverId, content, isRead, timestamps.
- `RefreshToken`: token string, userId, expiresAt.
- `ResetToken`: token string, userId, expiresAt (password reset).
- `OAuthAccount`: provider + accountId per user, stored data JSON string.

## Frontend Routes
- Public: `/` (Home), `/login`, `/register`, `/reset-password`, `/reset-password/:token`, `/privacy-policy`, `/terms-of-service`, `/play/local-game`, `/play/ai-game`.
- Protected: `/play/online-game`, `/settings`, `/profile`, `/friends`, `/change-password`.
- Game modes and lobby scaffolding: `/play/online-game`, `/play/local-game`, `/play/ai-game`, `/play/matchmaking`, `/play/create-room`, `/play/join-room`.

## Development Notes
- **Migrations**: use `make migrate-dev` (interactive) or `make migrate` (deploy existing). For quick sync, `make db-push`.
- **Seeding admin**: `npm run seed:admin` in `backend` (or `make db-seed`) creates/updates admin credentials from env.
- **Rate limits**: global limiter (100 req/15m) and stricter auth limiter (5 login/register attempts/15m, successful logins skip).
- **CORS**: `CORS_ORIGIN` controls allowed frontend origin; enable credentials.
- **Protected routes**: JWT access tokens expected in `Authorization: Bearer <token>`.
- **Passwords**: must be 8+ chars with upper, lower, and number (see validation middleware).
- **Building for production**: set strong JWT secrets, adjust `CORS_ORIGIN`, and supply real `OAUTH_42_*` values.

## Project Structure
```
ft_transcendence2
├─ backend/
│  ├─ src/
│  │  ├─ controllers/        # auth, profile, friend, user, password reset
│  │  ├─ routes/             # route definitions + validation
│  │  ├─ middleware/         # auth JWT guards, validation, rate limiters
│  │  ├─ services/           # tokens, OAuth, mail/reset helpers
│  │  ├─ config/             # Prisma client
│  │  └─ utils/              # shared helpers
│  ├─ prisma/schema.prisma   # PostgreSQL models
│  └─ scripts/create-admin.js
├─ frontend/
│  ├─ src/
│  │  ├─ pages/              # auth, profile, friends, privacy, game modes/rooms
│  │  ├─ layouts/            # sidebar shell + protected route guard
│  │  ├─ features/customize  # theme/settings management
│  │  ├─ services/           # API + socket stubs
│  │  └─ styles/             # game UI, layout, auth forms
├─ docker-compose.yml
├─ Makefile
└─ .env
```

## Contributors
- nmotie- — Frontend lead, routing/UI, meetings & planning (PM).
- fel-aziz — Backend lead, database/ORM, API design (Tech Lead).
- abattagi — Auth/OAuth, chat, product backlog (PO).
- jmayou — Game logic, WebSocket server, remote play.
- ien-niou — Realtime client features, customization, legal pages, containers, README.

## Notes & Next Steps
- Implement/enable the WebSocket gateway for online games and matchmaking.
- Add automated tests (unit + integration) for auth and friend flows.
- Harden production defaults: rotate JWT secrets, enable Helmet CSP, tighten CORS, and configure 42 OAuth values.
- Add CI checks (lint/test/build) and deployment pipeline.
