import React from 'react';
import { FileText } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Generator Invoice</h1>
        </div>
        <div className="text-sm text-gray-500 hidden sm:block">
          Buat invoice profesional dengan mudah
        </div>
      </div>
    </header>
  );
};

export default Header;