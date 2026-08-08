import { useState, useEffect } from 'react';
import { login } from './api/client';
import StreamingOutput from './components/StreamingOutput';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) setLoggedIn(true);
  }, []);

  async function handleLogin() {
    try {
      await login(email, password);
      setLoggedIn(true);
      setLoginError('');
    } catch (err) {
      setLoginError(err.message);
    }
  }

  if (!loggedIn) {
    return (
      <div className="max-w-sm mx-auto mt-20 p-6 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Log In</h2>
        <input
          className="w-full border rounded p-2 mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="w-full border rounded p-2 mb-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white rounded p-2"
        >
          Log In
        </button>
        {loginError && <p className="text-red-600 mt-2">{loginError}</p>}
      </div>
    );
  }

  return <StreamingOutput />;
}