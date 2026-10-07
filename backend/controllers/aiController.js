import { z } from 'zod';
import { analyzeProductPriceService } from '../services/aiService.js';

export const analyzeBodySchema = z.object({
  productId: z.string().min(1, 'productId is required'),
  forceRefresh: z.boolean().optional()
});

export const analyzeProductByBody = async (req, res, next) => {
  try {
    const { productId, forceRefresh } = req.body;
    const analysis = await analyzeProductPriceService(productId, { forceRefresh });

    res.json({
      success: true,
      data: analysis,
      analysis
    });
  } catch (err) {
    next(err);
  }
};

export const analyzeProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const forceRefresh = req.query.forceRefresh === 'true' || req.query.forceRefresh === true;
    const analysis = await analyzeProductPriceService(id, { forceRefresh });

    res.json({
      success: true,
      data: analysis,
      analysis
    });
  } catch (err) {
    next(err);
  }
};
