import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Music2
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import LoadingSpinner from './LoadingSpinner';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#171a1f"/></svg>`
  );

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    shuffle,
    repeat,
    loading,
    error,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat
  } = usePlayer();

  if (!currentSong) {
    return (
      <div className="glass-strong border-t border-white/10 px-4 py-4 text-center text-sm text-[var(--text-dim)]">
        Select a song to start listening
      </div>
    );
  }

  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat;

  return (
    <div className="glass-strong border-t border-white/10 px-4 py-3 md:px-6 md:py-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        {/* Cover + meta */}
        <div className="flex items-center gap-3 min-w-0 md:w-64">
          <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden groove-ring border border-white/10">
            <img
              src={currentSong.imageUrl || FALLBACK_IMAGE}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
            />
            {!currentSong.imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Music2 size={18} className="text-[var(--text-dim)]" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{currentSong.title}</p>
            <p className="text-xs text-[var(--text-dim)] truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls + progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-center gap-4 mb-1.5">
            <button
              onClick={toggleShuffle}
              aria-pressed={shuffle}
              className={`p-1.5 rounded-lg hover:bg-white/10 focus-ring ${
                shuffle ? 'text-gold' : 'text-[var(--text-dim)]'
              }`}
              aria-label="Shuffle"
            >
              <Shuffle size={16} />
            </button>
            <button
              onClick={playPrev}
              className="p-1.5 rounded-lg hover:bg-white/10 focus-ring"
              aria-label="Previous"
            >
              <SkipBack size={18} />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gold text-black flex items-center justify-center hover:bg-gold-light transition-colors focus-ring"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {loading ? (
                <LoadingSpinner label="" size={18} className="[&>span]:hidden" />
              ) : isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} className="ml-0.5" />
              )}
            </button>
            <button
              onClick={playNext}
              className="p-1.5 rounded-lg hover:bg-white/10 focus-ring"
              aria-label="Next"
            >
              <SkipForward size={18} />
            </button>
            <button
              onClick={cycleRepeat}
              aria-pressed={repeat !== 'off'}
              className={`p-1.5 rounded-lg hover:bg-white/10 focus-ring ${
                repeat !== 'off' ? 'text-gold' : 'text-[var(--text-dim)]'
              }`}
              aria-label="Repeat"
            >
              <RepeatIcon size={16} />
            </button>
          </div>
          <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} />
          {error && <p className="text-xs text-red-400 mt-1 text-center">{error}</p>}
        </div>

        {/* Volume */}
        <div className="hidden md:flex justify-end md:w-32">
          <VolumeControl
            volume={volume}
            muted={muted}
            onVolumeChange={setVolume}
            onToggleMute={toggleMute}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
