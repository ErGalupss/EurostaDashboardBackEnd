import React from 'react';
import { Bug, Search, FileCode, AlertTriangle, CheckCircle2, Terminal, FolderTree, Server } from 'lucide-react';

const DebugBackend = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-rose-100 dark:bg-rose-900/50 rounded-2xl border border-rose-200 dark:border-rose-800">
          <Bug className="w-10 h-10 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Debug Errore: MODULE_NOT_FOUND
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
            Analisi tecnica e risoluzione dell'errore di deploy backend su Render
          </p>
        </div>
      </div>

      <div className="space-y-12">
        
        {/* ANALISI ERRORE */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analisi del Log</h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 mb-6 font-mono text-sm overflow-x-auto border border-slate-700">
            <div className="text-rose-400">Error: Cannot find module '/opt/render/project/src/index.js'</div>
            <div className="text-rose-400">code: 'MODULE_NOT_FOUND'</div>
            <div className="text-slate-500 mt-2">at Function.Module._resolveFilename (node:internal/modules/cjs/loader:1144:15)</div>
            <div className="text-slate-500">at Function.Module._load (node:internal/modules/cjs/loader:985:27)</div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">MODULE_NOT_FOUND</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Node.js sta cercando di avviare un file che <strong>non esiste</strong> nel percorso specificato. È l'errore più comune quando si sbaglia il nome del file principale.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">/opt/render/project/src/</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                È la cartella dove Render clona il tuo progetto. Se hai impostato una <strong>Root Directory</strong>, questo percorso cambierà.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">node index.js</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                È il comando che Render sta eseguendo (Start Command). Sta dicendo a Node: "Esegui il file chiamato index.js".
              </p>
            </div>
          </div>
        </section>

        {/* SEZIONE 1: POSSIBILI CAUSE */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">1</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Possibili Cause</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-500" /> Nome File Errato
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Il tuo file principale si chiama <code>server.js</code>, <code>app.js</code> o <code>main.js</code>, ma Render sta cercando <code>index.js</code> perché è il default o è scritto nello Start Command.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-indigo-500" /> Struttura Cartelle
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Il file esiste ma è dentro una sottocartella (es. <code>src/index.js</code> o <code>server/index.js</code>), mentre Render lo cerca nella radice del progetto.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-500" /> TypeScript
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Stai provando a eseguire un file <code>.ts</code> con Node (che non lo supporta) oppure stai cercando il file compilato in <code>dist/</code> ma non hai eseguito la build.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-indigo-500" /> Root Directory
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Hai impostato una <strong>Root Directory</strong> errata su Render, facendo cercare i file nel posto sbagliato.
              </p>
            </div>
          </div>
        </section>

        {/* SEZIONE 2: COME RISOLVERE */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">2</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Come Risolvere (Casi Reali)</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Caso A: Il file si chiama server.js</h3>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                  <strong>Soluzione:</strong> Cambia lo Start Command su Render.
                </p>
                <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-sm font-bold">node server.js</code>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Caso B: Il backend è in una sottocartella /src</h3>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                  <strong>Soluzione 1 (Consigliata):</strong> Cambia lo Start Command per includere il percorso.
                </p>
                <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-sm font-bold mb-4 block w-fit">node src/index.js</code>
                
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 mt-4">
                  <strong>Soluzione 2:</strong> Imposta la <strong>Root Directory</strong> su Render a <code>src</code> (solo se anche package.json è lì).
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Caso C: Progetto TypeScript</h3>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                  <strong>Soluzione:</strong> Devi prima compilare il codice e poi eseguire il file JS generato.
                </p>
                <div className="grid gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-500">Build Command</span>
                    <code className="block bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-sm font-bold mt-1">npm install && npm run build</code>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-500">Start Command</span>
                    <code className="block bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-sm font-bold mt-1">node dist/index.js</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEZIONE 3: ESEMPIO SERVER CORRETTO */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">3</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Esempio Server Corretto</h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto border border-slate-700 shadow-lg">
            <pre className="text-sm font-mono leading-relaxed">
              <code className="text-emerald-400">
{`const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Configurazione CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // In produzione metti l'URL del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// 2. Middleware JSON
app.use(express.json());

// 3. Route di Test (Fondamentale per il debug)
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// 4. Gestione Errori Globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 5. Porta Dinamica e Binding su 0.0.0.0
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log(\`Environment: \${process.env.NODE_ENV || 'development'}\`);
});`}
              </code>
            </pre>
          </div>
        </section>

        {/* SEZIONE 4: PACKAGE.JSON */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">4</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">package.json Corretto</h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto border border-slate-700 shadow-lg">
            <pre className="text-sm font-mono leading-relaxed">
              <code className="text-emerald-400">
{`{
  "name": "backend-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "echo 'No build step for JS backend'"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`}
              </code>
            </pre>
          </div>
        </section>

        {/* SEZIONE 5: CONFIGURAZIONE RENDER */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">5</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Configurazione Render</h2>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Impostazioni Base</h3>
                <ul className="space-y-4">
                  <li className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                    <span className="text-slate-600 dark:text-slate-400">Build Command</span>
                    <code className="font-bold text-indigo-600 dark:text-indigo-400">npm install</code>
                  </li>
                  <li className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                    <span className="text-slate-600 dark:text-slate-400">Start Command</span>
                    <code className="font-bold text-indigo-600 dark:text-indigo-400">node index.js</code>
                  </li>
                  <li className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                    <span className="text-slate-600 dark:text-slate-400">Root Directory</span>
                    <code className="font-bold text-indigo-600 dark:text-indigo-400">. (vuoto)</code>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Environment Variables</h3>
                <ul className="space-y-4">
                  <li className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                    <span className="text-slate-600 dark:text-slate-400">NODE_ENV</span>
                    <code className="font-bold text-emerald-600 dark:text-emerald-400">production</code>
                  </li>
                  <li className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                    <span className="text-slate-600 dark:text-slate-400">PORT</span>
                    <span className="text-xs text-slate-500 italic">Non impostare! Render lo fa in automatico.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SEZIONE 6: ERRORI CORRELATI */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">6</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Errori Correlati</h2>
          </div>

          <div className="grid gap-4">
            <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl border border-rose-200 dark:border-rose-800">
              <h4 className="font-bold text-rose-800 dark:text-rose-400 mb-1">No open ports detected on 0.0.0.0</h4>
              <p className="text-sm text-rose-900 dark:text-rose-300">
                Il server è partito ma sta ascoltando su <code>localhost</code> o su una porta sbagliata. Assicurati di usare <code>app.listen(process.env.PORT, '0.0.0.0')</code>.
              </p>
            </div>
            
            <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl border border-rose-200 dark:border-rose-800">
              <h4 className="font-bold text-rose-800 dark:text-rose-400 mb-1">502 Bad Gateway</h4>
              <p className="text-sm text-rose-900 dark:text-rose-300">
                Il server è crashato subito dopo l'avvio o ha impiegato troppo tempo a rispondere. Controlla i Logs per vedere l'errore esatto (spesso è una variabile d'ambiente mancante).
              </p>
            </div>

            <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl border border-rose-200 dark:border-rose-800">
              <h4 className="font-bold text-rose-800 dark:text-rose-400 mb-1">Missing script: start</h4>
              <p className="text-sm text-rose-900 dark:text-rose-300">
                Hai impostato lo Start Command su <code>npm start</code> ma nel <code>package.json</code> non esiste lo script <code>"start"</code>.
              </p>
            </div>
          </div>
        </section>

        {/* CHECKLIST FINALE */}
        <section className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-800">
          <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-300 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8" /> Checklist Finale
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Il file principale esiste e ha il nome giusto</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Start Command corrisponde al file reale</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Uso process.env.PORT nel codice</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Binding esplicito su '0.0.0.0'</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Tutte le variabili .env copiate su Render</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">package.json ha lo script "start"</span>
            </label>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DebugBackend;
