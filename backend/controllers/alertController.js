const alertService = require('../services/alertService');

const getActiveAlerts = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const alerts = await alertService.getActiveAlerts(instructorId);
    res.status(200).json({ success: true, data: { alerts } });
  } catch (err) {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

const dismissAlert = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const { id: enrollmentId } = req.params; // We are using enrollmentId as the alert ID for dismissal

    const result = await alertService.dismissAlert(instructorId, enrollmentId);
    
    if (result.error) {
      const codeMap = {
        'NOT_FOUND': 404,
        'FORBIDDEN': 403
      };
      const status = codeMap[result.error] || 400;
      return res.status(status).json({ success: false, message: result.message, code: result.error });
    }
    
    res.status(200).json({ success: true, data: { message: 'Alert dismissed' } });
  } catch (err) {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

module.exports = {
  getActiveAlerts,
  dismissAlert
};
