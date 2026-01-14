import { ChevronDown } from 'lucide-react'

export default function AccordionSection({ title, isOpen, onToggle, children }) {
  return (
    <div className="bg-soft-blue rounded-lg overflow-hidden shadow-sm border border-pastel-blue/30">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-4 bg-gradient-soft hover:bg-pastel-blue/20 transition-colors"
      >
        <h3 className="font-semibold text-gray-900 text-sm md:text-base">
          {title}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-accent-blue transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="bg-white px-4 py-4 space-y-4 border-t border-pastel-blue/20">
          {children}
        </div>
      )}
    </div>
  )
}