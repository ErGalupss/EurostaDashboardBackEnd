import React from 'react';
import { cn } from '../lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ElementType;
  color?: "indigo" | "emerald" | "rose" | "amber";
}

export default function MetricCard({ label, value, trend, trendLabel, icon: Icon, color = "indigo" }: MetricCardProps) {
  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  };

  return (
    <div className="card-standard flex flex-col justify-between h-full transition-colors duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate" title={label}>{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white truncate" title={String(value)}>{value}</p>
        </div>
        {Icon && (
          <div className={cn("p-3 rounded-lg flex-shrink-0", colorStyles[color])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center text-sm">
          <span
            className={cn(
              "flex items-center font-medium",
              trend >= 0 ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {trend >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            {Math.abs(trend)}%
          </span>
          <span className="ml-2 text-slate-400">{trendLabel || "vs mese prec."}</span>
        </div>
      )}
    </div>
  );
}
