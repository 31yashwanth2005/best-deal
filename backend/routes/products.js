import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPlatformPrices,
  getPriceHistory,
  getProductHistory,
  createProductSchema,
  updateProductSchema
} from '../controllers/productController.js';
import { analyzeProduct } from '../controllers/aiController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Products Catalog Routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', requireAuth, requireAdmin, validate({ body: createProductSchema }), createProduct);
router.put('/:id', requireAuth, requireAdmin, validate({ body: updateProductSchema }), updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

// Platform Prices & Price History
router.get('/:id/prices', getPlatformPrices);
router.get('/:id/history', getProductHistory);
router.get('/:id/price-history', getPriceHistory);

// Gemini AI Analysis Endpoint
router.post('/:id/ai-analysis', aiLimiter, analyzeProduct);
router.post('/:id/analyze', aiLimiter, analyzeProduct); // Legacy proxy route compatibility

export default router;