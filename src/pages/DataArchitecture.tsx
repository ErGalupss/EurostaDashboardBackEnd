import React from 'react';
import { 
  Network, 
  Database, 
  FileJson, 
  GitCommit, 
  Cpu, 
  Layers, 
  ArrowRight,
  Key,
  Table,
  Server
} from 'lucide-react';

const SchemaTable = ({ title, type, columns, color }: { title: string; type: string; columns: string[]; color: string }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border-l-4 ${color} p-4 w-full h-full border border-slate-100 dark:border-slate-800`}>
    <div className="flex justify-between items-center mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
      <h3 className="font-bold text-slate-900 dark:text-white font-mono text-sm">{title}</h3>
      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 dark:text-slate-400 uppercase tracking-wider">{type}</span>
    </div>
    <ul className="space-y-1.5">
      {columns.map((col, idx) => (
        <li key={idx} className="text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center">
          {col.includes('PK') ? (
            <Key className="w-3 h-3 mr-2 text-amber-500 flex-shrink-0" />
          ) : col.includes('FK') ? (
            <div className="w-3 h-3 mr-2 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[8px] text-slate-400 dark:text-slate-500 flex-shrink-0">F</div>
          ) : (
            <div className="w-3 h-3 mr-2 flex-shrink-0" />
          )}
          <span className={col.includes('PK') ? 'font-bold text-slate-800 dark:text-slate-200' : ''}>{col}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default function DataArchitecture() {
  return (
    <div className="flex flex-col gap-[var(--section-spacing)] pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Enterprise Data Architecture</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Modello dati scalabile per il controllo operativo degli incarichi di rintraccio.
        </p>
      </div>

      {/* 1. Fact Table & Core Model */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <Database className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">1. Fact Table & Core Model</h2>
        </div>
        
        <div className="card-standard bg-slate-50 dark:bg-slate-900/50">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Il cuore del sistema è una <strong>Periodic Snapshot Fact Table</strong> giornaliera. 
            Questa struttura permette di storicizzare lo stato di ogni incarico nel tempo, abilitando analisi di trend (es. evoluzione backlog) impossibili con un semplice snapshot corrente.
          </p>
          
          <div className="grid-12">
            {/* Fact Table */}
            <div className="col-span-12 lg:col-span-4">
              <SchemaTable 
                title="FCT_INCARICHI_SNAPSHOT" 
                type="FACT TABLE" 
                color="border-indigo-600"
                columns={[
                  "PK Snapshot_Key (Surrogate)",
                  "FK Date_Key (Partition Key)",
                  "FK Partner_Key",
                  "FK Agente_Key",
                  "FK Prodotto_Key",
                  "FK Geo_Key",
                  "FK Stato_Key",
                  "Incarico_ID (Degenerate)",
                  "Days_Open (Metric)",
                  "Valore_Pratica (Metric)",
                  "Is_Backlog (Flag)",
                  "Is_SLA_Breached (Flag)"
                ]} 
              />
            </div>
            
            {/* Dimensions */}
            <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SchemaTable 
                title="DIM_PARTNER" 
                type="SCD TYPE 2" 
                color="border-emerald-500"
                columns={[
                  "PK Partner_Key",
                  "Partner_ID (Natural)",
                  "Ragione_Sociale",
                  "Gruppo_Appartenenza",
                  "Valid_From",
                  "Valid_To",
                  "Is_Current"
                ]} 
              />
              <SchemaTable 
                title="DIM_AGENTE" 
                type="SCD TYPE 2" 
                color="border-emerald-500"
                columns={[
                  "PK Agente_Key",
                  "Agente_ID (Natural)",
                  "Nome_Cognome",
                  "Team_Riferimento",
                  "Livello_Seniority",
                  "Valid_From",
                  "Valid_To"
                ]} 
              />
              <SchemaTable 
                title="DIM_TEMPO" 
                type="DIMENSION" 
                color="border-emerald-500"
                columns={[
                  "PK Date_Key (YYYYMMDD)",
                  "Data_Snapshot",
                  "Anno",
                  "Mese",
                  "Trimestre",
                  "Giorno_Settimana",
                  "Is_Working_Day"
                ]} 
              />
              <SchemaTable 
                title="DIM_STATO" 
                type="DIMENSION" 
                color="border-emerald-500"
                columns={[
                  "PK Stato_Key",
                  "Stato_Commessa",
                  "Esito_Rintraccio",
                  "Stato_Raggruppato",
                  "Is_Closed_State"
                ]} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Strategia Snapshot & Chiavi */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <GitCommit className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">2. Gestione Snapshot & Chiavi</h2>
        </div>
        
        <div className="grid-12">
          <div className="col-span-12 md:col-span-6 card-standard">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">Snapshot Strategy</h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex gap-3">
                <div className="mt-1 min-w-[20px] h-5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <strong>Periodic Snapshot:</strong> Ogni notte viene generata una copia completa delle pratiche aperte e di quelle chiuse nel periodo.
                </div>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 min-w-[20px] h-5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <strong>Partitioning:</strong> La tabella è partizionata fisicamente su <code>Date_Key</code>. Questo garantisce che le query su un giorno specifico leggano solo quella partizione.
                </div>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 min-w-[20px] h-5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <strong>Immutabilità:</strong> Una volta scritta, la partizione di uno snapshot non viene mai modificata (WORM - Write Once Read Many).
                </div>
              </li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-6 card-standard">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">Surrogate Keys vs Natural Keys</h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex gap-3">
                <Key className="w-4 h-4 text-amber-500 mt-0.5" />
                <div>
                  <strong>Surrogate Keys (Integer):</strong> Usate per tutte le Join (es. <code>Partner_Key</code>). Isolano il DW dai cambiamenti dei sistemi sorgente e gestiscono la storia (SCD Type 2).
                </div>
              </li>
              <li className="flex gap-3">
                <Key className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5" />
                <div>
                  <strong>Natural Keys (String):</strong> Usate solo durante l'ETL per il lookup (es. <code>Codice_Fiscale_Partner</code>).
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Performance & Scalabilità */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
          <Server className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">3. Performance & Scalabilità Futura</h2>
        </div>

        <div className="grid-12">
          <div className="col-span-12 sm:col-span-6 md:col-span-4 card-standard">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" /> Indicizzazione
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Oltre al partizionamento per data, utilizzare il <strong>Clustering</strong> su <code>Partner_Key</code> e <code>Stato_Key</code>. Questo ottimizza drasticamente le query filtrate per cliente o stato pratica.
            </p>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 card-standard">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-500" /> Aggregazione
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Creare <strong>Materialized Views</strong> per i KPI di alto livello (es. Backlog mensile per Partner). Evita di scansionare milioni di righe per le dashboard esecutive.
            </p>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 card-standard">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-emerald-500" /> Archiviazione
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Implementare una policy di <strong>Lifecycle Management</strong>: spostare partizioni più vecchie di 24 mesi su Cold Storage (o tabella storica separata) per ridurre i costi di storage attivo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
