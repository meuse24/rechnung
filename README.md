# Invoice Training - Rechnungs-Webapp

Ein einfaches Schulungsprojekt für React + TypeScript + Mantine.

## Schulungsziel

Dieses Projekt demonstriert:
- React Hooks (useState, useEffect)
- TypeScript Typisierung
- Mantine UI Components
- React Router Navigation
- LocalStorage Persistierung
- Berechnungslogik (Rechnungssummen)
- Print-Funktionalität

## Features

1. **Kundenverwaltung**: Kunden hinzufügen, bearbeiten, löschen
2. **Leistungsverwaltung**: Stundenleistungen mit Stundensatz und Steuersatz verwalten
3. **Firmenstammdaten**: Briefkopf, Bankverbindung, Zahlungsbedingungen hinterlegen
4. **Datenverwaltung**: Export/Import, Musterdaten laden, Daten zurücksetzen (ideal für Schulungen)
5. **Rechnungsverwaltung**: Vollständige Rechnungshistorie mit Status-Tracking (Entwurf, Versendet, Bezahlt, Storniert)
6. **Rechnungsformular**: Erstellen und Bearbeiten von Rechnungen mit automatischen Berechnungen
7. **PDF-Export**: Professioneller PDF-Export mit @react-pdf/renderer inkl. Zahlungsbedingungen & Bankverbindung
8. **Dark/Light Mode**: Umschaltbarer Farbmodus mit WCAG AAA konformen Kontrasten
9. **High-Contrast Theme**: Barrierefreies Design mit verstärkten Rahmen und optimierter Lesbarkeit
10. **Hilfe & Anleitung**: Umfassende Schritt-für-Schritt Anleitung integriert (Hilfe-Button rechts oben)
11. **Österreichische Lokalisierung**: Standard-Land AT, Komma-Eingabe für Zahlen (8,5 statt 8.5)
12. **CSV-Import**: Massenimport von Kunden und Leistungen mit Vorlagen-Download
13. **Optimierter Build**: Multi-File Build mit Caching-Unterstützung für schnelle Updates

## Accessibility & Theme

Die App verfügt über ein **High-Contrast Mantine v7 Theme** mit WCAG AAA Compliance:

- **Dark/Light Mode**: Toggle-Button im Header für Farbschema-Wechsel
- **Verstärkte Rahmen**: 1.5-2px Rahmenbreite für bessere Sichtbarkeit
- **Optimierte Kontraste**: 16.1:1 für Labels, 8.6:1 für ausgewählte Optionen
- **Focus-States**: Immer sichtbare 2px blaue Umrandung bei Tastaturfokus
- **Dropdown-Highlighting**: Blaue Hinterlegung für ausgewählte Optionen
- **Lesbarkeit**: Erhöhte Schriftstärken und optimierte Farben

Details: siehe [THEME_GUIDE.md](THEME_GUIDE.md)

## Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **UI Library**: Mantine v7 mit High-Contrast Theme (WCAG AAA)
- **PDF Export**: @react-pdf/renderer
- **CSV Parsing**: papaparse
- **Routing**: React Router v6
- **State Management**: React Hooks (useState, useEffect, useRef, useMemo)
- **Persistierung**: LocalStorage mit Cross-Tab Synchronization
- **Code Quality**: ESLint mit TypeScript & React Hooks
- **Build**: Vite mit relativen Pfaden für statisches Hosting
- **Routing**: HashRouter für statisches Hosting ohne Server-Konfiguration

## Browser-Kompatibilität

Die Anwendung ist vollständig kompatibel mit folgenden Browsern:

- ✅ **Chrome 90+** (April 2021)
- ✅ **Edge 90+** (April 2021)
- ✅ **Safari 14+** (September 2020)
- ✅ **Firefox 85+** (Januar 2021)

**Kompatibilitäts-Features:**
- Automatischer Polyfill für UUID-Generierung in älteren Browsern
- Kompatible CSS-Lösungen ohne moderne Features (z.B. `light-dark()`)
- Getestet und funktional in allen aufgeführten Browser-Versionen

Details zu den Kompatibilitätsfixes: siehe [THEME_GUIDE.md](THEME_GUIDE.md#compatibility-fixes)

## Installation & Start

```bash
# Dependencies installieren
npm install

# Dev-Server starten (läuft auf http://localhost:5173)
npm run dev

# Code-Qualität prüfen (ESLint)
npm run lint

# Production Build
npm run build

# Preview Production Build
npm preview
```

## Projektstruktur

```
src/
├── app/
│   └── Layout.tsx                      # App-Layout mit Navigation & Dark Mode Toggle
├── pages/
│   ├── DataPage.tsx                    # Datenverwaltung (Import/Export/Musterdaten/Reset)
│   ├── SettingsPage.tsx                # Firmenstammdaten
│   ├── CustomersPage.tsx               # Kundenverwaltung (CRUD + CSV Import)
│   ├── ServicesPage.tsx                # Leistungsverwaltung (CRUD + CSV Import)
│   ├── InvoicesListPage.tsx            # Rechnungshistorie & Übersicht
│   ├── InvoicePage.tsx                 # Rechnungsformular
│   └── HelpPage.tsx                    # Hilfe & Anleitung
├── components/
│   ├── invoice/                        # Modularisierte Rechnungskomponenten
│   │   ├── InvoicePageHeader.tsx       # Rechnungskopf mit Aktionen
│   │   ├── InvoiceHeaderForm.tsx       # Formular für Rechnungskopf
│   │   ├── InvoiceLinesEditor.tsx      # Positionen-Editor
│   │   ├── InvoiceTotalsPanel.tsx      # Summenanzeige
│   │   └── InvoiceNotesPanel.tsx       # Notizen-Editor
│   ├── InvoicePdfDocument.tsx          # PDF-Dokumentkomponente
│   ├── InvoicePrintView.tsx            # Druckansicht
│   ├── CustomerFormModal.tsx           # Kunde hinzufügen/bearbeiten
│   ├── ServiceFormModal.tsx            # Leistung hinzufügen/bearbeiten
│   └── ConfirmDeleteModal.tsx          # Bestätigungsdialog
├── hooks/
│   └── useInvoiceDependencies.ts       # Hook für Rechnungsabhängigkeiten
├── models/
│   └── types.ts                        # TypeScript Datenmodelle
├── storage/
│   ├── localStorage.ts                 # LocalStorage Helper
│   └── invoices.ts                     # Rechnungs-Persistierung
├── utils/
│   ├── money.ts                        # Geld-Formatierung
│   ├── calc.ts                         # Rechnungs-Berechnungen
│   ├── date.ts                         # Datum-Formatierung
│   ├── invoice.ts                      # Invoice Snapshot Logic
│   ├── pdfExport.tsx                   # PDF-Generierung
│   ├── dataExport.ts                   # JSON Export/Import
│   └── csvTemplates.ts                 # CSV-Vorlagen
├── theme.ts                            # Mantine Theme (High-Contrast)
├── theme.css                           # Zusätzliche Theme-Styles
├── print.css                           # Print Styles
├── App.tsx                             # Root Component
└── main.tsx                            # Entry Point
```

## Datenmodelle

### Customer
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

### Service
```typescript
{
  id: string;
  name: string;
  hourlyRate: number;
  taxRate: number;
}
```

### Invoice
```typescript
{
  id: string;
  invoiceNumber: string;
  issueDate: string;
  customerId: string;
  lines: InvoiceLine[];
  notes?: string;
}
```

## Navigation

Die App hat 5 Hauptbereiche (Tabs):

| Tab | Beschreibung |
|-----|--------------|
| **Daten** | Import/Export, Musterdaten laden, Daten zurücksetzen |
| **Stammdaten** | Firmendaten, Bankverbindung, Zahlungsbedingungen |
| **Kunden** | Kundenverwaltung mit CSV-Import |
| **Leistungen** | Leistungsverwaltung mit CSV-Import |
| **Rechnungen** | Rechnungsübersicht und -erstellung |

## Datenverwaltung (Menü "Daten")

### Export/Import Funktionalität

Da alle Daten nur im **Browser LocalStorage** gespeichert sind, bietet die App Export/Import-Funktionen:

**Verwendung:**
1. "Daten"-Tab öffnen (erster Menüpunkt)
2. "Alle Daten exportieren" → lädt `invoice-backup-YYYY-MM-DD.json` herunter
3. JSON-Datei sicher speichern (z.B. Cloud, USB-Stick)
4. Auf anderem Browser/Rechner: "Daten importieren" → JSON-Datei hochladen

### Musterdaten laden (für Schulungen)

Mit einem Klick realistische österreichische Beispieldaten laden:
- Firmenstammdaten (Tech Solutions Wien GmbH)
- 3 Kunden (ÖBB, Wiener Stadtwerke, Graz Innovations)
- 4 Leistungen (Software-Entwicklung, IT-Beratung, etc.)
- 3 Beispiel-Rechnungen mit verschiedenen Status

### Daten zurücksetzen

Löscht alle Daten für einen sauberen Neustart - ideal für Schulungen.

**Exportierte Daten:**
- Alle Kunden
- Alle Leistungen
- Firmenstammdaten
- Alle Rechnungen
- Version & Exportdatum

## LocalStorage Keys

- `invoice_customers`: Liste aller Kunden
- `invoice_services`: Liste aller Leistungen
- `invoice_current`: Aktuelle Rechnung
- `invoice_company_settings`: Firmenstammdaten (Briefkopf, Bank, Zahlungsbedingungen)

## Entwicklungsschritte (für Trainer)

- [x] Schritt 1: Projekt-Setup + Mantine + Router + Navigation
- [x] Schritt 2: Kundenverwaltung (CRUD)
- [x] Schritt 3: Leistungsverwaltung (CRUD)
- [x] Schritt 4: Rechnungsformular mit Berechnungen
- [x] Schritt 5: JSON Speichern/Laden
- [x] Schritt 6: Druckfunktion
- [x] Schritt 7: Firmenstammdaten / Einstellungen

**Status**: ✅ Projekt vollständig implementiert!

## Build & Deployment

### Production Build erstellen

```bash
npm run build
```

Erzeugt den `dist/` Ordner mit folgender Struktur:

```
dist/
├── index.html          (0.5 KB)
├── favicon.svg         (App-Icon)
└── assets/
    ├── index-xxx.js    (ca. 2.1 MB, gzip: 689 KB)
    └── index-xxx.css   (ca. 207 KB, gzip: 30 KB)
```

### Deployment auf Webserver

1. **Kompletten `dist/` Ordner hochladen** (inkl. `assets/` Unterordner)
2. Die Ordnerstruktur muss erhalten bleiben:
   ```
   https://ihre-domain.de/index.html
   https://ihre-domain.de/favicon.svg
   https://ihre-domain.de/assets/index-xxx.js
   https://ihre-domain.de/assets/index-xxx.css
   ```

### Vorteile des Multi-File Builds

- **Browser-Caching**: JS/CSS werden separat gecached
- **Schnellere Updates**: Bei Änderungen müssen Nutzer nur geänderte Dateien neu laden
- **Content-Hashing**: Dateinamen enthalten Hashes (z.B. `index-BEkQKq6F.js`) - ändert sich der Code, ändert sich der Hash → automatisches Cache-Busting

### HashRouter

Die App verwendet `HashRouter` statt `BrowserRouter`. URLs sehen so aus:
- `https://ihre-domain.de/#/` (Startseite)
- `https://ihre-domain.de/#/customers` (Kunden)
- `https://ihre-domain.de/#/invoices` (Rechnungen)

**Vorteil**: Funktioniert auf jedem statischen Webserver ohne Server-Konfiguration.

```bash
# Preview des Production Builds lokal testen
npm run preview
```

## Lernziele

- Komponenten-Architektur in React
- TypeScript Typsicherheit nutzen
- State Management mit Hooks
- Formular-Handling mit deutscher Zahlenformatierung
- Berechnungslogik
- Browser-APIs (LocalStorage, FileReader, Blob, File Download, Print)
- Responsive UI mit Mantine
- Export/Import Pattern für Client-Only Apps
- Vite Build-Konfiguration für statisches Hosting
