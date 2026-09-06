import {
  Product,
  Supplier,
  Merchant,
  TransactionRecord,
  SaleRecord,
  MerchantOrder,
  PeerTradeRecord,
  StockAdjustmentRecord,
} from '../types';
import { DEFAULT_PRODUCTS, INITIAL_SUPPLIERS, INITIAL_MERCHANTS } from './defaultData';
import { getTodayDateString } from '../utils/storage';

export function getSampleDemoProducts(): Product[] {
  const today = getTodayDateString();
  return DEFAULT_PRODUCTS.map((p, idx) => {
    // Set opening stock and min stock alert
    // Set some products below minStockAlert to demonstrate the Low Stock Priority Reorder Alert!
    let openingStock = 25;
    let minStockAlert = 15;

    if (p.id === 'p-1') {
      // High priority alert: 4 left vs min 15
      openingStock = 4;
      minStockAlert = 15;
    } else if (p.id === 'p-4') {
      // High priority alert: 3 left vs min 12
      openingStock = 3;
      minStockAlert = 12;
    } else if (p.id === 'p-8') {
      // High priority alert: 2 left vs min 10
      openingStock = 2;
      minStockAlert = 10;
    } else if (idx % 2 === 0) {
      openingStock = 30;
      minStockAlert = 10;
    }

    return {
      ...p,
      openingStock,
      currentStock: openingStock,
      minStockAlert,
    };
  });
}

export function getSampleDemoSuppliers(): Supplier[] {
  const today = getTodayDateString();
  return [
    {
      id: 's-1',
      code: 'S-001',
      name: 'ဦးဘတင်',
      phone: '09-450123456',
      village: 'ကျောက်ပန်းတောင်းရွာ',
      notes: 'ကွမ်းအစ် အဓိက ရက်လုပ်သူ',
      initialAdvance: 80000,
      currentAdvanceBalance: 55000,
      totalGoodsValueDelivered: 450000,
      totalAdvanceGiven: 200000,
      totalMaterialCreditGiven: 25000,
      totalRepaymentReceived: 50000,
      createdAt: '2026-08-01',
      updatedAt: today,
    },
    {
      id: 's-2',
      code: 'S-002',
      name: 'ဒေါ်သန်းခင်',
      phone: '09-250987654',
      village: 'ပလင်းရွာ',
      notes: 'ဆွမ်းအုပ် နှင့် ဗန်းရက်သူ',
      initialAdvance: 50000,
      currentAdvanceBalance: 32000,
      totalGoodsValueDelivered: 280000,
      totalAdvanceGiven: 120000,
      totalMaterialCreditGiven: 15000,
      totalRepaymentReceived: 30000,
      createdAt: '2026-08-02',
      updatedAt: today,
    },
    {
      id: 's-3',
      code: 'S-003',
      name: 'ကိုအောင်မျိုး',
      phone: '09-790112233',
      village: 'အင်ကြင်းကုန်း',
      notes: 'ဝါးခမောက် ရက်သူ',
      initialAdvance: 40000,
      currentAdvanceBalance: 20000,
      totalGoodsValueDelivered: 195000,
      totalAdvanceGiven: 90000,
      totalMaterialCreditGiven: 10000,
      totalRepaymentReceived: 20000,
      createdAt: '2026-08-05',
      updatedAt: today,
    },
    {
      id: 's-4',
      code: 'S-004',
      name: 'ဦးဝင်းမောင်',
      phone: '09-420445566',
      village: 'သရက်ပင်ရွာ',
      notes: 'ကြိမ်တောင်း အဓိက ထုတ်လုပ်သူ',
      initialAdvance: 60000,
      currentAdvanceBalance: 45000,
      totalGoodsValueDelivered: 320000,
      totalAdvanceGiven: 150000,
      totalMaterialCreditGiven: 35000,
      totalRepaymentReceived: 0,
      createdAt: '2026-08-06',
      updatedAt: today,
    },
  ];
}

export function getSampleDemoMerchants(): Merchant[] {
  const today = getTodayDateString();
  return [
    {
      id: 'm-1',
      code: 'M-001',
      name: 'ရွှေမန္တလေး ယွန်းဆိုင်',
      town: 'မန္တလေး',
      phone: '09-250112233',
      address: '၇၈ လမ်း၊ မန္တလေးရွှေမန်းသူ ကားဂိတ်ပို့',
      ownerOrContact: 'ဒေါ်နွယ်နွယ်ဝင်း (ဆိုင်ပိုင်ရှင်)',
      notes: 'လစဥ်ပုံမှန် ကွမ်းအစ် အော်ဒါရှိ',
      currentReceivableBalance: 145000,
      totalPurchasesValue: 850000,
      totalPaidAmount: 705000,
      createdAt: '2026-08-01',
      updatedAt: today,
    },
    {
      id: 'm-2',
      code: 'M-002',
      name: 'ပုဂံရတနာ အမှတ်တရဆိုင်',
      town: 'ပုဂံ',
      phone: '09-450334455',
      address: 'သီရိပစ္စယာလမ်း၊ ပုဂံမြို့သစ်',
      ownerOrContact: 'ဦးကျော်ဇင် (မန်နေဂျာ)',
      notes: 'ငွေရှင်းတိကျသူ',
      currentReceivableBalance: 65000,
      totalPurchasesValue: 420000,
      totalPaidAmount: 355000,
      createdAt: '2026-08-03',
      updatedAt: today,
    },
    {
      id: 'm-3',
      code: 'M-003',
      name: 'ရန်ကုန် ရိုးရာလက်မှုတိုက်',
      town: 'ရန်ကုန်',
      phone: '09-790556677',
      address: 'ဗိုလ်ချုပ်စျေး၊ ရန်ကုန် (အောင်မင်္ဂလာ အဝေးပြေးဂိတ်)',
      ownerOrContact: 'ဒေါ်အေးအေးသင်း',
      notes: 'အဝေးပြေးဂိတ်မှ ပစ္စည်းပို့ရန်',
      currentReceivableBalance: 210000,
      totalPurchasesValue: 980000,
      totalPaidAmount: 770000,
      createdAt: '2026-08-04',
      updatedAt: today,
    },
    {
      id: 'm-4',
      code: 'M-004',
      name: 'သီရိမင်္ဂလာ လက်မှုကုန်စုံ',
      town: 'တောင်ကြီး',
      phone: '09-960778811',
      address: 'စျေးပိုင်းရပ်၊ တောင်ကြီး',
      ownerOrContact: 'ကိုစိုင်းအောင်ခမ်း',
      notes: 'ကြိမ်တောင်း အဓိကဝယ်',
      currentReceivableBalance: 0,
      totalPurchasesValue: 310000,
      totalPaidAmount: 310000,
      createdAt: '2026-08-06',
      updatedAt: today,
    },
  ];
}

export function getSampleDemoTransactions(): TransactionRecord[] {
  const today = getTodayDateString();
  return [
    {
      id: 'tx-demo-1',
      voucherNo: 'TX-260901',
      supplierId: 's-1',
      supplierName: 'ဦးဘတင်',
      supplierVillage: 'ကျောက်ပန်းတောင်းရွာ',
      date: today,
      time: '09:30',
      type: 'COLLECTION_AND_SETTLEMENT',
      items: [
        {
          productId: 'p-1',
          productName: 'ယွန်း ကွမ်းအစ် (အကြီး)',
          quantity: 10,
          unitPrice: 4500,
          subtotal: 45000,
          unit: 'ထည်',
        },
        {
          productId: 'p-2',
          productName: 'ယွန်း ကွမ်းအစ် (အသေး)',
          quantity: 12,
          unitPrice: 2800,
          subtotal: 33600,
          unit: 'ထည်',
        },
      ],
      totalGoodsValue: 78600,
      previousAdvanceBalance: 75000,
      advanceDeducted: 30000,
      cashPaidToSupplier: 48600,
      netCashPaidToSupplier: 48600,
      newAdvanceTaken: 10000,
      remainingAdvanceBalance: 55000,
      notes: 'ယွန်းထည် အချောလှ၊ အသစ် ၁၀ ထည် ထပ်မံရက်လုပ်ရန် အပ်နှံထား',
      createdAt: today,
    },
    {
      id: 'tx-demo-2',
      voucherNo: 'TX-260902',
      supplierId: 's-2',
      supplierName: 'ဒေါ်သန်းခင်',
      supplierVillage: 'ပလင်းရွာ',
      date: today,
      time: '11:15',
      type: 'COLLECTION_AND_SETTLEMENT',
      items: [
        {
          productId: 'p-3',
          productName: 'ယွန်း ဆွမ်းအုပ် (အလတ်)',
          quantity: 8,
          unitPrice: 3500,
          subtotal: 28000,
          unit: 'ထည်',
        },
      ],
      totalGoodsValue: 28000,
      previousAdvanceBalance: 45000,
      advanceDeducted: 15000,
      cashPaidToSupplier: 13000,
      netCashPaidToSupplier: 13000,
      newAdvanceTaken: 2000,
      remainingAdvanceBalance: 32000,
      notes: 'ပုံမှန်ကုန်သိမ်း',
      createdAt: today,
    },
  ];
}

export function getSampleDemoSales(): SaleRecord[] {
  const today = getTodayDateString();
  return [
    {
      id: 'sale-demo-1',
      voucherNo: 'SL-260901',
      date: today,
      time: '14:20',
      merchantId: 'm-1',
      merchantName: 'ရွှေမန္တလေး ယွန်းဆိုင်',
      merchantTown: 'မန္တလေး',
      items: [
        {
          productId: 'p-1',
          productName: 'ယွန်း ကွမ်းအစ် (အကြီး)',
          quantity: 15,
          unitPrice: 5300,
          subtotal: 79500,
          unit: 'ထည်',
        },
        {
          productId: 'p-3',
          productName: 'ယွန်း ဆွမ်းအုပ် (အလတ်)',
          quantity: 10,
          unitPrice: 4300,
          subtotal: 43000,
          unit: 'ထည်',
        },
      ],
      totalItemsCount: 25,
      grandTotal: 122500,
      cashPaidByMerchant: 50000,
      paymentMethod: 'KPAY',
      remainingReceivableBalance: 72500,
      deliveryVehicle: 'ရွှေမန္တလာ အဝေးပြေးကား 3B-5591',
      driverOrContact: 'ကိုအောင်ကျော် (ယာဉ်မောင်း)',
      driverPhone: '09-790123456',
      notes: 'မန္တလေးဂိတ် အမြန်တင်ပို့ပေးရန်',
      createdAt: today,
    },
    {
      id: 'sale-demo-2',
      voucherNo: 'SL-260902',
      date: today,
      time: '16:45',
      merchantId: 'm-2',
      merchantName: 'ပုဂံရတနာ အမှတ်တရဆိုင်',
      merchantTown: 'ပုဂံ',
      items: [
        {
          productId: 'p-5',
          productName: 'ယွန်း ပန်းကန်ပြား',
          quantity: 8,
          unitPrice: 3900,
          subtotal: 31200,
          unit: 'ချပ်',
        },
      ],
      totalItemsCount: 8,
      grandTotal: 31200,
      cashPaidByMerchant: 31200,
      paymentMethod: 'CASH',
      remainingReceivableBalance: 0,
      deliveryVehicle: 'ဆိုင်လာယူ (လက်ငင်း)',
      driverOrContact: 'ဦးကျော်ဇင် ကိုယ်တိုင်',
      driverPhone: '09-450334455',
      notes: 'ငွေအကျေရှင်းပြီး',
      createdAt: today,
    },
  ];
}

export function getSampleDemoOrders(): MerchantOrder[] {
  const today = getTodayDateString();
  return [
    {
      id: 'ord-demo-1',
      orderNo: 'ORD-260901',
      orderNumber: 'ORD-260901',
      merchantId: 'm-3',
      merchantName: 'ရန်ကုန် ရိုးရာလက်မှုတိုက်',
      merchantTown: 'ရန်ကုန်',
      orderDate: today,
      deliveryTargetDate: today,
      items: [
        {
          productId: 'p-1',
          productName: 'ယွန်း ကွမ်းအစ် (အကြီး)',
          quantity: 20,
          agreedPrice: 5300,
          subtotal: 106000,
          unit: 'ထည်',
        },
        {
          productId: 'p-4',
          productName: 'ယွန်း လက်ဖက်အုပ် (ရိုးရာ)',
          quantity: 15,
          agreedPrice: 6000,
          subtotal: 90000,
          unit: 'ထည်',
        },
      ],
      totalOrderAmount: 196000,
      totalEstimatedValue: 196000,
      advanceDeposit: 50000,
      status: 'PENDING',
      destinationNote: 'အောင်မင်္ဂလာ အဝေးပြေးဂိတ်',
      notes: 'အော်ဒါအရေးကြီး၊ ပို့ဆောင်ရက် အမြန်လိုချင်',
      createdAt: today,
    },
  ];
}

export function getSampleDemoPeerTrades(): PeerTradeRecord[] {
  const today = getTodayDateString();
  return [
    {
      id: 'peer-demo-1',
      peerShopName: 'ရွှေပုဂံ ယွန်းလက်မှုဆိုင်',
      peerLocation: 'ပုဂံ',
      productId: 'p-1',
      productName: 'ယွန်း ကွမ်းအစ် (အကြီး)',
      tradeType: 'BORROW_IN', // ငှားယူထားခြင်း
      quantity: 5,
      unit: 'ခု',
      agreedUnitPrice: 4500,
      totalTradeValue: 22500,
      status: 'OPEN',
      date: today,
      time: '13:00',
      notes: 'အော်ဒါလော၍ ခေတ္တ ငှားယူထုတ်ပေးထား',
    },
  ];
}

/**
 * Return fully populated demo data state
 */
export function getFullDemoData() {
  return {
    products: getSampleDemoProducts(),
    suppliers: getSampleDemoSuppliers(),
    merchants: getSampleDemoMerchants(),
    transactions: getSampleDemoTransactions(),
    sales: getSampleDemoSales(),
    orders: getSampleDemoOrders(),
    peerTrades: getSampleDemoPeerTrades(),
    stockAdjustments: [] as StockAdjustmentRecord[],
  };
}

/**
 * Return completely clean ZERO data state for real-world shop operations
 */
export function getCleanZeroData(
  existingProducts: Product[],
  existingSuppliers: Supplier[],
  existingMerchants: Merchant[]
) {
  const zeroedProducts: Product[] = existingProducts.map((p) => ({
    ...p,
    openingStock: 0,
    currentStock: 0,
    minStockAlert: p.minStockAlert || 10,
  }));

  const zeroedSuppliers: Supplier[] = existingSuppliers.map((s) => ({
    ...s,
    initialAdvance: 0,
    currentAdvanceBalance: 0,
    totalGoodsValueDelivered: 0,
    totalAdvanceGiven: 0,
    totalMaterialCreditGiven: 0,
    totalRepaymentReceived: 0,
  }));

  const zeroedMerchants: Merchant[] = existingMerchants.map((m) => ({
    ...m,
    currentReceivableBalance: 0,
    payableBalance: 0,
    totalPurchasesValue: 0,
    totalPaidAmount: 0,
    totalPurchasedFromMerchant: 0,
  }));

  return {
    products: zeroedProducts,
    suppliers: zeroedSuppliers,
    merchants: zeroedMerchants,
    transactions: [] as TransactionRecord[],
    sales: [] as SaleRecord[],
    orders: [] as MerchantOrder[],
    peerTrades: [] as PeerTradeRecord[],
    stockAdjustments: [] as StockAdjustmentRecord[],
  };
}
