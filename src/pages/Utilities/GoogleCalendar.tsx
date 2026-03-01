import React, { useState, useEffect } from 'react';
import { Calendar, Save, Settings } from 'lucide-react';

export default function GoogleCalendar() {
  const [calendarId, setCalendarId] = useState('');
  const [savedCalendarId, setSavedCalendarId] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('google_calendar_id');
    if (saved) {
      setSavedCalendarId(saved);
      setCalendarId(saved);
    } else {
      setIsEditing(true);
    }
  }, []);

  const handleSave = () => {
    // Extract src from iframe if user pasted the whole iframe
    let finalId = calendarId;
    if (calendarId.includes('<iframe')) {
      const match = calendarId.match(/src="([^"]+)"/);
      if (match && match[1]) {
        finalId = match[1];
      }
    }
    
    localStorage.setItem('google_calendar_id', finalId);
    setSavedCalendarId(finalId);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Google Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400">Visualizza il tuo calendario direttamente nella dashboard.</p>
        </div>
        {!isEditing && savedCalendarId && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <Settings className="w-4 h-4" />
            Impostazioni
          </button>
        )}
      </div>

      {isEditing || !savedCalendarId ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configura Calendario</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                ID Calendario o URL di incorporamento
              </label>
              <input
                type="text"
                value={calendarId}
                onChange={(e) => setCalendarId(e.target.value)}
                placeholder="es. c_123456@group.calendar.google.com o incolla l'intero <iframe>"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Per trovare l'ID: apri Google Calendar su PC {'>'} Impostazioni {'>'} Clicca sul tuo calendario {'>'} Scorri fino a "Integra calendario" {'>'} Copia l'ID calendario o il codice di incorporamento. Assicurati che il calendario sia pubblico.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              {savedCalendarId && (
                <button
                  onClick={() => {
                    setCalendarId(savedCalendarId);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Annulla
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!calendarId.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                Salva
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-[800px]">
          <iframe
            src={savedCalendarId.startsWith('http') ? savedCalendarId : `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(savedCalendarId)}&ctz=Europe%2FRome`}
            style={{ border: 0 }}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            title="Google Calendar"
          ></iframe>
        </div>
      )}
    </div>
  );
}
