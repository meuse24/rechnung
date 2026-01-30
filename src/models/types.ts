/**
 * Datenmodelle für die Rechnungs-Webapp
 */

export interface Customer {
  id: string;
  name: string;
  addressLine1: string;
  postalCode: string;
  city: string;
  countryCode: string;
  email?: string;
}

export interface Service {
  id: string;
  name: string;
  hourlyRate: number;
  taxRate: number;
}

export interface InvoiceLine {
  serviceId: string;
  hours: number;
  note?: string;
  // Snapshot fields (for immutability)
  description?: string; // Service name at time of invoice creation
  hourlyRate?: number; // Service hourly rate at time of invoice creation
  taxRate?: number; // Service tax rate at time of invoice creation
}

export interface CustomerSnapshot {
  name: string;
  addressLine1: string;
  postalCode: string;
  city: string;
  countryCode: string;
  email?: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string; // YYYY-MM-DD
  customerId: string;
  lines: InvoiceLine[];
  notes?: string;
  status?: InvoiceStatus; // Optional für Rückwärtskompatibilität
  customerSnapshot?: CustomerSnapshot; // Customer data at time of invoice creation
}

export interface CompanySettings {
  // Briefkopf / Header
  companyName: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  countryCode: string;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string; // Steuernummer
  vatId?: string; // USt-IdNr.

  // Bankverbindung
  bankName?: string;
  iban?: string;
  bic?: string;
  accountHolder?: string;

  // Zahlungsbedingungen
  paymentTerms?: string; // z.B. "Zahlbar innerhalb von 14 Tagen"
  defaultNotes?: string; // Standard-Text für Rechnungen
}
