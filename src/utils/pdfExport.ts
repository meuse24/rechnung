/**
 * PDF Export Utility using jsPDF and html2canvas
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates PDF from a DOM element
 * @param element - The DOM element to convert to PDF
 * @param filename - The name of the PDF file
 */
export async function generatePDF(element: HTMLElement, filename: string): Promise<void> {
  try {
    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add new pages if content exceeds one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Fehler beim Erstellen der PDF-Datei');
  }
}

/**
 * Generates PDF filename from invoice data
 * @param invoiceNumber - Invoice number
 * @param customerName - Customer name
 * @returns Formatted filename
 */
export function generatePDFFilename(invoiceNumber: string, customerName: string): string {
  // Clean filename from special characters
  const cleanInvoiceNumber = invoiceNumber.replace(/[^a-zA-Z0-9-]/g, '_');
  const cleanCustomerName = customerName.replace(/[^a-zA-Z0-9-]/g, '_');
  return `${cleanInvoiceNumber}-${cleanCustomerName}.pdf`;
}
