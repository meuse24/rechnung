import { useState, useEffect, useMemo } from 'react';
import { Container, Stack, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Invoice,
  InvoiceLine,
  InvoiceStatus,
} from '@/models/types';
import { loadInvoices, saveInvoices } from '@/storage/invoices';
import { calculateInvoiceTotals } from '@/utils/calc';
import { formatCurrency } from '@/utils/money';
import { InvoicePrintView } from '@/components/InvoicePrintView';
import { generatePDF, generatePDFFilename } from '@/utils/pdfExport';
import { createInvoiceSnapshot } from '@/utils/invoice';
import { InvoiceHeaderForm } from '@/components/invoice/InvoiceHeaderForm';
import { InvoiceLinesEditor } from '@/components/invoice/InvoiceLinesEditor';
import { InvoiceTotalsPanel } from '@/components/invoice/InvoiceTotalsPanel';
import { InvoiceNotesPanel } from '@/components/invoice/InvoiceNotesPanel';
import { InvoicePageHeader } from '@/components/invoice/InvoicePageHeader';
import { useInvoiceDependencies } from '@/hooks/useInvoiceDependencies';

export function InvoicePage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { customers, services, companySettings } = useInvoiceDependencies();
  const [invoice, setInvoice] = useState<Invoice>({
    id: crypto.randomUUID(),
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    customerId: '',
    lines: [],
    notes: '',
    status: 'draft',
  });

  // Laden von Stammdaten und Rechnung beim Mount
  useEffect(() => {
    // Rechnung laden wenn ID vorhanden und nicht "new"
    if (invoiceId && invoiceId !== 'new') {
      const allInvoices = loadInvoices();
      const existing = allInvoices.find((inv) => inv.id === invoiceId);
      if (existing) {
        setInvoice(existing);
      } else {
        alert('Rechnung nicht gefunden.');
        navigate('/invoices');
      }
    }

    // Trigger print if requested from InvoicesList
    if (location.state?.print) {
      setTimeout(() => window.print(), 100);
    }
  }, [invoiceId, navigate, location]);

  const addLine = () => {
    setInvoice({
      ...invoice,
      lines: [
        ...invoice.lines,
        {
          serviceId: '',
          hours: 0,
          note: '',
        },
      ],
    });
  };

  const removeLine = (index: number) => {
    const newLines = invoice.lines.filter((_, i) => i !== index);
    setInvoice({ ...invoice, lines: newLines });
  };

  const updateLine = (index: number, field: keyof InvoiceLine, value: string | number) => {
    const newLines = [...invoice.lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setInvoice({ ...invoice, lines: newLines });
  };

  const handleSave = () => {
    if (!invoice.invoiceNumber || !invoice.customerId) {
      alert('Bitte Rechnungsnummer und Kunde auswählen.');
      return;
    }

    if (invoice.lines.length === 0) {
      alert('Bitte mindestens eine Position hinzufügen.');
      return;
    }

    // Create immutable snapshot
    const invoiceWithSnapshot = createInvoiceSnapshot(invoice, customers, services);

    const allInvoices = loadInvoices();
    const existingIndex = allInvoices.findIndex((inv) => inv.id === invoice.id);

    if (existingIndex >= 0) {
      // Update existing
      allInvoices[existingIndex] = invoiceWithSnapshot;
    } else {
      // Add new
      allInvoices.push(invoiceWithSnapshot);
    }

    saveInvoices(allInvoices);
    alert('Rechnung wurde gespeichert.');
    navigate('/invoices');
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePDFExport = async () => {
    const printElement = document.querySelector('.print-only') as HTMLElement;
    if (!printElement) {
      alert('Fehler: Druckansicht nicht gefunden.');
      return;
    }

    const customerName = previewInvoice.customerSnapshot?.name || selectedCustomer?.name || 'Unbekannt';
    const filename = generatePDFFilename(invoice.invoiceNumber, customerName);

    try {
      // Temporarily make element visible for html2canvas
      const originalDisplay = printElement.style.display;
      const originalPosition = printElement.style.position;
      const originalLeft = printElement.style.left;

      printElement.style.display = 'block';
      printElement.style.position = 'fixed';
      printElement.style.left = '-9999px';
      printElement.style.top = '0';

      // Generate PDF
      await generatePDF(printElement, filename);

      // Restore original styles
      printElement.style.display = originalDisplay;
      printElement.style.position = originalPosition;
      printElement.style.left = originalLeft;
      printElement.style.top = '';
    } catch (error) {
      alert('Fehler beim Erstellen der PDF-Datei.');
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate('/invoices');
  };

  // Create live preview invoice with snapshots for calculations and display
  const previewInvoice = useMemo(() => {
    return createInvoiceSnapshot(invoice, customers, services);
  }, [invoice, customers, services]);

  // Berechnungen
  const totals = calculateInvoiceTotals(previewInvoice, services);
  const selectedCustomer = customers.find((c) => c.id === invoice.customerId);

  const customerOptions = customers.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const serviceOptions = services.map((s) => ({
    value: s.id,
    label: `${s.name} (${formatCurrency(s.hourlyRate)}/h)`,
  }));

  const statusOptions: { value: InvoiceStatus; label: string }[] = [
    { value: 'draft', label: 'Entwurf' },
    { value: 'sent', label: 'Versendet' },
    { value: 'paid', label: 'Bezahlt' },
    { value: 'cancelled', label: 'Storniert' },
  ];

  const hasData = customers.length > 0 && services.length > 0;
  const isNew = invoiceId === 'new' || !invoiceId;

  return (
    <Container size="lg" py="xl" className="invoice-page">
      <Stack gap="lg">
        <InvoicePageHeader
          title={isNew ? 'Neue Rechnung' : 'Rechnung bearbeiten'}
          onBack={handleBack}
          onSave={handleSave}
          onPdf={handlePDFExport}
          onPrint={handlePrint}
          pdfDisabled={!invoice.invoiceNumber || !invoice.customerId}
        />

        {!hasData && (
          <Alert icon={<IconInfoCircle size={16} />} title="Hinweis" color="blue">
            Bitte fügen Sie zuerst Kunden und Leistungen in den entsprechenden Bereichen hinzu.
          </Alert>
        )}

        {/* Kopfdaten */}
        <InvoiceHeaderForm
          invoice={invoice}
          customerOptions={customerOptions}
          statusOptions={statusOptions}
          selectedCustomer={selectedCustomer}
          onChange={setInvoice}
        />

        {/* Positionen */}
        <InvoiceLinesEditor
          lines={invoice.lines}
          serviceOptions={serviceOptions}
          services={services}
          lineTotals={totals.lines}
          onAddLine={addLine}
          onRemoveLine={removeLine}
          onUpdateLine={updateLine}
        />

        {/* Summen */}
        {invoice.lines.length > 0 && (
          <InvoiceTotalsPanel
            netTotal={totals.netTotal}
            taxTotal={totals.taxTotal}
            grossTotal={totals.grossTotal}
          />
        )}

        {/* Notizen */}
        <InvoiceNotesPanel
          notes={invoice.notes || ''}
          onChange={(notes) => setInvoice({ ...invoice, notes })}
        />
      </Stack>

      {/* Print View - nur beim Drucken sichtbar */}
      <InvoicePrintView
        invoice={previewInvoice}
        customer={selectedCustomer}
        services={services}
        companySettings={companySettings}
      />
    </Container>
  );
}
