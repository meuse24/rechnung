import { ActionIcon, Button, Group, Paper, Select, Stack, Table, Text, NumberInput } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { InvoiceLine, Service } from '@/models/types';
import { formatCurrency } from '@/utils/money';

interface InvoiceLinesEditorProps {
  lines: InvoiceLine[];
  serviceOptions: { value: string; label: string }[];
  services: Service[];
  lineTotals: { netAmount: number }[];
  onAddLine: () => void;
  onRemoveLine: (index: number) => void;
  onUpdateLine: (index: number, field: keyof InvoiceLine, value: string | number) => void;
}

export function InvoiceLinesEditor({
  lines,
  serviceOptions,
  services,
  lineTotals,
  onAddLine,
  onRemoveLine,
  onUpdateLine,
}: InvoiceLinesEditorProps) {
  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={500}>Positionen</Text>
          <Button
            size="xs"
            leftSection={<IconPlus size={14} />}
            onClick={onAddLine}
            disabled={services.length === 0}
          >
            Position hinzufügen
          </Button>
        </Group>

        {lines.length === 0 ? (
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
              {lines.map((line, index) => {
                const lineCalc = lineTotals[index];
                return (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <Select
                        placeholder="Leistung wählen"
                        data={serviceOptions}
                        value={line.serviceId}
                        onChange={(value) => onUpdateLine(index, 'serviceId', value || '')}
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
                          onUpdateLine(index, 'hours', Number(value) || 0)
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
                        onClick={() => onRemoveLine(index)}
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
  );
}
