import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { downloadPDF } from '../utils/downloadPDF';

interface DownloadPDFButtonProps {
  targetRef: React.RefObject<HTMLDivElement>;
  fileName: string;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({ targetRef, fileName }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!targetRef.current) return;
    setLoading(true);
    // Slight delay to allow UI to render pending states if any
    setTimeout(async () => {
        await downloadPDF(targetRef.current, `${fileName}.pdf`);
        setLoading(false);
    }, 100);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70"
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
      Download PDF
    </button>
  );
};

export default DownloadPDFButton;