import { Invoice } from '@/models/types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/storage/localStorage';

export const loadInvoices = (): Invoice[] =>
  loadFromStorage<Invoice[]>(STORAGE_KEYS.INVOICES, []);

export const saveInvoices = (invoices: Invoice[]): void => {
  saveToStorage(STORAGE_KEYS.INVOICES, invoices);
};
