import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { 
  FileText, 
  Calendar, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowRight,
  HardDrive,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import MultiSelect from '../components/MultiSelect';

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function FileHistory() {
  const { fileHistory, datasets, setData } = useDashboard();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const handleFileSelect = (fileId: string) => {
    const selectedDataset = datasets.find(d => d.metadata.id === fileId);
    if (selectedDataset) {
      setData(selectedDataset.data);
      navigate('/'); // Navigate to overview page
    }
  };

  const filteredHistory = useMemo(() => {
    return fileHistory
      .filter(file => {
        if (statusFilter !== 'all' && file.status !== statusFilter) {
          return false;
        }
        if (dateFilter && !file.uploadDate.startsWith(dateFilter)) {
          return false;
        }
        if (searchTerm && !file.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        return true;
      });
  }, [fileHistory, searchTerm, statusFilter, dateFilter]);

  return (
    <div className="flex flex-col gap-[var(--section-spacing)]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Storico Caricamenti</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Visualizza l'elenco dei file Excel elaborati dal portale e le relative statistiche.
        </p>
      </div>

      <div className="card-standard">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Cerca</label>
            <input 
              type="text"
              placeholder="Cerca per nome..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Stato</label>
            <MultiSelect
              placeholder="Tutti gli stati"
              options={['Tutti gli stati', 'Successo', 'Errore']}
              value={[
                statusFilter === 'all' ? 'Tutti gli stati' : 
                statusFilter === 'success' ? 'Successo' : 'Errore'
              ]}
              onChange={(vals) => {
                const val = vals[0];
                if (val === 'Tutti gli stati') setStatusFilter('all');
                else if (val === 'Successo') setStatusFilter('success');
                else if (val === 'Errore') setStatusFilter('error');
              }}
              multiple={false}
              icon={<Filter className="w-4 h-4" />}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Data</label>
            <input 
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="block w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="card-standard text-center py-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nessun file caricato</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
            I file che caricherai appariranno qui con i dettagli sull'elaborazione e il numero di record importati.
          </p>
        </div>
      ) : (
        <div className="grid gap-[var(--grid-gap)]">
          {filteredHistory.map((file) => (
            <div 
              key={file.id}
              onClick={() => handleFileSelect(file.id)}
              className="card-standard hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl shrink-0">
                  <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate" title={file.name}>
                      {file.name}
                    </h3>
                    {file.status === 'success' ? (
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> OK
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> ERROR
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(file.uploadDate), "d MMMM yyyy, HH:mm", { locale: it })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5" />
                      {formatFileSize(file.size)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" />
                      {file.rowCount} record
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:border-l border-slate-100 dark:border-slate-700 md:pl-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID Elaborazione</p>
                    <p className="text-xs font-mono text-slate-600 dark:text-slate-300">{file.id}</p>
                  </div>
                  <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {fileHistory.length > 0 && (
        <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Riepilogo Totale</h3>
              <p className="text-indigo-100 text-sm">
                Hai caricato un totale di <strong>{fileHistory.length}</strong> file per un volume complessivo di 
                <strong> {fileHistory.reduce((acc, f) => acc + f.rowCount, 0)}</strong> record elaborati.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center min-w-[120px]">
                <div className="text-2xl font-bold">{fileHistory.length}</div>
                <div className="text-[10px] uppercase font-bold text-indigo-200">File Totali</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center min-w-[120px]">
                <div className="text-2xl font-bold">{formatFileSize(fileHistory.reduce((acc, f) => acc + f.size, 0))}</div>
                <div className="text-[10px] uppercase font-bold text-indigo-200">Spazio Totale</div>
              </div>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>
      )}
    </div>
  );
}
