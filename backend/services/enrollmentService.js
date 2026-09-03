const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const activityService = require('./activityService');

async function selfEnroll(courseId, learnerId) {
  const course = await Course.findById(courseId);
  if (!course) return { error: 'NOT_FOUND', message: 'Course not found' };
  if (course.status !== 'PUBLISHED') return { error: 'INVALID_STATE', message: 'Enrollment is allowed only for published courses.' };
  
  const existing = await Enrollment.findOne({ courseId, learnerId });
  if (existing) return { error: 'CONFLICT', message: 'Duplicate enrollment is prohibited.' };

  const enrollment = await Enrollment.create({ courseId, learnerId });
  await activityService.logActivity(courseId, learnerId, 'ENROLLMENT_CREATED', { type: 'self' });
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
  await activityService.logActivity(courseId, instructorId, 'ENROLLMENT_CREATED', { type: 'instructor', learnerEmail });
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
  
  await activityService.logActivity(lesson.courseId, learnerId, 'PROGRESS_UPDATED', { lessonId, completed });
  return { success: true };
}

async function bulkEnroll(courseId, instructorId, emails) {
  const course = await Course.findById(courseId);
  if (!course) return { error: 'NOT_FOUND', message: 'Course not found' };
  if (course.instructorId.toString() !== instructorId) return { error: 'FORBIDDEN', message: 'You can only enroll learners in your own courses.' };
  if (course.status !== 'PUBLISHED') return { error: 'INVALID_STATE', message: 'Enrollment is allowed only for published courses.' };

  const results = [];
  for (const email of emails) {
    const learner = await User.findOne({ email });
    if (!learner) {
      results.push({ email, status: 'UNKNOWN_ADDRESS' });
      continue;
    }
    if (learner.role !== 'LEARNER') {
      // Contract just specified NEWLY_ENROLLED, ALREADY_ENROLLED, UNKNOWN_ADDRESS.
      // We can classify non-learners as UNKNOWN_ADDRESS to keep to the exact ENUM, or just add NOT_A_LEARNER.
      // I will classify as UNKNOWN_ADDRESS or skip gracefully if they are not learners.
      results.push({ email, status: 'UNKNOWN_ADDRESS' });
      continue;
    }

    const existing = await Enrollment.findOne({ courseId, learnerId: learner._id });
    if (existing) {
      results.push({ email, status: 'ALREADY_ENROLLED' });
      continue;
    }

    await Enrollment.create({ courseId, learnerId: learner._id });
    await activityService.logActivity(courseId, instructorId, 'ENROLLMENT_CREATED', { type: 'bulk', learnerEmail: email });
    results.push({ email, status: 'NEWLY_ENROLLED' });
  }

  return { results };
}

async function exportProgress(courseId, instructorId) {
  const course = await Course.findById(courseId);
  if (!course) return { error: 'NOT_FOUND', message: 'Course not found' };
  if (course.instructorId.toString() !== instructorId) return { error: 'FORBIDDEN', message: 'You can only export data for your own courses.' };

  const enrollments = await Enrollment.find({ courseId }).populate('learnerId', 'name email').lean();
  const totalLessons = await Lesson.countDocuments({ courseId });
  
  // Need to get progress for all these enrollments
  const enrollmentIds = enrollments.map(e => e._id);
  const allProgress = await Progress.find({ enrollmentId: { $in: enrollmentIds } }).lean();
  
  const progressByEnrollment = {};
  allProgress.forEach(p => {
    if (!progressByEnrollment[p.enrollmentId]) {
      progressByEnrollment[p.enrollmentId] = 0;
    }
    progressByEnrollment[p.enrollmentId]++;
  });

  const records = enrollments.map(e => {
    const completedLessons = progressByEnrollment[e._id] || 0;
    let state = 'NOT_STARTED';
    if (completedLessons > 0) {
      state = completedLessons >= totalLessons && totalLessons > 0 ? 'COMPLETED' : 'IN_PROGRESS';
    }
    
    return {
      learnerName: e.learnerId?.name || 'Unknown',
      learnerEmail: e.learnerId?.email || 'Unknown',
      enrollmentDate: e.createdAt,
      progressStatus: state,
      lessonsCompleted: completedLessons,
      totalLessons: totalLessons,
      lastActivity: e.lastProgressAt || e.createdAt
    };
  });
  
  return { records };
}

module.exports = {
  selfEnroll,
  instructorEnroll,
  getProgress,
  updateLessonProgress,
  bulkEnroll,
  exportProgress
};
