import React, { useState } from 'react';
import { Bell, CheckCheck, AlertTriangle, Info, Sparkles, X, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { IntelligenceService } from '../../lib/intelligenceService';
import { Alert } from '@dollarpath/shared';

interface NotificationCenterProps {
  onUpdate?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const alerts = IntelligenceService.getAlerts();
  const unreadCount = IntelligenceService.getUnreadImportantCount();

  const handleMarkAllRead = () => {
    IntelligenceService.markAllAlertsAsRead();
    if (onUpdate) onUpdate();
  };

  const handleMarkRead = (id: string) => {
    IntelligenceService.markAlertAsRead(id);
    if (onUpdate) onUpdate();
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'CONTRIBUTION':
        return { label: 'Aporte', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'ALLOCATION':
        return { label: 'Alocação', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'GOAL':
        return { label: 'Meta', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      default:
        return { label: 'Premissa', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors relative cursor-pointer"
        aria-label="Central de Notificações"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md shadow-rose-500/30">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown / Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-slate-100">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Notificações Relevantes</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Política: <strong className="text-slate-300">Important</strong> (apenas mudanças materiais)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    title="Marcar todas como lidas"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Lidas</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
              {alerts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  Nenhuma notificação importante no momento. Seu plano está em conformidade.
                </div>
              ) : (
                alerts.map((alert) => {
                  const badge = getCategoryBadge(alert.category);
                  return (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-xl transition-all ${
                        alert.read ? 'bg-slate-900/40 opacity-70' : 'bg-slate-900/90 border border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                          {!alert.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          )}
                        </div>

                        <span className="text-[10px] text-slate-500">
                          {new Date(alert.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-200 mt-1.5 leading-snug">
                        {alert.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {alert.message}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        {!alert.read ? (
                          <button
                            onClick={() => handleMarkRead(alert.id)}
                            className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
                          >
                            Marcar como lida
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500">Lida</span>
                        )}

                        {alert.actionUrl && (
                          <NavLink
                            to={alert.actionUrl}
                            onClick={() => setIsOpen(false)}
                            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
                          >
                            <span>Ver no módulo</span>
                            <ChevronRight className="w-3 h-3" />
                          </NavLink>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
