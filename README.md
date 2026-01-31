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
4. **Datensicherung**: Export/Import aller Daten als JSON-Backup (Browser-Migration, Backup)
5. **Rechnungsverwaltung**: Vollständige Rechnungshistorie mit Status-Tracking (Entwurf, Versendet, Bezahlt, Storniert)
6. **Rechnungsformular**: Erstellen und Bearbeiten von Rechnungen mit automatischen Berechnungen
7. **PDF-Export**: Professioneller PDF-Export mit @react-pdf/renderer inkl. Zahlungsbedingungen & Bankverbindung
8. **Dark/Light Mode**: Umschaltbarer Farbmodus mit WCAG AAA konformen Kontrasten
9. **High-Contrast Theme**: Barrierefreies Design mit verstärkten Rahmen und optimierter Lesbarkeit
10. **Hilfe & Anleitung**: Umfassende Schritt-für-Schritt Anleitung integriert (Hilfe-Button rechts oben)
11. **Österreichische Lokalisierung**: Standard-Land AT, Komma-Eingabe für Zahlen (8,5 statt 8.5)
12. **CSV-Import**: Massenimport von Kunden und Leistungen mit Vorlagen-Download
13. **Single-File Build**: Komplette App in einer einzigen index.html (ca. 2.3 MB, gzip: 720 KB)

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
- **Build**: vite-plugin-singlefile (Single-File Output)

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
│   ├── CustomersPage.tsx               # Kundenverwaltung (CRUD + CSV Import)
│   ├── ServicesPage.tsx                # Leistungsverwaltung (CRUD + CSV Import)
│   ├── InvoicesListPage.tsx            # Rechnungshistorie & Übersicht
│   ├── InvoicePage.tsx                 # Rechnungsformular
│   ├── SettingsPage.tsx                # Firmenstammdaten & Datenexport
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

## Datensicherung & Migration

### Export/Import Funktionalität

Da alle Daten nur im **Browser LocalStorage** gespeichert sind, bietet die App Export/Import-Funktionen für:
- **Backup**: Regelmäßige Datensicherung
- **Migration**: Übertragung auf anderen Browser/Rechner
- **Portabilität**: Daten sind nicht Browser-gebunden

**Verwendung:**
1. Einstellungen-Tab öffnen
2. "Alle Daten exportieren" → lädt `invoice-backup-YYYY-MM-DD.json` herunter
3. JSON-Datei sicher speichern (z.B. Cloud, USB-Stick)
4. Auf anderem Browser/Rechner: "Daten importieren" → JSON-Datei hochladen

**Exportierte Daten:**
- Alle Kunden
- Alle Leistungen
- Firmenstammdaten
- Aktuelle Rechnung
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

## Single-File Build

Das Projekt nutzt `vite-plugin-singlefile` für einen optimierten Build:

```bash
npm run build
```

Erzeugt **nur eine einzige Datei**: `dist/index.html` (ca. 2.3 MB, gzip: 720 KB)

- Alle JavaScript-Module inline
- Alle CSS-Styles inline
- Keine externen Dependencies
- Perfekt für einfaches Deployment oder Offline-Nutzung

```bash
# Preview des Production Builds
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
- Single-File Build Configuration
