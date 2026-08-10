import { colors, fonts } from '../theme';

export default function ReviewCard({ review, onClick }) {
  const preview = review.reviewSummary.replace(/[#*`]/g, '').slice(0, 120);
  const date = new Date(review.createdAt).toLocaleString();
  const bugCount = review.issues?.filter((i) => i.severity === 'bug').length || 0;
  const styleCount = review.issues?.filter((i) => i.severity === 'style').length || 0;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border p-4 transition hover:border-[#39C5CF]"
      style={{ background: colors.surface, borderColor: colors.border }}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded"
          style={{ background: colors.surfaceAlt, color: colors.muted, fontFamily: fonts.mono }}
        >
          {review.sourceType === 'pr_link' ? 'GitHub PR' : 'Pasted Diff'}
        </span>
        <span className="text-xs" style={{ color: colors.muted }}>{date}</span>
      </div>

      {review.sourceRef && (
        <p className="text-xs truncate mb-1" style={{ color: colors.teal }}>{review.sourceRef}</p>
      )}

      <p className="text-sm line-clamp-2" style={{ color: colors.text }}>{preview}...</p>

      <div className="flex gap-3 mt-2 text-xs" style={{ color: colors.muted }}>
        {bugCount > 0 && <span style={{ color: colors.red }}>🐛 {bugCount} bug{bugCount !== 1 ? 's' : ''}</span>}
        {styleCount > 0 && <span style={{ color: colors.teal }}>✏️ {styleCount} style note{styleCount !== 1 ? 's' : ''}</span>}
      </div>
    </button>
  );
}