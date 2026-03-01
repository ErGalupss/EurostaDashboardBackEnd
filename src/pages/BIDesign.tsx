import React from 'react';
import { 
  LayoutTemplate, 
  Palette, 
  Eye, 
  MousePointerClick, 
  BarChart3, 
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  Layout,
  BookOpen
} from 'lucide-react';

const DesignCard = ({ title, icon: Icon, children, color = "indigo" }: { title: string; icon: any; children: React.ReactNode; color?: string }) => {
  const colorClasses = {
    indigo: "border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400",
    rose: "border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400",
    emerald: "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
    amber: "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
};

export default function BIDesign() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">BI Design System & UX Guidelines</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Linee guida per la progettazione di dashboard esecutive ad alto impatto per il CDA.
        </p>
      </div>

      {/* 1. Layout & Gerarchia */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <LayoutTemplate className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">1. Layout & Gerarchia Informativa</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <DesignCard title="La Regola dei 5 Secondi" icon={Eye} color="indigo">
              <p>Un executive deve capire lo stato di salute del business entro <strong>5 secondi</strong> dall'apertura della dashboard.</p>
              <ul className="list-disc pl-4 space-y-1 mt-2">
                <li>Usa indicatori semaforici (Rosso/Verde) sui KPI principali.</li>
                <li>Niente tabelle dense nella prima schermata.</li>
                <li>Mostra sempre il confronto (vs Mese Precedente o vs Budget).</li>
              </ul>
            </DesignCard>
            
            <DesignCard title="Progressive Disclosure" icon={MousePointerClick} color="indigo">
              <p>Non mostrare tutto subito. Usa la tecnica del drill-down:</p>
              <p className="font-mono text-xs bg-slate-100 dark:bg-slate-900 p-2 rounded mt-2 dark:text-indigo-300">
                Livello 1 (Summary) -&gt; Click su "Backlog" -&gt; Livello 2 (Breakdown per Partner) -&gt; Click su Partner -&gt; Livello 3 (Lista Pratiche)
              </p>
            </DesignCard>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Gerarchia Visiva KPI (Z-Pattern)</h3>
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="bg-white dark:bg-slate-900 border-2 border-indigo-500 border-dashed rounded-lg p-4 flex flex-col justify-center items-center text-center">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">1. Top Left</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">KPI Primario (es. Backlog)</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 border-dashed rounded-lg p-4 flex flex-col justify-center items-center text-center">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">2. Top Right</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">KPI Secondario (es. Trend)</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 border-dashed rounded-lg p-4 flex flex-col justify-center items-center text-center col-span-2 h-32">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">3. Center / Bottom</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">Dettaglio / Breakdown (Grafici Complessi)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Page Layouts */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <Layout className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">2. Layout Pagina per Pagina</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2">Pagina 1</div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Overview Direzionale</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li>• <strong>BANs:</strong> Backlog, TAT, Success Rate</li>
              <li>• <strong>Chart:</strong> Trend Volumi (Line)</li>
              <li>• <strong>Focus:</strong> Top 5 Rischi SLA (Table)</li>
              <li>• <strong>Goal:</strong> Health Check immediato</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2">Pagina 2</div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Analisi Partner</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li>• <strong>Chart:</strong> Scatter Plot (Volumi vs Qualità)</li>
              <li>• <strong>Chart:</strong> Bar Chart (Ranking Partner)</li>
              <li>• <strong>Table:</strong> Dettaglio SLA per Cliente</li>
              <li>• <strong>Goal:</strong> Gestione Commerciale</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2">Pagina 3</div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Controllo Operativo</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li>• <strong>Chart:</strong> Istogramma Aging (Buckets)</li>
              <li>• <strong>Table:</strong> Pratiche in Scadenza (Actionable)</li>
              <li>• <strong>Chart:</strong> Carico Lavoro Agente (Heatmap)</li>
              <li>• <strong>Goal:</strong> Prioritizzazione Team</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2">Pagina 4</div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Processo PEC</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li>• <strong>Chart:</strong> Funnel Invio (Sankey/Bar)</li>
              <li>• <strong>KPI:</strong> % Errore Tecnico</li>
              <li>• <strong>Table:</strong> Log Errori Dettagliato</li>
              <li>• <strong>Goal:</strong> Debugging Tecnico</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Visual Language */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
          <Palette className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">3. Visual Language & Colori</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Codice Colore Semantico</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Good / On Target</span>
                <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                <span className="text-amber-700 dark:text-amber-400 font-medium">Warning / At Risk</span>
                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-100 dark:border-rose-900/30">
                <span className="text-rose-700 dark:text-rose-400 font-medium">Critical / Off Target</span>
                <div className="w-4 h-4 rounded-full bg-rose-500"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Neutral / Context</span>
                <div className="w-4 h-4 rounded-full bg-slate-400"></div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Guida alla Scelta dei Grafici</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300 font-medium">
                  <BarChart3 className="w-4 h-4" /> Confronto Categorie
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Usa <strong>Bar Chart Orizzontali</strong> per Partner o Regioni (etichette lunghe leggibili).</p>
              </div>
              <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300 font-medium">
                  <TrendingUp className="w-4 h-4" /> Trend Temporali
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Usa <strong>Line Chart</strong> o <strong>Area Chart</strong> per volumi mensili. Mai Bar Chart per serie temporali lunghe.</p>
              </div>
              <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Target vs Actual
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Usa <strong>Bullet Chart</strong> o Gauge minimali per SLA e Budget.</p>
              </div>
              <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300 font-medium">
                  <AlertOctagon className="w-4 h-4" /> Distribuzione
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Usa <strong>Histogram</strong> per l'Aging (es. 0-10, 10-30, 30+). Evita Pie Chart con più di 4 fette.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Visual Storytelling */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <BookOpen className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">4. Visual Storytelling & Best Practices</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DesignCard title="Contesto è Re" icon={LayoutTemplate} color="amber">
            <p>Un numero da solo non significa nulla. Aggiungi sempre:</p>
            <ul className="list-disc pl-4 space-y-1 mt-2 text-xs">
              <li>Confronto temporale (MoM, YoY)</li>
              <li>Target di riferimento (Budget, SLA)</li>
              <li>Media di settore (Benchmark)</li>
            </ul>
          </DesignCard>
          <DesignCard title="Indicatori di Alert" icon={AlertOctagon} color="rose">
            <p>Usa icone o marker visivi per evidenziare anomalie, non solo colori.</p>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded text-xs font-bold flex items-center gap-1"><AlertOctagon className="w-3 h-3"/> SLA Breach</span>
              <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-xs font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3"/> High Load</span>
            </div>
          </DesignCard>
          <DesignCard title="Anti-Overload" icon={Eye} color="indigo">
            <p><strong>Max 6 Widget per Pagina.</strong> Se hai bisogno di più dati, crea una nuova pagina di dettaglio o usa i tooltip.</p>
          </DesignCard>
        </div>
      </section>
    </div>
  );
}
