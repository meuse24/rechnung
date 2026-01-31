import { useEffect, useState } from 'react';
import { CompanySettings, Customer, Service } from '@/models/types';
import { loadFromStorage, STORAGE_KEYS } from '@/storage/localStorage';

export const useInvoiceDependencies = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings | undefined>(
    undefined
  );

  useEffect(() => {
    const loadedCustomers = loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    const loadedServices = loadFromStorage<Service[]>(STORAGE_KEYS.SERVICES, []);
    const loadedSettings = loadFromStorage<CompanySettings | undefined>(
      STORAGE_KEYS.COMPANY_SETTINGS,
      undefined
    );

    setCustomers(loadedCustomers);
    setServices(loadedServices);
    setCompanySettings(loadedSettings);
  }, []);

  return { customers, services, companySettings };
};
