*This project has been created as part of the 42 curriculum by* **nmotie-**, **jmayou**, **abattagi**, **ien-niou**.

# ft_transcendence — Real-Time Multiplayer Tic-Tac-Toe Platform

## Table of Contents

- [Description](#description)
- [Presentation](#presentation)
- [Features List](#features-list)
- [Modules](#modules)
- [Technical Stack](#technical-stack)
- [Architecture Overview](#architecture-overview)
- [Database Schema](#database-schema)
- [Instructions](#instructions)
- [Project Management](#project-management)
- [Team Information](#team-information)
- [Individual Contributions](#individual-contributions)
- [Resources](#resources)

---

## Description

### Project Overview

**ft_transcendence** is a full-stack, real-time web application designed to deliver a modern and interactive Tic-Tac-Toe gaming platform.

The project integrates multiplayer gameplay, artificial intelligence, and social features within a secure and responsive web environment.

The goal is to design and implement a modular full-stack application, demonstrating proficiency in modern web development, real-time communication, authentication systems, and scalable software architecture.

The selected concept, a ***Real-Time Multiplayer Tic-Tac-Toe Platform***, provides a structured environment to explore client-server architecture, WebSocket-based communication, and interactive user experience design.

### Key Features

- Authentication System with OAuth (42 Intra)
- User Management (Profiles & Friend System)
- Real-Time Multiplayer (WebSocket-based synchronization)
- Remote Players (Real-time play across separate devices)
- Multiple Game Modes (Local, AI, Matchmaking, Private Rooms)
- Gamification System (XP and player statistics)
- Game Customization (Board styles, settings)
- Responsive & Accessible UI

---

## Presentation

To view the presentation:
- Open `presentation.html` in your browser

---

## Features List

| Feature                         | Team Members      | Description                                                         |
| ------------------------------- | ----------------- | ------------------------------------------------------------------- |
| Authentication System           | abattagi, nmotie- | JWT-based authentication with session handling and protected routes |
| OAuth 2.0 (42 Login)            | abattagi          | Login via 42 Intra using OAuth authorization and callback flow      |
| User Profiles                   | abattagi, nmotie- | User profile management with avatars and editable information       |
| Friends System                  | abattagi          | Friend request system with add, accept, reject, and status tracking |
| Real-Time Multiplayer           | jmayou, nmotie-   | WebSocket-based real-time gameplay synchronization between players  |
| Game Engine (Core Logic)        | jmayou            | Tic-Tac-Toe rules, turn handling, and win/draw detection            |
| Matchmaking System              | jmayou            | Automatic player pairing for online matches                         |
| AI Opponent                     | jmayou            | Single-player mode with AI opponent and difficulty logic            |
| Private Game Rooms              | jmayou            | Custom rooms with create, join, leave, and session management        |
| Local Game Mode                 | jmayou            | Offline two-player mode on the same device without authentication   |
| Game Customization              | ien-niou          | Themes, board styles, and X/O skins customization                   |
| Gamification System             | ien-niou          | XP progression system with wins, losses, matches, and win rate      |
| API Layer                       | nmotie-           | Centralized handling of frontend-backend communication              |
| UI/UX (Responsive & Accessible) | ien-niou, nmotie- | Responsive design and accessibility support across devices          |

---

## Modules

| Module                          | Points | Justification                                                | Implementation                                             | Team Members       |
| --------------------------------| ------ | -------------------------------------------------------------| ---------------------------------------------------------- | ------------------ |
| Frameworks (Frontend + Backend) | 2      | Required for full-stack SPA and API architecture             | React (Vite + Router) frontend + Express backend APIs      | nmotie-, abattagi  |
| User Management & Authentication| 2      | Core system for security and user identity                   | JWT auth, refresh tokens, profiles, friends system         | abattagi, nmotie-  |
| OAuth 2.0 (42 Login)            | 1      | Enables external authentication integration                  | 42 OAuth login + callback flow                             | abattagi           |
| ORM (Prisma)                    | 1      | Simplifies database access and schema management             | Prisma schema, migrations, DB queries                      | abattagi           |
| AI Opponent                     | 2      | Adds single-player gameplay experience                       | AI logic for Tic-Tac-Toe with balanced difficulty          | jmayou             |
| Web-Based Multiplayer Game      | 2      | Core playable game feature                                   | Game rules, win/draw detection, online matchmaking         | jmayou             |
| Real-Time Features (WebSockets) | 2      | Core requirement for real-time multiplayer gameplay          | WebSocket rooms, live game-state sync, disconnect handling | jmayou, nmotie-    |
| Remote players                  | 2      | Enable two players on different devices to play in real time | Sync, latency handling, reconnection system                | jmayou, nmotie-    |
| Game Customization              | 1      | Improves user experience and personalization                 | Themes, skins, sound settings, defaults                    | ien-niou           |
| Gamification System             | 1      | Increases engagement and progression                         | XP, wins/losses, matches, win rate                         | ien-niou           |

**FINAL SCORE CHECK**  
Major modules = 6 → 12 points  
Minor modules = 4 → 4 points  
Total = 16 points

---

## Technical Stack

### Frontend

The frontend is built using modern technologies to deliver a responsive and interactive user experience:

- **Vite** – Fast development server and optimized build tool
- **React** – Component-based architecture for building dynamic UI
- **React Router** – Client-side routing for SPA navigation
- **Tailwind CSS** – Utility-first CSS framework for fast UI development

### Backend

The backend handles business logic, authentication, and real-time communication:

- **Node.js** – JavaScript runtime for server-side development
- **Express.js** – Lightweight framework for REST APIs
- **WebSocket** – Real-time communication for gameplay features

**Authentication & Security:**
- **JWT** – Stateless authentication
- **bcrypt** – Secure password hashing
- **Passport.js** – OAuth integration (42 login)
- **Security middleware** – CORS, Helmet, rate limiting, input validation 
- **Protected routes** — Authentication enforced on both client and server

### Database

- **Prisma** – Type-safe ORM with migrations
- **PostgreSQL** – Reliable relational database

**Why PostgreSQL:**
- Strong support for relational data and complex queries
- High reliability and performance
- Well-suited for users, matches, and game statistics

### Infrastructure

- **Git** – Version control
- **Caddy** – Reverse proxy with automatic HTTPS
- **Makefile** – Automates setup, build, and run commands
- **Docker** – Consistent environment across development and deployment
- **Docker Compose** – Manages multi-container services
- **Environment variables (.env)** – Secure configuration management

### Technical Choices & Justification

- **React + Vite** – Fast development and optimized frontend performance
- **Node.js + Express** – Unified JavaScript stack for scalability and maintainability
- **WebSocket** – Required for real-time multiplayer gameplay
- **PostgreSQL** – Reliable relational database for structured and complex data

---

## Architecture Overview

```
            ┌───────────────────────┐
            │        Browser        │
            │       (Client)        │
            └──────────┬────────────┘
                       │ HTTPS
                       ▼
        ┌──────────────────────────────┐
        │        Reverse Proxy         │
        │                              │
        │           Caddy              │
        │      (Routing + HTTPS)       │
        └──────────────┬───────────────┘
                         │
         ┌───────────────┴──────────────┐
         │                              │
         ▼                              ▼
┌──────────────────────┐     ┌──────────────────────┐
│       Frontend       │     │        Backend       │
│                      │     │                      │
│  React + Vite        │     │  Node.js + Express   │
│  + Tailwind          │     │                      │
│                      │     │  - REST API          │
│                      │     │  - Auth (JWT/OAuth)  │
│                      │     │  - WebSocket Server  │
└──────────────────────┘     └──────────┬───────────┘
                                        │
                                        ▼
                          ┌────────────────────────┐
                          │        Database        │
                          │                        │
                          │      PostgreSQL        │
                          │      (via Prisma)      │
                          └────────────────────────┘
```

---

## Database Schema

### Entity Relationship Diagram

```
┌───────────────────────────────────────────────────────────┐
│                           User                            │
├───────────────────────────────────────────────────────────┤
│ • id (UUID, PK)                                           │
│ • email (String, unique)                                  │
│ • password (String, optional - null for OAuth users)      │
│ • isActive (Boolean)                                      │
│ • createdAt (DateTime)                                    │
│ • updatedAt (DateTime)                                    │
└─────────────────────────────┬─────────────────────────────┘
                    (1 to 1)  │
                              │
    ┌───────────────────────▼─────────────────────────┐
    │                   UserProfile                   │
    ├─────────────────────────────────────────────────┤
    │ • userId (UUID, PK, FK)                         │
    │ • username (String, unique)                     │
    │ • avatar (String, optional URL)                 │
    │ • bio (String, optional)                        │
    │ • level (Int, default 1)                        │
    │ • experience (Int, default 0)                   │
    │ • wins (Int, default 0)                         │
    │ • losses (Int, default 0)                       │
    │ • rank (Int, optional)                          │
    │ • status (String: online/offline/away)          │
    │ • lastSeen (DateTime)                           │
    │ • createdAt (DateTime)                          │
    │ • updatedAt (DateTime)                          │
    └──────────┬──────────────────────────────────────┘
               │ (1 to Many)
               │
    ┌──────────┴──────────────────────────────┐
    │                                         │
    │                        ┌────────────────▼─────────────┐
    │                        │       FriendRequest          │
    │                        ├──────────────────────────────┤
    │                        │ • id (UUID, PK)              │
    │                        │ • senderId (UUID, FK)        │
    │                        │ • receiverId (UUID, FK)      │
    │                        │ • status (pending/accepted)  │
    │                        │ • message (String, optional) │
    │                        │ • createdAt (DateTime)       │
    │                        │ • updatedAt (DateTime)       │
    │                        └──────────────────────────────┘
    │
    │  ┌─────────────────────────────────────────────┐
    │  │          Friendship                         │
    │  ├─────────────────────────────────────────────┤
    │  │ • id (UUID, PK)                             │
    │  │ • user1Id (UUID, FK)                        │
    │  │ • user2Id (UUID, FK)                        │
    │  │ • createdAt (DateTime)                      │
    │  │ • updatedAt (DateTime)                      │
    │  │ (Unique constraint on unordered pair)       │
    │  └─────────────────────────────────────────────┘
    │
    │  ┌─────────────────────────────────────────────┐
    │  │       RefreshToken                          │
    │  ├─────────────────────────────────────────────┤
    │  │ • id (UUID, PK)                             │
    │  │ • token (String, unique)                    │
    │  │ • userId (UUID, FK)                         │
    │  │ • expiresAt (DateTime)                      │
    │  │ • createdAt (DateTime)                      │
    │  └─────────────────────────────────────────────┘
    │
    │  ┌─────────────────────────────────────────────┐
    │  │       ResetToken                            │
    │  ├─────────────────────────────────────────────┤
    │  │ • id (UUID, PK)                             │
    │  │ • token (String, unique)                    │
    │  │ • userId (UUID, FK)                         │
    │  │ • expiresAt (DateTime)                      │
    │  │ • createdAt (DateTime)                      │
    │  └─────────────────────────────────────────────┘
    │
    │  ┌─────────────────────────────────────────────┐
    │  │       OAuthAccount                          │
    │  ├─────────────────────────────────────────────┤
    │  │ • id (UUID, PK)                             │
    │  │ • userId (UUID, FK)                         │
    │  │ • provider (String: "42", "google", etc)    │
    │  │ • accountId (String)                        │
    │  │ • data (JSON string, optional)              │
    │  │ • createdAt (DateTime)                      │
    │  └─────────────────────────────────────────────┘

```

### Key Constraints

* User email is globally unique (prevents duplicate accounts)
* UserProfile username is globally unique (prevents duplicate usernames)
* Friendship uses a composite unique constraint to avoid duplicate relationships
* FriendRequest prevents duplicate pending requests and invalid self-interactions
* All foreign keys enforce referential integrity

---

## Instructions

### Prerequisites

Make sure you have the following tools installed:

- [Git](https://git-scm.com/downloads)  
- [Docker](https://www.docker.com/get-started/)
- [Docker Compose](https://docs.docker.com/compose/)  
- [Node.js](https://nodejs.org/) (v18+ recommended)  
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)  

### Setup
```bash
git clone <repository_url>
cd ft_transcendence
```

### Configure environment variables
```bash
cp ./infra/.env.example .env
```

### Run the application
```bash
docker compose up --build
```
Or using available makefile commands, run:
```bash
make help
```

### After the application starts:
Open your browser and go to https://localhost.

---

## Project Management

### Work Organization

Our team followed a structured and collaborative workflow to ensure efficient development:

* Tasks were divided into small, manageable units and assigned based on each member’s strengths
* We used a feature-based approach, where each developer worked on specific modules (frontend, backend, game logic)
* Regular progress tracking helped ensure alignment with deadlines
* Code reviews were performed before merging to maintain code quality

### Project Management Tools

We used the following tools to organize and track our work:

- **Git** – Version control and collaboration through branches
- **GitHub Issues** – Task management, bug tracking, and feature assignment

### Communication

To stay connected and collaborate effectively, we used:

- **Discord** – Main platform for daily communication, discussions, and coordination
- Regular remote and in-person (local) stand-up meetings to discuss progress, blockers, and next steps

---

## Team Information

### abattagi

**Assigned roles**:
> Product Owner + Developer

**PO Responsibilities**:

Defines product vision, manages backlog, validates features.

### nmotie-

**Assigned role(s)**:
> Project Manager / Scrum Master + Developer

**PM Responsibilities**:

Organizes planning, tracks progress, ensures communication and deadlines.

### ien-niou

**Assigned role(s)**:
> Technical Lead / Architect + Developer

**Tech Lead Responsibilities**:

Defines architecture, ensures code quality, reviews implementations.

### jmayou

**Assigned role(s)**:
> Developer

**Responsibilities**

Implements features and collaborates on gameplay systems.

---

## Individual Contributions

### abattagi

**Contributions**:
- Backend API architecture
- Database design (Prisma)
- Authentication and 42 OAuth integration
- User and friends management system
- Browser Compatibility

**Technical Details**:
- Designed RESTful APIs using Express
- Modeled database schema and relationships using Prisma ORM
- Implemented JWT authentication with refresh token flow
- Integrated 42 OAuth using authorization and callback routes
- Developed user profile management (profile data, avatars)
- Built a friend system with a complete request lifecycle (send, accept, reject)
- Ensured compatibility with the latest stable version of Google Chrome, with no console warnings or errors

**Challenges & Solutions**:
- *Challenge*: Designing a database that handles users, friends, OAuth, and game data without becoming too complex.
  *Solution*:  Structured the schema with clear relationships using Prisma, added proper constraints (unique keys, foreign keys),
               and kept things modular so it stays easy to maintain and extend.

### nmotie-

**Contributions**:
- Frontend architecture using React
- Form validation and input handling
- API integration (REST requests)
- WebSocket client integration
- README documentation

**Technical Details**:
- Structured the frontend using reusable React components and routing (React Router)
- Implemented controlled forms with validation logic
- Integrated backend APIs using a centralized request utility
- Connected WebSocket client to handle real-time updates in UI
- Wrote and organized the README file

**Challenges & Solutions**:
- *Challenge*: Handling session expiration without breaking the user experience or requiring manual re-login on every token expiry.  
  *Solution*: Introduced an automatic token refresh mechanism using the refresh token, with fallback to logout and redirect only when refresh fails.

### ien-niou

**Contributions**:
- UI styling (Tailwind CSS)
- Game customization features
- Application state (user data, authentication tokens, loading states)
- Error handling using Error Boundaries
- Privacy and legal pages
- Infrastructure setup (Docker, environment config)

**Technical Details**:
- Built responsive UI using Tailwind CSS utility classes
- Implemented customization features (skins, audio)
- Managed UI state (authentication, loading, error states) for a smoother user experience
- Improved application stability through proper error handling and fallback UI
- Implemented privacy policy and terms of service pages
- Configured Docker environment and reverse proxy setup, with Makefile automation for streamlined project management

**Challenges & Solutions**:

Challenge:
Keeping the app stable when errors happen.

Solution:
Used Error Boundaries to catch errors and show a simple fallback screen instead of crashing the whole app.

### jmayou

**Contributions:**
- Core game logic implementation (Tic-Tac-Toe engine)
- Offline game mode
- Online (remote) multiplayer using WebSockets
- AI opponent (Q-learning + Minimax fallback)
- Move validation and turn management system

---

**Technical Details:**
- Designed and implemented a reusable game engine (`TicTacToeGame`) handling board state, player turns, and game status
- Implemented win detection (rows, columns, diagonals) and draw logic
- Built REST endpoints for offline gameplay
- Developed real-time multiplayer using WebSockets with synchronized game state
- Managed active game sessions and player connections using in-memory structures
- Enforced strict validation for each move (turn checking, cell availability, game status)
- Implemented AI decision system:
  - Q-learning model for fast predictions
  - Minimax algorithm as a fallback for optimal moves
  - Safe fallback to available actions to ensure valid gameplay
- Ensured consistent game flow across all modes (offline, online, AI)

---

**Challenges & Solutions:**

- *Challenge:* Maintaining a consistent and valid game state across multiple modes (offline, online, AI)  
  *Solution:* Centralized all game rules inside a single game engine and reused it across all modes to ensure consistency and avoid duplicated logic  

- *Challenge:* Handling real-time synchronization between remote players  
  *Solution:* Used WebSockets with controlled message flow and validation to ensure correct turn order and prevent conflicts  

- *Challenge:* Balancing AI performance and correctness  
  *Solution:* Combined a trained Q-learning model with a Minimax fallback to achieve both fast and reliable decision-making  

---

## Resources

### Documentation & References
- **Vite**: https://vitejs.dev
- **React**: https://react.dev
- **React Router**: https://reactrouter.com
- **Express.js**: https://expressjs.com
- **Prisma ORM**: https://www.prisma.io/docs
- **PostgreSQL**: https://www.postgresql.org/docs
- **JWT Authentication**: https://jwt.io
- **OAuth 2.0**: https://oauth.net/2
- **Docker**: https://docs.docker.com
- **WebSockets**: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

### Use of AI Tools

AI tools were used as a development assistant for:

* Debugging and understanding errors
* Generating ideas for testing scenarios
* Suggesting code structure improvements and best practices
* Writing and improving documentation (README)
* Design assistance for project branding (logo and favicon generation)
