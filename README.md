This project will be created as part of the 42 curriculum by <mark>nmotie-</mark>, <mark>abattagi</mark>, <mark>fel-aziz</mark>, <mark>jmayou</mark>.

# ft_transcendence — Online Multiplayer Chess Platform

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
The **goal** of the project is to design and develop a full-stack web application with complete creative freedom.
For this project, we have chosen an **online multiplayer chess platform** as our concept.  
This project allows exploration of modern web development while showcasing technical skills and creativity through a modular approach.

**Key Features**  
- Online multiplayer chess
- Responsive and accessible UI
- Real-time gameplay using WebSockets
- Matchmaking and game lobby system
- User authentication and profiles
- Game history and statistics
- AI opponent for solo play
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

1. *abattagi*

**Assigned roles**:
> Product Owner (PO) + Developer

**PO Responsibilities**:
* Maintains the product backlog.
* Makes decisions on features and priorities.
* Validates completed work.
* Communicates with stakeholders (evaluators, peers).

**Planned Contributions**:
- Implement ***core chess rules*** and ***move validation***.
- Implement ***ELO rating logic***.
- Develop ***game history*** and ***player statistics***.
- Implement ***data export & import***.
- Contribute to ***leaderboard logic***.
- Participate in ***backend code reviews***.

2. *nmotie-*

**Assigned role(s)**:
> Project Manager (PM) / Scrum Master + Developer

**PM Responsibilities**:
* Organizes team meetings and planning sessions.
* Tracks progress and deadlines.
* Ensures team communication.
* Manages risks and blockers.

**Planned Contributions**:
- Implement the application using a ***frontend framework***.
- Build a ***custom design system with reusable components***
- Build the ***chessboard UI***, ***lobby***, ***matchmaking***, ***profiles***, and ***interactions***.
- Integrate ***real-time updates via WebSockets*** into the UI.
- Implement ***frontend form validation*** for user inputs.
- Ensure ***responsive design*** and ***accessibility basics***.

3. *fel-aziz*

**Assigned roles**:
> Technical Lead / Architect + Developer

**TL Responsibilities**:
* Defines technical architecture.
* Makes technology stack decisions.
* Ensures code quality and best practices.
* Reviews critical code changes.

**Planned Contributions**:
- Implement ***backend framework***.
- Implement ***WebSocket server*** for real-time gameplay.
- Design ***database schema*** and ***relations***.
- Implement ***secure authentication*** (salted + hashed passwords, etc.).
- Enforce ***HTTPS*** and secure server configuration.
- Implement ***spectator mode***.

4. *jmayou*

**Assigned roles**:
> Developer

**Planned Contributions**:
- Implement ***matchmaking logic***.
- Manage ***game rooms lifecycle*** (create, join, leave).
- Handle ***disconnections and reconnections***.
- Support ***multiplayer gameplay*** through online matches.
- Implement ***remote player*** synchronization.
- Implement ***AI opponent***. 

---

## Project Management
This section will include:
* How the team organized the work (task distribution, meetings, etc.). 
* Tools used for project management (GitHub Issues, Trello, etc.).
* Communication channels used (Discord, Slack, etc.).

---

## Technical Stack
This section will include:
* Frontend technologies and frameworks used. 
* Backend technologies and frameworks used.
* Database system and why it was chosen.
* Any other significant technologies or libraries. 
* Justification for major technical choices.

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
| Module                                     | Type  | Points | Team Member | Justification          |
|--------------------------------------------|-------|--------|-------------|------------------------|
| Web — Backend framework                    | Minor |   1    |  fel-aziz   | Server & APIs          |
| Web — Frontend framework + real-time UI    | Minor |   1    |  nmotie-    | UI & interactivity     |
| Web — Custom design system                 | Minor |   1    |  nmotie-    | Consistent UI          |
| User Management — Game statistics          | Minor |   1    |  abattagi   | Player data            |
| Web — Real-time features (WebSockets)      | Major |   2    |  fel-aziz   | Live updates           |
| Gaming & UX — Multiplayer                  | Major |   2    |  jmayou     | Multi-player support   |
| Gaming & UX — Remote players               | Major |   2    |  jmayou     | Cross-device play      |
| Gaming & UX — Spectator mode               | Minor |   1    |  fel-aziz   | Watch games            |
| Artificial Intelligence — AI Opponent      | Major |   2    |  jmayou     | Single-player with AI  |
| Data & Analytics — Export/Import           | Minor |   1    |  abattagi   | Stats & data management|
| Accessibility & i18n — Languages (optional)| Minor |   1    |    TBD      | Multi-language support |
| Accessibility & i18n — Browsers (optional) | Minor |   1    |    TBD      | Browser support        |
| Cybersecurity (optional)                   | Major |   2    |    TBD      | Data security          |
| DevOps — Health check (optional)           | Minor |   1    |    TBD      | Deployment & monitoring|

Planned Total: 14+ points (final count to be confirmed)
*Implementation details for each module will be provided after development. Module selection may be adjusted as the project progresses.*

---

## Individual Contributions
This section will include:
* Detailed breakdown of what each team member contributed.
* Specific features, modules, or components implemented by each person.
* Any challenges faced and how they were overcome.