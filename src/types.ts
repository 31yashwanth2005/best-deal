export enum PurchaseDecision {
  BUY_NOW = 'BUY_NOW',
  WAIT = 'WAIT',
  PRICE_INCREASE = 'PRICE_INCREASE'
}

export interface PricePoint {
  date: string;
  price: number;
  isForecast?: boolean;
}

export interface PlatformPrice {
  platform: string;
  price: number;
  url: string;
  availability: boolean;
  logo?: string;
  rating?: number;
}

export interface AIAnalysis {
  decision: PurchaseDecision;
  confidence: number;
  reasoning: string[];
  authenticDiscount: boolean;
  discountScore: number;
  predictedPrice: number;
}

export interface Product {
  id: string | number;
  name: string;
  brand: string;
  category: string;
  image: string;
  image_url?: string; // Compatibility with legacy field
  currentPrice: number;
  price?: number; // Compatibility with legacy backend response
  originalPrice?: number;
  discountPercentage?: number;
  rating?: number;
  reviewCount?: number;
  platform?: string;
  platforms?: PlatformPrice[];
  historicalPrices?: PricePoint[];
  analysis?: AIAnalysis;
  description?: string;
  specifications?: Record<string, string>;
  inStock?: boolean;
  createdAt?: string;
}

export interface BudgetAlert {
  id: string;
  productId: string | number;
  productName: string;
  productImage?: string;
  currentPrice: number;
  targetPrice: number;
  status: 'ACTIVE' | 'DISABLED';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface ProductFilters {
  search: string;
  category: string;
  brand: string;
  platform: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'price-asc' | 'price-desc' | 'discount' | 'rating' | 'newest';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  products?: T; // For legacy /api/products response format
  error?: string;
  message?: string;
}
