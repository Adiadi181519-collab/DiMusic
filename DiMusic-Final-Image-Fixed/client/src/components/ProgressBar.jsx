import React, { useRef, useState } from 'react';
import { formatTime } from '../utils/formatTime';

const ProgressBar = ({ currentTime, duration, onSeek }) => {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);

  const pct = duration > 0 ? ((dragging ? dragValue : currentTime) / duration) * 100 : 0;

  const valueFromEvent = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return ratio * duration;
  };

  const handlePointerDown = (e) => {
    setDragging(true);
    setDragValue(valueFromEvent(e.clientX));
  };
  const handlePointerMove = (e) => {
    if (!dragging) return;
    setDragValue(valueFromEvent(e.clientX));
  };
  const handlePointerUp = (e) => {
    if (!dragging) return;
    const value = valueFromEvent(e.clientX);
    onSeek(value);
    setDragging(false);
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-xs tabular-nums text-[var(--text-dim)] w-10 text-right">
        {formatTime(dragging ? dragValue : currentTime)}
      </span>
      <div
        ref={trackRef}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={Math.floor(dragging ? dragValue : currentTime)}
        tabIndex={0}
        className="relative flex-1 h-2 rounded-full bg-white/10 cursor-pointer group"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={(e) => dragging && handlePointerUp(e)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') onSeek(Math.min(duration, currentTime + 5));
          if (e.key === 'ArrowLeft') onSeek(Math.max(0, currentTime - 5));
        }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gold"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-gold-light shadow opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
      <span className="text-xs tabular-nums text-[var(--text-dim)] w-10">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default ProgressBar;
