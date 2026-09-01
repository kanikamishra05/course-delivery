const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { updateLesson, deleteLesson } = require('../controllers/courseController');

const router = express.Router();

// PUT /api/lessons/:id
router.put('/:id', authenticate, authorize('INSTRUCTOR'), updateLesson);

// DELETE /api/lessons/:id
router.delete('/:id', authenticate, authorize('INSTRUCTOR'), deleteLesson);

module.exports = router;
