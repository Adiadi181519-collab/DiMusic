const Song = require('../models/Song');

// @route GET /api/songs
const getSongs = async (req, res, next) => {
  try {
    const { search, featured, sort } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (featured === 'true') {
      query.featured = true;
    }

    let songQuery = Song.find(query);

    if (sort === 'popular') songQuery = songQuery.sort({ playCount: -1 });
    else if (sort === 'recent') songQuery = songQuery.sort({ createdAt: -1 });
    else songQuery = songQuery.sort({ createdAt: -1 });

    const songs = await songQuery;
    res.json({ success: true, count: songs.length, data: songs });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/songs/:id
const getSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, data: song });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/songs
const createSong = async (req, res, next) => {
  try {
    const { title, artist, audioUrl } = req.body;
    if (!title || !artist || !audioUrl) {
      return res.status(400).json({ success: false, message: 'title, artist and audioUrl are required' });
    }
    const song = await Song.create(req.body);
    res.status(201).json({ success: true, data: song });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/songs/:id
const updateSong = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, data: song });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/songs/:id
const deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, message: 'Song deleted', data: song });
  } catch (err) {
    next(err);
  }
};

// @route PATCH /api/songs/:id/play  (increments play count)
const incrementPlayCount = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true }
    );
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, data: song });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSongs, getSong, createSong, updateSong, deleteSong, incrementPlayCount };
