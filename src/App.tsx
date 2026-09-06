import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Supplier,
  Product,
  TransactionRecord,
  SaleRecord,
  Merchant,
  MerchantOrder,
  PeerTradeRecord,
  ShopSettings,
  AuditLogEntry,
  SoftDeletedItem,
  AppLockSettings,
  TabType,
  ActiveTab,
  StockAdjustmentRecord,
  BackupReminderSettings,
  AutoRecoverySnapshot,
  OrderStatus,
} from './types';
import {
  loadSuppliers,
  saveSuppliers,
  loadMerchants,
  saveMerchants,
  loadProducts,
  saveProducts,
  loadTransactions,
  saveTransactions,
  loadSales,
  saveSales,
  loadOrders,
  saveOrders,
  loadPeerTrades,
  savePeerTrades,
  loadShopSettings,
  saveShopSettings,
  loadAuditLogs,
  saveAuditLogs,
  loadDeletedItems,
  saveDeletedItems,
  loadAppLockSettings,
  saveAppLockSettings,
  getStoredStockAdjustments,
  saveStoredStockAdjustments,
  getStoredBackupReminderSettings,
  saveStoredBackupReminderSettings,
  getStoredRecoverySnapshots,
  createAutoRecoverySnapshot,
  getTodayDateString,
  getCurrentTimeString,
} from './utils/storage';

// UI Components
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DailyPickupTab } from './components/DailyPickupTab';
import { MerchantSalesTab } from './components/MerchantSalesTab';
import { MerchantOrdersTab } from './components/MerchantOrdersTab';
import { PeerTradingTab } from './components/PeerTradingTab';
import { InventoryTab } from './components/InventoryTab';
import { SuppliersTab } from './components/SuppliersTab';
import { MerchantsTab } from './components/MerchantsTab';
import { ProductsTab } from './components/ProductsTab';
import { UnifiedHistoryTab } from './components/UnifiedHistoryTab';
import { ReportsTab } from './components/ReportsTab';
import { SettingsBackupTab } from './components/SettingsBackupTab';

// Security & Lock Screen
import { AppLockScreen } from './components/AppLockScreen';
import { AppLockSettingsModal } from './components/AppLockSettingsModal';

// Modals
import { NewEntryModal } from './components/NewEntryModal';
import { NewSaleModal } from './components/NewSaleModal';
import { VoucherModal } from './components/VoucherModal';
import { SaleVoucherModal } from './components/SaleVoucherModal';
import { SupplierLedgerModal } from './components/SupplierLedgerModal';
import { EditShopProfileModal } from './components/EditShopProfileModal';
import { BackupSaveModal } from './components/BackupSaveModal';
import { DeletedHistoryModal } from './components/DeletedHistoryModal';
import { ClearDataModal } from './components/ClearDataModal';
import { BackupReminderModal } from './components/BackupReminderModal';
import { NewOrderNotificationModal } from './components/NewOrderNotificationModal';
import { ActionVoucherPromptModal } from './components/ActionVoucherPromptModal';
import { LocalSyncModal } from './components/LocalSyncModal';
import { ZapyaTransferModal } from './components/ZapyaTransferModal';
import { UserGuideModal } from './components/UserGuideModal';
import { ZeroSettingsConfirmModal } from './components/ZeroSettingsConfirmModal';
import { LowStockAlertModal } from './components/LowStockAlertModal';
import { getCleanZeroData, getFullDemoData } from './data/sampleDemoData';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  // Main Navigation & Date State
  const [activeTab, setActiveTab] = useState<TabType>('daily');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  // Core Data States
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const isZeroed = typeof window !== 'undefined' && localStorage.getItem('ledger_zero_settings_activated') === 'true';
    const loaded = loadSuppliers();
    if (!isZeroed && (!loaded || loaded.length === 0 || loaded.every((s) => s.totalGoodsValueDelivered === 0 && s.currentAdvanceBalance === 0))) {
      return getFullDemoData().suppliers;
    }
    return loaded;
  });
  const [merchants, setMerchants] = useState<Merchant[]>(() => {
    const isZeroed = typeof window !== 'undefined' && localStorage.getItem('ledger_zero_settings_activated') === 'true';
    const loaded = loadMerchants();
    if (!isZeroed && (!loaded || loaded.length === 0 || loaded.every((m) => m.totalPurchasesValue === 0 && m.currentReceivableBalance === 0))) {
      return getFullDemoData().merchants;
    }
    return loaded;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const isZeroed = typeof window !== 'undefined' && localStorage.getItem('ledger_zero_settings_activated') === 'true';
    const loaded = loadProducts();
    if (!isZeroed && (!loaded || loaded.length === 0 || loaded.every((p) => (p.currentStock || 0) === 0))) {
      return getFullDemoData().products;
    }
    return loaded;
  });
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const isZeroed = typeof window !== 'undefined' && localStorage.getItem('ledger_zero_settings_activated') === 'true';
    const loaded = loadTransactions();
    if (!isZeroed && (!loaded || loaded.length === 0)) {
      return getFullDemoData().transactions;
    }
    return loaded;
  });
  const [sales, setSales] = useState<SaleRecord[]>(() => {
    const isZeroed = typeof window !== 'undefined' && localStorage.getItem('ledger_zero_settings_activated') === 'true';
    const loaded = loadSales();
    if (!isZeroed && (!loaded || loaded.length === 0)) {
      return getFullDemoData().sales;
    }
    return loaded;
  });
  const [orders, setOrders] = useState<MerchantOrder[]>(() => {
    const isZeroed = typeof window !== 'undefined' && localStorage.getItem('ledger_zero_settings_activated') === 'true';
    const loaded = loadOrders();
    if (!isZeroed && (!loaded || loaded.length === 0)) {
      return getFullDemoData().orders;
    }
    return loaded;
  });
  const [peerTrades, setPeerTrades] = useState<PeerTradeRecord[]>(() => {
    const isZeroed = typeof window !== 'undefined' && localStorage.getItem('ledger_zero_settings_activated') === 'true';
    const loaded = loadPeerTrades();
    if (!isZeroed && (!loaded || loaded.length === 0)) {
      return getFullDemoData().peerTrades;
    }
    return loaded;
  });
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustmentRecord[]>(() => {
    const isZeroed = typeof window !== 'undefined' && localStorage.getItem('ledger_zero_settings_activated') === 'true';
    const loaded = getStoredStockAdjustments();
    if (!isZeroed && (!loaded || loaded.length === 0)) {
      return getFullDemoData().stockAdjustments;
    }
    return loaded;
  });
  const [backupReminderSettings, setBackupReminderSettings] = useState<BackupReminderSettings>(() => getStoredBackupReminderSettings());
  const [snapshots, setSnapshots] = useState<AutoRecoverySnapshot[]>(() => getStoredRecoverySnapshots());
  const [shopSettings, setShopSettings] = useState<ShopSettings>(() => loadShopSettings());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadAuditLogs());
  const [deletedItems, setDeletedItems] = useState<SoftDeletedItem[]>(() => loadDeletedItems());

  // Security Lock State
  const [appLockSettings, setAppLockSettings] = useState<AppLockSettings>(() => loadAppLockSettings());
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    const lock = loadAppLockSettings();
    return !lock.enabled;
  });

  // Modals visibility state
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState<boolean>(false);
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState<boolean>(false);
  const [initialEntrySupplierId, setInitialEntrySupplierId] = useState<string | undefined>(undefined);
  const [initialSaleMerchantId, setInitialSaleMerchantId] = useState<string | undefined>(undefined);

  const [activeVoucherTx, setActiveVoucherTx] = useState<TransactionRecord | null>(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState<boolean>(false);

  const [activeSaleVoucher, setActiveSaleVoucher] = useState<SaleRecord | null>(null);
  const [isSaleVoucherModalOpen, setIsSaleVoucherModalOpen] = useState<boolean>(false);

  const [ledgerSupplier, setLedgerSupplier] = useState<Supplier | null>(null);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState<boolean>(false);

  const [isShopProfileModalOpen, setIsShopProfileModalOpen] = useState<boolean>(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [isDeletedHistoryModalOpen, setIsDeletedHistoryModalOpen] = useState<boolean>(false);
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState<boolean>(false);
  const [isBackupReminderOpen, setIsBackupReminderOpen] = useState<boolean>(false);
  const [isLocalSyncModalOpen, setIsLocalSyncModalOpen] = useState<boolean>(false);
  const [isZapyaModalOpen, setIsZapyaModalOpen] = useState<boolean>(false);
  const [isAppLockSettingsOpen, setIsAppLockSettingsOpen] = useState<boolean>(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState<boolean>(false);
  const [isZeroResetModalOpen, setIsZeroResetModalOpen] = useState<boolean>(false);
  const [isLowStockAlertModalOpen, setIsLowStockAlertModalOpen] = useState<boolean>(false);

  // New Notification & Action Prompts
  const [notificationOrder, setNotificationOrder] = useState<MerchantOrder | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  const [actionPrompt, setActionPrompt] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'INBOUND' | 'OUTBOUND';
    item: TransactionRecord | SaleRecord | null;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'INBOUND',
    item: null,
  });

  // Persist State Changes
  useEffect(() => { saveSuppliers(suppliers); }, [suppliers]);
  useEffect(() => { saveMerchants(merchants); }, [merchants]);
  useEffect(() => { saveProducts(products); }, [products]);
  useEffect(() => { saveTransactions(transactions); }, [transactions]);
  useEffect(() => { saveSales(sales); }, [sales]);
  useEffect(() => { saveOrders(orders); }, [orders]);
  useEffect(() => { savePeerTrades(peerTrades); }, [peerTrades]);
  useEffect(() => { saveStoredStockAdjustments(stockAdjustments); }, [stockAdjustments]);
  useEffect(() => { saveStoredBackupReminderSettings(backupReminderSettings); }, [backupReminderSettings]);
  useEffect(() => { saveShopSettings(shopSettings); }, [shopSettings]);
  useEffect(() => { saveAuditLogs(auditLogs); }, [auditLogs]);
  useEffect(() => { saveDeletedItems(deletedItems); }, [deletedItems]);
  useEffect(() => { saveAppLockSettings(appLockSettings); }, [appLockSettings]);

  // Periodic Backup Reminder Check (shows once if transactions exist and no recent backup)
  useEffect(() => {
    const lastReminded = localStorage.getItem('last_backup_reminder_shown');
    const today = getTodayDateString();
    if (lastReminded !== today && transactions.length > 5) {
      const timer = setTimeout(() => {
        setIsBackupReminderOpen(true);
        localStorage.setItem('last_backup_reminder_shown', today);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [transactions.length]);

  // Audit Log Helper
  const logAction = useCallback((action: string, details: string, entityType?: string, entityId?: string) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      action,
      details,
      timestamp: `${getTodayDateString()} ${getCurrentTimeString()}`,
      entityType,
      entityId,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 199)]);
  }, []);

  // Inbound Collection (New Transaction)
  const handleSaveTransaction = useCallback((record: TransactionRecord) => {
    setTransactions((prev) => [record, ...prev]);

    // Update Supplier's Advance Balance
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id === record.supplierId) {
          return {
            ...s,
            currentAdvanceBalance: record.remainingAdvanceBalance,
            lastSettledDate: record.date,
          };
        }
        return s;
      })
    );

    logAction(
      'ကုန်သိမ်းစာရင်း ရေးသွင်းခြင်း',
      `${record.supplierName} ထံမှ ${record.items.length} မျိုး ကုန်သိမ်းခဲ့သည် (ဘောင်ချာ: ${record.voucherNo})`,
      'TRANSACTION',
      record.id
    );

    // Show prompt to view voucher
    setActionPrompt({
      isOpen: true,
      title: 'ကုန်သိမ်းစာရင်း အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ',
      message: `${record.supplierName} ထံမှ ကုန်သိမ်းငွေရှင်းပြေစာ (Voucher #${record.voucherNo}) ကို ယခု ကြည့်ရှုလိုပါသလား?`,
      type: 'INBOUND',
      item: record,
    });
  }, [logAction]);

  // Outbound Sales (New Sale)
  const handleSaveSale = useCallback((sale: SaleRecord) => {
    setSales((prev) => [sale, ...prev]);

    // Update Merchant's Receivable Debt
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id === sale.merchantId) {
          return {
            ...m,
            currentReceivableBalance: (m.currentReceivableBalance || 0) + sale.remainingReceivableBalance,
            lastPurchaseDate: sale.date,
          };
        }
        return m;
      })
    );

    logAction(
      'ကုန်သည်အရောင်း ရေးသွင်းခြင်း',
      `${sale.merchantName} သို့ ${sale.totalItemsCount} ထည် ရောင်းချခဲ့သည် (ဘောင်ချာ: ${sale.voucherNo})`,
      'SALE',
      sale.id
    );

    // Show prompt to view sale voucher
    setActionPrompt({
      isOpen: true,
      title: 'အရောင်းဘောင်ချာ ထုတ်ယူပြီးပါပြီ',
      message: `${sale.merchantName} သို့ ရောင်းချငွေရှင်းပြေစာ (Invoice #${sale.voucherNo}) ကို ယခု ကြည့်ရှုလိုပါသလား?`,
      type: 'OUTBOUND',
      item: sale,
    });
  }, [logAction]);

  // Suppliers CRUD
  const handleAddSupplier = useCallback((s: Supplier) => {
    setSuppliers((prev) => [s, ...prev]);
    logAction('ရက်လုပ်သူ အသစ်ထည့်သွင်းခြင်း', `${s.name} (${s.village})`, 'SUPPLIER', s.id);
  }, [logAction]);

  const handleUpdateSupplier = useCallback((s: Supplier) => {
    setSuppliers((prev) => prev.map((item) => (item.id === s.id ? s : item)));
    logAction('ရက်လုပ်သူ ပြင်ဆင်ခြင်း', `${s.name} (${s.village})`, 'SUPPLIER', s.id);
  }, [logAction]);

  const handleDeleteSupplier = useCallback((supplierId: string) => {
    const s = suppliers.find((item) => item.id === supplierId);
    if (!s) return;

    // Soft delete to Recycle Bin
    const softDeleted: SoftDeletedItem = {
      id: `del-${Date.now()}`,
      originalId: s.id,
      name: `${s.name} (${s.village})`,
      type: 'SUPPLIER',
      deletedAt: `${getTodayDateString()} ${getCurrentTimeString()}`,
      data: s,
    };

    setDeletedItems((prev) => [softDeleted, ...prev]);
    setSuppliers((prev) => prev.filter((item) => item.id !== supplierId));
    logAction('ရက်လုပ်သူ ဖျက်ခြင်း (အမှိုက်ပုံး)', `${s.name} (${s.village})`, 'SUPPLIER', s.id);
  }, [suppliers, logAction]);

  // Merchants CRUD
  const handleAddMerchant = useCallback((m: Merchant) => {
    setMerchants((prev) => [m, ...prev]);
    logAction('ကုန်သည် အသစ်ထည့်သွင်းခြင်း', `${m.name} (${m.town})`, 'MERCHANT', m.id);
  }, [logAction]);

  const handleUpdateMerchant = useCallback((m: Merchant) => {
    setMerchants((prev) => prev.map((item) => (item.id === m.id ? m : item)));
    logAction('ကုန်သည် ပြင်ဆင်ခြင်း', `${m.name} (${m.town})`, 'MERCHANT', m.id);
  }, [logAction]);

  const handleDeleteMerchant = useCallback((merchantId: string) => {
    const m = merchants.find((item) => item.id === merchantId);
    if (!m) return;

    const softDeleted: SoftDeletedItem = {
      id: `del-${Date.now()}`,
      originalId: m.id,
      name: `${m.name} (${m.town})`,
      type: 'MERCHANT',
      deletedAt: `${getTodayDateString()} ${getCurrentTimeString()}`,
      data: m,
    };

    setDeletedItems((prev) => [softDeleted, ...prev]);
    setMerchants((prev) => prev.filter((item) => item.id !== merchantId));
    logAction('ကုန်သည် ဖျက်ခြင်း (အမှိုက်ပုံး)', `${m.name} (${m.town})`, 'MERCHANT', m.id);
  }, [merchants, logAction]);

  // Products CRUD
  const handleAddProduct = useCallback((p: Product) => {
    setProducts((prev) => [p, ...prev]);
    logAction('ကုန်ပစ္စည်း အသစ်ထည့်သွင်းခြင်း', `${p.name} (${p.category})`, 'PRODUCT', p.id);
  }, [logAction]);

  const handleUpdateProduct = useCallback((p: Product) => {
    setProducts((prev) => prev.map((item) => (item.id === p.id ? p : item)));
    logAction('ကုန်ပစ္စည်း ပြင်ဆင်ခြင်း', `${p.name}`, 'PRODUCT', p.id);
  }, [logAction]);

  const handleDeleteProduct = useCallback((productId: string) => {
    const p = products.find((item) => item.id === productId);
    if (!p) return;

    const softDeleted: SoftDeletedItem = {
      id: `del-${Date.now()}`,
      originalId: p.id,
      name: `${p.name} (${p.category})`,
      type: 'PRODUCT',
      deletedAt: `${getTodayDateString()} ${getCurrentTimeString()}`,
      data: p,
    };

    setDeletedItems((prev) => [softDeleted, ...prev]);
    setProducts((prev) => prev.filter((item) => item.id !== productId));
    logAction('ကုန်ပစ္စည်း ဖျက်ခြင်း (အမှိုက်ပုံး)', `${p.name}`, 'PRODUCT', p.id);
  }, [products, logAction]);

  // Orders CRUD
  const handleAddOrder = useCallback((ord: MerchantOrder) => {
    setOrders((prev) => [ord, ...prev]);
    logAction('အော်ဒါ အသစ်ရေးသွင်းခြင်း', `${ord.merchantName} - ${ord.orderNumber}`, 'ORDER', ord.id);
  }, [logAction]);

  const handleUpdateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    logAction('အော်ဒါ အခြေအနေ ပြောင်းလဲခြင်း', `Order ID: ${orderId} -> ${status}`, 'ORDER', orderId);
  }, [logAction]);

  const handleConvertOrderToSale = useCallback((order: MerchantOrder) => {
    const items = order.items.map((it) => ({
      productId: it.productId,
      productName: it.productName,
      quantity: it.quantity,
      unit: it.unit,
      unitPrice: it.unitPrice,
      subtotal: it.subtotal,
    }));

    const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);
    const voucherNo = `SL-${Date.now().toString().slice(-6)}`;

    const newSale: SaleRecord = {
      id: `sale-${Date.now()}`,
      voucherNo,
      date: getTodayDateString(),
      time: getCurrentTimeString(),
      merchantId: order.merchantId,
      merchantName: order.merchantName,
      merchantTown: order.merchantTown,
      items,
      totalItemsCount: totalItems,
      grandTotal: order.totalEstimatedValue,
      cashPaidByMerchant: 0,
      paymentMethod: 'CASH',
      remainingReceivableBalance: order.totalEstimatedValue,
      notes: `အော်ဒါ ${order.orderNumber} မှ အရောင်းသို့ ပြောင်းလဲခဲ့သည်`,
    };

    handleSaveSale(newSale);
    handleUpdateOrderStatus(order.id, 'DELIVERED');
  }, [handleSaveSale, handleUpdateOrderStatus]);

  const handleDeleteOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    logAction('အော်ဒါ ဖျက်ခြင်း', `Order ID: ${orderId}`, 'ORDER', orderId);
  }, [logAction]);

  // Peer Trades
  const handleAddPeerTrade = useCallback((trade: PeerTradeRecord) => {
    setPeerTrades((prev) => [trade, ...prev]);
    logAction(
      'မိတ်ဖက်ဆိုင် ကုန်ဖလှယ်ခြင်း',
      `${trade.peerShopName} နှင့် ${trade.productName} (${trade.quantity} ${trade.unit})`,
      'PEER_TRADE',
      trade.id
    );
  }, [logAction]);

  const handleUpdatePeerTrade = useCallback((trade: PeerTradeRecord) => {
    setPeerTrades((prev) => prev.map((t) => (t.id === trade.id ? trade : t)));
    logAction(
      'ကုန်ဖလှယ်မှတ်တမ်း ပြင်ဆင်/ရှင်းလင်းခြင်း',
      `${trade.peerShopName} - ${trade.productName} အခြေအနေ: ${trade.status}`,
      'PEER_TRADE',
      trade.id
    );
  }, [logAction]);

  const handleDeletePeerTrade = useCallback((tradeId: string) => {
    setPeerTrades((prev) => prev.filter((t) => t.id !== tradeId));
    logAction('မိတ်ဖက်ဆိုင် မှတ်တမ်း ဖျက်ခြင်း', `ID: ${tradeId}`, 'PEER_TRADE', tradeId);
  }, [logAction]);

  // Delete Transaction / Sale
  const handleDeleteTransaction = useCallback((txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    const softDeleted: SoftDeletedItem = {
      id: `del-${Date.now()}`,
      originalId: tx.id,
      name: `ကုန်သိမ်းဘောင်ချာ ${tx.voucherNo} (${tx.supplierName})`,
      type: 'TRANSACTION',
      deletedAt: `${getTodayDateString()} ${getCurrentTimeString()}`,
      data: tx,
    };

    setDeletedItems((prev) => [softDeleted, ...prev]);
    setTransactions((prev) => prev.filter((t) => t.id !== txId));
    logAction('ကုန်သိမ်းဘောင်ချာ ဖျက်ခြင်း', `${tx.voucherNo}`, 'TRANSACTION', tx.id);
  }, [transactions, logAction]);

  const handleDeleteSale = useCallback((saleId: string) => {
    const s = sales.find((sale) => sale.id === saleId);
    if (!s) return;

    const softDeleted: SoftDeletedItem = {
      id: `del-${Date.now()}`,
      originalId: s.id,
      name: `အရောင်းဘောင်ချာ ${s.voucherNo} (${s.merchantName})`,
      type: 'SALE',
      deletedAt: `${getTodayDateString()} ${getCurrentTimeString()}`,
      data: s,
    };

    setDeletedItems((prev) => [softDeleted, ...prev]);
    setSales((prev) => prev.filter((sale) => sale.id !== saleId));
    logAction('အရောင်းဘောင်ချာ ဖျက်ခြင်း', `${s.voucherNo}`, 'SALE', s.id);
  }, [sales, logAction]);

  // Recycle Bin / Restore / Empty
  const handleRestoreDeletedItem = useCallback((item: SoftDeletedItem) => {
    if (item.type === 'SUPPLIER') {
      setSuppliers((prev) => [item.data, ...prev]);
    } else if (item.type === 'MERCHANT') {
      setMerchants((prev) => [item.data, ...prev]);
    } else if (item.type === 'PRODUCT') {
      setProducts((prev) => [item.data, ...prev]);
    } else if (item.type === 'TRANSACTION') {
      setTransactions((prev) => [item.data, ...prev]);
    } else if (item.type === 'SALE') {
      setSales((prev) => [item.data, ...prev]);
    }

    setDeletedItems((prev) => prev.filter((d) => d.id !== item.id));
    logAction('အမှိုက်ပုံးမှ ပြန်လည်ရယူခြင်း', `${item.name}`, item.type, item.originalId);
  }, [logAction]);

  const handlePermanentDelete = useCallback((id: string) => {
    setDeletedItems((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleEmptyTrash = useCallback(() => {
    setDeletedItems([]);
    logAction('အမှိုက်ပုံးအားလုံး ရှင်းထုတ်ခြင်း', 'Recycle bin emptied', 'SYSTEM');
  }, [logAction]);

  // Clear All Data
  const handleConfirmClearAll = useCallback(() => {
    // Reset all product stocks to 0
    const zeroedProducts: Product[] = products.map((p) => ({
      ...p,
      openingStock: 0,
      currentStock: 0,
    }));

    // Reset all supplier financial advances/deliveries to 0
    const zeroedSuppliers: Supplier[] = suppliers.map((s) => ({
      ...s,
      initialAdvance: 0,
      currentAdvanceBalance: 0,
      totalGoodsValueDelivered: 0,
      totalAdvanceGiven: 0,
      totalMaterialCreditGiven: 0,
      totalRepaymentReceived: 0,
    }));

    // Reset all merchant receivables/purchases to 0
    const zeroedMerchants: Merchant[] = merchants.map((m) => ({
      ...m,
      currentReceivableBalance: 0,
      totalPurchasesValue: 0,
      totalPaidAmount: 0,
      payableBalance: 0,
      totalPurchasedFromMerchant: 0,
    }));

    // Reset all transactional activity
    setTransactions([]);
    setSales([]);
    setOrders([]);
    setPeerTrades([]);
    setStockAdjustments([]);
    setAuditLogs([]);
    setDeletedItems([]);
    setProducts(zeroedProducts);
    setSuppliers(zeroedSuppliers);
    setMerchants(zeroedMerchants);

    // Save directly to localStorage to guarantee persistent state
    saveTransactions([]);
    saveSales([]);
    saveOrders([]);
    savePeerTrades([]);
    saveStoredStockAdjustments([]);
    saveAuditLogs([]);
    saveDeletedItems([]);
    saveProducts(zeroedProducts);
    saveSuppliers(zeroedSuppliers);
    saveMerchants(zeroedMerchants);
    // Explicitly preserve and re-save user shop settings (Shop Name, Owner Name, Phone, Address)
    saveShopSettings(shopSettings);

    logAction('အချက်အလက်အားလုံး ရှင်းလင်းခြင်း', 'All numbers reset to zero while preserving shop profile', 'SYSTEM');
    alert('စာရင်းများနှင့် ကိန်းဂဏန်းများအားလုံးကို ၀ (သုည) အဖြစ် အောင်မြင်စွာ ရှင်းလင်းပြီးပါပြီ။ ဆိုင်ရှင်အမည်၊ ဆိုင်အမည် နှင့် ဆိုင်အချက်အလက်များကို ဆက်လက်ထိန်းသိမ်းထားပါသည်။');
  }, [products, suppliers, merchants, shopSettings, logAction]);

  // Zero Settings (Real Shop Launch)
  const handleConfirmZeroReset = useCallback(() => {
    localStorage.setItem('ledger_zero_settings_activated', 'true');
    const zeroData = getCleanZeroData(products, suppliers, merchants);
    setProducts(zeroData.products);
    setSuppliers(zeroData.suppliers);
    setMerchants(zeroData.merchants);
    setTransactions([]);
    setSales([]);
    setOrders([]);
    setPeerTrades([]);
    setStockAdjustments([]);
    setDeletedItems([]);

    saveProducts(zeroData.products);
    saveSuppliers(zeroData.suppliers);
    saveMerchants(zeroData.merchants);
    saveTransactions([]);
    saveSales([]);
    saveOrders([]);
    savePeerTrades([]);
    saveStoredStockAdjustments([]);
    saveDeletedItems([]);
    saveShopSettings(shopSettings);

    setIsZeroResetModalOpen(false);
    logAction('အက်ပ်ကို လက်တွေ့ စတင်အသုံးပြုခြင်း (Zero Settings)', 'All balances and transactions zeroed', 'SYSTEM');
    alert('ဆိုင်စာရင်း အသစ်စတင်ခြင်း အောင်မြင်ပါသည်။ စာရင်းအားလုံးကို သုည (၀) သတ်မှတ်ပြီးဖြစ်၍ လက်တွေ့စတင်သုံးနိုင်ပါပြီ။');
  }, [products, suppliers, merchants, shopSettings, logAction]);

  // Full Demo Data Loader
  const handleLoadDemoData = useCallback(() => {
    if (confirm('စနစ်အစမ်းသုံးကြည့်နိုင်ရန် ကုန်သိမ်း၊ အရောင်း၊ ဝါး/ကြိမ်ကုန်ကြမ်း၊ အော်ဒါ နမူနာဒေတာများကို ထည့်သွင်းလိုပါသလား?')) {
      localStorage.removeItem('ledger_zero_settings_activated');
      const demo = getFullDemoData();
      setProducts(demo.products);
      setSuppliers(demo.suppliers);
      setMerchants(demo.merchants);
      setTransactions(demo.transactions);
      setSales(demo.sales);
      setOrders(demo.orders);
      setPeerTrades(demo.peerTrades);
      setStockAdjustments(demo.stockAdjustments);

      saveProducts(demo.products);
      saveSuppliers(demo.suppliers);
      saveMerchants(demo.merchants);
      saveTransactions(demo.transactions);
      saveSales(demo.sales);
      saveOrders(demo.orders);
      savePeerTrades(demo.peerTrades);
      saveStoredStockAdjustments(demo.stockAdjustments);

      setIsZeroResetModalOpen(false);
      logAction('နမူနာဒေတာများ အစုံအလင် သွင်းယူခြင်း', 'Full demo data populated', 'SYSTEM');
      alert('နမူနာဒေတာများ အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ။ စနစ်ကို အစမ်းလေ့လာနိုင်ပါပြီ။');
    }
  }, [logAction]);

  // Import Backup
  const handleImportBackupData = useCallback((backup: any) => {
    if (backup.suppliers) setSuppliers(backup.suppliers);
    if (backup.merchants) setMerchants(backup.merchants);
    if (backup.products) setProducts(backup.products);
    if (backup.transactions) setTransactions(backup.transactions);
    if (backup.sales) setSales(backup.sales);
    if (backup.orders) setOrders(backup.orders);
    if (backup.peerTrades) setPeerTrades(backup.peerTrades);
    if (backup.shopSettings) setShopSettings(backup.shopSettings);
    if (backup.appLockSettings) setAppLockSettings(backup.appLockSettings);

    logAction('မိတ္တူဖိုင်မှ စာရင်းပြန်သွင်းခြင်း', 'Backup imported successfully', 'SYSTEM');
    alert('အချက်အလက်များ အောင်မြင်စွာ ပြန်လည်သွင်းယူပြီးပါပြီ');
  }, [logAction]);

  // App Lock Controls
  const handleUnlock = useCallback(() => {
    setIsUnlocked(true);
    logAction('App Lock ဖွင့်လှစ်ခြင်း', 'Unlocked successfully with PIN/Recovery Key', 'SECURITY');
  }, [logAction]);

  const handleLockApp = useCallback(() => {
    setIsUnlocked(false);
  }, []);

  const handleUpdateAppLock = useCallback((updated: AppLockSettings) => {
    setAppLockSettings(updated);
    if (!updated.enabled) {
      setIsUnlocked(true);
    }
    logAction(
      'App Lock ဆက်တင် ပြင်ဆင်ခြင်း',
      `Enabled: ${updated.enabled ? 'Yes' : 'No'}`,
      'SECURITY'
    );
  }, [logAction]);

  // View Voucher Helpers
  const handleViewInboundVoucher = useCallback((tx: TransactionRecord) => {
    setActiveVoucherTx(tx);
    setIsVoucherModalOpen(true);
  }, []);

  const handleViewSaleVoucher = useCallback((sale: SaleRecord) => {
    setActiveSaleVoucher(sale);
    setIsSaleVoucherModalOpen(true);
  }, []);

  const handleViewSupplierLedger = useCallback((s: Supplier) => {
    setLedgerSupplier(s);
    setIsLedgerModalOpen(true);
  }, []);

  // Open Add Modals with initial selections
  const handleOpenNewEntry = useCallback((supId?: string) => {
    setInitialEntrySupplierId(supId);
    setIsNewEntryModalOpen(true);
  }, []);

  const handleOpenNewSale = useCallback((mId?: string) => {
    setInitialSaleMerchantId(mId);
    setIsNewSaleModalOpen(true);
  }, []);

  // Stock Adjustment Handler
  const handleAddStockAdjustment = useCallback((adj: StockAdjustmentRecord) => {
    setStockAdjustments((prev) => [adj, ...prev]);
    logAction(
      'လက်ကျန်ပစ္စည်း ချိန်ညှိခြင်း',
      `${adj.productName} (${adj.quantity > 0 ? '+' : ''}${adj.quantity}) - ${adj.reason}`,
      'INVENTORY',
      adj.id
    );
  }, [logAction]);

  // Full Restore Data for Backup Tab
  const handleRestoreData = useCallback(
    (
      newProducts: Product[],
      newSuppliers: Supplier[],
      newTransactions: TransactionRecord[],
      newMerchants?: Merchant[],
      newSales?: SaleRecord[],
      newAdjustments?: StockAdjustmentRecord[],
      newShopSettings?: ShopSettings
    ) => {
      if (newProducts) setProducts(newProducts);
      if (newSuppliers) setSuppliers(newSuppliers);
      if (newTransactions) setTransactions(newTransactions);
      if (newMerchants) setMerchants(newMerchants);
      if (newSales) setSales(newSales);
      if (newAdjustments) setStockAdjustments(newAdjustments);
      if (newShopSettings) setShopSettings(newShopSettings);
      logAction('အချက်အလက်များ အားလုံး အစားထိုး ပြန်လည်ရယူခြင်း', 'Full data restored', 'SYSTEM');
    },
    [logAction]
  );

  // Snapshot Restore & Take Now Handlers
  const handleRestoreSnapshot = useCallback(
    (snap: AutoRecoverySnapshot) => {
      if (snap.data) {
        if (snap.data.products) setProducts(snap.data.products);
        if (snap.data.suppliers) setSuppliers(snap.data.suppliers);
        if (snap.data.transactions) setTransactions(snap.data.transactions);
        if (snap.data.merchants) setMerchants(snap.data.merchants);
        if (snap.data.sales) setSales(snap.data.sales);
        if (snap.data.merchantOrders) setOrders(snap.data.merchantOrders);
        if (snap.data.shopSettings) setShopSettings(snap.data.shopSettings);
        if (snap.data.stockAdjustments) setStockAdjustments(snap.data.stockAdjustments);
        logAction('Snapshot မှ ပြန်လည်ရယူခြင်း', snap.reason || snap.id, 'SYSTEM');
        alert('Snapshot မှ စာရင်းများ အောင်မြင်စွာ ပြန်လည်ရယူပြီးပါပြီ');
      }
    },
    [logAction]
  );

  const handleTakeSnapshotNow = useCallback(
    (reason: string) => {
      const snap = createAutoRecoverySnapshot(reason, {
        products,
        suppliers,
        merchants,
        transactions,
        sales,
        stockAdjustments,
        merchantOrders: orders,
        shopSettings,
      });
      setSnapshots(getStoredRecoverySnapshots());
      logAction('အလိုအလျောက် Snapshot အသစ် ရယူခြင်း', reason, 'SYSTEM', snap.id);
    },
    [products, suppliers, transactions, merchants, sales, orders, shopSettings, stockAdjustments, logAction]
  );

  // Compute Inventory Stock for NewSaleModal
  const inventoryStock = useMemo(() => {
    return products.map((prod) => {
      let inbound = 0;
      let outbound = 0;

      transactions.forEach((tx) => {
        (tx.items || []).forEach((it) => {
          if (it.productId === prod.id) inbound += it.quantity || 0;
        });
      });

      sales.forEach((s) => {
        (s.items || []).forEach((it) => {
          if (it.productId === prod.id) outbound += it.quantity || 0;
        });
      });

      const currentStock = (prod.openingStock || 0) + inbound - outbound;
      return {
        product: prod,
        inbound,
        outbound,
        currentStock,
      };
    });
  }, [products, transactions, sales]);

  // Tab Badge & Navigation Counts
  const todayInboundCount = useMemo(() => {
    return transactions.filter((t) => t.date === selectedDate).length;
  }, [transactions, selectedDate]);

  const todaySalesCount = useMemo(() => {
    return sales.filter((s) => s.date === selectedDate).length;
  }, [sales, selectedDate]);

  const lowStockAlertCount = useMemo(() => {
    return inventoryStock.filter((i) => i.currentStock <= (i.product.minStockAlert || 5)).length;
  }, [inventoryStock]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'PENDING').length;
  }, [orders]);

  const pendingOrdersList = useMemo(() => {
    return orders.filter((o) => o.status === 'PENDING');
  }, [orders]);

  // Normalize activeTab to ActiveTab so both lowercase and legacy uppercase keys function seamlessly
  const normalizedTab: ActiveTab = useMemo(() => {
    switch (activeTab) {
      case 'PICKUP':
        return 'daily';
      case 'MERCHANT_SALES':
        return 'sales';
      case 'ORDERS':
        return 'orders';
      case 'PEER_TRADING':
        return 'peers';
      case 'INVENTORY':
        return 'inventory';
      case 'SUPPLIERS':
        return 'suppliers';
      case 'MERCHANTS':
        return 'merchants';
      case 'PRODUCTS':
        return 'products';
      case 'HISTORY':
        return 'history';
      case 'REPORTS':
        return 'reports';
      case 'BACKUP':
      case 'SETTINGS':
        return 'backup';
      default:
        return (activeTab as ActiveTab) || 'daily';
    }
  }, [activeTab]);

  // App Lock Screen Guard
  if (appLockSettings.enabled && !isUnlocked) {
    return (
      <ErrorBoundary>
        <AppLockScreen
          appLockSettings={appLockSettings}
          shopSettings={shopSettings}
          onUnlock={handleUnlock}
          onUpdateAppLockSettings={handleUpdateAppLock}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
        {/* Global Header */}
        <Header
          shopSettings={shopSettings}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onOpenNewEntry={() => handleOpenNewEntry()}
          onOpenNewSale={() => handleOpenNewSale()}
          todayInboundCount={todayInboundCount}
          todaySalesCount={todaySalesCount}
          pendingOrdersCount={pendingOrdersCount}
          onNavigateToOrders={() => setActiveTab('orders')}
          onOpenEditProfile={() => setIsShopProfileModalOpen(true)}
          onOpenBackup={() => setActiveTab('backup')}
          onOpenAuditLogs={() => setIsDeletedHistoryModalOpen(true)}
          onOpenClearData={() => setIsClearDataModalOpen(true)}
          onOpenLocalSync={() => setIsLocalSyncModalOpen(true)}
          onOpenZapya={() => setIsZapyaModalOpen(true)}
          appLockEnabled={appLockSettings.enabled ?? false}
          onOpenAppLockSettings={() => setIsAppLockSettingsOpen(true)}
          onLockApp={handleLockApp}
          onOpenUserGuide={() => setIsUserGuideOpen(true)}
        />

        {/* Main Content Area - Dynamic Tab Routing */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 pb-24">
          {normalizedTab === 'daily' && (
            <DailyPickupTab
              selectedDate={selectedDate}
              suppliers={suppliers}
              products={products}
              transactions={transactions}
              onOpenNewEntry={() => handleOpenNewEntry()}
              onOpenNewEntryWithSupplier={(supId) => handleOpenNewEntry(supId)}
              onViewVoucher={handleViewInboundVoucher}
              onDeleteTransaction={handleDeleteTransaction}
              pendingOrders={pendingOrdersList}
              onNavigateToOrders={() => setActiveTab('orders')}
              onOpenOrderNotificationModal={(order) => {
                setNotificationOrder(order);
                setIsNotificationOpen(true);
              }}
            />
          )}

          {normalizedTab === 'inventory' && (
            <InventoryTab
              products={products}
              transactions={transactions}
              sales={sales}
              stockAdjustments={stockAdjustments}
              peerTrades={peerTrades}
              onUpdateProduct={handleUpdateProduct}
              onAddProduct={handleAddProduct}
              onAddStockAdjustment={handleAddStockAdjustment}
              onSaveAdjustment={handleAddStockAdjustment}
              onOpenNewSale={() => handleOpenNewSale()}
              onOpenNewSupplierCollection={() => handleOpenNewEntry()}
            />
          )}

          {normalizedTab === 'orders' && (
            <MerchantOrdersTab
              orders={orders}
              merchants={merchants}
              products={products}
              onAddOrder={handleAddOrder}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onConvertOrderToSale={handleConvertOrderToSale}
              onDeleteOrder={handleDeleteOrder}
            />
          )}

          {normalizedTab === 'sales' && (
            <MerchantSalesTab
              sales={sales}
              merchants={merchants}
              products={products}
              selectedDate={selectedDate}
              inventoryStock={inventoryStock}
              onOpenNewSale={() => handleOpenNewSale()}
              onViewSaleVoucher={handleViewSaleVoucher}
              onDeleteSale={handleDeleteSale}
            />
          )}

          {normalizedTab === 'peers' && (
            <PeerTradingTab
              peerTrades={peerTrades}
              products={products}
              merchants={merchants}
              onAddPeerTrade={handleAddPeerTrade}
              onUpdatePeerTrade={handleUpdatePeerTrade}
              onDeletePeerTrade={handleDeletePeerTrade}
            />
          )}

          {normalizedTab === 'merchants' && (
            <MerchantsTab
              merchants={merchants}
              sales={sales}
              onAddMerchant={handleAddMerchant}
              onUpdateMerchant={handleUpdateMerchant}
              onDeleteMerchant={handleDeleteMerchant}
              onOpenNewSaleForMerchant={(mId) => handleOpenNewSale(mId)}
              onViewMerchantHistory={() => {}}
              onOpenDeletedHistory={() => setIsDeletedHistoryModalOpen(true)}
              deletedRecordsCount={deletedItems.filter((d) => d.type === 'MERCHANT').length}
            />
          )}

          {normalizedTab === 'suppliers' && (
            <SuppliersTab
              suppliers={suppliers}
              transactions={transactions}
              products={products}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplier={handleUpdateSupplier}
              onDeleteSupplier={handleDeleteSupplier}
              onOpenNewEntryWithSupplier={(supId) => handleOpenNewEntry(supId)}
              onViewSupplierLedger={handleViewSupplierLedger}
              onOpenDeletedHistory={() => setIsDeletedHistoryModalOpen(true)}
              deletedRecordsCount={deletedItems.filter((d) => d.type === 'SUPPLIER').length}
            />
          )}

          {normalizedTab === 'products' && (
            <ProductsTab
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {normalizedTab === 'history' && (
            <UnifiedHistoryTab
              transactions={transactions}
              sales={sales}
              onViewInboundVoucher={handleViewInboundVoucher}
              onViewSaleVoucher={handleViewSaleVoucher}
              onDeleteTransaction={handleDeleteTransaction}
              onDeleteSale={handleDeleteSale}
            />
          )}

          {normalizedTab === 'reports' && (
            <ReportsTab
              suppliers={suppliers}
              products={products}
              transactions={transactions}
              sales={sales}
              merchants={merchants}
            />
          )}

          {normalizedTab === 'backup' && (
            <SettingsBackupTab
              products={products}
              suppliers={suppliers}
              transactions={transactions}
              merchants={merchants}
              sales={sales}
              stockAdjustments={stockAdjustments}
              shopSettings={shopSettings}
              deletedRecordsCount={deletedItems.length}
              backupReminderSettings={backupReminderSettings}
              onUpdateBackupReminderSettings={setBackupReminderSettings}
              onOpenBackupReminderModal={() => setIsBackupReminderOpen(true)}
              onOpenEditShopProfile={() => setIsShopProfileModalOpen(true)}
              onOpenBackupSaveModal={() => setIsBackupModalOpen(true)}
              onOpenDeletedHistory={() => setIsDeletedHistoryModalOpen(true)}
              onOpenClearDataModal={() => setIsClearDataModalOpen(true)}
              appLockSettings={appLockSettings}
              onUpdateAppLockSettings={handleUpdateAppLock}
              snapshots={snapshots}
              onRestoreSnapshot={handleRestoreSnapshot}
              onTakeSnapshotNow={handleTakeSnapshotNow}
              onOpenSyncModal={() => setIsLocalSyncModalOpen(true)}
              onOpenZapyaModal={() => setIsZapyaModalOpen(true)}
              onOpenZeroSettings={() => setIsZeroResetModalOpen(true)}
              onLoadDemoData={handleLoadDemoData}
              onOpenUserGuide={() => setIsUserGuideOpen(true)}
              onRestoreData={handleRestoreData}
              onAddSupplier={handleAddSupplier}
              onAddMerchant={handleAddMerchant}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
        </main>

        {/* Global Bottom Navigation */}
        <BottomNav
          activeTab={normalizedTab}
          onTabChange={(tab) => setActiveTab(tab)}
          todayInboundCount={todayInboundCount}
          todaySalesCount={todaySalesCount}
          lowStockAlertCount={lowStockAlertCount}
          pendingOrdersCount={pendingOrdersCount}
        />

        {/* Modals */}
        <NewEntryModal
          isOpen={isNewEntryModalOpen}
          onClose={() => setIsNewEntryModalOpen(false)}
          suppliers={suppliers}
          products={products}
          initialSupplierId={initialEntrySupplierId}
          selectedDate={selectedDate}
          onSave={handleSaveTransaction}
        />

        <NewSaleModal
          isOpen={isNewSaleModalOpen}
          onClose={() => setIsNewSaleModalOpen(false)}
          merchants={merchants}
          products={products}
          initialMerchantId={initialSaleMerchantId}
          selectedDate={selectedDate}
          inventoryStock={inventoryStock}
          onSave={handleSaveSale}
        />

        <VoucherModal
          isOpen={isVoucherModalOpen}
          onClose={() => setIsVoucherModalOpen(false)}
          transaction={activeVoucherTx}
          shopSettings={shopSettings}
        />

        <SaleVoucherModal
          isOpen={isSaleVoucherModalOpen}
          onClose={() => setIsSaleVoucherModalOpen(false)}
          sale={activeSaleVoucher}
          shopSettings={shopSettings}
        />

        <SupplierLedgerModal
          isOpen={isLedgerModalOpen}
          onClose={() => setIsLedgerModalOpen(false)}
          supplier={ledgerSupplier}
          transactions={transactions}
          onViewVoucher={handleViewInboundVoucher}
        />

        <EditShopProfileModal
          isOpen={isShopProfileModalOpen}
          onClose={() => setIsShopProfileModalOpen(false)}
          shopSettings={shopSettings}
          onSave={setShopSettings}
        />

        <BackupSaveModal
          isOpen={isBackupModalOpen}
          onClose={() => setIsBackupModalOpen(false)}
          onImportBackup={handleImportBackupData}
        />

        <DeletedHistoryModal
          isOpen={isDeletedHistoryModalOpen}
          onClose={() => setIsDeletedHistoryModalOpen(false)}
          deletedItems={deletedItems}
          onRestore={handleRestoreDeletedItem}
          onPermanentDelete={handlePermanentDelete}
          onEmptyTrash={handleEmptyTrash}
        />

        <ClearDataModal
          isOpen={isClearDataModalOpen}
          onClose={() => setIsClearDataModalOpen(false)}
          onConfirmClear={handleConfirmClearAll}
        />

        <BackupReminderModal
          isOpen={isBackupReminderOpen}
          onClose={() => setIsBackupReminderOpen(false)}
          onBackupNow={() => {
            logAction('မိတ္တူ သိမ်းဆည်းခြင်း', 'Backup downloaded', 'BACKUP');
          }}
        />

        <NewOrderNotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          order={notificationOrder}
          onGoToOrders={() => setActiveTab('orders')}
        />

        <ActionVoucherPromptModal
          isOpen={actionPrompt.isOpen}
          onClose={() => setActionPrompt((prev) => ({ ...prev, isOpen: false }))}
          title={actionPrompt.title}
          message={actionPrompt.message}
          onOpenVoucher={() => {
            if (actionPrompt.type === 'INBOUND' && actionPrompt.item) {
              handleViewInboundVoucher(actionPrompt.item as TransactionRecord);
            } else if (actionPrompt.type === 'OUTBOUND' && actionPrompt.item) {
              handleViewSaleVoucher(actionPrompt.item as SaleRecord);
            }
          }}
        />

        <LocalSyncModal
          isOpen={isLocalSyncModalOpen}
          onClose={() => setIsLocalSyncModalOpen(false)}
          onImportData={handleImportBackupData}
        />

        <ZapyaTransferModal
          isOpen={isZapyaModalOpen}
          onClose={() => setIsZapyaModalOpen(false)}
        />

        <AppLockSettingsModal
          isOpen={isAppLockSettingsOpen}
          onClose={() => setIsAppLockSettingsOpen(false)}
          appLockSettings={appLockSettings}
          onSave={handleUpdateAppLock}
          onLockNow={handleLockApp}
        />

        <UserGuideModal
          isOpen={isUserGuideOpen}
          onClose={() => setIsUserGuideOpen(false)}
          onOpenZeroReset={() => setIsZeroResetModalOpen(true)}
        />

        <ZeroSettingsConfirmModal
          isOpen={isZeroResetModalOpen}
          onClose={() => setIsZeroResetModalOpen(false)}
          onConfirmZeroReset={handleConfirmZeroReset}
          onLoadDemoData={handleLoadDemoData}
        />
      </div>
    </ErrorBoundary>
  );
}
