# Plan

## Work sessions

I divided the project into a few focused sessions so that each major part of the application can be completed and checked before moving to the next one.

The planned order is:

1. Foundation
2. Authentication and roles
3. Course and lesson management
4. Enrollment and learner progress
5. Search,filtering, sorting, pagination, bulk operations, CSV export and dashboard
6. Activity history and alerts
7. Testing, deployment and final submission

I started with the foundation because the rest of the application depends on having the client, server and database working properly. Authentication comes next so that access rules are in place before building the main application features.

The remaining features were added step by step as the core functionality was
completed.

The planned implementation, testing, deployment, and final verification have
now been completed.

---

## M01 — Foundation

**Scope**

Set up the basic client and server application, project structure, MongoDB connection and development configuration.

**What I planned to do**

* Set up the React + Vite frontend
* Set up the Node.js + Express backend
* Configure the MongoDB connection
* Add the health endpoint
* Add basic middleware and error handling
* Create the required Mongoose models
* Add environment configuration
* Set up development scripts
* Verify that the application starts correctly

### Result

M01 was completed. The frontend and backend structure is in place, the required Mongoose models were created, MongoDB Atlas connection was verified, and the health endpoint was tested successfully.

---

## M02 — Authentication and Roles

**Scope**

Add user authentication and role-based access for learners and instructors.

**What I planned to do**

* Add user registration and login
* Hash passwords using bcrypt
* Add JWT-based authentication
* Add authentication and role authorization middleware
* Add login and registration pages
* Protect authenticated routes
* Add separate access for learners and instructors
* Verify the authentication flow

### Result

M02 was completed and verified successfully. Registration, login, JWT authentication, password protection and role-based access are working correctly. Protected and guest routes were also tested successfully.

---

## M03 — Course and Lesson Management

**Scope**

Add course and lesson management so instructors can create and manage courses, while learners and public users can browse published courses.

**What I planned to do**

* Add course creation and editing

* Add course listing

* Add course details

* Add lesson creation, editing, and deletion

* Add course status changes such as publish, archive, and restore

* Add input validation

* Add role-based access and instructor ownership checks

* Verify the course and lesson functionality

### Result

M03 was completed and verified successfully. Instructors can create and manage their own courses and lessons, while learners and public users can view published courses. Course status changes, input validation, role-based access control, and instructor ownership checks were also tested successfully.

---

## M04 — Enrollment and Learner Progress

**Scope**

Add enrollment functionality for learners and instructors, and track learner progress through course lessons.

**What I planned to do**

* Allow learners to self-enroll in published courses
* Allow instructors to enroll learners by email
* Prevent duplicate enrollments
* Prevent enrollment in draft or unpublished courses
* Add authorization and course ownership checks for instructor enrollment
* Add learner progress tracking based on completed lessons
* Track progress states such as NOT_STARTED, IN_PROGRESS, and COMPLETED
* Calculate learner progress percentage
* Allow learners to mark lessons as completed or incomplete
* Ensure progress is scoped to the authenticated learner
* Add enrolled-course filtering
* Verify enrollment and learner progress functionality

### Result

M04 was completed and runtime-verified successfully. Learners can self-enroll in published courses, while instructors can enroll learners in their own courses. Duplicate enrollment, unpublished-course enrollment, role authorization, and course ownership restrictions were verified.

Learner progress is calculated from completed lessons and correctly transitions between NOT_STARTED, IN_PROGRESS, and COMPLETED states. Lesson completion and un-completion were also verified.

---

## M05 — Search, Filtering, Sorting, Pagination, Bulk Operations, CSV Export and Dashboard

**Scope**

Complete the course discovery and instructor management features by adding search, filtering, sorting, pagination, bulk enrollment, CSV export, and an instructor dashboard.

**What I planned to do**

* Add course search

* Add course filtering

* Add course sorting

* Add pagination for course discovery

* Add bulk enrollment of learners

* Add CSV export for enrollment and learner progress data

* Add instructor dashboard

* Add appropriate authorization and ownership checks

* Verify the M05 functionality

### Result

M05 was completed and runtime-verified successfully. Course discovery now supports search, filtering, sorting, and pagination. Instructors can bulk enroll learners and see the result for newly enrolled, already enrolled, and unknown addresses.

CSV export was added for enrollment and learner progress information, with access restricted to the instructor who owns the course. An instructor dashboard was also added to provide course and learner-related information.

---

## M06 — Activity History and Alerts

**Scope**

Add activity history and learner inactivity alerts so course activity can be tracked and instructors can identify learners who have not made progress recently.

**What I planned to do**

* Add activity logging for important course, lesson, enrollment, and progress events

* Add activity history to the course details page

* Allow authorized users to add comments to the activity history

* Keep activity history append-only so existing records cannot be modified or deleted

* Add inactivity alerts for learners who have not made progress for 14 days

* Allow instructors to dismiss inactivity alerts

* Allow dismissed alerts to reappear when the learner becomes inactive again

* Add alerts to the instructor dashboard

* Add appropriate authentication, authorization, and course ownership checks

* Verify the M06 functionality

### Result

M06 was completed and runtime-verified successfully. Activity history now records the main course, lesson, enrollment, and learner progress events. Authorized users can also add comments to the activity history from the course details page.

Inactivity alerts were added for learners who have not made progress for 14 days. Instructors can dismiss these alerts, and the alert can reappear if the learner becomes inactive again after making progress.

The M06 activity and alert endpoints were tested successfully, including comment creation, activity logging, alert retrieval, and alert dismissal. Existing M01–M05 functionality was also regression-tested successfully after the changes.

---

## M07 — Testing, Deployment and Final Submission

**Scope**

Complete final verification, deploy the application, and prepare the project
for submission.

**What I planned to do**

- Run final backend and frontend verification
- Regression-test the completed M01–M06 functionality
- Verify the demo user accounts and seeded scenarios
- Verify the production database connection
- Deploy the backend to Render
- Deploy the frontend to Vercel
- Configure the production frontend API URL
- Test the deployed application
- Update the final documentation and submission files
- Prepare the final project for submission

**### Result**

M07 was completed successfully. The application was regression-tested after
the final implementation corrections and the demo seed data was verified for
the required learner progress and inactivity-alert scenarios.

The backend was deployed to Render and the frontend was deployed to Vercel.
The production frontend was configured to communicate with the deployed
backend, and the application was tested through the deployed environment.

The final documentation and submission files were reviewed and updated before
final submission.