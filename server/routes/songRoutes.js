const express = require('express');
const {
  getSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
  incrementPlayCount
} = require('../controllers/songController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSongs);
router.get('/:id', getSong);
router.post('/', protect, adminOnly, createSong);
router.put('/:id', protect, adminOnly, updateSong);
router.delete('/:id', protect, adminOnly, deleteSong);
router.patch('/:id/play', incrementPlayCount);

module.exports = router;
