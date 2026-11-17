import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Target,
  PiggyBank,
  Compass,
  Newspaper,
  Briefcase,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  PieChart as PieIcon,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { PortfolioService } from '../../lib/portfolioService';
import { StatCard } from '../../components/ui/StatCard';
import { OpportunityCard } from '../../components/cards/OpportunityCard';
import { NewsCard } from '../../components/cards/NewsCard';
import { AddTransactionModal } from '../../components/ui/AddTransactionModal';

export const DashboardPage: React.FC = () => {
  const [tickerFilter, setTickerFilter] = useState<string>('ALL');
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [, setRefresh] = useState(0);

  const forceRefresh = () => setRefresh(prev => prev + 1);

  const portfolioSummary = PortfolioService.calculatePositions();
  const opportunities = PortfolioService.getOpportunities();
  const allNews = PortfolioService.getNews();
  const budget = PortfolioService.getBudget();
  const goal = PortfolioService.getGoal();
  const exchangeRate = PortfolioService.getExchangeRate();

  // Filter news for portfolio section
  const portfolioNews = allNews.filter((n) => {
    if (tickerFilter === 'ALL') {
      return n.category === 'PORTFOLIO' || n.relatedTickers.length > 0;
    }
    return n.relatedTickers.includes(tickerFilter);
  });

  // Calculate goal percentage
  const goalProgress = ((portfolioSummary.currentTotalBRL / goal.targetValue) * 100).toFixed(1);

  // Identify assets needing contribution (under target allocation)
  const underweightAssets = portfolioSummary.positions
    .filter(p => (p.targetShare || 25) > p.portfolioShare)
    .sort((a, b) => (b.targetShare || 25) - b.portfolioShare - ((a.targetShare || 25) - a.portfolioShare));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Disclaimer / Notice Badge */}
      <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-blue-300">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong className="text-white">DollarPath Radar Pessoal:</strong> Foco em ativos em dólar (USD), inteligência contextual e separação rigorosa de fatos e hipóteses.
          </span>
        </div>
        <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0 self-start sm:self-auto">
          Dados Demonstrativos (MVP)
        </span>
      </div>

      {/* BLOCO 2: Resumo Rápido Compacto */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Patrimônio Investido (USD)"
            value={`$${portfolioSummary.currentTotalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            secondaryValue={`≈ R$ ${portfolioSummary.currentTotalBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (câmbio R$ ${exchangeRate.toFixed(2)})`}
            changePercentage={portfolioSummary.totalGainLossPercentage}
            changeLabel="rentabilidade acumulada"
            icon={DollarSign}
          />

          <StatCard
            title="Resultado Não Realizado"
            value={`${portfolioSummary.totalGainLossUSD >= 0 ? '+' : ''}$${portfolioSummary.totalGainLossUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`}
            secondaryValue={`Custo total: $${portfolioSummary.totalInvestedUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            changePercentage={portfolioSummary.totalGainLossPercentage}
            changeLabel="sobre o valor investido"
            icon={TrendingUp}
          />

          <StatCard
            title="Próximo Aporte Planejado"
            value={`R$ ${budget.plannedInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            secondaryValue={`≈ $${(budget.plannedInvestment / exchangeRate).toFixed(2)} USD para alocação`}
            subtitle="Referência mensal editável"
            icon={PiggyBank}
          />

          <StatCard
            title="Progresso da Meta"
            value={`${goalProgress}%`}
            secondaryValue={`Meta: R$ ${goal.targetValue.toLocaleString('pt-BR')} em ${goal.deadlineYears} anos`}
            subtitle={`Faltam R$ ${(goal.targetValue - portfolioSummary.currentTotalBRL).toLocaleString('pt-BR')}`}
            icon={Target}
          />
        </div>
      </section>

      {/* BLOCO 3: Oportunidades em Destaque (Visual Carrossel / Grid) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-400" />
              <span>Oportunidades em Destaque</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Empresas sob radar com análise fundamentalista, catalisadores e score explicável.
            </p>
          </div>
          <NavLink
            to="/opportunities"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>Ver Radar Completo</span>
            <ChevronRight className="w-4 h-4" />
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {opportunities.slice(0, 4).map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </section>

      {/* BLOCO 4 & 5: Notícias e Inteligência (Feed visual e Notícias da Carteira) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-400" />
              <span>Notícias e Inteligência da Carteira</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Acontecimentos relevantes com separação de fatos confirmados e interpretação do sistema.
            </p>
          </div>

          {/* Ticker Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setTickerFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                tickerFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Todos
            </button>
            {portfolioSummary.positions.map((pos) => (
              <button
                key={pos.asset.ticker}
                onClick={() => setTickerFilter(pos.asset.ticker)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                  tickerFilter === pos.asset.ticker
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                ${pos.asset.ticker}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolioNews.slice(0, 3).map((article, idx) => (
            <NewsCard key={article.id} article={article} featured={idx === 0} />
          ))}
        </div>

        <div className="text-center pt-2">
          <NavLink
            to="/news"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <span>Acessar Feed Editorial Completo</span>
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      </section>

      {/* BLOCO 6: Minha Carteira (Tabela Compacta com Cálculos) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <span>Minha Carteira em Dólar</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Posições e preço médio calculados auditavelmente a partir das transações registradas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddTxOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Compra</span>
            </button>
            <NavLink
              to="/portfolio"
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Detalhes</span>
              <ChevronRight className="w-4 h-4" />
            </NavLink>
          </div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ativo</th>
                  <th className="py-3 px-4">Setor</th>
                  <th className="py-3 px-4 text-right">Qtd</th>
                  <th className="py-3 px-4 text-right">Preço Médio (USD)</th>
                  <th className="py-3 px-4 text-right">Cotação Atual</th>
                  <th className="py-3 px-4 text-right">Valor Total (USD)</th>
                  <th className="py-3 px-4 text-right">Rentabilidade</th>
                  <th className="py-3 px-4 text-right">Alocação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {portfolioSummary.positions.map((pos) => {
                  const isPositive = pos.gainLoss >= 0;
                  return (
                    <tr key={pos.asset.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-blue-400">
                            {pos.asset.ticker.slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-100 block font-mono">
                              ${pos.asset.ticker}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate max-w-[140px] block">
                              {pos.asset.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {pos.asset.sector}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-200">
                        {pos.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                        ${pos.averagePrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-200 font-bold">
                        ${pos.asset.currentPrice?.toFixed(2) || pos.averagePrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="text-slate-100 font-bold block">
                          ${pos.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ≈ R$ {(pos.currentValue * exchangeRate).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            isPositive
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-rose-400 bg-rose-500/10'
                          }`}
                        >
                          {isPositive ? '+' : ''}{pos.gainLossPercentage.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono text-slate-300 font-semibold">
                          {pos.portfolioShare.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* BLOCO 7: Impacto nos Aportes & Rebalanceamento */}
      <section className="bg-gradient-to-br from-[#0f172a] to-[#131d2e] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Impacto nos Aportes e Rebalanceamento</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Direcionamento do aporte mensal de R$ {budget.plannedInvestment.toFixed(2)} (≈ ${(budget.plannedInvestment / exchangeRate).toFixed(2)} USD) para manter equilíbrio.
            </p>
          </div>

          <button
            onClick={() => setIsAddTxOpen(true)}
            className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Alocar Aporte Atual</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          {/* Status dos Ativos */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              Alocação Atual vs Alvo (25% cada):
            </span>

            <div className="space-y-2.5">
              {portfolioSummary.positions.map((pos) => {
                const diff = pos.portfolioShare - (pos.targetShare || 25);
                const isUnder = diff < 0;

                return (
                  <div key={pos.asset.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-slate-100">${pos.asset.ticker}</span>
                      <span className="text-xs text-slate-400">{pos.asset.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-slate-200">{pos.portfolioShare.toFixed(1)}%</span>
                        <span className="text-[10px] text-slate-500 block">Alvo: 25.0%</span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isUnder
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isUnder ? `Abaixo (-${Math.abs(diff).toFixed(1)}%)` : `Acima (+${diff.toFixed(1)}%)`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sugestão de Alocação Explicada */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sugestão de Aporte Inteligente</span>
              </div>

              {underweightAssets.length > 0 ? (
                <div className="text-xs text-slate-300 space-y-2">
                  <p>
                    O ativo <strong className="text-white">${underweightAssets[0].asset.ticker}</strong> está atualmente com a menor representação ({underweightAssets[0].portfolioShare.toFixed(1)}% vs 25% alvo).
                  </p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Com o aporte planejado de R$ {budget.plannedInvestment.toFixed(2)}, você pode adquirir aproximadamente{' '}
                    <strong className="text-slate-200">
                      {((budget.plannedInvestment / exchangeRate) / (underweightAssets[0].asset.currentPrice || 100)).toFixed(3)} ações
                    </strong>{' '}
                    fracionadas pela corretora Inter ou equivalente.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Sua carteira está perfeitamente equilibrada com os alvos atuais!
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
              * Estimativa meramente ilustrativa de rebalanceamento passivo sem garantia de retorno.
            </div>
          </div>
        </div>
      </section>

      {/* Transaction Modal */}
      {isAddTxOpen && (
        <AddTransactionModal
          isOpen={isAddTxOpen}
          onClose={() => setIsAddTxOpen(false)}
          onSuccess={() => {
            setIsAddTxOpen(false);
            forceRefresh();
          }}
        />
      )}
    </div>
  );
};
