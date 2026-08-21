const express = require('express');
const { uploadAudio, uploadImage } = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/audio', protect, adminOnly, upload.single('audio'), uploadAudio);
router.post('/image', protect, adminOnly, upload.single('image'), uploadImage);

module.exports = router;
