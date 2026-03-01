import React, { useState } from 'react';
import { Terminal, Server, ShieldCheck, Wrench, CheckCircle, Download, Database, Play, AlertTriangle, FileCode, Code } from 'lucide-react';

export default function GuidaInstallazione() {
  const [activeTab, setActiveTab] = useState<'manual' | 'auto' | 'docker'>('auto');

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Guida Installazione Completa</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          Manuale passo-passo per l'installazione, configurazione e messa in produzione del portale.
          Scegli il metodo di installazione che preferisci.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('auto')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'auto'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          Installazione Automatica (Script)
        </button>
        <button
          onClick={() => setActiveTab('docker')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'docker'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          Installazione con Docker
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'manual'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          Installazione Manuale
        </button>
      </div>

      {activeTab === 'auto' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="card-standard">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Terminal className="w-6 h-6 text-indigo-500" />
              Quick Start (Script Automatici)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Il modo più veloce per iniziare. Questi script controlleranno i requisiti, installeranno le dipendenze e avvieranno il progetto.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Per macOS / Linux (setup.sh)</h3>
                <p className="text-sm text-slate-500 mb-2">Crea un file <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">scripts/setup.sh</code> e incollaci questo codice. Poi eseguilo con <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">bash scripts/setup.sh</code>.</p>
                <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-sm font-mono overflow-x-auto">
{`#!/bin/bash
echo "🚀 Avvio setup Rintraccio Analytics..."

# 1. Controllo Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Errore: Node.js non è installato. Scaricalo da https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js trovato: $(node -v)"

# 2. Setup Variabili d'Ambiente
if [ ! -f .env ]; then
    echo "📝 Creazione file .env da .env.example..."
    cp .env.example .env
    echo "✅ File .env creato."
fi

# 3. Installazione Dipendenze
echo "📦 Installazione dipendenze npm..."
npm install

# 4. Avvio
echo "✨ Setup completato! Avvio del server di sviluppo..."
npm run dev`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Per Windows (setup.ps1)</h3>
                <p className="text-sm text-slate-500 mb-2">Crea un file <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">scripts/setup.ps1</code>. Eseguilo da PowerShell. Se ricevi errori di permessi, esegui prima: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass</code></p>
                <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-sm font-mono overflow-x-auto">
{`Write-Host "🚀 Avvio setup Rintraccio Analytics..." -ForegroundColor Cyan

# 1. Controllo Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Errore: Node.js non è installato. Scaricalo da https://nodejs.org/" -ForegroundColor Red
    exit 1
}
$nodeVer = node -v
Write-Host "✅ Node.js trovato: $nodeVer" -ForegroundColor Green

# 2. Setup Variabili d'Ambiente
if (!(Test-Path .env)) {
    Write-Host "📝 Creazione file .env da .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example -Destination .env
    Write-Host "✅ File .env creato." -ForegroundColor Green
}

# 3. Installazione Dipendenze
Write-Host "📦 Installazione dipendenze npm..." -ForegroundColor Cyan
npm install

# 4. Avvio
Write-Host "✨ Setup completato! Avvio del server di sviluppo..." -ForegroundColor Green
npm run dev`}
                </pre>
              </div>
            </div>
          </section>

          <section className="card-standard">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-indigo-500" />
              Script di Diagnostica (Doctor)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Se qualcosa non funziona, usa lo script Doctor per identificare il problema.
            </p>
            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-sm font-mono overflow-x-auto">
{`#!/bin/bash
# scripts/doctor.sh
echo "🩺 Rintraccio Analytics Doctor"
echo "------------------------------"

# Check Node
if command -v node &> /dev/null; then
    echo "✅ Node.js: OK ($(node -v))"
else
    echo "❌ Node.js: MANCANTE (Installa da nodejs.org)"
fi

# Check ENV
if [ -f .env ]; then
    echo "✅ File .env: OK"
else
    echo "❌ File .env: MANCANTE (Esegui: cp .env.example .env)"
fi

# Check Node Modules
if [ -d node_modules ]; then
    echo "✅ Dipendenze: OK"
else
    echo "❌ Dipendenze: MANCANTI (Esegui: npm install)"
fi

# Check Port 5173
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Porta 5173: OCCUPATA (Il server è già in esecuzione o la porta è usata da un'altra app)"
else
    echo "✅ Porta 5173: LIBERA"
fi

echo "------------------------------"
echo "💡 Suggerimento: Se tutto è OK, esegui 'npm run dev' per avviare."`}
            </pre>
          </section>
        </div>
      )}

      {activeTab === 'docker' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="card-standard">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Server className="w-6 h-6 text-indigo-500" />
              Installazione con Docker Compose
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Docker permette di isolare l'applicazione e le sue dipendenze. È il metodo consigliato per il deploy su server.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">1. Crea il file Dockerfile</h3>
                <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-sm font-mono overflow-x-auto">
{`# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">2. Crea il file docker-compose.yml</h3>
                <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-sm font-mono overflow-x-auto">
{`# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
    environment:
      - VITE_API_URL=http://localhost:3000/api`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">3. Avvia il container</h3>
                <code className="block bg-slate-900 text-emerald-400 p-3 rounded-md text-sm font-mono">
                  docker-compose up -d --build
                </code>
                <p className="text-sm mt-2 text-slate-600 dark:text-slate-400">L'applicazione sarà disponibile all'indirizzo <a href="http://localhost:8080" className="text-indigo-500 hover:underline">http://localhost:8080</a>.</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="card-standard">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-indigo-500" />
              Configurazione Variabili Ambiente
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-300">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-300">Promemoria: Valori da definire</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    Al momento non conosciamo ancora le credenziali definitive (Database, API, ecc.). 
                    <strong> Ricordati di aggiornare il file .env</strong> non appena questi dati ti verranno forniti.
                  </p>
                </div>
              </div>

              <p>Le variabili d'ambiente sono impostazioni segrete (come password o chiavi API) che il progetto legge all'avvio.</p>
              <ol className="list-decimal pl-5 space-y-3">
                <li>Nella cartella principale del progetto, cerca un file chiamato <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.env.example</code>.</li>
                <li>Copia questo file e rinominalo in <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-bold">.env</code> (senza .example alla fine). Su Windows potresti dover abilitare la visualizzazione delle estensioni dei file.</li>
                <li>Apri il file <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.env</code> con un editor di testo (es. Blocco Note o VS Code).</li>
              </ol>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Esempio di contenuto del file .env:</h4>
                <pre className="bg-slate-900 text-emerald-400 p-3 rounded-md text-sm font-mono overflow-x-auto">
{`# TODO: DA COMPILARE QUANDO I DATI SARANNO DISPONIBILI
VITE_APP_TITLE="Rintraccio Analytics"
VITE_API_URL="http://localhost:3000/api"
PORT=3000

# Se in futuro aggiungerai un database reale:
# DB_HOST="DA_DEFINIRE"
# DB_USER="DA_DEFINIRE"
# DB_PASSWORD="DA_DEFINIRE"
# JWT_SECRET="DA_DEFINIRE"`}
                </pre>
              </div>
              <p className="text-sm text-rose-600 dark:text-rose-400 mt-2">
                <strong>Attenzione:</strong> Se queste variabili sono errate o il file .env manca, l'applicazione potrebbe non avviarsi o non riuscire a comunicare con i servizi esterni.
              </p>
            </div>
          </section>

      {/* 5. Setup Database */}
      <section className="card-standard">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Database className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Setup Database (Opzionale/Futuro)</h2>
        </div>
        <div className="space-y-4 text-slate-600 dark:text-slate-300">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
            <p className="text-sm text-indigo-800 dark:text-indigo-300">
              <strong>Nota bene:</strong> L'attuale versione del portale è una Single Page Application (SPA) che elabora i file Excel direttamente nel browser dell'utente. <strong>Non è richiesto alcun database per il funzionamento base.</strong> Puoi saltare al punto 7.
            </p>
          </div>
          <p className="text-sm opacity-75">Se in futuro verrà implementato un backend con PostgreSQL, i comandi tipici da eseguire saranno:</p>
          <code className="block bg-slate-900 text-emerald-400 p-3 rounded-md text-sm font-mono opacity-75">
            # Creazione tabelle (Migration)<br/>
            npm run db:migrate<br/><br/>
            # Popolamento dati iniziali (Seed)<br/>
            npm run db:seed
          </code>
        </div>
      </section>

      {/* 6 & 7. Avvio Frontend */}
      <section className="card-standard">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Play className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">6/7. Avvio dell'Applicazione</h2>
        </div>
        <div className="space-y-4 text-slate-600 dark:text-slate-300">
          <p>Ora che hai il codice e Node.js è installato, devi scaricare le librerie necessarie (dipendenze) e avviare il server di sviluppo.</p>
          
          <h4 className="font-semibold text-slate-900 dark:text-white">Passo 1: Installare le librerie</h4>
          <p className="text-sm">Nel terminale, assicurati di essere nella cartella del progetto e digita:</p>
          <code className="block bg-slate-900 text-emerald-400 p-3 rounded-md text-sm font-mono">npm install</code>
          <p className="text-sm"><em>Cosa fa:</em> Legge il file <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">package.json</code> e scarica da internet tutti i pacchetti necessari (come React, Tailwind, Recharts) mettendoli in una cartella chiamata <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">node_modules</code>. Potrebbe volerci un minuto.</p>

          <h4 className="font-semibold text-slate-900 dark:text-white mt-6">Passo 2: Avviare il server</h4>
          <p className="text-sm">Una volta terminata l'installazione, digita:</p>
          <code className="block bg-slate-900 text-emerald-400 p-3 rounded-md text-sm font-mono">npm run dev</code>
          <p className="text-sm"><em>Cosa fa:</em> Avvia Vite, un server locale super veloce. Nel terminale vedrai apparire un messaggio simile a questo:</p>
          <pre className="bg-slate-900 text-slate-300 p-3 rounded-md text-sm font-mono mt-2">
            <span className="text-emerald-400">VITE v5.0.0</span>  ready in 350 ms<br/><br/>
            ➜  Local:   <span className="text-cyan-400 underline">http://localhost:5173/</span><br/>
            ➜  Network: use --host to expose
          </pre>
          
          <p className="text-sm mt-4">
            <strong>Cosa fare se la porta è occupata?</strong> Se la porta 5173 (o 3000) è già usata da un altro programma, Vite ne sceglierà automaticamente un'altra (es. 5174). Guarda sempre l'URL esatto stampato nel terminale.
          </p>
        </div>
      </section>

      {/* 8. Test Funzionamento */}
      <section className="card-standard">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">8. Test Funzionamento (Checklist)</h2>
        </div>
        <div className="space-y-4 text-slate-600 dark:text-slate-300">
          <p>Apri il tuo browser (Chrome, Edge, Firefox) e vai all'indirizzo indicato nel terminale (es. <a href="http://localhost:5173" className="text-indigo-600 dark:text-indigo-400 hover:underline">http://localhost:5173</a>). Verifica che:</p>
          
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
              <span><strong>La Dashboard si carica:</strong> Vedi la barra laterale e i grafici iniziali.</span>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
              <span><strong>Upload Funziona:</strong> Cliccando su "Carica Excel" riesci a selezionare un file e i dati si aggiornano.</span>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
              <span><strong>Filtri Attivi:</strong> Modificando i filtri in alto, i numeri nelle card (KPI) cambiano istantaneamente.</span>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
              <span><strong>Nessun Errore in Console:</strong> Clicca col tasto destro sulla pagina &gt; Ispeziona &gt; Console. Non dovrebbero esserci testi in rosso.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 9. Risoluzione Problemi Comuni */}
      <section className="card-standard">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">9. Risoluzione Problemi Comuni (Troubleshooting)</h2>
        </div>
        <div className="space-y-6 text-slate-600 dark:text-slate-300">
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Errore: "npm ERR! code ENOENT" durante npm install</h4>
            <p className="text-sm mt-1"><strong>Causa:</strong> Non sei nella cartella giusta del progetto, quindi npm non trova il file package.json.</p>
            <p className="text-sm mt-1"><strong>Soluzione:</strong> Usa il comando <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">cd nome-cartella</code> per entrare nella directory corretta prima di lanciare npm install.</p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Errore: "vite: command not found"</h4>
            <p className="text-sm mt-1"><strong>Causa:</strong> Le dipendenze non sono state installate correttamente.</p>
            <p className="text-sm mt-1"><strong>Soluzione:</strong> Esegui nuovamente <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">npm install</code>. Assicurati che termini senza errori rossi bloccanti.</p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">La pagina è bianca o non carica i dati</h4>
            <p className="text-sm mt-1"><strong>Causa:</strong> Possibile errore nel codice o cache del browser bloccata.</p>
            <p className="text-sm mt-1"><strong>Soluzione:</strong> Apri la console del browser (F12). Se vedi errori relativi a variabili d'ambiente mancanti, controlla di aver creato il file <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.env</code>. Riavvia il server nel terminale premendo <kbd className="bg-slate-200 dark:bg-slate-700 px-1 rounded">Ctrl+C</kbd> e digitando di nuovo <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">npm run dev</code>.</p>
          </div>

        </div>
      </section>

      {/* 10. Installazione su Server */}
      <section className="card-standard">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">10. Messa in Produzione su Server (VPS Linux)</h2>
        </div>
        <div className="space-y-4 text-slate-600 dark:text-slate-300">
          <p>Se vuoi rendere il portale accessibile su internet tramite un dominio (es. www.mioportale.it), devi caricarlo su un server (es. Ubuntu su DigitalOcean, AWS, o Aruba).</p>
          
          <h4 className="font-semibold text-slate-900 dark:text-white">Passo 1: Compilazione (Build)</h4>
          <p className="text-sm">Sul tuo computer o sul server, esegui:</p>
          <code className="block bg-slate-900 text-emerald-400 p-3 rounded-md text-sm font-mono">npm run build</code>
          <p className="text-sm"><em>Cosa fa:</em> Trasforma tutto il codice React in file HTML, CSS e JS statici, super ottimizzati e leggeri, salvandoli in una cartella chiamata <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">dist</code>.</p>

          <h4 className="font-semibold text-slate-900 dark:text-white mt-6">Passo 2: Configurazione Nginx (Reverse Proxy)</h4>
          <p className="text-sm">Sul server Linux, installa Nginx per servire i file statici:</p>
          <code className="block bg-slate-900 text-emerald-400 p-3 rounded-md text-sm font-mono">
            sudo apt update<br/>
            sudo apt install nginx
          </code>
          <p className="text-sm mt-2">Copia il contenuto della cartella <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">dist</code> nella directory web di Nginx (di solito <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">/var/www/html</code>).</p>

          <h4 className="font-semibold text-slate-900 dark:text-white mt-6">Passo 3: Firewall e Porte</h4>
          <p className="text-sm">Assicurati che il firewall del server permetta il traffico web (porta 80 per HTTP, 443 per HTTPS):</p>
          <code className="block bg-slate-900 text-emerald-400 p-3 rounded-md text-sm font-mono">
            sudo ufw allow 'Nginx Full'<br/>
            sudo ufw enable
          </code>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg mt-4 border border-emerald-100 dark:border-emerald-800">
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">Perché non usiamo PM2 qui?</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              PM2 serve per mantenere attivi processi Node.js (come un backend Express). Poiché questa è una Single Page Application (solo frontend), una volta eseguita la "build", i file sono statici. Nginx è sufficiente per servirli 24/7. PM2 sarà necessario solo se aggiungerai un backend Node.js separato.
            </p>
          </div>
        </div>
      </section>
      </div>
      )}

    </div>
  );
}
