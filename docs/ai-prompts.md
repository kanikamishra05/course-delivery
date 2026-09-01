# AI Prompts

This file records the significant AI-assisted development prompts used during the project, along with important corrections made after reviewing the generated work.

## M01 — Foundation

### What I was trying to achieve

Set up the initial client and server foundation so the rest of the project could be built on it.

### Prompt

Asked the AI agent to read assignment requirements and the assignment, inspect the repository, and implement only the M1 foundation.

The requested scope included the client/server setup, configuration, MongoDB connection, health endpoint, basic middleware, Vite development proxy, API client, development scripts, and verification.

### What I got

The agent created the initial client and server structure and the required development setup within the M1 scope.

### What I corrected

I reviewed the generated implementation against the M01 scope before moving forward. I also installed the dependencies, ran the available checks, started the application, and verified the health endpoint.

No major correction was required to the implementation itself.

---

## M02 — Authentication and Roles

### What I was trying to achieve

Add user authentication and role-based access so that users can register, log in, and access the application based on their role.

### Prompt

Asked the AI agent to read the assignment requirements and existing project files, then implement only the M02 authentication and role requirements.

The requested scope included user registration and login, JWT authentication, password hashing with bcrypt, authentication and role middleware, protected routes, frontend login and registration pages, authentication context, protected and guest routes, and logout.

### What I got

The agent implemented the authentication flow for both the backend and frontend. Users can register and log in, passwords are hashed, JWTs are generated and verified, and role-based access is handled through middleware.

The frontend also includes login and registration pages, authentication state, protected routes, guest routes, session persistence, and logout.

### What I corrected

I reviewed the implementation and verified all M02 functionality successfully. MongoDB connection, registration, login, JWT authentication, protected routes, role authorization, session persistence, guest routes, and logout were tested successfully.

Role authorization was tested directly because the course APIs that will use it are part of the next step, and the frontend functionality was verified through the production build.

No major changes were required to the implementation.

---

## M03 — Course and Lesson Management

### What I was trying to achieve

Add course and lesson management so instructors can create and manage their courses, while learners and public users can browse published courses.

### Prompt

Asked the AI agent to read the assignment requirements and existing project files, then implement only the M03 course and lesson management requirements.

The requested scope included course creation and editing, course listing and search, course details, lesson creation and management, course status changes, pagination, and role-based access and ownership checks.

### What I got

The agent implemented the course and lesson management functionality for both the backend and frontend. Instructors can create and manage courses and lessons, change course status, and manage only their own courses. Learners and public users can browse published courses.

The implementation also includes search, category filtering, pagination, lesson ordering, validation, and access control.

### What I corrected

I reviewed the implementation and verified the M03 functionality through runtime testing. The backend and frontend checks passed, and all runtime tests were successful.

The tests covered course creation, course visibility, course updates, publishing, archiving, restoring, lesson management, validation, role authorization, and instructor ownership.

No major changes were required to the implementation.