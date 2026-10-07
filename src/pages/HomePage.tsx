import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import { Product } from '../types';
import ProductGrid from '../components/ProductGrid';
import SetAlertModal from '../components/SetAlertModal';
import {
  Sparkles,
  Search,
  TrendingDown,
  LineChart,
  ShieldCheck,
  Bell,
  ArrowRight,
  Smartphone,
  Laptop,
  Gamepad2,
  Tv,
  Headphones,
  Zap,
  CheckCircle2,
  Cpu,
  ShoppingBag
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForAlert, setSelectedProductForAlert] = useState<Product | null>(null);

  useEffect(() => {
    document.title = 'Best Deal AI - Smart Price Comparison & Alerts';
  }, []);

  const fetchFeaturedProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getProducts();
      if (res.success && res.data) {
        setProducts(res.data.slice(0, 8)); // Top 8 featured
      } else {
        setError(res.error || 'Failed to fetch featured products');
      }
    } catch (err: any) {
      setError('Could not connect to product server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: 'Mobiles', icon: <Smartphone className="w-5 h-5 text-blue-600" /> },
    { name: 'Laptops', icon: <Laptop className="w-5 h-5 text-blue-600" /> },
    { name: 'Gaming', icon: <Gamepad2 className="w-5 h-5 text-blue-600" /> },
    { name: 'Home Appliances', icon: <Tv className="w-5 h-5 text-blue-600" /> },
    { name: 'Accessories', icon: <Headphones className="w-5 h-5 text-blue-600" /> },
    { name: 'Electronics', icon: <Zap className="w-5 h-5 text-blue-600" /> },
  ];

  const steps = [
    {
      step: '01',
      title: 'Compare Prices',
      desc: 'View live prices across Amazon, Flipkart, Croma, and other major stores side-by-side.',
      icon: <Search className="w-5 h-5 text-blue-600" />,
    },
    {
      step: '02',
      title: 'Track Price History',
      desc: 'Check historical price charts to see if today’s price is actually a good deal.',
      icon: <LineChart className="w-5 h-5 text-blue-600" />,
    },
    {
      step: '03',
      title: 'Get AI Insights & Alerts',
      desc: 'Get Gemini AI recommendations and set target price alerts to buy at the right time.',
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
    },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Smart Price Comparison</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Find a better price before you buy
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Compare live prices across Amazon, Flipkart, and Croma with historical price tracking and Gemini AI analysis.
          </p>

          {/* Search bar */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 focus-within:bg-white transition-all">
              <div className="flex items-center flex-1 px-3 py-2 min-h-[44px]">
                <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search products (e.g. iPhone 16 Pro, MacBook Air, PS5)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors min-h-[44px] shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Browse Categories</h2>
            <p className="text-xs text-slate-500">Explore products by category</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col items-center text-center space-y-2 hover:border-blue-500 hover:shadow-xs transition-all group"
            >
              <div className="p-2.5 bg-blue-50 rounded-lg group-hover:scale-105 transition-transform">
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Featured Products</h2>
            <p className="text-xs text-slate-500">Popular items with price history and deal insights</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            <span>All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid
          products={products}
          isLoading={isLoading}
          error={error}
          onRetry={fetchFeaturedProducts}
          onSetAlert={(p) => setSelectedProductForAlert(p)}
          skeletonCount={8}
        />
      </section>

      {/* Simple How It Works Section */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl font-bold text-slate-900">How Best Deal AI Helps You</h2>
          <p className="text-xs text-slate-500">
            A simple 3-step process to ensure you buy products at the best available price.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-slate-400">{item.step}</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Price Alert Modal */}
      {selectedProductForAlert && (
        <SetAlertModal
          product={selectedProductForAlert}
          onClose={() => setSelectedProductForAlert(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
