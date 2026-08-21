const Playlist = require('../models/Playlist');

// @route GET /api/playlists
const getPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find().populate('songs').sort({ createdAt: -1 });
    res.json({ success: true, count: playlists.length, data: playlists });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/playlists/:id
const getPlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs');
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found' });
    res.json({ success: true, data: playlist });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/playlists
const createPlaylist = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'name is required' });
    const playlist = await Playlist.create(req.body);
    res.status(201).json({ success: true, data: playlist });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/playlists/:id
const updatePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('songs');
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found' });
    res.json({ success: true, data: playlist });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/playlists/:id
const deletePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found' });
    res.json({ success: true, message: 'Playlist deleted', data: playlist });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPlaylists, getPlaylist, createPlaylist, updatePlaylist, deletePlaylist };
