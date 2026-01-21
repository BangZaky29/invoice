import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadPDF = async (containerElement: HTMLElement | null, filename: string) => {
  if (!containerElement) return;

  try {
    // 1. Find all invoice pages inside the container
    const pages = containerElement.querySelectorAll('.invoice-page');
    if (pages.length === 0) {
      throw new Error("Halaman invoice tidak ditemukan.");
    }

    // Enable PDF compression (4th argument = true)
    const pdf = new jsPDF('p', 'mm', 'a4', true);
    const pdfWidth = 210; // A4 Width in mm
    
    // 2. Loop through each page and capture it
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;

      // Capture options
      const canvas = await html2canvas(page, {
        scale: 2, // Reduced from 3 to 2 to significantly lower file size while maintaining readability
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794, // Force capture width (A4 @ 96DPI)
        windowWidth: 1600, // Mock desktop width to prevent mobile layout shifts
        onclone: (clonedDoc) => {
            // CRITICAL: Reset the transformation on the wrapper in the cloned document
            const wrapper = clonedDoc.querySelector('.invoice-scale-wrapper') as HTMLElement;
            if (wrapper) {
                wrapper.style.transform = 'none';
                wrapper.style.margin = '0';
                wrapper.style.padding = '0';
            }

            // Remove shadows from pages in the PDF version for a clean "print" look
            const clonedPages = clonedDoc.querySelectorAll('.invoice-page');
            clonedPages.forEach((p) => {
                (p as HTMLElement).style.boxShadow = 'none';
                (p as HTMLElement).style.margin = '0 auto'; 
            });
        }
      });

      // Convert to JPEG with 0.75 quality (Good balance between size and sharpness)
      // PNG is lossless but produces much larger files for full-page screenshots.
      const imgData = canvas.toDataURL('image/jpeg', 0.75);
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add page to PDF (except for the first iteration where page 1 is already created)
      if (i > 0) {
        pdf.addPage();
      }

      // Add image with FAST compression
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight, undefined, 'FAST');
    }

    // 3. Save the PDF
    pdf.save(filename);

  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error; // Re-throw to be handled by the UI
  }
};