import React, { useState } from 'react';
import { Compass, Filter, Sparkles, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { PortfolioService } from '../../lib/portfolioService';
import { OpportunityCard } from '../../components/cards/OpportunityCard';

export const OpportunitiesPage: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<string>('ALL');
  const opportunities = PortfolioService.getOpportunities();

  const filteredOpportunities = opportunities.filter((opp) => {
    if (selectedStyle === 'ALL') return true;
    return opp.radarStyle === selectedStyle;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-400" />
            <span>Radar de Oportunidades & Inteligência</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Empresas para estudo com score transparente e explicável, teses fundamentadas e riscos explícitos.
          </p>
        </div>

        {/* Style Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setSelectedStyle('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedStyle === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Radar Completo
          </button>
          <button
            onClick={() => setSelectedStyle('GROWTH_WITH_FUNDAMENTALS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedStyle === 'GROWTH_WITH_FUNDAMENTALS'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Crescimento com Fundamentos
          </button>
          <button
            onClick={() => setSelectedStyle('DISCOUNTED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedStyle === 'DISCOUNTED'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Descontadas
          </button>
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900/60 border border-blue-900/40 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-slate-100 mb-0.5">
            Critérios do Score Auditável DollarPath
          </h3>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            O score de cada empresa é calculado a partir de cinco dimensões ponderadas: <strong>Crescimento</strong> (receita/fluxo de caixa), <strong>Qualidade Operacional</strong> (margens e ROIC), <strong>Solidez do Balanço</strong> (nível de alavancagem), <strong>Valuation</strong> (múltiplos versus crescimento) e <strong>Catalisadores</strong> de médio prazo. Se faltarem dados comprovados, o status exibe <em>dados insuficientes</em> em vez de notas artificiais.
          </p>
        </div>
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>
    </div>
  );
};
