# Projekt: Rechnungs-Webapp (Schulungsprojekt)

## Aufgabenstellung

### Rolle
Senior Frontend Engineer und Trainer - Entwicklung einer einfachen Schulungs-Webapp

### Projektziel
Eine kleine Rechnungs-Webapp (Vite + React + TypeScript), bei der man:
1. **Kunden und Leistungen** (Stundenleistungen) als Stammdaten verwalten kann
2. **Firmenstammdaten** (Briefkopf, Bankverbindung, Zahlungsbedingungen) hinterlegen kann
3. **Eine einzelne Rechnung** über ein Formular erstellen kann
4. **Die Rechnung als JSON** speichern und wieder laden kann
5. **Die Rechnung druckbar macht** (Browser Print / print-friendly Ansicht mit Firmendaten)
6. **Vollständiger Datenexport/-import** für Backup und Browser-Migration
7. **Integrierte Hilfe & Anleitung** für alle Funktionen
8. **Österreichische Lokalisierung** (AT als Standard, Komma-Eingabe für Zahlen)
9. **Single-File Build** (nur eine index.html für einfaches Deployment)

**Scope bewusst klein halten**: Single Invoice, keine Batch-Erstellung, kein CSV, keine ZIP, kein Server.

## Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **UI**: Mantine v7
- **Routing**: React Router v6
- **State**: React useState + useEffect
- **Validation**: Einfache Pflichtfeld-Checks + CSV-Validierung
- **Persistence**: LocalStorage (keine DB, kein Backend)
- **CSV Parsing**: papaparse
- **PDF Export**: jsPDF + html2canvas
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

### 1. Einstellungen-Seite
- Firmenstammdaten / Briefkopf:
  - Firmenname, Adresse, Kontaktdaten
  - Steuernummer, USt-IdNr.
- Bankverbindung:
  - Bank, IBAN, BIC, Kontoinhaber
- Zahlungsbedingungen:
  - Standard Zahlungstext
  - Standard-Notizen für Rechnungen
- **Datensicherung**:
  - Export aller Daten als JSON (Kunden, Leistungen, Firmendaten, Rechnung)
  - Import von JSON-Backup für Migration zwischen Browsern
- Speichern in LocalStorage
- Daten werden auf gedruckten Rechnungen angezeigt
- Standard-Land: Österreich (AT)

### 2. Kunden-Seite
- Liste aller Kunden anzeigen
- Kunde hinzufügen/bearbeiten/löschen
- Speichern in LocalStorage als JSON-Liste
- Empty State wenn keine Kunden vorhanden

### 3. Leistungen-Seite
- Liste aller Leistungen anzeigen
- Leistung hinzufügen/bearbeiten/löschen
- Felder: Name, Stundensatz, Steuersatz
- Komma-Eingabe für Zahlen (8,5 statt 8.5)
- Berechnung von Brutto/Stunde
- Speichern in LocalStorage als JSON-Liste

### 4. Rechnung-Seite
- Formular:
  - invoiceNumber, issueDate
  - Kunde auswählen (Dropdown aus customers)
  - Positionen: Leistung auswählen, Stunden eingeben (Komma-Eingabe)
  - Position hinzufügen/entfernen
  - Live Summen anzeigen (Netto/Steuer/Brutto)
- Buttons:
  - "Neu" (neue Rechnung beginnen)
  - "Laden" (aus LocalStorage laden)
  - "Speichern" (in LocalStorage speichern)
  - "Drucken" (window.print())
- Print-Ansicht: CSS Print Styles mit Firmendaten
- Alert wenn keine Stammdaten vorhanden

### 5. Hilfe-Seite
- Schnellstart-Guide
- Detaillierte Anleitungen für alle Features
- FAQ-Bereich
- Technische Hinweise
- Sicherheitshinweise
- Strukturiert mit Accordion-Komponenten
- Erreichbar über Hilfe-Button (?) in der Navigation

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

### ✅ Schritt 10: CSV-Importvorlagen (ERLEDIGT)
- [x] Download-Button für Kunden-CSV-Vorlage
- [x] Download-Button für Leistungen-CSV-Vorlage
- [x] UTF-8 BOM Encoding für Excel-Kompatibilität
- [x] Österreichische Beispieldaten

**Utility**:
- csvTemplates.ts - CSV-Vorlagen-Generierung und Download

**Features**:
- **Kunden-Vorlage**: 3 österreichische Beispielkunden (Wien, Graz, Linz)
- **Leistungen-Vorlage**: 4 Beispiel-Leistungen mit Stundensätzen
- **Download-Buttons**: Prominent auf Kunden- und Leistungsseite platziert
- **Excel-kompatibel**: UTF-8 BOM für korrekte Darstellung von Umlauten
- **Standard CSV-Format**: Komma-separiert mit Header-Zeile

---

### ✅ Schritt 11: CSV Import für Kunden und Leistungen (ERLEDIGT)
- [x] CSV Import für Kunden mit Vorschau
- [x] CSV Import für Leistungen mit Vorschau
- [x] Validierung aller importierten Daten
- [x] Batch-Import Funktionalität
- [x] Fehlerbehandlung und Feedback

**Komponenten**:
- CustomerCSVImportModal.tsx - CSV Import für Kunden
- ServiceCSVImportModal.tsx - CSV Import für Leistungen

**Features - Kunden-Import**:
- File Upload mit CSV-Parser (papaparse)
- Header-basiertes Parsing (name, addressLine1, postalCode, city, countryCode, email)
- Validierung von Pflichtfeldern
- Vorschau-Tabelle zeigt erste 5 Einträge
- Generierung neuer UUIDs für importierte Kunden
- Feedback: "X Kunden erfolgreich importiert"

**Features - Leistungen-Import**:
- File Upload mit CSV-Parser (papaparse)
- Header-basiertes Parsing (name, hourlyRate, taxRate)
- Unterstützung für Komma UND Punkt als Dezimaltrenner (80,00 oder 80.00)
- Validierung: hourlyRate > 0, taxRate 0-100
- Vorschau mit Brutto/Stunde Berechnung
- Generierung neuer UUIDs für importierte Leistungen
- Fehlerbehandlung mit detaillierten Validierungsfehlern

**Library**:
- papaparse - CSV Parsing Library

---

### ✅ Schritt 12: Rechnungshistorie und Verwaltung (ERLEDIGT)
- [x] Neue Seite für Rechnungsübersicht
- [x] Liste aller Rechnungen mit Status
- [x] Suche und Filter-Funktionalität
- [x] CRUD-Operationen für Rechnungen
- [x] Status-Verwaltung (Entwurf, Versendet, Bezahlt, Storniert)
- [x] Array-basierter LocalStorage für mehrere Rechnungen
- [x] Navigation zwischen Liste und Einzelansicht

**Komponente**:
- InvoicesListPage.tsx - Übersicht aller Rechnungen

**Features**:
- **Rechnungsliste**: Tabelle mit allen Rechnungen
  - Rechnungsnummer, Datum, Kunde, Netto, Brutto, Status
- **Suche**: Nach Rechnungsnummer, Kunde oder Datum
- **Sortierung**: Nach Datum (neueste zuerst)
- **Status-Badges**: Farbcodiert (Entwurf, Versendet, Bezahlt, Storniert)
- **Aktionen pro Rechnung**:
  - Bearbeiten (navigate to /invoice/:id)
  - Duplizieren (erstellt Kopie mit neuem Datum)
  - Drucken (navigate und trigger print)
  - Löschen (mit Bestätigung)
- **Navigation**:
  - /invoices - Liste aller Rechnungen
  - /invoice/new - Neue Rechnung erstellen
  - /invoice/:id - Bestehende Rechnung bearbeiten

**Datenmodell-Erweiterungen**:
- InvoiceStatus Type: 'draft' | 'sent' | 'paid' | 'cancelled'
- Invoice.status Field (optional für Rückwärtskompatibilität)
- STORAGE_KEYS.INVOICES für Array von Rechnungen

**InvoicePage Anpassungen**:
- URL-Parameter Support (:invoiceId)
- Laden/Speichern aus/in Rechnungs-Array
- Status-Auswahl Dropdown
- Zurück-Navigation zur Liste
- "Speichern und Zurück"-Verhalten

**Export/Import Update**:
- ExportData v2.0.0 mit invoices Array
- Rückwärtskompatibilität mit v1.0.0 (currentInvoice)
- Migration von einzelner Rechnung zu Array beim Import

---

### ✅ Schritt 13: PDF Export (ERLEDIGT)
- [x] PDF-Export-Button auf Rechnungsseite
- [x] Direkter PDF-Download ohne Browser-Druckdialog
- [x] Automatische Dateinamen-Generierung
- [x] Professional PDF-Formatierung

**Utility**:
- pdfExport.ts - PDF-Generierung mit jsPDF und html2canvas

**Libraries**:
- jsPDF - PDF-Generierung
- html2canvas - HTML zu Canvas Konvertierung

**Features**:
- **"Als PDF" Button**: Auf Rechnungsseite neben "Drucken"
- **Konvertierung**: InvoicePrintView HTML → Canvas → PDF
- **Format**: A4, Portrait, automatische Seitenumbrüche
- **Qualität**: Scale 2 für hohe Auflösung
- **Dateiname**: RE-{invoiceNumber}-{customerName}.pdf
- **Deaktiviert**: Wenn Rechnung keine Nummer oder Kunde hat
- **Fehlerbehandlung**: User-Feedback bei Fehlern

**Technische Details**:
- html2canvas rendert DOM-Element als Canvas
- jsPDF erstellt PDF aus Canvas-Image
- Automatische Berechnung von Seitenhöhen
- Multi-Page Support für lange Rechnungen
- Filename-Sanitization (entfernt Sonderzeichen)

---

## Akzeptanzkriterien (Definition of Done)

- [x] Projekt läuft und ist navigierbar
- [x] Kundenliste editierbar und persistent (LocalStorage)
- [x] Leistungsliste editierbar und persistent (LocalStorage)
- [x] Firmenstammdaten editierbar und persistent (LocalStorage)
- [x] Export/Import aller Daten als JSON-Backup funktioniert
- [x] CSV-Importvorlagen downloadbar für Kunden und Leistungen
- [x] CSV Import für Kunden mit Validierung und Vorschau
- [x] CSV Import für Leistungen mit Validierung und Vorschau
- [x] Rechnungshistorie mit Liste aller Rechnungen
- [x] Rechnungsstatus-Verwaltung (Entwurf, Versendet, Bezahlt, Storniert)
- [x] Suche und Filter in Rechnungsliste
- [x] Rechnung: Kunde + Leistungen auswählbar, Stunden eingeben
- [x] Summen korrekt berechnet (Netto/Steuer/Brutto)
- [x] Rechnungen als Array speicherbar (mehrere Rechnungen)
- [x] Druck funktioniert mit Firmendaten, Zahlungsbedingungen, Bankverbindung
- [x] PDF-Export direkt aus der Anwendung
- [x] Hilfe & Anleitung vollständig und verständlich
- [x] Code ist gut strukturiert und verständlich (Schulungszweck)
- [x] README dokumentiert alle Features

---

## Projektstruktur

```
src/
├── app/
│   └── Layout.tsx                  # App-Layout mit Tab-Navigation + Hilfe-Button
├── pages/
│   ├── SettingsPage.tsx            # Firmenstammdaten + Datensicherung
│   ├── CustomersPage.tsx           # Kundenverwaltung mit CSV Import
│   ├── ServicesPage.tsx            # Leistungsverwaltung mit CSV Import
│   ├── InvoicesListPage.tsx        # Rechnungsübersicht (NEU)
│   ├── InvoicePage.tsx             # Rechnungsformular (bearbeitet: URL-Params, Status)
│   └── HelpPage.tsx                # Hilfe & Anleitung
├── components/
│   ├── CustomerFormModal.tsx       # Kunde hinzufügen/bearbeiten
│   ├── ServiceFormModal.tsx        # Leistung hinzufügen/bearbeiten
│   ├── CustomerCSVImportModal.tsx  # CSV Import für Kunden (NEU)
│   ├── ServiceCSVImportModal.tsx   # CSV Import für Leistungen (NEU)
│   ├── ConfirmDeleteModal.tsx      # Bestätigungsdialog
│   └── InvoicePrintView.tsx        # Druckansicht mit Firmendaten
├── models/
│   └── types.ts                    # TypeScript Datenmodelle + InvoiceStatus
├── storage/
│   └── localStorage.ts             # LocalStorage Helper (INVOICES Key)
├── utils/
│   ├── money.ts                    # Geld-Formatierung
│   ├── calc.ts                     # Rechnungs-Berechnungen
│   ├── dataExport.ts               # Export/Import Utilities (v2.0.0)
│   ├── csvTemplates.ts             # CSV-Vorlagen Download (NEU)
│   └── pdfExport.ts                # PDF-Generierung (NEU)
├── print.css                       # Print Styles
├── App.tsx                         # Root Component (Routes aktualisiert)
└── main.tsx                        # Entry Point
```

---

## Lernziele für Teilnehmer

1. **React Grundlagen**: Komponenten, Props, State, Hooks
2. **TypeScript**: Typisierung, Interfaces, Type Safety, Union Types
3. **State Management**: useState, useEffect, Daten-Flow
4. **Routing**: React Router v6, URL-Parameter, Navigation
5. **Formular-Handling**: Controlled Components, Validation, Lokalisierung (Komma-Eingabe)
6. **UI Library nutzen**: Mantine Components, Responsive Design, Modals
7. **Browser APIs**: LocalStorage, FileReader, Blob/URL, window.print(), Canvas API
8. **File Handling**: CSV Parsing, File Upload, Download-Generierung
9. **PDF Generation**: HTML zu Canvas zu PDF Konvertierung
10. **Berechnungslogik**: Funktionen auslagern, testen
11. **Code-Organisation**: Ordnerstruktur, Separation of Concerns
12. **Import/Export Pattern**: JSON-Backup für Client-Only Apps, CSV-Import/Export
13. **Build-Optimierung**: Single-File Build, Production-ready Output
14. **Internationalisierung**: Zahlenformate, Länder-Defaults
15. **Dokumentation**: Benutzerfreundliche Hilfe-Seiten erstellen
16. **Datenmodellierung**: Status-Management, Array-basierte Persistierung
17. **Third-Party Libraries**: Integration von papaparse, jsPDF, html2canvas

---

## Projekt-Zusammenfassung

**Status**: ✅ VOLLSTÄNDIG ABGESCHLOSSEN + ERWEITERT

Alle 13 Entwicklungsschritte wurden erfolgreich implementiert:
- ✅ Schritt 1: Projekt-Setup + Navigation
- ✅ Schritt 2: Kundenverwaltung (CRUD)
- ✅ Schritt 3: Leistungsverwaltung (CRUD)
- ✅ Schritt 4: Rechnungsformular
- ✅ Schritt 5: JSON Speichern/Laden
- ✅ Schritt 6: Druckfunktion
- ✅ Schritt 7: Firmenstammdaten / Einstellungen + Export/Import
- ✅ Schritt 8: Hilfe & Anleitung
- ✅ Schritt 9: Single-File Build + Komma-Eingabe
- ✅ Schritt 10: CSV-Importvorlagen
- ✅ Schritt 11: CSV Import für Kunden und Leistungen
- ✅ Schritt 12: Rechnungshistorie und Verwaltung
- ✅ Schritt 13: PDF Export

**Alle Akzeptanzkriterien erfüllt** ✅

### Technische Highlights

1. **Saubere Architektur**: Separation of Concerns (Pages, Components, Utils, Models)
2. **Type-Safe**: Vollständige TypeScript Typisierung
3. **Wiederverwendbare Komponenten**: Modals, Form Components, CSV Import Components
4. **Utility Functions**: money.ts, calc.ts, dataExport.ts, csvTemplates.ts, pdfExport.ts
5. **LocalStorage Integration**: Persistierung aller Daten (Kunden, Leistungen, Rechnungen, Einstellungen)
6. **Export/Import System**: Backup und Migration zwischen Browsern/Rechnern (v2.0.0 mit Rechnungsarray)
7. **CSV Import/Export**: Vorlagen-Download und Batch-Import mit Validierung
8. **PDF Generation**: Direkter PDF-Export mit jsPDF und html2canvas
9. **Browser APIs**: File Download, FileReader, Blob/URL handling, Canvas API
10. **Responsive UI**: Mantine Components
11. **Print-Optimierung**: CSS @media print für professionellen Druck mit Firmendaten
12. **Rechnungshistorie**: Vollständige Verwaltung mit Suche, Filter, Status-Tracking
13. **Code-Qualität**: ESLint Integration
14. **Benutzerfreundlichkeit**: Umfassende Hilfe & Anleitung integriert
15. **Lokalisierung**: Österreichische Defaults, Deutsche Zahlenformatierung (Komma)
16. **Single-File Build**: Optimiert für einfaches Deployment (nur 1 HTML-Datei)

### Statistik

- **Seiten**: 6 (Einstellungen, Kunden, Leistungen, Rechnungsübersicht, Rechnungsformular, Hilfe)
- **Komponenten**: 7 wiederverwendbare Components
  - CustomerFormModal, ServiceFormModal, ConfirmDeleteModal, InvoicePrintView
  - CustomerCSVImportModal, ServiceCSVImportModal (NEU)
- **Utils**: 6 Utility-Module
  - money, calc, dataExport, localStorage
  - csvTemplates, pdfExport (NEU)
- **Datenmodelle**: 7 TypeScript Interfaces
  - Customer, Service, Invoice, InvoiceLine, InvoiceStatus (NEU), CompanySettings, ExportData
- **Dependencies**:
  - Core: React, Mantine, React Router, TypeScript
  - Tools: ESLint, vite-plugin-singlefile
  - Libraries: papaparse, jsPDF, html2canvas (NEU)
- **Build Output**: Single-File (nur index.html) - ~700 kB (gzip: ~180 kB)
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

1. **Testing**: Unit Tests für calc.ts, money.ts, dataExport.ts, csvTemplates.ts, pdfExport.ts mit Vitest
2. **Validierung**: Zod für Schema-Validierung bei Export/Import und CSV-Import
3. **State Management**: Zustand für globalen State (ersetzt LocalStorage direkt)
4. **Mehrsprachigkeit**: i18n Support für Deutsch/Englisch
5. **Email-Versand**: Integration für Rechnungsversand per Email
6. **Rechnungsvorlagen**: Verschiedene Design-Templates zur Auswahl
7. **Wiederkehrende Rechnungen**: Templates für regelmäßige Abrechnungen
8. **Statistiken**: Dashboard mit Umsatzübersicht und Kundenstatistiken
9. **Zahlungserinnerungen**: Automatische Verfolgung überfälliger Rechnungen
10. **Angebote**: Erstellung von Angeboten zusätzlich zu Rechnungen
11. **Mehrere Währungen**: Support für verschiedene Währungen
12. **Rechnungsnummern-Generator**: Automatische Vergabe von Rechnungsnummern
13. **Projektverwaltung**: Gruppierung von Rechnungen nach Projekten
14. **Zeiterfassung**: Integration von Stundenerfassung für Leistungen
15. **Cloud-Sync**: Optional mit Backend für Geräte-Synchronisation
