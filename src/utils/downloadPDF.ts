import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadPDF = async (containerElement: HTMLElement | null, filename: string) => {
  if (!containerElement) return;

  try {
    // 1. Find all invoice pages inside the container
    const pages = containerElement.querySelectorAll('.invoice-page');
    if (pages.length === 0) {
      console.error("No invoice pages found");
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210; // A4 Width in mm
    
    // 2. Loop through each page and capture it
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;

      // Capture options
      const canvas = await html2canvas(page, {
        scale: 3, // High resolution (3x standard 96dpi) for crisp text
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794, // Force capture width (A4 @ 96DPI)
        windowWidth: 1600, // Mock desktop width to prevent mobile layout shifts
        onclone: (clonedDoc) => {
            // CRITICAL: Reset the transformation on the wrapper in the cloned document
            // This ensures that even if the user is viewing a zoomed-out version on mobile,
            // the PDF is generated from a full-size (scale 1) version.
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

      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add page to PDF (except for the first iteration where page 1 is already created)
      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
    }

    // 3. Save the PDF
    pdf.save(filename);

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Gagal membuat PDF. Silakan coba lagi.");
  }
};