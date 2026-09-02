const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');

async function getDashboardMetrics(instructorId) {
  // 1. Published courses
  const publishedCourses = await Course.find({ instructorId, status: 'PUBLISHED' }).lean();
  const courseIds = publishedCourses.map(c => c._id);
  const totalPublishedCourses = courseIds.length;

  // 2. Enrollments in these courses
  const enrollments = await Enrollment.find({ courseId: { $in: courseIds } }).lean();
  
  // Need to get unique learners
  const learnerSet = new Set(enrollments.map(e => e.learnerId.toString()));
  const totalLearners = learnerSet.size;

  // 3. Progress data for these enrollments
  // We need to count completions this month and learners in progress.
  // We also need completions over the last 8 weeks.
  // Note: progress calculation per enrollment requires knowing total lessons for that course.
  
  // Map courseId -> total lessons
  const Lesson = require('../models/Lesson');
  const lessons = await Lesson.aggregate([
    { $match: { courseId: { $in: courseIds } } },
    { $group: { _id: '$courseId', count: { $sum: 1 } } }
  ]);
  const lessonCounts = {};
  lessons.forEach(l => { lessonCounts[l._id.toString()] = l.count; });
  
  const enrollmentIds = enrollments.map(e => e._id);
  const progressRecords = await Progress.find({ enrollmentId: { $in: enrollmentIds } }).lean();
  
  const progressByEnrollment = {};
  progressRecords.forEach(p => {
    if (!progressByEnrollment[p.enrollmentId]) {
      progressByEnrollment[p.enrollmentId] = [];
    }
    progressByEnrollment[p.enrollmentId].push(p);
  });

  let completionsThisMonth = 0;
  let learnersInProgress = 0;
  
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // For the 8-week breakdown
  // Let's create buckets for the last 8 weeks
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
  const eightWeeksAgo = new Date(now.getTime() - (8 * MS_PER_WEEK));
  const completionsOver8Weeks = [0, 0, 0, 0, 0, 0, 0, 0];
  
  // Calculate states
  enrollments.forEach(e => {
    const pRecords = progressByEnrollment[e._id] || [];
    const completedCount = pRecords.length;
    const totalCount = lessonCounts[e.courseId.toString()] || 0;
    
    if (completedCount > 0 && totalCount > 0) {
      if (completedCount >= totalCount) {
        // Find when they completed the last lesson
        // Just use the latest completedAt from their progress records
        let latestCompletion = new Date(0);
        pRecords.forEach(pr => {
          const ca = new Date(pr.completedAt);
          if (ca > latestCompletion) latestCompletion = ca;
        });

        if (latestCompletion >= startOfMonth) {
          completionsThisMonth++;
        }
        
        if (latestCompletion >= eightWeeksAgo) {
          const weeksAgo = Math.floor((now - latestCompletion) / MS_PER_WEEK);
          if (weeksAgo >= 0 && weeksAgo < 8) {
            completionsOver8Weeks[7 - weeksAgo]++; // index 7 is current week, 0 is 8 weeks ago
          }
        }
      } else {
        learnersInProgress++;
      }
    }
  });

  return {
    headline: {
      totalLearners,
      publishedCourses: totalPublishedCourses,
      completionsThisMonth,
      learnersInProgress
    },
    breakdown: {
      completionsOver8Weeks // array of 8 integers
    }
  };
}

module.exports = {
  getDashboardMetrics
};
