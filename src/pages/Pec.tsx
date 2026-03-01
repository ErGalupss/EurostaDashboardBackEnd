import React, { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Mail, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { calculateKPIs } from '../lib/kpiUtils';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#ef4444'];

export default function Pec() {
  const { filteredData: data } = useDashboard();

  const kpis = useMemo(() => calculateKPIs(data), [data]);

  const pecData = useMemo(() => {
    return [
      { name: 'Da Inviare', value: kpis.pecDaInviare, fill: '#6366f1' },
      { name: 'Inviate', value: kpis.pecInviate, fill: '#10b981' },
      { name: 'Errori', value: kpis.pecErrori, fill: '#ef4444' }
    ];
  }, [kpis]);

  const [pecFilters, setPecFilters] = React.useState<Record<string, string>>({
    Incarico: '',
    Partner: ''
  });

  const failedPecs = useMemo(() => {
    return data
      .filter(d => (d.EsitoPEC || '').toLowerCase().trim() === 'pec non inviata')
      .filter(item => {
        return Object.entries(pecFilters).every(([key, value]) => {
          if (!value) return true;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const itemValue = String((item as any)[key] || '').toLowerCase();
          return itemValue.includes((value as string).toLowerCase());
        });
      })
      .slice(0, 20);
  }, [data, pecFilters]);

  return (
    <div className="flex flex-col gap-[var(--section-spacing)]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Processo PEC</h1>
        <p className="text-slate-500 dark:text-slate-400">Monitoraggio invio e consegna Posta Elettronica Certificata.</p>
      </div>

      <div className="grid-12">
        <div className="col-span-12 sm:col-span-4">
          <MetricCard 
            label="Da Inviare" 
            value={pecData[0].value} 
            icon={Mail}
            color="indigo"
          />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <MetricCard 
            label="Inviate" 
            value={pecData[1].value} 
            icon={CheckCircle}
            color="emerald"
          />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <MetricCard 
            label="Errori" 
            value={pecData[2].value} 
            icon={AlertCircle}
            color="rose"
          />
        </div>
      </div>

      <div className="grid-12">
        <div className="col-span-12 lg:col-span-5 card-standard flex flex-col h-[500px]">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Funnel di Conversione PEC</h3>
          <div className="flex-1 w-full min-w-0 relative">
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
              <FunnelChart>
                <Tooltip />
                <Funnel
                  dataKey="value"
                  data={pecData}
                  isAnimationActive
                >
                  <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                  {pecData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 card-standard flex flex-col h-[500px] !p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              Errori Recenti
            </h3>
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
                        value={pecFilters.Incarico}
                        onChange={(e) => setPecFilters(prev => ({ ...prev, Incarico: e.target.value }))}
                      />
                    </div>
                  </th>
                  <th>Esito PEC</th>
                  <th className="min-w-[150px]">
                    <div className="space-y-2">
                      <span>Partner</span>
                      <input 
                        type="text" 
                        placeholder="Filtra..." 
                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={pecFilters.Partner}
                        onChange={(e) => setPecFilters(prev => ({ ...prev, Partner: e.target.value }))}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {failedPecs.map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium text-slate-900 dark:text-white">{item.Incarico}</td>
                    <td>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400">
                        {item.EsitoPEC}
                      </span>
                    </td>
                    <td className="text-slate-600 dark:text-slate-400">{item.Partner}</td>
                  </tr>
                ))}
                {failedPecs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                      Nessun errore rilevato
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
