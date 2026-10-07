import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  React.useEffect(() => {
    document.title = '404 - Page Not Found';
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="bg-white max-w-md w-full rounded-xl p-8 text-center border border-slate-200 shadow-md space-y-6">
        <div className="w-14 h-14 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-bold text-slate-900 block">404</span>
          <h1 className="text-xl font-bold text-slate-900">Page Not Found</h1>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
            The product page or link you requested does not exist or may have been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors min-h-[44px]"
          >
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
