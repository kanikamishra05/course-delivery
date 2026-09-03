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
| Instructor | shuklasuman224@gmail.com | 1234@59#Di|
| Learner | kanikarocks11@gmail.com | DemoLearner123!|

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
| 4 | Course and progress states | Complete | Course states (DRAFT, PUBLISHED, ARCHIVED) and state transitions are implemented. Learner progress states (NOT_STARTED, IN_PROGRESS, COMPLETED) are also implemented and calculated from completed lessons. |
| 5 | Enrollment | Complete | Learners can self-enroll in published courses, while instructors can enroll learners in their own courses. Duplicate enrollments and unauthorized enrollments are prevented. |
| 6 | Finding courses | Complete | Search, filtering, sorting, and pagination are implemented and verified. |
| 7 | Bulk enrollment + CSV export | Complete | Instructors can bulk enroll learners and export enrollment and learner progress data as CSV. |
| 8 | Dashboard | Complete | An instructor dashboard is implemented with published course counts, learner counts, completion metrics, in-progress learners, and recent completion activity. |
| 9 | Immutable activity history | Complete | Course activity is recorded in an append-only activity history, including course, lesson, enrollment, progress, and comment events. |
| 10 | Inactivity alerts | Complete | Instructors can see inactivity alerts for learners who have been in progress without recent activity, and alerts can be dismissed and reappear after later inactivity. |

## How much time did you actually spend?

<to be filled after project completion>

## What would you do next, with another 12 hours?

<to be filled after project completion>

## What are you least happy with in this codebase, and why?

<to be filled after project completion>
