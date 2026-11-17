import React, { useState } from 'react';
import { X, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { PortfolioService } from '../../lib/portfolioService';
import { TransactionType } from '@dollarpath/shared';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const assets = PortfolioService.getAssets();
  const defaultExchangeRate = PortfolioService.getExchangeRate();

  const [assetId, setAssetId] = useState(assets[0]?.id || '');
  const [type, setType] = useState<TransactionType>('BUY');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [exchangeRate, setExchangeRate] = useState(defaultExchangeRate.toString());
  const [fees, setFees] = useState('0');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const qty = parseFloat(quantity);
    const price = parseFloat(unitPrice);
    const fx = parseFloat(exchangeRate);
    const feeVal = parseFloat(fees || '0');

    if (!assetId) {
      setError('Selecione um ativo para a transação.');
      return;
    }
    if (isNaN(qty) || qty <= 0) {
      setError('A quantidade deve ser um número positivo.');
      return;
    }
    if (isNaN(price) || price <= 0) {
      setError('O preço unitário em USD deve ser maior que zero.');
      return;
    }

    try {
      PortfolioService.addTransaction({
        assetId,
        type,
        date,
        quantity: qty,
        unitPrice: price,
        currency: 'USD',
        exchangeRate: isNaN(fx) ? defaultExchangeRate : fx,
        fees: isNaN(feeVal) ? 0 : feeVal,
        notes: notes.trim() || undefined,
      });

      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Erro ao registrar transação.');
    }
  };

  const selectedAsset = assets.find((a) => a.id === assetId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-500" />
              <span>Registrar Transação</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Alimente o histórico para cálculo auditável do seu preço médio.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Ativo & Tipo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Ativo (USD) *
              </label>
              <select
                value={assetId}
                onChange={(e) => {
                  setAssetId(e.target.value);
                  const selected = assets.find(a => a.id === e.target.value);
                  if (selected?.currentPrice) {
                    setUnitPrice(selected.currentPrice.toString());
                  }
                }}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.ticker} - {asset.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tipo da Operação *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="BUY">Compra (Aporte)</option>
                <option value="SELL">Venda</option>
                <option value="DIVIDEND">Dividendo Recebido</option>
                <option value="FEE">Taxa Operacional</option>
              </select>
            </div>
          </div>

          {/* Quantidade & Preço Unitário */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Quantidade *
              </label>
              <input
                type="number"
                step="any"
                placeholder="Ex: 2.5 ou 10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Preço Unitário (USD) *
              </label>
              <input
                type="number"
                step="any"
                placeholder="Ex: 142.50"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Data & Câmbio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Data da Operação *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Taxa de Câmbio (USD/BRL)
              </label>
              <input
                type="number"
                step="any"
                placeholder="Ex: 5.72"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Total Estimado Preview */}
          {parseFloat(quantity) > 0 && parseFloat(unitPrice) > 0 && (
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/50 flex items-center justify-between text-xs">
              <span className="text-blue-300">Total da Operação:</span>
              <div className="text-right">
                <span className="font-bold text-white text-sm">
                  ${(parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2)} USD
                </span>
                <span className="block text-[11px] text-blue-300/80">
                  ≈ R$ {(parseFloat(quantity) * parseFloat(unitPrice) * (parseFloat(exchangeRate) || defaultExchangeRate)).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Observação */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Observação / Justificativa da Alocação
            </label>
            <input
              type="text"
              placeholder="Ex: Aporte mensal de R$ 300 - rebalanceamento em tecnologia"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Salvar Transação</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
