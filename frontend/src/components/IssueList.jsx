import { colors, fonts } from '../theme';

export default function IssueList({ issues }) {
  if (!issues || issues.length === 0) return null;

  const bugs = issues.filter((i) => i.severity === 'bug');
  const style = issues.filter((i) => i.severity === 'style');

  return (
    <div className="space-y-5">
      {bugs.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: colors.red, fontFamily: fonts.display }}>
            Bugs
          </h4>
          <ul className="space-y-1.5">
            {bugs.map((issue, i) => (
              <li key={i} className="text-sm flex gap-2" style={{ color: colors.text }}>
                <span>🐛</span>
                <span>{issue.comment}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {style.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: colors.teal, fontFamily: fonts.display }}>
            Style Notes
          </h4>
          <ul className="space-y-1.5">
            {style.map((issue, i) => (
              <li key={i} className="text-sm flex gap-2" style={{ color: colors.text }}>
                <span>✏️</span>
                <span>{issue.comment}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}