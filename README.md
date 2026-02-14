This project will be created as part of the 42 curriculum by <mark>nmotie-</mark>, <mark>fel-aziz</mark>, <mark>abattagi</mark>, <mark>jmayou</mark>, <mark>ien-niou</mark>.

# ft_transcendence — Tic-Tac-Toe platform

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

**Project Overview**
***ft_transcendence*** is a ***full-stack web application*** currently under development as part of the 42 curriculum.
The ***goal*** of the project is to design and develop a complete web platform with full creative freedom, covering frontend, backend, real-time communication, and game logic.

For this project, we have chosen to build a ***Tic-Tac-Toe platform*** with real-time gameplay powered by WebSockets.
Despite the simplicity of the game itself, the project emphasizes modern web development practices, including real-time synchronization, secure user management, modular architecture, and scalability.

**Key Features**  
- Online multiplayer Tic-Tac-Toe game
- Matchmaking system
- Real-time gameplay using WebSockets
- AI opponent for solo play
- Standard user management and authentication
- profile, friends and basic chat system
- Responsive and accessible UI
- Privacy and legal pages

---

## Instructions

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

### After the application starts:
Open your browser and go to https://localhost:5173.

---

## Resources
* This section will listing classic references related to the topic (documentation, articles, tutorials, etc.)
* Description of how AI was used — specifying for which tasks and which parts of the project.

---

## Team Information

1. *nmotie-*

**Assigned role(s)**:
> Developer + Project Manager

**Main Responsibilities**:
- Frontend framework
- Routing and page structure
- UI design and implementation
- Client-side form validation
- API integration (http requests)
- Responsive and accessible design

**PM Responsibilities**:
* Organizes team meetings and planning sessions.
* Tracks progress and deadlines.
* Ensures team communication.
* Manages risks and blockers.

2. *fel-aziz*

**Assigned roles**:
> Developer + Technical Lead

**Main Responsibilities**:
- Backend framework
- Database design
- ORM integration
- API structure

**TL Responsibilities**:
* Defines technical architecture.
* Makes technology stack decisions.
* Ensures code quality and best practices.
* Reviews critical code changes.

3. *abattagi*

**Assigned roles**:
> Developer + Product Owner

**Main Responsibilities**:
- User management
- User authentication
- OAuth (Google)
- Real-time chat

**PO Responsibilities**:
* Maintains the product backlog.
* Makes decisions on features and priorities.
* Validates completed work.
* Communicates with stakeholders (evaluators, peers).

4. *jmayou*

**Assigned roles**:
> Developer

**Main Responsibilities**:
- Tic-Tac-Toe game rules and logic
- WebSocket server-side logic
- Remote players
- AI opponent

5. *ien-niou*

**Assigned roles**:
> Developer

**Main Responsibilities**:
- Real-time features (client side)
- State Management
- Game customization
- Privacy and legal pages
- Final README documentation
- Containerization and environment configuration

---

## Project Management

This section will include:
* How the team organized the work (task distribution, meetings, etc.). 
* Tools used for project management (GitHub Issues, Trello, etc.).
* Communication channels used (Discord, Slack, etc.).

---

## Technical Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express, WebSockets
- **Database:** PostgreSQL
- **DevOps:** Docker, Docker Compose

*Any other significant technologies or libraries and justification for major technical choices will be provided after development.*

---

## Database Schema

This section will include:
* Visual representation or description of the database structure. 
* Tables/collections and their relationships.
* Key fields and data types.

---

## Features Overview

This section will include:
* Complete list of implemented features.
* Which team member(s) worked on each feature. 
* Brief description of each feature’s functionality.

---

## Modules

| Module                          | Type  | Points | primary Owner  | Supporting Member |
|---------------------------------|-------|--------|----------------|-------------------|
| Frontend framework              | Minor |   1    | nmotie-        |       -           |
| Backend framework               | Minor |   1    | fel-aziz       |       -           |
| Web-based game                  | Major |   2    | jmayou         |     nmotie-       |
| Real-time features (WebSockets) | Major |   2    | jmayou         |    ien-niou       |
| Remote players                  | Major |   2    | jmayou         |       -           |
| ORM for the database            | minor |   1    | fel-aziz       |       -           |
| User management & authentication| Major |   2    | abattagi       |     fel-aziz      |
| OAuth (Google)                  | minor |   1    | abattagi       |     fel-aziz      |
| User interaction (chat)         | major |   2    | abattagi       |     nmotie-       |
| AI opponent                     | Major |   2    | jmayou         |       -           |
| Game customization              | minor |   1    | ien-niou       |       -           |

*Total: 14+ points*

*Justification and implementation details for each module will be provided after development. Module selection may be adjusted as the project progresses.*

---

## Individual Contributions
This section will include:
* Detailed breakdown of what each team member contributed.
* Specific features, modules, or components implemented by each person.
* Any challenges faced and how they were overcome.