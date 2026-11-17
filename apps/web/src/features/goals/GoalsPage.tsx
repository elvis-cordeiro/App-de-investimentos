import React, { useState } from 'react';
import { Target, TrendingUp, DollarSign, AlertCircle, ShieldCheck, Sparkles, Sliders } from 'lucide-react';
import { PortfolioService } from '../../lib/portfolioService';

export const GoalsPage: React.FC = () => {
  const goal = PortfolioService.getGoal();
  const portfolioSummary = PortfolioService.calculatePositions();
  const exchangeRate = PortfolioService.getExchangeRate();

  const [simulatedYield, setSimulatedYield] = useState<number>(5.5); // % yield anual médio
  const [withholdingTax, setWithholdingTax] = useState<number>(30); // 30% imposto na fonte nos EUA (tax treaty/retention)
  const [simulatedFX, setSimulatedFX] = useState<number>(exchangeRate);

  // Progresso do patrimônio
  const currentTotalBRL = portfolioSummary.currentTotalBRL;
  const targetPatrimonyBRL = goal.targetValue;
  const progressPercent = ((currentTotalBRL / targetPatrimonyBRL) * 100).toFixed(1);

  // Simulação de renda passiva mensal
  // Patrimônio alvo em USD na taxa simulada
  const targetUSD = targetPatrimonyBRL / simulatedFX;
  const grossAnnualYieldUSD = targetUSD * (simulatedYield / 100);
  const netAnnualYieldUSD = grossAnnualYieldUSD * (1 - withholdingTax / 100);
  const netMonthlyIncomeUSD = netAnnualYieldUSD / 12;
  const netMonthlyIncomeBRL = netMonthlyIncomeUSD * simulatedFX;

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-400" />
          <span>Metas Financeiras & Cenários de Renda Futura</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Acompanhe o caminho rumo aos R$ 300.000 e simule cenários de renda passiva mensal em moeda forte com ressalvas realistas.
        </p>
      </div>

      {/* Meta Principal: R$ 300.000 em 10 anos */}
      <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Objetivo de Longo Prazo
            </span>
            <h2 className="text-lg font-bold text-slate-100 mt-0.5">
              Acumulação de R$ 300.000 em Ativos em Dólar (USD)
            </h2>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-white font-mono">{progressPercent}%</span>
            <span className="text-[11px] text-slate-400 block">Horizonte: 10 anos</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, parseFloat(progressPercent)))}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Atual: R$ {currentTotalBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span>Meta: R$ {targetPatrimonyBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Equivalente em Dólar Atual
            </span>
            <span className="text-lg font-bold text-slate-100 font-mono mt-1 block">
              ${(targetPatrimonyBRL / exchangeRate).toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
            </span>
            <span className="text-[10px] text-slate-500">Câmbio base: R$ {exchangeRate.toFixed(2)}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Aporte Mensal Previsto
            </span>
            <span className="text-lg font-bold text-slate-100 font-mono mt-1 block">
              R$ 300,00 / mês
            </span>
            <span className="text-[10px] text-slate-500">Com reinvestimento de proventos</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Patrimônio Restante
            </span>
            <span className="text-lg font-bold text-amber-400 font-mono mt-1 block">
              R$ {(targetPatrimonyBRL - currentTotalBRL).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] text-slate-500">Rumo à meta total</span>
          </div>
        </div>
      </div>

      {/* Simulador de Cenários de Renda Futura */}
      <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-base md:text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <span>Simulador de Cenários: Meta de R$ 1.000 a R$ 1.500 Líquidos / Mês</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Avalie o impacto do Dividend Yield da carteira, impostos sobre dividendos nos EUA e variações cambiais.
          </p>
        </div>

        {/* Inputs interativos de simulação */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Dividend Yield Anual Médio</span>
              <span className="font-bold text-blue-400">{simulatedYield}% a.a.</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="10.0"
              step="0.5"
              value={simulatedYield}
              onChange={(e) => setSimulatedYield(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>2% (Crescimento)</span>
              <span>5.5% (Misto)</span>
              <span>10% (REITs/High Yield)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Retenção de Imposto nos EUA</span>
              <span className="font-bold text-slate-200">{withholdingTax}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={withholdingTax}
              onChange={(e) => setWithholdingTax(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              Padrão de 30% na fonte retido pela receita americana (IRS).
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Câmbio Futuro Estimado (USD/BRL)</span>
              <span className="font-bold text-slate-200">R$ {simulatedFX.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="4.50"
              max="8.00"
              step="0.10"
              value={simulatedFX}
              onChange={(e) => setSimulatedFX(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              Simule a sensibilidade do poder de compra em reais.
            </span>
          </div>
        </div>

        {/* Resultados da Projeção */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-900/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-300 block">
              Renda Mensal Líquida Projetada
            </span>
            <div className="text-3xl font-bold text-white mt-2 font-mono">
              R$ {netMonthlyIncomeBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-blue-400 mt-1 block font-medium">
              ≈ ${netMonthlyIncomeUSD.toFixed(2)} USD líquidos todos os meses
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Enquadramento na Faixa Alvo
            </span>
            <div className="mt-2">
              {netMonthlyIncomeBRL >= 1000 && netMonthlyIncomeBRL <= 1500 ? (
                <span className="text-emerald-400 font-bold text-sm">
                  ✓ Encaixa perfeitamente na faixa alvo (R$ 1.000 a R$ 1.500/mês)!
                </span>
              ) : netMonthlyIncomeBRL > 1500 ? (
                <span className="text-blue-400 font-bold text-sm">
                  Supera o teto de R$ 1.500/mês com este yield simulado!
                </span>
              ) : (
                <span className="text-amber-400 font-bold text-sm">
                  Abaixo do piso de R$ 1.000/mês. Pode requerer maior yield ou maior patrimônio acumulado.
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-2 block">
              Baseado no patrimônio total de R$ 300.000 totalmente investido.
            </span>
          </div>
        </div>

        {/* Ressalva Obrigatória conforme PDF */}
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300/90 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>Nota Fundamental de Planejamento:</strong> Metas de renda baseadas em proventos dependem de volatilidade de preços, políticas corporativas de distribuição de lucros, retenções fiscais internacionais e oscilações do câmbio. O DollarPath fornece cenários e simulações probabilísticas, nunca promessas de ganho fixo.
          </p>
        </div>
      </div>
    </div>
  );
};
