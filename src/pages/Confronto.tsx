import React, { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { calculateKPIs } from '../lib/kpiUtils';
import { Scale, FileText } from 'lucide-react';
import MultiSelect from '../components/MultiSelect';

const ComparisonCard = ({ title, valueA, valueB, format = (v: any) => v }: any) => {
  const valA = parseFloat(valueA) || 0;
  const valB = parseFloat(valueB) || 0;
  const delta = valA - valB;
  const deltaPercentage = valB !== 0 ? (delta / valB) * 100 : 0;

  const getDeltaColor = () => {
    if (delta > 0) return 'text-emerald-500';
    if (delta < 0) return 'text-rose-500';
    return 'text-slate-500';
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{title}</p>
      <div className="flex items-baseline justify-between mt-2">
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{format(valA)}</p>
        <p className={`text-sm font-bold ${getDeltaColor()}`}>
          {delta > 0 ? '+' : ''}{format(delta)} ({deltaPercentage.toFixed(1)}%)
        </p>
      </div>
      <p className="text-xs text-slate-400 mt-1">Confronto con: {format(valB)}</p>
    </div>
  );
};

export default function Confronto() {
  const { datasets } = useDashboard();
  const [baseFileId, setBaseFileId] = useState<string | null>(datasets.length > 0 ? datasets[0].metadata.id : null);
  const [compareFileId, setCompareFileId] = useState<string | null>(datasets.length > 1 ? datasets[1].metadata.id : null);

  const comparisonData = useMemo(() => {
    if (!baseFileId || !compareFileId || baseFileId === compareFileId) return null;

    const baseDataset = datasets.find(d => d.metadata.id === baseFileId);
    const compareDataset = datasets.find(d => d.metadata.id === compareFileId);

    if (!baseDataset || !compareDataset) return null;

    const baseKPIs = calculateKPIs(baseDataset.data);
    const compareKPIs = calculateKPIs(compareDataset.data);
    
    return { base: baseKPIs, compare: compareKPIs, baseMeta: baseDataset.metadata, compareMeta: compareDataset.metadata };
  }, [datasets, baseFileId, compareFileId]);

  return (
    <div className="flex flex-col gap-[var(--section-spacing)]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Confronto File</h1>
        <p className="text-slate-500 dark:text-slate-400">Seleziona due file per confrontare le performance.</p>
      </div>

      <div className="card-standard grid-12 items-center">
        <div className="col-span-12 md:col-span-6 space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">File Base (A)</label>
          <MultiSelect
            placeholder="Seleziona file..."
            options={datasets.map(d => d.metadata.name)}
            value={baseFileId ? [datasets.find(d => d.metadata.id === baseFileId)?.metadata.name || ''] : []}
            onChange={(vals) => {
              const selectedName = vals[0];
              const selectedId = datasets.find(d => d.metadata.name === selectedName)?.metadata.id;
              setBaseFileId(selectedId || null);
            }}
            multiple={false}
            icon={<FileText className="w-4 h-4" />}
          />
        </div>
        <div className="col-span-12 md:col-span-6 space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">File di Confronto (B)</label>
          <MultiSelect
            placeholder="Seleziona file..."
            options={datasets.map(d => d.metadata.name)}
            value={compareFileId ? [datasets.find(d => d.metadata.id === compareFileId)?.metadata.name || ''] : []}
            onChange={(vals) => {
              const selectedName = vals[0];
              const selectedId = datasets.find(d => d.metadata.name === selectedName)?.metadata.id;
              setCompareFileId(selectedId || null);
            }}
            multiple={false}
            icon={<FileText className="w-4 h-4" />}
          />
        </div>
      </div>

      {comparisonData ? (
        <div className="flex flex-col gap-[var(--section-spacing)]">
            <div className="grid-12">
                <div className="col-span-12 sm:col-span-6 lg:col-span-3"><ComparisonCard title="Totale Incarichi" valueA={comparisonData.base.total} valueB={comparisonData.compare.total} /></div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-3"><ComparisonCard title="Tasso di Chiusura" valueA={comparisonData.base.closedPercentage} valueB={comparisonData.compare.closedPercentage} format={(v: any) => `${v.toFixed(1)}%`} /></div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-3"><ComparisonCard title="Tempo Medio (TAT)" valueA={comparisonData.base.avgTAT} valueB={comparisonData.compare.avgTAT} format={(v: any) => `${v.toFixed(1)} gg`} /></div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-3"><ComparisonCard title="Success Rate" valueA={comparisonData.base.successRate} valueB={comparisonData.compare.successRate} format={(v: any) => `${v.toFixed(1)}%`} /></div>
            </div>
        </div>
      ) : (
        <div className="card-standard text-center py-12">
            <Scale className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">Seleziona due file per iniziare il confronto</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Scegli un file base e uno da confrontare dai menu a tendina.</p>
        </div>
      )}
    </div>
  );
}
