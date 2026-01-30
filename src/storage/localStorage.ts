/**
 * LocalStorage Helper für Persistierung
 */

const STORAGE_KEYS = {
  CUSTOMERS: 'invoice_customers',
  SERVICES: 'invoice_services',
  CURRENT_INVOICE: 'invoice_current',
  INVOICES: 'invoice_invoices', // Array aller Rechnungen
  COMPANY_SETTINGS: 'invoice_company_settings',
} as const;

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value, null, 2));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export { STORAGE_KEYS };
