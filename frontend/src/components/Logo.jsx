import { colors, fonts } from '../theme';

export default function Logo({ onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5">
      <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
        <path d="M13 3 L21 20 L5 20 Z" stroke={colors.text} strokeWidth="1.4" fill="none" />
        <line x1="13" y1="9" x2="6" y2="24" stroke={colors.red} strokeWidth="1.6" />
        <line x1="13" y1="9" x2="13" y2="25" stroke={colors.amber} strokeWidth="1.6" />
        <line x1="13" y1="9" x2="20" y2="24" stroke={colors.teal} strokeWidth="1.6" />
      </svg>
      <span
        className="text-lg tracking-tight"
        style={{ fontFamily: fonts.display, fontWeight: 600, color: colors.text }}
      >
        CodeHunk
      </span>
    </button>
  );
}