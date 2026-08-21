import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";

import { registerPlay } from "../services/songService";

const PlayerContext = createContext(null);

/*
  Production Backend API
  Render Environment Variable:
  VITE_API_URL=https://dimusic.onrender.com/api
*/
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://dimusic.onrender.com/api";

// API URL se backend base URL nikalo
// https://dimusic.onrender.com/api
// ↓
// https://dimusic.onrender.com
const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const getAudioUrl = (audioUrl) => {
  if (!audioUrl) return "";

  // Already full URL hai
  if (
    audioUrl.startsWith("http://") ||
    audioUrl.startsWith("https://")
  ) {
    return audioUrl;
  }

  // /uploads/audio/song.mp3
  if (audioUrl.startsWith("/")) {
    return `${BACKEND_URL}${audioUrl}`;
  }

  // uploads/audio/song.mp3
  return `${BACKEND_URL}/${audioUrl}`;
};

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentSong =
    currentIndex >= 0 ? queue[currentIndex] : null;

  /*
    Volume Control
  */
  useEffect(() => {
    const audio = audioRef.current;

    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  /*
    Audio Event Listeners
  */
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setLoading(false);
      setError(null);
    };

    const handleWaiting = () => {
      setLoading(true);
    };

    const handleCanPlay = () => {
      setLoading(false);
    };

    const handleEnded = () => {
      handleTrackEnd();
    };

    const handleError = () => {
      setLoading(false);
      setIsPlaying(false);

      console.error("Audio loading failed:", {
        src: audio.currentSrc || audio.src,
        error: audio.error
      });

      let message =
        "Unable to load this track. Please try again.";

      if (audio.error) {
        switch (audio.error.code) {
          case 1:
            message = "Audio loading was aborted.";
            break;

          case 2:
            message =
              "Network error. Unable to load this track.";
            break;

          case 3:
            message =
              "The audio file could not be decoded.";
            break;

          case 4:
            message =
              "Audio file not found or unsupported format.";
            break;

          default:
            message =
              "Unable to load this track. Please try again.";
        }
      }

      setError(message);
    };

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    audio.addEventListener(
      "waiting",
      handleWaiting
    );

    audio.addEventListener(
      "canplay",
      handleCanPlay
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    audio.addEventListener(
      "error",
      handleError
    );

    return () => {
      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      audio.removeEventListener(
        "waiting",
        handleWaiting
      );

      audio.removeEventListener(
        "canplay",
        handleCanPlay
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );

      audio.removeEventListener(
        "error",
        handleError
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentIndex, repeat, shuffle]);

  /*
    Load Track
  */
  const loadTrack = useCallback(
    (song, autoPlay = true) => {
      const audio = audioRef.current;

      if (!song || !song.audioUrl) {
        setError("This song does not have a valid audio file.");
        setLoading(false);
        setIsPlaying(false);
        return;
      }

      setError(null);
      setLoading(true);
      setCurrentTime(0);
      setDuration(0);

      const audioUrl = getAudioUrl(song.audioUrl);

      console.log("========== AUDIO DEBUG ==========");
      console.log("Song:", song.title);
      console.log("Original audioUrl:", song.audioUrl);
      console.log("API_BASE_URL:", API_BASE_URL);
      console.log("BACKEND_URL:", BACKEND_URL);
      console.log("Final Playing URL:", audioUrl);
      console.log("=================================");

      // Previous audio stop
      audio.pause();

      // New audio source
      audio.src = audioUrl;

      audio.load();

      if (autoPlay) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setLoading(false);
          })
          .catch((err) => {
            console.error(
              "Audio play error:",
              err
            );

            setIsPlaying(false);
            setLoading(false);

            if (err.name === "NotAllowedError") {
              setError(
                "Click play to start the audio."
              );
            } else {
              setError(
                "Unable to play this track."
              );
            }
          });
      }
    },
    []
  );

  /*
    Play Selected Song
  */
  const playSong = useCallback(
    (song, songList = null) => {
      if (!song) return;

      const list = songList || queue;

      const idx = list.findIndex(
        (s) => s._id === song._id
      );

      setQueue(list);

      setCurrentIndex(
        idx >= 0 ? idx : 0
      );

      loadTrack(song, true);

      if (song._id) {
        registerPlay(song._id).catch(() => {});
      }
    },
    [queue, loadTrack]
  );

  /*
    Play / Pause
  */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;

    if (!currentSong) return;

    if (isPlaying) {
      audio.pause();

      setIsPlaying(false);

      return;
    }

    setError(null);
    setLoading(true);

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error(
          "Audio play error:",
          err
        );

        setIsPlaying(false);
        setLoading(false);

        setError(
          "Unable to play this track."
        );
      });
  }, [isPlaying, currentSong]);

  /*
    Next Song Index
  */
  const getNextIndex = useCallback(() => {
    if (queue.length === 0) {
      return -1;
    }

    if (shuffle) {
      if (queue.length === 1) {
        return 0;
      }

      let idx = currentIndex;

      while (idx === currentIndex) {
        idx = Math.floor(
          Math.random() * queue.length
        );
      }

      return idx;
    }

    if (currentIndex + 1 < queue.length) {
      return currentIndex + 1;
    }

    return repeat === "all" ? 0 : -1;
  }, [
    queue,
    currentIndex,
    shuffle,
    repeat
  ]);

  /*
    Previous Song Index
  */
  const getPrevIndex = useCallback(() => {
    if (queue.length === 0) {
      return -1;
    }

    if (currentIndex - 1 >= 0) {
      return currentIndex - 1;
    }

    return repeat === "all"
      ? queue.length - 1
      : -1;
  }, [
    queue,
    currentIndex,
    repeat
  ]);

  /*
    Play Next
  */
  const playNext = useCallback(() => {
    const nextIdx = getNextIndex();

    if (nextIdx === -1) {
      setIsPlaying(false);
      return;
    }

    const nextSong = queue[nextIdx];

    setCurrentIndex(nextIdx);

    loadTrack(nextSong, true);

    if (nextSong?._id) {
      registerPlay(nextSong._id).catch(() => {});
    }
  }, [
    getNextIndex,
    queue,
    loadTrack
  ]);

  /*
    Play Previous
  */
  const playPrev = useCallback(() => {
    const audio = audioRef.current;

    // Agar song 3 seconds se zyada chal chuka hai
    // to same song restart hoga
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const prevIdx = getPrevIndex();

    if (prevIdx === -1) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const previousSong = queue[prevIdx];

    setCurrentIndex(prevIdx);

    loadTrack(previousSong, true);

    if (previousSong?._id) {
      registerPlay(
        previousSong._id
      ).catch(() => {});
    }
  }, [
    getPrevIndex,
    queue,
    loadTrack
  ]);

  /*
    Track End
  */
  const handleTrackEnd = useCallback(() => {
    if (repeat === "one") {
      const audio = audioRef.current;

      audio.currentTime = 0;

      audio.play().catch((err) => {
        console.error(
          "Repeat play error:",
          err
        );
      });

      return;
    }

    playNext();
  }, [repeat, playNext]);

  /*
    Seek Audio
  */
  const seek = useCallback((time) => {
    const audio = audioRef.current;

    if (!Number.isFinite(time)) return;

    audio.currentTime = time;

    setCurrentTime(time);
  }, []);

  /*
    Shuffle
  */
  const toggleShuffle = () => {
    setShuffle((value) => !value);
  };

  /*
    Repeat Mode
    off → all → one → off
  */
  const cycleRepeat = () => {
    setRepeat((value) => {
      if (value === "off") return "all";
      if (value === "all") return "one";

      return "off";
    });
  };

  /*
    Mute
  */
  const toggleMute = () => {
    setMuted((value) => !value);
  };

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

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);

  if (!ctx) {
    throw new Error(
      "usePlayer must be used within a PlayerProvider"
    );
  }

  return ctx;
};
