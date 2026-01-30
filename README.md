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
5. **Rechnungserstellung**: Formular zum Erstellen einer Rechnung
6. **JSON Export/Import**: Rechnung als JSON speichern und laden
7. **Druckfunktion**: Browser-Print mit Firmendaten, Zahlungsbedingungen & Bankverbindung
8. **Hilfe & Anleitung**: Umfassende Schritt-für-Schritt Anleitung integriert (Hilfe-Button rechts oben)
9. **Österreichische Lokalisierung**: Standard-Land AT, Komma-Eingabe für Zahlen (8,5 statt 8.5)
10. **Single-File Build**: Komplette App in einer einzigen index.html (ca. 660 KB)

## Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **UI Library**: Mantine v7
- **Routing**: React Router v6
- **State Management**: React Hooks (useState, useEffect)
- **Persistierung**: LocalStorage
- **Code Quality**: ESLint mit TypeScript & React Hooks
- **Build**: vite-plugin-singlefile (Single-File Output)

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
│   └── Layout.tsx              # App-Layout mit Navigation
├── pages/
│   ├── CustomersPage.tsx       # Kundenverwaltung (CRUD)
│   ├── ServicesPage.tsx        # Leistungsverwaltung (CRUD)
│   └── InvoicePage.tsx         # Rechnungsformular
├── components/
│   ├── CustomerFormModal.tsx   # Kunde hinzufügen/bearbeiten
│   ├── ServiceFormModal.tsx    # Leistung hinzufügen/bearbeiten
│   ├── ConfirmDeleteModal.tsx  # Bestätigungsdialog
│   └── InvoicePrintView.tsx    # Druckansicht
├── models/
│   └── types.ts                # TypeScript Datenmodelle
├── storage/
│   └── localStorage.ts         # LocalStorage Helper
├── utils/
│   ├── money.ts                # Geld-Formatierung
│   └── calc.ts                 # Rechnungs-Berechnungen
├── print.css                   # Print Styles
├── App.tsx                     # Root Component
└── main.tsx                    # Entry Point
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

Erzeugt **nur eine einzige Datei**: `dist/index.html` (ca. 660 KB, gzip: 171 KB)

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
