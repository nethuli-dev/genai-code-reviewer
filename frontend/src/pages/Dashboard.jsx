import { useState, useEffect } from 'react';
import { listReviews } from '../api/client';
import ReviewCard from '../components/ReviewCard';
import { colors, fonts } from '../theme';

export default function Dashboard({ onSelectReview, onNewReview }) {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    listReviews()
      .then((data) => {
        setReviews(data);
        setStatus('loaded');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl" style={{ fontFamily: fonts.display, fontWeight: 700, color: colors.text }}>
          Your Reviews
        </h2>
        <button
          onClick={onNewReview}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: colors.amber, color: colors.bg }}
        >
          + New Review
        </button>
      </div>

      {status === 'loading' && <p className="text-sm" style={{ color: colors.muted }}>Loading your reviews...</p>}

      {status === 'error' && <p className="text-sm" style={{ color: colors.red }}>Couldn't load your reviews. Try refreshing.</p>}

      {status === 'loaded' && reviews.length === 0 && (
        <div className="text-center py-16 rounded-xl border border-dashed" style={{ borderColor: colors.border }}>
          <p className="mb-3" style={{ color: colors.muted }}>No reviews yet.</p>
          <button onClick={onNewReview} className="text-sm font-medium" style={{ color: colors.teal }}>
            Submit your first review →
          </button>
        </div>
      )}

      {status === 'loaded' && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onClick={() => onSelectReview(review.id)} />
          ))}
        </div>
      )}
    </div>
  );
}