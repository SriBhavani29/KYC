import React from 'react';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowUpRight, 
  Building, 
  RefreshCw, 
  TrendingUp, 
  FileText 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { formatINR, formatDate } from '../utils/validation';
import { generatePaymentInvoice } from '../utils/pdfGenerator';

export default function PaymentsDashboard({ 
  payments = [], 
  metrics = {}, 
  onRefresh, 
  onNavigate 
}) {
  const { user } = useAuth();

  const totalPaid = metrics.totalPaid || 0;
  const totalPending = metrics.totalPending || 0;
  const totalFailed = metrics.totalFailed || 0;

  const vendorPayments = payments.filter(p => p.category === 'Vendor');
  const otherPayments = payments.filter(p => p.category !== 'Vendor');

  // Payments Dedicated Orange Theme:
  // Orange (#ea580c), Coral (#f43f5e), Pink (#ec4899), Purple (#9333ea)
  // No Blue, Green, or Yellow!
  const paymentTrendData = [
    { period: 'Cycle 1 (Oct)', collected: 32000, pending: 4500 },
    { period: 'Cycle 2 (Oct)', collected: 41000, pending: 3000 },
    { period: 'Cycle 1 (Nov)', collected: totalPaid || 5499, pending: totalPending || 16000 },
    { period: 'Cycle 2 (Nov)', collected: 18500, pending: 12000 }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner - Payments Warm Amber-Orange Light Gradient */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-white border border-amber-200/80 text-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-200">
              FORGE INDIA CONNECT • PAYMENTS & BILLING
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Payments, Dual-Cycle Billing & Disbursements Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Auto-reconciliation for vendor ₹1,000 monthly subscriptions (Cycle 1 & Cycle 2), customer plans, and partner settlements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('payments')}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm shadow-amber-600/20 transition-all cursor-pointer"
          >
            Manage Transactions ({payments.length})
          </button>
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-white hover:bg-amber-50 text-slate-600 hover:text-slate-900 cursor-pointer transition-all border border-amber-200"
            title="Refresh Payments"
          >
            <RefreshCw className="w-4 h-4 text-amber-600" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row - Vibrant Distinct Light Themes & Matching Icon Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Collections - Emerald Theme */}
        <div 
          onClick={() => onNavigate('payments')} 
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Total Collections (Paid)</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatINR(totalPaid)}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Successfully reconciled</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Cycles - Warm Amber Theme */}
        <div 
          onClick={() => onNavigate('payments')} 
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-white border border-amber-100 hover:border-amber-300 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Scheduled Next Cycle</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatINR(totalPending)}
            </div>
            <span className="text-[11px] text-amber-600 font-medium">Awaiting cycle release</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Failed / Disputed Runs - Rose Theme */}
        <div 
          onClick={() => onNavigate('payments')} 
          className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/70 to-white border border-rose-100 hover:border-rose-300 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Disputed / Failed Runs</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatINR(totalFailed)}
            </div>
            <span className="text-[11px] text-rose-600 font-medium">Requires accountant review</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-100 text-rose-700 border border-rose-200 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-2xs">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Vendor Dual-Cycle Dedicated Policy Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
            Mandatory Business Policy
          </span>
          <h3 className="text-base font-black text-slate-900 mt-2">
            Vendor ₹1,000 Monthly Dual-Cycle Billing Architecture
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            All approved vendors are charged a flat ₹1,000 monthly subscription divided equally: 
            <strong> Cycle 1: ₹500 (1st–15th)</strong> and <strong>Cycle 2: ₹500 (16th–End of month)</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-center min-w-[120px]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Cycle 1 Debit</span>
            <span className="text-lg font-black text-orange-600">₹500.00</span>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-center min-w-[120px]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Cycle 2 Debit</span>
            <span className="text-lg font-black text-purple-700">₹500.00</span>
          </div>
        </div>
      </div>

      {/* Bi-Monthly Ingestion Trends Chart */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900">Bi-Monthly Collection Run Trends</h3>
            <p className="text-xs text-slate-500">Collected amounts vs. pending billing cycles</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-orange-600">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" /> Collected
            </span>
            <span className="flex items-center gap-1 text-purple-600">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Pending
            </span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Bar dataKey="collected" fill="#ea580c" name="Collected" radius={[6, 6, 0, 0]} />
              <Bar dataKey="pending" fill="#9333ea" name="Pending" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
