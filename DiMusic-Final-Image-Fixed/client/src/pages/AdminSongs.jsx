import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Music2 } from 'lucide-react';
import { getSongs, createSong, updateSong, deleteSong } from '../services/songService';
import Modal from '../components/Modal';
import UploadForm from '../components/UploadForm';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const AdminSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSongs();
      setSongs(res.data);
    } catch (err) {
      setError('Could not load songs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingSong(null);
    setModalOpen(true);
  };

  const openEdit = (song) => {
    setEditingSong(song);
    setModalOpen(true);
  };

  const handleSubmit = async (form) => {
    if (editingSong) {
      await updateSong(editingSong._id, form);
    } else {
      await createSong(form);
    }
    setModalOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSong(deleteTarget._id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError('Could not delete song.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Songs</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-black font-medium text-sm px-4 py-2 rounded-xl transition-colors focus-ring"
        >
          <Plus size={16} /> Add song
        </button>
      </div>

      {loading && (
        <div className="py-16">
          <LoadingSpinner label="Loading songs…" />
        </div>
      )}

      {!loading && error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && songs.length === 0 && (
        <EmptyState
          icon={Music2}
          title="No songs yet"
          description="Add your first song to start building your library."
          action={
            <button onClick={openCreate} className="text-sm text-gold underline underline-offset-2">
              Add a song
            </button>
          }
        />
      )}

      {!loading && !error && songs.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--text-dim)] border-b border-white/10">
                <th className="px-4 py-3 font-normal">Title</th>
                <th className="px-4 py-3 font-normal hidden sm:table-cell">Artist</th>
                <th className="px-4 py-3 font-normal hidden md:table-cell">Album</th>
                <th className="px-4 py-3 font-normal">Plays</th>
                <th className="px-4 py-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr key={song._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{song.title}</p>
                      {song.featured && <span className="text-[10px] text-gold">Featured</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-[var(--text-dim)]">{song.artist}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-[var(--text-dim)]">{song.album || '—'}</td>
                  <td className="px-4 py-3 text-[var(--text-dim)]">{song.playCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(song)}
                        className="p-1.5 rounded-lg hover:bg-white/10 focus-ring"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(song)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 focus-ring"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingSong ? 'Edit song' : 'Add song'}>
        <UploadForm
          key={editingSong?._id || 'new'}
          initialValues={editingSong || {}}
          onSubmit={handleSubmit}
          submitLabel={editingSong ? 'Save changes' : 'Add song'}
        />
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete song"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-xl text-sm hover:bg-white/10 focus-ring"
            >
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
          Are you sure you want to delete <span className="text-white">{deleteTarget?.title}</span>? This cannot
          be undone.
        </p>
      </Modal>
    </div>
  );
};

export default AdminSongs;
