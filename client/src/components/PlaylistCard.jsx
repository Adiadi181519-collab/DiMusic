import React from 'react';
import { Link } from 'react-router-dom';
import { ListMusic } from 'lucide-react';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#171a1f"/></svg>`
  );

const PlaylistCard = ({ playlist }) => (
  <Link
    to={`/playlist/${playlist._id}`}
    className="group glass rounded-2xl p-3 block hover:bg-white/[0.07] transition-colors focus-ring"
  >
    <div className="relative aspect-square rounded-xl overflow-hidden bg-white/5 mb-3">
      <img
        src={playlist.imageUrl || FALLBACK_IMAGE}
        alt={playlist.name}
        className="w-full h-full object-cover"
        onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
      />
      {!playlist.imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ListMusic size={28} className="text-[var(--text-dim)]" />
        </div>
      )}
    </div>
    <p className="text-sm font-medium truncate">{playlist.name}</p>
    <p className="text-xs text-[var(--text-dim)] truncate">
      {playlist.songs?.length || 0} song{playlist.songs?.length === 1 ? '' : 's'}
    </p>
  </Link>
);

export default PlaylistCard;
