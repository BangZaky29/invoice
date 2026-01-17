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
    const pdfHeight = 297; // A4 Height in mm

    // 2. Loop through each page and capture it
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;

      // Create a temporary clone for capture to ensure consistent rendering
      // We append it to body to ensure it renders, but hide it
      const canvas = await html2canvas(page, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794, // Force capture width (A4 @ 96DPI)
        windowWidth: 1200 // Mock desktop width
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