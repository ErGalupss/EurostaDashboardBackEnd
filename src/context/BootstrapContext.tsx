import React, { createContext, useContext, useEffect, useState } from 'react';

interface UIConfig {
  version: number;
  theme: any;
  sidebar: any[];
  modules: Record<string, any>;
  pages: Record<string, any>;
  forms: Record<string, any>;
}

interface BootstrapContextType {
  config: UIConfig | null;
  isLoading: boolean;
  error: string | null;
}

const BootstrapContext = createContext<BootstrapContextType | undefined>(undefined);

export const BootstrapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<UIConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/ui/bootstrap');
        if (!response.ok) throw new Error('Failed to fetch UI configuration');
        const data = await response.json();
        setConfig(data);
        
        // Apply theme dynamically
        if (data.theme) {
          const root = document.documentElement;
          root.style.setProperty('--primary-color', data.theme.primary);
          root.style.setProperty('--border-radius', data.theme.borderRadius);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <BootstrapContext.Provider value={{ config, isLoading, error }}>
      {children}
    </BootstrapContext.Provider>
  );
};

export const useUIConfig = () => {
  const context = useContext(BootstrapContext);
  if (!context) throw new Error('useUIConfig must be used within a BootstrapProvider');
  return context;
};
