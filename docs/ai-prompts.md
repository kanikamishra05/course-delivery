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

The requested scope included course creation and editing, course listing and course details, lesson creation and management, course status changes, input validation, and role-based access and ownership checks.

### What I got

The agent implemented the course and lesson management functionality for both the backend and frontend. Instructors can create and manage courses and lessons, change course status, and manage only their own courses. Learners and public users can browse published courses.

The implementation also includes input validation, lesson ordering, role-based access control, and instructor ownership checks.

### What I corrected

I reviewed the implementation and verified the M03 functionality through runtime testing. The backend and frontend checks passed, and all runtime tests were successful.

The tests covered course creation, course visibility, course updates, publishing, archiving, restoring, lesson management, validation, role authorization, and instructor ownership.

No major changes were required to the implementation.

---

## M04 — Enrollment and Learner Progress

### What I was trying to achieve

Add enrollment functionality for learners and instructors and implement learner progress tracking based on completed lessons.

### Prompt

Asked the AI agent to inspect the existing project implementation and implement the M04 enrollment and learner progress requirements.

The requested scope included learner self-enrollment in published courses, instructor enrollment of learners by email, duplicate enrollment prevention, enrollment restrictions for unpublished courses, instructor ownership and role authorization, learner progress tracking, progress state calculation, lesson completion and un-completion, and enrolled-course filtering.

The implementation was required to preserve the existing functionality and avoid implementing features from later milestones.

### What I got

The agent implemented enrollment and learner progress functionality across the backend and frontend.

Learners can self-enroll in published courses, while instructors can enroll learners in their own courses. Duplicate enrollments are prevented, enrollment in unpublished courses is rejected, and instructor enrollment is protected by role and course ownership checks.

Learner progress is calculated from completed lessons and transitions between `NOT_STARTED`, `IN_PROGRESS`, and `COMPLETED` states. Learners can mark lessons as completed or incomplete, and the progress endpoint is scoped to the authenticated learner.

The implementation also added enrolled-course filtering and a learner's enrolled courses page.

### What I corrected

I reviewed the M04 implementation and performed runtime verification.

The tests covered self-enrollment restrictions, successful learner enrollment, duplicate enrollment handling, instructor enrollment, role and ownership authorization, initial progress, authenticated-user progress scoping, lesson completion, progress state transitions, lesson un-completion, and enrolled-course filtering.

No major changes were required to the M04 implementation.

After the initial implementation, an additional review identified that
re-submitting completion for an already completed lesson could still update
`lastProgressAt` and create a redundant activity event. This was corrected so
that progress-related side effects occur only when the progress state actually
changes.

Cross-course progress spoofing was also explicitly tested and rejected.

---

## M05 — Search, Filtering, Sorting, Pagination, Bulk Operations, CSV Export and Dashboard

### What I was trying to achieve

Complete the course discovery and instructor management features by adding search, filtering, sorting, pagination, bulk enrollment, CSV export, and an instructor dashboard.

### Prompt

Asked the AI agent to inspect the existing project implementation and implement only the M05 requirements.

The requested scope included course search, filtering, sorting, pagination, bulk enrollment of learners, CSV export, and an instructor dashboard. The agent was asked to preserve all previously completed functionality and avoid making changes outside the M05 scope.

### What I got

The agent implemented the M05 functionality across the backend and frontend.

Course discovery now supports search, filtering, sorting, and pagination. Instructors can bulk enroll learners using their email addresses, and the system reports newly enrolled learners, already enrolled learners, and unknown addresses.

The implementation also includes CSV export for enrollment and learner progress data, with access restricted to the instructor who owns the course.

An instructor dashboard was added to provide course and learner-related information. The frontend was also updated with the required controls and navigation for these features.

### What I corrected

I reviewed the M05 implementation and performed runtime verification after the implementation was completed.

The tests covered bulk enrollment with valid and invalid learner addresses, duplicate enrollment handling, instructor ownership restrictions, CSV export with learner progress, dashboard calculations, and the combination of search, filtering, sorting, and pagination.

No major changes were required to the M05 implementation after verification.

---

## M06 — Activity History and Alerts

### What I was trying to achieve

Add activity history and learner inactivity alerts so that important course activity can be tracked and instructors can identify learners who have not made progress recently.

### Prompt

Asked the AI agent to inspect the existing project implementation and implement only the M06 activity history and alerts requirements.

The requested scope included recording important course, lesson, enrollment, and learner progress events, displaying activity history on the course details page, allowing authorized users to add comments, and keeping activity records append-only.

The prompt also included inactivity alerts for learners who had not made progress for 14 days, alert dismissal, alert reappearance when a learner becomes inactive again, and displaying alerts on the instructor dashboard.

The agent was asked to preserve all previously completed functionality and avoid making changes outside the M06 scope.

### What I got

The agent implemented the M06 functionality across the backend and frontend.

Activity logging was added for the main course, lesson, enrollment, and learner progress events. Authorized users can view the activity history and add comments from the course details page.

Inactivity alerts were also added for learners who have not made progress for 14 days. Instructors can dismiss alerts, and dismissed alerts can reappear when the learner becomes inactive again.

The dashboard was updated to display the relevant inactivity alerts, and the activity and alert functionality was protected by the existing authentication, authorization, and course ownership rules.

### What I corrected

I reviewed the M06 implementation and performed runtime verification after the implementation was completed.

The tests covered adding course comments, recording activity events, retrieving alerts, and dismissing alerts. The existing M01–M05 functionality was also regression-tested after the M06 changes.

The frontend production build completed successfully as well.

No major changes were required to the M06 implementation after verification.

The demo seed process was subsequently reviewed for idempotency. The cleanup
logic was corrected to remove dependent Progress and Alert records when old
demo enrollments are refreshed, preventing orphaned records when the seed is
run repeatedly.

---

## Example of an AI Output That Required Correction

### Prompt

Asked the AI agent to implement learner progress tracking, including lesson
completion and un-completion, progress state calculation, and updating the
learner's last progress time when progress changes.

### What went wrong

During review, I found that submitting a completion request for a lesson that
was already marked as completed could still update `lastProgressAt` and create
another progress-related activity event.

This was incorrect because no actual progress change had occurred.

### What I changed

I changed the progress handling so that progress-related side effects only
occur when the learner's completion state actually changes.

If a learner completes an already completed lesson, the request no longer
updates `lastProgressAt` or creates a redundant activity event.

I then re-ran the relevant M04 runtime tests and verified that normal
completion, un-completion, repeated completion, and cross-course progress
attempts behaved correctly.