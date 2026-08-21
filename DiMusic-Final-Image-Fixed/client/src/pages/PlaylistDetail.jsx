import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, ListMusic } from 'lucide-react';
import { getPlaylist } from '../services/playlistService';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { getMediaUrl } from '../utils/mediaUrl';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#171a1f"/></svg>`
  );

const PlaylistDetail = () => {
  const { id } = useParams();
  const { playSong } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPlaylist(id);
      setPlaylist(res.data);
    } catch (err) {
      setError('Could not load this playlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner label="Loading playlist…" />
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!playlist) return null;

  return (
    <div>
      <Link to="/playlists" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-dim)] hover:text-white mb-6 focus-ring">
        <ArrowLeft size={16} /> Back to playlists
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5 shrink-0 relative">
          <img
            src={getMediaUrl(playlist.imageUrl) || FALLBACK_IMAGE}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
          />
          {!getMediaUrl(playlist.imageUrl) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <ListMusic size={30} className="text-[var(--text-dim)]" />
            </div>
          )}
        </div>
        <div>
          <h1 className="font-display text-2xl mb-1">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-sm text-[var(--text-dim)] mb-3 max-w-md">{playlist.description}</p>
          )}
          <p className="text-xs text-[var(--text-dim)] mb-4">
            {playlist.songs.length} song{playlist.songs.length === 1 ? '' : 's'}
          </p>
          {playlist.songs.length > 0 && (
            <button
              onClick={() => playSong(playlist.songs[0], playlist.songs)}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-black font-medium px-5 py-2.5 rounded-full transition-colors focus-ring"
            >
              <Play size={16} /> Play all
            </button>
          )}
        </div>
      </div>

      {playlist.songs.length === 0 ? (
        <EmptyState title="This playlist is empty" description="Add songs to it from the admin panel." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlist.songs.map((song) => (
            <SongCard key={song._id} song={song} songList={playlist.songs} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;