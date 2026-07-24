
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
  id: string;
  name: string;
  category: string;
  image: string;
  currentPrice: number;
  historicalPrices: PricePoint[];
  platforms: PlatformPrice[];
  analysis?: AIAnalysis;
}

export interface BudgetAlert {
  id: string;
  productId: string;
  productName: string;
  targetPrice: number;
  createdAt: string;
}
