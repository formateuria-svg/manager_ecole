import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDownIcon, SearchIcon, DownloadIcon } from 'lucide-react';
import { Input } from './Field';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { exportToCSV, exportToJSON, timestampedName, type ExportColumn } from '../../utils/export';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  exportValue?: (row: T) => unknown;
  className?: string;
}

export function DataTable<T extends {id: string;}>({
  rows,
  columns,
  searchKeys,
  exportName,
  emptyTitle = 'Aucune donnée',
  emptyDescription,
  emptyAction








}: {rows: T[];columns: Column<T>[];searchKeys: (row: T) => string;exportName: string;emptyTitle?: string;emptyDescription?: string;emptyAction?: React.ReactNode;}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{key: string;dir: 'asc' | 'desc';} | null>(null);

  const filtered = useMemo(() => {
    let out = rows;
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((r) => searchKeys(r).toLowerCase().includes(q));
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sortValue) {
        out = [...out].sort((a, b) => {
          const av = col.sortValue!(a);
          const bv = col.sortValue!(b);
          if (av < bv) return sort.dir === 'asc' ? -1 : 1;
          if (av > bv) return sort.dir === 'asc' ? 1 : -1;
          return 0;
        });
      }
    }
    return out;
  }, [rows, query, sort, columns, searchKeys]);

  const doExport = (fmt: 'csv' | 'json') => {
    const cols: ExportColumn<T>[] = columns.map((c) => ({
      key: c.key,
      label: c.label,
      value: c.exportValue
    }));
    if (fmt === 'csv') exportToCSV(filtered, cols, timestampedName(exportName));else
    exportToJSON(filtered, timestampedName(exportName));
  };

  const toggleSort = (key: string) => {
    setSort((s) =>
    s?.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-smoke" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            className="pl-9"
            aria-label="Rechercher" />
          
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs font-semibold text-smoke sm:inline">
            {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
          </span>
          <Button size="sm" variant="outline" onClick={() => doExport('csv')}>
            <DownloadIcon className="h-4 w-4" /> CSV
          </Button>
          <Button size="sm" variant="ghost" onClick={() => doExport('json')}>
            JSON
          </Button>
        </div>
      </div>

      {filtered.length === 0 ?
      <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} /> :

      <div className="overflow-x-auto rounded-xl2 border-2 border-ink bg-paper shadow-hard-sm">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink bg-canvas">
                {columns.map((c) =>
              <th
                key={c.key}
                className={`px-4 py-3 font-display text-xs font-bold uppercase tracking-wide text-ink ${c.className ?? ''}`}>
                
                    {c.sortValue ?
                <button
                  onClick={() => toggleSort(c.key)}
                  className="inline-flex items-center gap-1 hover:text-plum">
                  
                        {c.label}
                        <ArrowUpDownIcon className="h-3 w-3" />
                      </button> :

                c.label
                }
                  </th>
              )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) =>
            <motion.tr
              key={row.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              className="border-b border-line last:border-0 transition-colors hover:bg-lime-soft/40">
              
                  {columns.map((c) =>
              <td key={c.key} className={`px-4 py-3 align-middle ${c.className ?? ''}`}>
                      {c.render ? c.render(row) : (row as Record<string, unknown>)[c.key] as React.ReactNode}
                    </td>
              )}
                </motion.tr>
            )}
            </tbody>
          </table>
        </div>
      }
    </div>);

}