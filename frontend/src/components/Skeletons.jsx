import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-subtle animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      <div className="h-8 bg-slate-200 rounded-full w-8"></div>
    </div>
    <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
  </div>
);

export const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white border border-slate-200 rounded-lg shadow-subtle overflow-hidden animate-pulse">
    <div className="border-b border-slate-200 bg-slate-50 p-4 flex gap-4">
      <div className="h-4 bg-slate-200 rounded w-1/6"></div>
      <div className="h-4 bg-slate-200 rounded w-1/6"></div>
      <div className="h-4 bg-slate-200 rounded w-1/6"></div>
      <div className="h-4 bg-slate-200 rounded w-1/6"></div>
      <div className="h-4 bg-slate-200 rounded w-1/6"></div>
    </div>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="p-5 flex gap-4">
          <div className="h-5 bg-slate-200 rounded w-1/4"></div>
          <div className="h-5 bg-slate-200 rounded w-1/12"></div>
          <div className="h-5 bg-slate-200 rounded w-1/6"></div>
          <div className="h-5 bg-slate-200 rounded w-1/12"></div>
          <div className="h-5 bg-slate-200 rounded w-1/12 ml-auto"></div>
        </div>
      ))}
    </div>
  </div>
);

export const DetailsSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-card p-6 md:p-8 animate-pulse">
    <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className="space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-8 bg-slate-200 rounded w-1/2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mt-6"></div>
        <div className="h-5 bg-slate-200 rounded w-2/3"></div>
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-8 bg-slate-200 rounded w-1/2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mt-6"></div>
        <div className="h-5 bg-slate-200 rounded w-2/3"></div>
      </div>
    </div>
    <div className="h-20 bg-slate-200 rounded w-full mb-6"></div>
  </div>
);
