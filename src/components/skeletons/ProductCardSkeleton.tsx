import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs animate-pulse flex flex-col justify-between h-[380px]">
      <div>
        <div className="w-full h-44 bg-slate-100 rounded-lg mb-4" />
        <div className="h-3 bg-slate-200 rounded w-1/3 mb-2" />
        <div className="h-4 bg-slate-200 rounded w-4/5 mb-3" />
        <div className="h-3 bg-slate-100 rounded w-1/4 mb-4" />
      </div>
      <div>
        <div className="h-5 bg-slate-200 rounded w-1/2 mb-4" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 bg-slate-100 rounded-lg" />
          <div className="h-10 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
