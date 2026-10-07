import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from './skeletons/ProductCardSkeleton';
import { ShoppingBag, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onSetAlert?: (product: Product) => void;
  emptyTitle?: string;
  emptySubtitle?: string;
  skeletonCount?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  error = null,
  onRetry,
  onSetAlert,
  emptyTitle = 'No products found',
  emptySubtitle = 'Try adjusting your search query or filter options.',
  skeletonCount = 6,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 text-center max-w-lg mx-auto my-12 border border-slate-200 shadow-sm">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Unable to load products</h3>
        <p className="text-sm text-slate-600 mb-6">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-xl p-10 text-center max-w-md mx-auto my-12 border border-slate-200 shadow-sm">
        <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">{emptyTitle}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSetAlert={onSetAlert} />
      ))}
    </div>
  );
};

export default ProductGrid;
