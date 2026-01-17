import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div 
      className={`fixed top-4 right-4 z-[100] transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-gray-800 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 min-w-[300px]">
        <CheckCircle className="text-green-400" size={20} />
        <span className="text-sm font-medium flex-grow">{message}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;