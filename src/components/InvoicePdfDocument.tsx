import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Invoice, Customer, Service, CompanySettings } from '@/models/types';
import { calculateInvoiceTotals } from '@/utils/calc';
import { formatCurrency } from '@/utils/money';
import { formatGermanDate } from '@/utils/date';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyInfo: {
    fontSize: 9,
    marginBottom: 2,
  },
  companyTax: {
    fontSize: 8,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    borderBottom: '1 solid #ddd',
    marginVertical: 10,
  },
  invoiceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 8,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 8,
    color: '#666',
    marginBottom: 4,
  },
  customerInfo: {
    fontSize: 9,
    marginBottom: 2,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
    paddingBottom: 4,
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottom: '1 solid #eee',
  },
  col1: { width: '40%' },
  col2: { width: '15%', textAlign: 'right' },
  col3: { width: '15%', textAlign: 'right' },
  col4: { width: '15%', textAlign: 'right' },
  col5: { width: '15%', textAlign: 'right' },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 9,
  },
  totalValue: {
    fontSize: 9,
    textAlign: 'right',
  },
  grandTotal: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  notesSection: {
    marginTop: 20,
  },
  notesTitle: {
    fontSize: 8,
    color: '#666',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 9,
    bottom: 30,
    right: 40,
    color: '#666',
  },
});

interface InvoicePdfDocumentProps {
  invoice: Invoice;
  customer: Customer | undefined;
  services: Service[];
  companySettings: CompanySettings | undefined;
}

export function InvoicePdfDocument({
  invoice,
  customer,
  services,
  companySettings,
}: InvoicePdfDocumentProps) {
  const totals = calculateInvoiceTotals(invoice, services);
  const displayCustomer = invoice.customerSnapshot || customer;

  if (!displayCustomer) {
    return null;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Company Header */}
        {companySettings && companySettings.companyName && (
          <View style={styles.header}>
            <Text style={styles.companyName}>{companySettings.companyName}</Text>
            <Text style={styles.companyInfo}>{companySettings.addressLine1}</Text>
            {companySettings.addressLine2 && (
              <Text style={styles.companyInfo}>{companySettings.addressLine2}</Text>
            )}
            <Text style={styles.companyInfo}>
              {companySettings.postalCode} {companySettings.city}
            </Text>
            {companySettings.phone && (
              <Text style={styles.companyInfo}>Tel: {companySettings.phone}</Text>
            )}
            {companySettings.email && (
              <Text style={styles.companyInfo}>E-Mail: {companySettings.email}</Text>
            )}
            {companySettings.website && (
              <Text style={styles.companyInfo}>{companySettings.website}</Text>
            )}
            {(companySettings.taxId || companySettings.vatId) && (
              <Text style={styles.companyTax}>
                {companySettings.taxId && `Steuernr.: ${companySettings.taxId}`}
                {companySettings.taxId && companySettings.vatId && '  '}
                {companySettings.vatId && `USt-IdNr.: ${companySettings.vatId}`}
              </Text>
            )}
          </View>
        )}

        <View style={styles.divider} />

        {/* Invoice Title and Info */}
        <View>
          <Text style={styles.invoiceTitle}>RECHNUNG</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Rechnungsnummer</Text>
              <Text style={styles.value}>{invoice.invoiceNumber}</Text>
            </View>
            <View>
              <Text style={styles.label}>Datum</Text>
              <Text style={styles.value}>{formatGermanDate(invoice.issueDate)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Customer Info */}
        <View>
          <Text style={styles.sectionTitle}>Rechnungsempfänger</Text>
          <Text style={[styles.customerInfo, { fontWeight: 'bold' }]}>
            {displayCustomer.name}
          </Text>
          <Text style={styles.customerInfo}>{displayCustomer.addressLine1}</Text>
          <Text style={styles.customerInfo}>
            {displayCustomer.postalCode} {displayCustomer.city}
          </Text>
          <Text style={styles.customerInfo}>{displayCustomer.countryCode}</Text>
          {displayCustomer.email && (
            <Text style={styles.customerInfo}>{displayCustomer.email}</Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* Line Items Table */}
        <View>
          <Text style={styles.sectionTitle}>Leistungen</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Beschreibung</Text>
              <Text style={styles.col2}>Stunden</Text>
              <Text style={styles.col3}>Stundensatz</Text>
              <Text style={styles.col4}>MwSt.</Text>
              <Text style={styles.col5}>Betrag</Text>
            </View>

            {/* Table Rows */}
            {invoice.lines.map((line, index) => {
              const lineCalc = totals.lines[index];
              if (!lineCalc) return null;

              const description = line.description || 'Unbekannt';
              const hourlyRate = line.hourlyRate ?? 0;
              const taxRate = line.taxRate ?? 0;

              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.col1}>{description}</Text>
                  <Text style={styles.col2}>{line.hours}</Text>
                  <Text style={styles.col3}>{formatCurrency(hourlyRate)}</Text>
                  <Text style={styles.col4}>{taxRate}%</Text>
                  <Text style={styles.col5}>{formatCurrency(lineCalc.netAmount)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Nettobetrag:</Text>
            <Text style={styles.totalValue}>{formatCurrency(totals.netTotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Mehrwertsteuer:</Text>
            <Text style={styles.totalValue}>{formatCurrency(totals.taxTotal)}</Text>
          </View>
          <View style={[styles.divider, { width: 200 }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, styles.grandTotal]}>Gesamtbetrag:</Text>
            <Text style={[styles.totalValue, styles.grandTotal]}>
              {formatCurrency(totals.grossTotal)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Zahlungsbedingungen</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Page Number */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Seite ${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}
