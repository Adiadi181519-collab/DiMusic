import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ListMusic } from 'lucide-react';
import { getPlaylists, createPlaylist, updatePlaylist, deletePlaylist } from '../services/playlistService';
import { getSongs } from '../services/songService';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { getMediaUrl } from '../utils/mediaUrl';

const PlaylistForm = ({ initialValues = {}, allSongs, onSubmit, submitLabel }) => {
  const [name, setName] = useState(initialValues.name || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [imageUrl, setImageUrl] = useState(getMediaUrl(initialValues.imageUrl) || '');
  const [selected, setSelected] = useState(
    new Set((initialValues.songs || []).map((s) => (typeof s === 'string' ? s : s._id)))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const toggleSong = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError('Playlist name is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ name, description, imageUrl, songs: Array.from(selected) });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save playlist');
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
      <div>
        <label className="block text-xs text-[var(--text-dim)] mb-1.5">Name *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus-ring"
          placeholder="Playlist name"
        />
      </div>
      <div>
        <label className="block text-xs text-[var(--text-dim)] mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus-ring resize-none"
        />
      </div>
      <div>
        <label className="block text-xs text-[var(--text-dim)] mb-1.5">Cover image path</label>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="/images/playlist-cover.jpg"
          className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus-ring"
        />
      </div>
      <div>
        <label className="block text-xs text-[var(--text-dim)] mb-1.5">Songs</label>
        <div className="glass rounded-xl max-h-48 overflow-y-auto divide-y divide-white/5">
          {allSongs.length === 0 && (
            <p className="text-sm text-[var(--text-dim)] p-3">Add some songs first.</p>
          )}
          {allSongs.map((song) => (
            <label key={song._id} className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-white/5">
              <input
                type="checkbox"
                checked={selected.has(song._id)}
                onChange={() => toggleSong(song._id)}
                className="accent-gold w-4 h-4"
              />
              <span className="truncate">{song.title}</span>
              <span className="text-[var(--text-dim)] truncate">— {song.artist}</span>
            </label>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light disabled:opacity-50 text-black font-medium text-sm px-5 py-2.5 rounded-xl transition-colors focus-ring"
      >
        {saving ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
};

const AdminPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [plRes, songRes] = await Promise.all([getPlaylists(), getSongs()]);
      setPlaylists(plRes.data);
      setSongs(songRes.data);
    } catch (err) {
      setError('Could not load playlists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (pl) => {
    setEditing(pl);
    setModalOpen(true);
  };

  const handleSubmit = async (form) => {
    if (editing) await updatePlaylist(editing._id, form);
    else await createPlaylist(form);
    setModalOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePlaylist(deleteTarget._id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError('Could not delete playlist.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Playlists</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-black font-medium text-sm px-4 py-2 rounded-xl transition-colors focus-ring"
        >
          <Plus size={16} /> New playlist
        </button>
      </div>

      {loading && (
        <div className="py-16">
          <LoadingSpinner label="Loading playlists…" />
        </div>
      )}

      {!loading && error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && playlists.length === 0 && (
        <EmptyState icon={ListMusic} title="No playlists yet" description="Create your first playlist." />
      )}

      {!loading && !error && playlists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((pl) => (
            <div key={pl._id} className="glass rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{pl.name}</p>
                <p className="text-xs text-[var(--text-dim)]">{pl.songs.length} songs</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(pl)} className="p-1.5 rounded-lg hover:bg-white/10 focus-ring">
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteTarget(pl)}
                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 focus-ring"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit playlist' : 'New playlist'}>
        <PlaylistForm
          key={editing?._id || 'new'}
          initialValues={editing || {}}
          allSongs={songs}
          onSubmit={handleSubmit}
          submitLabel={editing ? 'Save changes' : 'Create playlist'}
        />
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete playlist"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl text-sm hover:bg-white/10 focus-ring">
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl text-sm bg-red-500/90 hover:bg-red-500 text-white focus-ring"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-[var(--text-dim)]">
          Are you sure you want to delete <span className="text-white">{deleteTarget?.name}</span>?
        </p>
      </Modal>
    </div>
  );
};

export default AdminPlaylists;