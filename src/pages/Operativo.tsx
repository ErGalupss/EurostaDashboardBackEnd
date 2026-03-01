import React, { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { ChartContainer } from '../components/ChartContainer';
import { differenceInDays, parseISO, format } from 'date-fns';
import { AlertTriangle, Clock, UserCheck } from 'lucide-react';

import { isClosed } from '../lib/data';

export default function Operativo() {
  const { filteredData: data } = useDashboard();

  const openTickets = useMemo(() => data.filter(d => !isClosed(d.StatoWorkFlow)), [data]);

  const agingData = useMemo(() => {
    const buckets = { '< 10gg': 0, '10-30gg': 0, '30-60gg': 0, '> 60gg': 0 };
    openTickets.forEach(d => {
      const days = differenceInDays(new Date(), parseISO(d.DataRichiesta));
      if (days < 10) buckets['< 10gg']++;
      else if (days < 30) buckets['10-30gg']++;
      else if (days < 60) buckets['30-60gg']++;
      else buckets['> 60gg']++;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [openTickets]);

  const requesterPerformance = useMemo(() => {
    const requesters: Record<string, { name: string; total: number; closed: number }> = {};
    data.forEach(d => {
      if (!requesters[d.Richiedente]) requesters[d.Richiedente] = { name: d.Richiedente, total: 0, closed: 0 };
      requesters[d.Richiedente].total++;
      if (isClosed(d.StatoWorkFlow)) requesters[d.Richiedente].closed++;
    });
    return Object.values(requesters)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [data]);

  const bottlenecks = useMemo(() => {
    return openTickets
      .map(d => ({
        ...d,
        daysOpen: differenceInDays(new Date(), parseISO(d.DataRichiesta))
      }))
      .sort((a, b) => b.daysOpen - a.daysOpen)
      .slice(0, 5);
  }, [openTickets]);

  const closedWithoutCategory = useMemo(() => {
    return data.filter(d => 
      isClosed(d.StatoWorkFlow) && 
      !d.CategoriaRiscontrata
    );
  }, [data]);

  const [closedFilters, setClosedFilters] = React.useState<Record<string, string>>({
    Incarico: '',
    Richiedente: '',
    StatoWorkFlow: '',
    DataRichiesta: '',
    Commessa: ''
  });

  const filteredClosedWithoutCategory = useMemo(() => {
    return closedWithoutCategory.filter(item => {
      return Object.entries(closedFilters).every(([key, value]) => {
        if (!value) return true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const itemValue = String((item as any)[key] || '').toLowerCase();
        return itemValue.includes((value as string).toLowerCase());
      });
    });
  }, [closedWithoutCategory, closedFilters]);

  return (
    <div className="flex flex-col gap-[var(--section-spacing)]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Controllo Operativo</h1>
        <p className="text-slate-500 dark:text-slate-400">Monitoraggio SLA e carichi di lavoro per richiedente.</p>
      </div>

      <div className="grid-12">
        <div className="col-span-12 lg:col-span-4 card-standard flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Aging Incarichi Aperti</h3>
            <Clock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="flex-1 w-full min-h-0">
            <ChartContainer minHeight={300}>
              <BarChart data={agingData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 card-standard flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Volume per Richiedente (Top 10)</h3>
            <UserCheck className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="flex-1 w-full min-h-0">
            <ChartContainer minHeight={300}>
              <BarChart data={requesterPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Legend />
                <Bar dataKey="total" name="Totale" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="closed" name="Completati" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      <div className="card-standard !p-0 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Incarichi Critici (SLA Risk)
          </h3>
          <span className="text-xs font-medium bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-2 py-1 rounded-full">Top 5 Ritardi</span>
        </div>
        <div className="table-container border-none rounded-none">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th>Incarico</th>
                <th>Richiedente</th>
                <th>Stato Workflow</th>
                <th>Data Richiesta</th>
                <th className="text-right">Giorni Aperti</th>
                <th className="text-right">Commessa</th>
              </tr>
            </thead>
            <tbody>
              {bottlenecks.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium text-slate-900 dark:text-white">{item.Incarico}</td>
                  <td className="text-slate-600 dark:text-slate-400">{item.Richiedente}</td>
                  <td>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {item.StatoWorkFlow}
                    </span>
                  </td>
                  <td className="text-slate-600 dark:text-slate-400">{format(parseISO(item.DataRichiesta), 'dd/MM/yyyy')}</td>
                  <td className="text-right font-bold text-rose-600 dark:text-rose-400">{item.daysOpen}</td>
                  <td className="text-right text-slate-600 dark:text-slate-400">{item.Commessa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Table for Closed without Category */}
      {closedWithoutCategory.length > 0 && (
        <div className="card-standard !p-0 overflow-hidden flex flex-col h-[500px]">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Posizioni Chiuse Senza Categoria
            </h3>
            <span className="text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">
              {filteredClosedWithoutCategory.length} / {closedWithoutCategory.length} Posizioni
            </span>
          </div>
          <div className="table-container flex-1 border-none rounded-none">
            <table className="table-enterprise">
              <thead>
                <tr>
                  <th className="min-w-[150px]">
                    <div className="space-y-2">
                      <span>Incarico</span>
                      <input 
                        type="text" 
                        placeholder="Filtra..." 
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={closedFilters.Incarico}
                        onChange={(e) => setClosedFilters(prev => ({ ...prev, Incarico: e.target.value }))}
                      />
                    </div>
                  </th>
                  <th className="min-w-[200px]">
                    <div className="space-y-2">
                      <span>Richiedente</span>
                      <input 
                        type="text" 
                        placeholder="Filtra..." 
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={closedFilters.Richiedente}
                        onChange={(e) => setClosedFilters(prev => ({ ...prev, Richiedente: e.target.value }))}
                      />
                    </div>
                  </th>
                  <th className="min-w-[200px]">
                    <div className="space-y-2">
                      <span>Stato Workflow</span>
                      <input 
                        type="text" 
                        placeholder="Filtra..." 
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={closedFilters.StatoWorkFlow}
                        onChange={(e) => setClosedFilters(prev => ({ ...prev, StatoWorkFlow: e.target.value }))}
                      />
                    </div>
                  </th>
                  <th className="min-w-[150px]">
                    <div className="space-y-2">
                      <span>Data Richiesta</span>
                      <input 
                        type="text" 
                        placeholder="Filtra..." 
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={closedFilters.DataRichiesta}
                        onChange={(e) => setClosedFilters(prev => ({ ...prev, DataRichiesta: e.target.value }))}
                      />
                    </div>
                  </th>
                  <th className="min-w-[150px]">
                    <div className="space-y-2">
                      <span>Commessa</span>
                      <input 
                        type="text" 
                        placeholder="Filtra..." 
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={closedFilters.Commessa}
                        onChange={(e) => setClosedFilters(prev => ({ ...prev, Commessa: e.target.value }))}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClosedWithoutCategory.map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium text-slate-900 dark:text-white">{item.Incarico}</td>
                    <td className="text-slate-600 dark:text-slate-400">{item.Richiedente}</td>
                    <td>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                        {item.StatoWorkFlow}
                      </span>
                    </td>
                    <td className="text-slate-600 dark:text-slate-400">{format(parseISO(item.DataRichiesta), 'dd/MM/yyyy')}</td>
                    <td className="text-slate-600 dark:text-slate-400">{item.Commessa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
