import { useEffect, useState, useCallback } from 'react';
import { CompanySettings, Customer, Service } from '@/models/types';
import { loadFromStorage, STORAGE_KEYS } from '@/storage/localStorage';

export const useInvoiceDependencies = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDependencies = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      const loadedCustomers = loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
      const loadedServices = loadFromStorage<Service[]>(STORAGE_KEYS.SERVICES, []);
      const loadedSettings = loadFromStorage<CompanySettings | undefined>(
        STORAGE_KEYS.COMPANY_SETTINGS,
        undefined
      );

      setCustomers(loadedCustomers);
      setServices(loadedServices);
      setCompanySettings(loadedSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Stammdaten');
      console.error('Error loading invoice dependencies:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDependencies();

    // Listen to storage changes from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === STORAGE_KEYS.CUSTOMERS ||
        event.key === STORAGE_KEYS.SERVICES ||
        event.key === STORAGE_KEYS.COMPANY_SETTINGS
      ) {
        loadDependencies();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadDependencies]);

  return { customers, services, companySettings, isLoading, error, refresh: loadDependencies };
};
