import { colors, fonts } from '../theme';

export default function Toast({ toasts }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-diff-line rounded-lg border px-4 py-3 flex items-start gap-2.5"
          style={{
            background: colors.surface,
            borderColor: colors.border,
            borderLeft: `3px solid ${t.type === 'error' ? colors.red : colors.green}`,
          }}
        >
          <span
            style={{ color: t.type === 'error' ? colors.red : colors.green, fontFamily: fonts.mono }}
            className="text-sm"
          >
            {t.type === 'error' ? '✕' : '✓'}
          </span>
          <p className="text-sm" style={{ color: colors.text, fontFamily: fonts.mono }}>
            {t.message}
          </p>
        </div>
      ))}
    </div>
  );
}