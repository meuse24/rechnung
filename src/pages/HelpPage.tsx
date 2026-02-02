import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  List,
  ThemeIcon,
  Divider,
  Accordion,
  Alert,
  Code,
} from '@mantine/core';
import {
  IconSettings,
  IconUsers,
  IconFileInvoice,
  IconPrinter,
  IconDownload,
  IconInfoCircle,
  IconCheck,
} from '@tabler/icons-react';

export function HelpPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">
            Hilfe & Anleitung
          </Title>
          <Text c="dimmed">
            Willkommen zur Rechnungs-Webapp! Diese Anleitung führt Sie Schritt für Schritt durch
            alle Funktionen.
          </Text>
        </div>

        <Alert icon={<IconInfoCircle size={16} />} title="Wichtiger Hinweis" color="blue">
          Alle Daten werden nur in Ihrem Browser gespeichert (LocalStorage). Vergessen Sie nicht,
          regelmäßig ein <strong>Backup</strong> zu erstellen!
        </Alert>

        {/* Schnellstart */}
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Title order={2}>
              <IconCheck style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Schnellstart
            </Title>
            <Text>Folgen Sie diesen Schritten für Ihre erste Rechnung:</Text>
            <List spacing="sm">
              <List.Item>
                <strong>1. Stammdaten:</strong> Firmendaten, Bankverbindung und
                Zahlungsbedingungen eingeben
              </List.Item>
              <List.Item>
                <strong>2. Kunden:</strong> Mindestens einen Kunden anlegen
              </List.Item>
              <List.Item>
                <strong>3. Leistungen:</strong> Ihre Stundenleistungen mit Preisen hinterlegen
              </List.Item>
              <List.Item>
                <strong>4. Rechnung:</strong> Erste Rechnung erstellen und als PDF exportieren
              </List.Item>
              <List.Item>
                <strong>5. Daten:</strong> Backup erstellen und sicher speichern
              </List.Item>
            </List>
            <Alert color="cyan" mt="md">
              <strong>Tipp für Schulungen:</strong> Im Menü "Daten" können Sie mit einem Klick
              Musterdaten laden oder alle Daten zurücksetzen.
            </Alert>
          </Stack>
        </Paper>

        {/* Detaillierte Anleitung */}
        <Divider label="Detaillierte Anleitung" labelPosition="center" />

        <Accordion defaultValue="settings">
          {/* Stammdaten */}
          <Accordion.Item value="settings">
            <Accordion.Control
              icon={
                <ThemeIcon variant="light" color="blue">
                  <IconSettings size={18} />
                </ThemeIcon>
              }
            >
              <Text fw={600}>1. Stammdaten (Firmendaten)</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <Text>
                  <strong>Zweck:</strong> Hinterlegen Sie hier Ihre Firmendaten, die auf allen
                  Rechnungen erscheinen.
                </Text>

                <Title order={4}>Firmendaten / Briefkopf</Title>
                <List>
                  <List.Item>
                    <strong>Firmenname:</strong> Erscheint prominent auf der Rechnung
                  </List.Item>
                  <List.Item>
                    <strong>Adresse:</strong> Ihre vollständige Geschäftsadresse
                  </List.Item>
                  <List.Item>
                    <strong>Kontaktdaten:</strong> Telefon, E-Mail, Website (optional)
                  </List.Item>
                  <List.Item>
                    <strong>Steuernr./USt-IdNr.:</strong> Wichtig für rechtsgültige Rechnungen
                  </List.Item>
                </List>

                <Title order={4}>Bankverbindung</Title>
                <List>
                  <List.Item>
                    Ihre IBAN, BIC und Bankname erscheinen am Ende jeder Rechnung
                  </List.Item>
                  <List.Item>Kontoinhaber sollte mit Ihrem Firmennamen übereinstimmen</List.Item>
                </List>

                <Title order={4}>Zahlungsbedingungen</Title>
                <List>
                  <List.Item>
                    Standard-Text: z.B. "Zahlbar innerhalb von 14 Tagen ohne Abzug"
                  </List.Item>
                  <List.Item>Dieser Text erscheint automatisch auf allen Rechnungen</List.Item>
                </List>

                <Alert color="yellow" mt="md">
                  Speichern Sie Ihre Einstellungen mit dem <strong>Speichern-Button</strong> oben
                  rechts!
                </Alert>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Kunden */}
          <Accordion.Item value="customers">
            <Accordion.Control
              icon={
                <ThemeIcon variant="light" color="green">
                  <IconUsers size={18} />
                </ThemeIcon>
              }
            >
              <Text fw={600}>2. Kundenverwaltung</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <Text>
                  <strong>Zweck:</strong> Verwalten Sie Ihre Kundendaten zentral an einem Ort.
                </Text>

                <Title order={4}>Kunde hinzufügen</Title>
                <List>
                  <List.Item>
                    Klicken Sie auf <strong>"Neuer Kunde"</strong>
                  </List.Item>
                  <List.Item>Füllen Sie alle Pflichtfelder aus (Name, Adresse, PLZ, Stadt)</List.Item>
                  <List.Item>E-Mail ist optional, aber empfohlen</List.Item>
                  <List.Item>
                    Klicken Sie <strong>"Hinzufügen"</strong> - fertig!
                  </List.Item>
                </List>

                <Title order={4}>Kunde bearbeiten</Title>
                <List>
                  <List.Item>
                    Klicken Sie auf das <strong>Stift-Symbol</strong> neben dem Kunden
                  </List.Item>
                  <List.Item>Ändern Sie die gewünschten Daten</List.Item>
                  <List.Item>
                    Klicken Sie <strong>"Speichern"</strong>
                  </List.Item>
                </List>

                <Title order={4}>Kunde löschen</Title>
                <List>
                  <List.Item>
                    Klicken Sie auf das <strong>Papierkorb-Symbol</strong>
                  </List.Item>
                  <List.Item>Bestätigen Sie die Sicherheitsabfrage</List.Item>
                  <List.Item>
                    <strong>Achtung:</strong> Gelöschte Kunden können nicht wiederhergestellt
                    werden!
                  </List.Item>
                </List>

                <Alert color="blue" mt="md">
                  Alle Änderungen werden automatisch in Ihrem Browser gespeichert (LocalStorage).
                </Alert>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Leistungen */}
          <Accordion.Item value="services">
            <Accordion.Control
              icon={
                <ThemeIcon variant="light" color="orange">
                  <IconFileInvoice size={18} />
                </ThemeIcon>
              }
            >
              <Text fw={600}>3. Leistungsverwaltung</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <Text>
                  <strong>Zweck:</strong> Definieren Sie Ihre Stundenleistungen mit Preisen und
                  Steuersätzen.
                </Text>

                <Title order={4}>Leistung hinzufügen</Title>
                <List>
                  <List.Item>
                    Klicken Sie auf <strong>"Neue Leistung"</strong>
                  </List.Item>
                  <List.Item>
                    <strong>Name:</strong> z.B. "Beratung", "Entwicklung", "Training"
                  </List.Item>
                  <List.Item>
                    <strong>Stundensatz:</strong> Ihr Preis pro Stunde in EUR (z.B. 80,00)
                  </List.Item>
                  <List.Item>
                    <strong>Steuersatz:</strong> Meist 20% in Österreich (Eingabe: 20)
                  </List.Item>
                  <List.Item>
                    Die Spalte <strong>"Brutto/Stunde"</strong> wird automatisch berechnet
                  </List.Item>
                </List>

                <Title order={4}>Beispiel</Title>
                <Paper p="sm" bg="gray.0">
                  <List>
                    <List.Item>Name: "Beratung"</List.Item>
                    <List.Item>Stundensatz: 80,00 €</List.Item>
                    <List.Item>Steuersatz: 20%</List.Item>
                    <List.Item>→ Brutto/Stunde: 96,00 €</List.Item>
                  </List>
                </Paper>

                <Alert color="green" mt="md">
                  Sie können beliebig viele verschiedene Leistungen anlegen - z.B. für
                  unterschiedliche Tätigkeiten oder Projektstufen.
                </Alert>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Rechnung erstellen */}
          <Accordion.Item value="invoice">
            <Accordion.Control
              icon={
                <ThemeIcon variant="light" color="violet">
                  <IconFileInvoice size={18} />
                </ThemeIcon>
              }
            >
              <Text fw={600}>4. Rechnung erstellen</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <Text>
                  <strong>Zweck:</strong> Erstellen Sie professionelle Rechnungen mit wenigen
                  Klicks.
                </Text>

                <Title order={4}>Schritt 1: Kopfdaten</Title>
                <List>
                  <List.Item>
                    <strong>Rechnungsnummer:</strong> z.B. "RE-2024-001" (frei wählbar)
                  </List.Item>
                  <List.Item>
                    <strong>Rechnungsdatum:</strong> Wird automatisch auf heute gesetzt
                  </List.Item>
                  <List.Item>
                    <strong>Kunde auswählen:</strong> Wählen Sie einen Kunden aus Ihrer Liste
                  </List.Item>
                </List>

                <Title order={4}>Schritt 2: Positionen hinzufügen</Title>
                <List>
                  <List.Item>
                    Klicken Sie <strong>"Position hinzufügen"</strong>
                  </List.Item>
                  <List.Item>Wählen Sie eine Leistung aus dem Dropdown</List.Item>
                  <List.Item>Geben Sie die Anzahl der Stunden ein</List.Item>
                  <List.Item>
                    Der <strong>Betrag wird automatisch berechnet</strong>
                  </List.Item>
                  <List.Item>Wiederholen Sie dies für weitere Positionen</List.Item>
                </List>

                <Title order={4}>Schritt 3: Summen prüfen</Title>
                <List>
                  <List.Item>
                    <strong>Nettobetrag:</strong> Summe aller Positionen ohne Steuer
                  </List.Item>
                  <List.Item>
                    <strong>Mehrwertsteuer:</strong> Wird automatisch berechnet
                  </List.Item>
                  <List.Item>
                    <strong>Gesamtbetrag:</strong> Endpreis inkl. Steuer
                  </List.Item>
                </List>

                <Title order={4}>Schritt 4: Speichern & Drucken</Title>
                <List>
                  <List.Item>
                    <strong>"Speichern":</strong> Rechnung in Browser speichern (wird automatisch
                    beim nächsten Besuch geladen)
                  </List.Item>
                  <List.Item>
                    <strong>"Laden":</strong> Gespeicherte Rechnung wiederherstellen
                  </List.Item>
                  <List.Item>
                    <strong>"Drucken":</strong> Öffnet Druck-Dialog (oder "Als PDF speichern")
                  </List.Item>
                  <List.Item>
                    <strong>"Neu":</strong> Leert das Formular für eine neue Rechnung
                  </List.Item>
                </List>

                <Alert color="violet" mt="md">
                  Die Druckansicht enthält automatisch Ihre Firmendaten, Bankverbindung und
                  Zahlungsbedingungen aus den Einstellungen!
                </Alert>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Drucken & PDF */}
          <Accordion.Item value="print">
            <Accordion.Control
              icon={
                <ThemeIcon variant="light" color="red">
                  <IconPrinter size={18} />
                </ThemeIcon>
              }
            >
              <Text fw={600}>5. Rechnung drucken / als PDF speichern</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <Text>
                  <strong>Zweck:</strong> Erstellen Sie eine druckfertige oder PDF-Version Ihrer
                  Rechnung.
                </Text>

                <Title order={4}>Drucken</Title>
                <List>
                  <List.Item>
                    Klicken Sie auf <strong>"Drucken"</strong> im Rechnungsformular
                  </List.Item>
                  <List.Item>Der Browser-Druckdialog öffnet sich</List.Item>
                  <List.Item>
                    Wählen Sie Ihren <strong>Drucker</strong> oder <strong>"Als PDF speichern"</strong>
                  </List.Item>
                  <List.Item>Nur die Rechnung wird gedruckt - ohne Navigation und Buttons</List.Item>
                </List>

                <Title order={4}>Was wird gedruckt?</Title>
                <Paper p="sm" bg="gray.0">
                  <List>
                    <List.Item>✓ Ihr Firmenkopf (Name, Adresse, Kontakt, Steuer-IDs)</List.Item>
                    <List.Item>✓ Rechnungsnummer und Datum</List.Item>
                    <List.Item>✓ Kundenadresse</List.Item>
                    <List.Item>✓ Alle Positionen mit Preisen</List.Item>
                    <List.Item>✓ Summen (Netto, MwSt., Brutto)</List.Item>
                    <List.Item>✓ Notizen/Hinweise</List.Item>
                    <List.Item>✓ Zahlungsbedingungen</List.Item>
                    <List.Item>✓ Bankverbindung (IBAN, BIC)</List.Item>
                  </List>
                </Paper>

                <Title order={4}>Tipps für PDF</Title>
                <List>
                  <List.Item>
                    Bei "Ziel" wählen Sie <strong>"Als PDF speichern"</strong>
                  </List.Item>
                  <List.Item>
                    Kontrollieren Sie die Vorschau bevor Sie speichern
                  </List.Item>
                  <List.Item>PDFs können Sie per E-Mail versenden</List.Item>
                </List>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Datenverwaltung */}
          <Accordion.Item value="backup">
            <Accordion.Control
              icon={
                <ThemeIcon variant="light" color="teal">
                  <IconDownload size={18} />
                </ThemeIcon>
              }
            >
              <Text fw={600}>6. Datenverwaltung (Menü "Daten")</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <Text>
                  <strong>Wichtig:</strong> Da alle Daten nur in Ihrem Browser gespeichert werden,
                  sollten Sie regelmäßig Backups erstellen!
                </Text>

                <Title order={4}>Daten exportieren (Backup)</Title>
                <List>
                  <List.Item>
                    Gehen Sie zu <strong>Daten</strong> (erster Menüpunkt)
                  </List.Item>
                  <List.Item>
                    Klicken Sie <strong>"Alle Daten exportieren"</strong>
                  </List.Item>
                  <List.Item>
                    Eine JSON-Datei wird heruntergeladen (z.B.{' '}
                    <Code>invoice-backup-2024-01-30.json</Code>)
                  </List.Item>
                  <List.Item>
                    Speichern Sie diese Datei sicher (Cloud, USB-Stick, externe Festplatte)
                  </List.Item>
                </List>

                <Title order={4}>Daten importieren (Wiederherstellen)</Title>
                <List>
                  <List.Item>
                    Gehen Sie zu <strong>Daten</strong>
                  </List.Item>
                  <List.Item>
                    Klicken Sie <strong>"Daten importieren"</strong>
                  </List.Item>
                  <List.Item>Wählen Sie Ihre gespeicherte JSON-Datei</List.Item>
                  <List.Item>
                    <strong>Alle Daten werden wiederhergestellt</strong> (überschreibt aktuelle
                    Daten!)
                  </List.Item>
                </List>

                <Title order={4}>Musterdaten laden (für Schulungen)</Title>
                <List>
                  <List.Item>
                    Klicken Sie <strong>"Musterdaten laden"</strong>
                  </List.Item>
                  <List.Item>
                    Lädt österreichische Beispieldaten: Firma, Kunden, Leistungen, Rechnungen
                  </List.Item>
                  <List.Item>
                    <strong>Achtung:</strong> Überschreibt alle vorhandenen Daten!
                  </List.Item>
                </List>

                <Title order={4}>Alle Daten zurücksetzen</Title>
                <List>
                  <List.Item>
                    Klicken Sie <strong>"Alle Daten zurücksetzen"</strong>
                  </List.Item>
                  <List.Item>Löscht alle Kunden, Leistungen, Rechnungen und Stammdaten</List.Item>
                  <List.Item>Ideal für Schulungen: Neustart mit leerem System</List.Item>
                </List>

                <Title order={4}>Was wird gesichert?</Title>
                <Paper p="sm" bg="gray.0">
                  <List>
                    <List.Item>✓ Alle Kunden</List.Item>
                    <List.Item>✓ Alle Leistungen</List.Item>
                    <List.Item>✓ Firmenstammdaten</List.Item>
                    <List.Item>✓ Alle Rechnungen</List.Item>
                  </List>
                </Paper>

                <Alert color="red" mt="md" title="Wichtiger Sicherheitshinweis">
                  <strong>Erstellen Sie vor dem Import oder Reset ein Backup!</strong>{' '}
                  Diese Aktionen überschreiben alle vorhandenen Daten und können nicht rückgängig
                  gemacht werden.
                </Alert>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        {/* Häufige Fragen */}
        <Divider label="Häufig gestellte Fragen (FAQ)" labelPosition="center" />

        <Paper p="md" withBorder>
          <Stack gap="md">
            <Title order={3}>FAQ</Title>

            <div>
              <Text fw={600} mb="xs">
                Q: Kann ich mehrere Rechnungen gleichzeitig verwalten?
              </Text>
              <Text size="sm">
                A: Ja! Unter "Rechnungen" finden Sie eine vollständige Übersicht aller Ihrer
                Rechnungen. Sie können beliebig viele Rechnungen erstellen, bearbeiten, duplizieren
                und mit Status versehen (Entwurf, Versendet, Bezahlt, Storniert).
              </Text>
            </div>

            <Divider />

            <div>
              <Text fw={600} mb="xs">
                Q: Sind meine Daten sicher?
              </Text>
              <Text size="sm">
                A: Alle Daten werden nur lokal in Ihrem Browser gespeichert (LocalStorage). Sie
                werden nicht an Server übertragen. Erstellen Sie aber unbedingt regelmäßig Backups!
              </Text>
            </div>

            <Divider />

            <div>
              <Text fw={600} mb="xs">
                Q: Kann ich von einem anderen Rechner darauf zugreifen?
              </Text>
              <Text size="sm">
                A: Nein, direkt nicht. Aber Sie können Ihre Daten exportieren und auf dem anderen
                Rechner importieren (siehe "Datensicherung & Migration").
              </Text>
            </div>

            <Divider />

            <div>
              <Text fw={600} mb="xs">
                Q: Was passiert, wenn ich meinen Browser-Cache lösche?
              </Text>
              <Text size="sm">
                A: Alle Daten gehen verloren! Deshalb ist es wichtig, regelmäßig Backups zu
                erstellen (Daten exportieren).
              </Text>
            </div>

            <Divider />

            <div>
              <Text fw={600} mb="xs">
                Q: Kann ich die Rechnungsvorlage anpassen?
              </Text>
              <Text size="sm">
                A: Die grundlegende Struktur ist fest. Sie können aber in den Einstellungen Ihre
                Firmendaten, Zahlungsbedingungen und Notizen anpassen, die auf der Rechnung
                erscheinen.
              </Text>
            </div>

            <Divider />

            <div>
              <Text fw={600} mb="xs">
                Q: Kann ich die App auf meinem eigenen Webserver hosten?
              </Text>
              <Text size="sm">
                A: Ja! Führen Sie <Code>npm run build</Code> aus und laden Sie den kompletten{' '}
                <Code>dist/</Code> Ordner auf Ihren Webserver hoch. Die App funktioniert auf jedem
                statischen Webserver ohne spezielle Konfiguration.
              </Text>
            </div>

            <Divider />

            <div>
              <Text fw={600} mb="xs">
                Q: Warum sehen die URLs so komisch aus (mit #)?
              </Text>
              <Text size="sm">
                A: Die App verwendet Hash-basierte URLs (z.B. <Code>/#/invoices</Code>), damit sie
                auf jedem Webserver funktioniert - ohne Server-seitige Konfiguration. Das ist
                technisch bedingt und beeinträchtigt die Funktionalität nicht.
              </Text>
            </div>

            <Divider />

            <div>
              <Text fw={600} mb="xs">
                Q: Die App lädt langsam - was kann ich tun?
              </Text>
              <Text size="sm">
                A: Beim ersten Laden werden ca. 2 MB an Daten übertragen. Danach cached Ihr Browser
                die Dateien und die App startet schneller. Stellen Sie sicher, dass Ihr Webserver
                Gzip-Komprimierung aktiviert hat (reduziert auf ca. 700 KB).
              </Text>
            </div>

            <Divider />

            <div>
              <Text fw={600} mb="xs">
                Q: Funktioniert die App auch offline?
              </Text>
              <Text size="sm">
                A: Ja, nach dem ersten Laden funktioniert die App komplett offline. Alle Daten
                werden lokal in Ihrem Browser gespeichert. Sie benötigen nur Internet, um die App
                initial zu laden oder Updates zu erhalten.
              </Text>
            </div>
          </Stack>
        </Paper>

        {/* Technische Hinweise */}
        <Paper p="md" withBorder bg="gray.0">
          <Stack gap="sm">
            <Title order={4}>Technische Hinweise</Title>
            <List size="sm">
              <List.Item>
                <strong>Browser:</strong> Chrome 90+, Firefox 85+, Safari 14+, Edge 90+
              </List.Item>
              <List.Item>
                <strong>Speicher:</strong> LocalStorage (ca. 5-10 MB Limit)
              </List.Item>
              <List.Item>
                <strong>Offline:</strong> App funktioniert komplett offline nach dem ersten Laden
              </List.Item>
              <List.Item>
                <strong>Updates:</strong> Laden Sie die Seite neu (F5 oder Strg+Shift+R) um Updates zu erhalten
              </List.Item>
              <List.Item>
                <strong>Dateigröße:</strong> Ca. 2.3 MB (komprimiert: 720 KB mit Gzip)
              </List.Item>
              <List.Item>
                <strong>Hosting:</strong> Funktioniert auf jedem statischen Webserver
              </List.Item>
            </List>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
