import React, { useRef } from 'react';
import { exportAllDataJSON, exportDailyCollectionCSV, exportMerchantSalesCSV } from '../utils/storage';
import { X, Download, Upload, Shield, CheckCircle2, FileText, Database } from 'lucide-react';

interface BackupSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportBackup: (importedData: any) => void;
}

export const BackupSaveModal: React.FC<BackupSaveModalProps> = ({
  isOpen,
  onClose,
  onImportBackup,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (confirm('မိတ္တူဖိုင်မှ အချက်အလက်များကို ပြန်လည်သွင်းယူလိုပါသလား? လက်ရှိအချက်အလက်များ အစားထိုးသွားပါမည်။')) {
          onImportBackup(json);
          onClose();
        }
      } catch (err) {
        alert('ဖိုင်ဖတ်ရှု၍ မရပါ၊ မှန်ကန်သော JSON backup ဖိုင်ဖြစ်ပါစေ');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100">
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold">အချက်အလက် မိတ္တူကူးခြင်းနှင့် ပြန်သွင်းခြင်း</h3>
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
            ဖုန်း သို့မဟုတ် ကွန်ပျူတာ ပျက်စီး/ပျောက်ဆုံးပါက စာရင်းများမဆုံးရှုံးစေရန် အပတ်စဉ် သို့မဟုတ် လစဉ် မိတ္တူ (Backup) သိမ်းဆည်းထားသင့်ပါသည်။
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={exportAllDataJSON}
              className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-between font-bold text-emerald-900 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-700" />
                <span>စာရင်းအားလုံး အပြည့်အစုံ သိမ်းမည် (JSON Backup)</span>
              </div>
              <Download className="w-4 h-4 text-emerald-700" />
            </button>

            <button
              type="button"
              onClick={exportDailyCollectionCSV}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between font-bold text-slate-800 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <span>ကုန်သိမ်းမှတ်တမ်း Excel/CSV ထုတ်ယူမည်</span>
              </div>
              <Download className="w-4 h-4 text-slate-600" />
            </button>

            <button
              type="button"
              onClick={exportMerchantSalesCSV}
              className="w-full p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-between font-bold text-blue-900 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>အရောင်းမှတ်တမ်း Excel/CSV ထုတ်ယူမည်</span>
              </div>
              <Download className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>မိတ္တူဖိုင်မှ စာရင်းပြန်သွင်းမည် (Restore Backup)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
