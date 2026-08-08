const API_BASE = 'http://localhost:3001';

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Login failed');
  }

  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data;
}

/**
 * Streams a code review from the backend SSE endpoint.
 * onToken(text) is called for each streamed chunk.
 * onDone(reviewId) is called once the stream completes successfully.
 * onError(message) is called if anything goes wrong.
 */
export async function streamReview(diffText, { onToken, onDone, onError }) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE}/api/reviews/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ diffText }),
  });

  if (!res.ok || !res.body) {
    onError('Failed to start review stream');
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE messages are separated by double newlines
    const parts = buffer.split('\n\n');
    buffer = parts.pop(); // keep the last (possibly incomplete) chunk in the buffer

    for (const part of parts) {
      if (!part.startsWith('data: ')) continue;
      const jsonStr = part.slice(6);

      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.token) onToken(parsed.token);
        if (parsed.done) onDone(parsed.reviewId);
        if (parsed.error) onError(parsed.error);
      } catch {
        // ignore malformed partial JSON, will complete on next chunk
      }
    }
  }
}