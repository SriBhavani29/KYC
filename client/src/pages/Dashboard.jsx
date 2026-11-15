import React from 'react';
import { 
  Users, 
  FileCheck2, 
  CreditCard, 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  ArrowUpRight, 
  Building, 
  RefreshCw,
  UserCheck,
  ShieldCheck,
  Store,
  Users2,
  Briefcase,
  Truck,
  Wrench
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { formatINR, formatDate } from '../utils/validation';

export default function Dashboard({ data, onRefresh, onNavigate }) {
  const { user } = useAuth();

  const kpi = data?.kpi || {
    totalKYC: 6,
    pendingKYC: 3,
    approvedKYC: 2,
    rejectedKYC: 1,
    totalCollections: 5499,
    totalPendingPayments: 16000,
    totalFailedPayments: 6500,
    totalQueries: 3,
    openQueries: 1,
    inProgressQueries: 1,
    resolvedQueries: 1,
    avgResolutionTimeMin: 45
  };

  // Cohesive, premium corporate palette (Indigo primary with subtle slate tints)
  const PIE_COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#4338ca'];

  const categoryData = (data?.categoryBreakdown || [
    { name: 'Vendor', count: 1, approved: 0 },
    { name: 'Customer', count: 1, approved: 1 },
    { name: 'Agent', count: 1, approved: 0 },
    { name: 'Manager', count: 1, approved: 1 },
    { name: 'Delivery Partner', count: 1, approved: 0 },
    { name: 'Technician', count: 1, approved: 0 }
  ]);

  const trends = data?.monthlyTrends || [
    { month: 'Jun', kyc: 42, payments: 38000, queries: 28 },
    { month: 'Jul', kyc: 58, payments: 52000, queries: 35 },
    { month: 'Aug', kyc: 72, payments: 69000, queries: 40 },
    { month: 'Sep', kyc: 85, payments: 81000, queries: 51 },
    { month: 'Oct', kyc: 110, payments: 104000, queries: 62 },
    { month: 'Nov', kyc: kpi.totalKYC, payments: kpi.totalCollections, queries: kpi.totalQueries }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner - Executive Super Admin Soft Indigo Glow */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-slate-50 to-white border border-indigo-100 text-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 text-indigo-700 border border-indigo-200">
              FORGE INDIA CONNECT • EXECUTIVE PORTAL
            </span>
            <span className="text-xs text-slate-500">
              Session: <strong className="text-slate-900">{user?.name}</strong> ({user?.role})
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Enterprise Operations & Section Governance
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Centralized monitoring for KYC document ingestion, bi-monthly vendor subscriptions, and SLA ticketing desk.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-indigo-600/20"
          >
            <RefreshCw className="w-3.5 h-3.5 text-white" />
            <span>Sync Metrics</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Summary Row - Distinct Attractive Light Themes with Matching Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total KYC - Blue / Indigo Theme */}
        <div 
          onClick={() => onNavigate('kyc')} 
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-white border border-blue-100 hover:border-blue-300 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Total KYC Pipeline</span>
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{kpi.totalKYC}</span>
            <span className="text-xs font-semibold text-amber-700 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> {kpi.pendingKYC} Pending
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 border-t border-blue-100/60 pt-2.5">
            <span className="text-emerald-700 font-bold">{kpi.approvedKYC} Approved</span>
            <span>•</span>
            <span className="text-rose-600">{kpi.rejectedKYC} Rejected</span>
          </div>
        </div>

        {/* Collections - Emerald Green Theme */}
        <div 
          onClick={() => onNavigate('payments')} 
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Collections (Paid)</span>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{formatINR(kpi.totalCollections)}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Reconciled</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 border-t border-emerald-100/60 pt-2.5">
            <span className="text-amber-700 font-bold">{formatINR(kpi.totalPendingPayments)} Pending</span>
            <span>•</span>
            <span className="text-rose-600">{formatINR(kpi.totalFailedPayments)} Failed</span>
          </div>
        </div>

        {/* Support Desk - Soft Rose / Pink Theme */}
        <div 
          onClick={() => onNavigate('queries')} 
          className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/70 to-white border border-rose-100 hover:border-rose-300 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Support Desk</span>
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-2xs">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{kpi.totalQueries} Tickets</span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">Avg {kpi.avgResolutionTimeMin}m SLA</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 border-t border-rose-100/60 pt-2.5">
            <span className="text-amber-700 font-bold">{kpi.openQueries} Open</span>
            <span>•</span>
            <span className="text-slate-700">{kpi.inProgressQueries} Active</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">{kpi.resolvedQueries} Closed</span>
          </div>
        </div>

        {/* Vendor Subscriptions - Amber / Warm Orange Theme */}
        <div 
          onClick={() => onNavigate('vendors')} 
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-white border border-amber-100 hover:border-amber-300 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Vendor Subscriptions</span>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">₹1,000 / mo</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              2 Cycles/Mo
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-600 border-t border-amber-100/60 pt-2.5 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Cycle 1 (1st-15th) & Cycle 2 (16th-30th)
          </div>
        </div>
      </div>

      {/* Directory Persona Quick Metrics Row - Consistent Card Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        {[
          { label: 'Vendor', icon: Store, meta: '₹1,000 / mo', sub: 'Bi-Monthly', tab: 'vendors' },
          { label: 'Customer', icon: Users2, meta: 'Membership', sub: 'Monthly Plan', tab: 'customers' },
          { label: 'Agent', icon: Briefcase, meta: 'Commission', sub: 'Field Retainer', tab: 'agents' },
          { label: 'Manager', icon: ShieldCheck, meta: 'Operations', sub: 'Supervisory', tab: 'managers' },
          { label: 'Delivery', icon: Truck, meta: 'Fleet Partner', sub: 'Logistics Run', tab: 'delivery' },
          { label: 'Technician', icon: Wrench, meta: 'Field Eng', sub: 'Work-Orders', tab: 'technicians' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              onClick={() => onNavigate(item.tab)}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{item.label}</span>
                <div className="p-1.5 rounded-lg bg-slate-50 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-base font-bold text-slate-900">{item.meta}</div>
              <span className="text-[10px] text-slate-500 block mt-0.5">{item.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">Compliance Ingestion & Inflow Trends</h3>
              <p className="text-xs text-slate-500">Monthly velocity of KYC verifications vs. queries resolved</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> KYC Leads
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Query Desk
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Line type="monotone" dataKey="kyc" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4, fill: '#4f46e5' }} />
                <Line type="monotone" dataKey="queries" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#94a3b8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-1">Entity Breakdown</h3>
            <p className="text-xs text-slate-500 mb-4">Distribution across user personas</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-slate-100">
            {categoryData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span className="text-slate-600 truncate">{cat.name}:</span>
                <strong className="text-slate-900 font-bold">{cat.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Workload Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              Active Team Workload & SLA Performance
            </h3>
            <p className="text-xs text-slate-500">Automated workload balancing across operational staff</p>
          </div>
          <button 
            onClick={() => onNavigate('teams')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Teams & Reassignments</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-bold">Employee</th>
                <th className="py-2.5 px-3 font-bold">Team & Role</th>
                <th className="py-2.5 px-3 font-bold">Status</th>
                <th className="py-2.5 px-3 font-bold">Current Active Load</th>
                <th className="py-2.5 px-3 font-bold">Assigned KYC</th>
                <th className="py-2.5 px-3 font-bold">Assigned Queries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(data?.employees || []).slice(0, 5).map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{emp.name}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-800">{emp.team}</span>
                    <span className="text-[10px] text-slate-500 block">{emp.role}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      emp.isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${emp.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {emp.isAvailable ? 'Active' : 'Offline'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-1.5 rounded-full bg-indigo-600" 
                          style={{ width: `${Math.min((emp.activeLoad || 0) * 25, 100)}%` }} 
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-900">{emp.activeLoad || 0} active</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{emp.assignedKYC || 0} leads</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{emp.assignedQueries || 0} tickets</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
