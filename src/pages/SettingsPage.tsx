import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Settings, Bell, Shield, Moon, Cpu, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [strictDiscounts, setStrictDiscounts] = useState(true);

  React.useEffect(() => {
    document.title = 'Settings - Best Deal AI';
  }, []);

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean, label: string) => {
    setter(!current);
    showToast(`${label} preference updated`, 'info');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Settings <Settings className="w-5 h-5 text-slate-500" />
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">Configure notification triggers and AI deal filters</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          <span>Notification Preferences</span>
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <h3 className="text-xs font-semibold text-slate-900">Email Price Alerts</h3>
              <p className="text-[11px] text-slate-500">Receive instant email when a tracked product reaches target price</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={emailAlerts}
              aria-label="Toggle Email Price Alerts"
              onClick={() => handleToggle(setEmailAlerts, emailAlerts, 'Email Alerts')}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 shrink-0 min-h-[44px] flex items-center ${
                emailAlerts ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  emailAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <h3 className="text-xs font-semibold text-slate-900">Browser Push Notifications</h3>
              <p className="text-[11px] text-slate-500">Show desktop alert badges when price drops are detected</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={browserNotifications}
              aria-label="Toggle Browser Push Notifications"
              onClick={() => handleToggle(setBrowserNotifications, browserNotifications, 'Browser Notifications')}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 shrink-0 min-h-[44px] flex items-center ${
                browserNotifications ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  browserNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2 pt-2">
          <Cpu className="w-4 h-4 text-blue-600" />
          <span>AI Engine & Discount Verification</span>
        </h2>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <h3 className="text-xs font-semibold text-slate-900">Strict Authentic Discount Filtering</h3>
            <p className="text-[11px] text-slate-500">Hide deals where initial prices were artificially inflated right before sales</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={strictDiscounts}
            aria-label="Toggle Strict Authentic Discount Filtering"
            onClick={() => handleToggle(setStrictDiscounts, strictDiscounts, 'Strict Filter')}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 shrink-0 min-h-[44px] flex items-center ${
              strictDiscounts ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                strictDiscounts ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
