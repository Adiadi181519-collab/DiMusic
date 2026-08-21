import React, { useEffect, useState } from 'react';
import { Music2, ListMusic, PlayCircle, TrendingUp } from 'lucide-react';
import { getStats } from '../services/uploadService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="glass rounded-2xl p-5 flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
      <Icon size={20} className="text-gold" />
    </div>
    <div>
      <p className="text-2xl font-display leading-tight">{value}</p>
      <p className="text-xs text-[var(--text-dim)]">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (err) {
      setError('Could not load statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Dashboard</h1>

      {loading && (
        <div className="py-16">
          <LoadingSpinner label="Loading stats…" />
        </div>
      )}

      {!loading && error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard icon={Music2} label="Total songs" value={stats.totalSongs} />
            <StatCard icon={ListMusic} label="Total playlists" value={stats.totalPlaylists} />
            <StatCard icon={PlayCircle} label="Total plays" value={stats.totalPlays} />
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-gold" />
              <h2 className="font-display text-base">Top songs</h2>
            </div>
            {stats.topSongs.length === 0 ? (
              <p className="text-sm text-[var(--text-dim)]">No plays recorded yet.</p>
            ) : (
              <div className="space-y-1">
                {stats.topSongs.map((song, i) => (
                  <div key={song._id} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                    <span className="flex items-center gap-3">
                      <span className="text-[var(--text-dim)] w-4">{i + 1}</span>
                      <span>{song.title}</span>
                      <span className="text-[var(--text-dim)]">— {song.artist}</span>
                    </span>
                    <span className="text-gold text-xs">{song.playCount} plays</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
