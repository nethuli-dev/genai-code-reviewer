import { useState, useEffect } from 'react';
import { colors, fonts } from '../theme';

const DIFF_LINES = [
  { type: 'ctx', text: 'function isEven(n) {' },
  { type: 'del', text: '  return n / 2 === 0;' },
  { type: 'add', text: '  return n % 2 === 0;' },
  { type: 'ctx', text: '}' },
];

const REVIEW_TEXT =
  "Bug found — `/` should be `%`. Division checks the result, not divisibility; the modulo operator does.";

const STEPS = [
  ['01', 'Paste', 'Drop in a raw diff or a public GitHub PR link.'],
  ['02', 'Stream', 'Bugs, style notes, and a commit message stream in live.'],
  ['03', 'Track', 'Every review is saved to your dashboard for later.'],
];

export default function Landing({ onPrimaryAction }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [reviewChars, setReviewChars] = useState(0);

  useEffect(() => {
    if (visibleLines < DIFF_LINES.length) {
      const t = setTimeout(() => setVisibleLines((v) => v + 1), 450);
      return () => clearTimeout(t);
    }
  }, [visibleLines]);

  useEffect(() => {
    if (visibleLines === DIFF_LINES.length && reviewChars < REVIEW_TEXT.length) {
      const t = setTimeout(() => setReviewChars((c) => c + 1), 18);
      return () => clearTimeout(t);
    }
  }, [visibleLines, reviewChars]);

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <h1
            className="text-4xl md:text-5xl leading-[1.1] mb-5"
            style={{ fontFamily: fonts.display, fontWeight: 700, color: colors.text }}
          >
            Code review that streams while you wait — not after.
          </h1>
          <p className="text-base mb-8 max-w-md" style={{ color: colors.muted }}>
            Paste a diff or a public GitHub PR link. Watch bugs, style notes, and a
            suggested commit message stream in live, token by token — then keep every
            review in one place.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={onPrimaryAction}
              className="px-5 py-3 rounded-lg text-sm font-medium"
              style={{ background: colors.amber, color: colors.bg }}
            >
              Get started
            </button>
            <span className="text-sm" style={{ color: colors.muted }}>Free — no credit card</span>
          </div>
        </div>

        <div className="rounded-xl border overflow-hidden" style={{ background: colors.surface, borderColor: colors.border }}>
          <div
            className="flex items-center gap-2 px-4 py-2.5 border-b text-xs"
            style={{ borderColor: colors.border, color: colors.muted, fontFamily: fonts.mono }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors.red }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors.amber }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors.green }} />
            <span className="ml-2">math.js</span>
          </div>

          <div className="px-4 py-4" style={{ fontFamily: fonts.mono, fontSize: '13px' }}>
            {DIFF_LINES.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className="animate-diff-line flex gap-2"
                style={{ color: line.type === 'add' ? colors.green : line.type === 'del' ? colors.red : colors.muted }}
              >
                <span className="select-none opacity-60">
                  {line.type === 'add' ? '+' : line.type === 'del' ? '-' : ' '}
                </span>
                <span>{line.text}</span>
              </div>
            ))}
          </div>

          {visibleLines === DIFF_LINES.length && (
            <div className="px-4 py-3.5 border-t text-sm" style={{ borderColor: colors.border, background: colors.surfaceAlt }}>
              <p className="text-xs font-medium mb-1.5" style={{ color: colors.teal }}>AI review</p>
              <p style={{ fontFamily: fonts.mono, fontSize: '12.5px', lineHeight: 1.6, color: colors.text }}>
                {REVIEW_TEXT.slice(0, reviewChars)}
                {reviewChars < REVIEW_TEXT.length && <span className="animate-pulse">▍</span>}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-3 gap-5">
          {STEPS.map(([n, title, desc]) => (
            <div key={n} className="rounded-xl border p-6" style={{ background: colors.surface, borderColor: colors.border }}>
              <p className="text-xs mb-3" style={{ color: colors.amber, fontFamily: fonts.mono }}>{n}</p>
              <h3 className="text-base mb-1.5" style={{ fontFamily: fonts.display, fontWeight: 600, color: colors.text }}>
                {title}
              </h3>
              <p className="text-sm" style={{ color: colors.muted }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}