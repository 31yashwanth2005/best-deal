import React from 'react';

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="w-full h-64 bg-white border border-slate-200 rounded-xl animate-pulse p-4 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-4 bg-slate-200 rounded w-1/6" />
      </div>
      <div className="h-40 bg-slate-100 rounded-lg" />
    </div>
  );
};
