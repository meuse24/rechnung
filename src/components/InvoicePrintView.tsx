import { useEffect, useRef } from 'react';
import { Paper, Text, Table, Divider, Stack, Group } from '@mantine/core';
import { Invoice, Customer, Service, CompanySettings } from '@/models/types';
import { calculateInvoiceTotals } from '@/utils/calc';
import { formatCurrency } from '@/utils/money';
import { formatGermanDate } from '@/utils/date';

const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const PAGE_MARGIN_MM = 15;
const FOOTER_OFFSET_PX = 2;

const getPageContentHeightPx = (container: HTMLElement): number => {
  const contentWidthMm = PAGE_WIDTH_MM - PAGE_MARGIN_MM * 2;
  const contentHeightMm = PAGE_HEIGHT_MM - PAGE_MARGIN_MM * 2;
  const rect = container.getBoundingClientRect();
  const pxPerMm = rect.width > 0 ? rect.width / contentWidthMm : 96 / 25.4;
  return Math.floor(contentHeightMm * pxPerMm);
};

const clearPrintPageNumbers = (container: HTMLElement | null) => {
  if (!container) return;
  container.querySelectorAll('.print-page-number').forEach((node) => node.remove());
};

const addPrintPageNumbers = (container: HTMLElement | null) => {
  if (!container) return;
  clearPrintPageNumbers(container);

  const contentHeight = container.scrollHeight;
  const pageContentHeightPx = getPageContentHeightPx(container);
  if (!contentHeight || pageContentHeightPx <= 0) return;

  const pageCount = Math.max(1, Math.ceil(contentHeight / pageContentHeightPx));
  for (let page = 1; page <= pageCount; page += 1) {
    const marker = document.createElement('div');
    marker.className = 'print-page-number';
    marker.textContent = `Seite ${page} / ${pageCount}`;
    marker.style.top = `${page * pageContentHeightPx - FOOTER_OFFSET_PX}px`;
    container.appendChild(marker);
  }
};

interface InvoicePrintViewProps {
  invoice: Invoice;
  customer: Customer | undefined;
  services: Service[];
  companySettings: CompanySettings | undefined;
}

export function InvoicePrintView({
  invoice,
  customer: _customer,
  services,
  companySettings,
}: InvoicePrintViewProps) {
  const totals = calculateInvoiceTotals(invoice, services);
  const printRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleBeforePrint = () => addPrintPageNumbers(printRef.current);
    const handleAfterPrint = () => clearPrintPageNumbers(printRef.current);

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    const mediaQuery = window.matchMedia('print');
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        handleBeforePrint();
      } else {
        handleAfterPrint();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      if (mediaQuery.addEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Use customer snapshot (required, no fallback)
  const displayCustomer = invoice.customerSnapshot;

  if (!displayCustomer) {
    return null;
  }

  return (
    <Paper
      ref={printRef}
      className="print-only"
      p="lg"
      style={{ maxWidth: 800, margin: '0 auto', border: 'none', boxShadow: 'none' }}
    >
      <Stack gap="sm">
        {/* Firmenkopf / Absender */}
        {companySettings && companySettings.companyName && (
          <div>
            <Text size="xl" fw={700}>
              {companySettings.companyName}
            </Text>
            <Text size="sm">{companySettings.addressLine1}</Text>
            {companySettings.addressLine2 && (
              <Text size="sm">{companySettings.addressLine2}</Text>
            )}
            <Text size="sm">
              {companySettings.postalCode} {companySettings.city}
            </Text>
            {companySettings.phone && <Text size="sm">Tel: {companySettings.phone}</Text>}
            {companySettings.email && <Text size="sm">E-Mail: {companySettings.email}</Text>}
            {companySettings.website && <Text size="sm">{companySettings.website}</Text>}

            <Group gap="sm" mt="xs">
              {companySettings.taxId && (
                <Text size="xs" c="dimmed">
                  Steuernr.: {companySettings.taxId}
                </Text>
              )}
              {companySettings.vatId && (
                <Text size="xs" c="dimmed">
                  USt-IdNr.: {companySettings.vatId}
                </Text>
              )}
            </Group>
          </div>
        )}

        <Divider my="xs" />

        {/* Header */}
        <div>
          <Text size="xl" fw={700} mb="xs">
            RECHNUNG
          </Text>
          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed">
                Rechnungsnummer
              </Text>
              <Text fw={600}>{invoice.invoiceNumber}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Datum
              </Text>
              <Text fw={600}>{formatGermanDate(invoice.issueDate)}</Text>
            </div>
          </Group>
        </div>

        <Divider my="xs" />

        {/* Kundendetails */}
        <div>
          <Text size="sm" c="dimmed" mb="xs">
            Rechnungsempfänger
          </Text>
          <Text fw={600}>{displayCustomer.name}</Text>
          <Text size="sm">{displayCustomer.addressLine1}</Text>
          <Text size="sm">
            {displayCustomer.postalCode} {displayCustomer.city}
          </Text>
          <Text size="sm">{displayCustomer.countryCode}</Text>
          {displayCustomer.email && <Text size="sm">{displayCustomer.email}</Text>}
        </div>

        <Divider my="xs" />

        {/* Positionen */}
        <div>
          <Text fw={600} mb="xs">
            Leistungen
          </Text>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Beschreibung</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Stunden</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Stundensatz</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>MwSt.</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Betrag</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {invoice.lines.map((line, index) => {
                const lineCalc = totals.lines[index];
                if (!lineCalc) return null;

                // Use snapshot data (required, no fallback)
                const description = line.description || 'Unbekannt';
                const hourlyRate = line.hourlyRate ?? 0;
                const taxRate = line.taxRate ?? 0;

                return (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <Text fw={500}>{description}</Text>
                      {line.note && (
                        <Text size="xs" c="dimmed">
                          {line.note}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>{line.hours}</Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>
                      {formatCurrency(hourlyRate)}
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>{taxRate}%</Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>
                      {formatCurrency(lineCalc.netAmount)}
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </div>

        <Divider my="xs" />

        {/* Summen */}
        <div style={{ marginLeft: 'auto', width: 300 }}>
          <Stack gap="xs">
            <Group justify="space-between">
              <Text>Nettobetrag:</Text>
              <Text>{formatCurrency(totals.netTotal)}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Mehrwertsteuer:</Text>
              <Text>{formatCurrency(totals.taxTotal)}</Text>
            </Group>
            <Divider my="xs" />
            <Group justify="space-between">
              <Text fw={700} size="lg">
                Gesamtbetrag:
              </Text>
              <Text fw={700} size="lg">
                {formatCurrency(totals.grossTotal)}
              </Text>
            </Group>
          </Stack>
        </div>

        {/* Notizen */}
        {invoice.notes && (
          <>
            <Divider my="xs" />
            <div>
              <Text size="sm" c="dimmed" mb="xs">
                Hinweise
              </Text>
              <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                {invoice.notes}
              </Text>
            </div>
          </>
        )}

        {/* Zahlungsbedingungen */}
        {companySettings && companySettings.paymentTerms && (
          <>
            <Divider my="xs" />
            <div>
              <Text size="sm" c="dimmed" mb="xs">
                Zahlungsbedingungen
              </Text>
              <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                {companySettings.paymentTerms}
              </Text>
            </div>
          </>
        )}

        {/* Bankverbindung */}
        {companySettings && companySettings.iban && (
          <>
            <Divider />
            <div>
              <Text size="sm" c="dimmed" mb="xs">
                Bankverbindung
              </Text>
              {companySettings.bankName && (
                <Text size="sm">Bank: {companySettings.bankName}</Text>
              )}
              {companySettings.accountHolder && (
                <Text size="sm">Kontoinhaber: {companySettings.accountHolder}</Text>
              )}
              <Text size="sm">IBAN: {companySettings.iban}</Text>
              {companySettings.bic && <Text size="sm">BIC: {companySettings.bic}</Text>}
            </div>
          </>
        )}
      </Stack>
    </Paper>
  );
}
