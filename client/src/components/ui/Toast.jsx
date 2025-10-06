// src/components/ui/Toast.jsx - Premium toast notification system
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/useAnimation';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast types and their configurations
const toastConfig = {
  success: {
    icon: CheckCircle,
    className: 'bg-success/10 border-success/30 text-success',
    iconClassName: 'text-success'
  },
  error: {
    icon: AlertCircle,
    className: 'bg-danger/10 border-danger/30 text-danger',
    iconClassName: 'text-danger'
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-warning/10 border-warning/30 text-warning',
    iconClassName: 'text-warning'
  },
  info: {
    icon: Info,
    className: 'bg-info/10 border-info/30 text-info',
    iconClassName: 'text-info'
  }
};

// Individual Toast Component
const Toast = ({ toast, onClose }) => {
  const prefersReduced = usePrefersReducedMotion();
  const config = toastConfig[toast.type] || toastConfig.info;
  const Icon = config.icon;
  
  const toastVariants = {
    initial: {
      opacity: 0,
      y: prefersReduced ? 0 : -50,
      scale: prefersReduced ? 1 : 0.9
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReduced ? 0.1 : 0.3,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      y: prefersReduced ? 0 : -50,
      scale: prefersReduced ? 1 : 0.9,
      transition: {
        duration: prefersReduced ? 0.1 : 0.2,
        ease: 'easeIn'
      }
    }
  };
  
  return (
    <motion.div
      className={`relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm max-w-md w-full ${config.className}`}
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      {/* Icon */}
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconClassName}`} />
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-semibold text-sm mb-1">
            {toast.title}
          </div>
        )}
        <div className="text-sm opacity-90">
          {toast.message}
        </div>
      </div>
      
      {/* Close Button */}
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-xl"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: toast.duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
};

// Toast Container
const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-toast flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto-remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
    
    return id;
  }, [removeToast]);
  
  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);
  
  // Convenience methods
  const toast = {
    success: (message, options = {}) => addToast({ ...options, type: 'success', message }),
    error: (message, options = {}) => addToast({ ...options, type: 'error', message }),
    warning: (message, options = {}) => addToast({ ...options, type: 'warning', message }),
    info: (message, options = {}) => addToast({ ...options, type: 'info', message }),
    custom: (options) => addToast(options)
  };
  
  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    toast
  };
  
  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;