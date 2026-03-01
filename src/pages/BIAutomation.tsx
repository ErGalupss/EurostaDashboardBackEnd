import React from 'react';
import { 
  Bell, 
  ShieldAlert, 
  Activity, 
  Mail, 
  Cpu, 
  Siren,
  CheckCircle2,
  Clock,
  TrendingUp
} from 'lucide-react';

const AlertCard = ({ title, threshold, condition, severity }: { title: string; threshold: string; condition: string; severity: 'low' | 'medium' | 'high' }) => {
  const colors = {
    low: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300",
    medium: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300",
    high: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-900/30 text-rose-800 dark:text-rose-300"
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[severity]} flex flex-col gap-2`}>
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-sm uppercase tracking-wider">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full font-bold bg-white/50 dark:bg-black/20`}>
          {severity.toUpperCase()}
        </span>
      </div>
      <div className="font-mono text-lg font-bold">{threshold}</div>
      <p className="text-xs opacity-80">{condition}</p>
    </div>
  );
};

const CodeSnippet = ({ code }: { code: string }) => (
  <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800">
    <pre>{code}</pre>
  </div>
);

export default function BIAutomation() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">BI Automation & Alerting</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Sistemi di monitoraggio automatico, regole di alert e gestione del rischio operativo.
        </p>
      </div>

      {/* 1. Regole di Alert Operative */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <Siren className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">1. Regole di Alert Operative</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AlertCard 
            title="Saturazione Operativa" 
            threshold="> 1.2 Indice" 
            condition="Backlog / (Avg_Daily_Capacity * 22) > 1.2" 
            severity="high" 
          />
          <AlertCard 
            title="Degrado Aging" 
            threshold="+15% WoW" 
            condition="Aging Medio Settimana Corrente > Aging Medio Settimana Prec * 1.15" 
            severity="medium" 
          />
          <AlertCard 
            title="Blocco PEC" 
            threshold="< 95% Successo" 
            condition="Tasso Consegna PEC < 95% su finestra mobile 24h" 
            severity="high" 
          />
        </div>
      </section>

      {/* 2. Risk Scoring Models */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <ShieldAlert className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">2. Modelli di Scoring Rischio</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backlog Risk Score */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              Scoring Rischio Backlog (0-100)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Valuta la sostenibilità del carico di lavoro attuale.</p>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between p-2 bg-slate-50 dark:bg-slate-900/50 rounded">
                <span className="dark:text-slate-300">Indice Saturazione &gt; 1.5</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">+40 pts</span>
              </li>
              <li className="flex justify-between p-2 bg-slate-50 dark:bg-slate-900/50 rounded">
                <span className="dark:text-slate-300">Net Flow Ratio &gt; 1.1</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">+30 pts</span>
              </li>
              <li className="flex justify-between p-2 bg-slate-50 dark:bg-slate-900/50 rounded">
                <span className="dark:text-slate-300">Trend Inflow &gt; +20% MoM</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">+30 pts</span>
              </li>
            </ul>
          </div>

          {/* SLA Risk Score */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              Scoring Rischio SLA (0-100)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Valuta la probabilità di violazione dei tempi contrattuali.</p>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between p-2 bg-slate-50 dark:bg-slate-900/50 rounded">
                <span className="dark:text-slate-300">% Pratiche in "Danger Zone" (45-60gg) &gt; 20%</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">+50 pts</span>
              </li>
              <li className="flex justify-between p-2 bg-slate-50 dark:bg-slate-900/50 rounded">
                <span className="dark:text-slate-300">Aging Medio &gt; 40gg</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">+30 pts</span>
              </li>
              <li className="flex justify-between p-2 bg-slate-50 dark:bg-slate-900/50 rounded">
                <span className="dark:text-slate-300">Velocità Evasione &lt; Target SLA</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">+20 pts</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Modello Rischio Complessivo (Total Risk Score)</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Combinazione ponderata per determinare la priorità di intervento su Partner/Agente.
          </p>
          <CodeSnippet code={`Total_Risk_Score = (Backlog_Score * 0.4) + (SLA_Score * 0.6)

IF Total_Risk_Score >= 80:
    Status = "CRITICAL" -> Alert Immediato a Ops Manager
ELIF Total_Risk_Score >= 50:
    Status = "WARNING" -> Inserimento in Daily Watchlist
ELSE:
    Status = "NORMAL" -> Monitoraggio Standard`} />
        </div>
      </section>

      {/* 3. Automazione & Frequenza */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
          <Mail className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">3. Automazione & Frequenza Monitoraggio</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="relative border-l-2 border-slate-200 dark:border-slate-700 pl-8 space-y-8">
            <div className="relative">
              <div className="absolute -left-[41px] bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full w-6 h-6 flex items-center justify-center">
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Real-time (Ogni 15 min)</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Monitoraggio invio PEC e errori tecnici. Alert immediato via Slack/Email al supporto IT.</p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[41px] bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-full w-6 h-6 flex items-center justify-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Giornaliero (08:00 AM)</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Calcolo Risk Score su snapshot notturno. Invio "Daily Risk Report" ai Team Leader con lista priorità.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[41px] bg-white dark:bg-slate-800 border-2 border-emerald-500 rounded-full w-6 h-6 flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Settimanale (Lunedì)</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Analisi trend settimanale (WoW). Report direzionale per CDA con KPI strategici.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KPI Critici Settimanali */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <Activity className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">4. KPI Critici (Weekly Review)</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Backlog Health</div>
            <div className="font-mono text-xl font-bold text-slate-900 dark:text-white">% Over 60gg</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target: &lt; 5%</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Efficiency</div>
            <div className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">Velocità Evasione</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pratiche/Giorno</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Quality</div>
            <div className="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400">% PEC OK</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target: &gt; 98%</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Trend</div>
            <div className="font-mono text-xl font-bold text-amber-600 dark:text-amber-400">Net Flow Ratio</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target: &lt; 1.0</div>
          </div>
        </div>
      </section>
    </div>
  );
}
