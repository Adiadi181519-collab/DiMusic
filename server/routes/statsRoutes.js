const express = require('express');
const { getStats } = require('../controllers/statsController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, adminOnly, getStats);

module.exports = router;
