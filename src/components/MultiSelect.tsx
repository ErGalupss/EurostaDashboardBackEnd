import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  icon?: React.ReactNode;
  multiple?: boolean;
}

export default function MultiSelect({ options, value, onChange, placeholder, icon, multiple = true }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const toggleOption = (option: string) => {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter(v => v !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      onChange([option]);
      setIsOpen(false);
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (opt === 'EMPTY' && '(vuoto)'.includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className="flex items-center justify-between w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          <div className="truncate text-slate-700 dark:text-slate-300">
            {value.length === 0 ? (
              <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
            ) : value.length === 1 ? (
              value[0] === 'EMPTY' ? '(Vuoto)' : value[0]
            ) : (
              <span className="font-medium text-indigo-600 dark:text-indigo-400">{value.length} selezionati</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {value.length > 0 && (
            <div 
              className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              onClick={clearSelection}
            >
              <X className="w-3.5 h-3.5" />
            </div>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-80 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                className="w-full pl-7 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Cerca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto py-1 flex-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400 text-center">Nessun risultato</div>
            ) : (
              filteredOptions.map((option, idx) => {
                const isSelected = value.includes(option);
                const displayLabel = option === 'EMPTY' ? '(Vuoto)' : option;
                
                return (
                  <div 
                    key={idx}
                    className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 ${isSelected ? 'bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}
                    onClick={() => toggleOption(option)}
                  >
                    <span className="truncate pr-2">{displayLabel}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
