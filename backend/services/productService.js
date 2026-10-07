import prisma from '../config/prisma.js';
import { NotFoundError } from '../middleware/errorHandler.js';

export const getProductsService = async (filters = {}) => {
  const page = Math.max(1, parseInt(filters.page || 1, 10));
  const limit = Math.min(100, Math.max(1, parseInt(filters.limit || 20, 10)));
  const skip = (page - 1) * limit;

  const where = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { brand: { contains: filters.search, mode: 'insensitive' } },
      { category: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } }
    ];
  }

  if (filters.category && filters.category !== 'All') {
    where.category = { equals: filters.category, mode: 'insensitive' };
  }

  if (filters.brand && filters.brand !== 'All') {
    where.brand = { equals: filters.brand, mode: 'insensitive' };
  }

  if (filters.platform && filters.platform !== 'All') {
    where.platform = { equals: filters.platform, mode: 'insensitive' };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.currentPrice = {};
    if (filters.minPrice !== undefined) where.currentPrice.gte = parseFloat(filters.minPrice);
    if (filters.maxPrice !== undefined && parseFloat(filters.maxPrice) > 0) {
      where.currentPrice.lte = parseFloat(filters.maxPrice);
    }
  }

  let orderBy = { createdAt: 'desc' };
  if (filters.sortBy === 'price-asc') orderBy = { currentPrice: 'asc' };
  if (filters.sortBy === 'price-desc') orderBy = { currentPrice: 'desc' };
  if (filters.sortBy === 'discount') orderBy = { discountPercentage: 'desc' };
  if (filters.sortBy === 'rating') orderBy = { rating: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        prices: true,
        history: { take: 10, orderBy: { recordedAt: 'asc' } },
        analyses: { take: 1, orderBy: { createdAt: 'desc' } }
      }
    }),
    prisma.product.count({ where })
  ]);

  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    image: p.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    image_url: p.imageUrl,
    currentPrice: p.currentPrice,
    price: p.currentPrice,
    originalPrice: p.originalPrice || Math.round(p.currentPrice * 1.15),
    discountPercentage: p.discountPercentage || 10,
    rating: p.rating || 4.5,
    reviewCount: p.reviewCount || 100,
    platform: p.platform || 'Amazon',
    inStock: p.inStock,
    description: p.description,
    platforms: p.prices.map((pr) => ({
      platform: pr.platform,
      price: pr.price,
      originalPrice: pr.originalPrice,
      discountPercentage: pr.discountPercentage,
      url: pr.productUrl || '#',
      availability: pr.availability
    })),
    historicalPrices: p.history.map((h) => ({
      date: new Date(h.recordedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      price: h.price
    })),
    analysis: p.analyses[0]
      ? {
          decision: p.analyses[0].decision,
          confidence: p.analyses[0].confidence,
          reasoning: p.analyses[0].reasoning,
          authenticDiscount: p.analyses[0].discountAuthentic,
          discountScore: p.analyses[0].discountScore,
          predictedPrice: p.analyses[0].predictedPrice
        }
      : undefined
  }));

  return {
    products: formattedProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getProductByIdService = async (id) => {
  const p = await prisma.product.findUnique({
    where: { id },
    include: {
      prices: true,
      history: { orderBy: { recordedAt: 'asc' } },
      analyses: { take: 1, orderBy: { createdAt: 'desc' } }
    }
  });

  if (!p) {
    throw new NotFoundError(`Product with ID '${id}' not found`, 'PRODUCT_NOT_FOUND');
  }

  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    image: p.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    image_url: p.imageUrl,
    currentPrice: p.currentPrice,
    price: p.currentPrice,
    originalPrice: p.originalPrice || Math.round(p.currentPrice * 1.15),
    discountPercentage: p.discountPercentage || 10,
    rating: p.rating || 4.5,
    reviewCount: p.reviewCount || 100,
    platform: p.platform || 'Amazon',
    inStock: p.inStock,
    description: p.description,
    platforms: p.prices.map((pr) => ({
      platform: pr.platform,
      price: pr.price,
      originalPrice: pr.originalPrice,
      discountPercentage: pr.discountPercentage,
      url: pr.productUrl || '#',
      availability: pr.availability
    })),
    historicalPrices: p.history.map((h) => ({
      date: new Date(h.recordedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      price: h.price
    })),
    analysis: p.analyses[0]
      ? {
          decision: p.analyses[0].decision,
          confidence: p.analyses[0].confidence,
          reasoning: p.analyses[0].reasoning,
          authenticDiscount: p.analyses[0].discountAuthentic,
          discountScore: p.analyses[0].discountScore,
          predictedPrice: p.analyses[0].predictedPrice
        }
      : undefined
  };
};

export const getPlatformPricesService = async (productId) => {
  await getProductByIdService(productId);
  return prisma.platformPrice.findMany({
    where: { productId },
    orderBy: { price: 'asc' }
  });
};

export const getPriceHistoryRecordsService = async (productId, filters = {}) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new NotFoundError(`Product with ID '${productId}' not found`, 'PRODUCT_NOT_FOUND');
  }

  const where = { productId };
  if (filters.platform) where.platform = filters.platform;
  if (filters.startDate || filters.endDate) {
    where.recordedAt = {};
    if (filters.startDate) where.recordedAt.gte = new Date(filters.startDate);
    if (filters.endDate) where.recordedAt.lte = new Date(filters.endDate);
  }

  return prisma.priceHistory.findMany({
    where,
    orderBy: { recordedAt: 'asc' }
  });
};

export const getPriceHistoryService = async (productId, filters = {}) => {
  await getProductByIdService(productId);

  const where = { productId };
  if (filters.platform) where.platform = filters.platform;
  if (filters.startDate || filters.endDate) {
    where.recordedAt = {};
    if (filters.startDate) where.recordedAt.gte = new Date(filters.startDate);
    if (filters.endDate) where.recordedAt.lte = new Date(filters.endDate);
  }

  const history = await prisma.priceHistory.findMany({
    where,
    orderBy: { recordedAt: 'asc' }
  });

  const prices = history.map((h) => h.price);
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const highestPrice = prices.length ? Math.max(...prices) : 0;
  const averagePrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const currentPrice = prices.length ? prices[prices.length - 1] : 0;

  return {
    history: history.map((h) => ({
      date: new Date(h.recordedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      price: h.price,
      recordedAt: h.recordedAt
    })),
    stats: {
      lowestPrice,
      highestPrice,
      averagePrice,
      currentPrice
    }
  };
};
