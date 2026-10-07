import axios from "axios";
import {
  Product,
  ProductFilters,
  PricePoint,
  PlatformPrice,
  AIAnalysis,
  BudgetAlert,
  User,
  ApiResponse,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attach auth token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("bestdeal_auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to normalize backend product objects
function normalizeProduct(p: any): Product {
  const currentPrice = Number(p.currentPrice || p.price || 0);
  const originalPrice = Number(p.originalPrice || Math.round(currentPrice * 1.15));
  const discountPercentage = p.discountPercentage !== undefined 
    ? Number(p.discountPercentage)
    : Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  return {
    id: p.id,
    name: p.name || 'Unnamed Product',
    brand: p.brand || 'Generic',
    category: p.category || 'General',
    image: p.image || p.imageUrl || p.image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    currentPrice,
    price: currentPrice,
    originalPrice,
    discountPercentage: Math.max(0, discountPercentage),
    rating: p.rating || 4.5,
    reviewCount: p.reviewCount || 120,
    platform: p.platform || 'Amazon',
    inStock: p.inStock !== false,
    platforms: p.platforms || [
      { platform: p.platform || 'Amazon', price: currentPrice, url: '#', availability: true }
    ],
    historicalPrices: p.historicalPrices || [],
    analysis: p.analysis,
    description: p.description || 'Premium high-performance product with full official warranty.'
  };
}

// ======================= API FUNCTIONS =======================

export async function getProducts(filters?: Partial<ProductFilters>): Promise<ApiResponse<Product[]>> {
  try {
    const response = await API.get('/v1/products');
    let rawList: any[] = [];
    
    if (Array.isArray(response.data)) {
      rawList = response.data;
    } else if (response.data && Array.isArray(response.data.products)) {
      rawList = response.data.products;
    } else if (response.data && Array.isArray(response.data.data)) {
      rawList = response.data.data;
    }

    let products = rawList.map(normalizeProduct);

    // Apply Client-Side Filtering if filters provided
    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        products = products.filter(
          p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
        );
      }
      if (filters.category && filters.category !== 'All') {
        products = products.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
      }
      if (filters.brand && filters.brand !== 'All') {
        products = products.filter(p => p.brand.toLowerCase() === filters.brand.toLowerCase());
      }
      if (filters.platform && filters.platform !== 'All') {
        products = products.filter(p => p.platform?.toLowerCase() === filters.platform.toLowerCase());
      }
      if (filters.minPrice !== undefined) {
        products = products.filter(p => p.currentPrice >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
        products = products.filter(p => p.currentPrice <= filters.maxPrice!);
      }

      // Sorting
      if (filters.sortBy === 'price-asc') {
        products.sort((a, b) => a.currentPrice - b.currentPrice);
      } else if (filters.sortBy === 'price-desc') {
        products.sort((a, b) => b.currentPrice - a.currentPrice);
      } else if (filters.sortBy === 'discount') {
        products.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
      } else if (filters.sortBy === 'rating') {
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
    }

    return { success: true, data: products, products };
  } catch (err: any) {
    return {
      success: false,
      error: "Unable to load products from backend"
    };
  }
}

export async function getProduct(id: string | number): Promise<ApiResponse<Product>> {
  try {
    const response = await API.get(`/v1/products/${id}`);
    const prodData = response.data?.data || response.data?.product || response.data;
    if (prodData && typeof prodData === 'object' && prodData.id) {
      return { success: true, data: normalizeProduct(prodData) };
    }
    return { success: false, error: "Product not found" };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.error?.message || "Failed to fetch product"
    };
  }
}

export async function searchProducts(query: string): Promise<ApiResponse<Product[]>> {
  return getProducts({ search: query, category: 'All', brand: 'All', platform: 'All', minPrice: 0, maxPrice: 0, sortBy: 'rating' });
}

export async function getPriceHistory(id: string | number): Promise<ApiResponse<PricePoint[]>> {
  try {
    const response = await API.get(`/v1/products/${id}/history`);
    const historyList = response.data?.data || response.data?.history || response.data || [];
    const points: PricePoint[] = Array.isArray(historyList)
      ? historyList.map((h: any) => ({
          date: h.recordedAt
            ? new Date(h.recordedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : (h.date || "Unknown"),
          price: Number(h.price || 0)
        }))
      : [];
    return { success: true, data: points };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.error?.message || "Failed to fetch price history"
    };
  }
}

export async function getPlatformPrices(id: string | number): Promise<ApiResponse<PlatformPrice[]>> {
  const prodRes = await getProduct(id);
  if (!prodRes.success || !prodRes.data) {
    return { success: false, error: prodRes.error || "Failed to fetch platform prices" };
  }
  return {
    success: true,
    data: prodRes.data.platforms || []
  };
}

export async function analyzeProduct(
  id: string | number,
  forceRefresh = false
): Promise<ApiResponse<AIAnalysis>> {
  try {
    const response = await API.post('/v1/ai/analyze', {
      productId: String(id),
      forceRefresh
    });
    const analysisData = response.data?.data || response.data?.analysis;
    if (analysisData) {
      return { success: true, data: analysisData };
    }
    return { success: false, error: "Invalid analysis response from backend" };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.error?.message || "Failed to analyze product price"
    };
  }
}

// Authentication endpoints
export async function login(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
  try {
    const response = await API.post('/v1/auth/login', credentials);
    const authData = response.data?.data || response.data;
    if (authData && (authData.token || response.data.token)) {
      const token = authData.token || response.data.token;
      const user = authData.user || response.data.user;
      localStorage.setItem('bestdeal_auth_token', token);
      return { success: true, data: { user, token } };
    }
    return { success: false, error: response.data?.error?.message || "Login failed" };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.error?.message || err.response?.data?.message || "Login failed"
    };
  }
}

export async function register(data: { name: string; email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
  try {
    const response = await API.post('/v1/auth/register', data);
    const authData = response.data?.data || response.data;
    if (authData && (authData.token || response.data.token)) {
      const token = authData.token || response.data.token;
      const user = authData.user || response.data.user;
      localStorage.setItem('bestdeal_auth_token', token);
      return { success: true, data: { user, token } };
    }
    return { success: false, error: response.data?.error?.message || "Registration failed" };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.error?.message || err.response?.data?.message || "Registration failed"
    };
  }
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  try {
    const response = await API.get('/v1/users/me');
    const user = response.data?.data || response.data?.user;
    if (user) {
      return { success: true, data: user };
    }
    return { success: false, error: "Not authenticated" };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.error?.message || "Not authenticated"
    };
  }
}

// Alerts endpoints
export async function getAlerts(): Promise<ApiResponse<BudgetAlert[]>> {
  try {
    const response = await API.get('/v1/alerts');
    const alerts = response.data?.data || response.data?.alerts || [];
    return { success: true, data: Array.isArray(alerts) ? alerts : [] };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.error?.message || "Failed to fetch price alerts"
    };
  }
}

export async function createAlert(data: { productId: string | number; targetPrice: number }): Promise<ApiResponse<BudgetAlert>> {
  try {
    const response = await API.post('/v1/alerts', {
      productId: String(data.productId),
      targetPrice: Number(data.targetPrice)
    });
    const alert = response.data?.data || response.data?.alert;
    if (alert) {
      return { success: true, data: alert };
    }
    return { success: false, error: "Failed to create price alert" };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.error?.message || "Failed to create price alert"
    };
  }
}

export async function updateAlert(id: string, updates: Partial<BudgetAlert>): Promise<ApiResponse<BudgetAlert>> {
  try {
    const response = await API.patch(`/v1/alerts/${id}`, updates);
    const alert = response.data?.data || response.data?.alert;
    if (alert) {
      return { success: true, data: alert };
    }
    return { success: false, error: "Failed to update price alert" };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.error?.message || "Failed to update price alert"
    };
  }
}

export async function deleteAlert(id: string): Promise<ApiResponse<{ id: string }>> {
  try {
    const response = await API.delete(`/v1/alerts/${id}`);
    return { success: true, data: { id } };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.error?.message || "Failed to delete price alert"
    };
  }
}

export default API;