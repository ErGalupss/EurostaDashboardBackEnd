import React from 'react';
import { Server, Database, Key, Globe, AlertTriangle, CheckCircle2 } from 'lucide-react';

const GuidaBackend = () => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl">
          <Server className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Collega il Backend
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
            Come mettere online la parte "intelligente" del sito (API, Database, Login).
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* INTRO */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>🤔</span> Cosa stiamo facendo?
          </h2>
          <p className="text-lg mb-4">Il tuo sito ha due parti:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 opacity-50">
              <div className="font-bold text-lg mb-1">1. Frontend (Fatto ✅)</div>
              <p>È la parte grafica che vedono gli utenti. L'abbiamo già messa online.</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="font-bold text-lg mb-1 text-emerald-700 dark:text-emerald-400">2. Backend (Da fare ora 🚀)</div>
              <p>È il "cervello" che gestisce i dati, il login e il database. Senza questo, il sito è solo una scatola vuota.</p>
            </div>
          </div>
        </div>

        {/* FASE 1 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold rounded-full text-sm mb-4">
            FASE 1 DI 3
          </div>
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Prepara il codice del Backend
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Controlla la "Porta"</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-3">Apri il file principale del tuo server (di solito <code>index.js</code> o <code>server.js</code>). Cerca dove c'è scritto <code>3000</code> o <code>5000</code>.</p>
                <p className="text-slate-600 dark:text-slate-300 mb-2">Devi cambiarlo così, altrimenti Render non funziona:</p>
                <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-sm overflow-x-auto">
{`const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`}
                </pre>
                <p className="text-sm text-slate-500 mt-2">In pratica dici: "Usa la porta che mi dà Render, altrimenti usa la 3000".</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Controlla lo script "start"</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-3">Apri <code>package.json</code>. Assicurati di avere questo script:</p>
                <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-sm overflow-x-auto">
{`"scripts": {
  "start": "node index.js" 
  // oppure "node server.js" se il tuo file si chiama così
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* FASE 2 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold rounded-full text-sm mb-4">
            FASE 2 DI 3
          </div>
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Crea il servizio su Render
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Nuovo Web Service</h3>
                <p className="text-slate-600 dark:text-slate-300">Su Render, clicca <strong>New +</strong> &rarr; <strong>Web Service</strong>. Collega lo stesso progetto GitHub che hai usato per il frontend (se il backend è nello stesso progetto).</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Impostazioni (Fai attenzione qui!)</h3>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Name:</strong>
                    <span className="text-slate-600 dark:text-slate-400">Dai un nome diverso (es. <em>miosito-backend</em>)</span>
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Root Directory:</strong>
                    <span className="text-slate-600 dark:text-slate-400">Se il backend è in una cartella specifica (es. <code>server</code> o <code>backend</code>), scrivilo qui. Se è tutto mischiato, lascia vuoto.</span>
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Build Command:</strong>
                    <code className="block bg-slate-200 dark:bg-slate-800 p-2 rounded mt-1 font-bold">npm install</code>
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Start Command:</strong>
                    <code className="block bg-slate-200 dark:bg-slate-800 p-2 rounded mt-1 font-bold">node index.js</code>
                    <span className="text-xs text-slate-500">(o il nome del tuo file principale)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FASE 3 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold rounded-full text-sm mb-4">
            FASE 3 DI 3 (CRUCIALE)
          </div>
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Le Variabili Segrete (Environment)
          </h2>
          
          <div className="space-y-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
              <div>
                <p className="font-bold text-amber-800 dark:text-amber-300 m-0">IMPORTANTE</p>
                <p className="text-amber-900 dark:text-amber-400 text-sm m-0">Il tuo backend non funzionerà se non gli dai le password del database o le chiavi segrete. Render non le sa!</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Apri il file .env</h3>
                <p className="text-slate-600 dark:text-slate-300">Sul tuo computer, apri il file <code>.env</code>. Lì dentro ci sono le tue password.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Copiale su Render</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                  <li>Su Render, scorri in basso fino a trovare la sezione <strong>"Environment Variables"</strong>.</li>
                  <li>Clicca <strong>"Add Environment Variable"</strong>.</li>
                  <li>Copia il NOME (es. <code>DATABASE_URL</code>) a sinistra.</li>
                  <li>Copia il VALORE (es. <code>postgres://...</code>) a destra.</li>
                  <li>Fallo per TUTTE le righe del tuo file .env.</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Clicca "Create Web Service"</h3>
                <p className="text-slate-600 dark:text-slate-300">Fatto! Ora aspetta che diventi verde ("Live").</p>
              </div>
            </div>
          </div>
        </div>

        {/* ULTIMO PASSAGGIO */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 md:p-8 border border-indigo-200 dark:border-indigo-800">
          <h2 className="text-2xl font-bold mb-4 text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <Globe className="w-6 h-6" /> Collega Frontend e Backend
          </h2>
          <p className="text-indigo-800 dark:text-indigo-400 mb-4">
            Ora hai due link diversi su Render:
            <br />1. <code>miosito-frontend.onrender.com</code> (il sito)
            <br />2. <code>miosito-backend.onrender.com</code> (il cervello)
          </p>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-slate-900 dark:text-white">Ultima cosa da fare:</h4>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Vai nelle impostazioni del <strong>Frontend</strong> su Render (Environment Variables).
              Aggiungi una variabile chiamata <code>VITE_API_URL</code> (o come l'hai chiamata nel codice) e metti come valore il link del <strong>Backend</strong>.
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-2 font-bold">
              Così il sito saprà dove mandare i dati! 🚀
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GuidaBackend;
