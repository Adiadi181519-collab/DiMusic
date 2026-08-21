const express = require('express');
const {
  getPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
} = require('../controllers/playlistController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPlaylists);
router.get('/:id', getPlaylist);
router.post('/', protect, adminOnly, createPlaylist);
router.put('/:id', protect, adminOnly, updatePlaylist);
router.delete('/:id', protect, adminOnly, deletePlaylist);

module.exports = router;
