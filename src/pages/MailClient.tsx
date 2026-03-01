import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, LogIn, LogOut, Search, Star, Clock, Inbox, Send, AlertCircle } from 'lucide-react';

interface Email {
  id: string;
  snippet: string;
  subject: string;
  from: string;
  date: string;
}

export default function MailClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      setIsAuthenticated(data.isAuthenticated);
      if (data.isAuthenticated) {
        fetchEmails();
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        checkAuthStatus();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const data = await res.json();
      
      const authWindow = window.open(
        data.url,
        'oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        alert('Per favore, abilita i popup per questo sito per collegare il tuo account.');
      }
    } catch (err) {
      console.error('Error initiating login:', err);
      setError("Errore durante l'avvio dell'autenticazione.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setEmails([]);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gmail/messages');
      if (!res.ok) {
        if (res.status === 401) setIsAuthenticated(false);
        throw new Error('Errore nel recupero delle email');
      }
      const data = await res.json();
      setEmails(data);
    } catch (err: any) {
      console.error('Error fetching emails:', err);
      setError(err.message || 'Si è verificato un errore.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated === null) {
    return <div className="p-8 text-center text-slate-500">Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Client Mail</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestisci le tue email direttamente dalla dashboard.</p>
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <button
              onClick={fetchEmails}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Aggiorna
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30 rounded-lg text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Scollega Account
            </button>
          </div>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Collega la tua E-mail</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Accedi con il tuo account Google per visualizzare e gestire le tue email direttamente da questa piattaforma.
          </p>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 mb-8 text-left text-sm text-amber-800 dark:text-amber-400 flex gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold mb-1">Configurazione OAuth Richiesta</p>
              <p>Per far funzionare questa integrazione, devi configurare le credenziali OAuth di Google e impostare gli URI di reindirizzamento.</p>
              <p className="mt-2 text-xs opacity-80">
                URI di reindirizzamento da aggiungere: <br/>
                <code className="bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">{window.location.origin}/auth/callback</code>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95"
          >
            <LogIn className="w-5 h-5" />
            Accedi con Google
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100dvh-12rem)] min-h-[600px]">
          {/* Sidebar Mail */}
          <div className="w-full lg:w-64 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-col shrink-0">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 font-medium mb-6 transition-colors shadow-sm">
              Nuovo Messaggio
            </button>
            
            <nav className="space-y-1 flex-1">
              <a href="#" className="flex items-center justify-between px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-lg font-medium">
                <div className="flex items-center gap-3">
                  <Inbox className="w-4 h-4" />
                  Posta in arrivo
                </div>
                <span className="bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs py-0.5 px-2 rounded-full">
                  {emails.length}
                </span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg font-medium transition-colors">
                <Star className="w-4 h-4" />
                Speciali
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg font-medium transition-colors">
                <Clock className="w-4 h-4" />
                Posticipati
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg font-medium transition-colors">
                <Send className="w-4 h-4" />
                Inviati
              </a>
            </nav>
          </div>

          {/* Mail List */}
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cerca nella posta..." 
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                  Caricamento email...
                </div>
              ) : error ? (
                <div className="p-8 text-center text-rose-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  {error}
                </div>
              ) : emails.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <Inbox className="w-12 h-12 mb-4 opacity-20" />
                  <p>Nessuna email trovata nella posta in arrivo.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {emails.map((email) => {
                    // Parse sender name
                    const fromMatch = email.from.match(/^(.*?)(?:\s*<.*>)?$/);
                    const senderName = fromMatch ? fromMatch[1].replace(/"/g, '') : email.from;
                    
                    // Parse date
                    const dateObj = new Date(email.date);
                    const dateStr = isNaN(dateObj.getTime()) 
                      ? email.date 
                      : dateObj.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });

                    return (
                      <div key={email.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors flex items-start gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                          {senderName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white truncate pr-4">
                              {senderName}
                            </h3>
                            <span className="text-xs text-slate-500 whitespace-nowrap">
                              {dateStr}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate mb-0.5">
                            {email.subject}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {email.snippet}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
