import React from 'react';
import { 
  Rocket, 
  Settings, 
  Terminal, 
  Globe, 
  ShieldCheck, 
  Zap, 
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Server,
  Code,
  Database,
  Layers
} from 'lucide-react';

const Step = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
      {number}
    </div>
    <div className="space-y-2">
      <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
      <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

const CodeBlock = ({ code }: { code: string }) => (
  <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800 my-2">
    <pre>{code}</pre>
  </div>
);

export default function DeploymentGuide() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Guida al Deployment & Performance</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Istruzioni per installare, configurare e ottimizzare il portale Rintraccio Analytics su un ambiente di produzione esterno.
        </p>
      </div>

      {/* 1. Installazione Locale/Server */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <Terminal className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">1. Installazione & Setup</h2>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-8">
          <Step number="1" title="Prerequisiti">
            <p>Assicurati di avere installato <strong>Node.js (v18+)</strong> e <strong>npm</strong> o <strong>yarn</strong> sul server o sulla macchina locale.</p>
          </Step>

          <Step number="2" title="Clonazione e Dipendenze">
            <p>Scarica il codice sorgente e installa i pacchetti necessari:</p>
            <CodeBlock code={`git clone https://github.com/tuo-repo/rintraccio-analytics.git
cd rintraccio-analytics
npm install`} />
          </Step>

          <Step number="3" title="Configurazione Ambiente">
            <p>Crea un file <code>.env</code> nella root del progetto per le variabili di configurazione:</p>
            <CodeBlock code={`VITE_APP_TITLE=Rintraccio Analytics
VITE_API_URL=https://tuo-backend-api.com
# Se usi BigQuery direttamente dal frontend (non consigliato)
VITE_BQ_PROJECT_ID=tuo-progetto-gcp`} />
          </Step>

          <Step number="4" title="Build per Produzione">
            <p>Genera i file statici ottimizzati per il deployment:</p>
            <CodeBlock code={`npm run build`} />
            <p className="mt-2">I file verranno generati nella cartella <code>/dist</code>.</p>
          </Step>
        </div>
      </section>

      {/* 2. Deployment su Portale Esterno */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
          <Globe className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">2. Deployment su Portale Esterno</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-500" /> Hosting Statico
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Essendo una Single Page Application (SPA), puoi ospitare il contenuto di <code>/dist</code> su qualsiasi web server:
            </p>
            <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Nginx / Apache</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Google Cloud Storage (Static Website)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> AWS S3 + CloudFront</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Vercel / Netlify</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" /> Sicurezza & Portale
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Se integri il portale all'interno di un iframe o di un CMS aziendale:
            </p>
            <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
              <li>• Configura i <strong>CORS</strong> sul tuo backend per accettare richieste dal dominio del portale.</li>
              <li>• Usa <strong>Content Security Policy (CSP)</strong> per prevenire XSS.</li>
              <li>• Implementa un layer di autenticazione (SSO/OAuth2) prima dell'accesso.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Ottimizzazione Performance */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <Zap className="w-8 h-8" />
          <h2 className="text-2xl font-bold dark:text-white">3. Performance & Fruibilità</h2>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl w-fit text-amber-600 dark:text-amber-400">
                <Code className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Code Splitting</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Il progetto usa <code>React.lazy</code> per caricare le pagine solo quando necessario, riducendo il peso del bundle iniziale.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl w-fit text-indigo-600 dark:text-indigo-400">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Caching Dati</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Implementa <strong>React Query</strong> o <strong>SWR</strong> per gestire il caching delle chiamate API e ridurre il carico sul database.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl w-fit text-emerald-600 dark:text-emerald-400">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Asset Optimization</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Usa formati immagine moderni (WebP) e comprimi i file statici con Gzip o Brotli sul server web.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Supporto & Documentazione */}
      <section className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-indigo-200" />
              <h2 className="text-2xl font-bold">Hai bisogno di aiuto?</h2>
            </div>
            <p className="text-indigo-100 max-w-xl">
              Consulta la documentazione completa su GitHub o contatta il team di Data Engineering per supporto sull'integrazione con i sistemi legacy.
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 whitespace-nowrap">
            Vai alla Wiki <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
}
