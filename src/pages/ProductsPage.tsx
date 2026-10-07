import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import { Product, ProductFilters } from '../types';
import ProductGrid from '../components/ProductGrid';
import SetAlertModal from '../components/SetAlertModal';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Tag,
  Store,
  Layers,
  Sparkles
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductForAlert, setSelectedProductForAlert] = useState<Product | null>(null);

  useEffect(() => {
    document.title = 'Browse Products - Best Deal AI';
  }, []);

  // Filters state initialized from URL params
  const [filters, setFilters] = useState<ProductFilters>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    brand: searchParams.get('brand') || 'All',
    platform: searchParams.get('platform') || 'All',
    minPrice: 0,
    maxPrice: 200000,
    sortBy: 'rating',
  });

  const categories = ['All', 'Mobiles', 'Laptops', 'Gaming', 'Home Appliances', 'Accessories', 'Electronics'];
  const brands = ['All', 'Apple', 'Samsung', 'Sony', 'LG', 'OnePlus'];
  const platforms = ['All', 'Amazon', 'Flipkart', 'Croma'];

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getProducts(filters);
      if (res.success && res.data) {
        setProducts(res.data);
      } else {
        setError(res.error || 'Failed to fetch product catalog');
      }
    } catch (err) {
      setError('Product catalog server unreachable');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Sync URL searchParams to filters
  useEffect(() => {
    const searchUrl = searchParams.get('search');
    const categoryUrl = searchParams.get('category');
    if (searchUrl !== null || categoryUrl !== null) {
      setFilters((prev) => ({
        ...prev,
        search: searchUrl || '',
        category: categoryUrl || 'All',
      }));
    }
  }, [searchParams]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      brand: 'All',
      platform: 'All',
      minPrice: 0,
      maxPrice: 200000,
      sortBy: 'rating',
    });
    setSearchParams({});
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Explore Products</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare prices & deal analytics across major online retailers
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search deals..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            aria-label="Search products in catalog"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2.5 min-h-[44px] text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Main Filter & Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <aside className="bg-white p-5 rounded-xl border border-slate-200 space-y-5 h-fit shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold min-h-[36px] px-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Category</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilters({ ...filters, category: cat })}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium min-h-[36px] transition-colors ${
                    filters.category === cat
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              <span>Brand</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setFilters({ ...filters, brand: b })}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium min-h-[36px] transition-colors ${
                    filters.brand === b
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-slate-500" />
              <span>Store Platform</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setFilters({ ...filters, platform: p })}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium min-h-[36px] transition-colors ${
                    filters.platform === p
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <div className="flex justify-between text-xs text-slate-700 font-semibold">
              <span>Max Price</span>
              <span className="font-bold text-blue-600">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="200000"
              step="5000"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              aria-label="Filter maximum price"
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-4">
          {/* Top Sort & Count Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-600">
              Showing <span className="text-slate-900 font-bold">{products.length}</span> products
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-by-select" className="text-xs text-slate-600 font-medium">Sort by:</label>
              <select
                id="sort-by-select"
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-semibold"
              >
                <option value="rating">Top Rated</option>
                <option value="discount">Highest Discount %</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <ProductGrid
            products={products}
            isLoading={isLoading}
            error={error}
            onRetry={fetchProducts}
            onSetAlert={(p) => setSelectedProductForAlert(p)}
            emptyTitle="No matching deals found"
            emptySubtitle="Try resetting your filters or adjusting your search query."
          />
        </main>
      </div>

      {/* Set Alert Modal */}
      {selectedProductForAlert && (
        <SetAlertModal
          product={selectedProductForAlert}
          onClose={() => setSelectedProductForAlert(null)}
        />
      )}
    </div>
  );
};

export default ProductsPage;
