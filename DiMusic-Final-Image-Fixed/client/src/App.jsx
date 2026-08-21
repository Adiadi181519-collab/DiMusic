import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

import Home from './pages/Home';
import Songs from './pages/Songs';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminSongs from './pages/AdminSongs';
import AdminPlaylists from './pages/AdminPlaylists';
import AdminUpload from './pages/AdminUpload';
import NotFound from './pages/NotFound';

const App = () => {
  const [search, setSearch] = useState('');

  return (
    <Routes>
      {/* Public site */}
      <Route element={<MainLayout search={search} onSearchChange={setSearch} />}>
        <Route path="/" element={<Home />} />
        <Route path="/songs" element={<Songs search={search} />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
      </Route>

      {/* Admin auth */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin dashboard (protected inside AdminLayout) */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/songs" element={<AdminSongs />} />
        <Route path="/admin/playlists" element={<AdminPlaylists />} />
        <Route path="/admin/upload" element={<AdminUpload />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
