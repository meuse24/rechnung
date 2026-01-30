import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Title,
  Paper,
  Stack,
  TextInput,
  Textarea,
  Button,
  Group,
  Text,
  Divider,
  Alert,
} from '@mantine/core';
import {
  IconDeviceFloppy,
  IconInfoCircle,
  IconDownload,
  IconUpload,
  IconFileExport,
} from '@tabler/icons-react';
import { CompanySettings } from '@/models/types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/storage/localStorage';
import {
  exportAllData,
  downloadDataAsJson,
  importDataFromFile,
  importAllData,
} from '@/utils/dataExport';

const DEFAULT_SETTINGS: CompanySettings = {
  companyName: '',
  addressLine1: '',
  addressLine2: '',
  postalCode: '',
  city: '',
  countryCode: 'AT',
  phone: '',
  email: '',
  website: '',
  taxId: '',
  vatId: '',
  bankName: '',
  iban: '',
  bic: '',
  accountHolder: '',
  paymentTerms: 'Zahlbar innerhalb von 14 Tagen ohne Abzug.',
  defaultNotes: '',
};

export function SettingsPage() {
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Laden beim Mount
  useEffect(() => {
    const loaded = loadFromStorage<CompanySettings>(
      STORAGE_KEYS.COMPANY_SETTINGS,
      DEFAULT_SETTINGS
    );
    setSettings(loaded);
  }, []);

  const handleSave = () => {
    saveToStorage(STORAGE_KEYS.COMPANY_SETTINGS, settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateField = (field: keyof CompanySettings, value: string) => {
    setSettings({ ...settings, [field]: value });
  };

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

      // Reload settings nach Import
      const loaded = loadFromStorage<CompanySettings>(
        STORAGE_KEYS.COMPANY_SETTINGS,
        DEFAULT_SETTINGS
      );
      setSettings(loaded);

      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
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

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Firmenstammdaten</Title>
          <Button
            leftSection={<IconDeviceFloppy size={16} />}
            onClick={handleSave}
            color={saved ? 'green' : 'blue'}
          >
            {saved ? 'Gespeichert!' : 'Speichern'}
          </Button>
        </Group>

        <Alert icon={<IconInfoCircle size={16} />} title="Hinweis" color="blue">
          Diese Daten erscheinen auf Ihren Rechnungen und werden in allen zukünftigen
          Rechnungen verwendet.
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
              Firmenstammdaten, Rechnung) als JSON-Datei herunter. Speichern Sie diese Datei
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

        {/* Firmenadresse / Briefkopf */}
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Text fw={600} size="lg">
              Firmendaten / Briefkopf
            </Text>

            <TextInput
              label="Firmenname"
              placeholder="Muster GmbH"
              value={settings.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              required
            />

            <TextInput
              label="Adresse (Zeile 1)"
              placeholder="Musterstraße 123"
              value={settings.addressLine1}
              onChange={(e) => updateField('addressLine1', e.target.value)}
              required
            />

            <TextInput
              label="Adresse (Zeile 2)"
              placeholder="Optional: Gebäude, Abteilung, etc."
              value={settings.addressLine2}
              onChange={(e) => updateField('addressLine2', e.target.value)}
            />

            <Group grow>
              <TextInput
                label="Postleitzahl"
                placeholder="1010"
                value={settings.postalCode}
                onChange={(e) => updateField('postalCode', e.target.value)}
                required
              />

              <TextInput
                label="Stadt"
                placeholder="Wien"
                value={settings.city}
                onChange={(e) => updateField('city', e.target.value)}
                required
              />

              <TextInput
                label="Land"
                placeholder="AT"
                value={settings.countryCode}
                onChange={(e) => updateField('countryCode', e.target.value.toUpperCase())}
                required
              />
            </Group>

            <Group grow>
              <TextInput
                label="Telefon"
                placeholder="+43 1 234567"
                value={settings.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />

              <TextInput
                label="E-Mail"
                placeholder="info@firma.at"
                type="email"
                value={settings.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </Group>

            <TextInput
              label="Website"
              placeholder="www.firma.at"
              value={settings.website}
              onChange={(e) => updateField('website', e.target.value)}
            />

            <Group grow>
              <TextInput
                label="Steuernummer"
                placeholder="123/456/78900"
                value={settings.taxId}
                onChange={(e) => updateField('taxId', e.target.value)}
              />

              <TextInput
                label="USt-IdNr."
                placeholder="ATU12345678"
                value={settings.vatId}
                onChange={(e) => updateField('vatId', e.target.value.toUpperCase())}
              />
            </Group>
          </Stack>
        </Paper>

        <Divider />

        {/* Bankverbindung */}
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Text fw={600} size="lg">
              Bankverbindung
            </Text>

            <TextInput
              label="Bank"
              placeholder="Musterbank AG"
              value={settings.bankName}
              onChange={(e) => updateField('bankName', e.target.value)}
            />

            <TextInput
              label="Kontoinhaber"
              placeholder="Muster GmbH"
              value={settings.accountHolder}
              onChange={(e) => updateField('accountHolder', e.target.value)}
            />

            <Group grow>
              <TextInput
                label="IBAN"
                placeholder="AT61 1904 3002 3457 3201"
                value={settings.iban}
                onChange={(e) => updateField('iban', e.target.value.toUpperCase())}
              />

              <TextInput
                label="BIC"
                placeholder="BKAUATWW"
                value={settings.bic}
                onChange={(e) => updateField('bic', e.target.value.toUpperCase())}
              />
            </Group>
          </Stack>
        </Paper>

        <Divider />

        {/* Zahlungsbedingungen */}
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Text fw={600} size="lg">
              Zahlungsbedingungen & Standardtexte
            </Text>

            <Textarea
              label="Zahlungsbedingungen"
              placeholder="Zahlbar innerhalb von 14 Tagen ohne Abzug."
              rows={2}
              value={settings.paymentTerms}
              onChange={(e) => updateField('paymentTerms', e.target.value)}
            />

            <Textarea
              label="Standard-Notizen für Rechnungen"
              placeholder="Optionaler Standard-Text der auf jeder Rechnung erscheint"
              rows={3}
              value={settings.defaultNotes}
              onChange={(e) => updateField('defaultNotes', e.target.value)}
            />
          </Stack>
        </Paper>

        {/* Speichern Button unten */}
        <Group justify="flex-end">
          <Button
            size="lg"
            leftSection={<IconDeviceFloppy size={18} />}
            onClick={handleSave}
            color={saved ? 'green' : 'blue'}
          >
            {saved ? 'Gespeichert!' : 'Speichern'}
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
