import React, { useMemo, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { differenceInDays, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isClosed, isSuccess } from '../lib/data';

export default function Partner() {
  const { filteredData: data, setFilters } = useDashboard();
  const [currentPage, setCurrentPage] = useState(1);
  const [richiedenteFilter, setRichiedenteFilter] = useState('');
  const itemsPerPage = 10;

  const handleRichiedenteClick = (richiedente: string) => {
    setFilters(prev => ({ ...prev, richiedente: [richiedente] }));
    // Already on /partner, but setting the filter will update the view
  };

  const partnerMetrics = useMemo(() => {
    const metrics: Record<string, { 
      name: string; 
      total: number; 
      closed: number; 
      positive: number;
      totalDays: number;
      closedCountForTat: number;
    }> = {};

    data.forEach(d => {
      const partnerName = d.Richiedente || 'N/A';
      if (!metrics[partnerName]) {
        metrics[partnerName] = { 
          name: partnerName, 
          total: 0, 
          closed: 0, 
          positive: 0,
          totalDays: 0,
          closedCountForTat: 0
        };
      }
      
      metrics[partnerName].total++;
      if (isClosed(d.StatoWorkFlow)) {
        metrics[partnerName].closed++;
        if (isSuccess(d.StatoWorkFlow)) metrics[partnerName].positive++;
        metrics[partnerName].totalDays += Math.max(0, differenceInDays(parseISO(d.DataUltimaModifica), parseISO(d.DataRichiesta)));
        metrics[partnerName].closedCountForTat++;
      }
    });

    return Object.values(metrics)
      .filter(m => m.name.toLowerCase().includes(richiedenteFilter.toLowerCase()))
      .map(m => ({
        ...m,
        closedRate: m.total > 0 ? (m.closed / m.total) * 100 : 0,
        successRate: m.closed > 0 ? (m.positive / m.closed) * 100 : 0,
        avgTat: m.closedCountForTat > 0 ? m.totalDays / m.closedCountForTat : 0
      })).sort((a, b) => b.total - a.total);
  }, [data, richiedenteFilter]);

  const totalPages = Math.ceil(partnerMetrics.length / itemsPerPage);
  const paginatedMetrics = partnerMetrics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const topPartnersChart = partnerMetrics.slice(0, 20);

  return (
    <div className="flex flex-col gap-[var(--section-spacing)]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analisi Richiedenti</h1>
        <p className="text-slate-500 dark:text-slate-400">Performance dettagliate per richiedente e commessa.</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Totale Richiedenti: {partnerMetrics.length} | Totale Incarichi: {data.length}</p>
      </div>

      <div className="card-standard flex flex-col h-[500px]">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 shrink-0">Confronto Richiedenti (Top 20 per Volume)</h3>
        <div className="flex-1 w-full min-w-0 relative">
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <BarChart data={topPartnersChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} interval={0} angle={-45} textAnchor="end" />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" />
              <Bar dataKey="total" name="Totale Incarichi" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="closed" name="Completati" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-standard !p-0 overflow-hidden flex flex-col h-[500px]">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Dettaglio Metriche</h3>
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
                <th className="min-w-[200px]">
                  <div className="space-y-2">
                    <span>Richiedente</span>
                    <input 
                      type="text" 
                      placeholder="Filtra..." 
                      className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={richiedenteFilter}
                      onChange={(e) => {
                        setRichiedenteFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </th>
                <th className="text-right">Totale</th>
                <th className="text-right">Completati</th>
                <th className="text-right">% Completamento</th>
                <th className="text-right">% Lavorazione</th>
                <th className="text-right">TAT Medio (gg)</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMetrics.map((partner) => (
                <tr key={partner.name}>
                  <td className="font-medium text-slate-900 dark:text-white">
                    <button 
                      onClick={() => handleRichiedenteClick(partner.name)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline text-left"
                    >
                      {partner.name}
                    </button>
                  </td>
                  <td className="text-right text-slate-600 dark:text-slate-400">{partner.total}</td>
                  <td className="text-right text-slate-600 dark:text-slate-400">{partner.closed}</td>
                  <td className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      partner.closedRate > 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {partner.closedRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right text-slate-600 dark:text-slate-400">{partner.successRate.toFixed(1)}%</td>
                  <td className="text-right text-slate-600 dark:text-slate-400">{partner.avgTat.toFixed(1)}</td>
                </tr>
              ))}
              {paginatedMetrics.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
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
