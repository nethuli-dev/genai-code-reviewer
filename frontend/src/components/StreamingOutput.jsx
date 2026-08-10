import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { streamReview } from '../api/client';
import { colors, fonts } from '../theme';

export default function StreamingOutput({ onComplete }) {
  const [mode, setMode] = useState('diff'); // 'diff' | 'pr'
  const [diffText, setDiffText] = useState('');
  const [prUrl, setPrUrl] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | streaming | done | error
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit() {
    const input = mode === 'diff' ? diffText : prUrl;
    if (!input.trim()) return;

    setOutput('');
    setErrorMsg('');
    setStatus('streaming');

    const payload =
      mode === 'diff'
        ? { sourceType: 'raw_diff', diffText }
        : { sourceType: 'pr_link', sourceRef: prUrl };

    await streamReview(payload, {
      onToken: (token) => setOutput((prev) => prev + token),
      onDone: (reviewId) => {
        setStatus('done');
        onComplete?.(reviewId);
      },
      onError: (message) => {
        setStatus('error');
        setErrorMsg(message);
      },
    });
  }

  const inputValue = mode === 'diff' ? diffText : prUrl;

  const inputStyle = {
    background: colors.surfaceAlt,
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2
        className="text-2xl mb-4"
        style={{ fontFamily: fonts.display, fontWeight: 700, color: colors.text }}
      >
        New Code Review
      </h2>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode('diff')}
          className="px-3 py-1.5 rounded-lg text-sm font-medium"
          style={
            mode === 'diff'
              ? { background: colors.amber, color: colors.bg }
              : { background: colors.surface, color: colors.muted }
          }
        >
          Paste Diff
        </button>
        <button
          onClick={() => setMode('pr')}
          className="px-3 py-1.5 rounded-lg text-sm font-medium"
          style={
            mode === 'pr'
              ? { background: colors.amber, color: colors.bg }
              : { background: colors.surface, color: colors.muted }
          }
        >
          GitHub PR Link
        </button>
      </div>

      {mode === 'diff' ? (
        <textarea
          className="w-full h-40 border rounded-lg p-3 text-sm outline-none"
          style={{ ...inputStyle, fontFamily: fonts.mono }}
          placeholder="Paste a diff here..."
          value={diffText}
          onChange={(e) => setDiffText(e.target.value)}
          disabled={status === 'streaming'}
        />
      ) : (
        <input
          className="w-full border rounded-lg p-3 text-sm outline-none"
          style={{ ...inputStyle, fontFamily: fonts.mono }}
          placeholder="https://github.com/owner/repo/pull/123"
          value={prUrl}
          onChange={(e) => setPrUrl(e.target.value)}
          disabled={status === 'streaming'}
        />
      )}

      <button
        onClick={handleSubmit}
        disabled={status === 'streaming' || !inputValue.trim()}
        className="mt-3 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        style={{ background: colors.amber, color: colors.bg }}
      >
        {status === 'streaming' ? 'Reviewing...' : 'Submit for Review'}
      </button>

      {status === 'error' && (
        <p className="mt-3 text-sm" style={{ color: colors.red }}>Error: {errorMsg}</p>
      )}

      {output && (
        <div
          className="mt-6 rounded-xl border p-4 max-w-none"
          style={{ background: colors.surface, borderColor: colors.border, color: colors.text, lineHeight: 1.7 }}
        >
          <div className="markdown-body">
            <ReactMarkdown>{output}</ReactMarkdown>
          </div>
          {status === 'streaming' && <span className="animate-pulse">▍</span>}
        </div>
      )}
    </div>
  );
}