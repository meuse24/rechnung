import { Modal, Button, Stack, Text, Group, FileInput, Table, Alert } from '@mantine/core';
import { useState } from 'react';
import Papa from 'papaparse';
import { Customer } from '@/models/types';
import { IconUpload, IconAlertCircle, IconFileTypeCsv } from '@tabler/icons-react';

interface CustomerCSVImportModalProps {
  opened: boolean;
  onClose: () => void;
  onImport: (customers: Customer[]) => void;
}

interface CSVRow {
  name?: string;
  addressLine1?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
  email?: string;
}

export function CustomerCSVImportModal({
  opened,
  onClose,
  onImport,
}: CustomerCSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Customer[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setPreviewData([]);
    setErrors([]);

    if (selectedFile) {
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (csvFile: File) => {
    setIsLoading(true);

    Papa.parse<CSVRow>(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validationErrors: string[] = [];
        const customers: Customer[] = [];

        results.data.forEach((row, index) => {
          const lineNumber = index + 2; // +2 because of header and 1-based indexing

          // Validate required fields
          if (!row.name?.trim()) {
            validationErrors.push(`Zeile ${lineNumber}: Name fehlt`);
            return;
          }
          if (!row.addressLine1?.trim()) {
            validationErrors.push(`Zeile ${lineNumber}: Adresse fehlt`);
            return;
          }
          if (!row.postalCode?.trim()) {
            validationErrors.push(`Zeile ${lineNumber}: PLZ fehlt`);
            return;
          }
          if (!row.city?.trim()) {
            validationErrors.push(`Zeile ${lineNumber}: Stadt fehlt`);
            return;
          }
          if (!row.countryCode?.trim()) {
            validationErrors.push(`Zeile ${lineNumber}: Ländercode fehlt`);
            return;
          }

          // Create customer object
          customers.push({
            id: crypto.randomUUID(),
            name: row.name.trim(),
            addressLine1: row.addressLine1.trim(),
            postalCode: row.postalCode.trim(),
            city: row.city.trim(),
            countryCode: row.countryCode.trim(),
            email: row.email?.trim() || undefined,
          });
        });

        setPreviewData(customers);
        setErrors(validationErrors);
        setIsLoading(false);
      },
      error: (error) => {
        setErrors([`Fehler beim Parsen der CSV-Datei: ${error.message}`]);
        setIsLoading(false);
      },
    });
  };

  const handleImport = () => {
    if (previewData.length > 0) {
      onImport(previewData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData([]);
    setErrors([]);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Kunden aus CSV importieren"
      size="xl"
    >
      <Stack gap="md">
        <FileInput
          label="CSV-Datei auswählen"
          placeholder="Datei auswählen..."
          accept=".csv"
          value={file}
          onChange={handleFileChange}
          leftSection={<IconFileTypeCsv size={16} />}
        />

        <Text size="sm" c="dimmed">
          Erwartetes Format: name, addressLine1, postalCode, city, countryCode, email
        </Text>

        {errors.length > 0 && (
          <Alert icon={<IconAlertCircle size={16} />} title="Validierungsfehler" color="red">
            <Stack gap="xs">
              {errors.map((error, index) => (
                <Text key={index} size="sm">
                  {error}
                </Text>
              ))}
            </Stack>
          </Alert>
        )}

        {previewData.length > 0 && errors.length === 0 && (
          <>
            <Text fw={500}>Vorschau ({previewData.length} Kunden):</Text>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Adresse</Table.Th>
                  <Table.Th>PLZ / Stadt</Table.Th>
                  <Table.Th>Land</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {previewData.slice(0, 5).map((customer, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{customer.name}</Table.Td>
                    <Table.Td>{customer.addressLine1}</Table.Td>
                    <Table.Td>
                      {customer.postalCode} {customer.city}
                    </Table.Td>
                    <Table.Td>{customer.countryCode}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            {previewData.length > 5 && (
              <Text size="sm" c="dimmed" ta="center">
                ... und {previewData.length - 5} weitere
              </Text>
            )}
          </>
        )}

        <Group justify="flex-end" gap="xs">
          <Button variant="default" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button
            leftSection={<IconUpload size={16} />}
            onClick={handleImport}
            disabled={previewData.length === 0 || errors.length > 0 || isLoading}
          >
            {previewData.length} Kunden importieren
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
