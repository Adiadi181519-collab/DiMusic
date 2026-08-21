import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Music2, ListMusic, Disc3 } from 'lucide-react';

const links = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/songs', label: 'Songs', icon: Music2 },
  { to: '/playlists', label: 'Playlists', icon: ListMusic }
];

const Sidebar = () => (
  <aside className="hidden md:flex md:flex-col w-60 shrink-0 h-full glass border-r border-white/10 p-5">
    <div className="flex items-center gap-2 mb-8 px-1">
      <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center">
        <Disc3 size={18} className="text-black" />
      </div>
      <span className="font-display text-lg tracking-tight">DiMusic</span>
    </div>
    <nav className="flex flex-col gap-1">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors focus-ring ${
              isActive ? 'bg-white/10 text-gold' : 'text-[var(--text-dim)] hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
