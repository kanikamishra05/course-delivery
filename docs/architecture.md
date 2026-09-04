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
      MongoDB Atlas
```

**Moving pieces:**

- **React + Vite frontend** — renders the UI, handles routing (React Router),manages authentication state,provides course discovery, course and lesson management, enrollment, learner progress, enrolled-course,and instructor dashboard pages,activity history, and alert views, and communicates with the backend via Axios over HTTP/JSON. Runs in the browser.
- **Node.js + Express backend** — REST API server. Currently handles authentication, authorization, validation,course and lesson management,course discovery,enrollment, learner progress tracking,bulk enrollment, CSV export, instructor dashboard data,activity history, comments, inactivity alerts,and database access. Runs on Render (production) or `localhost:5000` (development).
- **MongoDB database** — stores persistent application data and is accessed through Mongoose. MongoDB Atlas is currently used for development and deployed
environments.

**Where each piece runs:**

| Piece | Development | Production |
|-------|-------------|------------|
| Frontend | `localhost:5173` | vercel |
| Backend | `localhost:5000`  | Render |
| Database | MongoDB Atlas | MongoDB Atlas |

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

**Activity history and alerts flow:**

Course, lesson, enrollment, and progress actions are recorded as activity events in the backend. Activity history is displayed on the course details page for authorized users.

Learner progress is calculated from completed lessons. The system uses the
learner's progress activity to identify learners who have remained in progress
without recent activity.

When an in-progress learner has not made progress for the configured inactivity
period, an alert becomes available to the instructor through the dashboard.
Instructors can dismiss these alerts, and alerts can reappear when the learner
makes progress after dismissal and subsequently becomes inactive again.