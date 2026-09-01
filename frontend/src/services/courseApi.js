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
