# Architecture

This section describes how the main parts of the application are connected and how they work together. It also explains where each part runs and the flow of a typical user request through the system.


## Current architecture

The system follows a simple client-server architecture:

```
React + Vite (Frontend)
        ↓
    HTTP / JSON
        ↓
Node.js + Express (Backend)
        ↓
     Mongoose
        ↓
      MongoDB
```

**Moving pieces:**

- **React + Vite frontend** — renders the UI, handles routing (React Router),manages authentication state,provides course and lesson management pages, and communicates with the backend via Axios over HTTP/JSON. Runs in the browser.
- **Node.js + Express backend** — REST API server. Currently handles authentication, authorization, validation,course and lesson management, and database access. Additional business features will be added in later steps. Runs on Render (production) or `localhost:5000` (development).
- **MongoDB database** — stores persistent application data and is accessed through Mongoose. MongoDB Atlas is currently used for development.

**Where each piece runs:**

| Piece | Development |
|-------|-------------|
| Frontend | `localhost:5173` (Vite dev server) |
| Backend | `localhost:5000` (nodemon) |
| Database | MongoDB Atlas |

**Representative request path — "User logs in":**

Browser (React)
    ↓
POST /api/auth/login
    ↓
Express Router
    ↓
Auth Controller
    ↓
Find user in MongoDB
    ↓
Compare password using bcrypt
    ↓
Generate JWT
    ↓
Return JWT + user data
    ↓
React stores JWT and  authentication state

