const dashboardService = require('../services/dashboardService');

const getDashboard = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const metrics = await dashboardService.getDashboardMetrics(instructorId);
    res.status(200).json({ success: true, data: metrics });
  } catch (err) {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ success: false, message: 'Server error', code: 'SERVER_ERROR' });
  }
};

module.exports = {
  getDashboard
};
