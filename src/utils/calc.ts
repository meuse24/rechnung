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
  _services: Service[]
): InvoiceTotals {
  const lines: LineCalculation[] = invoice.lines.map(line => {
    // Use snapshot data (required, no fallback)
    const hourlyRate = line.hourlyRate ?? 0;
    const taxRate = line.taxRate ?? 0;

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
