import { Asset, Transaction, PortfolioPosition } from '@dollarpath/shared';
import {
  INITIAL_ASSETS,
  INITIAL_TRANSACTIONS,
  INITIAL_OPPORTUNITIES,
  INITIAL_NEWS,
  INITIAL_BUDGET,
  INITIAL_GOAL,
  INITIAL_EXCHANGE_RATE,
} from './mockData';

const STORAGE_KEYS = {
  ASSETS: 'dollarpath_assets',
  TRANSACTIONS: 'dollarpath_transactions',
  OPPORTUNITIES: 'dollarpath_opportunities',
  NEWS: 'dollarpath_news',
  BUDGET: 'dollarpath_budget',
  GOAL: 'dollarpath_goal',
  EXCHANGE_RATE: 'dollarpath_exchange_rate',
  RADAR_STYLE: 'dollarpath_radar_style',
  BASE_CURRENCY: 'dollarpath_base_currency',
};

export class PortfolioService {
  static getExchangeRate(): number {
    const saved = localStorage.getItem(STORAGE_KEYS.EXCHANGE_RATE);
    return saved ? parseFloat(saved) : INITIAL_EXCHANGE_RATE;
  }

  static setExchangeRate(rate: number): void {
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATE, rate.toString());
  }

  static getAssets(): Asset[] {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(INITIAL_ASSETS));
      return INITIAL_ASSETS;
    }
    return JSON.parse(saved);
  }

  static saveAssets(assets: Asset[]): void {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }

  static getTransactions(): Transaction[] {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(saved);
  }

  static saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  static addTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const current = this.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTx, ...current];
    this.saveTransactions(updated);
    return newTx;
  }

  static addAsset(asset: Omit<Asset, 'id'>): Asset {
    const assets = this.getAssets();
    const newAsset: Asset = {
      ...asset,
      id: `asset-${asset.ticker.toLowerCase()}-${Date.now()}`,
    };
    assets.push(newAsset);
    this.saveAssets(assets);
    return newAsset;
  }

  static getBudget(): typeof INITIAL_BUDGET {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGET);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(INITIAL_BUDGET));
      return INITIAL_BUDGET;
    }
    return JSON.parse(saved);
  }

  static saveBudget(budget: typeof INITIAL_BUDGET): void {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  }

  static getGoal(): typeof INITIAL_GOAL {
    const saved = localStorage.getItem(STORAGE_KEYS.GOAL);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.GOAL, JSON.stringify(INITIAL_GOAL));
      return INITIAL_GOAL;
    }
    return JSON.parse(saved);
  }

  static saveGoal(goal: typeof INITIAL_GOAL): void {
    localStorage.setItem(STORAGE_KEYS.GOAL, JSON.stringify(goal));
  }

  static getOpportunities(): typeof INITIAL_OPPORTUNITIES {
    const saved = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(INITIAL_OPPORTUNITIES));
      return INITIAL_OPPORTUNITIES;
    }
    return JSON.parse(saved);
  }

  static getNews(): typeof INITIAL_NEWS {
    const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(INITIAL_NEWS));
      return INITIAL_NEWS;
    }
    return JSON.parse(saved);
  }

  static resetToDefault(): void {
    localStorage.clear();
  }

  /**
   * Calcula posições a partir do histórico de transações (auditável)
   */
  static calculatePositions(): {
    positions: PortfolioPosition[];
    totalInvestedUSD: number;
    totalInvestedBRL: number;
    currentTotalUSD: number;
    currentTotalBRL: number;
    totalGainLossUSD: number;
    totalGainLossPercentage: number;
  } {
    const assets = this.getAssets();
    const transactions = this.getTransactions();
    const exchangeRate = this.getExchangeRate();

    // Map by assetId
    const txByAsset = new Map<string, Transaction[]>();
    for (const tx of transactions) {
      const list = txByAsset.get(tx.assetId) || [];
      list.push(tx);
      txByAsset.set(tx.assetId, list);
    }

    const positions: PortfolioPosition[] = [];
    let grandTotalUSD = 0;
    let grandInvestedUSD = 0;

    for (const asset of assets) {
      const txs = txByAsset.get(asset.id) || [];
      if (txs.length === 0) continue;

      let netQuantity = 0;
      let totalCostUSD = 0;

      // Ordenar transações em ordem cronológica
      const sortedTxs = [...txs].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      for (const tx of sortedTxs) {
        if (tx.type === 'BUY') {
          netQuantity += tx.quantity;
          totalCostUSD += tx.quantity * tx.unitPrice + (tx.fees || 0);
        } else if (tx.type === 'SELL') {
          if (netQuantity > 0) {
            const avgCostBeforeSell = totalCostUSD / netQuantity;
            netQuantity -= tx.quantity;
            totalCostUSD -= tx.quantity * avgCostBeforeSell;
          }
        }
      }

      if (netQuantity > 0) {
        const averagePrice = totalCostUSD / netQuantity;
        const currentPrice = asset.currentPrice || averagePrice;
        const currentValue = netQuantity * currentPrice;
        const gainLoss = currentValue - totalCostUSD;
        const gainLossPercentage = totalCostUSD > 0 ? (gainLoss / totalCostUSD) * 100 : 0;

        positions.push({
          asset,
          quantity: Number(netQuantity.toFixed(4)),
          averagePrice: Number(averagePrice.toFixed(2)),
          totalInvested: Number(totalCostUSD.toFixed(2)),
          currentValue: Number(currentValue.toFixed(2)),
          gainLoss: Number(gainLoss.toFixed(2)),
          gainLossPercentage: Number(gainLossPercentage.toFixed(2)),
          portfolioShare: 0, // Será calculado abaixo
          targetShare: 25.0, // Alocação padrão equilibrada entre os 4 ativos
        });

        grandTotalUSD += currentValue;
        grandInvestedUSD += totalCostUSD;
      }
    }

    // Calcular parcelas percentuais da carteira
    for (const pos of positions) {
      pos.portfolioShare = grandTotalUSD > 0
        ? Number(((pos.currentValue / grandTotalUSD) * 100).toFixed(2))
        : 0;
    }

    const totalGainLossUSD = grandTotalUSD - grandInvestedUSD;
    const totalGainLossPercentage = grandInvestedUSD > 0
      ? (totalGainLossUSD / grandInvestedUSD) * 100
      : 0;

    return {
      positions,
      totalInvestedUSD: Number(grandInvestedUSD.toFixed(2)),
      totalInvestedBRL: Number((grandInvestedUSD * exchangeRate).toFixed(2)),
      currentTotalUSD: Number(grandTotalUSD.toFixed(2)),
      currentTotalBRL: Number((grandTotalUSD * exchangeRate).toFixed(2)),
      totalGainLossUSD: Number(totalGainLossUSD.toFixed(2)),
      totalGainLossPercentage: Number(totalGainLossPercentage.toFixed(2)),
    };
  }
}
