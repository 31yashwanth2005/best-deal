import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, analyzeProduct } from '../services/api';
import { Product, AIAnalysis } from '../types';
import PriceChart from '../components/PriceChart';
import DecisionBadge from '../components/DecisionBadge';
import SetAlertModal from '../components/SetAlertModal';
import { ProductDetailsSkeleton } from '../components/skeletons/ProductDetailsSkeleton';
import { useToast } from '../contexts/ToastContext';
import {
  Sparkles,
  Bell,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Star,
  Info,
  Store,
  RefreshCw,
  Cpu
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} - Price History & Analysis`;
    } else {
      document.title = 'Product Details - Best Deal AI';
    }
  }, [product]);

  const fetchDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getProduct(id);
      if (res.success && res.data) {
        setProduct(res.data);
        if (res.data.analysis) {
          setAnalysis(res.data.analysis);
        } else {
          runAIAnalysis(id);
        }
      } else {
        setError(res.error || 'Product not found');
      }
    } catch (err) {
      setError('Could not fetch product details');
    } finally {
      setIsLoading(false);
    }
  };

  const runAIAnalysis = async (productId: string | number) => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeProduct(productId);
      if (res.success && res.data) {
        setAnalysis(res.data);
      }
    } catch (err) {
      console.warn('AI analysis proxy call error', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
          <p className="text-sm text-slate-600">{error || 'The requested deal could not be retrieved.'}</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  const price = product.currentPrice ?? product.price ?? 0;
  const originalPrice = product.originalPrice;
  const discount = product.discountPercentage;
  const imageUrl = product.image || product.image_url;

  return (
    <div className="space-y-8 py-4">
      {/* Back breadcrumb */}
      <div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Main Details Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Product Image Box */}
        <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-xs flex items-center justify-center relative min-h-[350px]">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-[360px] w-full object-contain rounded-lg"
          />
          {discount && discount > 0 ? (
            <div className="absolute top-4 right-4 bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-md shadow-xs">
              {discount}% OFF
            </div>
          ) : null}
        </div>

        {/* Info & Buy Box */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
              <span className="text-blue-600">{product.brand}</span>
              <span>•</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{product.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">{product.name}</h1>

            {product.rating !== undefined && (
              <div className="flex items-center gap-2 pt-1 text-xs">
                <div className="flex items-center text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500 mr-1" />
                  <span>{product.rating}</span>
                </div>
                {product.reviewCount && (
                  <span className="text-slate-500 font-medium">({product.reviewCount.toLocaleString()} verified customer reviews)</span>
                )}
              </div>
            )}
          </div>

          {/* Pricing Box */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs text-slate-500 font-medium">Current Best Price</span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-emerald-600">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-base text-slate-400 line-through font-semibold">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Quick AI Decision Pill */}
            {analysis && (
              <div className="pt-2 flex items-center gap-3 border-t border-slate-100 mt-2">
                <span className="text-xs text-slate-500 font-medium">AI Analysis:</span>
                <DecisionBadge decision={analysis.decision} size="md" />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-semibold text-sm transition-colors min-h-[44px]"
            >
              <Bell className="w-4 h-4 text-amber-700" />
              <span>Set Price Alert</span>
            </button>

            {product.platforms && product.platforms.length > 0 && (
              <a
                href={product.platforms[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors min-h-[44px]"
              >
                <span>Buy on {product.platforms[0].platform}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Product description */}
          {product.description && (
            <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-4">
              <h2 className="font-bold text-slate-900 text-xs">Product Details</h2>
              <p>{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Platform Comparison Section */}
      {product.platforms && product.platforms.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-blue-600" />
              <span>Retailer Price Comparison</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time price & stock check across major stores</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.platforms.map((plat) => (
              <div
                key={plat.platform}
                className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">{plat.platform}</span>
                  <span className="text-base font-bold text-emerald-700">
                    ₹{plat.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {plat.availability ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <a
                  href={plat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-md bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors min-h-[36px]"
                >
                  <span>Visit Store</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price History & AI Intelligence Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price History Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-blue-600" />
              <span>Price Trend & Next Week Forecast</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Historical pricing graph with predictive AI forecast</p>
          </div>

          <PriceChart
            data={product.historicalPrices || []}
            predictedPrice={analysis?.predictedPrice}
          />
        </div>

        {/* Gemini AI Decision Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <div className="flex items-center gap-2 text-slate-900">
                <Cpu className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Gemini AI Engine</span>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-bold">
                SECURE PROXY
              </span>
            </div>

            {analysis ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-xs text-slate-500 font-medium">Recommendation:</span>
                  <div>
                    <DecisionBadge decision={analysis.decision} size="lg" />
                  </div>
                </div>

                {/* Confidence meter */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">AI Confidence Score</span>
                    <span className="text-blue-600">{analysis.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysis.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Authentic discount indicator */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium">Discount Authenticity</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {analysis.discountScore}/100 Verified
                  </span>
                </div>

                {/* Reasoning bullet points */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-900">Explainable AI Reasoning</h3>
                  <ul className="space-y-2">
                    {analysis.reasoning.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                <p className="text-xs text-slate-500">Computing AI price prediction model...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Set Alert Modal */}
      {isAlertModalOpen && (
        <SetAlertModal
          product={product}
          onClose={() => setIsAlertModalOpen(false)}
          onSuccess={() => showToast('Price alert added to your dashboard!', 'success')}
        />
      )}
    </div>
  );
};

export default ProductDetailsPage;
