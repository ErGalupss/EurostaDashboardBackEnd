import React from 'react';
import { Code, FileCode, Layers, Zap, Database } from 'lucide-react';

const CodeBlock = ({ title, code }: { title: string; code: string }) => (
  <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-900 text-slate-50 my-6">
    <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
      <span className="text-xs font-mono font-medium text-slate-300">{title}</span>
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/50"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
      </div>
    </div>
    <div className="p-4 overflow-x-auto">
      <pre className="text-sm font-mono leading-relaxed text-blue-100">
        <code>{code}</code>
      </pre>
    </div>
  </div>
);

export default function LookML() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">LookML Development</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Modellazione semantica LookML per la gestione degli snapshot e calcolo KPI.
        </p>
      </div>

      {/* 1. View Definition */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <FileCode className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">1. View: incarichi_snapshot.view.lkml</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Definizione completa della view con gestione delle dimensioni temporali e logica di business incapsulata.
          </p>
          
          <CodeBlock 
            title="incarichi_snapshot.view.lkml"
            code={`view: incarichi_snapshot {
  sql_table_name: \`project.dataset.incarichi_snapshot\` ;;
  label: "Incarichi Snapshot"

  # --- Primary Keys & Base Dimensions ---

  dimension: pk {
    primary_key: yes
    hidden: yes
    sql: CONCAT(\${incarico_id}, CAST(\${data_snapshot_raw} AS STRING)) ;;
    description: "Chiave univoca composta da Incarico + Data Snapshot"
  }

  dimension: incarico_id {
    type: string
    sql: \${TABLE}.Incarico ;;
    label: "ID Incarico"
  }

  dimension: partner_id {
    type: string
    sql: \${TABLE}.Partner ;;
    label: "Partner"
    drill_fields: [agente_ufficio, stato_commessa]
  }

  dimension: stato_commessa {
    type: string
    sql: \${TABLE}.Stato_Commessa ;;
    label: "Stato Commessa"
  }

  dimension: esito_rintraccio {
    type: string
    sql: \${TABLE}.Esito ;;
    label: "Esito Rintraccio"
  }

  dimension: agente_ufficio {
    type: string
    sql: \${TABLE}.Agente_Ufficio ;;
    label: "Agente / Ufficio"
  }

  # --- Date Dimension Groups ---

  dimension_group: data_snapshot {
    type: time
    timeframes: [raw, date, week, month, quarter, year]
    datatype: date
    sql: \${TABLE}.Data_Snapshot ;;
    label: "Data Snapshot"
  }

  dimension_group: data_richiesta {
    type: time
    timeframes: [raw, date, month, year]
    datatype: date
    sql: \${TABLE}.Data_richiesta ;;
    label: "Data Richiesta"
  }

  dimension_group: data_chiusura {
    type: time
    timeframes: [raw, date, month, year]
    datatype: date
    sql: \${TABLE}.Data_chiusura ;;
    label: "Data Chiusura"
  }

  # --- Calculated Dimensions ---

  dimension: days_open {
    type: number
    description: "Giorni trascorsi dalla richiesta alla data dello snapshot"
    sql: DATE_DIFF(\${data_snapshot_date}, \${data_richiesta_date}, DAY) ;;
    hidden: yes
  }

  dimension: is_open {
    type: yesno
    sql: \${stato_commessa} = 'Aperta' ;;
    hidden: yes
  }

  dimension: is_closed {
    type: yesno
    sql: \${stato_commessa} = 'Chiusa' ;;
    hidden: yes
  }

  dimension: is_over_60 {
    type: yesno
    sql: \${days_open} > 60 AND \${is_open} ;;
    hidden: yes
  }

  dimension: aging_bucket {
    type: string
    label: "Fascia Aging"
    case: {
      when: { sql: \${days_open} < 10 ;; label: "0-10 gg" }
      when: { sql: \${days_open} < 30 ;; label: "10-30 gg" }
      when: { sql: \${days_open} < 60 ;; label: "30-60 gg" }
      else: "Over 60 gg"
    }
  }

  # --- Measures (KPIs) ---

  measure: count {
    type: count
    label: "Totale Record"
    drill_fields: [detail*]
  }

  measure: backlog_count {
    type: count
    label: "Backlog (Vol. Aperte)"
    description: "Numero totale di pratiche aperte alla data dello snapshot"
    filters: [is_open: "yes"]
    drill_fields: [detail*]
  }

  measure: average_aging {
    type: average
    label: "Aging Medio (gg)"
    description: "Età media delle pratiche aperte nel backlog"
    sql: \${days_open} ;;
    filters: [is_open: "yes"]
    value_format_name: decimal_1
  }

  measure: count_over_60 {
    type: count
    label: "Vol. Over 60gg"
    filters: [is_over_60: "yes"]
  }

  measure: percent_over_60 {
    type: number
    label: "% Over 60gg"
    description: "Percentuale di backlog che supera i 60 giorni di anzianità"
    sql: 1.0 * \${count_over_60} / NULLIF(\${backlog_count}, 0) ;;
    value_format_name: percent_1
    html: 
      {% if value > 0.2 %}
        <span style="color: #dc2626; font-weight: bold;">{{ rendered_value }}</span>
      {% else %}
        <span style="color: #16a34a;">{{ rendered_value }}</span>
      {% endif %} ;;
  }

  measure: average_tat {
    type: average
    label: "Tempo Medio Chiusura (TAT)"
    description: "Giorni medi impiegati per chiudere una pratica (Turnaround Time)"
    sql: DATE_DIFF(\${data_chiusura_date}, \${data_richiesta_date}, DAY) ;;
    filters: [is_closed: "yes"]
    value_format_name: decimal_1
  }

  measure: throughput_velocity {
    type: count
    label: "Velocità Evasione (Throughput)"
    description: "Numero di pratiche chiuse nel periodo (basato su Data Chiusura)"
    filters: [is_closed: "yes"]
    drill_fields: [detail*]
  }

  measure: saturation_index {
    type: number
    label: "Indice Saturazione"
    description: "Rapporto tra Backlog e Velocità Evasione mensile stimata (Backlog / (Throughput * 22gg))"
    # Nota: Questo è un calcolo semplificato. Per precisione maggiore, usare derived table per throughput medio mobile.
    sql: \${backlog_count} / NULLIF(\${throughput_velocity}, 0) ;;
    value_format_name: decimal_2
    html:
      {% if value > 1.5 %}
        <span style="color: #dc2626;">{{ rendered_value }} (Critico)</span>
      {% elsif value > 1.0 %}
        <span style="color: #d97706;">{{ rendered_value }} (Warning)</span>
      {% else %}
        <span style="color: #16a34a;">{{ rendered_value }} (Ok)</span>
      {% endif %} ;;
  }

  measure: success_rate {
    type: number
    label: "Success Rate"
    description: "Percentuale di esiti positivi sul totale chiuso"
    sql: 1.0 * COUNT(CASE WHEN \${esito_rintraccio} = 'Positivo' THEN 1 END) / NULLIF(\${throughput_velocity}, 0) ;;
    value_format_name: percent_1
  }

  # --- Sets ---

  set: detail {
    fields: [incarico_id, partner_id, data_richiesta_date, days_open, stato_commessa, esito_rintraccio]
  }
}
`}
          />
        </div>
      </section>

      {/* 2. Explore Definition */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <Layers className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">2. Model & Explore</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Configurazione dell'Explore per forzare l'utilizzo dell'ultimo snapshot di default, 
            evitando aggregazioni errate su tutto lo storico.
          </p>
          
          <CodeBlock 
            title="rintraccio.model.lkml"
            code={`explore: incarichi_snapshot {
  label: "Analisi Operativa Rintraccio"
  description: "Analisi backlog e performance su snapshot storici"

  # Best Practice: Filtra sempre per l'ultimo snapshot di default
  # per mostrare la situazione "ad oggi" se non specificato diversamente.
  always_filter: {
    filters: [data_snapshot_date: "today"]
  }

  # Join opzionale con anagrafica partner se separata
  # join: dim_partner {
  #   type: left_outer
  #   relationship: many_to_one
  #   sql_on: \${incarichi_snapshot.partner} = \${dim_partner.partner_id} ;;
  # }
}`}
          />
        </div>
      </section>

      {/* 3. Performance Tips */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
          <Zap className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">3. Performance & Best Practices</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400 mt-1">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Partizionamento BigQuery</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Assicurarsi che la tabella sottostante sia partizionata su <code>Data_Snapshot</code>. 
                  Looker passerà automaticamente il filtro di partizione nella clausola WHERE, riducendo i costi.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400 mt-1">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Symmetric Aggregates</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Definire sempre una <code>primary_key</code> univoca nella view (es. Incarico + Data Snapshot). 
                  Questo permette a Looker di calcolare correttamente le misure anche in caso di fan-out dei join.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
