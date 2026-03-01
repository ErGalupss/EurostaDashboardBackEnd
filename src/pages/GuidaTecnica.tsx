import React from 'react';
import { BookOpen, Server, Globe, Shield, Terminal, AlertTriangle, CheckCircle2, Code, Database, Network } from 'lucide-react';

const GuidaTecnica = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <BookOpen className="w-10 h-10 text-slate-700 dark:text-slate-300" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Manuale Tecnico di Deploy
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
            Architettura, configurazione e best practices per Render.com
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* INDICE LATERALE */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Indice
            </h3>
            <nav className="space-y-2 text-sm">
              <a href="#architettura" className="block text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">1. Architettura</a>
              <a href="#concetti" className="block text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">2. Concetti Base</a>
              <a href="#frontend" className="block text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">3. Deploy Frontend</a>
              <a href="#backend" className="block text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">4. Deploy Backend</a>
              <a href="#comunicazione" className="block text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">5. Comunicazione</a>
              <a href="#troubleshooting" className="block text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">6. Troubleshooting</a>
            </nav>
          </div>
        </div>

        {/* CONTENUTO PRINCIPALE */}
        <div className="lg:col-span-3 space-y-12">
          
          {/* SEZIONE 1: ARCHITETTURA */}
          <section id="architettura" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">1</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Architettura di Produzione</h2>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                In un ambiente di produzione moderno, l'applicazione non è un blocco unico, ma è divisa in componenti specializzati che comunicano tra loro.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">Browser Utente</div>
                  <div className="text-xs text-slate-500">Chrome, Safari, etc.</div>
                </div>
                
                <div className="hidden md:block flex-1 h-px bg-slate-300 dark:bg-slate-600 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 dark:bg-slate-900 px-2 text-xs text-slate-500">HTTPS</div>
                </div>
                <div className="md:hidden text-slate-400">↓</div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Code className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">Frontend</div>
                  <div className="text-xs text-slate-500">Static Site (React)</div>
                </div>

                <div className="hidden md:block flex-1 h-px bg-slate-300 dark:bg-slate-600 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 dark:bg-slate-900 px-2 text-xs text-slate-500">API REST</div>
                </div>
                <div className="md:hidden text-slate-400">↓</div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Server className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">Backend</div>
                  <div className="text-xs text-slate-500">Web Service (Node)</div>
                </div>

                <div className="hidden md:block flex-1 h-px bg-slate-300 dark:bg-slate-600 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 dark:bg-slate-900 px-2 text-xs text-slate-500">SQL</div>
                </div>
                <div className="md:hidden text-slate-400">↓</div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Database className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">Database</div>
                  <div className="text-xs text-slate-500">PostgreSQL</div>
                </div>
              </div>
            </div>
          </section>

          {/* SEZIONE 2: CONCETTI BASE */}
          <section id="concetti" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">2</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Concetti Fondamentali</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg mb-3 text-indigo-600 dark:text-indigo-400">Static Site vs Web Service</h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li>
                    <strong>Static Site (Frontend):</strong> Sono solo file (HTML, CSS, JS) che vengono inviati al browser. Non c'è un server che "pensa". Una volta inviati, vivono nel computer dell'utente.
                  </li>
                  <li>
                    <strong>Web Service (Backend):</strong> È un computer sempre acceso che esegue codice (Node.js). Ascolta le richieste, interroga il database e risponde.
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg mb-3 text-indigo-600 dark:text-indigo-400">Porte e Indirizzi</h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li>
                    <strong>Porta:</strong> È come il numero di interno di un palazzo. Il server è il palazzo (IP), l'applicazione risponde a un interno specifico (es. 3000).
                  </li>
                  <li>
                    <strong>0.0.0.0:</strong> Significa "Ascolta chiunque". Se imposti <code>localhost</code> (127.0.0.1), il server ascolta solo se stesso e nessuno da fuori può collegarsi.
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg mb-3 text-indigo-600 dark:text-indigo-400">Build vs Start</h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li>
                    <strong>Build Command:</strong> "Costruisci la casa". Scarica i mattoni (npm install) e assembla i muri (npm run build). Si fa una volta sola per ogni aggiornamento.
                  </li>
                  <li>
                    <strong>Start Command:</strong> "Apri la porta". Accende il server e inizia ad accettare ospiti. Deve rimanere sempre attivo.
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg mb-3 text-indigo-600 dark:text-indigo-400">Variabili d'Ambiente</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Sono i "segreti" dell'app. Non si scrivono mai nel codice.
                  <br /><br />
                  <strong>Esempio:</strong> Invece di scrivere la password del database nel codice, scrivi <code>process.env.DB_PASSWORD</code>. Il valore vero lo imposti nella dashboard di Render.
                </p>
              </div>
            </div>
          </section>

          {/* SEZIONE 3: FRONTEND */}
          <section id="frontend" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">3</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Deploy Frontend (React + Vite)</h2>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">Configurazione Render</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-indigo-800 dark:text-indigo-400">
                  <li><strong>Tipo Servizio:</strong> Static Site</li>
                  <li><strong>Build Command:</strong> <code>npm install && npm run build</code></li>
                  <li><strong>Publish Directory:</strong> <code>dist</code> (per Vite) o <code>build</code> (per CRA)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Gestione Variabili (.env)</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  In Vite, le variabili devono iniziare con <code>VITE_</code> per essere visibili al browser.
                </p>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <code className="text-emerald-400 font-mono text-sm">
                    # .env (Locale)<br/>
                    VITE_API_URL=http://localhost:3000<br/>
                    <br/>
                    # Render Environment Variables (Produzione)<br/>
                    VITE_API_URL=https://miosito-backend.onrender.com
                  </code>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Utilizzo nel codice</h4>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <code className="text-emerald-400 font-mono text-sm">
                    const API_URL = import.meta.env.VITE_API_URL;<br/>
                    <br/>
                    fetch(`$&#123;API_URL&#125;/api/users`)<br/>
                    &nbsp;&nbsp;.then(res =&gt; res.json())<br/>
                    &nbsp;&nbsp;.catch(err =&gt; console.error(err));
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* SEZIONE 4: BACKEND */}
          <section id="backend" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">4</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Deploy Backend (Node.js)</h2>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2">Configurazione Render</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-emerald-800 dark:text-emerald-400">
                  <li><strong>Tipo Servizio:</strong> Web Service</li>
                  <li><strong>Build Command:</strong> <code>npm install</code></li>
                  <li><strong>Start Command:</strong> <code>node index.js</code></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Server Setup (Cruciale!)</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Il server DEVE ascoltare sulla porta fornita da Render (<code>process.env.PORT</code>) e accettare connessioni da <code>0.0.0.0</code>.
                </p>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <code className="text-emerald-400 font-mono text-sm">
                    const express = require('express');<br/>
                    const cors = require('cors');<br/>
                    const app = express();<br/>
                    <br/>
                    // 1. Configurazione CORS (Sicurezza)<br/>
                    app.use(cors(&#123;<br/>
                    &nbsp;&nbsp;origin: process.env.FRONTEND_URL || '*', // Solo il tuo frontend può chiamare<br/>
                    &nbsp;&nbsp;methods: ['GET', 'POST', 'PUT', 'DELETE'],<br/>
                    &nbsp;&nbsp;credentials: true<br/>
                    &#125;));<br/>
                    <br/>
                    // 2. Porta Dinamica (OBBLIGATORIO)<br/>
                    const PORT = process.env.PORT || 3000;<br/>
                    <br/>
                    // 3. Binding su 0.0.0.0<br/>
                    app.listen(PORT, '0.0.0.0', () =&gt; &#123;<br/>
                    &nbsp;&nbsp;console.log(`Server running on port $&#123;PORT&#125;`);<br/>
                    &#125;);
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* SEZIONE 5: COMUNICAZIONE */}
          <section id="comunicazione" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">5</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Comunicazione Sicura</h2>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg shrink-0">
                    <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Il problema CORS</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Per sicurezza, i browser bloccano le richieste tra siti diversi (es. dal tuo frontend al tuo backend).
                      Devi dire esplicitamente al Backend: "Fidati delle richieste che arrivano dal mio Frontend".
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">Checklist Configurazione</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        <strong>Sul Backend (Render Env):</strong> Imposta <code>FRONTEND_URL</code> = <code>https://miosito-frontend.onrender.com</code>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        <strong>Sul Frontend (Render Env):</strong> Imposta <code>VITE_API_URL</code> = <code>https://miosito-backend.onrender.com</code>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        <strong>Nel codice Backend:</strong> Usa <code>app.use(cors(&#123; origin: process.env.FRONTEND_URL &#125;))</code>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* SEZIONE 6: TROUBLESHOOTING */}
          <section id="troubleshooting" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">6</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Risoluzione Errori Comuni</h2>
            </div>

            <div className="grid gap-6">
              <div className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-xl border border-rose-200 dark:border-rose-800">
                <h3 className="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5" /> Errore: "No open ports detected"
                </h3>
                <p className="text-sm text-rose-900 dark:text-rose-300 mb-3">
                  <strong>Causa:</strong> Il server non sta ascoltando sulla porta giusta o sull'indirizzo giusto.
                </p>
                <div className="bg-white dark:bg-slate-900 p-3 rounded border border-rose-100 dark:border-rose-900/50">
                  <code className="text-xs font-mono text-slate-600 dark:text-slate-400">
                    // SBAGLIATO<br/>
                    app.listen(3000);<br/><br/>
                    // CORRETTO<br/>
                    app.listen(process.env.PORT || 3000, '0.0.0.0');
                  </code>
                </div>
              </div>

              <div className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-xl border border-rose-200 dark:border-rose-800">
                <h3 className="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5" /> Errore: "Missing script: start"
                </h3>
                <p className="text-sm text-rose-900 dark:text-rose-300 mb-3">
                  <strong>Causa:</strong> Nel <code>package.json</code> manca il comando che Render prova ad eseguire.
                </p>
                <div className="bg-white dark:bg-slate-900 p-3 rounded border border-rose-100 dark:border-rose-900/50">
                  <code className="text-xs font-mono text-slate-600 dark:text-slate-400">
                    "scripts": &#123;<br/>
                    &nbsp;&nbsp;"start": "node index.js",<br/>
                    &nbsp;&nbsp;"build": "npm install"<br/>
                    &#125;
                  </code>
                </div>
              </div>

              <div className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-xl border border-rose-200 dark:border-rose-800">
                <h3 className="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5" /> Errore: "CORS Policy Blocked"
                </h3>
                <p className="text-sm text-rose-900 dark:text-rose-300 mb-3">
                  <strong>Causa:</strong> Il Backend non ha autorizzato il dominio del Frontend.
                </p>
                <p className="text-sm text-rose-900 dark:text-rose-300">
                  <strong>Soluzione:</strong> Controlla che la variabile <code>FRONTEND_URL</code> su Render corrisponda ESATTAMENTE all'URL del tuo sito (attenzione allo slash finale <code>/</code>, meglio toglierlo).
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default GuidaTecnica;
