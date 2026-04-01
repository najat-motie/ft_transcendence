*This project has been created as part of the 42 curriculum by* <mark>nmotie-<mark>, <mark>jmayou<mark>, <mark>abattagi<mark>, <mark>ien-niou<mark>

# ft_transcendence — Real-Time Tic-Tac-Toe Platform

## Table of Contents

- [Description](#description)
- [Instructions](#instructions)
- [Resources](#resources)
- [Team Information](#team-information)
- [Project Management](#project-management)
- [Technical Stack](#technical-stack)
- [Database Schema](#database-schema)
- [Features Overview](#features-overview)
- [Modules](#modules)
- [Individual Contributions](#individual-contributions)

---

## Description

**ft_transcendence** is a full-stack, real-time web application designed to deliver a modern and interactive Tic-Tac-Toe gaming platform.

The project integrates multiplayer gameplay, artificial intelligence, and social features within a secure and responsive web environment.

The objective is to design and implement a modular full-stack application, demonstrating proficiency in modern web development, real-time communication, authentication systems, and scalable software architecture.

The selected concept, a ***Real-Time Tic-Tac-Toe Platform***, provides a structured environment to explore client-server architecture, WebSocket-based communication, and interactive user experience design.

## Key Features

- ***Authentication System***: Secure JWT-based authentication with email and password.
- ***OAuth Integration***: Third-party authentication using 42 OAuth 2.0.
- ***User Management System***: User profiles, friend relationships, and social interaction features.
- ***Multiplayer System***: Real-time matchmaking, private game rooms, and local multiplayer mode.
- ***AI Opponent***: Single-player mode with adaptive, human-like AI behavior.
- ***Real-Time Communication***: WebSocket-based synchronization for live gameplay.
- ***Game Customization***: Custom themes, board styles, and audio settings.
- ***Gamification System***: Experience points, achievements, and progression system.
- ***Responsive User Interface***: Adaptive design across devices with protected routes for authenticated users.
- ***Legal & Privacy Compliance***: Privacy policy and terms of service pages.

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
cp .env.example .env
```

### Run the application
```bash
docker-compose up --build
```
Or using available makefile commands, run:
```bash
make help
```

### After the application starts:
Open your browser and go to https://localhost.

---

## Resources

### Documentation & References
- **React**: https://react.dev
- **React Router**: https://reactrouter.com
- **Vite**: https://vitejs.dev
- **Express.js**: https://expressjs.com
- **Prisma ORM**: https://www.prisma.io/docs
- **PostgreSQL**: https://www.postgresql.org/docs
- **JWT Authentication**: https://jwt.io
- **OAuth 2.0**: https://oauth.net/2
- **WebSockets**: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- **Docker**: https://docs.docker.com

### Use of AI Tools

AI tools were used as a development assistant for:

* Debugging and understanding errors
* Suggesting code structure improvements and best practices
* Writing and improving documentation (README)
* Generating ideas for testing scenarios
* Design assistance for project branding (logo and favicon generation)

⚠️ AI was not used to generate core application logic or replace development work

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

**Teach Lead Responsibilities**:

Defines architecture, ensures code quality, reviews implementations.

### jmayou

**Assigned role(s)**:
> Developer

**Responsibilities**

Implements features and collaborates on gameplay systems.

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

## Technical Stack

### Frontend

The frontend was built using modern technologies to ensure a responsive and interactive user experience:

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
- Security middleware (CORS, Helmet, rate limiting, validation)

- **Passport.js** – OAuth integration (42 login)

### Database

- **Prisma** – Type-safe ORM with migrations
- **PostgreSQL** – Relational database for structured data

**Why PostgreSQL:**
- Strong support for relational data and complex queries
- High reliability and performance
- Well-suited for users, matches, and game statistics

### Infrastructure

- **Git** – Version control system
- **Docker** – Consistent development and deployment environment
- **Caddy** – Reverse proxy with automatic HTTPS
- **Makefile** – Project automation (setup, build, run)
- **Environment variables (.env)** – Secure configuration management

### Technical Choices & Justification

- **React + Vite** – Fast development and optimized frontend performance
- **Node.js + Express** – Unified JavaScript stack for scalability
- **WebSocket** – Required for real-time multiplayer gameplay
- **PostgreSQL** – Reliable relational database for structured data

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                           User                              │
├─────────────────────────────────────────────────────────────┤
│ • id (UUID, PK)                                             │
│ • email (String, unique)                                    │
│ • password (String, optional - null for OAuth users)        │
│ • isActive (Boolean)                                        │
│ • createdAt (DateTime)                                      │
│ • updatedAt (DateTime)                                      │
└─────────────────────────────┬───────────────────────────────┘
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
      └────────┬────────────────────────────────────────┘
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
    │  │           Message                           │
    │  ├─────────────────────────────────────────────┤
    │  │ • id (UUID, PK)                             │
    │  │ • senderId (UUID, FK)                       │
    │  │ • receiverId (UUID, FK)                     │
    │  │ • content (String)                          │
    │  │ • isRead (Boolean, default false)           │
    │  │ • createdAt (DateTime)                      │
    │  │ • updatedAt (DateTime)                      │
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
* FriendRequest prevents duplicate pending requests
* Friendship uses a composite unique constraint to avoid duplicate relationships
* Message and FriendRequest prevent invalid self-interactions
* All foreign keys enforce referential integrity

---

## Features List

### Features & Team Contributions

| Feature | Team Members | Contribution |
|--------|--------------|--------------|
| Authentication System | abattagi, nmotie- | abattagi: backend (JWT, tokens) • nmotie-: frontend forms & integration |
| OAuth 2.0 (42 Login) | abattagi | abattagi: OAuth flow and callback implementation |
| User Profiles | abattagi, nmotie- | abattagi: API & database • nmotie-: UI display and editing |
| Friends System | abattagi | abattagi: friend requests, relationships, and status logic |
| API Integration | nmotie- | nmotie-: centralized request handling and API connection |
| Database Management | abattagi | abattagi: schema design, Prisma, and migrations |
| Tic-Tac-Toe Game Logic | jmayou | jmayou: core game rules and state transitions |
| AI Opponent | jmayou | jmayou: AI logic and behavior balancing |
| Multiplayer Matchmaking | jmayou | jmayou: player matching and session management |
| Private Game Rooms | jmayou | jmayou: room creation and join system |
| Real-Time Gameplay | jmayou, nmotie- | jmayou: server-side logic • nmotie-: client-side state handling |
| WebSocket Connection Handling | jmayou, nmotie- | jmayou: server events • nmotie-: client synchronization |
| Game Customization | ien-niou | ien-niou: state logic and UI controls |
| Gamification System | abattagi, ien-niou | abattagi: backend stats • ien-niou: frontend display |
| Responsive UI | ien-niou | ien-niou: layout, responsiveness, and styling |
| Privacy & Legal Compliance | ien-niou | ien-niou: privacy policy and terms of service |

### Feature Descriptions

- **Authentication System**: JWT-based authentication with protected routes
- **OAuth 2.0 (42 Login)**: External authentication via 42 Intra with callback flow
- **User Profiles**: User accounts with avatars, stats, and personal information
- **Friends System**: Send, accept, reject, and manage friend requests with online status
- **Real-Time Gameplay**: Live game updates between players using WebSockets
- **Multiplayer Matchmaking**: Connects players automatically for online matches
- **Private Game Rooms**:  Allows users to create/join custom game sessions
- **Tic-Tac-Toe Game Logic**: Handles rules, turns, and win/draw conditions
- **AI Opponent**: Competitive AI with human-like behavior
- **Game Customization**: Themes, board styles, X/O skins, and sound settings
- **Gamification System**: XP, levels, rankings, and match statistics
- **WebSocket Connection Handling**: Handles connection, disconnection, and reconnection
- **API Integration**: Frontend communication with backend services
- **Database Management**: Schema, migrations, and data handling with ORM
- **Responsive UI**: Mobile-friendly interface with adaptive layout
- **Privacy & Legal Compliance**: Providing users with clear information about data usage, user rights, and platform terms

---

## Modules

| Module                          | Points | Justification                                       | Implementation                                             | Team Members       |
| --------------------------------| ------ | --------------------------------------------------- | ---------------------------------------------------------- | ------------------ |
| Frameworks (Frontend + Backend) | 2      | Required for full-stack SPA and API architecture    | React (Vite + Router) frontend + Express backend APIs      | nmotie-, abattagi  |
| User Management & Authentication| 2      | Core system for security and user identity          | JWT auth, refresh tokens, profiles, friends system         | abattagi, nmotie-  |
| OAuth 2.0 (42 Login)            | 1      | Enables external authentication integration         | 42 OAuth login + callback flow                             | abattagi           |
| ORM (Prisma)                    | 1      | Simplifies database access and schema management    | Prisma schema, migrations, DB queries                      | abattagi           |
| AI Opponent                     | 2      | Adds single-player gameplay experience              | AI logic for Tic-Tac-Toe with balanced difficulty          | jmayou             |
| Web-Based Multiplayer Game      | 2      | Core playable game feature                          | Game rules, win/draw detection, online matchmaking         | jmayou             |
| Real-Time Features (WebSockets) | 2      | Core requirement for real-time multiplayer gameplay | WebSocket rooms, live game-state sync, disconnect handling | jmayou, nmotie-    |
| Remote Multiplayer System       | 2      | Enables real-time cross-device gameplay             | Sync, latency handling, reconnection system                | jmayou, nmotie-    |
| Game Customization              | 1      | Improves user experience and personalization        | Themes, skins, sound settings, defaults                    | ien-niou           |
| Gamification System             | 1      | Increases engagement and progression                | XP, wins/losses, leaderboard stats                         | abattagi, ien-niou |

**✔ FINAL SCORE CHECK**  
Major modules = 6 → 12 points  
Minor modules = 4 → 4 points  
👉 Total = 16 points  

---

## Individual Contributions

### abattagi

**Contributions**:
- Backend API architecture
- Database design (Prisma)
- Authentication and 42 OAuth integration
- User and friends management system

**Technical Details**:
- Designed RESTful APIs using Express
- Modeled database schema and relationships using Prisma ORM
- Implemented JWT authentication with refresh token flow
- Integrated 42 OAuth using authorization and callback routes
- Developed user profile management (profile data, avatars, stats)
- Built friend system with request lifecycle (send/accept/reject)

**Challenges & Solutions**:
- *Challenge*:  
  *Solution*:

### nmotie-

**Contributions**:
- Frontend architecture using React
- Form validation and input handling
- API integration (REST requests)
- WebSocket client integration
- README documentation
- Browser compatibility

**Technical Details**:
- Structured the frontend using reusable React components and routing (React Router)
- Implemented controlled forms with validation logic
- Integrated backend APIs using a centralized request utility
- Connected WebSocket client to handle real-time updates in UI

**Challenges & Solutions**:
- *Challenge*: Handling WebSocket disconnections in real-time gameplay  
  *Solution*: Implemented connection lifecycle management with automatic reconnection

### ien-niou

**Contributions**:
- UI styling (Tailwind CSS)
- Game customization features
- Application state (user data, authentication tokens, loading states)
- Error handling using Error Boundaries
- Infrastructure setup (Docker, environment config)
- Privacy and legal pages

**Technical Details**:
- Built responsive UI using Tailwind CSS utility classes
- Implemented customization features (themes, skins, audio)
- Managed UI state (authentication, loading, error states) for a smoother user experience
- Improved application stability through proper error handling and fallback UI
- Configured Docker environment and reverse proxy setup
- Implemented privacy policy and terms of service pages

**Challenges & Solutions**:
- *Challenge*:  
  *Solution*:

### jmayou

**Contributions**:
- Game logic (Tic-Tac-Toe rules)
- WebSocket server-side implementation
- Remote players
- AI opponent

**Technical Details**:
- Implemented game engine with win/draw detection
- Built WebSocket server for real-time communication
- Managed game sessions and player synchronization
- Developed AI logic with non-perfect decision-making

**Challenges & Solutions:**
- *Challenge*:  
  *Solution*:
