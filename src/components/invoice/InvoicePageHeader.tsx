import { ActionIcon, Button, Group, Title } from '@mantine/core';
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconFileTypePdf,
} from '@tabler/icons-react';

interface InvoicePageHeaderProps {
  title: string;
  onBack: () => void;
  onSave: () => void;
  onPdf: () => void;
  pdfDisabled?: boolean;
}

export function InvoicePageHeader({
  title,
  onBack,
  onSave,
  onPdf,
  pdfDisabled,
}: InvoicePageHeaderProps) {
  return (
    <Group justify="space-between">
      <Group gap="xs">
        <ActionIcon variant="subtle" size="lg" onClick={onBack} className="no-print">
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={1}>{title}</Title>
      </Group>
      <Group gap="xs" className="no-print">
        <Button
          variant="filled"
          size="sm"
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={onSave}
        >
          Speichern
        </Button>
        <Button
          variant="light"
          size="sm"
          leftSection={<IconFileTypePdf size={16} />}
          onClick={onPdf}
          disabled={pdfDisabled}
        >
          Als PDF
        </Button>
      </Group>
    </Group>
  );
}
