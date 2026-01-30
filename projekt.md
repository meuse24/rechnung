# Projekt: Rechnungs-Webapp (Schulungsprojekt)

## Aufgabenstellung

### Rolle
Senior Frontend Engineer und Trainer - Entwicklung einer einfachen Schulungs-Webapp

### Projektziel
Eine kleine Rechnungs-Webapp (Vite + React + TypeScript), bei der man:
1. Kunden und Leistungen (Stundenleistungen) als Stammdaten verwalten kann
2. Firmenstammdaten (Briefkopf, Bankverbindung, Zahlungsbedingungen) hinterlegen kann
3. Eine einzelne Rechnung über ein Formular erstellen kann
4. Die Rechnung als JSON speichern und wieder laden kann
5. Die Rechnung druckbar macht (Browser Print / print-friendly Ansicht)

**Scope bewusst klein halten**: Single Invoice, keine Batch-Erstellung, kein CSV, keine ZIP, kein Server.

## Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **UI**: Mantine v7
- **State**: React useState + useEffect (oder Zustand für erweiterte Übung)
- **Validation**: Optional - einfache Pflichtfeld-Checks
- **Persistence**: LocalStorage (keine DB, kein Backend)
- **Linting**: ESLint mit TypeScript & React Hooks Plugins
- **Build**: Single-File Build (vite-plugin-singlefile) - nur index.html im dist-Ordner

## Datenmodelle

### Customer (Kunde)
```typescript
{
  id: string;
  name: string;
  addressLine1: string;
  postalCode: string;
  city: string;
  countryCode: string;
  email?: string;
}
```

### Service (Leistung)
```typescript
{
  id: string;
  name: string;           // z.B. "Beratung"
  hourlyRate: number;     // EUR pro Stunde
  taxRate: number;        // z.B. 20 (für 20%)
}
```

### Invoice (Rechnung)
```typescript
{
  id: string;
  invoiceNumber: string;
  issueDate: string;      // YYYY-MM-DD
  customerId: string;
  lines: InvoiceLine[];
  notes?: string;
}

interface InvoiceLine {
  serviceId: string;
  hours: number;
  note?: string;
}
```

## Berechnungslogik

- **lineNet** = hours × hourlyRate
- **netTotal** = Sum(lineNet)
- **taxTotal** = Sum(lineNet × taxRate/100) pro Line
- **grossTotal** = netTotal + taxTotal
- Runden auf 2 Dezimalstellen

## Screens / Seiten

### 1. Kunden-Seite
- Liste aller Kunden anzeigen
- Kunde hinzufügen/bearbeiten/löschen
- Speichern in LocalStorage als JSON-Liste
- Optional: Export/Import JSON

### 2. Leistungen-Seite
- Liste aller Leistungen anzeigen
- Leistung hinzufügen/bearbeiten/löschen
- Felder: Name, Stundensatz, Steuersatz
- Speichern in LocalStorage als JSON-Liste

### 3. Rechnung-Seite
- Formular:
  - invoiceNumber, issueDate
  - Kunde auswählen (Dropdown aus customers)
  - Positionen: Leistung auswählen, Stunden eingeben
  - Position hinzufügen/entfernen
  - Live Summen anzeigen (Netto/Steuer/Brutto)
- Buttons:
  - "Als JSON speichern" (in LocalStorage)
  - "JSON laden" (aus LocalStorage)
  - "Drucken" (window.print())
- Print-Ansicht: CSS Print Styles

### 4. Einstellungen-Seite (NEU)
- Firmenstammdaten / Briefkopf:
  - Firmenname, Adresse, Kontaktdaten
  - Steuernummer, USt-IdNr.
- Bankverbindung:
  - Bank, IBAN, BIC, Kontoinhaber
- Zahlungsbedingungen:
  - Standard Zahlungstext
  - Standard-Notizen für Rechnungen
- Speichern in LocalStorage
- Daten werden auf gedruckten Rechnungen angezeigt

## LocalStorage Keys

- `invoice_customers`: Liste aller Kunden
- `invoice_services`: Liste aller Leistungen
- `invoice_current`: Aktuelle Rechnung
- `invoice_company_settings`: Firmenstammdaten (NEU)

## Entwicklungsschritte

### ✅ Schritt 1: Projekt-Setup + Navigation (ERLEDIGT)
- [x] Vite Projekt erstellen mit React + TypeScript
- [x] Dependencies installieren (Mantine, React Router)
- [x] Datenmodelle definieren (types.ts)
- [x] LocalStorage Helper (localStorage.ts)
- [x] Berechnungs-Utils (money.ts, calc.ts)
- [x] App-Layout mit Tab-Navigation
- [x] Platzhalter-Seiten für Kunden/Leistungen/Rechnung
- [x] README mit Projektübersicht

**Ergebnis**: Projekt läuft auf http://localhost:5173 mit Navigation

---

### ✅ Schritt 2: Kundenverwaltung (CRUD) (ERLEDIGT)
- [x] State Management für Kundenliste (useState + useEffect)
- [x] Tabelle zur Anzeige aller Kunden
- [x] Modal-Formular zum Hinzufügen/Bearbeiten
- [x] Löschen-Funktion mit Bestätigung
- [x] LocalStorage Integration (laden/speichern)
- [x] Tabler Icons für UI-Elemente

**Komponenten**:
- CustomersPage.tsx - Hauptseite mit Tabelle und CRUD-Funktionen
- CustomerFormModal.tsx - Formular im Modal zum Hinzufügen/Bearbeiten
- ConfirmDeleteModal.tsx - Bestätigungsdialog (wiederverwendbar)

**Features**:
- Kunden werden automatisch beim Mount aus LocalStorage geladen
- Änderungen werden sofort in LocalStorage gespeichert
- Formular-Validierung für Pflichtfelder
- Empty State wenn keine Kunden vorhanden
- Responsive Tabelle mit allen Kundendetails
- Edit/Delete Actions pro Zeile

---

### ✅ Schritt 3: Leistungsverwaltung (CRUD) (ERLEDIGT)
- [x] Analog zu Kundenverwaltung
- [x] Tabelle mit Spalten: Name, Stundensatz, Steuersatz, Brutto/Stunde
- [x] Formular mit Validierung (positive Zahlen, Steuersatz 0-100%)
- [x] LocalStorage Integration
- [x] NumberInput für präzise Zahleneingabe

**Komponenten**:
- ServicesPage.tsx - Hauptseite mit Tabelle und CRUD-Funktionen
- ServiceFormModal.tsx - Formular im Modal mit Zahlen-Validierung

**Features**:
- Leistungen werden automatisch beim Mount aus LocalStorage geladen
- Änderungen werden sofort in LocalStorage gespeichert
- NumberInput mit Euro/Prozent Suffix
- Validierung: Stundensatz > 0, Steuersatz 0-100%
- Zusätzliche Spalte: Brutto/Stunde (berechnet mit Steuersatz)
- Badge für visuell ansprechende Steuersatz-Darstellung
- formatCurrency für konsistente Währungsformatierung
- Empty State wenn keine Leistungen vorhanden

---

### ✅ Schritt 4: Rechnungsformular (ERLEDIGT)
- [x] Formular mit invoiceNumber, issueDate
- [x] Dropdown für Kundenauswahl mit Suchfunktion
- [x] Dynamische Positionsliste
- [x] Dropdown für Leistungsauswahl pro Position
- [x] Stunden-Input pro Position (NumberInput)
- [x] Live-Berechnung der Summen (Netto/Steuer/Brutto)
- [x] LocalStorage Integration
- [x] Notizen/Zahlungshinweise Feld
- [x] Kundendetails-Vorschau

**Komponente**:
- InvoicePage.tsx - Vollständiges Rechnungsformular

**Features**:
- Automatisches Laden von Kunden und Leistungen aus LocalStorage
- Dynamisches Hinzufügen/Entfernen von Positionen
- Live-Berechnung mit calculateInvoiceTotals Utility
- Searchable Dropdowns für Kunden und Leistungen
- Kundendetails werden beim Auswählen angezeigt
- Leistungen zeigen Stundensatz im Dropdown
- Validierung vor dem Speichern
- Empty State / Info Alert wenn keine Stammdaten vorhanden
- Summen-Übersicht: Netto, Steuer, Brutto
- Position-wise Berechnungen in Tabelle sichtbar

---

### ✅ Schritt 5: JSON Speichern/Laden (ERLEDIGT)
- [x] "Speichern" Button (speichert in LocalStorage)
- [x] "Laden" Button (lädt aus LocalStorage)
- [x] "Neu" Button für neue Rechnung
- [x] Automatisches Laden beim Mount wenn Rechnung gespeichert

**Features**:
- Speichern: Validierung (Rechnungsnummer, Kunde, Positionen)
- Laden: Feedback wenn keine Rechnung gespeichert
- Neue Rechnung: Setzt Formular zurück mit aktuellem Datum
- LocalStorage Key: `invoice_current`
- Bestätigung per Alert nach Speichern/Laden

---

### ✅ Schritt 6: Druckfunktion (ERLEDIGT)
- [x] InvoicePrintView Komponente
- [x] CSS @media print Styles
- [x] "Drucken" Button (window.print())
- [x] Print-Layout: Navigation ausblenden, nur Rechnung anzeigen

**Komponenten & Dateien**:
- InvoicePrintView.tsx - Formatierte Rechnungsansicht für Druck
- print.css - CSS @media print Styles

**Features**:
- InvoicePrintView zeigt professionell formatierte Rechnung
- Vollständige Rechnungsdetails: Header, Kunde, Positionen, Summen
- @media print Styles blenden Navigation und Formular aus
- Nur InvoicePrintView wird beim Drucken angezeigt
- Optimierte Typografie für Druck (12pt, Seitenumbrüche)
- Tabellen-Styling für sauberen Druck
- Hintergrundfarben werden beim Drucken entfernt
- Seitenränder: 2cm
- .no-print Klasse für Elemente die nicht gedruckt werden sollen
- .print-only Klasse für Print-View (nur beim Drucken sichtbar)
- window.print() im "Drucken" Button implementiert

---

### ✅ Schritt 7: Firmenstammdaten / Einstellungen (ERLEDIGT)
- [x] CompanySettings Datenmodell erstellt
- [x] SettingsPage implementiert
- [x] Navigation um "Einstellungen" Tab erweitert
- [x] LocalStorage Integration (COMPANY_SETTINGS Key)
- [x] InvoicePrintView erweitert um Firmendaten anzuzeigen

**Komponente**:
- SettingsPage.tsx - Firmenstammdaten-Verwaltung

**Features**:
- **Datensicherung (NEU)**:
  - Export aller Daten (Kunden, Leistungen, Firmendaten, Rechnung) als JSON-Datei
  - Import von JSON-Backup-Dateien
  - Validierung beim Import
  - Visuelles Feedback (Erfolg/Fehler)
  - Ermöglicht Backup und Migration zwischen Browsern/Rechnern
- Formular für Firmendaten / Briefkopf
  - Firmenname, Adresse (2 Zeilen), PLZ, Stadt, Land
  - Telefon, E-Mail, Website
  - Steuernummer, USt-IdNr.
- Formular für Bankverbindung
  - Bank, Kontoinhaber, IBAN, BIC
- Formular für Zahlungsbedingungen
  - Standard-Zahlungstext
  - Standard-Notizen für Rechnungen
- Speichern in LocalStorage
- InvoicePrintView zeigt Firmendaten im Header
- InvoicePrintView zeigt Zahlungsbedingungen am Ende
- InvoicePrintView zeigt Bankverbindung am Ende
- Visuelles Feedback nach Speichern (Button färbt sich grün)
- Standard-Land ist AT (Österreich)
- Platzhalter-Texte sind auf österreichische Beispiele angepasst

**Datenmodell**:
```typescript
interface CompanySettings {
  // Briefkopf / Header
  companyName: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  countryCode: string;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  vatId?: string;

  // Bankverbindung
  bankName?: string;
  iban?: string;
  bic?: string;
  accountHolder?: string;

  // Zahlungsbedingungen
  paymentTerms?: string;
  defaultNotes?: string;
}

interface ExportData {
  version: string;
  exportDate: string;
  customers: Customer[];
  services: Service[];
  companySettings: CompanySettings | null;
  currentInvoice: Invoice | null;
}
```

**Export/Import Utilities**:
- `dataExport.ts` - Utility-Funktionen für Backup
  - `exportAllData()`: Sammelt alle Daten aus LocalStorage
  - `downloadDataAsJson()`: Erstellt Download-Link für JSON-Datei
  - `importDataFromFile()`: Liest und validiert JSON-Datei
  - `validateImportData()`: Prüft Datenformat
  - `importAllData()`: Schreibt Daten in LocalStorage

---

### ✅ Schritt 8: Hilfe & Anleitung (ERLEDIGT)
- [x] HelpPage mit ausführlicher Anleitung erstellt
- [x] Hilfe-Button rechts in der Menüzeile hinzugefügt
- [x] Route /help eingerichtet
- [x] Accordion für strukturierte Darstellung
- [x] FAQ-Bereich hinzugefügt

**Komponente**:
- HelpPage.tsx - Umfassende Schritt-für-Schritt Anleitung

**Features**:
- Schnellstart-Guide für neue Benutzer
- Detaillierte Anleitungen für alle Features:
  - Einstellungen (Firmendaten, Datensicherung)
  - Kundenverwaltung (Hinzufügen, Bearbeiten, Löschen)
  - Leistungsverwaltung (Stundensätze, Steuersätze)
  - Rechnung erstellen (Schritt-für-Schritt)
  - Drucken / PDF speichern
  - Backup & Migration
- FAQ-Bereich mit häufig gestellten Fragen
- Technische Hinweise (Browser, Speicher, Offline-Nutzung)
- Strukturiert mit Accordion-Komponenten
- Visuelle Icons für jeden Bereich
- Code-Beispiele und Hervorhebungen
- Sicherheitshinweise prominent platziert

**UI-Integration**:
- Hilfe-Button mit Fragezeichen-Icon rechts neben den Tabs
- Tooltip "Hilfe & Anleitung"
- Klick öffnet vollständige Hilfe-Seite
- Navigation erfolgt via React Router

---

### ✅ Schritt 9: Single-File Build (ERLEDIGT)
- [x] vite-plugin-singlefile installiert
- [x] vite.config.ts konfiguriert
- [x] Build erstellt nur noch index.html (keine separaten CSS/JS-Dateien)
- [x] Komma-Eingabe für Zahlen (DE/AT Format)

**Plugin**:
- vite-plugin-singlefile

**Features**:
- **Single-File Output**: Build erstellt nur noch eine index.html
- **Inline Assets**: Alle CSS und JavaScript sind in die HTML eingebettet
- **Einfaches Deployment**: Nur 1 Datei muss hochgeladen werden
- **Größe**: 661.58 kB (gzip: 171.58 kB)
- **Komma als Dezimaltrennzeichen**: Zahlen können mit Komma eingegeben werden
  - Stunden: 8,5 statt 8.5
  - Stundensatz: 80,00 €
  - Steuersatz: 20,0 %
  - Tausendertrennzeichen: Punkt (1.234,56)

**Vorteile**:
- Keine Probleme mit relativen Pfaden
- Einfacher zu hosten (statisches Hosting)
- Kann offline verwendet werden
- Perfekt für Single-Page Applications
- Ideal für Portable Apps (USB-Stick, Email-Versand)

**Konfiguration**:
```typescript
// vite.config.ts
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  // ...
})
```

---

## Akzeptanzkriterien (Definition of Done)

- [x] Projekt läuft und ist navigierbar
- [x] Kundenliste editierbar und persistent (LocalStorage)
- [x] Leistungsliste editierbar und persistent (LocalStorage)
- [x] Firmenstammdaten editierbar und persistent (LocalStorage)
- [x] Export/Import aller Daten als JSON-Backup funktioniert
- [x] Rechnung: Kunde + Leistungen auswählbar, Stunden eingeben
- [x] Summen korrekt berechnet (Netto/Steuer/Brutto)
- [x] Rechnung als JSON speicherbar und wieder ladbar
- [x] Druck funktioniert mit Firmendaten, Zahlungsbedingungen, Bankverbindung
- [x] Hilfe & Anleitung vollständig und verständlich
- [x] Code ist gut strukturiert und verständlich (Schulungszweck)
- [x] README dokumentiert alle Features

---

## Projektstruktur

```
src/
├── app/
│   └── Layout.tsx              # App-Layout mit Tab-Navigation + Hilfe-Button
├── pages/
│   ├── SettingsPage.tsx        # Firmenstammdaten + Datensicherung
│   ├── CustomersPage.tsx       # Kundenverwaltung
│   ├── ServicesPage.tsx        # Leistungsverwaltung
│   ├── InvoicePage.tsx         # Rechnungsformular
│   └── HelpPage.tsx            # Hilfe & Anleitung (NEU)
├── components/
│   ├── CustomerFormModal.tsx   # Kunde hinzufügen/bearbeiten
│   ├── ServiceFormModal.tsx    # Leistung hinzufügen/bearbeiten
│   ├── ConfirmDeleteModal.tsx  # Bestätigungsdialog
│   └── InvoicePrintView.tsx    # Druckansicht mit Firmendaten
├── models/
│   └── types.ts                # TypeScript Datenmodelle
├── storage/
│   └── localStorage.ts         # LocalStorage Helper
├── utils/
│   ├── money.ts                # Geld-Formatierung
│   ├── calc.ts                 # Rechnungs-Berechnungen
│   └── dataExport.ts           # Export/Import Utilities
├── print.css                   # Print Styles
├── App.tsx                     # Root Component
└── main.tsx                    # Entry Point
```

---

## Lernziele für Teilnehmer

1. **React Grundlagen**: Komponenten, Props, State, Hooks
2. **TypeScript**: Typisierung, Interfaces, Type Safety
3. **State Management**: useState, useEffect, Daten-Flow
4. **Formular-Handling**: Controlled Components, Validation
5. **UI Library nutzen**: Mantine Components
6. **Browser APIs**: LocalStorage, window.print()
7. **Berechnungslogik**: Funktionen auslagern, testen
8. **Code-Organisation**: Ordnerstruktur, Separation of Concerns

---

## Projekt-Zusammenfassung

**Status**: ✅ VOLLSTÄNDIG ABGESCHLOSSEN

Alle 8 Entwicklungsschritte wurden erfolgreich implementiert:
- ✅ Schritt 1: Projekt-Setup + Navigation
- ✅ Schritt 2: Kundenverwaltung (CRUD)
- ✅ Schritt 3: Leistungsverwaltung (CRUD)
- ✅ Schritt 4: Rechnungsformular
- ✅ Schritt 5: JSON Speichern/Laden
- ✅ Schritt 6: Druckfunktion
- ✅ Schritt 7: Firmenstammdaten / Einstellungen
- ✅ Schritt 8: Hilfe & Anleitung

**Alle Akzeptanzkriterien erfüllt** ✅

### Technische Highlights

1. **Saubere Architektur**: Separation of Concerns (Pages, Components, Utils, Models)
2. **Type-Safe**: Vollständige TypeScript Typisierung
3. **Wiederverwendbare Komponenten**: Modals, Form Components
4. **Utility Functions**: money.ts, calc.ts, dataExport.ts für Berechnungen & Backup
5. **LocalStorage Integration**: Persistierung aller Daten
6. **Export/Import System**: Backup und Migration zwischen Browsern/Rechnern
7. **Browser APIs**: File Download, FileReader, Blob/URL handling
8. **Responsive UI**: Mantine Components
9. **Print-Optimierung**: CSS @media print für professionellen Druck mit Firmendaten
10. **Code-Qualität**: ESLint Integration
11. **Benutzerfreundlichkeit**: Umfassende Hilfe & Anleitung integriert

### Statistik

- **Seiten**: 5 (Einstellungen, Kunden, Leistungen, Rechnung, Hilfe)
- **Komponenten**: 4 wiederverwendbare Components
- **Utils**: 4 Utility-Module (money, calc, dataExport, localStorage)
- **Datenmodelle**: 6 TypeScript Interfaces (Customer, Service, Invoice, InvoiceLine, CompanySettings, ExportData)
- **Dependencies**: Minimal (React, Mantine, Router, ESLint, vite-plugin-singlefile)
- **Build Output**: Single-File (nur index.html) - 661.58 kB (gzip: 171.58 kB)
  - Alle CSS und JavaScript inline eingebettet
  - Keine separaten Asset-Dateien
  - Einfach zu deployen: nur 1 Datei

### Code-Qualität & Linting

**ESLint ist installiert und konfiguriert:**

```bash
npm run lint
```

**Konfiguration:**
- ESLint v9 (Flat Config)
- TypeScript ESLint
- React Hooks Rules
- React Refresh Plugin

**Features:**
- Type-safe Code-Prüfung
- React Hooks Best Practices
- Automatische Warnung bei ungenutzten Variablen
- Konfiguriert für Schulungszwecke (nicht zu streng)

**Konfigurationsdatei:** `eslint.config.js`

---

### Nächste Schritte (Optional für erweiterte Schulung)

1. **Testing**: Unit Tests für calc.ts und money.ts
2. **Export**: JSON Download/Upload Funktionalität
3. **PDF Export**: Bibliothek wie jsPDF integrieren
4. **Mehrere Rechnungen**: Liste aller Rechnungen verwalten
5. **Validierung**: Zod für Schema-Validierung
6. **State Management**: Zustand für globalen State
