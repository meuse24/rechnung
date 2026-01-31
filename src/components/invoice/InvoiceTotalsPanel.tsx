import { Divider, Group, Paper, Stack, Text } from '@mantine/core';
import { formatCurrency } from '@/utils/money';

interface InvoiceTotalsPanelProps {
  netTotal: number;
  taxTotal: number;
  grossTotal: number;
}

export function InvoiceTotalsPanel({
  netTotal,
  taxTotal,
  grossTotal,
}: InvoiceTotalsPanelProps) {
  return (
    <Paper p="md" withBorder>
      <Stack gap="xs">
        <Group justify="space-between">
          <Text>Nettobetrag:</Text>
          <Text fw={500}>{formatCurrency(netTotal)}</Text>
        </Group>
        <Group justify="space-between">
          <Text>Mehrwertsteuer:</Text>
          <Text fw={500}>{formatCurrency(taxTotal)}</Text>
        </Group>
        <Divider />
        <Group justify="space-between">
          <Text size="lg" fw={700}>
            Gesamtbetrag:
          </Text>
          <Text size="lg" fw={700}>
            {formatCurrency(grossTotal)}
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
}
