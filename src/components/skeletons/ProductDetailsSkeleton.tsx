import React from 'react';

export const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="h-[400px] bg-slate-100 rounded-xl border border-slate-200" />
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-3" />
            <div className="h-8 bg-slate-200 rounded w-4/5 mb-4" />
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-6" />
            <div className="space-y-3 mb-8">
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-5/6" />
              <div className="h-4 bg-slate-100 rounded w-4/6" />
            </div>
          </div>
          <div className="h-16 bg-slate-100 rounded-xl border border-slate-200" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-72 bg-slate-100 rounded-xl border border-slate-200" />
        <div className="h-72 bg-slate-100 rounded-xl border border-slate-200" />
      </div>
    </div>
  );
};
