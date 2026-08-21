import React, { useEffect, useState } from 'react';
import { getPlaylists } from '../services/playlistService';
import PlaylistCard from '../components/PlaylistCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPlaylists();
      setPlaylists(res.data);
    } catch (err) {
      setError('Could not load playlists. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Playlists</h1>

      {loading && (
        <div className="py-24">
          <LoadingSpinner label="Loading playlists…" />
        </div>
      )}

      {!loading && error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && playlists.length === 0 && (
        <EmptyState
          title="No playlists yet"
          description="Create a playlist from the admin panel to group your favorite songs."
        />
      )}

      {!loading && !error && playlists.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlists.map((pl) => (
            <PlaylistCard key={pl._id} playlist={pl} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlists;
