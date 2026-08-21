import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Music2, ListMusic, Disc3, Menu, X } from 'lucide-react';
import SearchBar from './SearchBar';

const mobileLinks = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/songs', label: 'Songs', icon: Music2 },
  { to: '/playlists', label: 'Playlists', icon: ListMusic }
];

const Navbar = ({ search, onSearchChange, showSearch = true }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass border-b border-white/10 px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 focus-ring"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="md:hidden flex items-center gap-2 mr-1">
          <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center">
            <Disc3 size={14} className="text-black" />
          </div>
        </div>
        {showSearch ? (
          <SearchBar value={search} onChange={onSearchChange} />
        ) : (
          <span className="font-display text-lg">DiMusic</span>
        )}
      </div>

      {open && (
        <nav className="md:hidden mt-3 flex flex-col gap-1">
          {mobileLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                  isActive ? 'bg-white/10 text-gold' : 'text-[var(--text-dim)]'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
