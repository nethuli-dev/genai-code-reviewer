import { prisma } from '../db.js';

// POST /api/review — stubbed AI response for now (real LLM comes Day 2)
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