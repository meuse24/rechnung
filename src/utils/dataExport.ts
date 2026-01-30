/**
 * Export/Import Utilities für komplette Datensicherung
 */

import { Customer, Service, Invoice, CompanySettings } from '@/models/types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/storage/localStorage';

export interface ExportData {
  version: string;
  exportDate: string;
  customers: Customer[];
  services: Service[];
  companySettings: CompanySettings | null;
  invoices: Invoice[]; // Changed from currentInvoice to invoices array
  currentInvoice?: Invoice | null; // Kept for backwards compatibility
}

/**
 * Exportiert alle Daten in ein Objekt
 */
export function exportAllData(): ExportData {
  const customers = loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
  const services = loadFromStorage<Service[]>(STORAGE_KEYS.SERVICES, []);
  const companySettings = loadFromStorage<CompanySettings | null>(
    STORAGE_KEYS.COMPANY_SETTINGS,
    null
  );
  const invoices = loadFromStorage<Invoice[]>(STORAGE_KEYS.INVOICES, []);

  return {
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    customers,
    services,
    companySettings,
    invoices,
  };
}

/**
 * Downloadet Daten als JSON-Datei
 */
export function downloadDataAsJson(data: ExportData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `invoice-backup-${timestamp}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Validiert Import-Daten
 */
export function validateImportData(data: unknown): data is ExportData {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  // Prüfe erforderliche Felder
  if (!obj.version || typeof obj.version !== 'string') return false;
  if (!obj.exportDate || typeof obj.exportDate !== 'string') return false;
  if (!Array.isArray(obj.customers)) return false;
  if (!Array.isArray(obj.services)) return false;

  return true;
}

/**
 * Importiert Daten aus exportiertem Objekt
 */
export function importAllData(data: ExportData): void {
  // Speichere alle Daten in LocalStorage
  saveToStorage(STORAGE_KEYS.CUSTOMERS, data.customers);
  saveToStorage(STORAGE_KEYS.SERVICES, data.services);

  if (data.companySettings) {
    saveToStorage(STORAGE_KEYS.COMPANY_SETTINGS, data.companySettings);
  }

  // Import invoices array (new format)
  if (data.invoices && Array.isArray(data.invoices)) {
    saveToStorage(STORAGE_KEYS.INVOICES, data.invoices);
  }

  // Backwards compatibility: import old currentInvoice as single invoice
  if (data.currentInvoice && (!data.invoices || data.invoices.length === 0)) {
    saveToStorage(STORAGE_KEYS.INVOICES, [data.currentInvoice]);
  }
}

/**
 * Liest JSON-Datei und importiert Daten
 */
export function importDataFromFile(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        if (!validateImportData(data)) {
          reject(new Error('Ungültiges Datenformat'));
          return;
        }

        resolve(data as ExportData);
      } catch (error) {
        reject(new Error('Fehler beim Lesen der Datei: ' + error));
      }
    };

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei'));
    };

    reader.readAsText(file);
  });
}
