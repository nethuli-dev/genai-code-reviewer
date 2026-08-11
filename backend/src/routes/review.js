import express from 'express';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createReview, listReviews, getReview, streamReview } from '../controllers/reviewController.js';

const router = express.Router();

router.use(authMiddleware); // every route below requires a valid JWT

const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 review submissions per user per window
  keyGenerator: (req) => req.userId, // rate limit per authenticated user, not per IP
  message: { error: 'Too many review requests. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', reviewLimiter, createReview);
router.post('/stream', reviewLimiter, streamReview);
router.get('/', listReviews);
router.get('/:id', getReview);

export default router;