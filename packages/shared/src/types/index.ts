export type AssetType = 'STOCK' | 'ETF' | 'REIT' | 'CRYPTO' | 'CASH';

export interface Asset {
  id: string;
  ticker: string;
  name: string;
  type: AssetType;
  sector: string;
  currency: 'USD' | 'BRL';
  country: string;
  status: 'ACTIVE' | 'WATCHLIST' | 'INACTIVE';
  currentPrice?: number;
  priceUpdatedAt?: string;
}

export type TransactionType = 'BUY' | 'SELL' | 'DIVIDEND' | 'FEE' | 'EXCHANGE';

export interface Transaction {
  id: string;
  assetId: string;
  type: TransactionType;
  date: string;
  quantity: number;
  unitPrice: number;
  currency: 'USD' | 'BRL';
  exchangeRate?: number; // e.g. BRL/USD
  fees?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PortfolioPosition {
  asset: Asset;
  quantity: number;
  averagePrice: number; // in USD
  totalInvested: number; // quantity * averagePrice
  currentValue: number; // quantity * currentPrice
  gainLoss: number;
  gainLossPercentage: number;
  portfolioShare: number; // percentage of total
  targetShare?: number; // target allocation percentage
}

export interface MonthlyBudget {
  id: string;
  month: string; // YYYY-MM
  income: number;
  expenses: number;
  emergencyReserveBalance: number;
  plannedInvestment: number;
  currency: 'BRL';
}

export interface ContributionPlan {
  id: string;
  assetId: string;
  targetPercentage?: number;
  targetValue?: number;
  priority: number;
  isActive: boolean;
}

export interface Dividend {
  id: string;
  assetId: string;
  exDate: string;
  paymentDate: string;
  amountPerShare: number;
  quantity: number;
  totalAmount: number;
  currency: 'USD';
}

export type NewsCategory = 'URGENT' | 'PORTFOLIO' | 'OPPORTUNITY' | 'MARKET_OVERVIEW';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  analysis?: string; // Fatos vs Interpretação explicados
  isInterpretationConfirmed?: boolean;
  source: string;
  url: string;
  publishedAt: string;
  collectedAt: string;
  imageUrl?: string;
  category: NewsCategory;
  isBreaking?: boolean;
  relatedTickers: string[];
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface OpportunityScoreDetail {
  growth: number; // 0-100
  quality: number; // 0-100
  balanceSheet: number; // 0-100
  valuation: number; // 0-100
  catalysts: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Opportunity {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  thesis: string;
  risks: string[];
  catalysts: string[];
  imageUrl: string;
  score?: number;
  scoreDetails?: OpportunityScoreDetail;
  radarStyle: 'AGGRESSIVE_GROWTH' | 'GROWTH_WITH_FUNDAMENTALS' | 'DISCOUNTED' | 'ALL';
  reviewDate: string;
  status: 'ACTIVE' | 'ARCHIVED';
  financials?: {
    marketCap?: string;
    peRatio?: number;
    revenueGrowthYoY?: string;
    netMargin?: string;
    debtToEquity?: string;
    freeCashFlow?: string;
  };
}

export interface Goal {
  id: string;
  name: string;
  targetValue: number;
  currentValue: number;
  currency: 'BRL' | 'USD';
  deadlineYears: number;
  targetDate?: string;
  notes?: string;
}
