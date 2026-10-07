import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Sparkles, User as UserIcon, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    document.title = 'Create Account - Best Deal AI';
  }, []);

  const validate = () => {
    const errs: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};

    if (!name.trim()) {
      errs.name = 'Full name is required';
    }

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

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
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
      const res = await register({ name, email, password });
      if (res.success && res.data) {
        loginUser(res.data.user, res.data.token);
        showToast(`Account created successfully! Welcome ${res.data.user.name}`, 'success');
        navigate('/');
      } else {
        setErrors({ general: res.error || 'Registration failed' });
        showToast(res.error || 'Registration error', 'error');
      }
    } catch (err) {
      setErrors({ general: 'Server connection error during registration.' });
      showToast('Network error', 'error');
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
          <h1 className="text-xl font-bold text-slate-900">Create your Account</h1>
          <p className="text-xs text-slate-500">Track price drops & manage your price alerts</p>
        </div>

        {errors.general && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="register-name-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                id="register-name-input"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-slate-50 border ${
                  errors.name ? 'border-rose-500' : 'border-slate-300'
                } rounded-lg pl-9 pr-4 py-2.5 min-h-[44px] text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white`}
              />
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
            {errors.name && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="register-email-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                id="register-email-input"
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
            <label htmlFor="register-password-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="register-password-input"
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

          <div>
            <label htmlFor="register-confirm-password-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="register-confirm-password-input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-slate-50 border ${
                  errors.confirmPassword ? 'border-rose-500' : 'border-slate-300'
                } rounded-lg pl-9 pr-4 py-2.5 min-h-[44px] text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.confirmPassword}</p>
            )}
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
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
