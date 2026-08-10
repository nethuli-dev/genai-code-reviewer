import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ReviewDetail from './pages/ReviewDetail';
import StreamingOutput from './components/StreamingOutput';
import { colors } from './theme';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState('landing'); // landing | auth | dashboard | new | detail
  const [authMode, setAuthMode] = useState('signup');
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setLoggedIn(true);
      setView('dashboard');
    }
  }, []);

  function addToast(message, type = 'success') {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }

  function handleAuthed(mode) {
    setLoggedIn(true);
    setView('dashboard');
    addToast(
      mode === 'signup' ? 'Welcome to CodeHunk — account created.' : 'Welcome back to CodeHunk.',
      'success'
    );
  }

  function handleSignOut() {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setView('landing');
  }

  return (
    <div className="min-h-screen" style={{ background: colors.bg }}>
      <Navbar
        loggedIn={loggedIn}
        active={view === 'landing' ? 'home' : view === 'dashboard' ? 'reviews' : null}
        onHome={() => setView('landing')}
        onReviews={() => setView('dashboard')}
        onNew={() => setView('new')}
        onSignIn={() => {
          setAuthMode('signin');
          setView('auth');
        }}
        onSignOut={handleSignOut}
      />

      <Toast toasts={toasts} />

      {view === 'landing' && (
        <Landing
          onPrimaryAction={() => {
            if (loggedIn) {
              setView('new');
            } else {
              setAuthMode('signup');
              setView('auth');
            }
          }}
        />
      )}

      {view === 'auth' && <AuthPage initialMode={authMode} onAuthed={handleAuthed} />}

      {view === 'dashboard' && (
        <Dashboard
          onSelectReview={(id) => {
            setSelectedReviewId(id);
            setView('detail');
          }}
          onNewReview={() => setView('new')}
        />
      )}

      {view === 'new' && (
        <StreamingOutput
          onComplete={() => addToast('Reviewing complete — results saved.', 'success')}
        />
      )}

      {view === 'detail' && <ReviewDetail reviewId={selectedReviewId} />}
    </div>
  );
}