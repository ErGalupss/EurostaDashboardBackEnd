import React from 'react';
import { 
  FileText, 
  Database, 
  Calculator, 
  Layout, 
  AlertTriangle, 
  Search,
  ArrowRight
} from 'lucide-react';

const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <section className="space-y-4">
    <div className="flex items-center gap-3 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
      <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </section>
);

const CodeSnippet = ({ label, code }: { label: string; code: string }) => (
  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-700">
      {label}
    </div>
    <div className="p-3 font-mono text-xs text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre">
      {code}
    </div>
  </div>
);

const KpiCard = ({ title, formula, desc }: { title: string; formula: string; desc: string }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{title}</h4>
    <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 p-2 rounded text-xs font-mono mb-2 border border-indigo-100 dark:border-indigo-900/50">
      {formula}
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
  </div>
);

export default function AnalystReport() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analyst Report: Progetto Rintraccio BI</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Specifica tecnica completa per l'implementazione del sistema di Business Intelligence.
        </p>
      </div>

      {/* 1. Modello Dati */}
      <Section title="1. Modello Dati Snapshot" icon={Database}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">Logica: Periodic Snapshot Fact Table</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ogni caricamento storicizza l'intero parco pratiche aggiungendo la colonna <code>Data_Snapshot</code>.
              Questo permette analisi di trend (es. "Com'era il backlog il mese scorso?") senza complessi calcoli temporali.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li><strong>Granularità:</strong> 1 Riga per Incarico per Data Snapshot</li>
              <li><strong>Partizionamento:</strong> Su colonna <code>Data_Snapshot</code></li>
              <li><strong>Chiave Primaria (Logica):</strong> <code>Incarico_ID</code> + <code>Data_Snapshot</code></li>
            </ul>
          </div>
          <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-xs">
            <div className="text-slate-400 mb-2">-- Schema BigQuery</div>
            <div>CREATE TABLE `fct_incarichi_snapshot` (</div>
            <div className="pl-4">snapshot_date DATE,</div>
            <div className="pl-4">incarico_id STRING,</div>
            <div className="pl-4">stato_commessa STRING,</div>
            <div className="pl-4">data_richiesta DATE,</div>
            <div className="pl-4">data_chiusura DATE,</div>
            <div className="pl-4">esito STRING,</div>
            <div className="pl-4">...</div>
            <div>) PARTITION BY snapshot_date;</div>
          </div>
        </div>
      </Section>

      {/* 2. KPI Strategici */}
      <Section title="2. KPI Strategici & Operativi" icon={Calculator}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <KpiCard 
            title="Backlog Attuale" 
            formula="COUNT(DISTINCT Incarico) WHERE Stato = 'Aperta' AND Snapshot = MAX(Snapshot)"
            desc="Volume totale pratiche in lavorazione ad oggi."
          />
          <KpiCard 
            title="Turnaround Time (TAT)" 
            formula="AVG(Data_Chiusura - Data_Richiesta) WHERE Stato = 'Chiusa'"
            desc="Tempo medio di attraversamento (velocità di evasione)."
          />
          <KpiCard 
            title="Success Rate" 
            formula="COUNT(Esito='Positivo') / COUNT(Stato='Chiusa')"
            desc="Qualità del rintraccio (percentuale esiti positivi)."
          />
          <KpiCard 
            title="Net Flow Ratio" 
            formula="AVG(Nuovi_Ingressi_7gg) / AVG(Chiusure_7gg)"
            desc=">1 Accumulo (Rischio), <1 Smaltimento (Sano)."
          />
          <KpiCard 
            title="Indice Saturazione" 
            formula="Backlog / (Avg_Daily_Capacity * 22)"
            desc="Mesi lavorativi necessari per smaltire l'arretrato."
          />
          <KpiCard 
            title="% PEC Failure" 
            formula="COUNT(Esito_PEC='Errore') / COUNT(Completo_PEC=True)"
            desc="Tasso di errore tecnico nell'invio PEC."
          />
        </div>
      </Section>

      {/* 3. Campi Calcolati Looker Studio */}
      <Section title="3. Formule Looker Studio" icon={FileText}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CodeSnippet 
            label="Fascia Aging (Buckets)"
            code={`CASE 
  WHEN DATE_DIFF(TODAY(), Data_richiesta) < 30 THEN "0-30 gg"
  WHEN DATE_DIFF(TODAY(), Data_richiesta) < 60 THEN "30-60 gg"
  WHEN DATE_DIFF(TODAY(), Data_richiesta) < 90 THEN "60-90 gg"
  ELSE "Over 90 gg"
END`}
          />
          <CodeSnippet 
            label="Stato SLA (Semaforo)"
            code={`CASE 
  WHEN DATE_DIFF(TODAY(), Data_richiesta) > 60 THEN "🔴 Critical"
  WHEN DATE_DIFF(TODAY(), Data_richiesta) > 45 THEN "🟡 Warning"
  ELSE "🟢 On Track"
END`}
          />
          <CodeSnippet 
            label="Is_Backlog_Snapshot (Filtro)"
            code={`CASE 
  WHEN Stato_Commessa = 'Aperta' THEN 1 
  ELSE 0 
END`}
          />
          <CodeSnippet 
            label="Tempo Lavorazione (Giorni)"
            code={`DATE_DIFF(
  COALESCE(Data_chiusura, TODAY()), 
  Data_richiesta
)`}
          />
        </div>
      </Section>

      {/* 4. Struttura Dashboard */}
      <Section title="4. Struttura Dashboard (4 Pagine)" icon={Layout}>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-bold px-3 py-1 rounded text-sm">PG 1</div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Overview (C-Level)</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">KPI Card (Backlog, TAT, Success Rate), Trend Volumi Mensili, Top 5 Rischi.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-bold px-3 py-1 rounded text-sm">PG 2</div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Analisi Partner (Commerciale)</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Matrice Performance (Volumi vs Qualità), Classifica Partner, Dettaglio SLA per Cliente.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-bold px-3 py-1 rounded text-sm">PG 3</div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Controllo Operativo (Team Leader)</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Istogramma Aging, Tabella Pratiche in Scadenza, Carico Lavoro per Agente.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-bold px-3 py-1 rounded text-sm">PG 4</div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Processo PEC (Tecnico)</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Funnel Invio (Da Inviare -&gt; Inviate -&gt; Consegnate), Lista Errori Tecnici.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 5. Indicatori Rischio */}
      <Section title="5. Indicatori di Rischio" icon={AlertTriangle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg border border-rose-100 dark:border-rose-900/30">
            <h4 className="font-bold text-rose-800 dark:text-rose-400 mb-2">Rischio Backlog (Accumulo)</h4>
            <p className="text-sm text-rose-700 dark:text-rose-300 mb-2">
              Si attiva quando il flusso in entrata supera strutturalmente la capacità di evasione.
            </p>
            <div className="font-mono text-xs bg-white dark:bg-slate-900 p-2 rounded border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-400">
              IF (Avg_Inflow_30d &gt; Avg_Outflow_30d * 1.05) THEN "RISCHIO ACCUMULO"
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30">
            <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-2">Rischio SLA (Scadenza)</h4>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
              Si attiva quando una percentuale significativa di pratiche entra nella "Danger Zone" (45-60gg).
            </p>
            <div className="font-mono text-xs bg-white dark:bg-slate-900 p-2 rounded border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-400">
              IF (%_Pratiche_45_60gg &gt; 15%) THEN "RISCHIO SLA"
            </div>
          </div>
        </div>
      </Section>

      {/* 6. Logica Drill-down */}
      <Section title="6. Logica Drill-down" icon={Search}>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-center">
            <div className="font-bold text-slate-900 dark:text-white mb-1">Livello 1</div>
            <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded">KPI Aziendale</div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="text-center">
            <div className="font-bold text-slate-900 dark:text-white mb-1">Livello 2</div>
            <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded">Breakdown Partner</div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="text-center">
            <div className="font-bold text-slate-900 dark:text-white mb-1">Livello 3</div>
            <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded">Performance Agente</div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="text-center">
            <div className="font-bold text-slate-900 dark:text-white mb-1">Livello 4</div>
            <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded">Lista Pratiche</div>
          </div>
        </div>
      </Section>
    </div>
  );
}
