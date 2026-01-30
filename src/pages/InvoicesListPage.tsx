import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Table,
  Group,
  ActionIcon,
  Text,
  Paper,
  Stack,
  Badge,
  TextInput,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconPrinter,
  IconCopy,
  IconSearch,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Invoice, Customer, Service, InvoiceStatus } from '@/models/types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/storage/localStorage';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { calculateInvoiceTotals } from '@/utils/calc';
import { formatCurrency } from '@/utils/money';

export function InvoicesListPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadedInvoices = loadFromStorage<Invoice[]>(STORAGE_KEYS.INVOICES, []);
    const loadedCustomers = loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    const loadedServices = loadFromStorage<Service[]>(STORAGE_KEYS.SERVICES, []);

    setInvoices(loadedInvoices);
    setCustomers(loadedCustomers);
    setServices(loadedServices);
  }, []);

  const saveInvoices = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices);
    saveToStorage(STORAGE_KEYS.INVOICES, newInvoices);
  };

  const handleNew = () => {
    navigate('/invoice/new');
  };

  const handleEdit = (invoiceId: string) => {
    navigate(`/invoice/${invoiceId}`);
  };

  const handleDuplicate = (invoice: Invoice) => {
    const duplicated: Invoice = {
      ...invoice,
      id: crypto.randomUUID(),
      invoiceNumber: invoice.invoiceNumber + '-KOPIE',
      issueDate: new Date().toISOString().split('T')[0],
      status: 'draft',
    };
    const updated = [...invoices, duplicated];
    saveInvoices(updated);
    alert('Rechnung wurde dupliziert.');
  };

  const handleDeleteClick = (invoiceId: string) => {
    setDeletingInvoiceId(invoiceId);
    setDeleteModalOpened(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingInvoiceId) {
      const updated = invoices.filter((inv) => inv.id !== deletingInvoiceId);
      saveInvoices(updated);
      setDeletingInvoiceId(null);
    }
  };

  const handlePrint = (invoice: Invoice) => {
    // Navigate to invoice page and trigger print
    navigate(`/invoice/${invoice.id}`, { state: { print: true } });
  };

  const getCustomerName = (customerId: string): string => {
    const customer = customers.find((c) => c.id === customerId);
    return customer?.name || 'Unbekannt';
  };

  const getStatusBadge = (status?: InvoiceStatus) => {
    const s = status || 'draft';
    const colors: Record<InvoiceStatus, string> = {
      draft: 'gray',
      sent: 'blue',
      paid: 'green',
      cancelled: 'red',
    };
    const labels: Record<InvoiceStatus, string> = {
      draft: 'Entwurf',
      sent: 'Versendet',
      paid: 'Bezahlt',
      cancelled: 'Storniert',
    };
    return <Badge color={colors[s]}>{labels[s]}</Badge>;
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      invoice.invoiceNumber.toLowerCase().includes(term) ||
      getCustomerName(invoice.customerId).toLowerCase().includes(term) ||
      invoice.issueDate.includes(term)
    );
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    // Sort by date descending (newest first)
    return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
  });

  const deletingInvoice = invoices.find((inv) => inv.id === deletingInvoiceId);

  return (
    <Container size="xl" py="xl">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={1}>Rechnungsübersicht</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={handleNew}>
            Neue Rechnung
          </Button>
        </Group>

        <TextInput
          placeholder="Suchen nach Rechnungsnummer, Kunde, Datum..."
          leftSection={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {sortedInvoices.length === 0 ? (
          <Paper p="xl" withBorder>
            <Text c="dimmed" ta="center">
              {searchTerm
                ? 'Keine Rechnungen gefunden.'
                : 'Noch keine Rechnungen vorhanden. Erstellen Sie Ihre erste Rechnung.'}
            </Text>
          </Paper>
        ) : (
          <Paper withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Rechnungsnr.</Table.Th>
                  <Table.Th>Datum</Table.Th>
                  <Table.Th>Kunde</Table.Th>
                  <Table.Th>Netto</Table.Th>
                  <Table.Th>Brutto</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th style={{ width: 150 }}>Aktionen</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {sortedInvoices.map((invoice) => {
                  const totals = calculateInvoiceTotals(invoice, services);
                  return (
                    <Table.Tr key={invoice.id}>
                      <Table.Td>
                        <Text fw={500}>{invoice.invoiceNumber}</Text>
                      </Table.Td>
                      <Table.Td>{invoice.issueDate}</Table.Td>
                      <Table.Td>{getCustomerName(invoice.customerId)}</Table.Td>
                      <Table.Td>{formatCurrency(totals.netTotal)}</Table.Td>
                      <Table.Td>
                        <Text fw={500}>{formatCurrency(totals.grossTotal)}</Text>
                      </Table.Td>
                      <Table.Td>{getStatusBadge(invoice.status)}</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleEdit(invoice.id)}
                            title="Bearbeiten"
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => handleDuplicate(invoice)}
                            title="Duplizieren"
                          >
                            <IconCopy size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="violet"
                            onClick={() => handlePrint(invoice)}
                            title="Drucken"
                          >
                            <IconPrinter size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleDeleteClick(invoice.id)}
                            title="Löschen"
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Paper>
        )}

        {sortedInvoices.length > 0 && (
          <Text size="sm" c="dimmed">
            {sortedInvoices.length} Rechnung{sortedInvoices.length !== 1 ? 'en' : ''}
            {searchTerm && ` (gefiltert von ${invoices.length})`}
          </Text>
        )}
      </Stack>

      <ConfirmDeleteModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        onConfirm={handleDeleteConfirm}
        title="Rechnung löschen"
        message={`Möchten Sie die Rechnung "${deletingInvoice?.invoiceNumber}" wirklich löschen?`}
      />
    </Container>
  );
}
