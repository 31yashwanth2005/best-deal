import React from 'react';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-center gap-6 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-slate-200" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-100 rounded w-1/4" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-32 bg-white border border-slate-200 rounded-xl" />
        <div className="h-32 bg-white border border-slate-200 rounded-xl" />
      </div>
    </div>
  );
};
