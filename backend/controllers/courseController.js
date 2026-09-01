const courseService = require('../services/courseService');

// ── Courses ──────────────────────────────────────────────────────────────────

// @route  GET /api/courses
// @access Public (LEARNER sees only PUBLISHED; INSTRUCTOR sees own courses)
const getCourses = async (req, res) => {
  try {
    const userRole = req.user?.role || null;
    const userId = req.user?.id || null;
    const result = await courseService.listCourses(req.query, userRole, userId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

// @route  POST /api/courses
// @access INSTRUCTOR only
const createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: 'title, description, and category are required', code: 'VALIDATION_ERROR' });
    }
    const course = await courseService.createCourse(req.user.id, { title, description, category });
    res.status(201).json({ success: true, data: { course } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

// @route  GET /api/courses/:id
// @access Public (learners/unauthenticated see PUBLISHED only; instructors see own)
const getCourse = async (req, res) => {
  try {
    const userRole = req.user?.role || null;
    const userId = req.user?.id || null;
    const course = await courseService.getCourseById(req.params.id, userRole, userId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found', code: 'NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: { course } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

// @route  PUT /api/courses/:id
// @access INSTRUCTOR only (own courses)
const updateCourse = async (req, res) => {
  try {
    const result = await courseService.updateCourse(req.params.id, req.user.id, req.body);
    if (result.error === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Course not found', code: 'NOT_FOUND' });
    if (result.error === 'FORBIDDEN') return res.status(403).json({ success: false, message: 'You do not own this course', code: 'FORBIDDEN' });
    res.status(200).json({ success: true, data: { course: result.course } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

// @route  PATCH /api/courses/:id/publish
// @access INSTRUCTOR only (own courses)
const publishCourse = async (req, res) => {
  try {
    const result = await courseService.publishCourse(req.params.id, req.user.id);
    if (result.error === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Course not found', code: 'NOT_FOUND' });
    if (result.error === 'FORBIDDEN') return res.status(403).json({ success: false, message: 'You do not own this course', code: 'FORBIDDEN' });
    if (result.error === 'INVALID_TRANSITION') return res.status(422).json({ success: false, message: result.message, code: 'INVALID_TRANSITION' });
    if (result.error === 'COURSE_HAS_NO_LESSONS') return res.status(422).json({ success: false, message: result.message, code: 'COURSE_HAS_NO_LESSONS' });
    res.status(200).json({ success: true, data: { course: result.course } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

// @route  PATCH /api/courses/:id/archive
// @access INSTRUCTOR only (own courses)
const archiveCourse = async (req, res) => {
  try {
    const result = await courseService.archiveCourse(req.params.id, req.user.id);
    if (result.error === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Course not found', code: 'NOT_FOUND' });
    if (result.error === 'FORBIDDEN') return res.status(403).json({ success: false, message: 'You do not own this course', code: 'FORBIDDEN' });
    if (result.error === 'INVALID_TRANSITION') return res.status(422).json({ success: false, message: result.message, code: 'INVALID_TRANSITION' });
    res.status(200).json({ success: true, data: { course: result.course } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

// @route  PATCH /api/courses/:id/restore
// @access INSTRUCTOR only (own courses)
const restoreCourse = async (req, res) => {
  try {
    const result = await courseService.restoreCourse(req.params.id, req.user.id);
    if (result.error === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Course not found', code: 'NOT_FOUND' });
    if (result.error === 'FORBIDDEN') return res.status(403).json({ success: false, message: 'You do not own this course', code: 'FORBIDDEN' });
    if (result.error === 'INVALID_TRANSITION') return res.status(422).json({ success: false, message: result.message, code: 'INVALID_TRANSITION' });
    res.status(200).json({ success: true, data: { course: result.course } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

// ── Lessons ───────────────────────────────────────────────────────────────────

// @route  POST /api/courses/:courseId/lessons
// @access INSTRUCTOR only (own courses)
const addLesson = async (req, res) => {
  try {
    const { title, content, position } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'title is required', code: 'VALIDATION_ERROR' });
    }
    const result = await courseService.addLesson(req.params.courseId, req.user.id, { title, content, position });
    if (result.error === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Course not found', code: 'NOT_FOUND' });
    if (result.error === 'FORBIDDEN') return res.status(403).json({ success: false, message: 'You do not own this course', code: 'FORBIDDEN' });
    res.status(201).json({ success: true, data: { lesson: result.lesson } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

// @route  PUT /api/lessons/:id
// @access INSTRUCTOR only (own lessons via course ownership)
const updateLesson = async (req, res) => {
  try {
    const result = await courseService.updateLesson(req.params.id, req.user.id, req.body);
    if (result.error === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Lesson not found', code: 'NOT_FOUND' });
    if (result.error === 'FORBIDDEN') return res.status(403).json({ success: false, message: 'You do not own this lesson', code: 'FORBIDDEN' });
    res.status(200).json({ success: true, data: { lesson: result.lesson } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

// @route  DELETE /api/lessons/:id
// @access INSTRUCTOR only (own lessons via course ownership)
const deleteLesson = async (req, res) => {
  try {
    const result = await courseService.deleteLesson(req.params.id, req.user.id);
    if (result.error === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Lesson not found', code: 'NOT_FOUND' });
    if (result.error === 'FORBIDDEN') return res.status(403).json({ success: false, message: 'You do not own this lesson', code: 'FORBIDDEN' });
    res.status(200).json({ success: true, data: { message: 'Lesson deleted' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

module.exports = {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  publishCourse,
  archiveCourse,
  restoreCourse,
  addLesson,
  updateLesson,
  deleteLesson,
};
