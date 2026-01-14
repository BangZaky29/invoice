import { Edit3, Eye } from 'lucide-react'

export default function FloatingActionButton({ activeView, onViewChange }) {
  return (
    <>
      {/* Form Button */}
      <button
        onClick={() => onViewChange('form')}
        className={`fab-button ${
          activeView === 'form' ? 'active' : ''
        } bottom-20 right-4 md:hidden`}
        title="Edit Form"
      >
        <Edit3 className="w-6 h-6" strokeWidth={2} />
      </button>

      {/* Preview Button */}
      <button
        onClick={() => onViewChange('preview')}
        className={`fab-button ${
          activeView === 'preview' ? 'active' : ''
        } bottom-4 right-4 md:hidden`}
        title="Lihat Preview"
      >
        <Eye className="w-6 h-6" strokeWidth={2} />
      </button>
    </>
  )
}