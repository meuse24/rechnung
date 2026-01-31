import { Modal, TextInput, Button, Stack, NumberInput } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Service } from '@/models/types';
import { generateUUID } from '@/utils/uuid';

interface ServiceFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (service: Service) => void;
  service?: Service;
}

export function ServiceFormModal({
  opened,
  onClose,
  onSave,
  service,
}: ServiceFormModalProps) {
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    name: '',
    hourlyRate: 0,
    taxRate: 20,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        hourlyRate: service.hourlyRate,
        taxRate: service.taxRate,
      });
    } else {
      setFormData({
        name: '',
        hourlyRate: 0,
        taxRate: 20,
      });
    }
  }, [service, opened]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Bitte geben Sie einen Namen ein.');
      return;
    }

    if (formData.hourlyRate <= 0) {
      alert('Der Stundensatz muss größer als 0 sein.');
      return;
    }

    if (formData.taxRate < 0 || formData.taxRate > 100) {
      alert('Der Steuersatz muss zwischen 0 und 100 liegen.');
      return;
    }

    const serviceToSave: Service = {
      id: service?.id || generateUUID(),
      ...formData,
    };

    onSave(serviceToSave);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={service ? 'Leistung bearbeiten' : 'Neue Leistung'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Name"
            placeholder="z.B. Beratung, Entwicklung, Training"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <NumberInput
            label="Stundensatz"
            placeholder="EUR pro Stunde"
            required
            min={0}
            step={0.01}
            decimalScale={2}
            fixedDecimalScale
            decimalSeparator=","
            thousandSeparator="."
            suffix=" €"
            value={formData.hourlyRate}
            onChange={(value) =>
              setFormData({ ...formData, hourlyRate: Number(value) || 0 })
            }
          />

          <NumberInput
            label="Steuersatz"
            placeholder="z.B. 20 für 20%"
            required
            min={0}
            max={100}
            step={0.5}
            decimalScale={2}
            fixedDecimalScale
            decimalSeparator=","
            thousandSeparator="."
            suffix=" %"
            value={formData.taxRate}
            onChange={(value) =>
              setFormData({ ...formData, taxRate: Number(value) || 0 })
            }
          />

          <Button type="submit" fullWidth>
            {service ? 'Speichern' : 'Hinzufügen'}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
