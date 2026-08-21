import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Disc3, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm glass-strong rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center mb-3">
            <Disc3 size={22} className="text-black" />
          </div>
          <h1 className="font-display text-xl">Admin sign in</h1>
          <p className="text-sm text-[var(--text-dim)] mt-1">Manage songs, playlists & uploads</p>
        </div>

        {error && (
          <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--text-dim)] mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus-ring"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-dim)] mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus-ring"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light disabled:opacity-50 text-black font-medium text-sm px-5 py-2.5 rounded-xl transition-colors focus-ring"
          >
            <LogIn size={16} />
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-xs text-[var(--text-dim)] mt-5 text-center">
          Default credentials are set via <code>server/.env</code> and created by running{' '}
          <code>npm run seed</code> in the server folder.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
