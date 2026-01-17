import React from 'react';
import { Edit2, Eye } from 'lucide-react';

interface MobileActionButtonProps {
  currentView: 'form' | 'preview';
  onToggle: () => void;
}

const MobileActionButton: React.FC<MobileActionButtonProps> = ({ currentView, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 lg:hidden bg-blue-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-300 flex items-center justify-center"
      aria-label={currentView === 'form' ? "Lihat Preview" : "Edit Invoice"}
    >
      {currentView === 'form' ? <Eye size={24} /> : <Edit2 size={24} />}
    </button>
  );
};

export default MobileActionButton;