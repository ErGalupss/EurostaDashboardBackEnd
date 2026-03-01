import React, { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import MetricCard from '../components/MetricCard';
import { ChartContainer } from '../components/ChartContainer';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  TrendingUp 
} from 'lucide-react';
import { calculateKPIs, getTrendData, getStatusDistribution } from '../lib/kpiUtils';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Overview() {
  const { filteredData: data, isLoading } = useDashboard();
  const [hiddenStates, setHiddenStates] = React.useState<string[]>([]);

  const kpis = useMemo(() => {
    if (!data.length) return null;
    return calculateKPIs(data);
  }, [data]);

  const trendData = useMemo(() => {
    if (!data.length) return [];
    return getTrendData(data);
  }, [data]);

  const allStatusData = useMemo(() => {
    if (!data.length) return [];
    return getStatusDistribution(data).slice(0, 10);
  }, [data]);

  const visibleStatusData = useMemo(() => {
    return allStatusData.filter(d => !hiddenStates.includes(d.name));
  }, [allStatusData, hiddenStates]);

  const toggleState = (name: string) => {
    setHiddenStates(prev => 
      prev.includes(name) 
        ? prev.filter(s => s !== name)
        : [...prev, name]
    );
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Caricamento dati...</div>;
  if (!kpis) return (
    <div className="space-y-6">
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
        Nessun dato disponibile. Carica un file Excel o modifica i filtri.
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-[var(--section-spacing)]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cruscotto</h1>
        <p className="text-slate-500 dark:text-slate-400">Panoramica generale delle performance di rintraccio.</p>
      </div>

      <div className="grid-12">
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <MetricCard 
            label="Totale Incarichi (Filtrati)" 
            value={kpis.total} 
            icon={Briefcase}
            trend={0}
            color="indigo"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <MetricCard 
            label="Tasso di Chiusura" 
            value={`${kpis.closedPercentage.toFixed(1)}%`} 
            icon={CheckCircle}
            trend={0}
            color="emerald"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <MetricCard 
            label="Tempo Medio (TAT)" 
            value={`${kpis.avgTAT.toFixed(1)} gg`} 
            icon={Clock}
            trend={0}
            color="amber"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <MetricCard 
            label="Success Rate" 
            value={`${kpis.successRate.toFixed(1)}%`} 
            icon={TrendingUp}
            trend={0}
            color="rose"
          />
        </div>
      </div>

      <div className="grid-12">
        <div className="col-span-12 lg:col-span-8 card-standard h-[500px] flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Trend Volumi</h3>
          <div className="flex-1 min-h-0 w-full">
            <ChartContainer minHeight={400}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRichieste" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorChiuse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="Richieste" stroke="#6366f1" fillOpacity={1} fill="url(#colorRichieste)" strokeWidth={2} />
                <Area type="monotone" dataKey="Chiuse" stroke="#10b981" fillOpacity={1} fill="url(#colorChiuse)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 card-standard flex flex-col h-[500px]">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Stato Workflow</h3>
          <div className="flex-1 flex flex-col items-center gap-4 min-h-0">
            <div className="h-1/2 w-full min-h-0">
              <ChartContainer minHeight={200}>
                <PieChart>
                  <Pie
                    data={visibleStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {visibleStatusData.map((entry, index) => {
                      const originalIndex = allStatusData.findIndex(s => s.name === entry.name);
                      return <Cell key={`cell-${index}`} fill={COLORS[originalIndex % COLORS.length]} />;
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartContainer>
            </div>
            <div className="w-full flex-1 flex flex-col justify-start space-y-3 overflow-y-auto pr-2">
              {allStatusData.map((entry, index) => {
                const isHidden = hiddenStates.includes(entry.name);
                return (
                  <div 
                    key={`legend-${index}`} 
                    className={`flex items-center gap-2 cursor-pointer transition-opacity ${isHidden ? 'opacity-40 grayscale' : 'hover:opacity-80'}`}
                    onClick={() => toggleState(entry.name)}
                  >
                    <div 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                    />
                    <div className="flex flex-col min-w-0">
                      <span className={`text-sm font-medium text-slate-700 dark:text-slate-300 truncate ${isHidden ? 'line-through' : ''}`} title={entry.name}>
                        {entry.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {entry.value} ({((entry.value / kpis.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
