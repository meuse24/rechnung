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

    // Warn if service was deleted but still referenced
    if (!service && line.serviceId) {
      console.warn(
        `Service with ID ${line.serviceId} not found - using fallback values`
      );
    }

    return {
      ...line,
      description: service?.name ?? line.description ?? 'Gelöschte Leistung',
      hourlyRate: service?.hourlyRate ?? line.hourlyRate ?? 0,
      taxRate: service?.taxRate ?? line.taxRate ?? 0,
    };
  });

  return {
    ...invoice,
    customerSnapshot,
    lines: linesWithSnapshots,
  };
};
