import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Upload, PenTool } from 'lucide-react';

interface TTDUploadProps {
  onSignatureChange: (dataUrl: string | null) => void;
  signatureImage: string | null;
}

const TTDUpload: React.FC<TTDUploadProps> = ({ onSignatureChange, signatureImage }) => {
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas context
  useEffect(() => {
    if (mode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3; // Sedikit lebih tebal untuk resolusi tinggi
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [mode]);

  // Helper to get correct coordinates with CSS scaling mapping
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Calculate scale factors (Resolusi Internal vs Ukuran Tampilan CSS)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      onSignatureChange(canvasRef.current.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onSignatureChange(null);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSignatureChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // RESET VALUE agar bisa upload file yang sama
    e.target.value = '';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex gap-4 mb-4 border-b border-gray-100 pb-2">
        <button
          onClick={() => setMode('draw')}
          className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${
            mode === 'draw' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <PenTool size={16} /> Gambar
        </button>
        <button
          onClick={() => setMode('upload')}
          className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${
            mode === 'upload' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Upload size={16} /> Upload
        </button>
      </div>

      {mode === 'draw' ? (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={600} // Resolusi internal tinggi
            height={300} // Resolusi internal tinggi
            style={{ 
              touchAction: 'none',
              width: '100%',
              height: 'auto',
              aspectRatio: '2/1'
            }} 
            className="border border-dashed border-gray-300 rounded bg-white cursor-crosshair block"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <button
            onClick={clearCanvas}
            className="absolute top-2 right-2 p-1 bg-white border border-gray-200 rounded shadow-sm hover:text-red-500"
            title="Hapus TTD"
          >
            <Eraser size={16} />
          </button>
          <p className="text-xs text-gray-400 mt-1 text-center">Tanda tangan di area kotak di atas</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-[150px] bg-gray-50">
           <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="hidden" 
              id="upload-sign"
           />
           <label htmlFor="upload-sign" className="cursor-pointer flex flex-col items-center">
              <Upload className="text-gray-400 mb-2" size={24} />
              <span className="text-sm text-gray-600">Klik untuk upload gambar TTD</span>
              <span className="text-xs text-gray-400 mt-1">(Format PNG/JPG, background transparan disarankan)</span>
           </label>
        </div>
      )}
    </div>
  );
};

export default TTDUpload;