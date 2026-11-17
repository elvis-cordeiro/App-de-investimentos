import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  ArrowUpDown,
  Calendar,
  DollarSign,
  TrendingUp,
  Tag,
  ShieldCheck,
  CheckCircle,
  Clock,
  PieChart as PieIcon
} from 'lucide-react';
import { PortfolioService } from '../../lib/portfolioService';
import { AddTransactionModal } from '../../components/ui/AddTransactionModal';
import { AddAssetModal } from '../../components/ui/AddAssetModal';

export const PortfolioPage: React.FC = () => {
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [, setRefresh] = useState(0);

  const forceRefresh = () => setRefresh((prev) => prev + 1);

  const portfolioSummary = PortfolioService.calculatePositions();
  const transactions = PortfolioService.getTransactions();
  const assets = PortfolioService.getAssets();
  const exchangeRate = PortfolioService.getExchangeRate();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-400" />
            <span>Gestão da Carteira e Posições</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cálculo auditável do preço médio e valorização em dólares a partir do histórico de transações.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddAssetOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Ativo</span>
          </button>

          <button
            onClick={() => setIsAddTxOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Operação</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Patrimônio Atual em Dólar
          </span>
          <div className="text-2xl font-bold text-white mt-2">
            ${portfolioSummary.currentTotalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-blue-400/90 mt-1 block">
            ≈ R$ {portfolioSummary.currentTotalBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Aportado / Custo de Aquisição
          </span>
          <div className="text-2xl font-bold text-slate-200 mt-2">
            ${portfolioSummary.totalInvestedUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            ≈ R$ {portfolioSummary.totalInvestedBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Lucro / Prejuízo Acumulado
          </span>
          <div className="text-2xl font-bold text-emerald-400 mt-2">
            {portfolioSummary.totalGainLossUSD >= 0 ? '+' : ''}$
            {portfolioSummary.totalGainLossUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-xs font-semibold text-emerald-400/90 mt-1 block">
            {portfolioSummary.totalGainLossPercentage >= 0 ? '+' : ''}
            {portfolioSummary.totalGainLossPercentage.toFixed(2)}% de retorno em USD
          </span>
        </div>
      </div>

      {/* Posições Atuais Detalhadas */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-200">
          Posições em Custódia
        </h2>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ticker</th>
                  <th className="py-3 px-4">Nome da Empresa</th>
                  <th className="py-3 px-4">Setor</th>
                  <th className="py-3 px-4 text-right">Qtd</th>
                  <th className="py-3 px-4 text-right">Preço Médio</th>
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
                        <span className="font-mono font-bold text-blue-400 text-sm">
                          ${pos.asset.ticker}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">
                        {pos.asset.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {pos.asset.sector}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-200">
                        {pos.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                        ${pos.averagePrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-100 font-bold">
                        ${pos.asset.currentPrice?.toFixed(2) || pos.averagePrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="text-white font-bold block">
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
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-200">
                        {pos.portfolioShare.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Histórico Auditável de Transações */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>Histórico de Operações (Trilha Auditável)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cada transação registra data, quantidade, preço unitário, câmbio BRL/USD utilizado e justificativa.
            </p>
          </div>
        </div>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Ativo</th>
                  <th className="py-3 px-4 text-right">Qtd</th>
                  <th className="py-3 px-4 text-right">Preço USD</th>
                  <th className="py-3 px-4 text-right">Total USD</th>
                  <th className="py-3 px-4 text-right">Câmbio Utilizado</th>
                  <th className="py-3 px-4">Justificativa / Observação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {transactions.map((tx) => {
                  const asset = assets.find((a) => a.id === tx.assetId);
                  const total = tx.quantity * tx.unitPrice + (tx.fees || 0);

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {tx.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                          {tx.type === 'BUY' ? 'COMPRA' : tx.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        ${asset?.ticker || 'DESCONHECIDO'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-200">
                        {tx.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                        ${tx.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                        ${total.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                        R$ {tx.exchangeRate?.toFixed(2) || exchangeRate.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                        {tx.notes || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modals */}
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

      {isAddAssetOpen && (
        <AddAssetModal
          isOpen={isAddAssetOpen}
          onClose={() => setIsAddAssetOpen(false)}
          onSuccess={() => {
            setIsAddAssetOpen(false);
            forceRefresh();
          }}
        />
      )}
    </div>
  );
};
