const express = require('express');
const authenticate = require('../middleware/authenticate');
const { getCourseActivity, addCourseComment } = require('../controllers/activityController');

const router = express.Router();

router.get('/:courseId', authenticate, getCourseActivity);
router.post('/:courseId/comments', authenticate, addCourseComment);

module.exports = router;
