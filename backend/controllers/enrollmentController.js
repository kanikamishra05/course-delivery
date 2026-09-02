const enrollmentService = require('../services/enrollmentService');

const selfEnrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const learnerId = req.user.id;
    const result = await enrollmentService.selfEnroll(courseId, learnerId);
    
    if (result.error) {
      const codeMap = {
        'NOT_FOUND': 404,
        'INVALID_STATE': 400,
        'CONFLICT': 409
      };
      const status = codeMap[result.error] || 400;
      return res.status(status).json({ success: false, message: result.message, code: result.error });
    }
    
    res.status(201).json({ success: true, data: { enrollment: result.enrollment } });
  } catch (err) {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

const enrollLearner = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user.id;
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Learner email is required', code: 'VALIDATION_ERROR' });
    }
    
    const result = await enrollmentService.instructorEnroll(courseId, instructorId, email);
    
    if (result.error) {
      const codeMap = {
        'NOT_FOUND': 404,
        'FORBIDDEN': 403,
        'INVALID_STATE': 400,
        'VALIDATION_ERROR': 400,
        'CONFLICT': 409
      };
      const status = codeMap[result.error] || 400;
      return res.status(status).json({ success: false, message: result.message, code: result.error });
    }
    
    res.status(201).json({ success: true, data: { enrollment: result.enrollment } });
  } catch (err) {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const learnerId = req.user.id;
    
    const result = await enrollmentService.getProgress(courseId, learnerId);
    
    if (result.error) {
      if (result.error === 'NOT_FOUND') return res.status(404).json({ success: false, message: result.message, code: result.error });
      return res.status(400).json({ success: false, message: result.message, code: result.error });
    }
    
    res.status(200).json({ success: true, data: { progress: result } });
  } catch (err) {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { id: lessonId } = req.params;
    const learnerId = req.user.id;
    const { completed } = req.body;
    
    if (completed === undefined) {
      return res.status(400).json({ success: false, message: 'completed boolean is required', code: 'VALIDATION_ERROR' });
    }
    
    const result = await enrollmentService.updateLessonProgress(lessonId, learnerId, completed);
    
    if (result.error) {
      const codeMap = {
        'NOT_FOUND': 404,
        'FORBIDDEN': 403
      };
      const status = codeMap[result.error] || 400;
      return res.status(status).json({ success: false, message: result.message, code: result.error });
    }
    
    res.status(200).json({ success: true, data: { message: 'Progress updated' } });
  } catch (err) {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

const bulkEnrollLearners = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user.id;
    const { emails } = req.body;
    
    if (!Array.isArray(emails)) {
      return res.status(400).json({ success: false, message: 'emails must be an array', code: 'VALIDATION_ERROR' });
    }
    
    const result = await enrollmentService.bulkEnroll(courseId, instructorId, emails);
    
    if (result.error) {
      const codeMap = {
        'NOT_FOUND': 404,
        'FORBIDDEN': 403,
        'INVALID_STATE': 400
      };
      const status = codeMap[result.error] || 400;
      return res.status(status).json({ success: false, message: result.message, code: result.error });
    }
    
    res.status(200).json({ success: true, data: { results: result.results } });
  } catch (err) {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

const exportCsv = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user.id;
    
    const result = await enrollmentService.exportProgress(courseId, instructorId);
    
    if (result.error) {
      const codeMap = {
        'NOT_FOUND': 404,
        'FORBIDDEN': 403
      };
      const status = codeMap[result.error] || 400;
      return res.status(status).json({ success: false, message: result.message, code: result.error });
    }
    
    // Generate CSV
    const headers = ['Learner Name', 'Learner Email', 'Enrollment Date', 'Progress Status', 'Lessons Completed', 'Total Lessons', 'Last Activity'];
    let csv = headers.join(',') + '\n';
    
    for (const r of result.records) {
      const row = [
        `"${r.learnerName}"`,
        `"${r.learnerEmail}"`,
        `"${new Date(r.enrollmentDate).toISOString()}"`,
        `"${r.progressStatus}"`,
        r.lessonsCompleted,
        r.totalLessons,
        `"${new Date(r.lastActivity).toISOString()}"`
      ];
      csv += row.join(',') + '\n';
    }
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="course_${courseId}_progress.csv"`);
    res.status(200).send(csv);
  } catch (err) {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

module.exports = {
  selfEnrollCourse,
  enrollLearner,
  getCourseProgress,
  updateProgress,
  bulkEnrollLearners,
  exportCsv
};
