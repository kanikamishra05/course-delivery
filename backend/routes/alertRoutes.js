const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { getActiveAlerts, dismissAlert } = require('../controllers/alertController');

const router = express.Router();

router.get('/', authenticate, authorize('INSTRUCTOR'), getActiveAlerts);
router.patch('/:id/dismiss', authenticate, authorize('INSTRUCTOR'), dismissAlert);

module.exports = router;
