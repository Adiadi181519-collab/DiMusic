
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MusicPlayer from '../components/MusicPlayer';

const MainLayout = ({ search, onSearchChange }) => {
  return (
    <div
      className="
        relative
        h-screen
        flex
        flex-col
        text-[var(--text)]
        overflow-hidden
        bg-[url('/images/suraj.jpg')]
        bg-cover
        bg-center
        bg-fixed
      "
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Main application */}
      <div className="relative z-10 flex flex-1 min-h-0">

        {/* Sidebar */}
        <aside
          className="
            shrink-0
            bg-black/25
            backdrop-blur-2xl
            border-r
            border-white/10
          "
        >
          <Sidebar />
        </aside>

        {/* Right side */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Navbar */}
          <header
            className="
              bg-black/25
              backdrop-blur-2xl
              border-b
              border-white/10
            "
          >
            <Navbar
              search={search}
              onSearchChange={onSearchChange}
            />
          </header>

          {/* Page content */}
          <main
            className="
              flex-1
              overflow-y-auto
              p-4
              md:p-6
            "
          >
            <div
              className="
                min-h-full
                bg-white/[0.04]
                backdrop-blur-xl
                border
                border-white/10
                rounded-3xl
                shadow-2xl
              "
            >
              <Outlet />
            </div>
          </main>

        </div>
      </div>

      {/* Music Player */}
      <div
        className="
          relative
          z-20
          bg-black/40
          backdrop-blur-2xl
          border-t
          border-white/10
          shadow-2xl
        "
      >
        <MusicPlayer />
      </div>
    </div>
  );
};

export default MainLayout;

