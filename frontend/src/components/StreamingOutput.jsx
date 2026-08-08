import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { streamReview } from '../api/client';

export default function StreamingOutput() {
  const [diffText, setDiffText] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | streaming | done | error
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit() {
    if (!diffText.trim()) return;

    setOutput('');
    setErrorMsg('');
    setStatus('streaming');

    await streamReview(diffText, {
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">New Code Review</h2>

      <textarea
        className="w-full h-40 border border-gray-300 rounded-lg p-3 font-mono text-sm"
        placeholder="Paste a diff here..."
        value={diffText}
        onChange={(e) => setDiffText(e.target.value)}
        disabled={status === 'streaming'}
      />

      <button
        onClick={handleSubmit}
        disabled={status === 'streaming' || !diffText.trim()}
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
    </div>
  );
}