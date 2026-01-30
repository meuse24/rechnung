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

    const netAmount = roundToTwo(line.hours * service.hourlyRate);
    const taxAmount = roundToTwo(netAmount * (service.taxRate / 100));
    const grossAmount = roundToTwo(netAmount + taxAmount);

    return {
      serviceId: line.serviceId,
      hours: line.hours,
      hourlyRate: service.hourlyRate,
      taxRate: service.taxRate,
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
