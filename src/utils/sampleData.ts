/**
 * Sample data generation for demonstration and testing
 */

import { ExportData } from './dataExport';

/**
 * Generates realistic Austrian sample data with complete snapshots
 */
export function generateSampleData(): ExportData {
  const customerId1 = crypto.randomUUID();
  const customerId2 = crypto.randomUUID();
  const customerId3 = crypto.randomUUID();

  const serviceId1 = crypto.randomUUID();
  const serviceId2 = crypto.randomUUID();
  const serviceId3 = crypto.randomUUID();
  const serviceId4 = crypto.randomUUID();

  return {
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    companySettings: {
      companyName: 'Tech Solutions Wien GmbH',
      addressLine1: 'Mariahilfer Straße 88',
      addressLine2: '2. Stock',
      postalCode: '1070',
      city: 'Wien',
      countryCode: 'AT',
      phone: '+43 1 5236547',
      email: 'office@techsolutions-wien.at',
      website: 'www.techsolutions-wien.at',
      taxId: '123/4567/8901',
      vatId: 'ATU12345678',
      bankName: 'Erste Bank',
      iban: 'AT61 2011 1827 3456 7800',
      bic: 'GIBAATWWXXX',
      accountHolder: 'Tech Solutions Wien GmbH',
      paymentTerms:
        'Zahlbar innerhalb von 14 Tagen ohne Abzug.\nBei Überweisung bitte Rechnungsnummer angeben.',
      defaultNotes: 'Vielen Dank für Ihren Auftrag!',
    },
    customers: [
      {
        id: customerId1,
        name: 'Österreichische Bundesbahnen (ÖBB)',
        addressLine1: 'Am Hauptbahnhof 2',
        postalCode: '1100',
        city: 'Wien',
        countryCode: 'AT',
        email: 'einkauf@oebb.at',
      },
      {
        id: customerId2,
        name: 'Wiener Stadtwerke GmbH',
        addressLine1: 'Thomas-Klestil-Platz 14',
        postalCode: '1030',
        city: 'Wien',
        countryCode: 'AT',
        email: 'beschaffung@wienerstadtwerke.at',
      },
      {
        id: customerId3,
        name: 'Graz Innovations KG',
        addressLine1: 'Herrengasse 42',
        postalCode: '8010',
        city: 'Graz',
        countryCode: 'AT',
        email: 'kontakt@graz-innovations.at',
      },
    ],
    services: [
      {
        id: serviceId1,
        name: 'Software-Entwicklung',
        hourlyRate: 95.0,
        taxRate: 20,
      },
      {
        id: serviceId2,
        name: 'IT-Beratung',
        hourlyRate: 85.0,
        taxRate: 20,
      },
      {
        id: serviceId3,
        name: 'Projektmanagement',
        hourlyRate: 110.0,
        taxRate: 20,
      },
      {
        id: serviceId4,
        name: 'Schulung & Training',
        hourlyRate: 120.0,
        taxRate: 20,
      },
    ],
    invoices: [
      {
        id: crypto.randomUUID(),
        invoiceNumber: 'RE-2024-001',
        issueDate: '2024-01-15',
        customerId: customerId1,
        status: 'paid',
        notes:
          'Vielen Dank für die angenehme Zusammenarbeit.\nBei Fragen stehen wir gerne zur Verfügung.',
        customerSnapshot: {
          name: 'Österreichische Bundesbahnen (ÖBB)',
          addressLine1: 'Am Hauptbahnhof 2',
          postalCode: '1100',
          city: 'Wien',
          countryCode: 'AT',
          email: 'einkauf@oebb.at',
        },
        lines: [
          {
            serviceId: serviceId1,
            hours: 40,
            note: 'Entwicklung Ticketbuchungssystem - Backend API',
            description: 'Software-Entwicklung',
            hourlyRate: 95.0,
            taxRate: 20,
          },
          {
            serviceId: serviceId2,
            hours: 8,
            note: 'Architektur-Beratung und Code-Review',
            description: 'IT-Beratung',
            hourlyRate: 85.0,
            taxRate: 20,
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        invoiceNumber: 'RE-2024-002',
        issueDate: '2024-02-20',
        customerId: customerId2,
        status: 'sent',
        notes: 'Zahlbar bis 05.03.2024',
        customerSnapshot: {
          name: 'Wiener Stadtwerke GmbH',
          addressLine1: 'Thomas-Klestil-Platz 14',
          postalCode: '1030',
          city: 'Wien',
          countryCode: 'AT',
          email: 'beschaffung@wienerstadtwerke.at',
        },
        lines: [
          {
            serviceId: serviceId3,
            hours: 16,
            note: 'Projektleitung Infrastruktur-Modernisierung Q1',
            description: 'Projektmanagement',
            hourlyRate: 110.0,
            taxRate: 20,
          },
          {
            serviceId: serviceId1,
            hours: 60,
            note: 'Implementierung Smart Grid Dashboard',
            description: 'Software-Entwicklung',
            hourlyRate: 95.0,
            taxRate: 20,
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        invoiceNumber: 'RE-2024-003',
        issueDate: '2024-03-10',
        customerId: customerId3,
        status: 'draft',
        notes: '',
        customerSnapshot: {
          name: 'Graz Innovations KG',
          addressLine1: 'Herrengasse 42',
          postalCode: '8010',
          city: 'Graz',
          countryCode: 'AT',
          email: 'kontakt@graz-innovations.at',
        },
        lines: [
          {
            serviceId: serviceId4,
            hours: 12,
            note: 'React & TypeScript Workshop für Entwicklerteam',
            description: 'Schulung & Training',
            hourlyRate: 120.0,
            taxRate: 20,
          },
          {
            serviceId: serviceId2,
            hours: 4,
            note: 'Beratung zur Technologie-Auswahl',
            description: 'IT-Beratung',
            hourlyRate: 85.0,
            taxRate: 20,
          },
        ],
      },
    ],
  };
}

/**
 * Downloads sample data as JSON file
 */
export function downloadSampleData(): void {
  const data = generateSampleData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const filename = 'rechnung-musterdaten.json';

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
