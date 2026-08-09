/**
 * Parses a GitHub PR URL like:
 * https://github.com/owner/repo/pull/123
 * into { owner, repo, pullNumber }.
 */
export function parsePRUrl(url) {
  const match = url.match(
    /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
  );

  if (!match) {
    throw new Error('Invalid GitHub PR URL. Expected format: https://github.com/owner/repo/pull/123');
  }

  const [, owner, repo, pullNumber] = match;
  return { owner, repo, pullNumber };
}

/**
 * Fetches the raw diff text for a public GitHub PR.
 * Uses GitHub's unauthenticated API (60 requests/hour limit).
 */
export async function fetchPRDiff(prUrl) {
  const { owner, repo, pullNumber } = parsePRUrl(prUrl);

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;

  const res = await fetch(apiUrl, {
    headers: {
      Accept: 'application/vnd.github.v3.diff',
      'User-Agent': 'genai-code-reviewer', // GitHub requires a User-Agent header
    },
  });

  if (res.status === 404) {
    throw new Error('PR not found. Check the URL and make sure the repo/PR is public.');
  }

  if (res.status === 403) {
    const rateLimitRemaining = res.headers.get('x-ratelimit-remaining');
    if (rateLimitRemaining === '0') {
      throw new Error('GitHub API rate limit exceeded (60 requests/hour for unauthenticated requests). Try again later.');
    }
    throw new Error('GitHub API access forbidden.');
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const diffText = await res.text();

  if (!diffText.trim()) {
    throw new Error('This PR has no changes, or the diff could not be retrieved.');
  }

  return diffText;
}