const express = require('express');
const authenticate = require('../middleware/authenticate');
const optionalAuthenticate = require('../middleware/optionalAuthenticate');
const authorize = require('../middleware/authorize');
const {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  publishCourse,
  archiveCourse,
  restoreCourse,
  addLesson,
} = require('../controllers/courseController');

const router = express.Router();

// ── Course routes ─────────────────────────────────────────────────────────────

// GET /api/courses — public; auth optional (instructors see own, others see PUBLISHED)
router.get('/', optionalAuthenticate, getCourses);

// POST /api/courses — INSTRUCTOR only
router.post('/', authenticate, authorize('INSTRUCTOR'), createCourse);

// GET /api/courses/:id — public; auth optional
router.get('/:id', optionalAuthenticate, getCourse);

// PUT /api/courses/:id — INSTRUCTOR only (own course)
router.put('/:id', authenticate, authorize('INSTRUCTOR'), updateCourse);

// State machine transitions — INSTRUCTOR only (own course)
router.patch('/:id/publish', authenticate, authorize('INSTRUCTOR'), publishCourse);
router.patch('/:id/archive', authenticate, authorize('INSTRUCTOR'), archiveCourse);
router.patch('/:id/restore', authenticate, authorize('INSTRUCTOR'), restoreCourse);

// POST /api/courses/:courseId/lessons — INSTRUCTOR only (own course)
router.post('/:courseId/lessons', authenticate, authorize('INSTRUCTOR'), addLesson);

module.exports = router;
