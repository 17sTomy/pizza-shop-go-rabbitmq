import React, { createContext, useContext, useState, useCallback } from 'react';

type Toast = { id: number; message: string; type?: 'success' | 'error' | 'info' };

interface ToastContextType {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 left-4 z-50 space-y-2 w-[90%] max-w-sm">
        {toasts.map(t => {
          const tone =
            t.type === 'success'
              ? 'bg-success-50 border-success text-success-700'
              : t.type === 'error'
              ? 'bg-danger-50 border-danger text-danger-700'
              : 'bg-default-100 border-default-300 text-default-700';
          return (
            <div
              key={t.id}
              className={`px-4 py-3 rounded-medium shadow-medium text-sm border ${tone}`}
            >
              {t.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};


