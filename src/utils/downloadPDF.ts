import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadPDF = async (element: HTMLElement | null, filename: string) => {
  if (!element) return;

  try {
    // 1. Create a deep clone of the element
    // This allows us to manipulate the layout for PDF generation without affecting the live UI
    const clone = element.cloneNode(true) as HTMLElement;

    // 2. Create a hidden container to hold the clone
    // This container forces the desktop A4 width (794px) regardless of the device screen size
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-10000px'; // Move off-screen
    container.style.left = '-10000px';
    container.style.width = '794px'; // Exact A4 width at 96 DPI
    container.style.height = 'auto'; // Let height grow
    container.style.zIndex = '-1000';
    container.style.overflow = 'visible'; // Ensure nothing is clipped
    
    // 3. Append clone to container, and container to body
    container.appendChild(clone);
    document.body.appendChild(container);

    // 4. Reset styles on the clone to ensure it looks like the desktop version
    // We remove any scaling transforms that might be active on the mobile view
    clone.style.transform = 'scale(1)'; 
    clone.style.transformOrigin = 'top left';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none'; // Optional: remove shadow for cleaner PDF

    // 5. Generate Canvas from the Cloned Element
    const canvas = await html2canvas(clone, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794, // Force capture width
      windowWidth: 1200 // Mock a desktop window width to prevent responsive text wrapping issues
    });

    // 6. Clean up: Remove the temporary container
    document.body.removeChild(container);

    // 7. Generate PDF
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = 210; // A4 Width in mm
    const pdfHeight = 297; // A4 Height in mm
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
    pdf.save(filename);

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Gagal membuat PDF. Silakan coba lagi.");
  }
};