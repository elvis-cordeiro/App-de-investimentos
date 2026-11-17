import React, { useState } from 'react';
import { Calculator, PiggyBank, ShieldCheck, Check, DollarSign, ArrowRight, Save } from 'lucide-react';
import { PortfolioService } from '../../lib/portfolioService';
import { DecisionHistorySection } from './DecisionHistorySection';

export const PlanningPage: React.FC = () => {
  const currentBudget = PortfolioService.getBudget();
  const exchangeRate = PortfolioService.getExchangeRate();

  const [income, setIncome] = useState(currentBudget.income.toString());
  const [expenses, setExpenses] = useState(currentBudget.expenses.toString());
  const [reserve, setReserve] = useState(currentBudget.emergencyReserveBalance.toString());
  const [plannedInvestment, setPlannedInvestment] = useState(currentBudget.plannedInvestment.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const inc = parseFloat(income) || 0;
  const exp = parseFloat(expenses) || 0;
  const inv = parseFloat(plannedInvestment) || 0;
  const res = parseFloat(reserve) || 0;

  const monthlySurplus = inc - exp;
  const remainingAfterInvestment = monthlySurplus - inv;
  const targetReserve = 4000; // Meta citada no PDF de R$ 4.000
  const reserveProgress = ((res / targetReserve) * 100).toFixed(0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    PortfolioService.saveBudget({
      id: currentBudget.id,
      month: currentBudget.month,
      income: inc,
      expenses: exp,
      emergencyReserveBalance: res,
      plannedInvestment: inv,
      currency: 'BRL',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-400" />
          <span>Planejamento Financeiro & Orçamento</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Organize seu orçamento mensal, acompanhe a reserva de emergência e defina a capacidade de aporte em ativos em dólar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulário de Orçamento */}
        <div className="md:col-span-2 bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center justify-between">
            <span>Parâmetros Mensais (R$ BRL)</span>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-normal">
                <Check className="w-4 h-4" /> Salvo com sucesso!
              </span>
            )}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Receitas Mensais Totais (R$)
                </label>
                <input
                  type="number"
                  step="any"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Despesas & Custos Fixos (R$)
                </label>
                <input
                  type="number"
                  step="any"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Saldo Atual da Reserva de Emergência (R$)
                </label>
                <input
                  type="number"
                  step="any"
                  value={reserve}
                  onChange={(e) => setReserve(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Meta citada no planejamento: R$ 4.000,00
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Aporte Mensal de Referência (R$)
                </label>
                <input
                  type="number"
                  step="any"
                  value={plannedInvestment}
                  onChange={(e) => setPlannedInvestment(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  ≈ ${(inv / exchangeRate).toFixed(2)} USD (câmbio R$ {exchangeRate.toFixed(2)})
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Atualizar Parâmetros</span>
              </button>
            </div>
          </form>
        </div>

        {/* Resumo e Indicadores de Saúde Financeira */}
        <div className="space-y-4">
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Sobra Mensal Estimada
            </span>
            <div className="text-2xl font-bold text-slate-100">
              R$ {monthlySurplus.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-400">
              Após aporte de R$ {inv.toFixed(2)}:
              <span className={`block font-semibold mt-0.5 ${remainingAfterInvestment >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                R$ {remainingAfterInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} livre
              </span>
            </div>
          </div>

          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400 uppercase tracking-wider">
                Reserva de Emergência
              </span>
              <span className="font-bold text-emerald-400">{reserveProgress}%</span>
            </div>
            <div className="text-xl font-bold text-white">
              R$ {res.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, parseFloat(reserveProgress)))}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">
              Meta alvo: R$ 4.000,00 mantida líquida antes de ampliar exposição agressiva.
            </span>
          </div>
        </div>
      </div>

      {/* Decision History Audit Trail (Seção 6.6) */}
      <DecisionHistorySection />
    </div>
  );
};
