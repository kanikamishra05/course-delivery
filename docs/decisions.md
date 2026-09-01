# Decisions

This section records the main technical decisions made during the development of the project and the reasons behind them.

## Decision 1

- **Chose:**-
  
  JWT-based authentication with bcrypt for password hashing.

- **Rejected:**-

  Storing passwords directly and using server-side session-based authentication.

- **Why:**-

  JWT works well with the React frontend and Express API, while bcrypt keeps user passwords securely hashed. It also makes it straightforward to protect API routes and handle role-based access.


## Decision 2

- **Chose:**-
  
  A separate service layer for course and lesson business logic.

- **Rejected:**-
  
  Putting all course and lesson logic directly inside the route controllers.

- **Why:**-
  
  Keeping the business logic in a separate service makes the controllers simpler and easier to understand. It also keeps course ownership checks, validation, lesson management, and course status changes in one place, which will make the application easier to extend in later steps.
  

## Decision 3

- **Chose:**
- **Rejected:**
- **Why:**

## Decision 4

- **Chose:**
- **Rejected:**
- **Why:**

## Decision 5

- **Chose:**
- **Rejected:**
- **Why:**