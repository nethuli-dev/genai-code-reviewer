import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getReview } from '../api/client';
import IssueList from '../components/IssueList';
import { colors, fonts } from '../theme';

export default function ReviewDetail({ reviewId }) {
  const [review, setReview] = useState(null);
  const [status, setStatus] = useState('loading');
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
      {status === 'loading' && <p className="text-sm" style={{ color: colors.muted }}>Loading review...</p>}

      {status === 'error' && <p className="text-sm" style={{ color: colors.red }}>{errorMsg}</p>}

      {status === 'loaded' && review && (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{ background: colors.surfaceAlt, color: colors.muted, fontFamily: fonts.mono }}
              >
                {review.sourceType === 'pr_link' ? 'GitHub PR' : 'Pasted Diff'}
              </span>
              {review.sourceRef && <p className="text-xs mt-1" style={{ color: colors.teal }}>{review.sourceRef}</p>}
            </div>
            <span className="text-xs" style={{ color: colors.muted }}>
              {new Date(review.createdAt).toLocaleString()}
            </span>
          </div>

          {review.suggestedCommitMsg && (
            <div className="mb-4 p-3 rounded-lg border" style={{ background: colors.surface, borderColor: colors.border }}>
              <p className="text-xs font-semibold mb-1" style={{ color: colors.muted }}>Suggested Commit Message</p>
              <code className="text-sm" style={{ color: colors.text, fontFamily: fonts.mono }}>
                {review.suggestedCommitMsg}
              </code>
            </div>
          )}

          {review.issues?.length > 0 ? (
            <IssueList issues={review.issues} />
          ) : (
            <div className="markdown-body" style={{ color: colors.text, lineHeight: 1.7 }}>
              <ReactMarkdown>{review.reviewSummary}</ReactMarkdown>
            </div>
          )}
        </>
      )}
    </div>
  );
}