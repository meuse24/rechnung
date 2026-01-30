/**
 * Rechnungs-Berechnungen
 */

import { Invoice, Service } from '@/models/types';
import { roundToTwo } from './money';

export interface LineCalculation {
  serviceId: string;
  hours: number;
  hourlyRate: number;
  taxRate: number;
  netAmount: number;
  taxAmount: number;
  grossAmount: number;
}

export interface InvoiceTotals {
  lines: LineCalculation[];
  netTotal: number;
  taxTotal: number;
  grossTotal: number;
}

export function calculateInvoiceTotals(
  invoice: Invoice,
  services: Service[]
): InvoiceTotals {
  const serviceMap = new Map(services.map(s => [s.id, s]));

  const lines: LineCalculation[] = invoice.lines.map(line => {
    // Use snapshot data if available (for immutable invoices)
    // Otherwise fall back to current service data (backwards compatibility)
    let hourlyRate = line.hourlyRate;
    let taxRate = line.taxRate;

    if (hourlyRate === undefined || taxRate === undefined) {
      const service = serviceMap.get(line.serviceId);
      if (!service) {
        return {
          serviceId: line.serviceId,
          hours: line.hours,
          hourlyRate: 0,
          taxRate: 0,
          netAmount: 0,
          taxAmount: 0,
          grossAmount: 0,
        };
      }
      hourlyRate = service.hourlyRate;
      taxRate = service.taxRate;
    }

    const netAmount = roundToTwo(line.hours * hourlyRate);
    const taxAmount = roundToTwo(netAmount * (taxRate / 100));
    const grossAmount = roundToTwo(netAmount + taxAmount);

    return {
      serviceId: line.serviceId,
      hours: line.hours,
      hourlyRate,
      taxRate,
      netAmount,
      taxAmount,
      grossAmount,
    };
  });

  const netTotal = roundToTwo(lines.reduce((sum, l) => sum + l.netAmount, 0));
  const taxTotal = roundToTwo(lines.reduce((sum, l) => sum + l.taxAmount, 0));
  const grossTotal = roundToTwo(netTotal + taxTotal);

  return {
    lines,
    netTotal,
    taxTotal,
    grossTotal,
  };
}
