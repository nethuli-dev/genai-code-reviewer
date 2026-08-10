import { colors, fonts } from '../theme';
import Logo from './Logo';

export default function Navbar({ loggedIn, active, onHome, onReviews, onNew, onSignIn, onSignOut }) {
  return (
    <header
      className="border-b"
      style={{ borderColor: colors.border, background: colors.bg }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Logo onClick={onHome} />
          <nav className="hidden sm:flex items-center gap-5 text-sm">
            <button
              onClick={onHome}
              style={{ color: active === 'home' ? colors.amber : colors.muted, fontFamily: fonts.body }}
            >
              Home
            </button>
            {loggedIn && (
              <button
                onClick={onReviews}
                style={{ color: active === 'reviews' ? colors.amber : colors.muted, fontFamily: fonts.body }}
              >
                Reviews
              </button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {loggedIn ? (
            <>
              <button
                onClick={onNew}
                className="px-3.5 py-2 rounded-lg text-sm font-medium"
                style={{ background: colors.amber, color: colors.bg }}
              >
                + Create Review
              </button>
              <button
                onClick={onSignOut}
                className="text-sm"
                style={{ color: colors.muted }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={onSignIn}
              className="px-3.5 py-2 rounded-lg text-sm font-medium"
              style={{ background: colors.amber, color: colors.bg }}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}