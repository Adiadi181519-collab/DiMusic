import React from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

const VolumeControl = ({ volume, muted, onVolumeChange, onToggleMute }) => {
  const Icon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-2 w-32">
      <button
        onClick={onToggleMute}
        className="p-1.5 rounded-lg hover:bg-white/10 focus-ring shrink-0"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        <Icon size={18} />
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={muted ? 0 : volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        aria-label="Volume"
        className="w-full accent-gold h-1.5 cursor-pointer"
      />
    </div>
  );
};

export default VolumeControl;
