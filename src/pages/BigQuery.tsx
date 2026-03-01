import React from 'react';
import { Database, Code, Zap, Layers, Server, ArrowRight } from 'lucide-react';

const SqlBlock = ({ title, code, description }: { title: string; code: string; description?: string }) => (
  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-900 text-slate-50 shadow-sm my-6">
    <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Code className="w-4 h-4 text-indigo-400" />
        <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
      </div>
    </div>
    <div className="p-4 overflow-x-auto">
      <pre className="text-xs sm:text-sm font-mono leading-relaxed text-blue-100">
        <code>{code}</code>
      </pre>
    </div>
    {description && (
      <div className="px-4 py-3 bg-slate-800/50 border-t border-slate-700 text-xs text-slate-400">
        {description}
      </div>
    )}
  </div>
);

export default function BigQuery() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">BigQuery Engineering</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Ottimizzazione schema, partizionamento e query analitiche per dataset snapshot.
        </p>
      </div>

      {/* 1. Schema Definition */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <Server className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">1. Schema Ottimizzato & Partizionamento</h2>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            La tabella è progettata come <strong>Periodic Snapshot Fact Table</strong>. 
            Il partizionamento per <code>Data_Snapshot</code> è cruciale per ridurre i costi di query, 
            permettendo di scansionare solo i giorni di interesse.
          </p>
          
          <SqlBlock 
            title="DDL: Create Table"
            code={`CREATE TABLE \`project.dataset.fct_incarichi_snapshot\`
(
  -- Chiavi e Identificativi
  Data_Snapshot DATE NOT NULL OPTIONS(description="Data di estrazione dello snapshot"),
  Incarico_ID STRING NOT NULL,
  Partner_ID STRING,
  Agente_ID STRING,
  
  -- Dimensioni Stato
  Stato_Commessa STRING, -- 'Aperta', 'Chiusa', 'Annullata'
  Esito_Rintraccio STRING,
  Stato_Occupazionale STRING,
  
  -- Date Evento
  Data_Richiesta DATE,
  Data_Chiusura DATE,
  Data_Ultima_Modifica TIMESTAMP,
  
  -- Metriche e Flag
  Completo_PEC BOOL,
  Esito_PEC STRING,
  Valore_Pratica NUMERIC
)
PARTITION BY Data_Snapshot
CLUSTER BY Partner_ID, Stato_Commessa
OPTIONS(
  require_partition_filter = TRUE,
  description = "Snapshot giornaliero incarichi rintraccio"
);`}
            description="CLUSTER BY ottimizza le performance per i filtri più comuni (Partner e Stato)."
          />
        </div>
      </section>

      {/* 2. KPI Queries */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
          <Database className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">2. Query KPI Operativi</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SqlBlock 
            title="Backlog & Aging Attuale"
            code={`SELECT
  COUNT(*) as Backlog_Volume,
  AVG(DATE_DIFF(Data_Snapshot, Data_Richiesta, DAY)) as Avg_Aging_Days,
  COUNTIF(DATE_DIFF(Data_Snapshot, Data_Richiesta, DAY) > 60) as Over_60_Count,
  SAFE_DIVIDE(
    COUNTIF(DATE_DIFF(Data_Snapshot, Data_Richiesta, DAY) > 60),
    COUNT(*)
  ) as Over_60_Pct
FROM \`project.dataset.fct_incarichi_snapshot\`
WHERE Data_Snapshot = CURRENT_DATE()
  AND Stato_Commessa = 'Aperta'`}
          />

          <SqlBlock 
            title="Trend Storico Backlog"
            code={`SELECT
  Data_Snapshot,
  COUNT(*) as Backlog_Volume,
  AVG(DATE_DIFF(Data_Snapshot, Data_Richiesta, DAY)) as Avg_Aging
FROM \`project.dataset.fct_incarichi_snapshot\`
WHERE Stato_Commessa = 'Aperta'
  -- Filtra ultimi 6 mesi per performance
  AND Data_Snapshot >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
GROUP BY 1
ORDER BY 1 DESC`}
          />
        </div>

        <SqlBlock 
          title="Indice di Saturazione & Velocità Evasione"
          code={`WITH Capacity AS (
  -- Calcola media chiusure giornaliere ultimi 90gg
  SELECT
    AVG(Daily_Closed) as Avg_Daily_Capacity
  FROM (
    SELECT Data_Chiusura, COUNT(*) as Daily_Closed
    FROM \`project.dataset.fct_incarichi_snapshot\`
    WHERE Data_Snapshot = CURRENT_DATE() -- Usa ultimo snapshot per vedere lo storico chiusure
      AND Stato_Commessa = 'Chiusa'
      AND Data_Chiusura >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
    GROUP BY 1
  )
),
Backlog AS (
  SELECT COUNT(*) as Current_Backlog
  FROM \`project.dataset.fct_incarichi_snapshot\`
  WHERE Data_Snapshot = CURRENT_DATE() AND Stato_Commessa = 'Aperta'
)
SELECT
  b.Current_Backlog,
  ROUND(c.Avg_Daily_Capacity, 1) as Avg_Daily_Capacity,
  -- Indice Saturazione: Mesi necessari per smaltire backlog
  ROUND(b.Current_Backlog / (c.Avg_Daily_Capacity * 22), 2) as Saturation_Index_Months
FROM Backlog b, Capacity c`}
          description="L'Indice di Saturazione stima i mesi lavorativi (22gg/mese) necessari per azzerare la coda attuale."
        />
      </section>

      {/* 3. Ranking & Bottlenecks */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <Layers className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">3. Ranking & Colli di Bottiglia</h2>
        </div>

        <SqlBlock 
          title="Partner Performance Ranking"
          code={`SELECT
  Partner_ID,
  COUNT(*) as Total_Assigned,
  COUNTIF(Stato_Commessa = 'Chiusa') as Closed_Vol,
  SAFE_DIVIDE(COUNTIF(Esito_Rintraccio = 'Positivo'), COUNTIF(Stato_Commessa = 'Chiusa')) as Success_Rate,
  AVG(DATE_DIFF(Data_Chiusura, Data_Richiesta, DAY)) as Avg_TAT_Days
FROM \`project.dataset.fct_incarichi_snapshot\`
WHERE Data_Snapshot = CURRENT_DATE()
  AND Data_Richiesta >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
GROUP BY 1
HAVING Total_Assigned > 100 -- Escludi partner piccoli
ORDER BY Success_Rate DESC`}
        />

        <SqlBlock 
          title="Identificazione 'Stuck Tasks' (Colli di Bottiglia)"
          code={`SELECT
  Incarico_ID,
  Partner_ID,
  Agente_ID,
  Data_Richiesta,
  Data_Ultima_Modifica,
  DATE_DIFF(Data_Snapshot, Data_Ultima_Modifica, DAY) as Days_Since_Last_Action
FROM \`project.dataset.fct_incarichi_snapshot\`
WHERE Data_Snapshot = CURRENT_DATE()
  AND Stato_Commessa = 'Aperta'
  -- Pratiche ferme da più di 30 giorni senza aggiornamenti
  AND DATE_DIFF(Data_Snapshot, Data_Ultima_Modifica, DAY) > 30
ORDER BY Days_Since_Last_Action DESC
LIMIT 100`}
          description="Identifica le pratiche 'zombie' che non hanno subito modifiche recenti pur essendo aperte."
        />
      </section>

      {/* 4. Optimization Tips */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <Zap className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">4. Ottimizzazione Costi & Performance</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Partition Pruning</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Usa sempre <code>WHERE Data_Snapshot = ...</code>. Questo riduce i dati scansionati da 500GB a ~500MB per query.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Denormalizzazione</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Evita JOIN costose in fase di analisi. Porta le dimensioni chiave (Nome Partner, Regione) direttamente nella Fact Table durante l'ETL.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Materialized Views</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Per dashboard in tempo reale, crea viste materializzate pre-aggregate per Partner/Mese.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
