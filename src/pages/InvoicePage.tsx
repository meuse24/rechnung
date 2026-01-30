import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Group,
  Stack,
  Paper,
  TextInput,
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
  IconFileDownload,
  IconPrinter,
  IconInfoCircle,
} from '@tabler/icons-react';
import { Customer, Service, Invoice, InvoiceLine, CompanySettings } from '@/models/types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/storage/localStorage';
import { calculateInvoiceTotals } from '@/utils/calc';
import { formatCurrency } from '@/utils/money';
import { InvoicePrintView } from '@/components/InvoicePrintView';

export function InvoicePage() {
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
  });

  // Laden von Stammdaten beim Mount
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

    // Versuche gespeicherte Rechnung zu laden
    const savedInvoice = loadFromStorage<Invoice | null>(STORAGE_KEYS.CURRENT_INVOICE, null);
    if (savedInvoice) {
      setInvoice(savedInvoice);
    }
  }, []);

  // Position hinzufügen
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

  // Position entfernen
  const removeLine = (index: number) => {
    const newLines = invoice.lines.filter((_, i) => i !== index);
    setInvoice({ ...invoice, lines: newLines });
  };

  // Position aktualisieren
  const updateLine = (index: number, field: keyof InvoiceLine, value: string | number) => {
    const newLines = [...invoice.lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setInvoice({ ...invoice, lines: newLines });
  };

  // Rechnung speichern
  const handleSave = () => {
    if (!invoice.invoiceNumber || !invoice.customerId) {
      alert('Bitte Rechnungsnummer und Kunde auswählen.');
      return;
    }

    if (invoice.lines.length === 0) {
      alert('Bitte mindestens eine Position hinzufügen.');
      return;
    }

    saveToStorage(STORAGE_KEYS.CURRENT_INVOICE, invoice);
    alert('Rechnung wurde gespeichert.');
  };

  // Rechnung laden
  const handleLoad = () => {
    const savedInvoice = loadFromStorage<Invoice | null>(STORAGE_KEYS.CURRENT_INVOICE, null);
    if (savedInvoice) {
      setInvoice(savedInvoice);
      alert('Rechnung wurde geladen.');
    } else {
      alert('Keine gespeicherte Rechnung gefunden.');
    }
  };

  // Neue Rechnung
  const handleNew = () => {
    setInvoice({
      id: crypto.randomUUID(),
      invoiceNumber: '',
      issueDate: new Date().toISOString().split('T')[0],
      customerId: '',
      lines: [],
      notes: '',
    });
  };

  // Drucken
  const handlePrint = () => {
    window.print();
  };

  // Berechnungen
  const totals = calculateInvoiceTotals(invoice, services);
  const selectedCustomer = customers.find((c) => c.id === invoice.customerId);

  const customerOptions = customers.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const serviceOptions = services.map((s) => ({
    value: s.id,
    label: `${s.name} (${formatCurrency(s.hourlyRate)}/h)`,
  }));

  const hasData = customers.length > 0 && services.length > 0;

  return (
    <Container size="lg" py="xl" className="invoice-page">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Rechnung erstellen</Title>
          <Group gap="xs">
            <Button variant="default" size="sm" onClick={handleNew}>
              Neu
            </Button>
            <Button
              variant="default"
              size="sm"
              leftSection={<IconFileDownload size={16} />}
              onClick={handleLoad}
            >
              Laden
            </Button>
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
              leftSection={<IconPrinter size={16} />}
              onClick={handlePrint}
              className="no-print"
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
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Rechnungsnummer"
                placeholder="RE-2024-001"
                required
                value={invoice.invoiceNumber}
                onChange={(e) =>
                  setInvoice({ ...invoice, invoiceNumber: e.target.value })
                }
              />
              <TextInput
                label="Rechnungsdatum"
                type="date"
                required
                value={invoice.issueDate}
                onChange={(e) => setInvoice({ ...invoice, issueDate: e.target.value })}
              />
            </Group>

            <Select
              label="Kunde"
              placeholder="Kunde auswählen"
              required
              data={customerOptions}
              value={invoice.customerId}
              onChange={(value) =>
                setInvoice({ ...invoice, customerId: value || '' })
              }
              searchable
            />

            {selectedCustomer && (
              <Paper p="sm" bg="gray.0">
                <Text size="sm" fw={500}>
                  {selectedCustomer.name}
                </Text>
                <Text size="sm" c="dimmed">
                  {selectedCustomer.addressLine1}
                </Text>
                <Text size="sm" c="dimmed">
                  {selectedCustomer.postalCode} {selectedCustomer.city},{' '}
                  {selectedCustomer.countryCode}
                </Text>
                {selectedCustomer.email && (
                  <Text size="sm" c="dimmed">
                    {selectedCustomer.email}
                  </Text>
                )}
              </Paper>
            )}
          </Stack>
        </Paper>

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
        invoice={invoice}
        customer={selectedCustomer}
        services={services}
        companySettings={companySettings}
      />
    </Container>
  );
}
