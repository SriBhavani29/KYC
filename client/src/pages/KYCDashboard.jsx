import React, { useState } from 'react';
import { 
  FileCheck2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight,
  UserCheck,
  RefreshCw,
  Search,
  Eye,
  Award,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/validation';

export default function KYCDashboard({ data, records = [], onRefresh, onNavigate, onSelectRecord }) {
  const { user } = useAuth();
  const kpi = data?.kpi || {};

  const total = records.length;
  const pending = records.filter(r => r.status === 'Pending').length;
  const approved = records.filter(r => r.status === 'Approved').length;
  const rejected = records.filter(r => r.status === 'Rejected').length;

  const kycOfficers = (data?.employees || []).filter(e => e.team === 'KYC Team');

  // Dedicated Unified Indigo Palette
  const PIE_COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#312e81'];
  const categoryData = data?.categoryBreakdown || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner - KYC Deep Violet & Royal Purple Light Gradient (No Green) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-50/90 via-purple-50/40 to-white border border-violet-200/80 text-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-violet-100 text-violet-800 border border-violet-200">
              FORGE INDIA CONNECT • KYC COMPLIANCE
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            KYC Verification & Document Inspection Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Welcome back, <strong className="text-slate-900">{user?.name}</strong>. Inspect incoming identity documents, approve accounts for auto-payment handover, or issue mandatory rejection notices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('kyc')}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm shadow-violet-600/20 transition-all cursor-pointer"
          >
            Open Verification Queue ({pending})
          </button>
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-white hover:bg-violet-50 text-slate-600 hover:text-slate-900 cursor-pointer transition-all border border-violet-200"
            title="Refresh KYC Metrics"
          >
            <RefreshCw className="w-4 h-4 text-violet-700" />
          </button>
        </div>
      </div>

      {/* KYC KPI Cards - Vibrant Distinct Light Themes & Matching Icon Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications - Royal Blue / Indigo Theme */}
        <div 
          onClick={() => onNavigate('kyc')}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-white border border-blue-100 hover:border-blue-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Total Applications</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
            <span className="text-[11px] text-slate-500 font-medium">Lifetime KYC pipeline</span>
          </div>
          <div className="p-3 rounded-2xl bg-blue-100/80 text-blue-700 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>

        {/* Verification Pending - Warm Amber / Orange Theme */}
        <div 
          onClick={() => onNavigate('kyc')}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-white border border-amber-100 hover:border-amber-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Verification Pending</span>
            <div className="text-2xl font-black text-amber-600 mt-1">{pending}</div>
            <span className="text-[11px] text-amber-700/80 font-medium">Awaiting officer review</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-100/80 text-amber-700 border border-amber-200 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Approved - Emerald Green Theme */}
        <div 
          onClick={() => onNavigate('kyc')}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Approved & Cleared</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{approved}</div>
            <span className="text-[11px] text-emerald-700/80 font-medium">Dispatched to Payments</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-100/80 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Rejected - Coral / Rose Theme */}
        <div 
          onClick={() => onNavigate('kyc')}
          className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/70 to-white border border-rose-100 hover:border-rose-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Rejected Applications</span>
            <div className="text-2xl font-black text-rose-600 mt-1">{rejected}</div>
            <span className="text-[11px] text-rose-700/80 font-medium">With mandatory remarks</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-100/80 text-rose-700 border border-rose-200 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-2xs">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* KYC Queue & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Ingestion Queue Table */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">Active Queue Awaiting Inspection</h3>
              <p className="text-xs text-slate-500">Pending identity & banking document submissions</p>
            </div>
            <button
              onClick={() => onNavigate('kyc')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Leads</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-bold">Applicant</th>
                  <th className="py-2.5 px-3 font-bold">Category</th>
                  <th className="py-2.5 px-3 font-bold">Mobile & Bank</th>
                  <th className="py-2.5 px-3 font-bold">Status</th>
                  <th className="py-2.5 px-3 text-right font-bold">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.slice(0, 5).map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{r.fullName}</span>
                      <span className="text-[10px] text-rose-600 font-mono font-bold">{r.applicationNo}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      <span className="text-slate-800 font-bold block">{r.mobile}</span>
                      <span className="text-slate-500 text-[10px]">{r.ifscCode}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        r.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs' :
                        r.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          r.status === 'Approved' ? 'bg-emerald-500' :
                          r.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectRecord(r)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* KYC Category Distribution */}
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-1">Applications by Entity</h3>
            <p className="text-xs text-slate-500 mb-4">Vendor, Customer, Agent, Fleet & Tech</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-slate-100">
            {categoryData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span className="text-slate-600 truncate">{cat.name}:</span>
                <strong className="text-slate-900 font-bold">{cat.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KYC Team Active Workload */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-3">
          <UserCheck className="w-4 h-4 text-rose-600" />
          KYC Team Officers & Active Queue Load
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {kycOfficers.map(off => (
            <div key={off.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-900">{off.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                  off.isAvailable ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-slate-200 text-slate-700 border-slate-300'
                }`}>
                  {off.isAvailable ? 'Available' : 'Paused'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">{off.role}</span>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500">Current Load:</span>
                <strong className="text-rose-700 font-bold">{off.activeLoad || 0} active leads</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
