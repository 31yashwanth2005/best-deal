import React, { useState } from 'react';
import { Product } from '../types';
import { createAlert } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Bell, X, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

interface SetAlertModalProps {
  product: Product;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SetAlertModal: React.FC<SetAlertModalProps> = ({ product, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const currentPrice = product.currentPrice || product.price || 0;
  const suggestedTarget = Math.round(currentPrice * 0.9);

  const [targetPrice, setTargetPrice] = useState<number>(suggestedTarget);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice || targetPrice <= 0) {
      showToast('Please enter a valid target price', 'error');
      return;
    }
    if (targetPrice >= currentPrice) {
      showToast('Target price should be lower than the current price to trigger an alert', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createAlert({
        productId: product.id,
        targetPrice: Number(targetPrice),
      });

      if (res.success) {
        showToast(`Price alert set for ₹${targetPrice.toLocaleString('en-IN')}!`, 'success', 'Alert Created');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        showToast(res.error || 'Failed to create price alert', 'error');
      }
    } catch (err) {
      showToast('Error setting price alert', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const percentDrop = Math.round(((currentPrice - targetPrice) / currentPrice) * 100);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-md w-full rounded-xl p-6 border border-slate-200 shadow-xl relative space-y-5 text-slate-900"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 id="alert-modal-title" className="text-base font-semibold text-slate-900">
              Create Price Alert
            </h3>
            <p className="text-xs text-slate-500">Get notified when price falls below target</p>
          </div>
        </div>

        {/* Product mini card */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <img
            src={product.image || product.image_url}
            alt={product.name}
            className="w-12 h-12 object-contain rounded-md bg-white border border-slate-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-900 truncate">{product.name}</h4>
            <p className="text-[11px] text-slate-500">{product.brand}</p>
            <p className="text-xs font-semibold text-emerald-600 mt-0.5">
              Current: ₹{currentPrice.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Alert Form */}
        <form onSubmit={handleCreateAlert} className="space-y-4">
          <div>
            <label htmlFor="target-price-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Alert Price (₹)
            </label>
            <input
              id="target-price-input"
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              placeholder="e.g. 70000"
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 min-h-[44px] text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />
          </div>

          {targetPrice > 0 && targetPrice < currentPrice && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900 flex items-center justify-between">
              <span>Required Price Drop:</span>
              <span className="font-semibold text-emerald-700">
                ₹{(currentPrice - targetPrice).toLocaleString('en-IN')} ({percentDrop}% drop)
              </span>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 min-h-[44px] py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Set Alert</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetAlertModal;
