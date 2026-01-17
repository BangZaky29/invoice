import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { downloadPDF } from '../utils/downloadPDF';

interface DownloadPDFButtonProps {
  targetRef: React.RefObject<HTMLDivElement>;
  fileName: string;
  onSuccess?: () => void;
  variant?: 'default' | 'fab'; // Added variant prop
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({ 
  targetRef, 
  fileName, 
  onSuccess,
  variant = 'default' 
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!targetRef.current) return;
    setLoading(true);
    // Slight delay to allow UI to render pending states if any
    setTimeout(async () => {
        await downloadPDF(targetRef.current, `${fileName}.pdf`);
        setLoading(false);
        if (onSuccess) onSuccess();
    }, 100);
  };

  if (variant === 'fab') {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 focus:ring-4 focus:ring-blue-300"
        aria-label="Download PDF"
        title="Download PDF"
      >
        {loading ? <Loader2 className="animate-spin" size={24} /> : <Download size={24} />}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70 text-sm sm:text-base whitespace-nowrap"
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
      <span className="hidden sm:inline">Download PDF</span>
      <span className="sm:hidden">PDF</span>
    </button>
  );
};

export default DownloadPDFButton;