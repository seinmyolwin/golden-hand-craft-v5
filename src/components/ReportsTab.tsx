import React, { useState, useMemo } from 'react';
import {
  Supplier,
  Product,
  TransactionRecord,
  SaleRecord,
  Merchant,
} from '../types';
import {
  formatMMK,
  formatNumberOnly,
  getTodayDateString,
  exportDailyCollectionCSV,
  exportMerchantSalesCSV,
} from '../utils/storage';
import {
  FileText,
  Calendar,
  Download,
  TrendingUp,
  DollarSign,
  Truck,
  ArrowDownLeft,
  ArrowUpRight,
  Package,
  Layers,
  CheckCircle,
} from 'lucide-react';

interface ReportsTabProps {
  suppliers: Supplier[];
  products: Product[];
  transactions: TransactionRecord[];
  sales: SaleRecord[];
  merchants: Merchant[];
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  suppliers = [],
  products = [],
  transactions = [],
  sales = [],
  merchants = [],
}) => {
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(getTodayDateString());

  const filteredTransactions = useMemo(() => {
    return (transactions || []).filter((t) => t && t.date >= startDate && t.date <= endDate);
  }, [transactions, startDate, endDate]);

  const filteredSales = useMemo(() => {
    return (sales || []).filter((s) => s && s.date >= startDate && s.date <= endDate);
  }, [sales, startDate, endDate]);

  const stats = useMemo(() => {
    let goodsCollectedCount = 0;
    let goodsCollectedValue = 0;
    let advanceDeducted = 0;
    let newAdvanceGiven = 0;
    let cashPaidToSuppliers = 0;

    (filteredTransactions || []).forEach((t) => {
      (t.items || []).forEach((item) => {
        goodsCollectedCount += item.quantity || 0;
      });
      goodsCollectedValue += t.totalGoodsValue || 0;
      advanceDeducted += t.advanceDeducted || 0;
      newAdvanceGiven += t.newAdvanceTaken || 0;
      cashPaidToSuppliers += t.netCashPaidToSupplier || 0;
    });

    let goodsSoldCount = 0;
    let salesRevenue = 0;
    let salesCashReceived = 0;
    let salesCreditIssued = 0;

    (filteredSales || []).forEach((s) => {
      goodsSoldCount += s.totalItemsCount || 0;
      salesRevenue += s.grandTotal || 0;
      salesCashReceived += s.cashPaidByMerchant || 0;
      salesCreditIssued += s.remainingReceivableBalance || 0;
    });

    const netProfitEstimated = salesRevenue - goodsCollectedValue;

    return {
      goodsCollectedCount,
      goodsCollectedValue,
      advanceDeducted,
      newAdvanceGiven,
      cashPaidToSuppliers,
      goodsSoldCount,
      salesRevenue,
      salesCashReceived,
      salesCreditIssued,
      netProfitEstimated,
    };
  }, [filteredTransactions, filteredSales]);

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                ကာလအလိုက် လုပ်ငန်းဝင်ငွေ/ထွက်ငွေ အစီရင်ခံစာ
              </h2>
              <p className="text-xs text-slate-300">
                ရက်စွဲရွေးချယ်၍ ကုန်သိမ်းမှု၊ အရောင်း၊ စုစုပေါင်းအမြတ်နှင့် စာရင်းချုပ်ကြည့်ရှုခြင်း
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-lg border border-slate-700 text-xs">
            <Calendar className="w-3.5 h-3.5 text-purple-300" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            />
            <span className="text-slate-400">မှ</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold">စုစုပေါင်း အရောင်းရငွေ</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-blue-900 truncate">
            {formatMMK(stats.salesRevenue)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            ကုန်သည်များထံ ရောင်းရငွေ
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold">စုစုပေါင်း ကုန်သိမ်းကုန်ကျငွေ</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
            {formatMMK(stats.goodsCollectedValue)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            ရက်လုပ်သူများထံ ပေးသွင်းကုန်တန်ဖိုး
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold">ခန့်မှန်း အကြမ်းဖျင်းအမြတ်</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-emerald-800 truncate">
            {formatMMK(stats.netProfitEstimated)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            (အရောင်း - ကုန်သိမ်းအရင်း)
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold">ရောင်းချ/သိမ်းဆည်းထည်</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
            {stats.goodsSoldCount} ရောင်း / {stats.goodsCollectedCount} သိမ်း
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            ပစ္စည်းအရေအတွက် ပေါင်းစည်းချက်
          </p>
        </div>
      </div>

      {/* Side-by-side Inbound vs Outbound Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inbound (Collection) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              <span>ကုန်သိမ်းမှတ်တမ်း ခွဲခြမ်းစိတ်ဖြာချက်</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded">
              {filteredTransactions.length} စောင်
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">သိမ်းဆည်းရရှိ ကုန်ပစ္စည်းစုစုပေါင်း:</span>
              <strong className="text-slate-900">{stats.goodsCollectedCount} ထည်</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">စုစုပေါင်း ကုန်တန်ဖိုး:</span>
              <strong className="text-slate-900">{formatMMK(stats.goodsCollectedValue)}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">အကြိုငွေမှ နုတ်ယူငွေ (ကျေပြီး):</span>
              <strong className="text-emerald-700">{formatMMK(stats.advanceDeducted)}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">အကြိုငွေအသစ် ထုတ်ပေးငွေ:</span>
              <strong className="text-amber-700">{formatMMK(stats.newAdvanceGiven)}</strong>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600">ရက်လုပ်သူသို့ လက်ငင်းရှင်းငွေ:</span>
              <strong className="text-blue-700">{formatMMK(stats.cashPaidToSuppliers)}</strong>
            </div>
          </div>
        </div>

        {/* Outbound (Sales) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>ကုန်သည်အရောင်း ခွဲခြမ်းစိတ်ဖြာချက်</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-800 rounded">
              {filteredSales.length} စောင်
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">ရောင်းချပြီး ကုန်ပစ္စည်းစုစုပေါင်း:</span>
              <strong className="text-slate-900">{stats.goodsSoldCount} ထည်</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">အရောင်းဘောင်ချာ စုစုပေါင်းတန်ဖိုး:</span>
              <strong className="text-blue-900">{formatMMK(stats.salesRevenue)}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">ကုန်သည်များ လက်ငင်း/လွှဲငွေရှင်းပြီး:</span>
              <strong className="text-emerald-700">{formatMMK(stats.salesCashReceived)}</strong>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600">အကြွေးကျန်ငွေ ပေါင်း:</span>
              <strong className="text-rose-700">{formatMMK(stats.salesCreditIssued)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
