import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MusicPlayer from '../components/MusicPlayer';

const MainLayout = ({ search, onSearchChange }) => {
  return (
    <div className="h-screen flex flex-col bg-ink text-[var(--text)] overflow-hidden">
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar search={search} onSearchChange={onSearchChange} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default MainLayout;
