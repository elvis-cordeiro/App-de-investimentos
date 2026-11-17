import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  secondaryValue?: string;
  changePercentage?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  secondaryValue,
  changePercentage,
  changeLabel = 'período',
  icon: Icon,
  variant = 'default',
}) => {
  const isPositive = changePercentage !== undefined && changePercentage > 0;
  const isNegative = changePercentage !== undefined && changePercentage < 0;

  return (
    <div className="bg-[#0f172a]/80 hover:bg-[#131d2e] border border-slate-800/80 hover:border-slate-700/80 p-5 rounded-2xl shadow-sm transition-all duration-200 flex flex-col justify-between group">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-slate-800/70 text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-900/20 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold text-slate-100 tracking-tight">
          {value}
        </div>

        {secondaryValue && (
          <div className="text-xs text-slate-400 mt-1 font-medium">
            {secondaryValue}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
        {changePercentage !== undefined ? (
          <div className="flex items-center gap-1.5">
            <span
              className={`flex items-center gap-0.5 font-semibold px-2 py-0.5 rounded-md ${
                isPositive
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : isNegative
                  ? 'text-rose-400 bg-rose-500/10'
                  : 'text-slate-400 bg-slate-800'
              }`}
            >
              {isPositive && <TrendingUp className="w-3 h-3" />}
              {isNegative && <TrendingDown className="w-3 h-3" />}
              {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
              {changePercentage > 0 ? `+${changePercentage.toFixed(2)}%` : `${changePercentage.toFixed(2)}%`}
            </span>
            <span className="text-slate-400">{changeLabel}</span>
          </div>
        ) : (
          <span className="text-slate-400">{subtitle || 'Parametrizado'}</span>
        )}
      </div>
    </div>
  );
};
