import React from 'react';
import { Play, Pause, Music2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#171a1f"/></svg>`
  );

const SongCard = ({ song, songList, layout = 'grid' }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const isActive = currentSong?._id === song._id;

  const handleClick = () => {
    if (isActive) togglePlay();
    else playSong(song, songList);
  };

  if (layout === 'row') {
    return (
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors hover:bg-white/5 focus-ring ${
          isActive ? 'bg-white/5' : ''
        }`}
      >
        <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-white/5">
          <img
            src={song.imageUrl || FALLBACK_IMAGE}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
            {isActive && isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm truncate ${isActive ? 'text-gold' : ''}`}>{song.title}</p>
          <p className="text-xs text-[var(--text-dim)] truncate">{song.artist}</p>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="group text-left glass rounded-2xl p-3 hover:bg-white/[0.07] transition-colors focus-ring"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-white/5 mb-3">
        <img
          src={song.imageUrl || FALLBACK_IMAGE}
          alt={song.title}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
        />
        {!song.imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Music2 size={28} className="text-[var(--text-dim)]" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <span className="w-10 h-10 rounded-full bg-gold text-black flex items-center justify-center shadow-lg">
            {isActive && isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </span>
        </div>
      </div>
      <p className={`text-sm font-medium truncate ${isActive ? 'text-gold' : ''}`}>{song.title}</p>
      <p className="text-xs text-[var(--text-dim)] truncate">{song.artist}</p>
    </button>
  );
};

export default SongCard;
