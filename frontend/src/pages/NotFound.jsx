import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-card border border-slate-200/80 p-8">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-50 text-slate-400 border border-slate-100 mb-5">
          <HelpCircle className="h-8 w-8 text-slate-400" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-1">404</h1>
        <h2 className="text-base font-semibold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          The page you are looking for does not exist or has been moved. Check the URL or return to safety.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors w-full shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
