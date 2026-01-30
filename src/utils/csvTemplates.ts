// CSV Template Generation and Download

/**
 * Creates and downloads a CSV template file for customers
 */
export function downloadCustomerTemplate(): void {
  const csvContent = `\uFEFFname,addressLine1,postalCode,city,countryCode,email
"Musterfirma GmbH","Musterstraße 1","1010","Wien","AT","info@musterfirma.at"
"Beispiel AG","Testweg 5","8010","Graz","AT","kontakt@beispiel.at"
"Testkunde KG","Hauptplatz 10","4020","Linz","AT","office@testkunde.at"`;

  downloadCSV(csvContent, 'customers-template.csv');
}

/**
 * Creates and downloads a CSV template file for services
 */
export function downloadServiceTemplate(): void {
  const csvContent = `\uFEFFname,hourlyRate,taxRate
"Beratung",80.00,20
"Entwicklung",95.00,20
"Projektmanagement",110.00,20
"Training",120.00,20`;

  downloadCSV(csvContent, 'services-template.csv');
}

/**
 * Helper function to download CSV content as a file
 */
function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
