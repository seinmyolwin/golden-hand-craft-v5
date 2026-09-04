import React, { useState, useMemo } from 'react';
import { PeerTradeRecord, Product } from '../types';
import {
  formatMMK,
  formatNumberOnly,
  getTodayDateString,
  getCurrentTimeString,
} from '../utils/storage';
import {
  ArrowRightLeft,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Building,
  Calendar,
  X,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

interface PeerTradingTabProps {
  peerTrades: PeerTradeRecord[];
  products: Product[];
  onAddPeerTrade: (trade: PeerTradeRecord) => void;
  onDeletePeerTrade?: (tradeId: string) => void;
}

export const PeerTradingTab: React.FC<PeerTradingTabProps> = ({
  peerTrades = [],
  products = [],
  onAddPeerTrade,
  onDeletePeerTrade,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'BORROW_IN' | 'LEND_OUT'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form State
  const [tradeType, setTradeType] = useState<'BORROW_IN' | 'LEND_OUT'>('BORROW_IN');
  const [peerShopName, setPeerShopName] = useState<string>('');
  const [peerLocation, setPeerLocation] = useState<string>('ပုဂံမြို့ဟောင်း');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(10);
  const [agreedUnitPrice, setAgreedUnitPrice] = useState<number>(15000);
  const [notes, setNotes] = useState<string>('');

  const filteredTrades = useMemo(() => {
    return (peerTrades || []).filter((t) => {
      if (!t) return false;
      const matchesSearch =
        (t.peerShopName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.peerLocation || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'ALL' || t.tradeType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [peerTrades, searchQuery, typeFilter]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!peerShopName.trim()) return;

    const prod = products.find((p) => p.id === selectedProductId) || products[0];
    if (!prod) return;

    const totalVal = quantity * agreedUnitPrice;

    const newTrade: PeerTradeRecord = {
      id: `pt-${Date.now()}`,
      tradeType,
      date: getTodayDateString(),
      time: getCurrentTimeString(),
      peerShopName: peerShopName.trim(),
      peerLocation: peerLocation.trim() || 'ပုဂံ',
      productId: prod.id,
      productName: prod.name,
      quantity,
      unit: prod.unit,
      agreedUnitPrice,
      totalTradeValue: totalVal,
      status: 'OPEN',
      notes: notes.trim(),
    };

    onAddPeerTrade(newTrade);
    setIsModalOpen(false);
    setPeerShopName('');
    setQuantity(10);
    setNotes('');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                မိတ်ဖက်ယွန်းဆိုင်များအကြား ကုန်ဖလှယ်/ချေးငှားခြင်း
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/50">
                  {peerTrades.length} စောင်
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                အော်ဒါအရေးပေါ်လိုအပ်ချိန် ဆိုင်အချင်းချင်း ကုန်ချေးယူခြင်းနှင့် ထုတ်ငှားခြင်း
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (products.length > 0 && !selectedProductId) {
              setSelectedProductId(products[0].id);
              setAgreedUnitPrice(products[0].defaultWholesalePrice || products[0].defaultPrice);
            }
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ ကုန်ဖလှယ်မှတ်တမ်းတင်မည်</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="မိတ်ဖက်ဆိုင်အမည် / ကုန်ပစ္စည်း / နေရာဖြင့် ရှာမည်..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                typeFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              အားလုံး
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('BORROW_IN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                typeFilter === 'BORROW_IN' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              အခြားဆိုင်မှ ချေးယူခြင်း
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('LEND_OUT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                typeFilter === 'LEND_OUT' ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              အခြားဆိုင်သို့ ထုတ်ငှားခြင်း
            </button>
          </div>
        </div>
      </div>

      {/* Trades Grid */}
      <div className="space-y-3">
        {filteredTrades.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            <ArrowRightLeft className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">ကုန်ဖလှယ်မှတ်တမ်း မရှိသေးပါ</p>
          </div>
        ) : (
          filteredTrades.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      t.tradeType === 'BORROW_IN'
                        ? 'bg-teal-100 text-teal-800 border border-teal-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {t.tradeType === 'BORROW_IN' ? 'ချေးယူ (+) အဝင်' : 'ထုတ်ငှား (-) အထွက်'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {t.date} {t.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    တန်ဖိုး: {formatMMK(t.totalTradeValue)}
                  </span>
                  {onDeletePeerTrade && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`မှတ်တမ်း ဖျက်လိုပါသလား?`)) {
                          onDeletePeerTrade(t.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-slate-500" />
                    {t.peerShopName}
                    <span className="text-xs text-slate-500 font-normal">({t.peerLocation})</span>
                  </h4>
                </div>
                <div className="text-right font-bold text-sm text-slate-800">
                  {t.productName}: {t.quantity} {t.unit}
                </div>
              </div>

              {t.notes && (
                <div className="text-xs text-slate-500 italic mt-2">
                  မှတ်ချက်: {t.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100">
            <div className="px-4 py-3 bg-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-teal-300" />
                <h3 className="text-sm font-bold">ကုန်ဖလှယ်/ချေးငှား မှတ်တမ်းတင်ခြင်း</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-teal-800 hover:bg-teal-700 text-teal-200 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">ဖလှယ်မှု ပုံစံ</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTradeType('BORROW_IN')}
                    className={`py-2 px-2 rounded-lg font-bold border text-center cursor-pointer ${
                      tradeType === 'BORROW_IN'
                        ? 'bg-teal-50 text-teal-800 border-teal-500 ring-1 ring-teal-500'
                        : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    အခြားဆိုင်မှ ချေးယူခြင်း (အဝင်)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeType('LEND_OUT')}
                    className={`py-2 px-2 rounded-lg font-bold border text-center cursor-pointer ${
                      tradeType === 'LEND_OUT'
                        ? 'bg-amber-50 text-amber-800 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    အခြားဆိုင်သို့ ထုတ်ငှားခြင်း (အထွက်)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">မိတ်ဖက်ဆိုင်အမည် *</label>
                  <input
                    type="text"
                    placeholder="ဥပမာ - ရွှေပြည်စိုး ယွန်းဆိုင်"
                    value={peerShopName}
                    onChange={(e) => setPeerShopName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">တည်နေရာ/မြို့</label>
                  <input
                    type="text"
                    value={peerLocation}
                    onChange={(e) => setPeerLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ကုန်ပစ္စည်း ရွေးချယ်ပါ</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const p = products.find((prod) => prod.id === e.target.value);
                    if (p) setAgreedUnitPrice(p.defaultWholesalePrice || p.defaultPrice);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">အရေအတွက်</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">သတ်မှတ်တန်ဖိုးနှုန်း (ကျပ်)</label>
                  <input
                    type="number"
                    min="0"
                    value={agreedUnitPrice}
                    onChange={(e) => setAgreedUnitPrice(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">မှတ်ချက်</label>
                <input
                  type="text"
                  placeholder="ဥပမာ - နောက်အပတ် ကုန်သိမ်းပြီး ပြန်ပေးမည်"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer transition-colors"
                >
                  မလုပ်တော့ပါ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  သိမ်းဆည်းမည်
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
