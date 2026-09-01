# Submission

This file gives a quick overview of the project, its current progress, and the information needed to review the application.

## Links

- **GitHub repository:** -> https://github.com/kanikamishra05/course-delivery
- **Live application:** <deployed URL — to be added after deployment (M07)>

## Notes for the reviewer

<Anything we should know before opening the link — e.g. your host sleeps when idle and the first
request can take up to a minute.>

The backend is hosted on Render (free tier) which sleeps after inactivity. The first request after
a period of idle may take 30–60 seconds to respond. This is expected behaviour on the free tier.

## Demo credentials

| Role | Email | Password |
|------|-------|----------|
| Instructor | <to be added after seed data is created (M06)> | |
| Learner | <to be added after seed data is created (M06)> | |

## Stack

| Layer | What you used | Why |
|-------|---------------|-----|
| Frontend | React + Vite | Fast dev server, familiar, lightweight bundle |
| Backend | Node.js + Express | Developer's strongest stack; simple and explainable |
| Database | MongoDB + Mongoose | Document model fits the data; Atlas free tier for hosting |
| Auth | JWT + bcrypt | Simple, stateless, appropriate for Express; no third-party auth provider needed |
| Hosting | Vercel (frontend) + Render (backend) + MongoDB Atlas | All free tiers; well-supported combination |

## Goal checklist

Mark each honestly. Partial is fine — say what is partial.

| # | Goal | Status | Notes |
|---|------|--------|-------|
| 1 | Accounts and roles | Complete | Registration, login, JWT authentication, protected routes, role authorization, session persistence, and logout are implemented and verified. |
| 2 | Courses | Complete |Instructors can create, edit, publish, archive, and restore their own courses. |
| 3 | Lessons inside courses | Complete |Instructors can add, edit, delete, and order lessons within their own courses. |
| 4 | Course and progress states | Partial | Course states (DRAFT, PUBLISHED, ARCHIVED) and state transitions are implemented. Learner progress states are part of a later module. |
| 5 | Enrollment | Not done | |
| 6 | Finding courses | Complete | Public and learner course discovery supports search, category filtering, sorting, and pagination. |
| 7 | Bulk enrollment + CSV export | Not done | |
| 8 | Dashboard | Not done | |
| 9 | Immutable activity history | Not done | |
| 10 | Inactivity alerts | Not done | |

## How much time did you actually spend?

<to be filled after project completion>

## What would you do next, with another 12 hours?

<to be filled after project completion>

## What are you least happy with in this codebase, and why?

<to be filled after project completion>
