import { Modal, TextInput, Button, Stack } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Customer } from '@/models/types';
import { generateUUID } from '@/utils/uuid';

interface CustomerFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  customer?: Customer;
}

export function CustomerFormModal({
  opened,
  onClose,
  onSave,
  customer,
}: CustomerFormModalProps) {
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: '',
    addressLine1: '',
    postalCode: '',
    city: '',
    countryCode: 'AT',
    email: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        addressLine1: customer.addressLine1,
        postalCode: customer.postalCode,
        city: customer.city,
        countryCode: customer.countryCode,
        email: customer.email || '',
      });
    } else {
      setFormData({
        name: '',
        addressLine1: '',
        postalCode: '',
        city: '',
        countryCode: 'AT',
        email: '',
      });
    }
  }, [customer, opened]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.addressLine1 || !formData.city) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    const customerToSave: Customer = {
      id: customer?.id || generateUUID(),
      ...formData,
      email: formData.email || undefined,
    };

    onSave(customerToSave);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={customer ? 'Kunde bearbeiten' : 'Neuer Kunde'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Name"
            placeholder="Firma / Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextInput
            label="Adresse"
            placeholder="Straße und Hausnummer"
            required
            value={formData.addressLine1}
            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
          />

          <TextInput
            label="Postleitzahl"
            placeholder="PLZ"
            required
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
          />

          <TextInput
            label="Stadt"
            placeholder="Stadt"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />

          <TextInput
            label="Ländercode"
            placeholder="z.B. DE, AT, CH"
            required
            value={formData.countryCode}
            onChange={(e) =>
              setFormData({ ...formData, countryCode: e.target.value.toUpperCase() })
            }
          />

          <TextInput
            label="E-Mail"
            placeholder="Optional"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Button type="submit" fullWidth>
            {customer ? 'Speichern' : 'Hinzufügen'}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
