import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Music2, ListMusic, UploadCloud, LogOut, Disc3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/songs', label: 'Songs', icon: Music2 },
  { to: '/admin/playlists', label: 'Playlists', icon: ListMusic },
  { to: '/admin/upload', label: 'Upload', icon: UploadCloud }
];

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-full md:w-60 shrink-0 md:h-full glass border-r border-white/10 p-5 flex md:flex-col">
      <div className="hidden md:flex items-center gap-2 mb-8 px-1">
        <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center">
          <Disc3 size={18} className="text-black" />
        </div>
        <div>
          <p className="font-display text-base leading-tight">DiMusic</p>
          <p className="text-xs text-[var(--text-dim)] leading-tight">Admin</p>
        </div>
      </div>
      <nav className="flex md:flex-col gap-1 flex-1 overflow-x-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors focus-ring ${
                isActive ? 'bg-white/10 text-gold' : 'text-[var(--text-dim)] hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="hidden md:block mt-auto pt-4 border-t border-white/10">
        <p className="text-xs text-[var(--text-dim)] truncate mb-2">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-[var(--text-dim)] hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 w-full focus-ring"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
