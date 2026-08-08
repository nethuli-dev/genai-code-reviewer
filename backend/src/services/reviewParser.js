/**
 * Parses the streamed markdown review (## Bugs, ## Style Notes,
 * ## Suggested Commit Message) into structured data for storage.
 */
export function parseReviewMarkdown(markdown) {
  const sections = { bugs: '', style: '', commit: '' };

  // Split into chunks, each starting at a "## " heading
  const parts = markdown.split(/\n(?=##\s)/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (/^##\s*Bugs/i.test(trimmed)) {
      sections.bugs = trimmed.replace(/^##\s*Bugs\s*/i, '').trim();
    } else if (/^##\s*Style Notes/i.test(trimmed)) {
      sections.style = trimmed.replace(/^##\s*Style Notes\s*/i, '').trim();
    } else if (/^##\s*Suggested Commit Message/i.test(trimmed)) {
      sections.commit = trimmed.replace(/^##\s*Suggested Commit Message\s*/i, '').trim();
    }
  }

  const bulletsToArray = (text) =>
    text
      .split('\n')
      .map((line) => line.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean);

  const issues = [
    ...bulletsToArray(sections.bugs).map((comment) => ({ severity: 'bug', comment })),
    ...bulletsToArray(sections.style).map((comment) => ({ severity: 'style', comment })),
  ];

  const suggestedCommitMsg = sections.commit.replace(/`/g, '').trim() || null;

  return { issues, suggestedCommitMsg };
}