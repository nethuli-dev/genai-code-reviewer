export default function IssueList({ issues }) {
  if (!issues || issues.length === 0) return null;

  const bugs = issues.filter((i) => i.severity === 'bug');
  const style = issues.filter((i) => i.severity === 'style');

  return (
    <div className="space-y-4">
      {bugs.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-red-700 mb-1">Bugs</h4>
          <ul className="space-y-1">
            {bugs.map((issue, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span>🐛</span>
                <span>{issue.comment}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {style.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-blue-700 mb-1">Style Notes</h4>
          <ul className="space-y-1">
            {style.map((issue, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
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