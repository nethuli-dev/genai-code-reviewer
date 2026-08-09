import { prisma } from '../db.js';
import { streamCodeReview } from '../services/llmStreamService.js';
import { parseReviewMarkdown } from '../services/reviewParser.js';
import { fetchPRDiff } from '../services/githubService.js';

// POST /api/reviews — creates a review with a stub AI response (pre-streaming version)
export async function createReview(req, res) {
  const { sourceType, sourceRef, diffText } = req.body;

  if (!diffText) {
    return res.status(400).json({ error: 'diffText is required' });
  }

  const review = await prisma.review.create({
    data: {
      userId: req.userId, // from verified JWT — never from req.body
      sourceType: sourceType || 'raw_diff',
      sourceRef: sourceRef || null,
      diffText,
      reviewSummary: 'This is a stubbed review summary — real AI review coming in Day 2.',
      issues: [
        { severity: 'info', line: 1, comment: 'Stub issue — LLM integration not wired up yet.' },
      ],
      suggestedCommitMsg: 'fix: stub commit message',
    },
  });

  res.status(201).json(review);
}

// POST /api/reviews/stream — SSE endpoint for streaming code review results
// Accepts EITHER a raw diff (sourceType: 'raw_diff', diffText: '...')
// OR a GitHub PR link (sourceType: 'pr_link', sourceRef: 'https://github.com/owner/repo/pull/123')
export async function streamReview(req, res) {
  const { sourceType, sourceRef, diffText: rawDiffText } = req.body;

  let diffText;

  // Resolve the actual diff text BEFORE opening the SSE stream, so a bad
  // PR URL or GitHub API failure returns a normal JSON error response
  // instead of failing mid-stream.
  try {
    if (sourceType === 'pr_link') {
      if (!sourceRef) {
        return res.status(400).json({ error: 'sourceRef (PR URL) is required when sourceType is pr_link' });
      }
      diffText = await fetchPRDiff(sourceRef);
    } else {
      if (!rawDiffText) {
        return res.status(400).json({ error: 'diffText is required' });
      }
      diffText = rawDiffText;
    }
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  // SSE headers - keep the connection open, tell the client to expect a stream of events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let clientDisconnected = false;
  // NOTE: res.on('close'), not req.on('close') — in Express 5, express.json()
  // already closes the request stream before this handler runs, so req 'close'
  // never fires. res 'close' correctly fires only when the client disconnects.
  res.on('close', () => {
    clientDisconnected = true;
  });

  try {
    const fullText = await streamCodeReview(diffText, (token) => {
      if (!clientDisconnected) {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    });

    if (!clientDisconnected) {
      const { issues, suggestedCommitMsg } = parseReviewMarkdown(fullText);

      // Save the completed review to the DB
      const review = await prisma.review.create({
        data: {
          userId: req.userId,
          sourceType: sourceType || 'raw_diff',
          sourceRef: sourceRef || null,
          diffText,
          reviewSummary: fullText,
          issues,
          suggestedCommitMsg,
        },
      });

      res.write(`data: ${JSON.stringify({ done: true, reviewId: review.id })}\n\n`);
    }
    res.end();
  } catch (err) {
    console.error('STREAMING ERROR:', err);
    if (!clientDisconnected) {
      res.write(`data: ${JSON.stringify({ error: 'LLM request failed' })}\n\n`);
      res.end();
    }
  }
}

// GET /api/reviews — only this user's reviews, ever
export async function listReviews(req, res) {
  const reviews = await prisma.review.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });

  res.json(reviews);
}

// GET /api/reviews/:id — IDOR check happens right here
export async function getReview(req, res) {
  const reviewId = parseInt(req.params.id, 10);

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.userId !== req.userId) {
    // Same 404 whether it doesn't exist OR belongs to someone else —
    // don't leak which case it is.
    return res.status(404).json({ error: 'Review not found' });
  }

  res.json(review);
}