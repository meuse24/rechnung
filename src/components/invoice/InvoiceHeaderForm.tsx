import { Group, Paper, Select, Stack, Text, TextInput } from '@mantine/core';
import { Customer, Invoice, InvoiceStatus } from '@/models/types';

interface InvoiceHeaderFormProps {
  invoice: Invoice;
  customerOptions: { value: string; label: string }[];
  statusOptions: { value: InvoiceStatus; label: string }[];
  selectedCustomer?: Customer;
  onChange: (invoice: Invoice) => void;
}

export function InvoiceHeaderForm({
  invoice,
  customerOptions,
  statusOptions,
  selectedCustomer,
  onChange,
}: InvoiceHeaderFormProps) {
  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <Group grow>
          <TextInput
            label="Rechnungsnummer"
            placeholder="RE-2024-001"
            required
            value={invoice.invoiceNumber}
            onChange={(e) => onChange({ ...invoice, invoiceNumber: e.target.value })}
          />
          <TextInput
            label="Rechnungsdatum"
            type="date"
            required
            value={invoice.issueDate}
            onChange={(e) => onChange({ ...invoice, issueDate: e.target.value })}
          />
          <Select
            label="Status"
            data={statusOptions}
            value={invoice.status || 'draft'}
            onChange={(value) =>
              onChange({ ...invoice, status: (value as InvoiceStatus) || 'draft' })
            }
          />
        </Group>

        <Select
          label="Kunde"
          placeholder="Kunde auswählen"
          required
          data={customerOptions}
          value={invoice.customerId}
          onChange={(value) => onChange({ ...invoice, customerId: value || '' })}
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
  );
}
