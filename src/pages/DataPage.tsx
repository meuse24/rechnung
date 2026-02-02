import { useState, useRef } from 'react';
import {
  Container,
  Title,
  Paper,
  Stack,
  Button,
  Group,
  Text,
  Divider,
  Alert,
} from '@mantine/core';
import {
  IconInfoCircle,
  IconDownload,
  IconUpload,
  IconFileExport,
  IconDatabase,
  IconTrash,
} from '@tabler/icons-react';
import { clearAllData } from '@/storage/localStorage';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import {
  exportAllData,
  downloadDataAsJson,
  importDataFromFile,
  importAllData,
} from '@/utils/dataExport';
import { loadSampleData } from '@/utils/sampleData';

export function DataPage() {
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [resetModalOpened, setResetModalOpened] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export alle Daten
  const handleExport = () => {
    try {
      const data = exportAllData();
      downloadDataAsJson(data);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      alert('Fehler beim Exportieren der Daten: ' + error);
    }
  };

  // Import Daten
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);

    try {
      const data = await importDataFromFile(file);
      importAllData(data);

      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        window.location.reload();
      }, 1500);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Unbekannter Fehler');
      setTimeout(() => setImportError(null), 5000);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleLoadSampleData = () => {
    loadSampleData();
    window.location.reload();
  };

  const handleResetAllData = () => {
    clearAllData();
    setResetModalOpened(false);
    window.location.reload();
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={1}>Datenverwaltung</Title>

        <Alert icon={<IconInfoCircle size={16} />} title="Hinweis" color="blue">
          Alle Daten werden lokal in Ihrem Browser gespeichert. Erstellen Sie regelmäßig
          Backups, um Datenverlust zu vermeiden.
        </Alert>

        {/* Datensicherung / Export/Import */}
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <div>
                <Text fw={600} size="lg">
                  Datensicherung
                </Text>
                <Text size="sm" c="dimmed">
                  Exportieren Sie regelmäßig Ihre Daten als Backup
                </Text>
              </div>
              <IconFileExport size={32} stroke={1.5} opacity={0.3} />
            </Group>

            {exportSuccess && (
              <Alert color="green" title="Export erfolgreich">
                Ihre Daten wurden als JSON-Datei heruntergeladen.
              </Alert>
            )}

            {importSuccess && (
              <Alert color="green" title="Import erfolgreich">
                Alle Daten wurden erfolgreich importiert. Die Seite wird aktualisiert...
              </Alert>
            )}

            {importError && (
              <Alert color="red" title="Import fehlgeschlagen">
                {importError}
              </Alert>
            )}

            <Text size="sm">
              <strong>Exportieren:</strong> Lädt alle Ihre Daten (Kunden, Leistungen,
              Firmenstammdaten, Rechnungen) als JSON-Datei herunter. Speichern Sie diese Datei
              sicher als Backup.
            </Text>

            <Text size="sm">
              <strong>Importieren:</strong> Lädt eine zuvor exportierte JSON-Datei und
              überschreibt alle aktuellen Daten. Achtung: Dies kann nicht rückgängig gemacht
              werden!
            </Text>

            <Group>
              <Button
                leftSection={<IconDownload size={16} />}
                onClick={handleExport}
                color={exportSuccess ? 'green' : 'blue'}
                variant="filled"
              >
                {exportSuccess ? 'Exportiert!' : 'Alle Daten exportieren'}
              </Button>

              <Button
                leftSection={<IconUpload size={16} />}
                onClick={handleImportClick}
                color={importSuccess ? 'green' : 'gray'}
                variant="light"
              >
                {importSuccess ? 'Importiert!' : 'Daten importieren'}
              </Button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </Group>
          </Stack>
        </Paper>

        <Divider />

        {/* Musterdaten */}
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <div>
                <Text fw={600} size="lg">
                  Musterdaten
                </Text>
                <Text size="sm" c="dimmed">
                  Beispieldaten für Schulungen und Tests
                </Text>
              </div>
              <IconDatabase size={32} stroke={1.5} opacity={0.3} />
            </Group>

            <Text size="sm">
              Lädt realistische österreichische Beispieldaten (Firmenstammdaten, Kunden,
              Leistungen, Rechnungen) direkt in die App. Perfekt für Schulungen und zum Testen.
            </Text>

            <Alert color="yellow" title="Achtung">
              Das Laden der Musterdaten überschreibt alle vorhandenen Daten!
            </Alert>

            <Group>
              <Button
                leftSection={<IconDatabase size={16} />}
                onClick={handleLoadSampleData}
                variant="outline"
                color="cyan"
              >
                Musterdaten laden
              </Button>
            </Group>
          </Stack>
        </Paper>

        <Divider />

        {/* Daten zurücksetzen */}
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <div>
                <Text fw={600} size="lg" c="red">
                  Daten zurücksetzen
                </Text>
                <Text size="sm" c="dimmed">
                  Alle Daten unwiderruflich löschen
                </Text>
              </div>
              <IconTrash size={32} stroke={1.5} opacity={0.3} color="red" />
            </Group>

            <Text size="sm">
              Löscht alle Daten (Kunden, Leistungen, Rechnungen, Firmenstammdaten)
              unwiderruflich. Nützlich für Schulungen, um mit einem leeren System neu zu
              beginnen.
            </Text>

            <Alert color="red" title="Warnung">
              Diese Aktion kann nicht rückgängig gemacht werden! Erstellen Sie vorher ein
              Backup.
            </Alert>

            <Group>
              <Button
                leftSection={<IconTrash size={16} />}
                onClick={() => setResetModalOpened(true)}
                variant="outline"
                color="red"
              >
                Alle Daten zurücksetzen
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>

      <ConfirmDeleteModal
        opened={resetModalOpened}
        onClose={() => setResetModalOpened(false)}
        onConfirm={handleResetAllData}
        title="Alle Daten zurücksetzen"
        message="Möchten Sie wirklich ALLE Daten löschen? Dies umfasst alle Kunden, Leistungen, Rechnungen und Firmenstammdaten. Diese Aktion kann nicht rückgängig gemacht werden!"
      />
    </Container>
  );
}
