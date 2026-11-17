import React, { useState } from 'react';
import { ExternalLink, Clock, ShieldAlert, Sparkles, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { NewsArticle } from '@dollarpath/shared';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const categoryLabels: Record<string, { label: string; color: string }> = {
    PORTFOLIO: { label: 'Minha Carteira', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    OPPORTUNITY: { label: 'Oportunidade', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    URGENT: { label: 'Urgente / Breaking', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    MARKET_OVERVIEW: { label: 'Panorama Macro', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  };

  const cat = categoryLabels[article.category] || categoryLabels.MARKET_OVERVIEW;

  return (
    <article
      className={`bg-[#0f172a]/70 hover:bg-[#131d2e] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between group shadow-sm ${
        featured ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      {/* Article Image Container */}
      <div className={`relative overflow-hidden bg-slate-900 ${featured ? 'md:w-1/2 min-h-[240px]' : 'h-48'}`}>
        {!imgError && article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-500 p-6 text-center">
            <Tag className="w-8 h-8 mb-2 text-slate-600" />
            <span className="text-xs font-semibold text-slate-400">Notícia de Mercado Americano</span>
            <span className="text-[10px] text-slate-600 mt-1">DollarPath Editorial</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#090d12] via-transparent to-black/30 pointer-events-none" />

        {/* Badges on image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border backdrop-blur-md ${cat.color}`}>
            {cat.label}
          </span>
          {article.isBreaking && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white animate-pulse">
              NOVA
            </span>
          )}
        </div>

        {/* Ticker chips on bottom of image */}
        <div className="absolute bottom-3 left-3 flex gap-1 z-10">
          {article.relatedTickers.map((ticker) => (
            <span
              key={ticker}
              className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-blue-400 font-mono text-xs font-bold backdrop-blur-sm"
            >
              ${ticker}
            </span>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className={`p-5 flex-1 flex flex-col justify-between ${featured ? 'md:w-1/2' : ''}`}>
        <div>
          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
            <span className="font-medium text-slate-300">{article.source}</span>
            <div className="flex items-center gap-1 text-[11px]">
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-100 group-hover:text-blue-300 transition-colors leading-snug mb-2.5 line-clamp-2">
            {article.title}
          </h3>

          {/* Summary */}
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            {article.summary}
          </p>

          {/* Fact vs Interpretation Box */}
          {article.analysis && (
            <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Análise Editorial DollarPath</span>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-slate-400 hover:text-slate-200 text-[11px] flex items-center gap-0.5 cursor-pointer"
                >
                  {isExpanded ? (
                    <>Recolher <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Ver Análise <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className="pt-2 border-t border-slate-800 text-slate-300 text-[11px] leading-relaxed animate-fadeIn">
                  {article.analysis}
                  <div className="mt-2 text-[10px] text-amber-400/90 flex items-center gap-1 italic">
                    <ShieldAlert className="w-3 h-3 shrink-0" />
                    <span>Princípio de Segurança: Correlações não representam garantia de causa ou recomendação de compra.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">
            {article.status === 'ACTIVE' ? 'Monitorado' : 'Arquivado'}
          </span>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 transition-colors"
          >
            <span>Fonte Original</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
};
