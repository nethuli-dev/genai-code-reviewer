import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createReview, listReviews, getReview } from '../controllers/reviewController.js';

const router = express.Router();

router.use(authMiddleware); // every route below requires a valid JWT

router.post('/', createReview);
router.get('/', listReviews);
router.get('/:id', getReview);

export default router;