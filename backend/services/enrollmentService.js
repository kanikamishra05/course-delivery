const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const User = require('../models/User');

async function selfEnroll(courseId, learnerId) {
  const course = await Course.findById(courseId);
  if (!course) return { error: 'NOT_FOUND', message: 'Course not found' };
  if (course.status !== 'PUBLISHED') return { error: 'INVALID_STATE', message: 'Enrollment is allowed only for published courses.' };
  
  const existing = await Enrollment.findOne({ courseId, learnerId });
  if (existing) return { error: 'CONFLICT', message: 'Duplicate enrollment is prohibited.' };

  const enrollment = await Enrollment.create({ courseId, learnerId });
  return { enrollment };
}

async function instructorEnroll(courseId, instructorId, learnerEmail) {
  const course = await Course.findById(courseId);
  if (!course) return { error: 'NOT_FOUND', message: 'Course not found' };
  if (course.instructorId.toString() !== instructorId) return { error: 'FORBIDDEN', message: 'You can only enroll learners in your own courses.' };
  if (course.status !== 'PUBLISHED') return { error: 'INVALID_STATE', message: 'Enrollment is allowed only for published courses.' };

  const learner = await User.findOne({ email: learnerEmail });
  if (!learner) return { error: 'NOT_FOUND', message: 'User not found' };
  if (learner.role !== 'LEARNER') return { error: 'VALIDATION_ERROR', message: 'Only learners can be enrolled.' };
  
  const existing = await Enrollment.findOne({ courseId, learnerId: learner._id });
  if (existing) return { error: 'CONFLICT', message: 'Duplicate enrollment is prohibited.' };

  const enrollment = await Enrollment.create({ courseId, learnerId: learner._id });
  return { enrollment };
}

async function getProgress(courseId, learnerId) {
  const enrollment = await Enrollment.findOne({ courseId, learnerId });
  if (!enrollment) return { error: 'NOT_FOUND', message: 'Not enrolled in this course' };

  const totalLessons = await Lesson.countDocuments({ courseId });
  const completedRecords = await Progress.find({ enrollmentId: enrollment._id }).lean();
  const completedLessons = completedRecords.length;
  
  let state = 'NOT_STARTED';
  if (completedLessons > 0) {
    state = completedLessons >= totalLessons && totalLessons > 0 ? 'COMPLETED' : 'IN_PROGRESS';
  }
  
  const percentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
  const completedLessonIds = completedRecords.map(p => p.lessonId.toString());
  
  return {
    state,
    completedLessons,
    totalLessons,
    percentage,
    completedLessonIds
  };
}

async function updateLessonProgress(lessonId, learnerId, completed) {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return { error: 'NOT_FOUND', message: 'Lesson not found' };

  const enrollment = await Enrollment.findOne({ courseId: lesson.courseId, learnerId });
  if (!enrollment) return { error: 'FORBIDDEN', message: 'Must be enrolled to update progress' };

  if (completed) {
    await Progress.updateOne(
      { enrollmentId: enrollment._id, lessonId: lesson._id },
      { $setOnInsert: { enrollmentId: enrollment._id, lessonId: lesson._id, completedAt: new Date() } },
      { upsert: true }
    );
    enrollment.lastProgressAt = new Date();
    await enrollment.save();
  } else {
    await Progress.deleteOne({ enrollmentId: enrollment._id, lessonId: lesson._id });
    enrollment.lastProgressAt = new Date();
    await enrollment.save();
  }
  
  return { success: true };
}

module.exports = {
  selfEnroll,
  instructorEnroll,
  getProgress,
  updateLessonProgress
};
