import { Edit3, Eye } from 'lucide-react'

export default function FloatingActionButton({ activeView, onViewChange }) {
  return (
    // Bungkus tombol di div fixed + z-index supaya selalu terlihat
    <div className="fixed bottom-4 right-4 flex flex-col gap-4 z-50 md:hidden">
      
      {/* Form Button */}
      <button
        onClick={() => onViewChange('form')}
        className={`fab-button ${activeView === 'form' ? 'active' : ''}`}
        title="Edit Form"
      >
        <Edit3 className="w-6 h-6" strokeWidth={2} />
      </button>

      {/* Preview Button */}
      <button
        onClick={() => onViewChange('preview')}
        className={`fab-button ${activeView === 'preview' ? 'active' : ''}`}
        title="Lihat Preview"
      >
        <Eye className="w-6 h-6" strokeWidth={2} />
      </button>
    </div>
  )
}
    