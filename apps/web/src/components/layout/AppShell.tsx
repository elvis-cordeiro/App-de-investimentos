import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Compass,
  Newspaper,
  Calculator,
  Target,
  Settings,
  PlusCircle,
  Menu,
  X,
  ShieldCheck,
  TrendingUp,
  CircleDollarSign,
  Clock
} from 'lucide-react';
import { PortfolioService } from '../../lib/portfolioService';
import { AddTransactionModal } from '../ui/AddTransactionModal';
import { NotificationCenter } from '../ui/NotificationCenter';

interface AppShellProps {
  onRefreshData?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ onRefreshData }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const location = useLocation();

  const exchangeRate = PortfolioService.getExchangeRate();
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Carteira', path: '/portfolio', icon: Briefcase },
    { label: 'Radar de Ideias', path: '/opportunities', icon: Compass },
    { label: 'Notícias & Inteligência', path: '/news', icon: Newspaper },
    { label: 'Planejamento', path: '/planning', icon: Calculator },
    { label: 'Metas & Renda', path: '/goals', icon: Target },
    { label: 'Configurações', path: '/settings', icon: Settings },
  ];

  const handleTxSuccess = () => {
    setIsAddTxOpen(false);
    if (onRefreshData) onRefreshData();
  };

  return (
    <div className="min-h-screen bg-[#090d12] text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/80 bg-[#0c121a]/90 backdrop-blur-md sticky top-0 h-screen z-30 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">$</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">DollarPath</span>
              <span className="block text-[10px] tracking-wider text-blue-400/80 uppercase font-medium">USD Intelligence</span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-900/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Action Button & Disclaimer */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <button
            onClick={() => setIsAddTxOpen(true)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-500/30 cursor-pointer active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Transação</span>
          </button>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-300">Uso Pessoal Privado:</strong> Seus dados residem com total privacidade no seu navegador.
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-[#090d12]/95 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-lg font-semibold text-slate-100 capitalize">
                  {location.pathname === '/' ? 'Central de Inteligência' : navItems.find(i => i.path === location.pathname)?.label}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  DEMO MVP
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block capitalize">
                {currentDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Market Status & USD quote */}
            <div className="hidden lg:flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-300 font-medium">NYSE / NASDAQ</span>
                <span className="text-emerald-400 font-semibold">Aberto</span>
              </div>
              <div className="h-3 w-[1px] bg-slate-700" />
              <div className="flex items-center gap-1.5 text-slate-300">
                <CircleDollarSign className="w-3.5 h-3.5 text-blue-400" />
                <span>USD/BRL</span>
                <span className="font-semibold text-slate-100">R$ {exchangeRate.toFixed(2)}</span>
              </div>
            </div>

            {/* Notification Center */}
            <NotificationCenter onUpdate={onRefreshData} />

            {/* Quick action button */}
            <button
              onClick={() => setIsAddTxOpen(true)}
              className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Novo Aporte</span>
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0c121a] border-b border-slate-800 px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#090d12]/95 backdrop-blur-md border-t border-slate-800 z-30 px-2 py-1.5 flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                  isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label.split(' ')[0]}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Transaction Registration Modal */}
      {isAddTxOpen && (
        <AddTransactionModal
          isOpen={isAddTxOpen}
          onClose={() => setIsAddTxOpen(false)}
          onSuccess={handleTxSuccess}
        />
      )}
    </div>
  );
};
