import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Container, Stack, Alert } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconInfoCircle, IconCheck, IconAlertCircle } from '@tabler/icons-react';
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
  const { customers, services, companySettings, isLoading, error } = useInvoiceDependencies();
  const [invoice, setInvoice] = useState<Invoice>({
    id: crypto.randomUUID(),
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    customerId: '',
    lines: [],
    notes: '',
    status: 'draft',
  });
  const pdfExportTriggered = useRef(false);

  // Laden von Rechnung beim Mount
  useEffect(() => {
    if (invoiceId && invoiceId !== 'new') {
      const allInvoices = loadInvoices();
      const existing = allInvoices.find((inv) => inv.id === invoiceId);
      if (existing) {
        setInvoice(existing);
      } else {
        notifications.show({
          title: 'Fehler',
          message: 'Rechnung nicht gefunden.',
          color: 'red',
          icon: <IconAlertCircle size={16} />,
        });
        navigate('/invoices');
      }
    }
  }, [invoiceId, navigate]);

  // Setze Standard-Notizen für neue Rechnungen
  useEffect(() => {
    if (invoiceId === 'new' && companySettings?.defaultNotes && !invoice.notes) {
      setInvoice((prev) => ({ ...prev, notes: companySettings.defaultNotes || '' }));
    }
  }, [invoiceId, companySettings?.defaultNotes, invoice.notes]);

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

  // Create live preview invoice with snapshots for calculations and display
  const previewInvoice = useMemo(() => {
    return createInvoiceSnapshot(invoice, customers, services);
  }, [invoice, customers, services]);

  // Berechnungen
  const totals = calculateInvoiceTotals(previewInvoice, services);
  const selectedCustomer = customers.find((c) => c.id === invoice.customerId);

  const handleSave = () => {
    if (!invoice.invoiceNumber || !invoice.customerId) {
      notifications.show({
        title: 'Validierungsfehler',
        message: 'Bitte Rechnungsnummer und Kunde auswählen.',
        color: 'yellow',
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    if (invoice.lines.length === 0) {
      notifications.show({
        title: 'Validierungsfehler',
        message: 'Bitte mindestens eine Position hinzufügen.',
        color: 'yellow',
        icon: <IconAlertCircle size={16} />,
      });
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
    notifications.show({
      title: 'Erfolg',
      message: 'Rechnung wurde gespeichert.',
      color: 'green',
      icon: <IconCheck size={16} />,
    });
    navigate('/invoices');
  };

  const handlePDFExport = useCallback(async () => {
    if (!invoice.invoiceNumber || !invoice.customerId) {
      notifications.show({
        title: 'Fehler',
        message: 'Bitte speichern Sie die Rechnung zuerst.',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    const customerName = previewInvoice.customerSnapshot?.name || selectedCustomer?.name || 'Unbekannt';
    const filename = generatePDFFilename(invoice.invoiceNumber, customerName);

    try {
      // Generate PDF using react-pdf
      await generatePDF(previewInvoice, selectedCustomer, services, companySettings, filename);

      notifications.show({
        title: 'Erfolg',
        message: `PDF wurde erstellt: ${filename}`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: 'Fehler',
        message: 'Fehler beim Erstellen der PDF-Datei.',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      console.error(error);
    }
  }, [invoice, previewInvoice, selectedCustomer, services, companySettings]);

  // Auto-trigger PDF export wenn von Liste gestartet (nur einmal!)
  useEffect(() => {
    if (location.state?.exportPdf && invoice.invoiceNumber && !pdfExportTriggered.current) {
      pdfExportTriggered.current = true;
      const timer = setTimeout(() => {
        handlePDFExport();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.state?.exportPdf, invoice.invoiceNumber, handlePDFExport]);

  const handleBack = () => {
    navigate('/invoices');
  };

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
          pdfDisabled={!invoice.invoiceNumber || !invoice.customerId}
        />

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Fehler" color="red">
            {error}
          </Alert>
        )}

        {!hasData && !isLoading && (
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
