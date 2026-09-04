import { Product, Supplier, TransactionRecord, Merchant, SaleRecord, StockAdjustmentRecord, MerchantOrder, PeerTrader } from '../types';

export const DEFAULT_PRODUCTS: Product[] = [
  { id: 'p-1', name: 'ယွန်း ကွမ်းအစ် (အကြီး)', defaultPrice: 4500, defaultWholesalePrice: 5300, unit: 'ထည်', category: 'ယွန်းထည်', openingStock: 80, currentStock: 70, minStockAlert: 20, active: true },
  { id: 'p-2', name: 'ယွန်း ကွမ်းအစ် (အသေး)', defaultPrice: 2800, defaultWholesalePrice: 3400, unit: 'ထည်', category: 'ယွန်းထည်', openingStock: 100, currentStock: 85, minStockAlert: 25, active: true },
  { id: 'p-3', name: 'ယွန်း ဆွမ်းအုပ် (အလတ်)', defaultPrice: 3500, defaultWholesalePrice: 4300, unit: 'ထည်', category: 'ယွန်းထည်', openingStock: 60, currentStock: 53, minStockAlert: 15, active: true },
  { id: 'p-4', name: 'ယွန်း လက်ဖက်အုပ် (ရိုးရာ)', defaultPrice: 5000, defaultWholesalePrice: 6000, unit: 'ထည်', category: 'ယွန်းထည်', openingStock: 40, currentStock: 30, minStockAlert: 10, active: true },
  { id: 'p-5', name: 'ယွန်း ပန်းကန်ပြား', defaultPrice: 3200, defaultWholesalePrice: 3900, unit: 'ချပ်', category: 'ယွန်းထည်', openingStock: 50, currentStock: 50, minStockAlert: 15, active: true },
  { id: 'p-6', name: 'ဝါးခမောက် (ရိုးရိုး)', defaultPrice: 2200, defaultWholesalePrice: 2800, unit: 'လုံး', category: 'ဝါးထည်', openingStock: 70, currentStock: 70, minStockAlert: 20, active: true },
  { id: 'p-7', name: 'ဝါးဗန်း (အချော)', defaultPrice: 3000, defaultWholesalePrice: 3800, unit: 'ချပ်', category: 'ဝါးထည်', openingStock: 45, currentStock: 30, minStockAlert: 12, active: true },
  { id: 'p-8', name: 'ကြိမ်တောင်း (လက်ကိုင်ပါ)', defaultPrice: 6000, defaultWholesalePrice: 7400, unit: 'လုံး', category: 'ကြိမ်ထည်', openingStock: 35, currentStock: 29, minStockAlert: 10, active: true },
  { id: 'p-9', name: 'ကြိမ်ဗန်း (အဝိုင်း)', defaultPrice: 3800, defaultWholesalePrice: 4600, unit: 'ချပ်', category: 'ကြိမ်ထည်', openingStock: 55, currentStock: 55, minStockAlert: 15, active: true },
  { id: 'p-10', name: 'ဝါးနှီးခြင်း (အကြီး)', defaultPrice: 3800, defaultWholesalePrice: 4600, unit: 'လုံး', category: 'ဝါးထည်', openingStock: 50, currentStock: 50, minStockAlert: 15, active: true },
  { id: 'p-11', name: 'ဝါးယပ်တောင် (အလှဆင်)', defaultPrice: 4200, defaultWholesalePrice: 5100, unit: 'ချပ်', category: 'ဝါးထည်', openingStock: 40, currentStock: 40, minStockAlert: 12, active: true },
  // ကုန်ကြမ်းပစ္စည်းများ (Raw Materials)
  { id: 'p-12', name: 'ဝါးနှီးလိပ် (ကုန်ကြမ်း)', defaultPrice: 1500, defaultWholesalePrice: 2000, unit: 'လိပ်', category: 'ကုန်ကြမ်း (ဝါး)', openingStock: 120, currentStock: 95, minStockAlert: 30, active: true },
  { id: 'p-13', name: 'ကြိမ်လုံးစည်း (ကုန်ကြမ်း)', defaultPrice: 2500, defaultWholesalePrice: 3200, unit: 'စည်း', category: 'ကုန်ကြမ်း (ကြိမ်)', openingStock: 80, currentStock: 65, minStockAlert: 20, active: true },
  { id: 'p-14', name: 'ဝါးပိုးဝါးချောင်း (ကုန်ကြမ်း)', defaultPrice: 1200, defaultWholesalePrice: 1600, unit: 'ချောင်း', category: 'ကုန်ကြမ်း (ဝါး)', openingStock: 150, currentStock: 110, minStockAlert: 40, active: true },
  { id: 'p-15', name: 'ကြိမ်ကြိုးလိပ် (ကုန်ကြမ်း)', defaultPrice: 1000, defaultWholesalePrice: 1400, unit: 'လိပ်', category: 'ကုန်ကြမ်း (ကြိမ်)', openingStock: 100, currentStock: 75, minStockAlert: 25, active: true },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 's-1',
    code: 'S-001',
    name: 'ဦးဘတင်',
    phone: '09-450123456',
    village: 'ကျောက်ပန်းတောင်းရွာ',
    notes: 'ကွမ်းအစ် အဓိက ရက်လုပ်သူ',
    initialAdvance: 200000,
    currentAdvanceBalance: 85000,
    totalGoodsValueDelivered: 235000,
    totalAdvanceGiven: 320000,
    createdAt: '2026-08-01',
    updatedAt: '2026-08-31',
  },
  {
    id: 's-2',
    code: 'S-002',
    name: 'ဒေါ်သန်းခင်',
    phone: '09-250987654',
    village: 'ပလင်းရွာ',
    notes: 'ဆွမ်းအုပ် နှင့် ဗန်းရက်သူ',
    initialAdvance: 150000,
    currentAdvanceBalance: 60000,
    totalGoodsValueDelivered: 140000,
    totalAdvanceGiven: 200000,
    createdAt: '2026-08-02',
    updatedAt: '2026-08-31',
  },
  {
    id: 's-3',
    code: 'S-003',
    name: 'ကိုအောင်မျိုး',
    phone: '09-790112233',
    village: 'အင်ကြင်းကုန်း',
    notes: 'ဝါးခမောက် ရက်သူ',
    initialAdvance: 100000,
    currentAdvanceBalance: 24000,
    totalGoodsValueDelivered: 176000,
    totalAdvanceGiven: 200000,
    createdAt: '2026-08-05',
    updatedAt: '2026-08-31',
  },
  {
    id: 's-4',
    code: 'S-004',
    name: 'ဦးဝင်းမောင်',
    phone: '09-420445566',
    village: 'သရက်ပင်ရွာ',
    notes: 'ကြိမ်တောင်း အဓိက ထုတ်လုပ်သူ',
    initialAdvance: 300000,
    currentAdvanceBalance: 120000,
    totalGoodsValueDelivered: 380000,
    totalAdvanceGiven: 500000,
    createdAt: '2026-08-06',
    updatedAt: '2026-08-31',
  },
  {
    id: 's-5',
    code: 'S-005',
    name: 'ဒေါ်စန်းနွယ်',
    phone: '09-960778899',
    village: 'ညောင်ဦးအရှေ့ရွာ',
    notes: 'လက်ဖက်အုပ် ရက်လုပ်သူ',
    initialAdvance: 120000,
    currentAdvanceBalance: 40000,
    totalGoodsValueDelivered: 160000,
    totalAdvanceGiven: 200000,
    createdAt: '2026-08-08',
    updatedAt: '2026-08-31',
  },
  {
    id: 's-6',
    code: 'S-006',
    name: 'ကိုမင်းမင်း',
    phone: '09-770334455',
    village: 'တောင်ကုန်းရွာ',
    notes: 'ဝါးဗန်းနှင့် ယပ်တောင်',
    initialAdvance: 180000,
    currentAdvanceBalance: 90000,
    totalGoodsValueDelivered: 150000,
    totalAdvanceGiven: 240000,
    createdAt: '2026-08-10',
    updatedAt: '2026-08-31',
  },
];

export const INITIAL_MERCHANTS: Merchant[] = [
  {
    id: 'm-1',
    code: 'M-001',
    name: 'ရွှေမန္တလေး ယွန်းဆိုင်',
    town: 'မန္တလေး',
    phone: '09-250112233',
    address: '၇၈ လမ်း၊ မန္တလေး',
    notes: 'လစဥ်ပုံမှန် ကွမ်းအစ် အော်ဒါရှိ',
    currentReceivableBalance: 56000,
    totalPurchasesValue: 350000,
    totalPaidAmount: 294000,
    createdAt: '2026-08-01',
    updatedAt: '2026-08-31',
  },
  {
    id: 'm-2',
    code: 'M-002',
    name: 'ပုဂံရတနာ အမှတ်တရဆိုင်',
    town: 'ပုဂံ',
    phone: '09-450334455',
    address: 'သီရိပစ္စယာလမ်း၊ ပုဂံမြို့သစ်',
    notes: 'ငွေရှင်းတိကျသူ',
    currentReceivableBalance: 0,
    totalPurchasesValue: 280000,
    totalPaidAmount: 280000,
    createdAt: '2026-08-03',
    updatedAt: '2026-08-31',
  },
  {
    id: 'm-3',
    code: 'M-003',
    name: 'ရန်ကုန် ရိုးရာလက်မှုတိုက်',
    town: 'ရန်ကုန်',
    phone: '09-790556677',
    address: 'ဗိုလ်ချုပ်စျေး၊ ရန်ကုန်',
    notes: 'အဝေးပြေးဂိတ်မှ ပစ္စည်းပို့ရန်',
    currentReceivableBalance: 69000,
    totalPurchasesValue: 480000,
    totalPaidAmount: 411000,
    createdAt: '2026-08-04',
    updatedAt: '2026-08-31',
  },
  {
    id: 'm-4',
    code: 'M-004',
    name: 'သီရိမင်္ဂလာ လက်မှုကုန်စုံ',
    town: 'တောင်ကြီး',
    phone: '09-960778811',
    address: 'စျေးပိုင်းရပ်၊ တောင်ကြီး',
    notes: 'ကြိမ်တောင်း အဓိကဝယ်',
    currentReceivableBalance: 45000,
    totalPurchasesValue: 260000,
    totalPaidAmount: 215000,
    createdAt: '2026-08-06',
    updatedAt: '2026-08-31',
  },
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-1',
    voucherNo: 'REC-20260831-001',
    supplierId: 's-1',
    supplierName: 'ဦးဘတင်',
    date: '2026-08-31',
    time: '17:30',
    type: 'COLLECTION_AND_SETTLEMENT',
    items: [
      { productId: 'p-1', productName: 'ယွန်း ကွမ်းအစ် (အကြီး)', quantity: 10, unitPrice: 4500, subtotal: 45000, unit: 'ထည်' },
      { productId: 'p-2', productName: 'ယွန်း ကွမ်းအစ် (အသေး)', quantity: 15, unitPrice: 2800, subtotal: 42000, unit: 'ထည်' },
    ],
    totalGoodsValue: 87000,
    previousAdvanceBalance: 122000,
    advanceDeducted: 87000,
    cashPaidToSupplier: 0,
    newAdvanceTaken: 50000,
    newAdvanceReason: 'ဆေးဝယ်ရန် အကြိုငွေထုတ်ယူ',
    remainingAdvanceBalance: 85000,
    notes: 'ပစ္စည်းအချောကောင်းမွန်',
    createdAt: '2026-08-31T17:30:00Z',
  },
  {
    id: 'tx-2',
    voucherNo: 'REC-20260831-002',
    supplierId: 's-2',
    supplierName: 'ဒေါ်သန်းခင်',
    date: '2026-08-31',
    time: '18:10',
    type: 'COLLECTION_AND_SETTLEMENT',
    items: [
      { productId: 'p-3', productName: 'ယွန်း ဆွမ်းအုပ် (အလတ်)', quantity: 8, unitPrice: 3500, subtotal: 28000, unit: 'ထည်' },
      { productId: 'p-8', productName: 'ကြိမ်တောင်း (လက်ကိုင်ပါ)', quantity: 4, unitPrice: 6000, subtotal: 24000, unit: 'လုံး' },
    ],
    totalGoodsValue: 52000,
    previousAdvanceBalance: 82000,
    advanceDeducted: 52000,
    cashPaidToSupplier: 0,
    newAdvanceTaken: 30000,
    newAdvanceReason: 'မိသားစုသုံးစရိတ် အကြိုငွေ',
    remainingAdvanceBalance: 60000,
    notes: 'နောက်တစ်ပတ် ဆွမ်းအုပ် ၁၀ ထည် ထပ်ပို့မည်',
    createdAt: '2026-08-31T18:10:00Z',
  },
];

export const INITIAL_SALES: SaleRecord[] = [
  {
    id: 'sale-1',
    voucherNo: 'SALE-20260831-001',
    merchantId: 'm-1',
    merchantName: 'ရွှေမန္တလေး ယွန်းဆိုင်',
    merchantTown: 'မန္တလေး',
    date: '2026-08-31',
    time: '14:20',
    items: [
      { productId: 'p-1', productName: 'ယွန်း ကွမ်းအစ် (အကြီး)', quantity: 20, unitPrice: 5300, costPrice: 4500, subtotal: 106000, unit: 'ထည်' },
      { productId: 'p-2', productName: 'ယွန်း ကွမ်းအစ် (အသေး)', quantity: 30, unitPrice: 3400, costPrice: 2800, subtotal: 102000, unit: 'ထည်' },
    ],
    totalItemsCount: 50,
    totalGoodsValue: 208000,
    deliveryFee: 0,
    discount: 2000,
    grandTotal: 206000,
    previousReceivableBalance: 0,
    cashPaidByMerchant: 150000,
    remainingReceivableBalance: 56000,
    notes: 'မန္တလေးရွှေမန်းသူ ကားဂိတ်ပို့',
    createdAt: '2026-08-31T14:20:00Z',
  },
  {
    id: 'sale-2',
    voucherNo: 'SALE-20260831-002',
    merchantId: 'm-2',
    merchantName: 'ပုဂံရတနာ အမှတ်တရဆိုင်',
    merchantTown: 'ပုဂံ',
    date: '2026-08-31',
    time: '16:00',
    items: [
      { productId: 'p-3', productName: 'ယွန်း ဆွမ်းအုပ် (အလတ်)', quantity: 15, unitPrice: 4300, costPrice: 3500, subtotal: 64500, unit: 'ထည်' },
      { productId: 'p-4', productName: 'ယွန်း လက်ဖက်အုပ် (ရိုးရာ)', quantity: 10, unitPrice: 6000, costPrice: 5000, subtotal: 60000, unit: 'ထည်' },
    ],
    totalItemsCount: 25,
    totalGoodsValue: 124500,
    deliveryFee: 0,
    discount: 1500,
    grandTotal: 123000,
    previousReceivableBalance: 0,
    cashPaidByMerchant: 123000,
    remainingReceivableBalance: 0,
    notes: 'ငွေချက်ချင်းရှင်းပြီး',
    createdAt: '2026-08-31T16:00:00Z',
  },
];

export const INITIAL_STOCK_ADJUSTMENTS: StockAdjustmentRecord[] = [
  {
    id: 'adj-1',
    date: '2026-08-01',
    time: '09:00',
    productId: 'p-1',
    productName: 'ယွန်း ကွမ်းအစ် (အကြီး)',
    type: 'INITIAL',
    quantity: 80,
    previousStock: 0,
    newStock: 80,
    reason: 'စတင်စာရင်းဖွင့် လက်ကျန်',
    createdAt: '2026-08-01T09:00:00Z',
  },
];

export const INITIAL_MERCHANT_ORDERS: MerchantOrder[] = [
  {
    id: 'ord-1',
    orderNo: 'ORD-20260901-001',
    merchantId: 'm-1',
    merchantName: 'ရွှေမန္တလေး ယွန်းဆိုင်',
    merchantTown: 'မန္တလေး',
    orderDate: '2026-09-01',
    deliveryTargetDate: '2026-09-06',
    items: [
      {
        productId: 'p-1',
        productName: 'ယွန်း ကွမ်းအစ် (အကြီး)',
        quantity: 50,
        agreedPrice: 5300,
        subtotal: 265000,
        unit: 'ထည်',
      },
      {
        productId: 'p-8',
        productName: 'ကြိမ်တောင်း (လက်ကိုင်ပါ)',
        quantity: 30,
        agreedPrice: 7400,
        subtotal: 222000,
        unit: 'လုံး',
      },
    ],
    totalOrderAmount: 487000,
    advanceDeposit: 150000,
    status: 'IN_PROGRESS',
    destinationNote: 'မန္တလေး ရွှေမန်းသူ ကားဂိတ်',
    notes: 'အရောင်သေချာစစ်ဆေးပြီးမှ တင်ပေးရန်',
    createdAt: '2026-09-01T10:00:00Z',
  },
];

export const INITIAL_PEER_TRADERS: PeerTrader[] = [
  {
    id: 'peer-1',
    name: 'ကိုကျော်ဌေး (အောင်မင်္ဂလာယွန်းတိုက်)',
    town: 'ညောင်ဦး',
    phone: '09-450998877',
    currentBalance: 0,
    netLentCount: 15,
    netBorrowedCount: 0,
    notes: 'မိတ်ဖက်ဆိုင် - ပစ္စည်းအပြန်အလှန်ချေးယူ',
    createdAt: '2026-08-10',
  },
];

export function generate100SampleSuppliers(): Supplier[] {
  const villages = [
    'ကျောက်ပန်းတောင်းရွာ',
    'ပလင်းရွာ',
    'အင်ကြင်းကုန်း',
    'သရက်ပင်ရွာ',
    'ညောင်ဦးအရှေ့ရွာ',
    'တောင်ကုန်းရွာ',
    'ရွှေစည်းခုံရွာ',
    'မင်းနန်သူရွာ',
    'မြင်းကပါရွာ',
    'ဖွားစောရွာ',
  ];

  const firstNames = ['ဦး', 'ဒေါ်', 'ကို', 'မ'];
  const baseNames = [
    'ဘတင်', 'သန်းခင်', 'အောင်မျိုး', 'ဝင်းမောင်', 'စန်းနွယ်', 'မင်းမင်း', 'ကျော်သူ', 'လှမိုး',
    'ခင်မောင်', 'အေးအေး', 'တင်တင်', 'သန်းဇော်', 'မောင်မောင်', 'စိုးစိုး', 'သန်းထွန်း', 'ဇော်ဝင်း',
    'ချစ်ဆွေ', 'မြသန်း', 'အေးသန်း', 'တင်အောင်', 'အောင်ဆန်း', 'ညွန့်ဝေ', 'စန်းစန်း', 'မြင့်ဆွေ',
    'ဌေးလွင်', 'အောင်ကြည်', 'ခင်စိုး', 'ကျော်စိုး', 'မင်းဇော်', 'လှလှ',
  ];

  const notesList = [
    'ကွမ်းအစ် ရက်လုပ်သူ',
    'ဆွမ်းအုပ် ရက်လုပ်သူ',
    'ကြိမ်တောင်း ရက်လုပ်သူ',
    'ဝါးခမောက် ရက်လုပ်သူ',
    'ဝါးဗန်း ရက်လုပ်သူ',
    'ယပ်တောင် ရက်လုပ်သူ',
    'လက်ဖက်အုပ် ရက်လုပ်သူ',
    'ဝါးနှီးခြင်း ရက်လုပ်သူ',
  ];

  const generated: Supplier[] = [...INITIAL_SUPPLIERS];

  for (let i = INITIAL_SUPPLIERS.length + 1; i <= 100; i++) {
    const code = `S-${String(i).padStart(3, '0')}`;
    const prefix = firstNames[i % firstNames.length];
    const name = `${prefix}${baseNames[i % baseNames.length]}${i > 30 ? ` (${i})` : ''}`;
    const village = villages[i % villages.length];
    const phone = `09-${200000000 + i * 7391}`;
    const note = notesList[i % notesList.length];

    const hasAdvance = i % 4 !== 0;
    const initialAdvance = hasAdvance ? ((i * 13) % 20 + 5) * 10000 : 0;
    const delivered = ((i * 17) % 30 + 10) * 10000;
    const currentBalance = hasAdvance ? Math.max(0, Math.round((initialAdvance * 0.45) / 1000) * 1000) : 0;
    const totalAdvanceGiven = initialAdvance + (i % 2 === 0 ? 50000 : 0);

    generated.push({
      id: `s-${i}`,
      code,
      name,
      phone,
      village,
      notes: note,
      initialAdvance,
      currentAdvanceBalance: currentBalance,
      totalGoodsValueDelivered: delivered,
      totalAdvanceGiven,
      createdAt: '2026-08-01',
      updatedAt: '2026-08-31',
    });
  }

  return generated;
}
