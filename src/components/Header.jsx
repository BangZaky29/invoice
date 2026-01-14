import { FileText } from 'lucide-react'
import logo from '../assets/NS_white_01.png'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-soft border-b border-border-gray shadow-sm">
      <div className="max-w-full px-4 md:px-6 py-4 flex items-center gap-3 md:gap-4">
        {/* Logo */}
        <div className="w-32 h-32 border-gray-300 rounded-xl shadow-[5px_5px_12px_rgba(0,0,0,0.11)]">
          <img src={logo} alt="Logo"/>
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
            Generator Invoice
          </h1>
          <p className="text-xs md:text-sm text-gray-600 truncate">
            Buat invoice profesional dengan mudah
          </p>
        </div>

        {/* Action Buttons (Desktop) */}
        
      </div>
    </header>
  )
}