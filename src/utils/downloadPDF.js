/**
 * Download Invoice as PDF
 * Converts invoice HTML to canvas then to PDF
 */

export const downloadPDF = async (invoiceData, fileName = 'invoice.pdf') => {
  try {
    // Dynamic import to keep bundle size small
    const html2pdf = (await import('html2pdf.js')).default

    // Get invoice element
    const invoiceElement = document.querySelector('.invoice-container')
    if (!invoiceElement) {
      throw new Error('Invoice container not found')
    }

    // Clone element to avoid affecting original
    const clonedElement = invoiceElement.cloneNode(true)

    // PDF options
    const options = {
      margin: 5,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }

    // Generate and download PDF
    await html2pdf().set(options).from(clonedElement).save()

    return { success: true, message: 'PDF downloaded successfully' }
  } catch (error) {
    console.error('PDF generation error:', error)
    return { 
      success: false, 
      message: error.message || 'Failed to generate PDF' 
    }
  }
}

/**
 * Generate PDF without download (returns blob)
 * Useful for preview or email integration
 */
export const generatePDFBlob = async (invoiceData) => {
  try {
    const html2pdf = (await import('html2pdf.js')).default

    const invoiceElement = document.querySelector('.invoice-container')
    if (!invoiceElement) {
      throw new Error('Invoice container not found')
    }

    const clonedElement = invoiceElement.cloneNode(true)

    const options = {
      margin: 5,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }

    const pdf = await html2pdf().set(options).from(clonedElement).outputPdf()
    return new Blob([pdf], { type: 'application/pdf' })
  } catch (error) {
    console.error('PDF blob generation error:', error)
    throw error
  }
}

/**
 * Generate filename with timestamp
 */
export const generateFileName = (invoiceNumber = 'invoice') => {
  const timestamp = new Date().toISOString().split('T')[0]
  return `${invoiceNumber}-${timestamp}.pdf`
}