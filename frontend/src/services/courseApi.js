import api from './api';

// ── Courses ───────────────────────────────────────────────────────────────────

export const getCourses = (params = {}) =>
  api.get('/courses', { params });

export const getCourse = (id) =>
  api.get(`/courses/${id}`);

export const createCourse = (data) =>
  api.post('/courses', data);

export const updateCourse = (id, data) =>
  api.put(`/courses/${id}`, data);

export const publishCourse = (id) =>
  api.patch(`/courses/${id}/publish`);

export const archiveCourse = (id) =>
  api.patch(`/courses/${id}/archive`);

export const restoreCourse = (id) =>
  api.patch(`/courses/${id}/restore`);

// ── Lessons ───────────────────────────────────────────────────────────────────

export const addLesson = (courseId, data) =>
  api.post(`/courses/${courseId}/lessons`, data);

export const updateLesson = (lessonId, data) =>
  api.put(`/lessons/${lessonId}`, data);

export const deleteLesson = (lessonId) =>
  api.delete(`/lessons/${lessonId}`);

// ── Enrollment & Progress (M04) ─────────────────────────────────────────────

export const selfEnroll = (courseId) =>
  api.post(`/courses/${courseId}/self-enroll`);

export const instructorEnroll = (courseId, email) =>
  api.post(`/courses/${courseId}/enroll`, { email });

export const bulkEnroll = (courseId, emails) =>
  api.post(`/courses/${courseId}/bulk-enroll`, { emails });

export const exportCourseCsv = async (courseId) => {
  const response = await api.get(`/courses/${courseId}/export`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `course_${courseId}_progress.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const getCourseProgress = (courseId) =>
  api.get(`/courses/${courseId}/progress`);

export const updateLessonProgress = (lessonId, completed) =>
  api.patch(`/lessons/${lessonId}/progress`, { completed });
