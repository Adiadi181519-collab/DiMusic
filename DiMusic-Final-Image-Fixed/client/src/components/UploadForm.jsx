import React, { useState } from 'react';
import { UploadCloud, Music2, Image as ImageIcon, Check } from 'lucide-react';
import { uploadAudio, uploadImage } from '../services/uploadService';
import { getMediaUrl } from '../utils/mediaUrl';

/**
 * Reusable song form used for both "create" and "edit" in the admin panel.
 * Supports uploading files via Multer OR typing a manual path
 * (e.g. /audio/song1.mp3 for files dropped into client/public/audio).
 */
const UploadForm = ({ initialValues = {}, onSubmit, submitLabel = 'Save song' }) => {
  const [form, setForm] = useState({
    title: initialValues.title || '',
    artist: initialValues.artist || '',
    album: initialValues.album || '',
    description: initialValues.description || '',
    audioUrl: initialValues.audioUrl || '',
    imageUrl: getMediaUrl(initialValues.imageUrl) || '',
    featured: initialValues.featured || false
  });
  const [audioProgress, setAudioProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleAudioFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAudio(true);
    setError(null);
    try {
      const data = await uploadAudio(file, setAudioProgress);
      update('audioUrl', data.data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Audio upload failed');
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    try {
      const data = await uploadImage(file, setImageProgress);
      update('imageUrl', data.data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.artist || !form.audioUrl) {
      setError('Title, artist and an audio file/path are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save song');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[var(--text-dim)] mb-1.5">Title *</label>
          <input
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus-ring"
            placeholder="Song title"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-dim)] mb-1.5">Artist *</label>
          <input
            value={form.artist}
            onChange={(e) => update('artist', e.target.value)}
            className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus-ring"
            placeholder="Artist name"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-dim)] mb-1.5">Album</label>
          <input
            value={form.album}
            onChange={(e) => update('album', e.target.value)}
            className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus-ring"
            placeholder="Album (optional)"
          />
        </div>
        <label className="flex items-center gap-2 mt-6 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update('featured', e.target.checked)}
            className="accent-gold w-4 h-4"
          />
          Featured on home page
        </label>
      </div>

      <div>
        <label className="block text-xs text-[var(--text-dim)] mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={2}
          className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus-ring resize-none"
          placeholder="Short description (optional)"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Audio */}
        <div>
          <label className="block text-xs text-[var(--text-dim)] mb-1.5">Audio file *</label>
          <div className="glass rounded-xl p-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer text-gold">
              <Music2 size={16} />
              {uploadingAudio ? `Uploading… ${audioProgress}%` : 'Upload MP3 / WAV / OGG / M4A'}
              <input type="file" accept=".mp3,.wav,.ogg,.m4a,audio/*" className="hidden" onChange={handleAudioFile} />
            </label>
            <div className="mt-2">
              <input
                value={form.audioUrl}
                onChange={(e) => update('audioUrl', e.target.value)}
                placeholder="or type a path: /audio/song1.mp3"
                className="w-full bg-transparent text-xs text-[var(--text-dim)] outline-none border-t border-white/10 pt-2"
              />
            </div>
            {form.audioUrl && (
              <p className="mt-1 text-xs text-teal flex items-center gap-1">
                <Check size={12} /> {form.audioUrl}
              </p>
            )}
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-xs text-[var(--text-dim)] mb-1.5">Cover / background image</label>
          <div className="glass rounded-xl p-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer text-gold">
              <ImageIcon size={16} />
              {uploadingImage ? `Uploading… ${imageProgress}%` : 'Upload JPG / PNG / WEBP'}
              <input type="file" accept=".jpg,.jpeg,.png,.webp,image/*" className="hidden" onChange={handleImageFile} />
            </label>
            <div className="mt-2">
              <input
                value={getMediaUrl(form.imageUrl)}
                onChange={(e) => update('imageUrl', e.target.value)}
                placeholder="or type a path: /images/song1.jpg"
                className="w-full bg-transparent text-xs text-[var(--text-dim)] outline-none border-t border-white/10 pt-2"
              />
            </div>
            {getMediaUrl(form.imageUrl) && (
              <p className="mt-1 text-xs text-teal flex items-center gap-1">
                <Check size={12} /> {getMediaUrl(form.imageUrl)}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || uploadingAudio || uploadingImage}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light disabled:opacity-50 text-black font-medium text-sm px-5 py-2.5 rounded-xl transition-colors focus-ring"
      >
        <UploadCloud size={16} />
        {saving ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
};

export default UploadForm;