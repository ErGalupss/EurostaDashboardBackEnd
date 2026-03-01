import React, { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Filter, X, Search, Download, Users, Briefcase, MapPin, Globe, CheckCircle2, Tag } from 'lucide-react';
import * as XLSX from 'xlsx';
import MultiSelect from './MultiSelect';

export default function FilterBar() {
  const { data, filteredData, filters, setFilters } = useDashboard();

  // Helper to get unique sorted values
  const getUniqueValues = (items: any[], key: string) => 
    Array.from(new Set(items.map(d => d[key]))).filter(v => v !== null && v !== undefined && v !== '').sort();

  const exportData = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("Nessun dato da esportare.");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dati");
    XLSX.writeFile(wb, "export_dati.xlsx");
  };

  // Compute available options based on other filters (Dependent Facets)
  const availableOptions = useMemo(() => {
    const filterData = (excludeKey: string) => {
      return data.filter(item => {
        if (excludeKey !== 'richiedente' && filters.richiedente.length > 0 && !filters.richiedente.includes(item.Richiedente)) return false;
        if (excludeKey !== 'statoWorkFlow' && filters.statoWorkFlow.length > 0 && !filters.statoWorkFlow.includes(item.StatoWorkFlow)) return false;
        if (excludeKey !== 'regione' && filters.regione.length > 0 && !filters.regione.includes(item.RegioneRiferimento)) return false;
        if (excludeKey !== 'lavorata' && filters.lavorata.length > 0 && !filters.lavorata.includes(item.Lavorata)) return false;
        if (excludeKey !== 'provincia' && filters.provincia.length > 0 && !filters.provincia.includes(item.ProvinciaRichiedente)) return false;
        if (excludeKey !== 'partner' && filters.partner.length > 0 && !filters.partner.includes(item.Partner)) return false;
        if (excludeKey !== 'categoriaRiscontrata' && filters.categoriaRiscontrata.length > 0) {
          const hasEmpty = filters.categoriaRiscontrata.includes('EMPTY');
          const hasMatch = filters.categoriaRiscontrata.includes(item.CategoriaRiscontrata);
          const isEmptyItem = !item.CategoriaRiscontrata || item.CategoriaRiscontrata.trim() === '';
          if (!hasMatch && !(hasEmpty && isEmptyItem)) return false;
        }
        return true;
      });
    };

    return {
      richiedenti: getUniqueValues(filterData('richiedente'), 'Richiedente'),
      stati: getUniqueValues(filterData('statoWorkFlow'), 'StatoWorkFlow'),
      regioni: getUniqueValues(filterData('regione'), 'RegioneRiferimento'),
      lavorate: getUniqueValues(filterData('lavorata'), 'Lavorata'),
      province: getUniqueValues(filterData('provincia'), 'ProvinciaRichiedente'),
      partners: getUniqueValues(filterData('partner'), 'Partner'),
      categorie: getUniqueValues(filterData('categoriaRiscontrata'), 'CategoriaRiscontrata'),
    };
  }, [data, filters]);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      richiedente: [],
      statoWorkFlow: [],
      regione: [],
      lavorata: [],
      provincia: [],
      partner: [],
      categoriaRiscontrata: [],
      searchQuery: '',
      dateRange: { start: null, end: null }
    });
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, v]) => {
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'string') return v !== '';
    return false;
  }).length;

  if (data.length === 0) return null;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Filtri Analisi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Affina i risultati per richiedente, stato o regione.</p>
          </div>
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cerca incarico, CF, richiedente..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            />
          </div>

          {activeFiltersCount > 0 && (
            <button 
              onClick={clearFilters}
              className="flex-shrink-0 text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5 font-medium transition-colors group"
            >
              <div className="p-1 rounded-md group-hover:bg-rose-50 dark:group-hover:bg-rose-900/20 transition-colors">
                <X className="w-3.5 h-3.5" />
              </div>
              <span className="hidden sm:inline">Resetta</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid-12">
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Partner</label>
          <MultiSelect
            placeholder="Tutti i Partner"
            options={availableOptions.partners}
            value={filters.partner}
            onChange={(val) => handleFilterChange('partner', val)}
            icon={<Briefcase className="w-4 h-4" />}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Richiedente</label>
          <MultiSelect
            placeholder="Tutti i Richiedenti"
            options={availableOptions.richiedenti}
            value={filters.richiedente}
            onChange={(val) => handleFilterChange('richiedente', val)}
            icon={<Users className="w-4 h-4" />}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Stato Workflow</label>
          <MultiSelect
            placeholder="Tutti gli Stati"
            options={availableOptions.stati}
            value={filters.statoWorkFlow}
            onChange={(val) => handleFilterChange('statoWorkFlow', val)}
            icon={<CheckCircle2 className="w-4 h-4" />}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Regione</label>
          <MultiSelect
            placeholder="Tutte le Regioni"
            options={availableOptions.regioni}
            value={filters.regione}
            onChange={(val) => handleFilterChange('regione', val)}
            icon={<Globe className="w-4 h-4" />}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Provincia</label>
          <MultiSelect
            placeholder="Tutte le Province"
            options={availableOptions.province}
            value={filters.provincia}
            onChange={(val) => handleFilterChange('provincia', val)}
            icon={<MapPin className="w-4 h-4" />}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Lavorata</label>
          <MultiSelect
            placeholder="Tutte"
            options={availableOptions.lavorate}
            value={filters.lavorata}
            onChange={(val) => handleFilterChange('lavorata', val)}
            icon={<Tag className="w-4 h-4" />}
          />
        </div>
        
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Categoria Riscontrata</label>
          <MultiSelect
            placeholder="Tutte le Categorie"
            options={['EMPTY', ...availableOptions.categorie]}
            value={filters.categoriaRiscontrata}
            onChange={(val) => handleFilterChange('categoriaRiscontrata', val)}
            icon={<Tag className="w-4 h-4" />}
          />
        </div>
      </div>
    </div>
  );
}
