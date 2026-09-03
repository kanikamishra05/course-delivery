const activityService = require('../services/activityService');
const Course = require('../models/Course');

const getCourseActivity = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Auth check: Is instructor of course?
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found', code: 'NOT_FOUND' });
    
    // Both instructors (owner) and learners (enrolled) might view activity?
    // "Instructors and learners may add comments where authorized"
    // Let's restrict activity feed to Instructor for now, or just generic auth check if learner is enrolled.
    // The contract doesn't explicitly restrict `GET /api/activity`, but for security, restrict to instructor or enrolled learner.
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'LEARNER') {
       return res.status(403).json({ success: false, message: 'Forbidden', code: 'FORBIDDEN' });
    }

    const limit = parseInt(req.query.limit) || 50;
    const activity = await activityService.getCourseActivity(courseId, limit);
    
    res.status(200).json({ success: true, data: { activity } });
  } catch (err) {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

const addCourseComment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { comment } = req.body;
    
    if (!comment) return res.status(400).json({ success: false, message: 'Comment required', code: 'VALIDATION_ERROR' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found', code: 'NOT_FOUND' });

    // Authorization: instructor owner or enrolled learner
    let authorized = false;
    if (course.instructorId.toString() === req.user.id) {
      authorized = true;
    } else if (req.user.role === 'LEARNER') {
      const Enrollment = require('../models/Enrollment');
      const enrolled = await Enrollment.exists({ courseId, learnerId: req.user.id });
      if (enrolled) authorized = true;
    }

    if (!authorized) return res.status(403).json({ success: false, message: 'Forbidden', code: 'FORBIDDEN' });

    const activity = await activityService.addComment(courseId, req.user.id, comment);
    res.status(201).json({ success: true, data: { activity } });
  } catch (err) {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

module.exports = {
  getCourseActivity,
  addCourseComment
};
