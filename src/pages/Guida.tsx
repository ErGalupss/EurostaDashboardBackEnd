import React from 'react';
import { Database, Calculator, Layout, Lightbulb } from 'lucide-react';

export default function Guida() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Guida Tecnica & Implementazione</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Specifiche tecniche per la gestione del dato, formule Looker Studio e best practices UX.
        </p>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <Database className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">1. Modello Dati & Snapshot</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 prose prose-slate dark:prose-invert max-w-none">
          <p>
            Per gestire lo <strong>storico snapshot cumulativo</strong> partendo da un export Excel periodico, 
            è necessario storicizzare il dato in un Data Warehouse (es. BigQuery) o in una tabella SQL dedicata.
          </p>
          <h3 className="text-lg font-semibold mt-4">Struttura Tabella Storicizzata</h3>
          <p>Aggiungere alla struttura originale i seguenti campi tecnici:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><code>snapshot_date</code> (DATE): La data in cui è stato generato l'export.</li>
            <li><code>is_current</code> (BOOLEAN): Flag per identificare l'ultima versione del record.</li>
            <li><code>days_since_last_change</code> (INTEGER): Calcolato come diff tra <code>snapshot_date</code> e <code>Data Ultima Modifica</code>.</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-4">Strategia di Caricamento</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Ad ogni nuovo caricamento, non sovrascrivere i dati precedenti.</li>
            <li>Appendere i nuovi record con la data odierna in <code>snapshot_date</code>.</li>
            <li>Per le analisi "As-Is" (stato attuale), filtrare sempre per <code>snapshot_date = MAX(snapshot_date)</code>.</li>
            <li>Per le analisi di trend (es. "Quanti incarichi erano aperti il mese scorso?"), filtrare per la <code>snapshot_date</code> di fine mese scorso.</li>
          </ol>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
          <Calculator className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">2. Campi Calcolati Looker Studio</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <h4 className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">TAT (Turnaround Time)</h4>
              <code className="text-xs bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 block dark:text-indigo-300">
                DATE_DIFF(Data chiusura, Data richiesta)
              </code>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calcola i giorni impiegati per chiudere la pratica.</p>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <h4 className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Aging (Giorni Aperti)</h4>
              <code className="text-xs bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 block dark:text-indigo-300">
                CASE <br/>
                WHEN Stato Commessa = "Aperta" THEN DATE_DIFF(CURRENT_DATE(), Data richiesta)<br/>
                ELSE 0 <br/>
                END
              </code>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Per pratiche ancora aperte, calcola da quanto tempo sono in lavorazione.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <h4 className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Fascia Aging</h4>
              <code className="text-xs bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 block dark:text-indigo-300">
                CASE <br/>
                WHEN DATE_DIFF(CURRENT_DATE(), Data richiesta) &lt; 10 THEN "&lt; 10gg"<br/>
                WHEN DATE_DIFF(CURRENT_DATE(), Data richiesta) &lt; 30 THEN "10-30gg"<br/>
                ELSE "&gt; 30gg"<br/>
                END
              </code>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <h4 className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Success Rate</h4>
              <code className="text-xs bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 block dark:text-indigo-300">
                COUNT(CASE WHEN Esito = "Positivo" THEN 1 END) / COUNT(CASE WHEN Stato Commessa = "Chiusa" THEN 1 END)
              </code>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <Lightbulb className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">3. UX & Design Decision-Oriented</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 prose prose-slate dark:prose-invert max-w-none">
          <ul className="list-disc pl-5 space-y-4">
            <li>
              <strong>Gerarchia Visiva:</strong> Posizionare i KPI "semaforo" (Rosso/Verde) in alto a sinistra. 
              L'occhio umano scansiona a "F". Le informazioni critiche (es. SLA a rischio) devono essere immediate.
            </li>
            <li>
              <strong>Actionable Insights:</strong> Non mostrare solo "150 pratiche in ritardo". 
              Mostrare una tabella con le "Top 5 pratiche più vecchie" e il nome dell'Agente assegnatario. 
              Questo spinge all'azione immediata.
            </li>
            <li>
              <strong>Drill-down Intuitivo:</strong> Permettere di cliccare su una barra del grafico "Partner" 
              per filtrare l'intera dashboard su quel partner specifico.
            </li>
            <li>
              <strong>Coerenza Cromatica:</strong> Usare sempre lo stesso colore per gli stati (es. Verde = Chiuso/Positivo, 
              Grigio = Aperto, Rosso = Negativo/Errore) in tutti i grafici.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
