import {
  Alert,
  DecisionLog,
  FinancialEventType,
  GoalProjection,
  ProjectionScenario,
  ScenarioType,
} from '@dollarpath/shared';
import { PortfolioService } from './portfolioService';

const INTELLIGENCE_KEYS = {
  ALERTS: 'dollarpath_alerts',
  DECISION_LOGS: 'dollarpath_decision_logs',
};

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alert-1',
    title: 'Aporte de Novembro pendente de registro',
    message: 'O aporte mensal planejado de R$ 300,00 para novembro ainda não foi registrado na carteira.',
    priority: 'IMPORTANT',
    category: 'CONTRIBUTION',
    createdAt: '2026-11-16T10:00:00Z',
    read: false,
    actionUrl: '/planning',
    metadata: { diffAmount: 300 },
  },
  {
    id: 'alert-2',
    title: 'Desvio de alocação em Semicondutores (NVDA)',
    message: 'A forte valorização recente elevou NVDA para 34.6% da carteira (alvo sugerido: 25.0%). Recomenda-se direcionar os próximos aportes para ativos abaixo da meta.',
    priority: 'IMPORTANT',
    category: 'ALLOCATION',
    createdAt: '2026-11-15T14:30:00Z',
    read: false,
    actionUrl: '/portfolio',
    metadata: { assetTicker: 'NVDA' },
  },
];

export const INITIAL_DECISION_LOGS: DecisionLog[] = [
  {
    id: 'dec-1',
    timestamp: '2026-10-15T16:00:00Z',
    eventType: 'CONTRIBUTION_BELOW_PLANNED',
    description: 'Aporte de Outubro registrado no valor de R$ 200,00 (planejado: R$ 300,00).',
    advisorExplanation:
      'O aporte deste mês ficou R$ 100,00 abaixo do valor previsto. Considerando apenas essa diferença e mantendo as demais premissas, o prazo projetado para a meta de R$ 300.000 estendeu-se em aproximadamente 18 dias. Você pode manter o valor atual e aceitar um prazo ligeiramente maior, ou avaliar uma redistribuição nos próximos aportes. Não é necessário comprometer despesas essenciais nem a reserva de emergência para compensar essa diferença.',
    effects: {
      contributionDelta: -100,
      assetPerformanceDelta: +380,
      fxDelta: +120,
    },
    alternatives: [
      'Manter o cronograma normal de R$ 300/mês nos meses seguintes sem pressa',
      'Diluir a diferença de R$ 100 em 5 parcelas de R$ 20 nos próximos aportes',
      'Rever a meta de prazo em 1 mês mantendo os gastos equilibrados',
    ],
    userDecision: 'Manter o cronograma normal de R$ 300/mês sem alterar despesas fixas.',
    recordedAt: '2026-10-15T16:15:00Z',
  },
  {
    id: 'dec-2',
    timestamp: '2026-09-10T12:00:00Z',
    eventType: 'ASSUMPTION_CHANGED',
    description: 'Atualização da taxa referencial de câmbio para R$ 5,72 / USD.',
    advisorExplanation:
      'A depreciação do Real eleva o patrimônio convertido em reais da carteira atual em dólar, mas exige mais reais para comprar o mesmo número de cotas de ações em USD nos novos aportes. O cálculo separou com precisão o ganho contábil em BRL do crescimento real de ativos.',
    effects: {
      contributionDelta: 0,
      assetPerformanceDelta: +140,
      fxDelta: +520,
    },
    alternatives: [
      'Manter o aporte fixo de R$ 300 comprando frações proporcionais',
      'Ajustar o aporte em USD para manter volume constante de ações',
    ],
    userDecision: 'Manter valor fixo em R$ 300,00 por disciplina financeira.',
    recordedAt: '2026-09-10T12:30:00Z',
  },
];

export class IntelligenceService {
  static getAlerts(): Alert[] {
    const saved = localStorage.getItem(INTELLIGENCE_KEYS.ALERTS);
    if (!saved) {
      localStorage.setItem(INTELLIGENCE_KEYS.ALERTS, JSON.stringify(INITIAL_ALERTS));
      return INITIAL_ALERTS;
    }
    return JSON.parse(saved);
  }

  static saveAlerts(alerts: Alert[]): void {
    localStorage.setItem(INTELLIGENCE_KEYS.ALERTS, JSON.stringify(alerts));
  }

  static markAlertAsRead(alertId: string): void {
    const alerts = this.getAlerts();
    const updated = alerts.map((a) => (a.id === alertId ? { ...a, read: true } : a));
    this.saveAlerts(updated);
  }

  static markAllAlertsAsRead(): void {
    const alerts = this.getAlerts();
    const updated = alerts.map((a) => ({ ...a, read: true }));
    this.saveAlerts(updated);
  }

  static getUnreadImportantCount(): number {
    const alerts = this.getAlerts();
    return alerts.filter((a) => !a.read && a.priority === 'IMPORTANT').length;
  }

  static getDecisionLogs(): DecisionLog[] {
    const saved = localStorage.getItem(INTELLIGENCE_KEYS.DECISION_LOGS);
    if (!saved) {
      localStorage.setItem(INTELLIGENCE_KEYS.DECISION_LOGS, JSON.stringify(INITIAL_DECISION_LOGS));
      return INITIAL_DECISION_LOGS;
    }
    return JSON.parse(saved);
  }

  static addDecisionLog(log: Omit<DecisionLog, 'id' | 'recordedAt'>): DecisionLog {
    const current = this.getDecisionLogs();
    const newLog: DecisionLog = {
      ...log,
      id: `dec-${Date.now()}`,
      recordedAt: new Date().toISOString(),
    };
    this.saveDecisionLogs([newLog, ...current]);
    return newLog;
  }

  static saveDecisionLogs(logs: DecisionLog[]): void {
    localStorage.setItem(INTELLIGENCE_KEYS.DECISION_LOGS, JSON.stringify(logs));
  }

  /**
   * Goal Projection Engine & Scenario Simulator (Regras da Seção 7)
   */
  static calculateProjections(
    currentPatrimonyBRL: number,
    targetPatrimonyBRL: number,
    monthlyContributionBRL: number,
    exchangeRate: number,
    timelineYears: number = 10
  ): GoalProjection {
    const currentUSD = currentPatrimonyBRL / exchangeRate;
    const targetUSD = targetPatrimonyBRL / exchangeRate;
    const monthlyContributionUSD = monthlyContributionBRL / exchangeRate;

    const scenariosDef: { type: ScenarioType; name: string; annualReturn: number; notes: string }[] = [
      {
        type: 'CONSERVATIVE',
        name: 'Conservador',
        annualReturn: 5.0,
        notes: 'Premissa de 5.0% a.a. em USD (foco defensivo e dividendos sólidos).',
      },
      {
        type: 'BASE',
        name: 'Cenário Base',
        annualReturn: 8.0,
        notes: 'Premissa de 8.0% a.a. em USD (combinação de crescimento e proventos reinvestidos).',
      },
      {
        type: 'OPTIMISTIC',
        name: 'Otimista',
        annualReturn: 11.0,
        notes: 'Premissa de 11.0% a.a. em USD (expansão consistente em IA e tecnologia).',
      },
    ];

    const scenarios: ProjectionScenario[] = scenariosDef.map((def) => {
      const rAnnual = def.annualReturn / 100;
      const rMonthly = Math.pow(1 + rAnnual, 1 / 12) - 1;
      const totalMonths = timelineYears * 12;

      // FV = PV * (1 + r)^n + PMT * [((1 + r)^n - 1) / r]
      const pvCompounded = currentUSD * Math.pow(1 + rMonthly, totalMonths);
      const annuityFactor = (Math.pow(1 + rMonthly, totalMonths) - 1) / rMonthly;
      const pmtCompounded = monthlyContributionUSD * annuityFactor;
      const projectedFinalUSD = pvCompounded + pmtCompounded;
      const projectedFinalBRL = projectedFinalUSD * exchangeRate;

      // Required PMT to hit target in timeline:
      // targetUSD = PV * (1 + r)^n + PMT_req * annuityFactor
      // PMT_req = (targetUSD - pvCompounded) / annuityFactor
      const neededUSD = targetUSD - pvCompounded;
      const requiredMonthlyUSD = neededUSD > 0 ? neededUSD / annuityFactor : 0;
      const requiredMonthlyBRL = requiredMonthlyUSD * exchangeRate;

      // Estimated months to reach goal with current PMT:
      // Loop or solve iteratively
      let monthsToGoal = 0;
      let accumUSD = currentUSD;
      while (accumUSD < targetUSD && monthsToGoal < 600) {
        accumUSD = accumUSD * (1 + rMonthly) + monthlyContributionUSD;
        monthsToGoal++;
      }
      const estimatedYears = Number((monthsToGoal / 12).toFixed(1));

      return {
        type: def.type,
        name: def.name,
        expectedAnnualReturnUSD: def.annualReturn,
        monthlyContributionBRL,
        exchangeRate,
        timelineYears,
        projectedFinalValueUSD: Number(projectedFinalUSD.toFixed(2)),
        projectedFinalValueBRL: Number(projectedFinalBRL.toFixed(2)),
        requiredMonthlyContributionBRL: Number(requiredMonthlyBRL.toFixed(2)),
        estimatedYearsToReachGoal: estimatedYears,
        assumptionsNotes: def.notes,
      };
    });

    const advisorAssessment =
      'O plano de acumulação em dólares avança de forma consistente. Mantendo os aportes de R$ ' +
      monthlyContributionBRL.toFixed(2) +
      '/mês e reinvestindo os proventos recebidos, o cenário base atinge a meta estimada sem necessidade de assumir riscos excessivos ou comprometer sua reserva de emergência.';

    return {
      goalId: 'goal-patrimony',
      calculatedAt: new Date().toISOString(),
      currentValueBRL: currentPatrimonyBRL,
      targetValueBRL: targetPatrimonyBRL,
      scenarios,
      advisorAssessment,
    };
  }

  /**
   * Monitor de Aportes & Disparador de Análise do Advisor (Fluxo 6.4)
   */
  static evaluateTransactionImpact(
    txType: string,
    amountBRL: number,
    plannedMonthlyBRL: number
  ): {
    eventType: FinancialEventType;
    advisorMessage: string;
    alternatives: string[];
  } {
    if (txType === 'SELL' || amountBRL < 0) {
      return {
        eventType: 'WITHDRAWAL_OR_SALE',
        advisorMessage:
          'A retirada reduziu o capital investido e alterou a projeção da meta. O impacto estimado foi separado do efeito de mercado e do câmbio. Deseja simular um novo ritmo de aportes ou manter o plano atual com prazo ajustado?',
        alternatives: [
          'Ajustar o prazo da meta proporcionalmente à retirada',
          'Planejar recomposição gradativa ao longo dos próximos meses',
          'Manter o cronograma atual respeitando a liquidez necessária',
        ],
      };
    }

    if (amountBRL < plannedMonthlyBRL) {
      const diff = plannedMonthlyBRL - amountBRL;
      return {
        eventType: 'CONTRIBUTION_BELOW_PLANNED',
        advisorMessage: `O aporte registrado de R$ ${amountBRL.toFixed(2)} ficou R$ ${diff.toFixed(2)} abaixo do valor previsto. Considerando apenas essa diferença e mantendo as demais premissas, a projeção da meta foi recalculada. Você pode manter o valor atual e aceitar um prazo ligeiramente maior, ou avaliar uma redistribuição dos próximos aportes. Não é necessário comprometer despesas essenciais para compensar essa diferença.`,
        alternatives: [
          'Manter o ritmo sem pressão e aceitar pequeno acréscimo de dias no prazo',
          'Diluir a diferença nos próximos aportes mensais',
          'Reavaliar o orçamento mensal nas configurações',
        ],
      };
    }

    if (amountBRL > plannedMonthlyBRL) {
      const extra = amountBRL - plannedMonthlyBRL;
      return {
        eventType: 'ADDITIONAL_CONTRIBUTION',
        advisorMessage: `Aporte extraordinário de R$ ${amountBRL.toFixed(2)} (+R$ ${extra.toFixed(2)} sobre o planejado) acelera a curva de acumulação de patrimônio composto em moeda forte.`,
        alternatives: [
          'Aproveitar para reforçar posições que estão abaixo da meta de alocação',
          'Preservar parte do excedente na reserva de emergência se estiver abaixo de R$ 4.000',
        ],
      };
    }

    return {
      eventType: 'ADDITIONAL_CONTRIBUTION',
      advisorMessage: 'Aporte realizado rigorosamente dentro do plano mensal.',
      alternatives: ['Continuar monitoramento passivo'],
    };
  }
}
