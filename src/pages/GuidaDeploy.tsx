import React from 'react';
import { BookOpen, AlertTriangle, CheckCircle2, ArrowRight, Github, Globe } from 'lucide-react';

const GuidaDeploy = () => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl">
          <Globe className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Metti il tuo sito online
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
            Guida passo-passo per chi non ha MAI pubblicato un sito. Zero termini difficili.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* INTRO */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>👋</span> Prima di iniziare: le basi
          </h2>
          <p className="text-lg mb-4">Per mettere il tuo sito su internet usiamo due siti gratuiti:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 font-bold text-lg mb-2">
                <Github className="w-5 h-5" /> 1. GitHub
              </div>
              <p>È come un <strong>Google Drive</strong> per i programmatori. Serve solo a salvare i file del tuo sito online in modo sicuro.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 font-bold text-lg mb-2">
                <Globe className="w-5 h-5 text-blue-500" /> 2. Render
              </div>
              <p>È il <strong>motore</strong>. Prende i file da GitHub, li accende e ti dà il link finale (es. <em>miosito.com</em>) da dare ai clienti.</p>
            </div>
          </div>
        </div>

        {/* FASE 1 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold rounded-full text-sm mb-4">
            FASE 1 DI 3
          </div>
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Prepara i tuoi file
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Apri il tuo progetto</h3>
                <p className="text-slate-600 dark:text-slate-300">Apri il programma che usi per scrivere il codice (di solito si chiama <strong>VS Code</strong>).</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Trova il file "package.json"</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-3">Nella lista dei file a sinistra, clicca su <code>package.json</code>. Cerca la parola <code>"scripts"</code>. Assicurati che ci siano queste due righe (se non ci sono, copiale e incollale):</p>
                <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-sm overflow-x-auto">
{`"scripts": {
  "dev": "vite",
  "build": "vite build",
  "start": "vite preview"
}`}
                </pre>
                <p className="text-sm text-slate-500 mt-2">Questo dice a Render come "accendere" il tuo sito.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FASE 2 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold rounded-full text-sm mb-4">
            FASE 2 DI 3
          </div>
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Salva il codice su GitHub
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Crea un "cassetto" vuoto su GitHub</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                  <li>Vai su <a href="https://github.com" target="_blank" rel="noreferrer" className="text-indigo-500 font-bold underline">GitHub.com</a> e fai il login.</li>
                  <li>Clicca sul pulsante verde in alto a sinistra con scritto <strong>"New"</strong>.</li>
                  <li>In "Repository name" scrivi il nome del tuo sito (es. <em>mio-sito</em>).</li>
                  <li>Scorri in basso e clicca sul pulsante verde <strong>"Create repository"</strong>.</li>
                  <li><strong className="text-rose-500">IMPORTANTE:</strong> Non toccare nessun'altra impostazione!</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Invia i file dal tuo computer a GitHub</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-3">Torna su VS Code. Apri il <strong>Terminale</strong> (la finestra nera in basso dove scrivi i comandi). Copia e incolla questi comandi <strong>UNO ALLA VOLTA</strong> e premi Invio dopo ognuno:</p>
                
                <div className="space-y-3">
                  <div className="bg-slate-900 p-3 rounded-lg flex items-center gap-3">
                    <span className="text-slate-500 select-none">1.</span>
                    <code className="text-emerald-400 font-mono">git init</code>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg flex items-center gap-3">
                    <span className="text-slate-500 select-none">2.</span>
                    <code className="text-emerald-400 font-mono">git add .</code>
                    <span className="text-slate-400 text-sm ml-auto">&larr; Attento al punto finale!</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg flex items-center gap-3">
                    <span className="text-slate-500 select-none">3.</span>
                    <code className="text-emerald-400 font-mono">git commit -m "primo salvataggio"</code>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg flex items-center gap-3">
                    <span className="text-slate-500 select-none">4.</span>
                    <code className="text-emerald-400 font-mono">git branch -M main</code>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mt-4 mb-2">Ora vai sulla pagina di GitHub che avevi lasciato aperta. Copia le <strong>ultime due righe</strong> che ti suggerisce e incollale nel terminale. Saranno simili a queste:</p>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <code className="text-emerald-400 font-mono text-sm block">git remote add origin https://github.com/tuo-nome/mio-sito.git</code>
                  <code className="text-emerald-400 font-mono text-sm block mt-2">git push -u origin main</code>
                </div>
                
                <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="text-emerald-800 dark:text-emerald-300 m-0"><strong>Fatto!</strong> Aggiorna la pagina di GitHub. Se vedi i tuoi file, sei pronto per l'ultimo passaggio.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FASE 3 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold rounded-full text-sm mb-4">
            FASE 3 DI 3 (FINALE)
          </div>
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Accendi il sito su Render
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Entra in Render</h3>
                <p className="text-slate-600 dark:text-slate-300">Vai su <a href="https://render.com" target="_blank" rel="noreferrer" className="text-indigo-500 font-bold underline">Render.com</a>. Clicca su <strong>"Get Started"</strong> in alto a destra. Scegli <strong>"Sign up with GitHub"</strong> (così si collegano in automatico).</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Crea il sito</h3>
                <ul className="list-disc list-inside space-y-3 text-slate-600 dark:text-slate-300">
                  <li>Clicca sul pulsante <strong>"New"</strong> e scegli <strong>"Web Service"</strong>.</li>
                  <li>Scegli <strong>"Build and deploy from a Git repository"</strong> e clicca Next.</li>
                  <li>Vedrai il nome del tuo progetto (quello che hai appena messo su GitHub). Clicca su <strong>"Connect"</strong>.</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Compila il modulo (Facilissimo)</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Nella pagina che si apre, compila SOLO questi campi, lascia il resto com'è:</p>
                
                <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Name:</strong>
                    <span className="text-slate-600 dark:text-slate-400">Scrivi il nome del tuo sito (es. <em>pizzeria-da-mario</em>)</span>
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Build Command:</strong>
                    <span className="text-slate-600 dark:text-slate-400">Cancella quello che c'è scritto e scrivi esattamente:</span>
                    <code className="block bg-slate-200 dark:bg-slate-800 p-2 rounded mt-1 font-bold">npm install && npm run build</code>
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Start Command:</strong>
                    <span className="text-slate-600 dark:text-slate-400">Cancella quello che c'è scritto e scrivi esattamente:</span>
                    <code className="block bg-slate-200 dark:bg-slate-800 p-2 rounded mt-1 font-bold">npm run start</code>
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Instance Type:</strong>
                    <span className="text-slate-600 dark:text-slate-400">Seleziona <strong>Free</strong> (Gratis)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">4</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Clicca "Create Web Service"</h3>
                <p className="text-slate-600 dark:text-slate-300">Scorri fino in fondo e clicca il pulsante verde. Ora <strong>aspetta circa 3-5 minuti</strong>. Vedrai scorrere tante scritte nere, è normale, sta costruendo il sito.</p>
                <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center gap-3">
                  <Globe className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                  <div>
                    <p className="font-bold text-indigo-900 dark:text-indigo-300 m-0">Quando vedi la scritta "Your service is live 🎉"</p>
                    <p className="text-indigo-800 dark:text-indigo-400 text-sm m-0">Clicca sul link in alto a sinistra (es. <em>pizzeria-da-mario.onrender.com</em>) e goditi il tuo sito online!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ERRORI COMUNI */}
        <div className="bg-rose-50 dark:bg-rose-900/10 rounded-2xl p-6 md:p-8 border border-rose-200 dark:border-rose-900/50">
          <h2 className="text-2xl font-bold mb-4 text-rose-800 dark:text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" /> Hai un problema? Leggi qui
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white">❌ Errore: "Build failed" su Render</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1"><strong>Soluzione:</strong> Hai sbagliato a scrivere il "Build Command". Torna su Render, clicca su "Settings" (Impostazioni), scorri fino a Build Command e assicurati di aver scritto esattamente <code>npm install && npm run build</code>.</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white">❌ Errore: "Updates were rejected" quando invii a GitHub</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1"><strong>Soluzione:</strong> Quando hai creato il progetto su GitHub hai spuntato la casella "Add a README". Devi rifarlo da capo creando un nuovo progetto e assicurandoti di NON spuntare nulla.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white">❌ Il sito ci mette 1 minuto a caricarsi la prima volta</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1"><strong>Soluzione:</strong> Non è un errore! Su Render gratis, se nessuno visita il sito per 15 minuti, il server "si addormenta". Quando qualcuno ci clicca, ci mette 50 secondi a svegliarsi. Se paghi, sarà sempre istantaneo.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GuidaDeploy;
