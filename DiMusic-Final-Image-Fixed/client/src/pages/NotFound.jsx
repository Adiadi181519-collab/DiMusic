import React from 'react';
import { Link } from 'react-router-dom';
import { Disc3 } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-ink text-[var(--text)] px-4 text-center">
    <Disc3 size={40} className="text-gold mb-4 animate-spin [animation-duration:3s]" />
    <h1 className="font-display text-2xl mb-2">Page not found</h1>
    <p className="text-sm text-[var(--text-dim)] mb-6">The page you're looking for doesn't exist.</p>
    <Link to="/" className="text-sm text-gold underline underline-offset-2 focus-ring">
      Back to home
    </Link>
  </div>
);

export default NotFound;
