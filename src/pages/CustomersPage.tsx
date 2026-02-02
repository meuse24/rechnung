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
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconDownload, IconUpload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Customer } from '@/models/types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/storage/localStorage';
import { CustomerFormModal } from '@/components/CustomerFormModal';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { CustomerCSVImportModal } from '@/components/CustomerCSVImportModal';
import { downloadCustomerTemplate } from '@/utils/csvTemplates';

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formModalOpened, setFormModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [importModalOpened, setImportModalOpened] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  // Laden beim Mount
  useEffect(() => {
    const loaded = loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    setCustomers(loaded);
  }, []);

  // Speichern bei Änderungen
  const saveCustomers = (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
    saveToStorage(STORAGE_KEYS.CUSTOMERS, newCustomers);
  };

  const handleSave = (customer: Customer) => {
    const existingIndex = customers.findIndex((c) => c.id === customer.id);

    if (existingIndex >= 0) {
      // Bearbeiten
      const updated = [...customers];
      updated[existingIndex] = customer;
      saveCustomers(updated);
    } else {
      // Neu hinzufügen
      saveCustomers([...customers, customer]);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormModalOpened(true);
  };

  const handleAdd = () => {
    setEditingCustomer(undefined);
    setFormModalOpened(true);
  };

  const handleDeleteClick = (customerId: string) => {
    setDeletingCustomerId(customerId);
    setDeleteModalOpened(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingCustomerId) {
      const updated = customers.filter((c) => c.id !== deletingCustomerId);
      saveCustomers(updated);
      setDeletingCustomerId(null);
    }
  };

  const handleCSVImport = (importedCustomers: Customer[]) => {
    const updated = [...customers, ...importedCustomers];
    saveCustomers(updated);
    notifications.show({
      title: 'Import erfolgreich',
      message: `${importedCustomers.length} Kunden wurden importiert.`,
      color: 'green',
    });
  };

  const deletingCustomer = customers.find((c) => c.id === deletingCustomerId);

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={1}>Kundenverwaltung</Title>
          <Group gap="xs">
            <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
              onClick={downloadCustomerTemplate}
            >
              CSV-Vorlage
            </Button>
            <Button
              variant="light"
              leftSection={<IconUpload size={16} />}
              onClick={() => setImportModalOpened(true)}
            >
              CSV importieren
            </Button>
            <Button leftSection={<IconPlus size={16} />} onClick={handleAdd}>
              Neuer Kunde
            </Button>
          </Group>
        </Group>

        {customers.length === 0 ? (
          <Paper p="xl" withBorder>
            <Text c="dimmed" ta="center">
              Noch keine Kunden vorhanden. Fügen Sie Ihren ersten Kunden hinzu.
            </Text>
          </Paper>
        ) : (
          <Paper withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Adresse</Table.Th>
                  <Table.Th>PLZ / Stadt</Table.Th>
                  <Table.Th>Land</Table.Th>
                  <Table.Th>E-Mail</Table.Th>
                  <Table.Th style={{ width: 100 }}>Aktionen</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {customers.map((customer) => (
                  <Table.Tr key={customer.id}>
                    <Table.Td>{customer.name}</Table.Td>
                    <Table.Td>{customer.addressLine1}</Table.Td>
                    <Table.Td>
                      {customer.postalCode} {customer.city}
                    </Table.Td>
                    <Table.Td>{customer.countryCode}</Table.Td>
                    <Table.Td>{customer.email || '-'}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => handleEdit(customer)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDeleteClick(customer.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        )}
      </Stack>

      <CustomerFormModal
        opened={formModalOpened}
        onClose={() => setFormModalOpened(false)}
        onSave={handleSave}
        customer={editingCustomer}
      />

      <ConfirmDeleteModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        onConfirm={handleDeleteConfirm}
        title="Kunde löschen"
        message={`Möchten Sie den Kunden "${deletingCustomer?.name}" wirklich löschen?`}
      />

      <CustomerCSVImportModal
        opened={importModalOpened}
        onClose={() => setImportModalOpened(false)}
        onImport={handleCSVImport}
      />
    </Container>
  );
}
