import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { ArrowLeft, FileText, Calendar, MapPin, User, CheckCircle, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function IncaricoDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useDashboard();

  const incarico = data.find(d => d.id === id || d.Incarico === id);

  if (!incarico) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Incarico non trovato</h2>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Torna indietro
        </button>
      </div>
    );
  }

  // Use raw data if available, otherwise fallback to mapped fields
  const details = incarico.raw || incarico;

  // Filter out internal fields or complex objects if necessary
  const displayFields = Object.entries(details).filter(([key, value]) => {
    return key !== 'raw' && typeof value !== 'object';
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dettaglio Incarico: {incarico.Incarico}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {incarico.Commessa} • {incarico.Richiedente}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Dati Principali
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Stato Workflow</label>
                <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${incarico.StatoWorkFlow.toLowerCase().startsWith('chiusa') ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {incarico.StatoWorkFlow}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Data Richiesta</label>
                <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {format(parseISO(incarico.DataRichiesta), 'dd/MM/yyyy')}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Richiedente</label>
                <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  {incarico.Richiedente}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Localizzazione</label>
                <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {incarico.RegioneRiferimento} - {incarico.ProvinciaRichiedente}
                </div>
              </div>
            </div>
          </div>

          {/* Raw Data Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Dati Completi (Excel)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium">
                  <tr>
                    <th className="px-6 py-3 w-1/3">Campo</th>
                    <th className="px-6 py-3">Valore</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {displayFields.map(([key, value]) => (
                    <tr key={key} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">{key}</td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-400 break-all">
                        {String(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Stato Lavorazione</h3>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                incarico.Lavorata === 'SI' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {incarico.Lavorata === 'SI' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-slate-400" />
                  )}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {incarico.Lavorata === 'SI' ? 'Lavorata' : 'Non Lavorata'}
                  </span>
                </div>
                {incarico.CategoriaRiscontrata && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 ml-8">
                    Categoria: {incarico.CategoriaRiscontrata}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Ultima Modifica</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {format(parseISO(incarico.DataUltimaModifica), 'dd/MM/yyyy')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Ultima Transizione</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {format(parseISO(incarico.DataUltimaTransizione), 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
