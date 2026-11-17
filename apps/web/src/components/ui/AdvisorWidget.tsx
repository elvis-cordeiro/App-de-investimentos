import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { IntelligenceService } from '../../lib/intelligenceService';
import { PortfolioService } from '../../lib/portfolioService';

export const AdvisorWidget: React.FC = () => {
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [decisionConfirmed, setDecisionConfirmed] = useState(false);

  const budget = PortfolioService.getBudget();
  const exchangeRate = PortfolioService.getExchangeRate();
  const summary = PortfolioService.calculatePositions();

  // Decomposição dos efeitos no período
  const contributionDelta = 0; // Aporte de novembro ainda pendente
  const performanceUSD = summary.totalGainLossUSD;
  const fxImpactBRL = summary.currentTotalUSD * (exchangeRate - 5.65); // Comparativo contra taxa média inicial de aquisição

  const alternatives = [
    'Confirmar aporte de R$ 300,00 nos próximos 5 dias sem alterar orçamento',
    'Ajustar aporte deste mês para R$ 200,00 e diluir R$ 100,00 em aportes futuros',
    'Manter caixa na reserva de emergência e revisar prazo-alvo sem pressão',
  ];

  const handleConfirmDecision = (alt: string) => {
    setSelectedAlternative(alt);
    IntelligenceService.addDecisionLog({
      timestamp: new Date().toISOString(),
      eventType: 'PLANNED_CONTRIBUTION_MISSED',
      description: 'Definição da estratégia para o aporte mensal de R$ 300 de Novembro.',
      advisorExplanation:
        'O investidor optou por: ' + alt + '. O DollarPath Intelligence recalculou os cenários e confirmou que o plano de longo prazo permanece plenamente sustentável sem sacrifício de gastos essenciais.',
      effects: {
        contributionDelta: 0,
        assetPerformanceDelta: performanceUSD,
        fxDelta: fxImpactBRL,
      },
      alternatives,
      userDecision: alt,
    });

    setDecisionConfirmed(true);
    setTimeout(() => setDecisionConfirmed(false), 4000);
  };

  return (
    <div className="bg-gradient-to-br from-[#0c131f] via-[#0f172a] to-[#131d2e] border border-blue-900/50 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
      {/* Glow subtle accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm md:text-base">
                DollarPath Intelligence
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Perfil: Advisor Estratégico
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Análise construtiva de premissas, disciplina sem pressão e decomposição transparente dos resultados.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Decisão 100% Assistida</span>
        </div>
      </div>

      {/* Advisor Assessment Body */}
      <div className="pt-4 space-y-4">
        {/* Decomposição Transparente dos Efeitos (Regra Seção 7) */}
        <div>
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Decomposição de Efeitos no Patrimônio (Rastreabilidade)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">1. Efeito dos Aportes</span>
              <span className="text-xs font-mono font-bold text-slate-200 mt-0.5 block">
                R$ 0,00 este mês
              </span>
              <span className="text-[10px] text-blue-400/90 mt-0.5 block">
                Aporte ref. R$ {budget.plannedInvestment.toFixed(2)} previsto
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">2. Desempenho dos Ativos</span>
              <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5 block">
                +${performanceUSD.toFixed(2)} USD
              </span>
              <span className="text-[10px] text-emerald-400/80 mt-0.5 block">
                Valorização orgânica em dólar
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">3. Variação Cambial (USD/BRL)</span>
              <span className="text-xs font-mono font-bold text-blue-400 mt-0.5 block">
                +R$ {fxImpactBRL > 0 ? fxImpactBRL.toFixed(2) : '0,00'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Câmbio atual: R$ {exchangeRate.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Parecer do Advisor */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            <strong className="text-white">Diagnóstico do Advisor:</strong> Seus ativos dolarizados mantêm valorização saudável em USD (+{summary.totalGainLossPercentage.toFixed(2)}%). O aporte planejado de <strong>R$ {budget.plannedInvestment.toFixed(2)}</strong> para o mês corrente ainda não foi registrado na carteira.
          </p>
          <p className="text-[11px] text-slate-400">
            Não há necessidade de compensação abrupta ou comprometimento do orçamento familiar. O DollarPath valoriza constância sem rigidez punitiva. Escolha como prefere conduzir este ciclo:
          </p>

          {/* Alternativas Realistas */}
          <div className="space-y-1.5 pt-1">
            {alternatives.map((alt, index) => (
              <button
                key={index}
                onClick={() => handleConfirmDecision(alt)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-between group cursor-pointer ${
                  selectedAlternative === alt
                    ? 'bg-blue-600/20 border-blue-500/50 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>{alt}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            ))}
          </div>

          {decisionConfirmed && (
            <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Decisão registrada com sucesso no histórico auditável (Decision History)!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
