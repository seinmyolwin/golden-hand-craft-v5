import React, { useState, useEffect, useMemo } from 'react';
import { Merchant, Product, SaleRecord, SaleItem, PaymentMethod } from '../types';
import { formatMMK, formatNumberOnly, getTodayDateString, getCurrentTimeString } from '../utils/storage';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Building2,
  Truck,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchants: Merchant[];
  products: Product[];
  initialMerchantId?: string;
  selectedDate: string;
  inventoryStock?: any[];
  onSave: (sale: SaleRecord) => void;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({
  isOpen,
  onClose,
  merchants = [],
  products = [],
  initialMerchantId,
  selectedDate,
  inventoryStock = [],
  onSave,
}) => {
  const [merchantId, setMerchantId] = useState<string>(initialMerchantId || (merchants[0]?.id || ''));
  const [saleDate, setSaleDate] = useState<string>(selectedDate || getTodayDateString());
  const [saleTime, setSaleTime] = useState<string>(getCurrentTimeString());

  const [items, setItems] = useState<{ productId: string; quantity: number; unitPrice: number }[]>([
    {
      productId: products[0]?.id || '',
      quantity: 10,
      unitPrice: products[0]?.defaultWholesalePrice || Math.round((products[0]?.defaultPrice || 1000) * 1.25),
    },
  ]);

  const [cashPaidByMerchant, setCashPaidByMerchant] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initialMerchantId) {
      setMerchantId(initialMerchantId);
    } else if (merchants.length > 0 && !merchantId) {
      setMerchantId(merchants[0].id);
    }
  }, [initialMerchantId, merchants]);

  const currentMerchant = useMemo(() => {
    return merchants.find((m) => m.id === merchantId);
  }, [merchants, merchantId]);

  const previousReceivableBalance = currentMerchant?.currentReceivableBalance || 0;

  const grandTotal = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);
  }, [items]);

  const totalItemsCount = useMemo(() => {
    return items.reduce((sum, it) => sum + it.quantity, 0);
  }, [items]);

  const remainingReceivableBalance = Math.max(0, grandTotal - cashPaidByMerchant);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const firstProd = products[0];
    setItems([
      ...items,
      {
        productId: firstProd?.id || '',
        quantity: 10,
        unitPrice: firstProd?.defaultWholesalePrice || Math.round((firstProd?.defaultPrice || 1000) * 1.25),
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, pId: string) => {
    const prod = products.find((p) => p.id === pId);
    const updated = [...items];
    updated[index].productId = pId;
    if (prod) {
      updated[index].unitPrice = prod.defaultWholesalePrice || Math.round(prod.defaultPrice * 1.25);
    }
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMerchant) return;

    const validItems: SaleItem[] = items
      .map((it) => {
        const prod = products.find((p) => p.id === it.productId);
        if (!prod || it.quantity <= 0) return null;
        return {
          productId: prod.id,
          productName: prod.name,
          quantity: it.quantity,
          unit: prod.unit,
          unitPrice: it.unitPrice,
          subtotal: it.quantity * it.unitPrice,
        };
      })
      .filter((it): it is SaleItem => it !== null);

    const voucherNo = `SL-${Date.now().toString().slice(-6)}`;

    const newSale: SaleRecord = {
      id: `sale-${Date.now()}`,
      voucherNo,
      date: saleDate,
      time: saleTime,
      merchantId: currentMerchant.id,
      merchantName: currentMerchant.name,
      merchantTown: currentMerchant.town,
      items: validItems,
      totalItemsCount,
      grandTotal,
      cashPaidByMerchant,
      paymentMethod,
      remainingReceivableBalance,
      notes: notes.trim(),
    };

    onSave(newSale);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white text-slate-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 bg-blue-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-300" />
            <h3 className="text-base font-bold">ကုန်သည် အရောင်းဘောင်ချာဖွင့်မည်</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-blue-950 hover:bg-blue-800 text-blue-200 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs flex-1 overflow-y-auto overscroll-contain">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-700 font-bold mb-1">ကုန်သည် ရွေးချယ်ပါ *</label>
              <select
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                required
              >
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.town})
                  </option>
                ))}
              </select>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-center">
              <span className="text-[11px] text-slate-500">ယခင်ရရန်ကျန်ငွေ (အကြွေးဟောင်း)</span>
              <span className={`text-base font-extrabold ${previousReceivableBalance > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                {formatMMK(previousReceivableBalance)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">ရက်စွဲ</label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">အချိန်</label>
              <input
                type="time"
                value={saleTime}
                onChange={(e) => setSaleTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                required
              />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-700 font-bold">ရောင်းချသော ကုန်ပစ္စည်းများ</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ ပစ္စည်းထပ်ထည့်မည်</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => {
                const curProdStock = inventoryStock.find((st) => st.product?.id === item.productId);
                return (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                  >
                    <div className="sm:col-span-5">
                      <select
                        value={item.productId}
                        onChange={(e) => handleProductChange(idx, e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.unit})
                          </option>
                        ))}
                      </select>
                      {curProdStock && (
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          လက်ကျန်: {curProdStock.currentStock} {curProdStock.product.unit}
                        </span>
                      )}
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="number"
                        min="1"
                        placeholder="အရေအတွက်"
                        value={item.quantity === 0 ? '' : item.quantity}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx].quantity = parseInt(e.target.value, 10) || 0;
                          setItems(updated);
                        }}
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="number"
                        min="0"
                        placeholder="ရောင်းစျေး"
                        value={item.unitPrice === 0 ? '' : item.unitPrice}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx].unitPrice = parseInt(e.target.value, 10) || 0;
                          setItems(updated);
                        }}
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-blue-900"
                        required
                      />
                    </div>
                    <div className="sm:col-span-1 text-center">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment & Settlement */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-blue-950">ကျသင့်ငွေ စုစုပေါင်း:</span>
              <span className="text-base font-black text-blue-900">{formatMMK(grandTotal)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  လက်ငင်း/လွှဲပေးငွေ (ကျပ်)
                </label>
                <input
                  type="number"
                  min="0"
                  max={grandTotal}
                  value={cashPaidByMerchant === 0 ? '' : cashPaidByMerchant}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setCashPaidByMerchant(isNaN(val) ? 0 : Math.max(0, val));
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-xs font-bold text-emerald-800"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">ငွေရှင်းနည်းလမ်း</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-xs font-semibold"
                >
                  <option value="CASH">လက်ငင်းငွေသား (Cash)</option>
                  <option value="KPAY">KPay</option>
                  <option value="WAVE">Wave Pay</option>
                  <option value="BANK_TRANSFER">ဘဏ်အကောင့်လွှဲငွေ</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-200 flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">ယခုဘောင်ချာအတွက် ရရန်ကျန်ငွေ:</span>
              <span className={`font-black text-sm ${remainingReceivableBalance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {formatMMK(remainingReceivableBalance)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">မှတ်ချက် / ကားဂိတ်</label>
            <input
              type="text"
              placeholder="ဥပမာ - မန္တလေးရွှေမန်းသူ ကားဂိတ်သို့ တင်ပို့"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
            >
              မလုပ်တော့ပါ
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-sm cursor-pointer"
            >
              အရောင်းဘောင်ချာထုတ်မည်
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
