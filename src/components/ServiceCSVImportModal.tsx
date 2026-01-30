import { Modal, Button, Stack, Text, Group, FileInput, Table, Alert, Badge } from '@mantine/core';
import { useState } from 'react';
import Papa from 'papaparse';
import { Service } from '@/models/types';
import { IconUpload, IconAlertCircle, IconFileTypeCsv } from '@tabler/icons-react';
import { formatCurrency } from '@/utils/money';

interface ServiceCSVImportModalProps {
  opened: boolean;
  onClose: () => void;
  onImport: (services: Service[]) => void;
}

interface CSVRow {
  name?: string;
  hourlyRate?: string;
  taxRate?: string;
}

export function ServiceCSVImportModal({
  opened,
  onClose,
  onImport,
}: ServiceCSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Service[]>([]);
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

  const parseNumber = (value: string | undefined): number | null => {
    if (!value) return null;
    // Support both comma and dot as decimal separator
    const normalized = value.trim().replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? null : parsed;
  };

  const parseCSV = (csvFile: File) => {
    setIsLoading(true);

    Papa.parse<CSVRow>(csvFile, {
      header: true,
      skipEmptyLines: true,
      delimiter: ';',
      complete: (results) => {
        const validationErrors: string[] = [];
        const services: Service[] = [];

        results.data.forEach((row, index) => {
          const lineNumber = index + 2; // +2 because of header and 1-based indexing

          // Validate name
          if (!row.name?.trim()) {
            validationErrors.push(`Zeile ${lineNumber}: Name fehlt`);
            return;
          }

          // Parse and validate hourlyRate
          const hourlyRate = parseNumber(row.hourlyRate);
          if (hourlyRate === null) {
            validationErrors.push(`Zeile ${lineNumber}: Ungültiger Stundensatz`);
            return;
          }
          if (hourlyRate <= 0) {
            validationErrors.push(`Zeile ${lineNumber}: Stundensatz muss größer als 0 sein`);
            return;
          }

          // Parse and validate taxRate
          const taxRate = parseNumber(row.taxRate);
          if (taxRate === null) {
            validationErrors.push(`Zeile ${lineNumber}: Ungültiger Steuersatz`);
            return;
          }
          if (taxRate < 0 || taxRate > 100) {
            validationErrors.push(`Zeile ${lineNumber}: Steuersatz muss zwischen 0 und 100 liegen`);
            return;
          }

          // Create service object
          services.push({
            id: crypto.randomUUID(),
            name: row.name.trim(),
            hourlyRate,
            taxRate,
          });
        });

        setPreviewData(services);
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
      title="Leistungen aus CSV importieren"
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
          Erwartetes Format: name; hourlyRate; taxRate (Semikolon-getrennt, Zahlen mit Komma oder Punkt)
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
            <Text fw={500}>Vorschau ({previewData.length} Leistungen):</Text>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Leistung</Table.Th>
                  <Table.Th>Stundensatz</Table.Th>
                  <Table.Th>Steuersatz</Table.Th>
                  <Table.Th>Brutto/Stunde</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {previewData.slice(0, 5).map((service, index) => {
                  const grossPerHour = service.hourlyRate * (1 + service.taxRate / 100);
                  return (
                    <Table.Tr key={index}>
                      <Table.Td>{service.name}</Table.Td>
                      <Table.Td>{formatCurrency(service.hourlyRate)}</Table.Td>
                      <Table.Td>
                        <Badge variant="light" color="blue">
                          {service.taxRate}%
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text c="dimmed" size="sm">
                          {formatCurrency(grossPerHour)}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
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
            {previewData.length} Leistungen importieren
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
