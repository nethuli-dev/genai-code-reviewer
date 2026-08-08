import { prisma } from '../db.js';
import { streamCodeReview } from '../services/llmStreamService.js';

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
export async function streamReview(req, res) {
  const { sourceType, sourceRef, diffText } = req.body;

  if (!diffText) {
    return res.status(400).json({ error: 'diffText is required' });
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
      console.log('GOT TOKEN:', token);
      if (!clientDisconnected) {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    });
    console.log('STREAM DONE, fullText length:', fullText.length);

    if (!clientDisconnected) {
      // Save the completed review to the DB
      const review = await prisma.review.create({
        data: {
          userId: req.userId,
          sourceType: sourceType || 'raw_diff',
          sourceRef: sourceRef || null,
          diffText,
          reviewSummary: fullText,
          issues: [], // parsed properly in Day 3 prompt-tuning pass
          suggestedCommitMsg: null,
        },
      });
      console.log('REVIEW SAVED, id:', review.id);

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