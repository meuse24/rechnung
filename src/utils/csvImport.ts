import Papa, { ParseResult } from 'papaparse';

export const parseCsvFile = <T>(file: File): Promise<ParseResult<T>> =>
  new Promise((resolve, reject) => {
    Papa.parse<T>(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ';',
      complete: (results) => resolve(results),
      error: (error) => reject(error),
    });
  });

export const parseLocaleNumber = (value?: string): number | null => {
  if (!value) return null;
  const normalized = value.trim().replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
};
