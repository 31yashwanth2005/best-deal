import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();
  const { showToast } = useToast();

  const from = (location.state as any)?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    document.title = 'Sign In - Best Deal AI';
  }, []);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});
    try {
      const res = await login({ email, password });
      if (res.success && res.data) {
        loginUser(res.data.user, res.data.token);
        showToast(`Welcome back, ${res.data.user.name}!`, 'success');
        navigate(from, { replace: true });
      } else {
        setErrors({ general: res.error || 'Invalid credentials' });
        showToast(res.error || 'Login failed', 'error');
      }
    } catch (err) {
      setErrors({ general: 'Authentication server unavailable. Please try again.' });
      showToast('Network error during sign in', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="bg-white max-w-md w-full rounded-xl p-8 border border-slate-200 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white mx-auto shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Sign in to Best Deal AI</h1>
          <p className="text-xs text-slate-500">Track price drops & manage your price alerts</p>
        </div>

        {errors.general && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                id="login-email-input"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-slate-50 border ${
                  errors.email ? 'border-rose-500' : 'border-slate-300'
                } rounded-lg pl-9 pr-4 py-2.5 min-h-[44px] text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white`}
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
            {errors.email && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="login-password-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-50 border ${
                  errors.password ? 'border-rose-500' : 'border-slate-300'
                } rounded-lg pl-9 pr-4 py-2.5 min-h-[44px] text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
            {errors.password && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors min-h-[44px]"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
