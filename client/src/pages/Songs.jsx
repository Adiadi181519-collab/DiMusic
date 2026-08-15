import React, { useEffect, useState } from 'react';
import { getSongs } from '../services/songService';
import SongCard from '../components/SongCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import useDebounce from '../hooks/useDebounce';

const Songs = ({ search }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debouncedSearch = useDebounce(search, 300);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSongs(debouncedSearch ? { search: debouncedSearch } : {});
      setSongs(res.data);
    } catch (err) {
      setError('Could not load songs. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">All songs</h1>

      {loading && (
        <div className="py-24">
          <LoadingSpinner label="Loading songs…" />
        </div>
      )}

      {!loading && error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && songs.length === 0 && (
        <EmptyState
          title={debouncedSearch ? 'No matches found' : 'No songs yet'}
          description={
            debouncedSearch
              ? 'Try a different search term.'
              : 'Add songs from the admin panel, or drop MP3 files into client/public/audio.'
          }
        />
      )}

      {!loading && !error && songs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {songs.map((song) => (
            <SongCard key={song._id} song={song} songList={songs} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Songs;
