import React, { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { ChevronLeft, ChevronRight, Search, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function DataList() {
  const { filteredData: globalFilteredData, setFilters } = useDashboard();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const navigate = useNavigate();

  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    Incarico: '',
    Commessa: '',
    CPI: '',
    Richiedente: '',
    CodiceFiscale: '',
    RegioneRiferimento: '',
    ProvinciaRichiedente: '',
    StatoWorkFlow: '',
    DataRichiesta: '',
    Lavorata: ''
  });

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({
    key: 'DataRichiesta',
    direction: 'desc'
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleColumnFilterChange = (key: string, value: string) => {
    setColumnFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const filteredData = useMemo(() => {
    let result = globalFilteredData.filter(item => {
      return Object.entries(columnFilters).every(([key, value]) => {
        if (!value) return true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const itemValue = String((item as any)[key] || '').toLowerCase();
        return itemValue.includes((value as string).toLowerCase());
      });
    });

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sortConfig.key];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sortConfig.key];

        if (aValue === bValue) return 0;

        if (sortConfig.key === 'DataRichiesta') {
          return sortConfig.direction === 'asc' 
            ? new Date(aValue).getTime() - new Date(bValue).getTime()
            : new Date(bValue).getTime() - new Date(aValue).getTime();
        }

        const aString = String(aValue || '').toLowerCase();
        const bString = String(bValue || '').toLowerCase();

        if (aString < bString) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aString > bString) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [globalFilteredData, columnFilters, sortConfig]);

  const handleRichiedenteClick = (richiedente: string) => {
    setFilters(prev => ({ ...prev, richiedente: [richiedente] }));
    navigate('/partner');
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredData, currentPage]);

  return (
    <div className="flex flex-col gap-[var(--section-spacing)]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dettaglio Incarichi</h1>
        <p className="text-slate-500 dark:text-slate-400">Visualizza e cerca le singole posizioni.</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Totale Record: {filteredData.length} <span className="text-xs opacity-70">(Filtrati da {globalFilteredData.length})</span>
        </p>
      </div>

      <div className="card-standard !p-0 overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[500px]">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Elenco Posizioni</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-600 dark:text-slate-400"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Pagina {currentPage} di {totalPages || 1}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-600 dark:text-slate-400"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="table-container flex-1 border-none rounded-none">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th className="px-6 py-3 min-w-[150px]">
                  <div className="space-y-2">
                    <button 
                      className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
                      onClick={() => handleSort('Incarico')}
                    >
                      Incarico
                      {sortConfig?.key === 'Incarico' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <input 
                      type="text" 
                      placeholder="Filtra..." 
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={columnFilters.Incarico}
                      onChange={(e) => handleColumnFilterChange('Incarico', e.target.value)}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 min-w-[150px]">
                  <div className="space-y-2">
                    <button 
                      className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
                      onClick={() => handleSort('Commessa')}
                    >
                      Commessa
                      {sortConfig?.key === 'Commessa' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <input 
                      type="text" 
                      placeholder="Filtra..." 
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={columnFilters.Commessa}
                      onChange={(e) => handleColumnFilterChange('Commessa', e.target.value)}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 min-w-[150px]">
                  <div className="space-y-2">
                    <button 
                      className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
                      onClick={() => handleSort('CPI')}
                    >
                      CPI
                      {sortConfig?.key === 'CPI' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <input 
                      type="text" 
                      placeholder="Filtra..." 
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={columnFilters.CPI}
                      onChange={(e) => handleColumnFilterChange('CPI', e.target.value)}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 min-w-[200px]">
                  <div className="space-y-2">
                    <button 
                      className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
                      onClick={() => handleSort('Richiedente')}
                    >
                      Richiedente
                      {sortConfig?.key === 'Richiedente' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <input 
                      type="text" 
                      placeholder="Filtra..." 
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={columnFilters.Richiedente}
                      onChange={(e) => handleColumnFilterChange('Richiedente', e.target.value)}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 min-w-[150px]">
                  <div className="space-y-2">
                    <button 
                      className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
                      onClick={() => handleSort('CodiceFiscale')}
                    >
                      Codice Fiscale
                      {sortConfig?.key === 'CodiceFiscale' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <input 
                      type="text" 
                      placeholder="Filtra..." 
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={columnFilters.CodiceFiscale}
                      onChange={(e) => handleColumnFilterChange('CodiceFiscale', e.target.value)}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 min-w-[150px]">
                  <div className="space-y-2">
                    <button 
                      className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
                      onClick={() => handleSort('RegioneRiferimento')}
                    >
                      Regione
                      {sortConfig?.key === 'RegioneRiferimento' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <input 
                      type="text" 
                      placeholder="Filtra..." 
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={columnFilters.RegioneRiferimento}
                      onChange={(e) => handleColumnFilterChange('RegioneRiferimento', e.target.value)}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 min-w-[150px]">
                  <div className="space-y-2">
                    <button 
                      className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
                      onClick={() => handleSort('ProvinciaRichiedente')}
                    >
                      Provincia
                      {sortConfig?.key === 'ProvinciaRichiedente' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <input 
                      type="text" 
                      placeholder="Filtra..." 
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={columnFilters.ProvinciaRichiedente}
                      onChange={(e) => handleColumnFilterChange('ProvinciaRichiedente', e.target.value)}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 min-w-[200px]">
                  <div className="space-y-2">
                    <button 
                      className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
                      onClick={() => handleSort('StatoWorkFlow')}
                    >
                      Stato Workflow
                      {sortConfig?.key === 'StatoWorkFlow' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <input 
                      type="text" 
                      placeholder="Filtra..." 
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={columnFilters.StatoWorkFlow}
                      onChange={(e) => handleColumnFilterChange('StatoWorkFlow', e.target.value)}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 min-w-[150px]">
                  <div className="space-y-2">
                    <button 
                      className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
                      onClick={() => handleSort('DataRichiesta')}
                    >
                      Data Richiesta
                      {sortConfig?.key === 'DataRichiesta' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <input 
                      type="text" 
                      placeholder="Filtra..." 
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={columnFilters.DataRichiesta}
                      onChange={(e) => handleColumnFilterChange('DataRichiesta', e.target.value)}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 min-w-[100px]">
                  <div className="space-y-2">
                    <button 
                      className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
                      onClick={() => handleSort('Lavorata')}
                    >
                      Lavorata
                      {sortConfig?.key === 'Lavorata' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <input 
                      type="text" 
                      placeholder="Filtra..." 
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={columnFilters.Lavorata}
                      onChange={(e) => handleColumnFilterChange('Lavorata', e.target.value)}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium text-slate-900 dark:text-white">
                    <button 
                      onClick={() => navigate(`/incarico/${item.id}`)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline text-left"
                    >
                      {item.Incarico}
                    </button>
                  </td>
                  <td className="text-slate-600 dark:text-slate-400">{item.Commessa}</td>
                  <td className="text-slate-600 dark:text-slate-400">{item.CPI}</td>
                  <td className="text-slate-600 dark:text-slate-400">
                    <button 
                      onClick={() => handleRichiedenteClick(item.Richiedente)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline text-left"
                    >
                      {item.Richiedente}
                    </button>
                  </td>
                  <td className="font-mono text-xs text-slate-500 dark:text-slate-400">{item.CodiceFiscale}</td>
                  <td className="text-slate-600 dark:text-slate-400">{item.RegioneRiferimento}</td>
                  <td className="text-slate-600 dark:text-slate-400">{item.ProvinciaRichiedente}</td>
                  <td>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {item.StatoWorkFlow}
                    </span>
                  </td>
                  <td className="text-slate-600 dark:text-slate-400">{format(parseISO(item.DataRichiesta), 'dd/MM/yyyy')}</td>
                  <td className="text-slate-600 dark:text-slate-400 font-bold">{item.Lavorata}</td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-slate-400">
                    Nessun dato disponibile
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
