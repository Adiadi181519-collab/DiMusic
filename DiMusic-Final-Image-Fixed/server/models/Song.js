const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    audioUrl: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    playCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

songSchema.index({ title: 'text', artist: 'text', album: 'text' });

module.exports = mongoose.model('Song', songSchema);
