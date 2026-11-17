import React, { useState } from 'react';
import { Opportunity } from '@dollarpath/shared';
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onExplore?: (ticker: string) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onExplore }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [imgError, setImgError] = useState(false);

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-slate-400 bg-slate-800';
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 75) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  const getRadarStyleLabel = (style: string) => {
    switch (style) {
      case 'GROWTH_WITH_FUNDAMENTALS':
        return 'Crescimento com Fundamentos';
      case 'AGGRESSIVE_GROWTH':
        return 'Crescimento Agressivo';
      case 'DISCOUNTED':
        return 'Oportunidade Descontada';
      default:
        return 'Radar Geral';
    }
  };

  return (
    <div className="bg-[#0f172a]/80 hover:bg-[#131d2e] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between group shadow-sm">
      {/* Visual Header with Image */}
      <div className="relative h-44 overflow-hidden bg-slate-900">
        {!imgError && opportunity.imageUrl ? (
          <img
            src={opportunity.imageUrl}
            alt={opportunity.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-500 p-4">
            <span className="text-xl font-bold font-mono text-slate-400">${opportunity.ticker}</span>
            <span className="text-xs text-slate-500">{opportunity.sector}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#090d12] via-transparent to-black/40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/90 border border-slate-700 text-slate-200 backdrop-blur-md">
            {getRadarStyleLabel(opportunity.radarStyle)}
          </span>

          {opportunity.score && (
            <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 backdrop-blur-md ${getScoreColor(opportunity.score)}`}>
              <Award className="w-3.5 h-3.5" />
              <span>Score: {opportunity.score}/100</span>
            </div>
          )}
        </div>

        {/* Bottom Ticker & Name */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-lg font-bold text-white tracking-wider">
              ${opportunity.ticker}
            </span>
            <span className="text-xs text-slate-300 font-medium truncate">
              {opportunity.name}
            </span>
          </div>
          <span className="text-[11px] text-blue-400 font-medium">
            {opportunity.sector}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tese Resumida */}
          <div className="mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Tese de Investimento
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {opportunity.thesis}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          {opportunity.financials && (
            <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center mb-3">
              <div>
                <span className="text-[10px] text-slate-500 block">P/E Ratio</span>
                <span className="text-xs font-bold text-slate-200">{opportunity.financials.peRatio || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Cresc. YoY</span>
                <span className="text-xs font-bold text-emerald-400">{opportunity.financials.revenueGrowthYoY || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Margem Líq.</span>
                <span className="text-xs font-bold text-blue-400">{opportunity.financials.netMargin || '-'}</span>
              </div>
            </div>
          )}

          {/* Catalysts & Risks */}
          <div className="space-y-2 mt-2">
            {opportunity.catalysts.length > 0 && (
              <div className="flex items-start gap-2 text-[11px] text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2"><strong className="text-slate-200">Catalisador:</strong> {opportunity.catalysts[0]}</span>
              </div>
            )}

            {opportunity.risks.length > 0 && (
              <div className="flex items-start gap-2 text-[11px] text-slate-300">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2"><strong className="text-slate-200">Risco:</strong> {opportunity.risks[0]}</span>
              </div>
            )}
          </div>

          {/* Detailed Score Accordion */}
          {showDetails && opportunity.scoreDetails && (
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs animate-fadeIn">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                Desmembramento Explicável do Score
              </span>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Crescimento de Receita/Caixa:</span>
                  <span className="font-semibold text-slate-200">{opportunity.scoreDetails.growth}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${opportunity.scoreDetails.growth}%` }} />
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Qualidade Operacional & Margens:</span>
                  <span className="font-semibold text-slate-200">{opportunity.scoreDetails.quality}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${opportunity.scoreDetails.quality}%` }} />
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Solidez do Balanço & Dívida:</span>
                  <span className="font-semibold text-slate-200">{opportunity.scoreDetails.balanceSheet}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${opportunity.scoreDetails.balanceSheet}%` }} />
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Valuation & Múltiplos:</span>
                  <span className="font-semibold text-slate-200">{opportunity.scoreDetails.valuation}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${opportunity.scoreDetails.valuation}%` }} />
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Risco Avaliado: <strong className="text-slate-200">{opportunity.scoreDetails.riskLevel}</strong></span>
                <span>Revisto em: {opportunity.reviewDate}</span>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer font-medium"
          >
            {showDetails ? (
              <>Ocultar Critérios <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Ver Critérios do Score <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>

          {onExplore && (
            <button
              onClick={() => onExplore(opportunity.ticker)}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Estudar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
