# Submission

This file gives a quick overview of the project, its current progress, and the information needed to review the application.

## Links

- **GitHub repository:** -> https://github.com/kanikamishra05/course-delivery
- **Live application:** -> https://course-delivery.vercel.app

## Notes for the reviewer

The backend is hosted on Render's free tier and may sleep after a period of inactivity. As a result, the first API request after the backend has been idle may take some time while the service wakes up. Subsequent requests should respond normally.

## Demo credentials

| Role | Email | Password |
|------|-------|----------|
| Instructor | shuklasuman224@gmail.com | 1234@59#Di|
| Learner | kanikarocks11@gmail.com | DemoLearner123!|
| Learner | mishrakanika59@gmail.com | 1234@59#Pa|

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
| 2 | Courses | Complete |Instructors can create, edit, publish, archive, and restore their own courses. The application also includes seeded course data for demonstration. |
| 3 | Lessons inside courses | Complete |Instructors can add, edit, delete, and order lessons within their own courses.Demonstration courses contain multiple lessons covering relevant technical topics. |
| 4 | Course and progress states | Complete | Course states (DRAFT, PUBLISHED, ARCHIVED) and valid state transitions are implemented. Publishing an empty course is rejected by the server. Learner progress states (NOT_STARTED, IN_PROGRESS, COMPLETED) are derived at read-time from completed lessons rather than stored separately. |
| 5 | Enrollment | Complete | Learners can self-enroll in published courses, while instructors can enroll learners in their own courses. Duplicate enrollments and unauthorized enrollments are prevented. |
| 6 | Finding courses | Complete | Search, filtering, sorting, and pagination are implemented and verified. |
| 7 | Bulk enrollment + CSV export | Complete | Instructors can bulk enroll learners and receive per-email results identifying newly enrolled, already enrolled, and unknown learner addresses. Enrollment and learner progress data can also be exported as CSV. |
| 8 | Dashboard | Complete | An instructor dashboard is implemented with published course counts, learner counts, completions this month, learners currently in progress, enrollment/progress breakdowns, and a completion chart covering the last eight weeks. |
| 9 | Immutable activity history | Complete | Course activity is recorded in an append-only activity history, including course creation and edits, publish/archive/restore transitions, lesson, enrollment, progress, and comment events. Each event records the responsible user, and existing activity records cannot be edited or deleted. |
| 10 | Inactivity alerts | Complete | Instructors can see inactivity alerts for learners whose progress is IN_PROGRESS but who have made no further progress for more than 14 days. Alerts can be dismissed and reappear after the learner makes progress and later becomes inactive again. |

## How much time did you actually spend?

Approximately 16 hours, including implementation, debugging, runtime verification, documentation, local testing, and deployment of the application.

## What would you do next, with another 12 hours?

With another 12 hours, I would implement quizzes with automatic scoring as an optional extension from the assignment. Quizzes could be attached to lessons or courses, with learners receiving an immediate score after submission.

I would also use the remaining time to increase automated test coverage and strengthen edge-case testing for the existing APIs.

## What are you least happy with in this codebase, and why?

The main area I would improve is the automated test coverage and some of the larger service functions. The current implementation is functional and verified through runtime testing, but some business logic could be split into smaller reusable functions and supported by more automated tests to make future changes safer and easier to maintain.
