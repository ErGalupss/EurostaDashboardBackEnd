import React, { useState, useEffect } from 'react';
import { Mail, Inbox, Send, AlertCircle, RefreshCw, LogOut } from 'lucide-react';

export default function EmailClient() {
  const [tokens, setTokens] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedTokens = localStorage.getItem('gmail_tokens');
    if (savedTokens) {
      try {
        setTokens(JSON.parse(savedTokens));
      } catch (e) {
        console.error('Failed to parse tokens', e);
      }
    }
  }, []);

  useEffect(() => {
    if (tokens) {
      fetchMessages();
    }
  }, [tokens]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const newTokens = event.data.tokens;
        setTokens(newTokens);
        localStorage.setItem('gmail_tokens', JSON.stringify(newTokens));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnect = async () => {
    try {
      setError('');
      const redirectUri = `${window.location.origin}/auth/callback`;
      const response = await fetch(`/api/auth/url?redirectUri=${encodeURIComponent(redirectUri)}`);
      
      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }
      
      const { url } = await response.json();
      
      const authWindow = window.open(
        url,
        'oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        setError('Please allow popups for this site to connect your account.');
      }
    } catch (err) {
      console.error('OAuth error:', err);
      setError('Failed to initiate connection. Check your configuration.');
    }
  };

  const handleDisconnect = () => {
    setTokens(null);
    setMessages([]);
    localStorage.removeItem('gmail_tokens');
  };

  const fetchMessages = async () => {
    if (!tokens) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/gmail/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens, maxResults: 15 })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to fetch messages. Your session might have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokens) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Collega la tua Email
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Connetti il tuo account Google per visualizzare e gestire le tue email direttamente dalla dashboard.
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg flex items-center gap-2 text-sm text-left">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={handleConnect}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            <Mail className="w-5 h-5" />
            Connetti con Google
          </button>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 text-left">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Istruzioni per l'installazione:</h3>
            <ol className="text-sm text-slate-500 dark:text-slate-400 space-y-2 list-decimal list-inside">
              <li>Vai su <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Google Cloud Console</a></li>
              <li>Crea delle credenziali OAuth 2.0 Client ID (Web application)</li>
              <li>Aggiungi questo URL di reindirizzamento: <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-xs select-all">{window.location.origin}/auth/callback</code></li>
              <li>Imposta le variabili d'ambiente <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-xs">GMAIL_CLIENT_ID</code> e <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-xs">GMAIL_CLIENT_SECRET</code></li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Email Client</h1>
          <p className="text-slate-500 dark:text-slate-400">La tua casella di posta in arrivo.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMessages}
            disabled={loading}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
            title="Aggiorna"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Disconnetti
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button className="flex-1 py-3 px-4 text-sm font-medium border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-2">
            <Inbox className="w-4 h-4" />
            In arrivo
          </button>
          <button className="flex-1 py-3 px-4 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 flex items-center justify-center gap-2 transition-colors">
            <Send className="w-4 h-4" />
            Inviati
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {loading && messages.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p>Caricamento messaggi...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <Inbox className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Nessun messaggio trovato.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${msg.isUnread ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className={`text-sm truncate pr-4 ${msg.isUnread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                    {msg.from.split('<')[0].trim() || msg.from}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(msg.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h4 className={`text-sm mb-1 truncate ${msg.isUnread ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                  {msg.subject}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-500 truncate">
                  {msg.snippet}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
