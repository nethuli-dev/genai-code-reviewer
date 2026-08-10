import { useState } from 'react';
import { login, signup } from '../api/client';
import { colors, fonts } from '../theme';

export default function AuthPage({ initialMode, onAuthed }) {
  const [mode, setMode] = useState(initialMode || 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      onAuthed(mode);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="rounded-xl border p-7" style={{ background: colors.surface, borderColor: colors.border }}>
        <h2
          className="text-xl mb-6"
          style={{ fontFamily: fonts.display, fontWeight: 700, color: colors.text }}
        >
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h2>

        <div className="flex gap-1 mb-6 p-1 rounded-lg" style={{ background: colors.surfaceAlt }}>
          <button
            onClick={() => setMode('signup')}
            className="flex-1 py-2 rounded-md text-sm font-medium transition"
            style={mode === 'signup' ? { background: colors.border, color: colors.text } : { color: colors.muted }}
          >
            Sign up
          </button>
          <button
            onClick={() => setMode('signin')}
            className="flex-1 py-2 rounded-md text-sm font-medium transition"
            style={mode === 'signin' ? { background: colors.border, color: colors.text } : { color: colors.muted }}
          >
            Sign in
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs block mb-1.5" style={{ color: colors.muted }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none border"
              style={{ background: colors.surfaceAlt, borderColor: colors.border, color: colors.text }}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs block mb-1.5" style={{ color: colors.muted }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none border"
              style={{ background: colors.surfaceAlt, borderColor: colors.border, color: colors.text }}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm" style={{ color: colors.red }}>{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg text-sm font-medium mt-2 disabled:opacity-60"
            style={{ background: colors.amber, color: colors.bg }}
          >
            {submitting
              ? mode === 'signup' ? 'Creating account...' : 'Signing in...'
              : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}