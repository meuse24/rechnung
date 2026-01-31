import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Title,
  Button,
  Group,
  Stack,
  Paper,
  Select,
  NumberInput,
  Table,
  Text,
  Divider,
  ActionIcon,
  Textarea,
  Alert,
} from '@mantine/core';
import {
  IconPlus,
  IconTrash,
  IconDeviceFloppy,
  IconPrinter,
  IconInfoCircle,
  IconArrowLeft,
  IconFileTypePdf,
} from '@tabler/icons-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Customer,
  Service,
  Invoice,
  InvoiceLine,
  CompanySettings,
  InvoiceStatus,
} from '@/models/types';
import { loadFromStorage, STORAGE_KEYS } from '@/storage/localStorage';
import { loadInvoices, saveInvoices } from '@/storage/invoices';
import { calculateInvoiceTotals } from '@/utils/calc';
import { formatCurrency } from '@/utils/money';
import { InvoicePrintView } from '@/components/InvoicePrintView';
import { generatePDF, generatePDFFilename } from '@/utils/pdfExport';
import { createInvoiceSnapshot } from '@/utils/invoice';
import { InvoiceHeaderForm } from '@/components/invoice/InvoiceHeaderForm';

export function InvoicePage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings | undefined>(
    undefined
  );
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
    const loadedCustomers = loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    const loadedServices = loadFromStorage<Service[]>(STORAGE_KEYS.SERVICES, []);
    const loadedSettings = loadFromStorage<CompanySettings | undefined>(
      STORAGE_KEYS.COMPANY_SETTINGS,
      undefined
    );
    setCustomers(loadedCustomers);
    setServices(loadedServices);
    setCompanySettings(loadedSettings);

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
        <Group justify="space-between">
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={handleBack}
              className="no-print"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={1}>
              {isNew ? 'Neue Rechnung' : 'Rechnung bearbeiten'}
            </Title>
          </Group>
          <Group gap="xs" className="no-print">
            <Button
              variant="filled"
              size="sm"
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={handleSave}
            >
              Speichern
            </Button>
            <Button
              variant="light"
              size="sm"
              leftSection={<IconFileTypePdf size={16} />}
              onClick={handlePDFExport}
              disabled={!invoice.invoiceNumber || !invoice.customerId}
            >
              Als PDF
            </Button>
            <Button
              variant="light"
              size="sm"
              leftSection={<IconPrinter size={16} />}
              onClick={handlePrint}
            >
              Drucken
            </Button>
          </Group>
        </Group>

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
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={500}>Positionen</Text>
              <Button
                size="xs"
                leftSection={<IconPlus size={14} />}
                onClick={addLine}
                disabled={services.length === 0}
              >
                Position hinzufügen
              </Button>
            </Group>

            {invoice.lines.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                Noch keine Positionen hinzugefügt.
              </Text>
            ) : (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Leistung</Table.Th>
                    <Table.Th style={{ width: 120 }}>Stunden</Table.Th>
                    <Table.Th style={{ width: 120 }}>Betrag</Table.Th>
                    <Table.Th style={{ width: 50 }}></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {invoice.lines.map((line, index) => {
                    const lineCalc = totals.lines[index];
                    return (
                      <Table.Tr key={index}>
                        <Table.Td>
                          <Select
                            placeholder="Leistung wählen"
                            data={serviceOptions}
                            value={line.serviceId}
                            onChange={(value) =>
                              updateLine(index, 'serviceId', value || '')
                            }
                            searchable
                          />
                        </Table.Td>
                        <Table.Td>
                          <NumberInput
                            placeholder="0"
                            min={0}
                            step={0.5}
                            decimalScale={2}
                            decimalSeparator=","
                            thousandSeparator="."
                            value={line.hours}
                            onChange={(value) =>
                              updateLine(index, 'hours', Number(value) || 0)
                            }
                          />
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={500}>
                            {formatCurrency(lineCalc?.netAmount || 0)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => removeLine(index)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            )}
          </Stack>
        </Paper>

        {/* Summen */}
        {invoice.lines.length > 0 && (
          <Paper p="md" withBorder>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text>Nettobetrag:</Text>
                <Text fw={500}>{formatCurrency(totals.netTotal)}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Mehrwertsteuer:</Text>
                <Text fw={500}>{formatCurrency(totals.taxTotal)}</Text>
              </Group>
              <Divider />
              <Group justify="space-between">
                <Text size="lg" fw={700}>
                  Gesamtbetrag:
                </Text>
                <Text size="lg" fw={700}>
                  {formatCurrency(totals.grossTotal)}
                </Text>
              </Group>
            </Stack>
          </Paper>
        )}

        {/* Notizen */}
        <Paper p="md" withBorder>
          <Textarea
            label="Notizen / Zahlungshinweise"
            placeholder="z.B. Zahlbar innerhalb von 14 Tagen"
            rows={3}
            value={invoice.notes}
            onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
          />
        </Paper>
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
