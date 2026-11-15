import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  FileCheck2, 
  CreditCard, 
  HelpCircle,
  Clock,
  Printer
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend
} from 'recharts';
import { formatINR, formatDate } from '../utils/validation';
import { useAuth, PORTALS } from '../context/AuthContext';

export default function ReportsView({ reportData }) {
  const { user } = useAuth();
  const portal = user?.portal || PORTALS.SUPER_ADMIN;

  const kpi = reportData?.kpi || {};
  const teamPerformance = reportData?.teamPerformance || [];
  const monthlyTrends = reportData?.monthlyTrends || [];
  const recentAudits = reportData?.recentAudits || [];

  // Filter audit logs and team performance if restricted by portal
  const filteredTeamPerf = portal === PORTALS.SUPER_ADMIN
    ? teamPerformance
    : teamPerformance.filter(t => t.team === portal);

  const filteredAudits = portal === PORTALS.SUPER_ADMIN
    ? recentAudits
    : recentAudits.filter(a => {
        if (portal === PORTALS.KYC) return a.action.includes('KYC') || a.action.includes('AVAILABILITY');
        if (portal === PORTALS.PAYMENTS) return a.action.includes('PAYMENT');
        if (portal === PORTALS.QUERIES) return a.action.includes('QUERY');
        return true;
      });

  const getReportTitle = () => {
    if (portal === PORTALS.KYC) return 'KYC Team Compliance & SLA Reports';
    if (portal === PORTALS.PAYMENTS) return 'Payments Team Collection & Reconciliation Reports';
    if (portal === PORTALS.QUERIES) return 'Queries Team Resolution & Ticket Reports';
    return 'Executive Global Reports & Audit Compliance Analytics';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner - Audit Cyan-Blue Light Gradient */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-50/90 via-indigo-50/40 to-white border border-sky-200/80 text-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-sky-100 text-sky-800 border border-sky-200">
              FORGE INDIA CONNECT • REGULATORY AUDIT
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-600" />
            {getReportTitle()}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {portal === PORTALS.SUPER_ADMIN 
              ? 'Complete multi-team audit dossiers, SLA performance rates, and executive compliance metrics.' 
              : `Departmental compliance logs, SLA turnaround times, and regulatory audit entries for ${portal}.`}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-sky-50 text-slate-700 hover:text-slate-900 text-xs font-bold border border-sky-200 transition-all cursor-pointer shadow-2xs"
        >
          <Printer className="w-3.5 h-3.5 text-sky-600" />
          <span>Export Summary PDF</span>
        </button>
      </div>

      {/* SLA & Team Performance Matrix - Unified Indigo & Slate Neutrals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredTeamPerf.map((t, idx) => {
          return (
            <div key={t.team} className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-xs transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900">{t.team}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border text-indigo-700 bg-indigo-50 border-indigo-200">
                  SLA: {t.slaRate}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold block">Assigned</span>
                  <span className="text-sm font-black text-slate-900 mt-0.5 block">{t.assigned}</span>
                </div>
                <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <span className="text-[10px] text-indigo-700 font-bold block">Completed</span>
                  <span className="text-sm font-black text-purple-800 mt-0.5 block">{t.completed}</span>
                </div>
                <div className="p-2.5 bg-orange-50 border border-orange-100 rounded-xl">
                  <span className="text-[10px] text-orange-700 font-bold block">Pending</span>
                  <span className="text-sm font-black text-orange-800 mt-0.5 block">{t.pending}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Operations Velocity Chart - Purple & Orange */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 mb-1">Monthly Operations Ingestion Velocity</h3>
        <p className="text-xs text-slate-500 mb-4">KYC completed vs. Queries resolved over the past 6 months</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="kyc" fill="#06b6d4" name="KYC Records Processed" radius={[6, 6, 0, 0]} />
              <Bar dataKey="queries" fill="#f59e0b" name="Queries Closed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Audit Trail Log - Crisp White Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            Immutable Audit Trail & Regulatory Logs
          </h3>
          <span className="text-xs text-purple-700 font-bold">SOC2 / RBI Compliance Ready</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Audit ID</th>
                <th className="py-3 px-4 font-bold">Action Trigger</th>
                <th className="py-3 px-4 font-bold">Target Entity / Ref</th>
                <th className="py-3 px-4 font-bold">Executed By</th>
                <th className="py-3 px-4 font-bold">Remarks & Description</th>
                <th className="py-3 px-4 font-bold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAudits.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-purple-700 font-bold text-[11px]">{log.id}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-lg font-mono text-[10px] bg-slate-100 text-slate-800 border border-slate-200 font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-900 font-semibold">{log.entity}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{log.performedBy}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-sm truncate">{log.details}</td>
                  <td className="py-3 px-4 text-right text-slate-500 font-mono text-[10px]">
                    {formatDate(log.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
