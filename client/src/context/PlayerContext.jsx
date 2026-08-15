import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { registerPlay } from '../services/songService';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());

  const [queue, setQueue] = useState([]); // array of song objects
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off'); // 'off' | 'one' | 'all'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : null;

  // Sync audio element with state
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setLoading(false);
    };
    const handleWaiting = () => setLoading(true);
    const handleCanPlay = () => setLoading(false);
    const handleEnded = () => handleTrackEnd();
    const handleError = () => {
      setLoading(false);
      setError('Unable to load this track. Check the audio file path.');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentIndex, repeat, shuffle]);

  const loadTrack = useCallback((song, autoPlay = true) => {
    const audio = audioRef.current;
    setError(null);
    setLoading(true);
    audio.src = song.audioUrl;
    audio.load();
    if (autoPlay) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);

  const playSong = useCallback(
    (song, songList = null) => {
      const list = songList || queue;
      const idx = list.findIndex((s) => s._id === song._id);
      setQueue(list);
      setCurrentIndex(idx >= 0 ? idx : 0);
      loadTrack(song, true);
      registerPlay(song._id).catch(() => {});
    },
    [queue, loadTrack]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!currentSong) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [isPlaying, currentSong]);

  const getNextIndex = useCallback(() => {
    if (queue.length === 0) return -1;
    if (shuffle) {
      if (queue.length === 1) return 0;
      let idx = currentIndex;
      while (idx === currentIndex) {
        idx = Math.floor(Math.random() * queue.length);
      }
      return idx;
    }
    if (currentIndex + 1 < queue.length) return currentIndex + 1;
    return repeat === 'all' ? 0 : -1;
  }, [queue, currentIndex, shuffle, repeat]);

  const getPrevIndex = useCallback(() => {
    if (queue.length === 0) return -1;
    if (currentIndex - 1 >= 0) return currentIndex - 1;
    return repeat === 'all' ? queue.length - 1 : -1;
  }, [queue, currentIndex, repeat]);

  const playNext = useCallback(() => {
    const nextIdx = getNextIndex();
    if (nextIdx === -1) {
      setIsPlaying(false);
      return;
    }
    setCurrentIndex(nextIdx);
    loadTrack(queue[nextIdx], true);
    registerPlay(queue[nextIdx]._id).catch(() => {});
  }, [getNextIndex, queue, loadTrack]);

  const playPrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const prevIdx = getPrevIndex();
    if (prevIdx === -1) {
      audio.currentTime = 0;
      return;
    }
    setCurrentIndex(prevIdx);
    loadTrack(queue[prevIdx], true);
    registerPlay(queue[prevIdx]._id).catch(() => {});
  }, [getPrevIndex, queue, loadTrack]);

  const handleTrackEnd = useCallback(() => {
    if (repeat === 'one') {
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }
    playNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeat, playNext]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const toggleShuffle = () => setShuffle((s) => !s);
  const cycleRepeat = () =>
    setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'));
  const toggleMute = () => setMuted((m) => !m);

  const value = {
    queue,
    currentSong,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    shuffle,
    repeat,
    loading,
    error,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider');
  return ctx;
};
