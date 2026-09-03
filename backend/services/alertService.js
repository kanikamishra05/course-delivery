const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Alert = require('../models/Alert');

async function getActiveAlerts(instructorId) {
  const courses = await Course.find({ instructorId }).lean();
  const courseIds = courses.map(c => c._id);

  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const staleEnrollments = await Enrollment.find({
    courseId: { $in: courseIds },
    lastProgressAt: { $lt: fourteenDaysAgo }
  }).populate('learnerId', 'name email').lean();

  if (staleEnrollments.length === 0) return [];

  const lessonCounts = await Lesson.aggregate([
    { $match: { courseId: { $in: courseIds } } },
    { $group: { _id: '$courseId', count: { $sum: 1 } } }
  ]);
  const lessonsPerCourse = {};
  lessonCounts.forEach(l => { lessonsPerCourse[l._id.toString()] = l.count; });

  const staleEnrollmentIds = staleEnrollments.map(e => e._id);

  const progressRecords = await Progress.find({ enrollmentId: { $in: staleEnrollmentIds } }).lean();
  const progressByEnrollment = {};
  progressRecords.forEach(p => {
    if (!progressByEnrollment[p.enrollmentId]) progressByEnrollment[p.enrollmentId] = 0;
    progressByEnrollment[p.enrollmentId]++;
  });

  const alerts = await Alert.find({ enrollmentId: { $in: staleEnrollmentIds } }).lean();
  const alertMap = {};
  alerts.forEach(a => { alertMap[a.enrollmentId.toString()] = a; });

  const activeAlerts = [];

  for (const enrollment of staleEnrollments) {
    const totalLessons = lessonsPerCourse[enrollment.courseId.toString()] || 0;
    const completedLessons = progressByEnrollment[enrollment._id.toString()] || 0;

    if (completedLessons > 0 && completedLessons < totalLessons) {
      const alertState = alertMap[enrollment._id.toString()];
      let isDismissedForCurrentPeriod = false;

      if (alertState && alertState.dismissedAt) {
        const lastProgress = new Date(enrollment.lastProgressAt);
        const lastDismissedProgress = new Date(alertState.lastProgressAtWhenDismissed);

        if (lastProgress <= lastDismissedProgress) {
          isDismissedForCurrentPeriod = true;
        }
      }

      if (!isDismissedForCurrentPeriod) {
        const course = courses.find(c => c._id.toString() === enrollment.courseId.toString());
        activeAlerts.push({
          _id: enrollment._id, // use enrollmentId as the alert ID for dismissal
          enrollmentId: enrollment._id,
          learner: enrollment.learnerId,
          course: {
            _id: course._id,
            title: course.title
          },
          lastProgressAt: enrollment.lastProgressAt,
          daysInactive: Math.floor((Date.now() - new Date(enrollment.lastProgressAt).getTime()) / (1000 * 60 * 60 * 24))
        });
      }
    }
  }

  return activeAlerts;
}

async function dismissAlert(instructorId, enrollmentId) {
  // Verify ownership
  const enrollment = await Enrollment.findById(enrollmentId).populate('courseId');
  if (!enrollment) return { error: 'NOT_FOUND', message: 'Enrollment not found' };
  
  if (enrollment.courseId.instructorId.toString() !== instructorId) {
    return { error: 'FORBIDDEN', message: 'Not authorized to dismiss this alert' };
  }

  await Alert.updateOne(
    { enrollmentId },
    { 
      $set: { 
        dismissedAt: new Date(),
        lastProgressAtWhenDismissed: enrollment.lastProgressAt
      } 
    },
    { upsert: true }
  );

  return { success: true };
}

module.exports = {
  getActiveAlerts,
  dismissAlert
};
