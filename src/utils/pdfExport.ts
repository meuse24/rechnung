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

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const marginTop = 15; // mm
    const marginBottom = 12; // mm
    const contentHeight = pageHeight - marginTop - marginBottom;
    const pxPerMm = canvas.width / imgWidth;
    const pageHeightPx = Math.floor(contentHeight * pxPerMm);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const sliceCanvas = document.createElement('canvas');
    const sliceContext = sliceCanvas.getContext('2d');
    if (!sliceContext) {
      throw new Error('Fehler beim Erstellen der PDF-Datei');
    }

    let yOffset = 0;
    let pageIndex = 0;
    while (yOffset < canvas.height) {
      let sliceHeight = Math.min(pageHeightPx, canvas.height - yOffset);
      if (yOffset + sliceHeight < canvas.height) {
        const safeBreak = findSafeBreak(canvas, yOffset + sliceHeight, yOffset);
        if (safeBreak > yOffset + 24) {
          sliceHeight = safeBreak - yOffset;
        }
      }

      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceHeight;
      sliceContext.clearRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      sliceContext.drawImage(
        canvas,
        0,
        yOffset,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight
      );

      const imgData = sliceCanvas.toDataURL('image/png');
      if (pageIndex > 0) {
        pdf.addPage();
      }

      const sliceHeightMm = sliceHeight / pxPerMm;
      pdf.addImage(imgData, 'PNG', 0, marginTop, imgWidth, sliceHeightMm);

      yOffset += sliceHeight;
      pageIndex += 1;
    }

    // Add page numbers (bottom-right)
    const pageCount = pdf.getNumberOfPages();
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(4.5);
    pdf.setTextColor(0, 0, 0);
    for (let page = 1; page <= pageCount; page += 1) {
      pdf.setPage(page);
      const label = `Seite ${page} / ${pageCount}`;
      pdf.text(label, imgWidth - 10, pageHeight - 6, { align: 'right' });
    }

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Fehler beim Erstellen der PDF-Datei');
  }
}

function findSafeBreak(
  source: HTMLCanvasElement,
  targetY: number,
  minY: number
): number {
  const context = source.getContext('2d');
  if (!context) {
    return targetY;
  }

  const width = source.width;
  const searchRange = 60;
  const start = Math.max(minY + 24, targetY - searchRange);
  const end = Math.min(source.height - 1, targetY + searchRange);
  if (end <= start) {
    return targetY;
  }

  const bandHeight = end - start + 1;
  const data = context.getImageData(0, start, width, bandHeight).data;
  const stepX = Math.max(1, Math.floor(width / 500));

  let bestY = targetY;
  let bestRatio = -1;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let row = 0; row < bandHeight; row += 1) {
    let white = 0;
    let samples = 0;
    const rowOffset = row * width * 4;
    for (let x = 0; x < width; x += stepX) {
      const i = rowOffset + x * 4;
      const a = data[i + 3];
      if (a === 0) {
        white += 1;
        samples += 1;
        continue;
      }
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r > 245 && g > 245 && b > 245) {
        white += 1;
      }
      samples += 1;
    }

    const ratio = white / samples;
    const y = start + row;
    const distance = Math.abs(y - targetY);

    if (ratio > bestRatio || (ratio === bestRatio && distance < bestDistance)) {
      bestRatio = ratio;
      bestDistance = distance;
      bestY = y;
    }
  }

  return bestRatio >= 0.97 ? bestY : targetY;
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
