# Architecture

Answer each of these, in your own words, once the system has taken real shape.

- What are the moving pieces, and how do they talk to each other?
- Where does each piece run?
- What is the request path for one representative user action, end to end?
- What did you decide *not* to build, and why?

---

<!-- Planned architecture — to be expanded with real detail once implementation is complete -->

## Planned architecture (to be filled in detail after implementation)

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

- **React + Vite frontend** — renders the UI, handles routing (React Router), communicates with the backend via Axios over HTTP/JSON. Runs in the browser.
- **Node.js + Express backend** — REST API server. Handles authentication, authorization, validation, business rules, database access, CSV generation, and dashboard aggregation. Runs on Render (production) or `localhost:5000` (development).
- **MongoDB database** — stores all persistent data. Accessed via Mongoose. Runs on MongoDB Atlas (production) or a local MongoDB instance (development).

**Where each piece runs:**

| Piece | Development | Production |
|-------|-------------|------------|
| Frontend | `localhost:5173` (Vite dev server) | Vercel |
| Backend | `localhost:5000` (nodemon) | Render |
| Database | Local MongoDB or Atlas dev cluster | MongoDB Atlas |

**Representative request path — "Learner marks a lesson complete":**

```
Browser (React)
    ↓ PATCH /api/lessons/:lessonId/progress
    ↓ Cookie: JWT token
Express Router
    ↓
authenticate middleware  (verify JWT, attach req.user)
    ↓
authorize middleware     (verify role = LEARNER)
    ↓
Progress Controller
    ↓
Progress Service
    ├── Find enrollment (learnerId + courseId) — verify learner is enrolled
    ├── Find lesson — verify lesson belongs to course
    ├── Upsert Progress record (enrollmentId + lessonId)
    ├── Update Enrollment.lastProgressAt = now()
    └── Append ActivityLog event (PROGRESS_UPDATED)
    ↓
200 { success: true, data: { progressStatus, lessonsCompleted, totalLessons } }
```

