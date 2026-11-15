import React from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight, 
  RefreshCw 
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
import { formatDate } from '../utils/validation';

export default function QueriesDashboard({ 
  queries = [], 
  metrics = {}, 
  onRefresh, 
  onNavigate 
}) {
  const { user } = useAuth();

  const total = queries.length;
  const openCount = metrics.open || queries.filter(q => q.status === 'Open').length;
  const inProgressCount = metrics.inProgress || queries.filter(q => q.status === 'In Progress').length;
  const resolvedCount = metrics.resolved || queries.filter(q => q.status === 'Resolved').length;

  const slaPerformanceData = [
    { priority: 'Urgent', resolvedWithinSLA: 98, avgMinutes: 18 },
    { priority: 'High', resolvedWithinSLA: 95, avgMinutes: 32 },
    { priority: 'Medium', resolvedWithinSLA: 92, avgMinutes: 45 },
    { priority: 'Low', resolvedWithinSLA: 99, avgMinutes: 60 }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Banner - Queries Soft Rose-Pink Light Gradient */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-50/90 via-pink-50/40 to-white border border-rose-200/80 text-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-100 text-rose-800 border border-rose-200">
              FORGE INDIA CONNECT • QUERIES & SUPPORT
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Customer & Partner Queries Resolution Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Welcome back, <strong className="text-slate-900">{user?.name}</strong>. Monitor incoming tickets, respond to inquiries, and ensure strict compliance with resolution SLA turnarounds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('queries')}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm shadow-rose-600/20 transition-all cursor-pointer"
          >
            Open Ticket Desk ({openCount})
          </button>
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-slate-900 cursor-pointer transition-all border border-rose-200"
            title="Refresh Queries"
          >
            <RefreshCw className="w-4 h-4 text-rose-600" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row - Vibrant Distinct Light Themes & Matching Icon Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Tickets - Indigo / Violet */}
        <div 
          onClick={() => onNavigate('queries')}
          className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-white border border-indigo-100 hover:border-indigo-300 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Total Tickets</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
            <span className="text-[11px] text-slate-500 font-medium">Lifetime submissions</span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-700 border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Open Inquiries - Amber / Orange */}
        <div 
          onClick={() => onNavigate('queries')}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-white border border-amber-100 hover:border-amber-300 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Awaiting Agent</span>
            <div className="text-2xl font-black text-amber-600 mt-1">{openCount}</div>
            <span className="text-[11px] text-amber-600 font-medium">Immediate action required</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* In Progress - Sky Blue / Cyan */}
        <div 
          onClick={() => onNavigate('queries')}
          className="p-5 rounded-2xl bg-gradient-to-br from-sky-50/70 to-white border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">In Progress</span>
            <div className="text-2xl font-black text-sky-600 mt-1">{inProgressCount}</div>
            <span className="text-[11px] text-sky-700 font-medium">Officer responding</span>
          </div>
          <div className="p-3 rounded-2xl bg-sky-100 text-sky-700 border border-sky-200 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-2xs">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Resolved - Emerald Green */}
        <div 
          onClick={() => onNavigate('queries')}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">SLA Fulfilled</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{resolvedCount}</div>
            <span className="text-[11px] text-emerald-700 font-medium">Target compliance met</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SLA Performance Chart */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900">SLA Resolution Fulfillment Rates</h3>
            <p className="text-xs text-slate-500">Percentage of queries closed within mandated SLA targets by priority</p>
          </div>
        </div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={slaPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="priority" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Bar dataKey="resolvedWithinSLA" fill="#ec4899" name="% Resolved in SLA" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
