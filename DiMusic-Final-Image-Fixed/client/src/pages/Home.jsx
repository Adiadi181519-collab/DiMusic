import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Disc3, ArrowRight } from 'lucide-react';
import { getSongs } from '../services/songService';
import { getPlaylists } from '../services/playlistService';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import PlaylistCard from '../components/PlaylistCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { getMediaUrl } from '../utils/mediaUrl';

const Section = ({ title, viewAllTo, children }) => (
  <section className="mb-10">
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display text-xl">{title}</h2>
      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="text-xs text-[var(--text-dim)] hover:text-gold flex items-center gap-1 focus-ring"
        >
          View all <ArrowRight size={12} />
        </Link>
      )}
    </div>
    {children}
  </section>
);

const Home = () => {
  const { playSong } = usePlayer();
  const [featured, setFeatured] = useState([]);
  const [popular, setPopular] = useState([]);
  const [recent, setRecent] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [featuredRes, popularRes, recentRes, playlistsRes] = await Promise.all([
        getSongs({ featured: 'true' }),
        getSongs({ sort: 'popular' }),
        getSongs({ sort: 'recent' }),
        getPlaylists()
      ]);
      setFeatured(featuredRes.data);
      setPopular(popularRes.data.slice(0, 6));
      setRecent(recentRes.data.slice(0, 6));
      setPlaylists(playlistsRes.data.slice(0, 6));
    } catch (err) {
      setError('Could not load the library. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner label="Loading your library…" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadAll} />;
  }

  const hero = featured[0] || recent[0];
  const allSongs = [...featured, ...popular, ...recent];

  return (
    <div>
      {/* Hero */}
      {hero ? (
        <div
          className="relative rounded-3xl overflow-hidden mb-10 min-h-[260px] flex items-end p-6 md:p-10 groove-ring"
          style={{
            backgroundImage: getMediaUrl(hero.imageUrl) ? `url(${getMediaUrl(hero.imageUrl)})` : undefined,
            backgroundColor: '#14171c',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
          <div className="relative z-10 max-w-lg">
            <span className="text-xs uppercase tracking-widest text-gold flex items-center gap-2 mb-3">
              <Disc3 size={14} /> Now spinning
            </span>
            <h1 className="font-display text-3xl md:text-4xl mb-2 leading-tight">{hero.title}</h1>
            <p className="text-[var(--text-dim)] mb-6">{hero.artist}</p>
            <button
              onClick={() => playSong(hero, allSongs)}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-black font-medium px-5 py-2.5 rounded-full transition-colors focus-ring"
            >
              <Play size={16} /> Play now
            </button>
          </div>
        </div>
      ) : (
        <EmptyState
          title="Your library is empty"
          description="Add songs from the admin panel, or drop MP3 files into client/public/audio and register them."
        />
      )}

      {featured.length > 0 && (
        <Section title="Featured songs" viewAllTo="/songs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featured.slice(0, 6).map((song) => (
              <SongCard key={song._id} song={song} songList={allSongs} />
            ))}
          </div>
        </Section>
      )}

      {popular.length > 0 && (
        <Section title="Popular songs" viewAllTo="/songs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {popular.map((song) => (
              <SongCard key={song._id} song={song} songList={allSongs} />
            ))}
          </div>
        </Section>
      )}

      {recent.length > 0 && (
        <Section title="Recently added" viewAllTo="/songs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recent.map((song) => (
              <SongCard key={song._id} song={song} songList={allSongs} />
            ))}
          </div>
        </Section>
      )}

      {playlists.length > 0 && (
        <Section title="Playlists" viewAllTo="/playlists">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {playlists.map((pl) => (
              <PlaylistCard key={pl._id} playlist={pl} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default Home;