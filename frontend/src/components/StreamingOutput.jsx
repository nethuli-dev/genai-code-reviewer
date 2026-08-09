import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { streamReview } from '../api/client';

export default function StreamingOutput({ onDone}) {
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
      onToken: (token) => {
        setOutput((prev) => prev + token);
      },
      onDone: () => {
        setStatus('done');
      },
      onError: (message) => {
        setStatus('error');
        setErrorMsg(message);
      },
    });
  }

  const inputValue = mode === 'diff' ? diffText : prUrl;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">New Code Review</h2>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode('diff')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
            mode === 'diff' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Paste Diff
        </button>
        <button
          onClick={() => setMode('pr')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
            mode === 'pr' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          GitHub PR Link
        </button>
      </div>

      {mode === 'diff' ? (
        <textarea
          className="w-full h-40 border border-gray-300 rounded-lg p-3 font-mono text-sm"
          placeholder="Paste a diff here..."
          value={diffText}
          onChange={(e) => setDiffText(e.target.value)}
          disabled={status === 'streaming'}
        />
      ) : (
        <input
          className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm"
          placeholder="https://github.com/owner/repo/pull/123"
          value={prUrl}
          onChange={(e) => setPrUrl(e.target.value)}
          disabled={status === 'streaming'}
        />
      )}

      <button
        onClick={handleSubmit}
        disabled={status === 'streaming' || !inputValue.trim()}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
      >
        {status === 'streaming' ? 'Reviewing...' : 'Submit for Review'}
      </button>

      {status === 'error' && (
        <p className="mt-3 text-red-600">Error: {errorMsg}</p>
      )}

      {output && (
        <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50 prose prose-sm max-w-none">
          <ReactMarkdown>{output}</ReactMarkdown>
          {status === 'streaming' && <span className="animate-pulse">▍</span>}
        </div>
      )}

      {status === 'done' && onDone && (
        <button
          onClick={onDone}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
      )}

    </div>
  );
}