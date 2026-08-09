export default function ReviewCard({ review, onClick }) {
  const preview = review.reviewSummary.replace(/[#*`]/g, '').slice(0, 120);
  const date = new Date(review.createdAt).toLocaleString();
  const bugCount = review.issues?.filter((i) => i.severity === 'bug').length || 0;
  const styleCount = review.issues?.filter((i) => i.severity === 'style').length || 0;

  return (
    <button
      onClick={onClick}
      className="w-full text-left border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-sm transition"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
          {review.sourceType === 'pr_link' ? 'GitHub PR' : 'Pasted Diff'}
        </span>
        <span className="text-xs text-gray-400">{date}</span>
      </div>

      {review.sourceRef && (
        <p className="text-xs text-blue-600 truncate mb-1">{review.sourceRef}</p>
      )}

      <p className="text-sm text-gray-700 line-clamp-2">{preview}...</p>

      <div className="flex gap-3 mt-2 text-xs text-gray-500">
        {bugCount > 0 && <span>🐛 {bugCount} bug{bugCount !== 1 ? 's' : ''}</span>}
        {styleCount > 0 && <span>✏️ {styleCount} style note{styleCount !== 1 ? 's' : ''}</span>}
      </div>
    </button>
  );
}