import express from 'express';
import rateLimit from 'express-rate-limit';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // generous, since a real user might mistype a password a few times
  message: { error: 'Too many attempts. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});


router.post('/signup', signup);
router.post('/login', login);

export default router;