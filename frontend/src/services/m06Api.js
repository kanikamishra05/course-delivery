import api from './api';

export const getCourseActivity = (courseId, limit = 50) => 
  api.get(`/activity/${courseId}`, { params: { limit } });

export const addCourseComment = (courseId, comment) => 
  api.post(`/activity/${courseId}/comments`, { comment });

export const getActiveAlerts = () => 
  api.get('/alerts');

export const dismissAlert = (enrollmentId) => 
  api.patch(`/alerts/${enrollmentId}/dismiss`);
