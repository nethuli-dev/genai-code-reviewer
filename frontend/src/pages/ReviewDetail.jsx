import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getReview } from '../api/client';
import IssueList from '../components/IssueList';

export default function ReviewDetail({ reviewId, onBack }) {
  const [review, setReview] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | loaded | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getReview(reviewId)
      .then((data) => {
        setReview(data);
        setStatus('loaded');
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setStatus('error');
      });
  }, [reviewId]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={onBack} className="text-sm text-blue-600 mb-4 hover:underline">
        ← Back to Dashboard
      </button>

      {status === 'loading' && <p className="text-gray-500 text-sm">Loading review...</p>}

      {status === 'error' && <p className="text-red-600 text-sm">{errorMsg}</p>}

      {status === 'loaded' && review && (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                {review.sourceType === 'pr_link' ? 'GitHub PR' : 'Pasted Diff'}
              </span>
              {review.sourceRef && (
                <p className="text-xs text-blue-600 mt-1">{review.sourceRef}</p>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleString()}
            </span>
          </div>

          {review.suggestedCommitMsg && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs font-semibold text-gray-500 mb-1">Suggested Commit Message</p>
              <code className="text-sm">{review.suggestedCommitMsg}</code>
            </div>
          )}

          {review.issues?.length > 0 ? (
            <IssueList issues={review.issues} />
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{review.reviewSummary}</ReactMarkdown>
            </div>
          )}
        </>
      )}
    </div>
  );
}