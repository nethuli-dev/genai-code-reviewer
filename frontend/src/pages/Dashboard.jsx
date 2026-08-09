import { useState, useEffect } from 'react';
import { listReviews } from '../api/client';
import ReviewCard from '../components/ReviewCard';

export default function Dashboard({ onSelectReview, onNewReview }) {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | loaded | error

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
        <h2 className="text-2xl font-bold">Your Reviews</h2>
        <button
          onClick={onNewReview}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
        >
          + New Review
        </button>
      </div>

      {status === 'loading' && (
        <p className="text-gray-500 text-sm">Loading your reviews...</p>
      )}

      {status === 'error' && (
        <p className="text-red-600 text-sm">Couldn't load your reviews. Try refreshing.</p>
      )}

      {status === 'loaded' && reviews.length === 0 && (
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-3">No reviews yet.</p>
          <button
            onClick={onNewReview}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Submit your first review →
          </button>
        </div>
      )}

      {status === 'loaded' && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onClick={() => onSelectReview(review.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}