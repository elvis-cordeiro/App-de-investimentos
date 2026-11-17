import React, { useState } from 'react';
import { X, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { PortfolioService } from '../../lib/portfolioService';
import { AssetType } from '@dollarpath/shared';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<AssetType>('STOCK');
  const [sector, setSector] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanTicker = ticker.trim().toUpperCase();
    const cleanName = name.trim();
    const priceVal = parseFloat(currentPrice);

    if (!cleanTicker) {
      setError('Informe o ticker do ativo (ex: NVDA, AAPL).');
      return;
    }
    if (!cleanName) {
      setError('Informe o nome da empresa.');
      return;
    }
    if (isNaN(priceVal) || priceVal <= 0) {
      setError('Informe uma cotação inicial válida em USD.');
      return;
    }

    try {
      PortfolioService.addAsset({
        ticker: cleanTicker,
        name: cleanName,
        type,
        sector: sector.trim() || 'Tecnologia / Outros',
        currency: 'USD',
        country: 'US',
        status: 'ACTIVE',
        currentPrice: priceVal,
        priceUpdatedAt: new Date().toISOString(),
      });

      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Erro ao cadastrar ativo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
            <span>Cadastrar Novo Ativo</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Ticker (Código na Bolsa Americana) *
            </label>
            <input
              type="text"
              placeholder="Ex: MSFT, TSLA, QQQ"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              required
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nome da Empresa / Fundo *
            </label>
            <input
              type="text"
              placeholder="Ex: Microsoft Corporation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tipo do Ativo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AssetType)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="STOCK">Ação (Stock)</option>
                <option value="ETF">ETF Americano</option>
                <option value="REIT">REIT (Imobiliário)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cotação Atual (USD) *
              </label>
              <input
                type="number"
                step="any"
                placeholder="Ex: 415.80"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Setor / Tema
            </label>
            <input
              type="text"
              placeholder="Ex: Cloud, Semicondutores, Software"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Cadastrar Ativo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
