import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createReview, listReviews, getReview, streamReview } from '../controllers/reviewController.js';

const router = express.Router();

router.use(authMiddleware); // every route below requires a valid JWT

router.post('/', createReview);
router.post('/stream', streamReview);
router.get('/', listReviews);
router.get('/:id', getReview);

export default router;