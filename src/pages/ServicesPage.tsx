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
  Badge,
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { Service } from '@/models/types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/storage/localStorage';
import { ServiceFormModal } from '@/components/ServiceFormModal';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { formatCurrency } from '@/utils/money';

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [formModalOpened, setFormModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>(undefined);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  // Laden beim Mount
  useEffect(() => {
    const loaded = loadFromStorage<Service[]>(STORAGE_KEYS.SERVICES, []);
    setServices(loaded);
  }, []);

  // Speichern bei Änderungen
  const saveServices = (newServices: Service[]) => {
    setServices(newServices);
    saveToStorage(STORAGE_KEYS.SERVICES, newServices);
  };

  const handleSave = (service: Service) => {
    const existingIndex = services.findIndex((s) => s.id === service.id);

    if (existingIndex >= 0) {
      // Bearbeiten
      const updated = [...services];
      updated[existingIndex] = service;
      saveServices(updated);
    } else {
      // Neu hinzufügen
      saveServices([...services, service]);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormModalOpened(true);
  };

  const handleAdd = () => {
    setEditingService(undefined);
    setFormModalOpened(true);
  };

  const handleDeleteClick = (serviceId: string) => {
    setDeletingServiceId(serviceId);
    setDeleteModalOpened(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingServiceId) {
      const updated = services.filter((s) => s.id !== deletingServiceId);
      saveServices(updated);
      setDeletingServiceId(null);
    }
  };

  const deletingService = services.find((s) => s.id === deletingServiceId);

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={1}>Leistungsverwaltung</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={handleAdd}>
            Neue Leistung
          </Button>
        </Group>

        {services.length === 0 ? (
          <Paper p="xl" withBorder>
            <Text c="dimmed" ta="center">
              Noch keine Leistungen vorhanden. Fügen Sie Ihre erste Leistung hinzu.
            </Text>
          </Paper>
        ) : (
          <Paper withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Leistung</Table.Th>
                  <Table.Th>Stundensatz</Table.Th>
                  <Table.Th>Steuersatz</Table.Th>
                  <Table.Th>Brutto/Stunde</Table.Th>
                  <Table.Th style={{ width: 100 }}>Aktionen</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {services.map((service) => {
                  const grossPerHour = service.hourlyRate * (1 + service.taxRate / 100);
                  return (
                    <Table.Tr key={service.id}>
                      <Table.Td>
                        <Text fw={500}>{service.name}</Text>
                      </Table.Td>
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
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleEdit(service)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleDeleteClick(service.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Paper>
        )}
      </Stack>

      <ServiceFormModal
        opened={formModalOpened}
        onClose={() => setFormModalOpened(false)}
        onSave={handleSave}
        service={editingService}
      />

      <ConfirmDeleteModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        onConfirm={handleDeleteConfirm}
        title="Leistung löschen"
        message={`Möchten Sie die Leistung "${deletingService?.name}" wirklich löschen?`}
      />
    </Container>
  );
}
