import React from 'react';
import { History, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { IntelligenceService } from '../../lib/intelligenceService';

export const DecisionHistorySection: React.FC = () => {
  const logs = IntelligenceService.getDecisionLogs();

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'CONTRIBUTION_BELOW_PLANNED':
        return { label: 'Aporte Inferior ao Previsto', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'PLANNED_CONTRIBUTION_MISSED':
        return { label: 'Aporte Pendente', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
      case 'WITHDRAWAL_OR_SALE':
        return { label: 'Retirada de Capital', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'ADDITIONAL_CONTRIBUTION':
        return { label: 'Aporte Extraordinário', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'ASSUMPTION_CHANGED':
        return { label: 'Alteração de Premissa', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      default:
        return { label: 'Evento Financeiro', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-slate-100 flex items-center gap-2 text-base">
            <History className="w-5 h-5 text-blue-400" />
            <span>Decision History — Histórico Auditável de Decisões</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro cronológico das recomendações do Advisor, cálculos associados e decisões adotadas pelo usuário.
          </p>
        </div>

        <span className="text-[11px] text-slate-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Rastreabilidade Contínua</span>
        </span>
      </div>

      <div className="space-y-3.5 pt-2">
        {logs.length === 0 ? (
          <div className="text-center p-8 text-xs text-slate-500">
            Nenhum evento registrado no histórico até o momento.
          </div>
        ) : (
          logs.map((log) => {
            const badge = getEventBadge(log.eventType);
            return (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      {log.description}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(log.timestamp).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Parecer do Advisor */}
                <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-900/30 text-xs text-slate-300 leading-relaxed">
                  <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-[11px] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Parecer do Advisor Estratégico</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{log.advisorExplanation}</p>

                  {/* Decomposição dos efeitos */}
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[10px]">
                    <div>
                      <span className="text-slate-400 block">$\Delta$ Aporte:</span>
                      <span className="font-mono font-bold text-slate-200">
                        {log.effects.contributionDelta >= 0 ? '+' : ''}R$ {log.effects.contributionDelta.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">$\Delta$ Retorno dos Ativos:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        +{log.effects.assetPerformanceDelta.toFixed(2)} USD
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">$\Delta$ Impacto Cambial:</span>
                      <span className="font-mono font-bold text-blue-400">
                        +{log.effects.fxDelta.toFixed(2)} BRL
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decisão do Usuário */}
                {log.userDecision && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span><strong>Decisão Confirmada pelo Investidor:</strong> {log.userDecision}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
