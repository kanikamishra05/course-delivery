# Plan

## Work sessions

I divided the project into a few focused sessions so that each major part of the application can be completed and checked before moving to the next one.

The planned order is:

1. Foundation
2. Authentication and roles
3. Course and lesson management
4. Enrollment and learner progress
5. Search, bulk operations and dashboard
6. Activity history and alerts
7. Testing, deployment and final submission

I started with the foundation because the rest of the application depends on having the client, server and database working properly. Authentication comes next so that access rules are in place before building the main application features.

The remaining features will be added step by step as the core functionality is completed.

I will update this plan as the project progresses.

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

* Add course listing and search

* Add course details

* Add lesson creation, editing, and deletion

* Add course status changes such as publish, archive, and restore

* Add pagination and category filtering

* Add role-based access and instructor ownership checks

* Verify the course and lesson functionality

### Result

M03 was completed and verified successfully. Instructors can create and manage their own courses and lessons, while learners and public users can view published courses. Course status changes, search, filtering, pagination, validation, and access control were also tested successfully.