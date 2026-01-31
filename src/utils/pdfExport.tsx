/**
 * PDF Export Utility using @react-pdf/renderer
 */

import { pdf } from '@react-pdf/renderer';
import { Invoice, Customer, Service, CompanySettings } from '@/models/types';
import { InvoicePdfDocument } from '@/components/InvoicePdfDocument';

/**
 * Generates PDF from invoice data
 * @param invoice - The invoice data
 * @param customer - Customer data (optional, uses snapshot if available)
 * @param services - Services data
 * @param companySettings - Company settings
 * @param filename - The name of the PDF file
 */
export async function generatePDF(
  invoice: Invoice,
  customer: Customer | undefined,
  services: Service[],
  companySettings: CompanySettings | undefined,
  filename: string
): Promise<void> {
  try {
    // Create PDF document using JSX
    const doc = (
      <InvoicePdfDocument
        invoice={invoice}
        customer={customer}
        services={services}
        companySettings={companySettings}
      />
    );

    const blob = await pdf(doc).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
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
