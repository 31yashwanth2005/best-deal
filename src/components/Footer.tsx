import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-600 py-10 px-4 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-base font-bold text-slate-900">Best Deal AI</span>
          <p className="text-xs text-slate-500 mt-1">
            Compare prices. Check price history. Buy smarter.
          </p>
        </div>

        <nav className="flex items-center gap-6 text-xs font-medium text-slate-700">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <Link to="/alerts" className="hover:text-blue-600 transition-colors">Price Alerts</Link>
        </nav>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Best Deal AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
