import React, { useRef, useState } from 'react';
import {
  Supplier,
  Product,
  TransactionRecord,
  Merchant,
  SaleRecord,
  StockAdjustmentRecord,
  ShopSettings,
  BackupReminderSettings,
  AppLockSettings,
  AutoRecoverySnapshot,
} from '../types';
import {
  exportBackupJSON,
  exportSuppliersCSV,
  exportMerchantsCSV,
  exportDailyCollectionCSV,
  exportSalesHistoryCSV,
  exportInventoryCSV,
  generate100SampleSuppliers,
  computeAllProductsStock,
  DEFAULT_SHOP_SETTINGS,
  regenerateRecoveryKey,
  resetAppLockPinWithRecoveryKey,
  DEFAULT_APP_LOCK,
} from '../utils/storage';
import { Logo } from './Logo';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Smartphone,
  ShieldCheck,
  Users,
  AlertTriangle,
  FileSpreadsheet,
  Building2,
  Package,
  Store,
  Edit3,
  FolderDown,
  FolderOpen,
  Trash2,
  History,
  BellRing,
  Clock,
  Lock,
  Unlock,
  Radio,
  Share2,
  RotateCcw,
  CheckCircle2,
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  ShieldAlert,
} from 'lucide-react';
import {
  DEFAULT_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_TRANSACTIONS,
  INITIAL_MERCHANTS,
  INITIAL_SALES,
} from '../data/defaultData';

interface SettingsBackupTabProps {
  products: Product[];
  suppliers: Supplier[];
  transactions: TransactionRecord[];
  merchants: Merchant[];
  sales: SaleRecord[];
  stockAdjustments: StockAdjustmentRecord[];
  shopSettings?: ShopSettings;
  deletedRecordsCount?: number;
  backupReminderSettings?: BackupReminderSettings;
  onUpdateBackupReminderSettings?: (newSettings: BackupReminderSettings) => void;
  onOpenBackupReminderModal?: () => void;
  onOpenEditShopProfile?: () => void;
  onOpenBackupSaveModal?: () => void;
  onOpenDeletedHistory?: () => void;
  onOpenClearDataModal?: () => void;
  appLockSettings?: AppLockSettings;
  onUpdateAppLockSettings?: (settings: AppLockSettings) => void;
  snapshots?: AutoRecoverySnapshot[];
  onRestoreSnapshot?: (snapshot: AutoRecoverySnapshot) => void;
  onTakeSnapshotNow?: (reason: string) => void;
  onOpenSyncModal?: () => void;
  onOpenZapyaModal?: () => void;
  onRestoreData: (
    products: Product[],
    suppliers: Supplier[],
    transactions: TransactionRecord[],
    merchants?: Merchant[],
    sales?: SaleRecord[],
    stockAdjustments?: StockAdjustmentRecord[],
    shopSettings?: ShopSettings
  ) => void;
}

export const SettingsBackupTab: React.FC<SettingsBackupTabProps> = ({
  products = [],
  suppliers = [],
  transactions = [],
  merchants = [],
  sales = [],
  stockAdjustments = [],
  shopSettings = DEFAULT_SHOP_SETTINGS,
  deletedRecordsCount = 0,
  backupReminderSettings,
  onUpdateBackupReminderSettings,
  onOpenBackupReminderModal,
  onOpenEditShopProfile,
  onOpenBackupSaveModal,
  onOpenDeletedHistory,
  onOpenClearDataModal,
  appLockSettings,
  onUpdateAppLockSettings,
  snapshots = [],
  onRestoreSnapshot,
  onTakeSnapshotNow,
  onOpenSyncModal,
  onOpenZapyaModal,
  onRestoreData,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editingPin, setEditingPin] = useState(false);
  const [newPin, setNewPin] = useState(appLockSettings?.passcode ?? appLockSettings?.pin ?? '1234');
  const [snapshotReason, setSnapshotReason] = useState('');

  // Password Recovery Key State
  const [showRecoveryKey, setShowRecoveryKey] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [isKeyResetOpen, setIsKeyResetOpen] = useState<boolean>(false);
  const [resetKeyInput, setResetKeyInput] = useState<string>('');
  const [resetNewPin, setResetNewPin] = useState<string>('');
  const [resetConfirmPin, setResetConfirmPin] = useState<string>('');
  const [resetError, setResetError] = useState<string>('');
  const [resetSuccess, setResetSuccess] = useState<string>('');

  const currentRecoveryKey =
    appLockSettings?.recoveryKey || DEFAULT_APP_LOCK.recoveryKey || 'SLY-8842-9173';

  const handleCopyRecoveryKey = () => {
    navigator.clipboard.writeText(currentRecoveryKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    if (
      confirm(
        'Recovery Key အသစ်ထုတ်ယူလိုပါသလား?\n\n(Key အသစ်ထုတ်ယူပြီးပါက ယခင် Key ဖြင့် ပြန်လည်ရယူနိုင်တော့မည် မဟုတ်ပါ)'
      )
    ) {
      const newKey = regenerateRecoveryKey();
      if (onUpdateAppLockSettings && appLockSettings) {
        onUpdateAppLockSettings({
          ...appLockSettings,
          recoveryKey: newKey,
        });
      }
      alert(`Recovery Key အသစ် ထုတ်ယူပြီးပါပြီ:\n${newKey}\n\nဤကီးကို သေချာမှတ်သားသိမ်းဆည်းထားပါ`);
    }
  };

  const handleDirectKeyResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!resetKeyInput.trim()) {
      setResetError('Recovery Key ရိုက်ထည့်ပေးပါ');
      return;
    }
    if (!resetNewPin || resetNewPin.length < 4) {
      setResetError('PIN အသစ်သည် အနည်းဆုံး ၄ လုံး ရှိရပါမည်');
      return;
    }
    if (resetNewPin !== resetConfirmPin) {
      setResetError('PIN အသစ် နှစ်ကြိမ် ရိုက်ထည့်မှု တူညီမှုမရှိပါ');
      return;
    }

    const res = resetAppLockPinWithRecoveryKey(resetKeyInput.trim(), resetNewPin);
    if (res.success) {
      setResetSuccess(res.message);
      if (onUpdateAppLockSettings && appLockSettings) {
        onUpdateAppLockSettings({
          ...appLockSettings,
          passcode: resetNewPin,
          pin: resetNewPin,
        });
      }
      setResetKeyInput('');
      setResetNewPin('');
      setResetConfirmPin('');
      setTimeout(() => {
        setIsKeyResetOpen(false);
        setResetSuccess('');
      }, 1500);
    } else {
      setResetError(res.message);
    }
  };

  const handleBackup = () => {
    if (onOpenBackupSaveModal) {
      onOpenBackupSaveModal();
    } else {
      exportBackupJSON(products, suppliers, transactions, merchants, sales, stockAdjustments, shopSettings);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.suppliers && parsed.products) {
          onRestoreData(
            Array.isArray(parsed.products) ? parsed.products : DEFAULT_PRODUCTS,
            Array.isArray(parsed.suppliers) ? parsed.suppliers : INITIAL_SUPPLIERS,
            Array.isArray(parsed.transactions) ? parsed.transactions : [],
            Array.isArray(parsed.merchants) ? parsed.merchants : INITIAL_MERCHANTS,
            Array.isArray(parsed.sales) ? parsed.sales : INITIAL_SALES,
            Array.isArray(parsed.stockAdjustments) ? parsed.stockAdjustments : [],
            parsed.shopSettings ? parsed.shopSettings : undefined
          );
          alert('ဒေတာများ အောင်မြင်စွာ ပြန်လည်သွင်းယူပြီးပါပြီ! (Data Restored Successfully!)');
        } else {
          alert('ဖိုင်ဖော်မတ် မမှန်ကန်ပါ (Invalid Backup File)');
        }
      } catch (err) {
        alert('ဖိုင်ဖတ်၍ မရပါ');
        console.error(err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleLoad100Suppliers = () => {
    if (confirm('စမ်းသပ်ရန် ကုန်ကြမ်းပေးသွင်းသူ ၁၀၀ ဦး စာရင်းကို ထည့်သွင်းလိုပါသလား?')) {
      const generated = generate100SampleSuppliers();
      onRestoreData(products, generated, transactions, merchants, sales, stockAdjustments, shopSettings);
      alert(`ကုန်ကြမ်းပေးသွင်းသူ ၁၀၀ ဦး စာရင်း အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ!`);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('မူလနမူနာ ဒေတာများအတိုင်း အစမှ ပြန်လည်သတ်မှတ်လိုပါသလား?')) {
      onRestoreData(DEFAULT_PRODUCTS, INITIAL_SUPPLIERS, INITIAL_TRANSACTIONS, INITIAL_MERCHANTS, INITIAL_SALES, [], DEFAULT_SHOP_SETTINGS);
      alert('မူလနမူနာဒေတာများ အောင်မြင်စွာ ပြန်လည်သတ်မှတ်ပြီးပါပြီ');
    }
  };

  const handleClearAll = () => {
    if (onOpenClearDataModal) {
      onOpenClearDataModal();
    } else {
      if (confirm('ဒေတာအားလုံးကို အပြီးတိုင် ရှင်းထုတ်လိုပါသလား? (သတိပေးချက်: ပြန်လည်ရယူနိုင်မည် မဟုတ်ပါ)')) {
        onRestoreData(DEFAULT_PRODUCTS, [], [], [], [], []);
        alert('ဒေတာများအားလုံး ရှင်းလင်းပြီးပါပြီ');
      }
    }
  };

  const inventoryStock = computeAllProductsStock(products || [], transactions || [], sales || [], stockAdjustments || []);

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg space-y-2 border border-slate-800">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">
            စနစ်ဆက်တင်များနှင့် ဒေတာသိမ်းဆည်းမှု (Settings & Backup)
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          ဒေတာများ အရန်သိမ်းဆည်းခြင်း၊ အော့ဖ်လိုင်းအသုံးပြုမှု၊ Password Key Reset နှင့် လုံခြုံရေးထိန်းချုပ်ခြင်း
        </p>
      </div>

      {/* Business Profile Management Card */}
      <div className="bg-white rounded-xl p-4 border border-amber-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <Logo
              size="md"
              className="w-12 h-12 rounded-xl border border-amber-400/40 shadow-xs shrink-0"
              alt={shopSettings?.shopName || 'ရွှေလက်ရာ'}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  လုပ်ငန်းအချက်အလက်
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                {shopSettings?.shopName || 'ရွှေလက်ရာ'}
              </h3>
              <p className="text-xs text-slate-500">
                {shopSettings?.tagline || 'မြန်မာ့လက်မှု ယွန်းထည်နှင့် ဝါးနှီးလုပ်ငန်း'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenEditShopProfile}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>ဆိုင်အမည်နှင့် လိပ်စာပြင်မည်</span>
          </button>
        </div>

        {(shopSettings?.phone || shopSettings?.address || shopSettings?.ownerName) && (
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
            {shopSettings?.ownerName && (
              <div>
                <span className="text-[10px] text-slate-400 block">ပိုင်ရှင်:</span>
                <span className="font-bold text-slate-800">{shopSettings.ownerName}</span>
              </div>
            )}
            {shopSettings?.phone && (
              <div>
                <span className="text-[10px] text-slate-400 block">ဖုန်း:</span>
                <span className="font-bold text-slate-800">{shopSettings.phone}</span>
              </div>
            )}
            {shopSettings?.address && (
              <div>
                <span className="text-[10px] text-slate-400 block">လိပ်စာ:</span>
                <span className="font-bold text-slate-800">{shopSettings.address}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= APP LOCK & PASSWORD KEY RESET CARD ================= */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-amber-300 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                appLockSettings?.enabled ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {appLockSettings?.enabled ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  App လုံခြုံရေး Password / PIN စနစ်
                </h3>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    appLockSettings?.enabled
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {appLockSettings?.enabled ? 'Lock ဖွင့်ထားသည် (Active)' : 'Lock ပိတ်ထားသည် (Open)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ခွင့်ပြုချက်မရှိဘဲ စာရင်းမကြည့်နိုင်စေရန် PIN နံပါတ် နှင့် Password Reset Recovery စနစ်
              </p>
            </div>
          </div>
        </div>

        {/* Toggle Lock and Change PIN row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/60 p-3 rounded-xl text-xs border border-amber-200">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
            <input
              type="checkbox"
              checked={appLockSettings?.enabled ?? false}
              onChange={(e) =>
                onUpdateAppLockSettings?.({
                  ...(appLockSettings || {
                    enabled: false,
                    pin: '1234',
                    passcode: '1234',
                    recoveryKey: currentRecoveryKey,
                  }),
                  enabled: e.target.checked,
                  recoveryKey: currentRecoveryKey,
                })
              }
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
            <span>App ဖွင့်တိုင်း Password / PIN တောင်းမည်</span>
          </label>

          <div className="flex items-center gap-2">
            {editingPin ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">PIN အသစ်:</span>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="w-20 px-2 py-1 bg-white border border-amber-300 rounded-lg text-center font-extrabold text-sm tracking-widest text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newPin.length < 4) {
                      alert('PIN သည် အနည်းဆုံး ၄ လုံး ရှိရပါမည်');
                      return;
                    }
                    onUpdateAppLockSettings?.({
                      ...(appLockSettings || { enabled: true, pin: '1234', passcode: '1234', recoveryKey: currentRecoveryKey }),
                      pin: newPin,
                      passcode: newPin,
                      enabled: true,
                      recoveryKey: currentRecoveryKey,
                    });
                    setEditingPin(false);
                    alert('PIN အသစ် ပြောင်းလဲပြီးပါပြီ!');
                  }}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  သိမ်းမည်
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPin(false)}
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer"
                >
                  ပယ်ဖျက်
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">လက်ရှိ PIN: ****</span>
                <button
                  type="button"
                  onClick={() => {
                    setNewPin(appLockSettings?.passcode ?? appLockSettings?.pin ?? '1234');
                    setEditingPin(true);
                  }}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold rounded-lg cursor-pointer transition-colors"
                >
                  PIN ပြောင်းမည်
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PASSWORD KEY RESET & RECOVERY OPTION SECTION */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-bold text-xs text-slate-900">
                Password Recovery Key (စကားဝှက် ပြန်လည်ရယူရေးကီး)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsKeyResetOpen(!isKeyResetOpen)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                {isKeyResetOpen ? 'Reset ပိတ်မည်' : 'Password Key Reset ပြုလုပ်မည်'}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            အကယ်၍ PIN စကားဝှက် မေ့သွားပါက ဤ <strong>Recovery Key</strong> ဖြင့် ချက်ချင်း ပြန်လည်ဖွင့်လှစ်ခြင်း သို့မဟုတ် စကားဝှက်အသစ် Reset ပြုလုပ်နိုင်ပါသည်။
          </p>

          {/* Recovery Key Display with Copy button */}
          <div className="p-3 bg-white border border-slate-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xs text-slate-500 font-medium shrink-0">Recovery Key:</span>
              <span className="font-mono text-sm sm:text-base font-extrabold text-amber-600 tracking-wider">
                {showRecoveryKey ? currentRecoveryKey : '••••-••••-••••'}
              </span>
              <button
                type="button"
                onClick={() => setShowRecoveryKey(!showRecoveryKey)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                title={showRecoveryKey ? 'ကီးကို ဝှက်မည်' : 'ကီးကို ပြမည်'}
              >
                {showRecoveryKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleCopyRecoveryKey}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Recovery Key ကူးယူမည်"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'ကူးယူပြီး' : 'Copy Key'}</span>
              </button>

              <button
                type="button"
                onClick={handleRegenerateKey}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Recovery Key အသစ်ထုတ်ယူမည်"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Key အသစ်ထုတ်မည်</span>
              </button>
            </div>
          </div>

          {/* Password Key Reset Form Inline Drawer */}
          {isKeyResetOpen && (
            <form
              onSubmit={handleDirectKeyResetSubmit}
              className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-xl space-y-3 text-xs animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Recovery Key ဖြင့် PIN စကားဝှက် Reset ပြုလုပ်ခြင်း</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsKeyResetOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  ပိတ်မည်
                </button>
              </div>

              {resetError && (
                <div className="p-2.5 bg-rose-100 border border-rose-300 text-rose-800 rounded-lg font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSuccess && (
                <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{resetSuccess}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">
                  Recovery Key ရိုက်ထည့်ပါ *
                </label>
                <input
                  type="text"
                  required
                  placeholder={`ဥပမာ - ${currentRecoveryKey}`}
                  value={resetKeyInput}
                  onChange={(e) => setResetKeyInput(e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-mono font-bold text-xs uppercase"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold">PIN အသစ် (၄~၆ လုံး) *</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="PIN အသစ်"
                    value={resetNewPin}
                    onChange={(e) => setResetNewPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-center font-bold text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold">PIN အသစ် ထပ်ရိုက်ပါ *</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="PIN ထပ်ရိုက်ပါ"
                    value={resetConfirmPin}
                    onChange={(e) => setResetConfirmPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-center font-bold text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsKeyResetOpen(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  မလုပ်တော့ပါ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                >
                  PIN အသစ် အတည်ပြုမည်
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Multi-Device Hotspot Sync & Zapya Offline Transfer Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 border border-indigo-900 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-900/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  ဖုန်းအချင်းချင်း ဒေတာကူးပြောင်းခြင်း (Multi-Phone Hotspot Sync)
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Wifi / Hotspot
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                အင်တာနက်မရှိချိန် ဖုန်းအချင်းချင်း Hotspot ဖွင့်ပြီး ဒေတာများကို တိုက်ရိုက် ပေါင်းစပ်နိုင်ပါသည်
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/10 hover:bg-white/15 p-3.5 rounded-xl border border-indigo-400/20 flex flex-col justify-between space-y-3 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs text-white">Hotspot / WiFi ဖြင့် Sync ပြုလုပ်မည်</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                ဖုန်းနှစ်လုံး Hotspot ချိတ်ဆက်ပြီး QR Code / ကုတ်နံပါတ်ဖြင့် အပြန်အလှန် ဒေတာဖလှယ်မည်
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenSyncModal}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
            >
              <Radio className="w-4 h-4" />
              <span>Hotspot Sync ဖွင့်မည်</span>
            </button>
          </div>

          <div className="bg-white/10 hover:bg-white/15 p-3.5 rounded-xl border border-purple-400/20 flex flex-col justify-between space-y-3 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-xs text-white">Zapya / Bluetooth ဖြင့် App တစ်ခုလုံးပို့မည်</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                App တစ်ခုလုံးကို HTML ဖိုင်အဖြစ် Zapya / Xender မှတစ်ဆင့် အခြားဖုန်းသို့ ပေးပို့နိုင်သည်
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenZapyaModal}
              className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Zapya မျှဝေမည်</span>
            </button>
          </div>
        </div>
      </div>

      {/* Time-stamped AutoRecovery Snapshots List Card */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  အလိုအလျောက် သိမ်းဆည်းမှတ်တမ်းများ (Time-stamped Snapshots)
                </h3>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  {snapshots.length} ခု
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                အရောင်း၊ ကုန်သိမ်းမှု ပြုလုပ်တိုင်း အလိုအလျောက် သီးခြား Snapshot မှတ်တမ်းယူပေးထားပါသည်
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="အကြောင်းပြချက် (ရွေးချယ်ရန်)..."
              value={snapshotReason}
              onChange={(e) => setSnapshotReason(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg w-40 sm:w-48 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                onTakeSnapshotNow?.(snapshotReason || 'ကိုယ်တိုင် မှတ်တမ်းယူ (Manual Snapshot)');
                setSnapshotReason('');
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              <span>Snapshot ယူမည်</span>
            </button>
          </div>
        </div>

        {snapshots.length === 0 ? (
          <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
            အရောင်း သို့မဟုတ် ကုန်သိမ်းပြီးပါက Snapshot များ အလိုအလျောက် ဤနေရာတွင် ပေါ်လာပါမည်
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {snapshots.slice(0, 8).map((snap) => (
              <div
                key={snap.id}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{snap.reason}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                      {snap.date} {snap.time}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap gap-x-2">
                    <span>ပစ္စည်း: {snap.recordCounts.products}</span>
                    <span>•</span>
                    <span>ရက်လုပ်သူ: {snap.recordCounts.suppliers}</span>
                    <span>•</span>
                    <span>ကုန်သည်: {snap.recordCounts.merchants}</span>
                    <span>•</span>
                    <span>ကုန်သိမ်း: {snap.recordCounts.transactions}</span>
                    <span>•</span>
                    <span>အရောင်း: {snap.recordCounts.sales}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        `"${snap.date} ${snap.time}" မှတ်တမ်းသို့ ဒေတာအားလုံး ပြန်လည်ပြောင်းလဲယူလိုပါသလား?`
                      )
                    ) {
                      onRestoreSnapshot?.(snap);
                    }
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-blue-700 font-bold border border-blue-300 rounded-lg cursor-pointer transition-colors shrink-0 flex items-center gap-1 shadow-2xs self-end sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ပြန်ယူမည်</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily Backup Reminder Settings Card */}
      <div className="bg-white rounded-xl p-4 border border-emerald-300 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  နေ့စဥ် ပုံမှန် Data Backup သတိပေးချက်
                </h3>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    backupReminderSettings?.enabled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {backupReminderSettings?.enabled ? 'ဖွင့်ထားသည် (Active)' : 'ပိတ်ထားသည် (Off)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                သတ်မှတ်ချိန်ရောက်တိုင်း ဖုန်းတွင် အလိုအလျောက် သတိပေးပြီး Pop-up Box ဖြင့် Backup ယူစေမည်
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenBackupReminderModal}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <BellRing className="w-4 h-4 text-emerald-600" />
              <span>သတိပေးချက် စမ်းသပ်မည် (Test Alert)</span>
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/50 p-3 rounded-lg text-xs">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={backupReminderSettings?.enabled ?? true}
                onChange={(e) =>
                  onUpdateBackupReminderSettings?.({
                    ...(backupReminderSettings || {
                      enabled: true,
                      reminderTime: '17:30',
                    }),
                    enabled: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>နေ့စဥ် Backup သတိပေးချက် ဖွင့်မည်</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>သတိပေးချိန်:</span>
            </span>
            <input
              type="time"
              value={backupReminderSettings?.reminderTime || '17:30'}
              onChange={(e) =>
                onUpdateBackupReminderSettings?.({
                  ...(backupReminderSettings || {
                    enabled: true,
                    reminderTime: '17:30',
                  }),
                  reminderTime: e.target.value,
                  lastDismissedDate: '',
                })
              }
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg font-bold text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-500">(ညနေပိုင်း အကြံပြု)</span>
          </div>
        </div>
      </div>

      {/* Deleted Records History (Recycle Bin) Card */}
      <div className="bg-white rounded-xl p-4 border border-rose-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-600 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  ဖျက်လိုက်သော မှတ်တမ်းဟောင်းများ (Deleted Records History & Recycle Bin)
                </h3>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  {deletedRecordsCount} ခု
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                မှားဖျက်မိပါက အချိန်မရွေး ပြန်လည်ရယူနိုင်ပြီး ဖျက်ခဲ့သမျှ မှတ်တမ်းအားလုံးကို Excel ဖြင့် ထုတ်ယူနိုင်ပါသည်
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenDeletedHistory}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0"
          >
            <History className="w-4 h-4" />
            <span>အမှိုက်ပုံးကြည့်မည် ({deletedRecordsCount})</span>
          </button>
        </div>
      </div>

      {/* Offline Ready Status Banner */}
      <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-emerald-950">
            အင်တာနက်မလိုဘဲ ရာနှုန်းပြည့် အသုံးပြုနိုင်ပါသည် (Offline Ready)
          </h3>
          <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
            ဒေတာအားလုံးသည် သင့်စက်ပစ္စည်း (Device Storage) ပေါ်တွင်သာ လုံခြုံစွာ တည်ရှိနေပြီး အင်တာနက်လိုင်းမရှိဘဲ စာရင်းအကုန် ရေးသွင်း၊ ပြင်ဆင်၊ ပုံနှိပ်နိုင်ပါသည်။
          </p>
        </div>
      </div>

      {/* Data Backup & Restore Cards */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>ဒေတာ အရန်သိမ်းခြင်းနှင့် ပြန်လည်သွင်းယူခြင်း (Backup & Restore)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border-2 border-blue-200 bg-blue-50/50 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">အပြည့်အစုံ Backup ထုတ်ယူမည်</span>
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold">အကြံပြုချက်</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                လက်ရှိ စာရင်းသွင်းထားသော ရက်လုပ်သူ {suppliers.length} ဦး၊ ကုန်သည် {merchants.length} ဦး၊ ကုန်ပစ္စည်း {products.length} မျိုး၊ ဘောင်ချာ {transactions.length + sales.length} စောင် အားလုံးကို မိမိနှစ်သက်ရာ Folder / Drive တွင် သိမ်းဆည်းမည်
              </p>
            </div>
            <button
              type="button"
              id="download-backup-btn"
              onClick={handleBackup}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              <span>နေရာရွေးပြီး Backup သိမ်းမည် (Save As...)</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 block">ဒေတာများ ပြန်သွင်းမည် (Restore)</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                ယခင်သိမ်းဆည်းထားသော .json Backup ဖိုင်ကို ရွေးချယ်ပြီး လက်ရှိစက်ထဲသို့ အစားထိုး ထည့်သွင်းမည်
              </p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              <button
                type="button"
                id="restore-backup-btn"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-slate-600" />
                <span>Backup ဖိုင် ရွေးမည်</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Excel Exports */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Excel / CSV ဖိုင်များ ခွဲခြားထုတ်ယူရန်</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => exportSuppliersCSV(suppliers)}
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>ရက်လုပ်သူစာရင်း</span>
            </div>
            <span className="text-[11px] text-slate-500 block">Suppliers ({suppliers.length} ဦး)</span>
          </button>

          <button
            type="button"
            onClick={() => exportMerchantsCSV(merchants)}
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>ကုန်သည်အရောင်းစာရင်း</span>
            </div>
            <span className="text-[11px] text-slate-500 block">Merchants ({merchants.length} ဦး)</span>
          </button>

          <button
            type="button"
            onClick={() => exportInventoryCSV(inventoryStock)}
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
              <Package className="w-4 h-4 text-amber-600" />
              <span>ကုန်ပစ္စည်းလက်ကျန်</span>
            </div>
            <span className="text-[11px] text-slate-500 block">Inventory ({inventoryStock.length} မျိုး)</span>
          </button>

          <button
            type="button"
            onClick={() => exportSalesHistoryCSV(sales)}
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
              <Download className="w-4 h-4 text-purple-600" />
              <span>အရောင်းဘောင်ချာများ</span>
            </div>
            <span className="text-[11px] text-slate-500 block">Sales ({sales.length} စောင်)</span>
          </button>
        </div>
      </div>

      {/* Advanced Quick Seed & Reset Tools */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
          <RefreshCw className="w-4 h-4 text-slate-600" />
          <span>အဆင့်မြင့် စီမံခန့်ခွဲမှုနှင့် အစမ်းဒေတာများ</span>
        </h3>

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 gap-2">
            <div>
              <span className="font-bold text-xs text-slate-900 block">
                ကုန်ကြမ်းပေးသွင်းသူ ၁၀၀ ဦး စမ်းသပ်ဒေတာ ထည့်သွင်းမည်
              </span>
              <span className="text-[11px] text-slate-500">
                ရွာအစုံမှ ရက်လုပ်သူ ၁၀၀ ဦး နှင့် အကြိုငွေစာရင်းများ ထည့်သွင်းစမ်းသပ်ရန်
              </span>
            </div>
            <button
              type="button"
              id="seed-100-suppliers-btn"
              onClick={handleLoad100Suppliers}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>၁၀၀ ဦး ထည့်မည်</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 gap-2">
            <div>
              <span className="font-bold text-xs text-slate-900 block">မူလနမူနာဒေတာများ ပြန်လည်သတ်မှတ်မည်</span>
              <span className="text-[11px] text-slate-500">
                စနစ်စတင်ချိန်က မူလနမူနာစာရင်းများအတိုင်း ပြန်လည်စတင်ရန်
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-lg cursor-pointer transition-colors shrink-0"
            >
              မူလအတိုင်းပြန်ထား
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-rose-50 border border-rose-200 gap-2">
            <div>
              <span className="font-bold text-xs text-rose-950 block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                ဒေတာအားလုံး ရှင်းထုတ်မည် (Clear All Data)
              </span>
              <span className="text-[11px] text-rose-700">
                လက်ရှိ စာရင်းအားလုံးကို ဖျက်ပြီး စာရင်းအသစ်စတင်ရန် (Snapshot အရန်သိမ်းပေးပါသည်)
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shrink-0"
            >
              ဒေတာရှင်းထုတ်မည်
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
