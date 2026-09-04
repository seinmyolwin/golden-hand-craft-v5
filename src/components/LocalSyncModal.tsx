import React, { useState } from 'react';
import { X, Wifi, Smartphone, Check, Copy, Download, Upload } from 'lucide-react';
import { exportAllDataJSON } from '../utils/storage';

interface LocalSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportData: (data: any) => void;
}

export const LocalSyncModal: React.FC<LocalSyncModalProps> = ({
  isOpen,
  onClose,
  onImportData,
}) => {
  const [syncCode, setSyncCode] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentBackupString = () => {
    try {
      const state = {
        suppliers: JSON.parse(localStorage.getItem('ledger_suppliers_v1') || '[]'),
        merchants: JSON.parse(localStorage.getItem('ledger_merchants_v1') || '[]'),
        products: JSON.parse(localStorage.getItem('ledger_products_v1') || '[]'),
        transactions: JSON.parse(localStorage.getItem('ledger_transactions_v1') || '[]'),
        sales: JSON.parse(localStorage.getItem('ledger_sales_v1') || '[]'),
      };
      return JSON.stringify(state);
    } catch {
      return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentBackupString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(syncCode.trim());
      onImportData(parsed);
      alert('အချက်အလက်များ အောင်မြင်စွာ ချိတ်ဆက်ကူးယူပြီးပါပြီ');
      onClose();
    } catch (e) {
      alert('ထည့်သွင်းထားသော ကုဒ် မမှန်ကန်ပါ');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100">
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold">စက်အချင်းချင်း စာရင်းချိတ်ဆက်ခြင်း (Local Sync)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3.5 text-xs">
          <p className="text-slate-600 leading-relaxed">
            အင်တာနက်မရှိဘဲ ဖုန်းတစ်လုံးမှ တစ်လုံးသို့ စာရင်းများကို ကုဒ်ကူးယူ၍ဖြစ်စေ၊ ဖိုင်ပို့၍ဖြစ်စေ လွယ်ကူစွာ ချိတ်ဆက်နိုင်ပါသည်။
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-bold text-slate-800 block">၁။ မိမိစက်မှ စာရင်းကုဒ်ထုတ်ယူမည်</span>
            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'ကုဒ်ကူးယူပြီးပါပြီ (Copied)' : 'စာရင်းကုဒ် ကူးယူမည် (Copy Code)'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-bold text-slate-800 block">၂။ အခြားစက်မှ စာရင်းကုဒ် ထည့်သွင်းမည်</span>
            <textarea
              rows={3}
              placeholder="အခြားဖုန်းမှ ကူးယူလာသော စာရင်းကုဒ်ကို ဤနေရာတွင် ထည့်ပါ..."
              value={syncCode}
              onChange={(e) => setSyncCode(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-[11px]"
            />
            <button
              type="button"
              onClick={handleImport}
              disabled={!syncCode.trim()}
              className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                syncCode.trim()
                  ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>စာရင်း အသစ်သွင်းယူမည် (Import)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
