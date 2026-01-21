import React, { useEffect } from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const bgColor = type === 'success' ? 'bg-gray-800' : 'bg-red-600';
  const icon = type === 'success' ? <CheckCircle className="text-green-400" size={20} /> : <AlertCircle className="text-white" size={20} />;

  return (
    <div 
      className={`fixed top-4 right-4 z-[110] transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 min-w-[300px]`}>
        {icon}
        <span className="text-sm font-medium flex-grow">{message}</span>
        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;