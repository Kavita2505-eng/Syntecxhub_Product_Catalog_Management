import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showSuccess: (msg) => addToast(msg, 'success'), showError: (msg) => addToast(msg, 'error'), showInfo: (msg) => addToast(msg, 'info') }}>
      {children}
      {/* Toast Render Portal Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-card border text-sm font-medium transition-all duration-300 transform translate-x-0 bg-white ${
              toast.type === 'success'
                ? 'border-l-4 border-l-emerald-500 border-slate-200/80 text-slate-800'
                : toast.type === 'error'
                ? 'border-l-4 border-l-rose-500 border-slate-200/80 text-slate-800'
                : 'border-l-4 border-l-blue-500 border-slate-200/80 text-slate-800'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
              {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-500" />}
              {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
            </div>
            <div className="flex-1 text-slate-700 font-normal pr-2 break-words">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
