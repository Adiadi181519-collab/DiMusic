const Song = require('../models/Song');
const Playlist = require('../models/Playlist');

// @route GET /api/stats
const getStats = async (req, res, next) => {
  try {
    const [totalSongs, totalPlaylists, playAgg] = await Promise.all([
      Song.countDocuments(),
      Playlist.countDocuments(),
      Song.aggregate([{ $group: { _id: null, totalPlays: { $sum: '$playCount' } } }])
    ]);

    const totalPlays = playAgg[0]?.totalPlays || 0;
    const topSongs = await Song.find().sort({ playCount: -1 }).limit(5);

    res.json({
      success: true,
      data: { totalSongs, totalPlaylists, totalPlays, topSongs }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
