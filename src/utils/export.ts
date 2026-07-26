/**
 * Real, functional data export utilities.
 * Every module uses these to export live data to CSV or JSON files.
 */

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n;]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export interface ExportColumn<T> {
  key: keyof T | string;
  label: string;
  value?: (row: T) => unknown;
}

export function exportToCSV<T>(
rows: T[],
columns: ExportColumn<T>[],
filename: string)
{
  const header = columns.map((c) => csvEscape(c.label)).join(';');
  const body = rows.
  map((row) =>
  columns.
  map((c) =>
  csvEscape(c.value ? c.value(row) : (row as Record<string, unknown>)[c.key as string])
  ).
  join(';')
  ).
  join('\n');
  const csv = '\uFEFF' + header + '\n' + body;
  download(csv, filename.endsWith('.csv') ? filename : `${filename}.csv`, 'text/csv;charset=utf-8;');
}

export function exportToJSON<T>(rows: T[], filename: string) {
  download(
    JSON.stringify(rows, null, 2),
    filename.endsWith('.json') ? filename : `${filename}.json`,
    'application/json'
  );
}

export function timestampedName(base: string): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
    d.getDate()
  ).padStart(2, '0')}`;
  return `${base}_${stamp}`;
}