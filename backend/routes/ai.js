import express from 'express';
import { analyzeProductByBody, analyzeBodySchema } from '../controllers/aiController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/v1/ai/analyze
router.post('/analyze', requireAuth, aiLimiter, validate({ body: analyzeBodySchema }), analyzeProductByBody);

export default router;
