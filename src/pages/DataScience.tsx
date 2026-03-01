import React, { useMemo } from 'react';
import { Brain, Calculator, TrendingUp, AlertTriangle, Sigma, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { ChartContainer } from '../components/ChartContainer';
import { useDashboard } from '../context/DashboardContext';
import { isClosed } from '../lib/data';
import { format, subMonths, startOfMonth, endOfMonth, isBefore, isAfter, parseISO, addMonths } from 'date-fns';
import { it } from 'date-fns/locale';

const FormulaBlock = ({ title, formula, description }: { title: string; formula: string; description: string }) => (
  <div className="bg-slate-900 text-slate-50 rounded-xl p-6 shadow-sm border border-slate-800">
    <h3 className="text-sm font-medium text-indigo-400 mb-3 uppercase tracking-wider">{title}</h3>
    <div className="font-mono text-lg mb-4 bg-slate-800/50 p-3 rounded border border-slate-700/50 overflow-x-auto">
      {formula}
    </div>
    <p className="text-slate-400 text-sm leading-relaxed">
      {description}
    </p>
  </div>
);

export default function DataScience() {
  const { filteredData: data } = useDashboard();

  const { forecastData, kpis } = useMemo(() => {
    if (data.length === 0) return { forecastData: [], kpis: null };
    
    const months = [];
    const now = new Date();
    
    // Historical data (Last 6 months)
    for (let i = 5; i >= 0; i--) {
        const refDate = subMonths(now, i);
        const monthStart = startOfMonth(refDate);
        const monthEnd = endOfMonth(refDate);
        const monthLabel = format(refDate, 'MMM', { locale: it });
        
        const inflow = data.filter(d => {
            const date = parseISO(d.DataRichiesta);
            return date >= monthStart && date <= monthEnd;
        }).length;
        
        const capacity = data.filter(d => {
            if (!isClosed(d.StatoWorkFlow)) return false;
            const date = parseISO(d.DataUltimaModifica);
            return date >= monthStart && date <= monthEnd;
        }).length;
        
        // Backlog at end of month: Created before end of month AND (Not closed OR Closed after end of month)
        const backlog = data.filter(d => {
            const reqDate = parseISO(d.DataRichiesta);
            const closeDate = isClosed(d.StatoWorkFlow) ? parseISO(d.DataUltimaModifica) : null;
            return isBefore(reqDate, monthEnd) && (!closeDate || isAfter(closeDate, monthEnd));
        }).length;

        months.push({
            month: monthLabel,
            backlog,
            capacity,
            inflow,
            isForecast: false
        });
    }

    // Calculate averages for projection (last 3 months)
    const last3Months = months.slice(-3);
    const avgInflow = last3Months.reduce((acc, curr) => acc + curr.inflow, 0) / 3;
    const avgCapacity = last3Months.reduce((acc, curr) => acc + curr.capacity, 0) / 3;
    let lastBacklog = months[months.length - 1].backlog;

    // Forecast (Next 2 months)
    for (let i = 1; i <= 2; i++) {
        const refDate = addMonths(now, i);
        const monthLabel = format(refDate, 'MMM', { locale: it }) + ' (Est)';
        
        // Simple linear projection
        const projectedBacklog = lastBacklog + (avgInflow - avgCapacity);
        lastBacklog = projectedBacklog;

        months.push({
            month: monthLabel,
            backlog: Math.max(0, Math.round(projectedBacklog)),
            capacity: Math.round(avgCapacity),
            inflow: Math.round(avgInflow),
            isForecast: true
        });
    }

    // KPI Calculations
    const currentBacklog = months[5].backlog;
    const forecastBacklog = months[7].backlog;
    const backlogTrend = ((forecastBacklog - currentBacklog) / currentBacklog) * 100;
    
    // Time to clear (months) = Current Backlog / Avg Capacity
    const timeToClear = avgCapacity > 0 ? currentBacklog / avgCapacity : 0;
    
    // Net Flow Ratio
    const nfr = avgCapacity > 0 ? avgInflow / avgCapacity : 0;

    return { 
      forecastData: months, 
      kpis: {
        forecastBacklog,
        backlogTrend,
        timeToClear,
        nfr,
        riskLevel: nfr > 1.1 ? 'High' : nfr > 1.0 ? 'Medium' : 'Low'
      }
    };
  }, [data]);

  if (!kpis) return <div className="p-8 text-center text-slate-500">Caricamento dati...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Data Science & Predictive Analytics</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Modelli statistici per la previsione del backlog e analisi della capacità produttiva.
        </p>
      </div>

      {/* 1. Previsione Backlog */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <Brain className="w-8 h-8" />
          <h2 className="text-2xl font-bold">1. Modello Previsionale Backlog (60gg)</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <p className="text-slate-600 dark:text-slate-400">
              Per stimare il backlog a $t+60$, utilizziamo un modello di <strong>proiezione lineare del flusso netto</strong> basato sulla media mobile degli ultimi 3 mesi.
            </p>
            <FormulaBlock 
              title="Formula di Proiezione"
              formula="B(t+60) = B(t) + [(In_avg - Out_avg) × 60]"
              description="Dove B(t) è il backlog attuale, In_avg è la media giornaliera dei nuovi incarichi (last 90d) e Out_avg è la media giornaliera delle chiusure (last 90d)."
            />
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Simulazione Trend</h4>
            <div className="h-64 w-full min-h-0">
              <ChartContainer minHeight={250}>
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="colorBacklog" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <ReferenceLine x="Current" stroke="#94a3b8" strokeDasharray="3 3" label="Oggi" />
                  <Area type="monotone" dataKey="backlog" stroke="#6366f1" fillOpacity={1} fill="url(#colorBacklog)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Capacità & Saturazione */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
          <Calculator className="w-8 h-8" />
          <h2 className="text-2xl font-bold">2. Capacità Produttiva & Saturazione</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormulaBlock 
            title="Capacità Produttiva Media (CP)"
            formula="CP = Σ(Closed_i) / N_days"
            description="Media mobile semplice delle pratiche chiuse negli ultimi 30 giorni lavorativi. Rappresenta la velocità di crociera del team."
          />
          <FormulaBlock 
            title="Indice di Saturazione (IS)"
            formula="IS = Backlog(t) / (CP × 22)"
            description="Indica quanti 'mesi lavorativi' sono necessari per smaltire l'intero backlog attuale a capacità costante (assumendo 22gg lavorativi/mese)."
          />
        </div>
      </section>

      {/* 3. Analisi del Rischio & Early Warning System */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="w-8 h-8" />
          <h2 className="text-2xl font-bold">3. Risk Analysis & Early Warning System</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Soglia Critica di Accumulo (Critical Threshold)</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Il punto di non ritorno oltre il quale il backlog non può essere smaltito senza risorse aggiuntive, dato il vincolo SLA.
            </p>
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-lg text-rose-800 dark:text-rose-300 font-mono text-sm">
              Threshold_Critica = Capacità_Giornaliera × SLA_Max_Giorni
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Esempio: Se chiudo 10 pratiche/giorno e lo SLA è 60gg, non posso avere più di 600 pratiche in coda.
            </p>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700 pt-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Early Warning System (EWS) Logic</h3>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm text-left min-w-[600px]">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Livello</th>
                    <th className="px-4 py-3">Trigger (Condizione)</th>
                    <th className="px-4 py-3">Azione Automatica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr className="bg-emerald-50/30 dark:bg-emerald-900/10">
                    <td className="px-4 py-3 font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" /> Normal
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">NFR &lt; 1.0 AND Saturazione &lt; 1.0</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitoraggio standard.</td>
                  </tr>
                  <tr className="bg-amber-50/30 dark:bg-amber-900/10">
                    <td className="px-4 py-3 font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" /> Watchlist
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">NFR &gt; 1.05 OR Saturazione &gt; 1.2</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Alert Team Leader. Analisi cause.</td>
                  </tr>
                  <tr className="bg-rose-50/30 dark:bg-rose-900/10">
                    <td className="px-4 py-3 font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500" /> Critical
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">Forecast +60gg &gt; Threshold_Critica</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Escalation CDA. Richiesta budget.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KPI Predittivi per Dashboard */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <TrendingUp className="w-8 h-8" />
          <h2 className="text-2xl font-bold">4. KPI Predittivi da Integrare</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Forecast Backlog +60gg</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{kpis.forecastBacklog}</div>
            <div className={`text-sm mt-1 flex items-center ${kpis.backlogTrend > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {kpis.backlogTrend > 0 ? '+' : ''}{kpis.backlogTrend.toFixed(1)}% vs Oggi
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Time-to-Clear stimato</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{kpis.timeToClear.toFixed(1)} <span className="text-lg font-normal text-slate-500 dark:text-slate-400">mesi</span></div>
            <div className="text-sm text-amber-600 dark:text-amber-400 mt-1">
              Basato su capacità media 3 mesi
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rischio SLA</div>
            <div className={`text-3xl font-bold ${
              kpis.riskLevel === 'High' ? 'text-rose-600 dark:text-rose-400' : 
              kpis.riskLevel === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {kpis.riskLevel}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              NFR = {kpis.nfr.toFixed(2)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
