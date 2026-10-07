import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { User, Mail, Calendar, ShieldCheck, Sparkles, Bell, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    document.title = 'My Profile - Best Deal AI';
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    updateUserProfile({ name, email });
    setIsEditing(false);
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-5">
        <img
          src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
          alt={user?.name || 'User avatar'}
          className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 object-cover shadow-xs shrink-0"
        />
        <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Best Deal Member</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 truncate">{user?.name}</h1>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Account Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Account Status</span>
          <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Active & Verified</span>
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Price Alert Service</span>
          <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Notifications Active</span>
          </p>
        </div>
      </div>

      {/* Details Form */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
          Account Information
        </h2>

        <form onSubmit={handleSave} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="profile-display-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Display Name
            </label>
            <input
              id="profile-display-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 min-h-[44px] text-sm text-slate-900 font-semibold disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="profile-email-address" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              id="profile-email-address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 min-h-[44px] text-sm text-slate-900 font-semibold disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="pt-2 flex gap-3">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors min-h-[44px]"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200 transition-colors min-h-[44px]"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 transition-colors min-h-[44px]"
              >
                Edit Details
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
