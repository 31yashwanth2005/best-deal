import { z } from 'zod';
import prisma from '../config/prisma.js';
import {
  getProductsService,
  getProductByIdService,
  getPlatformPricesService,
  getPriceHistoryService,
  getPriceHistoryRecordsService
} from '../services/productService.js';
import { NotFoundError } from '../middleware/errorHandler.js';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  currentPrice: z.number().positive('Current price must be positive'),
  originalPrice: z.number().positive().optional(),
  platform: z.string().optional().default('Amazon')
});

export const updateProductSchema = createProductSchema.partial();

export const getProducts = async (req, res, next) => {
  try {
    const result = await getProductsService(req.query);
    res.json({
      success: true,
      data: result.products,
      products: result.products,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await getProductByIdService(req.params.id);
    res.json({
      success: true,
      data: product,
      product
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const data = req.body;
    const originalPrice = data.originalPrice || Math.round(data.currentPrice * 1.15);
    const discountPercentage = Math.round(((originalPrice - data.currentPrice) / originalPrice) * 100);

    const product = await prisma.product.create({
      data: {
        ...data,
        originalPrice,
        discountPercentage: Math.max(0, discountPercentage)
      }
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Product '${id}' not found`, 'PRODUCT_NOT_FOUND');
    }

    const data = req.body;
    const updated = await prisma.product.update({
      where: { id },
      data
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Product '${id}' not found`, 'PRODUCT_NOT_FOUND');
    }

    await prisma.product.delete({ where: { id } });
    res.json({
      success: true,
      data: { id },
      message: 'Product deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

export const getPlatformPrices = async (req, res, next) => {
  try {
    const prices = await getPlatformPricesService(req.params.id);
    res.json({
      success: true,
      data: prices
    });
  } catch (err) {
    next(err);
  }
};

export const getProductHistory = async (req, res, next) => {
  try {
    const history = await getPriceHistoryRecordsService(req.params.id, req.query);
    res.json({
      success: true,
      data: history
    });
  } catch (err) {
    next(err);
  }
};

export const getPriceHistory = async (req, res, next) => {
  try {
    const result = await getPriceHistoryService(req.params.id, req.query);
    res.json({
      success: true,
      data: result.history,
      stats: result.stats
    });
  } catch (err) {
    next(err);
  }
};
