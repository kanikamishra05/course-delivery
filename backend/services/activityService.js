const ActivityLog = require('../models/ActivityLog');

/**
 * Log an activity event.
 * @param {string} courseId
 * @param {string} actorId
 * @param {string} eventType
 * @param {Object} metadata
 */
async function logActivity(courseId, actorId, eventType, metadata = {}) {
  try {
    await ActivityLog.create({
      courseId,
      actorId,
      eventType,
      metadata
    });
  } catch (error) {
    console.error(`Failed to log activity [${eventType}] for course ${courseId}:`, error);
  }
}

/**
 * Retrieve activity history for a specific course.
 * @param {string} courseId 
 * @param {number} limit 
 */
async function getCourseActivity(courseId, limit = 50) {
  return ActivityLog.find({ courseId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('actorId', 'name email role')
    .lean();
}

/**
 * Add a comment as an activity.
 * @param {string} courseId
 * @param {string} actorId
 * @param {string} comment
 */
async function addComment(courseId, actorId, comment) {
  if (!comment || comment.trim().length === 0) {
    throw new Error('Comment text is required');
  }
  return ActivityLog.create({
    courseId,
    actorId,
    eventType: 'COMMENT',
    metadata: { text: comment.trim() }
  });
}

module.exports = {
  logActivity,
  getCourseActivity,
  addComment
};
