import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAlerts, updateAlert, deleteAlert, getProducts } from '../services/api';
import { BudgetAlert, Product } from '../types';
import SetAlertModal from '../components/SetAlertModal';
import { useToast } from '../contexts/ToastContext';
import {
  Bell,
  Trash2,
  Power,
  Plus,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { showToast } = useToast();
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [alertToDelete, setAlertToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    document.title = 'My Price Alerts - Best Deal AI';
  }, []);

  const fetchAlertsAndProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [alertsRes, prodsRes] = await Promise.all([getAlerts(), getProducts()]);

      if (alertsRes.success && alertsRes.data) {
        setAlerts(alertsRes.data);
      }
      if (prodsRes.success && prodsRes.data) {
        setProducts(prodsRes.data);
      }
    } catch (err) {
      setError('Failed to fetch budget alerts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsAndProducts();
  }, []);

  const handleToggleStatus = async (alert: BudgetAlert) => {
    const newStatus = alert.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      const res = await updateAlert(alert.id, { status: newStatus });
      if (res.success && res.data) {
        setAlerts((prev) => prev.map((a) => (a.id === alert.id ? res.data! : a)));
        showToast(
          `Alert for ${alert.productName} is now ${newStatus.toLowerCase()}`,
          'info'
        );
      }
    } catch (err) {
      showToast('Could not update alert status', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!alertToDelete) return;
    try {
      const res = await deleteAlert(alertToDelete.id);
      if (res.success) {
        setAlerts((prev) => prev.filter((a) => a.id !== alertToDelete.id));
        showToast(`Alert for ${alertToDelete.name} removed`, 'success');
      }
    } catch (err) {
      showToast('Could not delete price alert', 'error');
    } finally {
      setAlertToDelete(null);
    }
  };

  const handleOpenAddModal = (prod?: Product) => {
    if (prod) {
      setSelectedProductForModal(prod);
    } else if (products.length > 0) {
      setSelectedProductForModal(products[0]);
    }
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            My Price Alerts <Bell className="w-5 h-5 text-amber-500" />
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Get notified when your tracked products reach your target budget
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Alert</span>
        </button>
      </div>

      {/* Main Alerts List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse h-24 shadow-xs" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white p-8 rounded-xl text-center border border-slate-200 max-w-md mx-auto space-y-4 shadow-xs">
          <p className="text-sm text-slate-600">{error}</p>
          <button
            onClick={fetchAlertsAndProducts}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold min-h-[44px]"
          >
            Retry
          </button>
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center max-w-lg mx-auto border border-slate-200 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">No Price Alerts Yet</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            You haven't set any price drop triggers yet. Browse products and set target prices to start saving!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors min-h-[44px]"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {alerts.map((alert) => {
            const isTargetReached = alert.currentPrice <= alert.targetPrice;
            const diff = alert.currentPrice - alert.targetPrice;

            return (
              <div
                key={alert.id}
                className={`bg-white p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${
                  alert.status === 'ACTIVE'
                    ? isTargetReached
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-slate-200'
                    : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                {/* Left: Product Info */}
                <div className="flex items-center gap-3 min-w-0">
                  {alert.productImage ? (
                    <img
                      src={alert.productImage}
                      alt={alert.productName}
                      className="w-14 h-14 object-contain rounded-md bg-white border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <Link
                      to={`/products/${alert.productId}`}
                      className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors truncate block"
                    >
                      {alert.productName}
                    </Link>
                    <p className="text-[11px] text-slate-500">
                      Set on {new Date(alert.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                          alert.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {alert.status}
                      </span>
                      {isTargetReached && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          TARGET REACHED!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center: Prices comparison */}
                <div className="flex items-center justify-between md:justify-start gap-4 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">Current</span>
                    <span className="text-sm font-bold text-slate-900">
                      ₹{alert.currentPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="h-6 w-px bg-slate-200" />

                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">Target</span>
                    <span className="text-sm font-bold text-blue-600">
                      ₹{alert.targetPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="h-6 w-px bg-slate-200" />

                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">Status</span>
                    <span className={`text-xs font-semibold ${diff <= 0 ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {diff <= 0 ? 'Reached!' : `₹${diff.toLocaleString('en-IN')} away`}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleToggleStatus(alert)}
                    className={`min-h-[44px] px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      alert.status === 'ACTIVE'
                        ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                    title={alert.status === 'ACTIVE' ? 'Disable Alert' : 'Enable Alert'}
                  >
                    <Power className="w-4 h-4" />
                    <span>{alert.status === 'ACTIVE' ? 'Disable' : 'Enable'}</span>
                  </button>

                  <button
                    onClick={() => setAlertToDelete({ id: alert.id, name: alert.productName })}
                    aria-label={`Delete alert for ${alert.productName}`}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {alertToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={() => setAlertToDelete(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-sm w-full rounded-xl p-6 border border-slate-200 shadow-xl space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">Delete Price Alert</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete the price alert for{' '}
              <strong className="text-slate-900">{alertToDelete.name}</strong>?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setAlertToDelete(null)}
                className="flex-1 min-h-[44px] py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 min-h-[44px] py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-colors"
              >
                Delete Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Alert Modal */}
      {isAddModalOpen && selectedProductForModal && (
        <SetAlertModal
          product={selectedProductForModal}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchAlertsAndProducts}
        />
      )}
    </div>
  );
};

export default AlertsPage;
