import React, { useState } from 'react';
import { Newspaper, Filter, Search, Tag, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { PortfolioService } from '../../lib/portfolioService';
import { NewsCard } from '../../components/cards/NewsCard';
import { NewsCategory } from '@dollarpath/shared';

export const NewsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const allNews = PortfolioService.getNews();

  const filteredNews = allNews.filter((article) => {
    const matchesCategory = selectedCategory === 'ALL' || article.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.relatedTickers.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-blue-400" />
            <span>Notícias & Inteligência Editorial</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cobertura analítica do mercado americano separando fatos verificados de especulações e correlações.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por ticker, tema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'ALL', label: 'Todas as Notícias' },
          { id: 'PORTFOLIO', label: 'Minha Carteira' },
          { id: 'OPPORTUNITY', label: 'Oportunidades' },
          { id: 'MARKET_OVERVIEW', label: 'Panorama Macro' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Principles Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <span className="text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Princípio Editorial:</strong> Não reescrevemos manchetes de modo a alterar o sentido da fonte original e toda análise explicita o que foi confirmado em documentos regulatórios versus hipótese de analistas.
        </span>
      </div>

      {/* News Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="p-12 text-center text-slate-500">
          Nenhuma notícia encontrada para os critérios selecionados.
        </div>
      )}
    </div>
  );
};
