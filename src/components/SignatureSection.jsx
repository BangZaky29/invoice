import { useRef, useState, useEffect } from 'react'

export default function SignatureSection({
  signature,
  stamp,
  signatureName,
  signaturePosition,
  onSignatureChange,
  onStampChange,
  onNameChange,
  onPositionChange,
}) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Hitung posisi pointer di canvas
  const getPointerPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    let clientX, clientY

    if (e.touches) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  // Start drawing
  const startDrawing = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { x, y } = getPointerPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  // Draw
  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getPointerPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  // Stop drawing
  const stopDrawing = () => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    ctx.closePath()
    setIsDrawing(false)
    onSignatureChange(canvasRef.current.toDataURL())
  }

  // Clear signature
  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    onSignatureChange(null)
  }

  // Upload stamp
  const handleStampUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      onStampChange(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  // Initialize canvas
  const initializeCanvas = (canvas) => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#4F63DB'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }

  // Setup touch listeners untuk mobile supaya scroll tidak ikut bergerak
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const touchMoveHandler = (e) => {
      if (isDrawing) {
        draw(e)
        e.preventDefault() // wajib supaya scroll tidak ikut
      }
    }

    const touchStartHandler = (e) => {
      startDrawing(e)
      e.preventDefault()
    }

    const touchEndHandler = (e) => {
      stopDrawing()
      e.preventDefault()
    }

    canvas.addEventListener('touchstart', touchStartHandler, { passive: false })
    canvas.addEventListener('touchmove', touchMoveHandler, { passive: false })
    canvas.addEventListener('touchend', touchEndHandler, { passive: false })

    return () => {
      canvas.removeEventListener('touchstart', touchStartHandler)
      canvas.removeEventListener('touchmove', touchMoveHandler)
      canvas.removeEventListener('touchend', touchEndHandler)
    }
  }, [isDrawing])

  return (
    <div className="space-y-6">
      {/* Signature Pad */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Tanda Tangan</h4>
        <canvas
          ref={(el) => {
            canvasRef.current = el
            initializeCanvas(el)
          }}
          width={400}
          height={150}
          style={{
            width: '100%',
            height: '150px',
            touchAction: 'none',
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border-2 border-dashed border-pastel-blue rounded-lg bg-white cursor-crosshair"
        />
        <button
          onClick={clearSignature}
          className="mt-2 w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
        >
          Hapus Tanda Tangan
        </button>
        {signature && (
          <div className="mt-3 p-2 bg-light-gray rounded-lg">
            <img src={signature} alt="Signature" className="w-full h-auto" />
          </div>
        )}
      </div>

      {/* Signature Position */}
      <div>
        <label className="text-sm font-semibold text-gray-900 mb-2 block">
          Jabatan Penandatangan
        </label>
        <input
          type="text"
          value={signaturePosition || ''}
          onChange={(e) => onPositionChange(e.target.value)}
          placeholder="Contoh: Manager / Direktur"
          className="w-full px-4 py-2 border border-border-gray rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
        />
      </div>

      {/* Signature Name */}
      <div>
        <label className="text-sm font-semibold text-gray-900 mb-2 block">
          Nama Penandatangan
        </label>
        <input
          type="text"
          value={signatureName || ''}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Nama Lengkap"
          className="w-full px-4 py-2 border border-border-gray rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
        />
      </div>

      {/* Stamp Upload */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Stempel Perusahaan</h4>
        <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-pastel-blue rounded-lg bg-white cursor-pointer hover:bg-soft-blue transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleStampUpload}
            className="hidden"
          />
          <span className="text-center">
            <span className="text-accent-blue font-medium">Upload Stempel</span>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG (Max 2MB)</p>
          </span>
        </label>
        {stamp && (
          <div className="mt-3 p-3 bg-light-gray rounded-lg">
            <img src={stamp} alt="Stamp" className="h-20 w-auto mx-auto" />
            <button
              onClick={() => onStampChange(null)}
              className="mt-2 w-full py-2 px-4 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors"
            >
              Hapus Stempel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
