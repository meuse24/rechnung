import { Customer, CustomerSnapshot, Invoice, InvoiceLine, Service } from '@/models/types';

export const createInvoiceSnapshot = (
  invoice: Invoice,
  customers: Customer[],
  services: Service[]
): Invoice => {
  const customer = customers.find((c) => c.id === invoice.customerId);
  const customerSnapshot: CustomerSnapshot | undefined = customer
    ? {
        name: customer.name,
        addressLine1: customer.addressLine1,
        postalCode: customer.postalCode,
        city: customer.city,
        countryCode: customer.countryCode,
        email: customer.email,
      }
    : undefined;

  const linesWithSnapshots: InvoiceLine[] = invoice.lines.map((line) => {
    const service = services.find((s) => s.id === line.serviceId);
    return {
      ...line,
      description: service?.name,
      hourlyRate: service?.hourlyRate,
      taxRate: service?.taxRate,
    };
  });

  return {
    ...invoice,
    customerSnapshot,
    lines: linesWithSnapshots,
  };
};
