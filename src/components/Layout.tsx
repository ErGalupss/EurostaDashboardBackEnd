import React, { useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Mail, 
  BookOpen, 
  Menu,
  X,
  RefreshCw,
  Database,
  Network,
  Code,
  Brain,
  Palette,
  Bot,
  FileText,
  Upload,
  Moon,
  Sun,
  Rocket,
  Scale,
  Bug,
  FileSignature,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Server
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useDashboard } from '../context/DashboardContext';
import { read, utils } from 'xlsx';
import { Incarico } from '../lib/data';
import FilterBar from './FilterBar';

const SidebarItem = ({ to, icon: Icon, label, isCollapsed }: { to: string; icon: any; label: string; isCollapsed: boolean }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
        isActive
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white",
        isCollapsed && "justify-center px-2"
      )
    }
    title={isCollapsed ? label : undefined}
  >
    <Icon className="w-5 h-5 shrink-0" />
    {!isCollapsed && <span className="truncate">{label}</span>}
  </NavLink>
);

const SidebarExternalItem = ({ href, icon: Icon, label, isCollapsed }: { href: string; icon: any; label: string; isCollapsed: boolean }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white",
      isCollapsed && "justify-center px-2"
    )}
    title={isCollapsed ? label : undefined}
  >
    <Icon className="w-5 h-5 shrink-0" />
    {!isCollapsed && <span className="truncate">{label}</span>}
    {!isCollapsed && <span className="ml-auto text-xs opacity-50">↗</span>}
  </a>
);

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { refreshData, updateData, isLoading, uploadProgress, setUploadProgress, darkMode, toggleDarkMode } = useDashboard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  const showFilterBar = ['/', '/partner', '/operativo', '/pec', '/datalist', '/confronto', '/history'].includes(location.pathname);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0); // Start upload

    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentLoaded = Math.round((event.loaded / event.total) * 50); // First 50% is reading
        setUploadProgress(percentLoaded);
      }
    };

    reader.onload = (evt) => {
      try {
        setUploadProgress(60); // Reading done, starting parsing
        
        // Use setTimeout to allow UI to update before heavy parsing
        setTimeout(() => {
          const arrayBuffer = evt.target?.result;
          const wb = read(arrayBuffer, { type: 'array', cellDates: true });
          setUploadProgress(80); // Workbook read

          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = utils.sheet_to_json(ws);
          setUploadProgress(90); // JSON converted

          if (data.length === 0) {
            alert("Il file Excel sembra vuoto o non valido.");
            setUploadProgress(null);
            return;
          }

          // Helper to safely extract value regardless of header casing/trimming
          const getValue = (row: any, key: string) => {
            const normalizedKey = key.toLowerCase().trim();
            const rowKey = Object.keys(row).find(k => k.toLowerCase().trim() === normalizedKey);
            return rowKey ? row[rowKey] : undefined;
          };

          // Helper to normalize strings to Title Case
          const toTitleCase = (str: string) => {
            if (!str) return '';
            return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
          };

          // Helper to safely parse dates
          const getDate = (val: any): string | null => {
            if (!val) return null;
            if (val instanceof Date) return val.toISOString();
            // Handle Excel serial dates if any (though cellDates: true handles most)
            if (typeof val === 'number') {
              // Excel date serial number
              const d = new Date(Math.round((val - 25569)*86400*1000));
              return !isNaN(d.getTime()) ? d.toISOString() : null;
            }
            const d = new Date(val);
            return !isNaN(d.getTime()) ? d.toISOString() : null;
          };

          const mappedData: Incarico[] = data.map((row: any, index: number) => {
            const dataRichiesta = getDate(getValue(row, 'Primo Invio PEC')) || getDate(getValue(row, 'Data richiesta')) || new Date().toISOString();
            const dataUltimaModifica = getDate(getValue(row, 'Data Ultima Modifica')) || dataRichiesta;
            const dataUltimaTransizione = getDate(getValue(row, 'Data Ultima Transizione')) || dataRichiesta;

            return {
              id: `INC-${10000 + index}`,
              Incarico: getValue(row, 'Incarico') || `INC-${10000 + index}`,
              Commessa: getValue(row, 'Commessa') || '',
              CPI: getValue(row, 'CPI') || '',
              RegioneRiferimento: getValue(row, 'Regione Riferimento') || '',
              Richiedente: getValue(row, 'Richiedente') || '',
              CodiceFiscale: getValue(row, 'Codice Fiscale') || '',
              ProvinciaRichiedente: getValue(row, 'Provincia Richiedente') || '',
              StatoWorkFlow: getValue(row, 'Stato rintraccio') || getValue(row, 'Stato Work Flow') || 'In Attesa',
              DataUltimaTransizione: dataUltimaTransizione,
              DataUltimaModifica: dataUltimaModifica,
              DataRichiesta: dataRichiesta,
              Lavorata: getValue(row, 'Lavorata') || 'NO',
              CategoriaRiscontrata: (getValue(row, 'Categoria Riscontrata') || getValue(row, 'Prodotto') || getValue(row, 'Esito Rintraccio') || getValue(row, 'Categoria') || '').toString().toUpperCase().trim(),
              Partner: getValue(row, 'Partner') || '',
              EsitoPEC: getValue(row, 'Esito PEC (se prevista)') || getValue(row, 'Esito PEC') || '',
              raw: row,
            };
          });

          console.log("Dati importati:", mappedData.length, mappedData[0]);
          updateData(mappedData, {
            name: file.name,
            size: file.size,
            rowCount: mappedData.length
          });
          setUploadProgress(100);
          setTimeout(() => setUploadProgress(null), 1000); // Hide after 1s
          alert(`Importati con successo ${mappedData.length} record.`);
        }, 100);

      } catch (error) {
        console.error("Errore durante l'importazione:", error);
        alert("Errore durante la lettura del file. Verifica il formato.");
        setUploadProgress(null);
      }
    };
    
    reader.onerror = () => {
        alert("Errore di lettura del file");
        setUploadProgress(null);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex h-dvh w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-all duration-300 ease-in-out flex flex-col lg:static lg:translate-x-0",
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64" // Mobile width always 64
        )}
      >
        <div className={cn("h-16 flex items-center border-b border-slate-100 dark:border-slate-700 shrink-0 transition-all duration-300 relative", isCollapsed ? "justify-center px-0" : "px-6")}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white ml-3 truncate">
              Rintraccio<span className="text-indigo-600 dark:text-indigo-400">Analytics</span>
            </span>
          )}
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full items-center justify-center text-slate-500 hover:text-indigo-600 shadow-sm z-50"
          >
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
          <SidebarItem to="/" icon={LayoutDashboard} label="Cruscotto" isCollapsed={isCollapsed} />
          <SidebarItem to="/partner" icon={Users} label="Analisi Partner" isCollapsed={isCollapsed} />
          <SidebarItem to="/operativo" icon={Activity} label="Controllo Operativo" isCollapsed={isCollapsed} />
          <SidebarItem to="/pec" icon={Mail} label="Processo PEC" isCollapsed={isCollapsed} />
          <SidebarItem to="/datalist" icon={Database} label="Dettaglio Posizioni" isCollapsed={isCollapsed} />
          <SidebarItem to="/confronto" icon={Scale} label="Confronto File" isCollapsed={isCollapsed} />
          <SidebarItem to="/history" icon={FileText} label="Storico Caricamenti" isCollapsed={isCollapsed} />
          
          <div className={cn("pt-8 pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-all duration-300", isCollapsed ? "text-center px-0" : "px-4")}>
            {isCollapsed ? "..." : "Utilities"}
          </div>
          <SidebarItem to="/ilovepdf" icon={FileText} label="iLovePDF" isCollapsed={isCollapsed} />
          <SidebarItem to="/pdf-p7m" icon={FileSignature} label="PDF p7m" isCollapsed={isCollapsed} />
          <SidebarItem to="/calendar" icon={Calendar} label="Google Calendar" isCollapsed={isCollapsed} />

          <div className={cn("pt-8 pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-all duration-300", isCollapsed ? "text-center px-0" : "px-4")}>
            {isCollapsed ? "..." : "Engineering"}
          </div>
          <SidebarItem to="/bigquery" icon={Database} label="BigQuery & SQL" isCollapsed={isCollapsed} />
          <SidebarItem to="/architecture" icon={Network} label="Data Architecture" isCollapsed={isCollapsed} />
          <SidebarItem to="/lookml" icon={Code} label="LookML Dev" isCollapsed={isCollapsed} />
          <SidebarItem to="/datascience" icon={Brain} label="Data Science" isCollapsed={isCollapsed} />
          <SidebarItem to="/bidesign" icon={Palette} label="BI Design System" isCollapsed={isCollapsed} />
          <SidebarItem to="/biautomation" icon={Bot} label="BI Automation" isCollapsed={isCollapsed} />
          <SidebarItem to="/analyst" icon={FileText} label="Analyst Report" isCollapsed={isCollapsed} />
          <SidebarItem to="/deployment" icon={Rocket} label="Deployment & Perf" isCollapsed={isCollapsed} />

          <div className={cn("pt-4 pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-all duration-300", isCollapsed ? "text-center px-0" : "px-4")}>
            {isCollapsed ? "..." : "Supporto"}
          </div>
          <SidebarItem to="/guida-installazione" icon={BookOpen} label="Guida Installazione" isCollapsed={isCollapsed} />
          <SidebarItem to="/guida-deploy" icon={BookOpen} label="Guida Deploy Frontend" isCollapsed={isCollapsed} />
          <SidebarItem to="/guida-backend" icon={BookOpen} label="Guida Deploy Backend" isCollapsed={isCollapsed} />
          <SidebarItem to="/debug-backend" icon={Bug} label="Debug Backend" isCollapsed={isCollapsed} />
          <SidebarExternalItem href="/docs" icon={Server} label="Backend API (Swagger)" isCollapsed={isCollapsed} />
          <SidebarItem to="/guida" icon={BookOpen} label="Guida Tecnica" isCollapsed={isCollapsed} />
        </nav>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
          <div className={cn("flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer group", isCollapsed && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 group-hover:scale-105 transition-transform shrink-0">
              DA
            </div>
            {!isCollapsed && (
              <div className="text-sm overflow-hidden">
                <p className="font-bold text-slate-900 dark:text-white truncate">Senior Analyst</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs truncate">Admin View</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-dvh overflow-hidden relative">
        {/* Upload Progress Overlay */}
        {uploadProgress !== null && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 max-w-sm w-full text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Elaborazione File</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Lettura e analisi dei dati in corso...</p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 text-right">{uploadProgress}%</p>
            </div>
          </div>
        )}

        {/* Unified Header */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">Rintraccio</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-800">
              Live Data
            </div>
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 animate-pulse">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Sincronizzazione...
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors lg:flex lg:items-center lg:gap-2 lg:px-3 lg:py-1.5 lg:border lg:border-slate-200 lg:dark:border-slate-700"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5 lg:w-4 lg:h-4" /> : <Moon className="w-5 h-5 lg:w-4 lg:h-4" />}
              <span className="hidden lg:block text-sm font-medium">{darkMode ? 'Light' : 'Dark'}</span>
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".xlsx, .xls"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 transition-colors lg:flex lg:items-center lg:gap-2 lg:px-3 lg:py-1.5 lg:bg-indigo-600 lg:text-white lg:hover:bg-indigo-700 lg:disabled:opacity-50"
              title="Carica Excel"
            >
              <Upload className="w-5 h-5 lg:w-4 lg:h-4" />
              <span className="hidden lg:block text-sm font-medium">Carica Excel</span>
            </button>
            
            <button 
              onClick={refreshData}
              disabled={isLoading}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-all"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              Aggiorna
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-6">
          <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-4">
            {showFilterBar && <FilterBar />}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
