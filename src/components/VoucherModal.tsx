import React, { useRef } from 'react';
import { TransactionRecord, ShopSettings } from '../types';
import { formatMMK, formatNumberOnly } from '../utils/storage';
import { X, Printer, Share2, ArrowDownLeft, CheckCircle2, QrCode, Receipt } from 'lucide-react';
import { Logo } from './Logo';
import { ThermalReceiptData } from '../services/thermalPrinter';

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionRecord | null;
  shopSettings?: ShopSettings;
  onOpenThermalReceipt?: (data: ThermalReceiptData) => void;
  onOpenQR?: (voucherNo: string, data: unknown) => void;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
  isOpen,
  onClose,
  transaction,
  shopSettings,
  onOpenThermalReceipt,
  onOpenQR,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !transaction) return null;

  const shopName = shopSettings?.shopName || 'ရွှေလက်ရာ';
  const tagline = shopSettings?.tagline || 'မြန်မာ့လက်မှု ယွန်းထည်နှင့် ဝါးနှီးလုပ်ငန်း';
  const phone = shopSettings?.phone || '09-123456789';
  const address = shopSettings?.address || 'ပုဂံမြို့ဟောင်း၊ မန္တလေးတိုင်း';

  const handlePrint = () => {
    window.print();
  };

  const handleThermalPrint = () => {
    if (!onOpenThermalReceipt) return;
    const items = (transaction.items || []).map((item) => ({
      name: item.name,
      qty: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal || item.quantity * item.unitPrice,
    }));

    onOpenThermalReceipt({
      shopName,
      tagline,
      phone,
      address,
      voucherType: 'INBOUND',
      voucherNo: transaction.voucherNo,
      date: transaction.date,
      time: transaction.time,
      personName: transaction.supplierName,
      personLabel: 'ရက်လုပ်သူ',
      townOrVillage: transaction.supplierVillage,
      items,
      totalGoodsValue: transaction.totalGoodsValue,
      advanceDeducted: transaction.advanceDeducted,
      cashPaidToSupplier: transaction.cashPaidToSupplier,
      newAdvanceTaken: transaction.newAdvanceTaken,
      remainingAdvanceBalance: transaction.remainingAdvanceBalance,
      footerMessage: shopSettings?.receiptFooterNote,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-200 flex flex-col max-h-[95vh]">
        {/* Actions Bar */}
        <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
            <span>ကုန်သိမ်းဘောင်ချာ</span>
          </div>
          <div className="flex items-center gap-1.5">
            {onOpenThermalReceipt && (
              <button
                type="button"
                onClick={handleThermalPrint}
                className="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="Bluetooth / Thermal POS ဖြတ်ပိုင်းထုတ်မည်"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Thermal</span>
              </button>
            )}
            {onOpenQR && (
              <button
                type="button"
                onClick={() => onOpenQR(transaction.voucherNo, transaction)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="QR Code ထုတ်ယူမည်"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">QR</span>
              </button>
            )}
            <button
              type="button"
              onClick={handlePrint}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Paper */}
        <div ref={printRef} className="p-5 space-y-4 text-xs bg-white text-slate-900 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="text-center border-b border-dashed border-slate-300 pb-3 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Logo size="sm" className="w-8 h-8 rounded-xl shadow-xs shrink-0" alt={shopName} />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">{shopName}</h2>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">{tagline}</p>
            <p className="text-[10px] text-slate-500">{address} • {phone}</p>
            <div className="inline-block mt-1 px-2.5 py-0.5 bg-slate-100 rounded text-[11px] font-bold text-slate-800 uppercase tracking-wide">
              ကုန်သိမ်းငွေရှင်းပြေစာ (VOUCHER)
            </div>
          </div>

          {/* Details Info */}
          <div className="grid grid-cols-2 gap-1 text-[11px] border-b border-slate-200 pb-2">
            <div>
              <span className="text-slate-500">ဘောင်ချာနံပါတ်: </span>
              <strong className="font-mono text-slate-800">{transaction.voucherNo}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500">ရက်စွဲ: </span>
              <strong className="text-slate-800">{transaction.date} ({transaction.time})</strong>
            </div>
            <div>
              <span className="text-slate-500">ရက်လုပ်သူ: </span>
              <strong className="text-slate-900">{transaction.supplierName}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500">ရွာ: </span>
              <strong className="text-slate-800">{transaction.supplierVillage}</strong>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-[10px] text-slate-600 uppercase">
                  <th className="py-1">ပစ္စည်း</th>
                  <th className="py-1 text-center">အရေအတွက်</th>
                  <th className="py-1 text-right">နှုန်း</th>
                  <th className="py-1 text-right">ကျသင့်ငွေ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {transaction.items && transaction.items.map((item, idx) => (
                  <tr key={idx} className="py-1">
                    <td className="py-1 font-semibold text-slate-900">{item.productName}</td>
                    <td className="py-1 text-center font-bold text-slate-700">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-1 text-right text-slate-600">
                      {formatNumberOnly(item.unitPrice)}
                    </td>
                    <td className="py-1 text-right font-extrabold text-slate-900">
                      {formatNumberOnly(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Advance Math */}
          <div className="space-y-1.5 pt-2 border-t border-slate-300 text-xs">
            <div className="flex justify-between font-bold text-slate-900">
              <span>သိမ်းဆည်းကုန်တန်ဖိုး စုစုပေါင်း:</span>
              <span>{formatMMK(transaction.totalGoodsValue)}</span>
            </div>

            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>ယခင်လက်ကျန်အကြိုငွေ (ဟောင်း):</span>
              <span>{formatMMK(transaction.previousAdvanceBalance)}</span>
            </div>

            <div className="flex justify-between text-emerald-800 text-[11px] font-semibold">
              <span>ယခုအကြိုငွေမှ နုတ်ယူငွေ (ကျေပြီး):</span>
              <span>- {formatMMK(transaction.advanceDeducted)}</span>
            </div>

            {transaction.newAdvanceTaken > 0 && (
              <div className="flex justify-between text-amber-800 text-[11px] font-semibold">
                <span>အကြိုငွေအသစ် ထုတ်ပေးငွေ:</span>
                <span>+ {formatMMK(transaction.newAdvanceTaken)}</span>
              </div>
            )}

            {transaction.netCashPaidToSupplier > 0 && (
              <div className="flex justify-between text-blue-800 text-[11px] font-semibold">
                <span>လက်ငင်းရှင်းပေးငွေ:</span>
                <span>{formatMMK(transaction.netCashPaidToSupplier)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-dashed border-slate-300 flex justify-between items-center text-sm font-black">
              <span className="text-slate-900">လက်ကျန်အကြိုငွေ စာရင်း:</span>
              <span className={transaction.remainingAdvanceBalance > 0 ? 'text-rose-700' : 'text-emerald-700'}>
                {formatMMK(transaction.remainingAdvanceBalance)}
              </span>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 text-center text-[10px] text-slate-500">
            <div>
              <div className="w-24 border-b border-slate-300 mx-auto mb-1" />
              <span>ရက်လုပ်သူ လက်မှတ်</span>
            </div>
            <div>
              <div className="w-24 border-b border-slate-300 mx-auto mb-1" />
              <span>စာရင်းကိုင် လက်မှတ်</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
