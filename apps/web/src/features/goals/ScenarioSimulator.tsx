import React, { useState } from 'react';
import {
  Sliders,
  TrendingUp,
  ShieldAlert,
  Calendar,
  DollarSign,
  PieChart as PieIcon,
  CheckCircle,
  Clock,
  Layers
} from 'lucide-react';
import { IntelligenceService } from '../../lib/intelligenceService';
import { PortfolioService } from '../../lib/portfolioService';
import { ScenarioType } from '@dollarpath/shared';

export const ScenarioSimulator: React.FC = () => {
  const summary = PortfolioService.calculatePositions();
  const goal = PortfolioService.getGoal();
  const budget = PortfolioService.getBudget();
  const exchangeRate = PortfolioService.getExchangeRate();

  // Premissas editáveis
  const [selectedScenarioType, setSelectedScenarioType] = useState<ScenarioType>('BASE');
  const [monthlyContribution, setMonthlyContribution] = useState<number>(budget.plannedInvestment);
  const [timelineYears, setTimelineYears] = useState<number>(goal.deadlineYears);
  const [simulatedFX, setSimulatedFX] = useState<number>(exchangeRate);

  const projection = IntelligenceService.calculateProjections(
    summary.currentTotalBRL,
    goal.targetValue,
    monthlyContribution,
    simulatedFX,
    timelineYears
  );

  const activeScenario =
    projection.scenarios.find((s) => s.type === selectedScenarioType) || projection.scenarios[1];

  // Cálculo de decomposição dos componentes do patrimônio futuro
  // 1. Aportes acumulados no período:
  const totalFutureAportesBRL = monthlyContribution * (timelineYears * 12);
  const currentPatrimonyBRL = summary.currentTotalBRL;
  // 2. Ganho composto estimado:
  const compoundEarningsBRL = Math.max(0, activeScenario.projectedFinalValueBRL - (currentPatrimonyBRL + totalFutureAportesBRL));

  return (
    <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h2 className="text-base md:text-lg font-bold text-slate-100">
              Scenario Simulator — Cenários de Longo Prazo
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare hipóteses conservadoras, base e otimistas com premissas transparentes e auditáveis.
          </p>
        </div>

        {/* Scenario Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {projection.scenarios.map((s) => (
            <button
              key={s.type}
              onClick={() => setSelectedScenarioType(s.type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedScenarioType === s.type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s.name} ({s.expectedAnnualReturnUSD}% a.a.)
            </button>
          ))}
        </div>
      </div>

      {/* Premissas Configuráveis */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Aporte Mensal Planejado:</span>
            <span className="font-bold font-mono text-white">R$ {monthlyContribution.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(parseFloat(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">
            ≈ ${(monthlyContribution / simulatedFX).toFixed(2)} USD / mês
          </span>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Horizonte de Anos:</span>
            <span className="font-bold font-mono text-white">{timelineYears} anos</span>
          </div>
          <input
            type="range"
            min="3"
            max="25"
            step="1"
            value={timelineYears}
            onChange={(e) => setTimelineYears(parseInt(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">
            Prazo base estabelecido: 10 anos
          </span>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Câmbio Futuro Simulado:</span>
            <span className="font-bold font-mono text-white">R$ {simulatedFX.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="4.50"
            max="8.00"
            step="0.10"
            value={simulatedFX}
            onChange={(e) => setSimulatedFX(parseFloat(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">
            Sensibilidade cambial sobre o patrimônio
          </span>
        </div>
      </div>

      {/* Resultados do Cenário Selecionado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Patrimônio Final Projetado */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/50 to-slate-900 border border-blue-900/50">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 block">
            Patrimônio Projetado ao Final ({timelineYears} anos)
          </span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            R$ {activeScenario.projectedFinalValueBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-blue-300 font-medium block mt-1">
            ≈ ${activeScenario.projectedFinalValueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
          </span>
        </div>

        {/* Prazo Projetado para R$ 300.000 */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Tempo Estimado para Atingir a Meta
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {activeScenario.estimatedYearsToReachGoal} anos
          </div>
          <span className="text-xs text-slate-400 block mt-1">
            Mantendo o ritmo de R$ {monthlyContribution.toFixed(2)}/mês
          </span>
        </div>

        {/* Aporte Mensal Necessário para Manter o Prazo */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Aporte Ideal p/ Fechar em Exatos {timelineYears} Anos
          </span>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
            R$ {activeScenario.requiredMonthlyContributionBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-slate-400 block mt-1">
            ≈ ${(activeScenario.requiredMonthlyContributionBRL / simulatedFX).toFixed(2)} USD / mês
          </span>
        </div>
      </div>

      {/* Decomposição Visual dos Componentes do Patrimônio */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>Composição do Patrimônio Projetado (Estimativa Condicional)</span>
        </span>

        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex">
          <div
            className="bg-blue-600 h-3"
            style={{ width: `${(currentPatrimonyBRL / activeScenario.projectedFinalValueBRL) * 100}%` }}
            title="Patrimônio Atual"
          />
          <div
            className="bg-indigo-500 h-3"
            style={{ width: `${(totalFutureAportesBRL / activeScenario.projectedFinalValueBRL) * 100}%` }}
            title="Novos Aportes"
          />
          <div
            className="bg-emerald-500 h-3"
            style={{ width: `${(compoundEarningsBRL / activeScenario.projectedFinalValueBRL) * 100}%` }}
            title="Juros Compostos"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
            <span className="text-slate-400">Patrimônio Atual:</span>
            <strong className="text-slate-200">R$ {currentPatrimonyBRL.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
            <span className="text-slate-400">Total de Aportes:</span>
            <strong className="text-slate-200">R$ {totalFutureAportesBRL.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-slate-400">Crescimento Composto:</span>
            <strong className="text-emerald-400">R$ {compoundEarningsBRL.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</strong>
          </div>
        </div>
      </div>

      {/* Ressalva Obrigatória de Transparência */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Regra de Transparência (Seção 7):</strong> Rentabilidade passada não é garantia de retorno futuro. Projeções são simulações condicionais calculadas com juros compostos em dólares americanos (USD) e convertidas pelo câmbio simulado. Custos operacionais e retenções tributárias variam conforme o ativo e a corretora utilizada.
        </p>
      </div>
    </div>
  );
};
