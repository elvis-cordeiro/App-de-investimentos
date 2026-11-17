import React, { useState } from 'react';
import { Settings, Shield, RefreshCw, Check, Cloud, Server, Lock, ExternalLink } from 'lucide-react';
import { PortfolioService } from '../../lib/portfolioService';

export const SettingsPage: React.FC = () => {
  const currentFX = PortfolioService.getExchangeRate();
  const [exchangeRate, setExchangeRate] = useState(currentFX.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSaveFX = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(exchangeRate);
    if (!isNaN(val) && val > 0) {
      PortfolioService.setExchangeRate(val);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Tem certeza de que deseja restaurar os dados padrão de demonstração do DollarPath?')) {
      PortfolioService.resetToDefault();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-400" />
          <span>Configurações & Governança</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ajuste as preferências de conversão de moeda, verifique as políticas de privacidade e acompanhe a preparação para nuvem.
        </p>
      </div>

      {/* Taxa de Câmbio de Referência */}
      <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-200 flex items-center justify-between">
          <span>Câmbio Referencial (USD / BRL)</span>
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-normal">
              <Check className="w-4 h-4" /> Câmbio atualizado!
            </span>
          )}
        </h2>

        <p className="text-xs text-slate-400">
          Esta taxa é utilizada nas estimativas de conversão em tempo real do dashboard e planejamento financeiro.
        </p>

        <form onSubmit={handleSaveFX} className="flex flex-col sm:flex-row gap-3 max-w-md">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              R$
            </span>
            <input
              type="number"
              step="any"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            Salvar Câmbio
          </button>
        </form>
      </div>

      {/* Preparação para Deploy em Nuvem & Backend */}
      <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-base">
          <Cloud className="w-5 h-5 text-blue-400" />
          <span>Roadmap de Nuvem & Infraestrutura</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          O DollarPath foi arquitetado de forma modular (Frontend React PWA + Monorepo Workspaces) permitindo desacoplamento total antes da hospedagem na nuvem:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Hospedagem Frontend</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Build estático otimizado pronto para deploy em serviços como Vercel, Netlify ou Cloudflare Pages com HTTPS e suporte a PWA.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Backend & PostgreSQL (Prisma)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Estrutura preparada em <code className="text-blue-400">apps/api</code> com Express, Prisma ORM e PostgreSQL gerenciado (ex: Neon, Supabase ou Railway).
            </p>
          </div>
        </div>
      </div>

      {/* Privacidade e Reset de Dados */}
      <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-base">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span>Privacidade Local & Dados</span>
        </div>

        <p className="text-xs text-slate-400">
          No modo atual, todas as informações cadastradas de posições, aportes e metas residem exclusivamente no armazenamento do seu próprio navegador (localStorage).
        </p>

        <div className="pt-2">
          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restaurar Dados Padrão de Demonstração</span>
          </button>
          {resetSuccess && (
            <span className="text-xs text-emerald-400 block mt-2">
              Reiniciando com os dados padrões...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
