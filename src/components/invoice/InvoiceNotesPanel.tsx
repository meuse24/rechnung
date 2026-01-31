import { Paper, Textarea } from '@mantine/core';

interface InvoiceNotesPanelProps {
  notes: string;
  onChange: (value: string) => void;
}

export function InvoiceNotesPanel({ notes, onChange }: InvoiceNotesPanelProps) {
  return (
    <Paper p="md" withBorder>
      <Textarea
        label="Notizen / Zahlungshinweise"
        placeholder="z.B. Zahlbar innerhalb von 14 Tagen"
        rows={3}
        value={notes}
        onChange={(e) => onChange(e.target.value)}
      />
    </Paper>
  );
}
