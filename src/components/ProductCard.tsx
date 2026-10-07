import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import DecisionBadge from './DecisionBadge';
import { Star, Bell, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSetAlert?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSetAlert }) => {
  const price = product.currentPrice ?? product.price ?? 0;
  const originalPrice = product.originalPrice;
  const discount = product.discountPercentage;
  const rating = product.rating;
  const reviewCount = product.reviewCount;
  const decision = product.analysis?.decision;
  const imageUrl = product.image || product.image_url;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between h-full hover:border-blue-300 hover:shadow-sm transition-all">
      {/* Top Section */}
      <div className="space-y-3">
        {/* Fixed aspect ratio Image container */}
        <div className="relative w-full aspect-[4/3] bg-slate-50 rounded-md overflow-hidden flex items-center justify-center p-2 border border-slate-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
              }}
            />
          ) : (
            <div className="text-slate-400 text-xs font-medium">No image</div>
          )}

          {/* Discount badge */}
          {discount && discount > 0 ? (
            <span className="absolute top-2 right-2 bg-emerald-600 text-white font-semibold text-[11px] px-2 py-0.5 rounded">
              {discount}% OFF
            </span>
          ) : null}

          {/* Platform badge */}
          {product.platform && (
            <span className="absolute top-2 left-2 bg-slate-900/80 text-white font-medium text-[10px] px-2 py-0.5 rounded">
              {product.platform}
            </span>
          )}
        </div>

        {/* Brand & Category */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>{product.brand}</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">{product.category}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        {/* Rating if available */}
        {rating !== undefined && (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            <span className="font-semibold text-slate-800">{rating}</span>
            {reviewCount !== undefined && (
              <span className="text-slate-400">({reviewCount.toLocaleString()})</span>
            )}
          </div>
        )}

        {/* AI Decision Pill if available */}
        {decision && (
          <div className="pt-1">
            <DecisionBadge decision={decision} size="sm" />
          </div>
        )}
      </div>

      {/* Bottom Pricing & Action buttons */}
      <div className="pt-3 border-t border-slate-100 mt-3 space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs text-slate-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors min-h-[44px]"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => onSetAlert && onSetAlert(product)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors min-h-[44px]"
          >
            <Bell className="w-3.5 h-3.5 text-slate-500" />
            <span>Set Alert</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
