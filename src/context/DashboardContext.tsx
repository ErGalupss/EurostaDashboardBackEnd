import React, { createContext, useContext, useState, useEffect } from 'react';
import { Incarico, generateMockData } from '../lib/data';

interface FilterState {
  richiedente: string[];
  statoWorkFlow: string[];
  regione: string[];
  lavorata: string[];
  provincia: string[];
  partner: string[];
  categoriaRiscontrata: string[];
  searchQuery: string;
  dateRange: { start: string | null; end: string | null };
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  rowCount: number;
  status: 'success' | 'error';
}

interface Dataset {
  metadata: FileMetadata;
  data: Incarico[];
}

interface DashboardContextType {
  data: Incarico[];
  filteredData: Incarico[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  refreshData: () => void;
  updateData: (newData: Incarico[], fileInfo?: Omit<FileMetadata, 'id' | 'uploadDate' | 'status'>) => void;
  setData: React.Dispatch<React.SetStateAction<Incarico[]>>;
  isLoading: boolean;
  uploadProgress: number | null;
  setUploadProgress: (progress: number | null) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  fileHistory: FileMetadata[];
  datasets: Dataset[];
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<Incarico[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [fileHistory, setFileHistory] = useState<FileMetadata[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fileHistory');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [filters, setFilters] = useState<FilterState>({
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
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('fileHistory', JSON.stringify(fileHistory));
  }, [fileHistory]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const filteredData = React.useMemo(() => {
    return data.filter(item => {
      if (filters.richiedente.length > 0 && !filters.richiedente.includes(item.Richiedente)) return false;
      if (filters.statoWorkFlow.length > 0 && !filters.statoWorkFlow.includes(item.StatoWorkFlow)) return false;
      if (filters.regione.length > 0 && !filters.regione.includes(item.RegioneRiferimento)) return false;
      if (filters.lavorata.length > 0 && !filters.lavorata.includes(item.Lavorata)) return false;
      if (filters.provincia.length > 0 && !filters.provincia.includes(item.ProvinciaRichiedente)) return false;
      if (filters.partner.length > 0 && !filters.partner.includes(item.Partner)) return false;
      
      if (filters.categoriaRiscontrata.length > 0) {
        const hasEmpty = filters.categoriaRiscontrata.includes('EMPTY');
        const hasMatch = filters.categoriaRiscontrata.includes(item.CategoriaRiscontrata);
        const isEmptyItem = !item.CategoriaRiscontrata || item.CategoriaRiscontrata.trim() === '';
        
        if (!hasMatch && !(hasEmpty && isEmptyItem)) {
          return false;
        }
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          item.Incarico.toLowerCase().includes(query) ||
          item.Richiedente.toLowerCase().includes(query) ||
          item.CodiceFiscale.toLowerCase().includes(query) ||
          item.CPI.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      if (filters.dateRange.start && new Date(item.DataRichiesta) < new Date(filters.dateRange.start)) return false;
      if (filters.dateRange.end && new Date(item.DataRichiesta) > new Date(filters.dateRange.end)) return false;
      
      return true;
    });
  }, [data, filters]);

  const refreshData = () => {
    // Only set initial mock data if data is empty, otherwise keep existing data
    if (data.length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        const mockData = generateMockData(500);
        setData(mockData);
        setIsLoading(false);
      }, 500);
    }
  };

  const updateData = (newData: Incarico[], fileInfo?: Omit<FileMetadata, 'id' | 'uploadDate' | 'status'>) => {
    setData(newData);
    if (fileInfo) {
      const newFile: FileMetadata = {
        ...fileInfo,
        id: `FILE-${Date.now()}`,
        uploadDate: new Date().toISOString(),
        status: 'success'
      };
      setFileHistory(prev => [newFile, ...prev]);
      setDatasets(prev => [{ metadata: newFile, data: newData }, ...prev]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DashboardContext.Provider value={{ 
      data, 
      filteredData, 
      filters, 
      setFilters, 
      refreshData, 
      updateData, 
      setData,
      isLoading,
      uploadProgress,
      setUploadProgress,
      darkMode,
      toggleDarkMode,
      fileHistory,
      datasets
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
