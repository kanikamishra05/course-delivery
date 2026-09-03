const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const activityService = require('./activityService');

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildCourseQuery(query, userRole, userId) {
  const filter = {};

  if (userRole === 'INSTRUCTOR') {
    // Instructors can see all their own courses in any status,
    // or explicitly filter by status/category.
    filter.instructorId = userId;
  } else {
    // Learners and unauthenticated users only see PUBLISHED courses
    filter.status = 'PUBLISHED';
  }

  if (query.category) filter.category = query.category;
  if (query.status && userRole === 'INSTRUCTOR') filter.status = query.status;

  if (query.q) {
    filter.$or = [
      { title: { $regex: query.q, $options: 'i' } },
      { description: { $regex: query.q, $options: 'i' } },
    ];
  }

  return filter;
}

// ── Course Services ───────────────────────────────────────────────────────────

async function createCourse(instructorId, { title, description, category }) {
  const course = await Course.create({ title, description, category, instructorId, status: 'DRAFT' });
  await activityService.logActivity(course._id, instructorId, 'COURSE_CREATED', { title });
  return course;
}

async function listCourses(query, userRole, userId) {
  const filter = buildCourseQuery(query, userRole, userId);

  if (query.enrolled === 'true' && userRole === 'LEARNER' && userId) {
    const Enrollment = require('../models/Enrollment');
    const enrollments = await Enrollment.find({ learnerId: userId }, 'courseId').lean();
    const courseIds = enrollments.map(e => e.courseId);
    filter._id = { $in: courseIds };
  }

  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  const sortField = ['title', 'createdAt', 'category'].includes(query.sort) ? query.sort : 'createdAt';
  const sortOrder = query.order === 'asc' ? 1 : -1;

  const [courses, total] = await Promise.all([
    Course.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limit).lean(),
    Course.countDocuments(filter),
  ]);

  return { courses, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function getCourseById(courseId, userRole, userId) {
  const course = await Course.findById(courseId).lean();
  if (!course) return null;

  if (userRole === 'INSTRUCTOR') {
    // Instructors can only access their own courses (any status)
    if (course.instructorId.toString() !== userId) return null;
  } else {
    // Learners and unauthenticated users can only see PUBLISHED courses
    if (course.status !== 'PUBLISHED') return null;
  }

  const lessons = await Lesson.find({ courseId }).sort({ position: 1 }).lean();
  return { ...course, lessons };
}

async function updateCourse(courseId, instructorId, updates) {
  const course = await Course.findById(courseId);
  if (!course) return { error: 'NOT_FOUND' };
  if (course.instructorId.toString() !== instructorId) return { error: 'FORBIDDEN' };

  const allowed = {};
  if (updates.title !== undefined) allowed.title = updates.title;
  if (updates.description !== undefined) allowed.description = updates.description;
  if (updates.category !== undefined) allowed.category = updates.category;

  const updated = await Course.findByIdAndUpdate(courseId, allowed, { new: true, runValidators: true });
  await activityService.logActivity(courseId, instructorId, 'COURSE_UPDATED', { fields: Object.keys(allowed) });
  return { course: updated };
}

async function publishCourse(courseId, instructorId) {
  const course = await Course.findById(courseId);
  if (!course) return { error: 'NOT_FOUND' };
  if (course.instructorId.toString() !== instructorId) return { error: 'FORBIDDEN' };
  if (course.status !== 'DRAFT') return { error: 'INVALID_TRANSITION', message: 'Only DRAFT courses can be published' };

  const lessonCount = await Lesson.countDocuments({ courseId });
  if (lessonCount === 0) return { error: 'COURSE_HAS_NO_LESSONS', message: 'A course must have at least one lesson before publishing' };

  course.status = 'PUBLISHED';
  await course.save();
  await activityService.logActivity(courseId, instructorId, 'COURSE_PUBLISHED');
  return { course };
}

async function archiveCourse(courseId, instructorId) {
  const course = await Course.findById(courseId);
  if (!course) return { error: 'NOT_FOUND' };
  if (course.instructorId.toString() !== instructorId) return { error: 'FORBIDDEN' };
  if (course.status !== 'PUBLISHED') return { error: 'INVALID_TRANSITION', message: 'Only PUBLISHED courses can be archived' };

  course.status = 'ARCHIVED';
  await course.save();
  await activityService.logActivity(courseId, instructorId, 'COURSE_ARCHIVED');
  return { course };
}

async function restoreCourse(courseId, instructorId) {
  const course = await Course.findById(courseId);
  if (!course) return { error: 'NOT_FOUND' };
  if (course.instructorId.toString() !== instructorId) return { error: 'FORBIDDEN' };
  if (course.status !== 'ARCHIVED') return { error: 'INVALID_TRANSITION', message: 'Only ARCHIVED courses can be restored' };

  course.status = 'DRAFT';
  await course.save();
  await activityService.logActivity(courseId, instructorId, 'COURSE_RESTORED');
  return { course };
}

// ── Lesson Services ───────────────────────────────────────────────────────────

async function addLesson(courseId, instructorId, { title, content, position }) {
  const course = await Course.findById(courseId);
  if (!course) return { error: 'NOT_FOUND' };
  if (course.instructorId.toString() !== instructorId) return { error: 'FORBIDDEN' };

  // Auto-assign position if not provided
  let lessonPosition = position;
  if (lessonPosition === undefined || lessonPosition === null) {
    const lastLesson = await Lesson.findOne({ courseId }).sort({ position: -1 }).lean();
    lessonPosition = lastLesson ? lastLesson.position + 1 : 1;
  }

  const lesson = await Lesson.create({ courseId, title, content: content || '', position: lessonPosition });
  await activityService.logActivity(courseId, instructorId, 'LESSON_CREATED', { lessonId: lesson._id, title });
  return { lesson };
}

async function updateLesson(lessonId, instructorId, updates) {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return { error: 'NOT_FOUND' };

  const course = await Course.findById(lesson.courseId);
  if (!course) return { error: 'NOT_FOUND' };
  if (course.instructorId.toString() !== instructorId) return { error: 'FORBIDDEN' };

  const allowed = {};
  if (updates.title !== undefined) allowed.title = updates.title;
  if (updates.content !== undefined) allowed.content = updates.content;
  if (updates.position !== undefined) allowed.position = updates.position;

  const updated = await Lesson.findByIdAndUpdate(lessonId, allowed, { new: true, runValidators: true });
  await activityService.logActivity(lesson.courseId, instructorId, 'LESSON_UPDATED', { lessonId, fields: Object.keys(allowed) });
  return { lesson: updated };
}

async function deleteLesson(lessonId, instructorId) {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return { error: 'NOT_FOUND' };

  const course = await Course.findById(lesson.courseId);
  if (!course) return { error: 'NOT_FOUND' };
  if (course.instructorId.toString() !== instructorId) return { error: 'FORBIDDEN' };

  await Lesson.findByIdAndDelete(lessonId);
  await activityService.logActivity(course._id, instructorId, 'LESSON_DELETED', { lessonId, title: lesson.title });
  return { success: true };
}

module.exports = {
  createCourse,
  listCourses,
  getCourseById,
  updateCourse,
  publishCourse,
  archiveCourse,
  restoreCourse,
  addLesson,
  updateLesson,
  deleteLesson,
};
