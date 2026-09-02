const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { getDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/', authenticate, authorize('INSTRUCTOR'), getDashboard);

module.exports = router;
