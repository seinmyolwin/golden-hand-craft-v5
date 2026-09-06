import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Wifi,
  WifiOff,
  PackageCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Edit3,
  Trash2,
  Share2,
  Radio,
  Lock,
  ShoppingBag,
  Bell,
  BookOpen,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { ShopSettings } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onOpenNewSupplierCollection?: () => void;
  onOpenNewMerchantSale?: () => void;
  onOpenNewEntry?: () => void;
  onOpenNewSale?: () => void;
  todayInboundCount?: number;
  todaySalesCount?: number;
  shopSettings?: ShopSettings;
  onOpenEditShopProfile?: () => void;
  onOpenEditProfile?: () => void;
  deletedHistoryCount?: number;
  onOpenDeletedHistory?: () => void;
  onOpenAuditLogs?: () => void;
  onOpenSyncModal?: () => void;
  onOpenLocalSync?: () => void;
  onOpenZapyaModal?: () => void;
  onOpenZapya?: () => void;
  onOpenBackup?: () => void;
  onOpenClearData?: () => void;
  onLockApp?: () => void;
  isAppLocked?: boolean;
  appLockEnabled?: boolean;
  onOpenAppLockSettings?: () => void;
  onNavigateToOrders?: () => void;
  onOpenOrderNotification?: () => void;
  pendingOrdersCount?: number;
  onOpenUserGuide?: () => void;
  onOpenZeroSettings?: () => void;
  lowStockCount?: number;
  onOpenLowStockAlert?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  onDateChange,
  onOpenNewSupplierCollection,
  onOpenNewMerchantSale,
  onOpenNewEntry,
  onOpenNewSale,
  todayInboundCount = 0,
  todaySalesCount = 0,
  shopSettings,
  onOpenEditShopProfile,
  onOpenEditProfile,
  deletedHistoryCount = 0,
  onOpenDeletedHistory,
  onOpenAuditLogs,
  onOpenSyncModal,
  onOpenLocalSync,
  onOpenZapyaModal,
  onOpenZapya,
  onOpenBackup,
  onOpenClearData,
  onLockApp,
  isAppLocked,
  appLockEnabled,
  onOpenAppLockSettings,
  onNavigateToOrders,
  onOpenOrderNotification,
  pendingOrdersCount = 0,
  onOpenUserGuide,
  onOpenZeroSettings,
  lowStockCount = 0,
  onOpenLowStockAlert,
}) => {
  const handleOpenEntry = onOpenNewEntry || onOpenNewSupplierCollection;
  const handleOpenSale = onOpenNewSale || onOpenNewMerchantSale;
  const handleEditProfile = onOpenEditProfile || onOpenEditShopProfile;
  const handleOpenTrash = onOpenAuditLogs || onOpenDeletedHistory;
  const handleSync = onOpenLocalSync || onOpenSyncModal;
  const handleZapya = onOpenZapya || onOpenZapyaModal;
  const shopName = shopSettings?.shopName || 'ရွှေလက်ရာ';
  const tagline = shopSettings?.tagline || 'မြန်မာ့လက်မှု ယွန်းထည်နှင့် ဝါးနှီးလုပ်ငန်း';
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-emerald-700 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-6xl mx-auto px-3.5 py-2.5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Brand & Status */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Logo
              size="md"
              className="w-10 h-10 rounded-xl border border-amber-400/40 shadow-xs cursor-pointer hover:border-amber-300 transition-colors"
              onClick={handleEditProfile}
              alt={shopName}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEditProfile}
                  className="text-base sm:text-lg font-bold text-white tracking-tight truncate hover:text-emerald-100 flex items-center gap-1.5 cursor-pointer text-left group"
                  title="ဆိုင်အမည်နှင့် ပိုင်ရှင် ပြင်ဆင်မည်"
                >
                  <span>{shopName}</span>
                  {shopSettings?.ownerName && (
                    <span className="text-xs text-amber-200 font-medium bg-emerald-900/70 px-1.5 py-0.5 rounded border border-emerald-500/40">
                      ({shopSettings.ownerName})
                    </span>
                  )}
                  <Edit3 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-emerald-200 transition-opacity shrink-0" />
                </button>
                {isOnline ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-emerald-850/80 text-emerald-100 border border-emerald-400/40 shrink-0" title="အွန်လိုင်းချိတ်ဆက်ထားသည်">
                    <Wifi className="w-3 h-3 text-emerald-300" />
                    <span className="hidden xs:inline">Online</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-rose-800/90 text-rose-100 border border-rose-400/40 shrink-0" title="အော့ဖ်လိုင်းအသုံးပြုနေသည်">
                    <WifiOff className="w-3 h-3 text-rose-300" />
                    <span className="hidden xs:inline">Offline</span>
                  </span>
                )}
              </div>
              <p className="text-[12px] text-emerald-100/80 truncate">
                {tagline}
              </p>
            </div>
          </div>

          {/* Actions: Date Picker & Quick Entry Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto flex-wrap">
            <div className="relative flex items-center bg-emerald-800/80 border border-emerald-500/60 rounded-lg px-2 py-1 text-xs text-white">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-200 shrink-0" />
              <input
                id="header-date-input"
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
              />
            </div>

            {/* Quick Inbound Button */}
            {handleOpenEntry && (
              <button
                id="header-new-inbound-btn"
                type="button"
                onClick={handleOpenEntry}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-800 font-bold text-xs rounded-lg shadow-sm transition-all duration-150 cursor-pointer"
                title="ကုန်သိမ်းအသစ် ရေးသွင်းမည်"
              >
                <ArrowDownLeft className="w-3.5 h-3.5 stroke-[3] text-emerald-700" />
                <span className="whitespace-nowrap">+ ကုန်သိမ်း</span>
                {todayInboundCount > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 px-1 py-0.1 rounded-full text-[10px] font-bold">
                    {todayInboundCount}
                  </span>
                )}
              </button>
            )}

            {/* Quick Outbound Sale Button */}
            {handleOpenSale && (
              <button
                id="header-new-sale-btn"
                type="button"
                onClick={handleOpenSale}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs rounded-lg shadow-sm transition-all duration-150 cursor-pointer border border-blue-400/40"
                title="ကုန်သည်အရောင်းအသစ် ရေးသွင်းမည်"
              >
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[3] text-white" />
                <span className="whitespace-nowrap">+ အရောင်း</span>
                {todaySalesCount > 0 && (
                  <span className="bg-blue-900 text-blue-100 px-1 py-0.1 rounded-full text-[10px] font-bold">
                    {todaySalesCount}
                  </span>
                )}
              </button>
            )}

            {/* Low Stock Alert Button */}
            {lowStockCount > 0 && onOpenLowStockAlert && (
              <button
                id="header-low-stock-alert-btn"
                type="button"
                onClick={onOpenLowStockAlert}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md ring-2 ring-amber-300/80 animate-bounce cursor-pointer transition-all"
                title={`ကုန်ပစ္စည်း (${lowStockCount}) မျိုး အနည်းဆုံးလက်ကျန်ထက် လျော့နည်းနေပါသည်!`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 stroke-[3]" />
                <span className="whitespace-nowrap">ပစ္စည်းလို ({lowStockCount})</span>
              </button>
            )}

            {/* Notification Bell for Pending Orders */}
            <button
              id="header-orders-notification-bell-btn"
              type="button"
              onClick={onOpenOrderNotification || onNavigateToOrders}
              className={`relative p-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                pendingOrdersCount > 0
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md ring-2 ring-amber-300/80 animate-pulse'
                  : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 border border-emerald-500/40'
              }`}
              title={
                pendingOrdersCount > 0
                  ? `အော်ဒါအသစ် (${pendingOrdersCount}) စောင် စောင့်ဆိုင်းနေပါသည်`
                  : 'အော်ဒါမှတ်တမ်း'
              }
            >
              <Bell className="w-3.5 h-3.5 stroke-[2.5]" />
              {pendingOrdersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-black rounded-full shadow-xs border border-white">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            {/* Start App / Zero Settings Button */}
            {onOpenZeroSettings && (
              <button
                id="header-zero-start-btn"
                type="button"
                onClick={onOpenZeroSettings}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-black bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 shadow-xs border border-amber-300 cursor-pointer transition-all"
                title="အက်ပ်ကို လက်တွေ့ စတင်အသုံးပြုမည် (လက်ကျန်အားလုံး 0 သုည သတ်မှတ်ချက်)"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span className="whitespace-nowrap">စတင်အသုံးပြုမည်</span>
              </button>
            )}

            {/* User Guide Button */}
            {onOpenUserGuide && (
              <button
                id="header-guide-btn"
                type="button"
                onClick={onOpenUserGuide}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 border border-emerald-400/50 shadow-xs cursor-pointer transition-all"
                title="အက်ပ်အသုံးပြုနည်း လမ်းညွှန် ဖတ်ရှုမည်"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden sm:inline whitespace-nowrap">လမ်းညွှန်</span>
              </button>
            )}

            {/* WiFi / Hotspot Sync Button */}
            {handleSync && (
              <button
                id="header-sync-btn"
                type="button"
                onClick={handleSync}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 border border-emerald-400/50 cursor-pointer shadow-sm transition-all"
                title="WiFi / Hotspot ဒေတာ Sync"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span className="hidden md:inline whitespace-nowrap">Sync</span>
              </button>
            )}

            {/* Zapya Transfer Button */}
            {handleZapya && (
              <button
                id="header-zapya-btn"
                type="button"
                onClick={handleZapya}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-purple-800/90 hover:bg-purple-700 text-purple-100 border border-purple-400/50 cursor-pointer shadow-sm transition-all"
                title="Zapya / Bluetooth ဖြင့် App တစ်ခုလုံးပို့မည်"
              >
                <Share2 className="w-3.5 h-3.5 text-purple-200" />
                <span className="hidden lg:inline whitespace-nowrap">Zapya</span>
              </button>
            )}

            {/* Lock App / Security Settings Button */}
            {(onLockApp || onOpenAppLockSettings) && (
              <button
                id="header-lock-app-btn"
                type="button"
                onClick={onLockApp || onOpenAppLockSettings}
                className="flex items-center gap-1 p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600 cursor-pointer shadow-sm transition-all"
                title="လုံခြုံရေး App မျက်နှာပြင် Lock ချမည် / စကားဝှက် ဆက်တင်"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden xl:inline">{appLockEnabled ? 'Locked' : 'Lock'}</span>
              </button>
            )}

            {/* Quick Recycle Bin / Deleted Records Button */}
            {handleOpenTrash && (
              <button
                id="header-deleted-history-btn"
                type="button"
                onClick={handleOpenTrash}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer border shadow-sm ${
                  deletedHistoryCount > 0
                    ? 'bg-rose-700 hover:bg-rose-600 text-white border-rose-400/50 animate-pulse'
                    : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border-emerald-500/50'
                }`}
                title={`ဖျက်ထားသောမှတ်တမ်းများ (Recycle Bin) ကြည့်မည် - ${deletedHistoryCount} ခု`}
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-200" />
                <span className="hidden sm:inline whitespace-nowrap">အမှိုက်ပုံး</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  deletedHistoryCount > 0 ? 'bg-white text-rose-700' : 'bg-emerald-900/90 text-emerald-200'
                }`}>
                  {deletedHistoryCount}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
