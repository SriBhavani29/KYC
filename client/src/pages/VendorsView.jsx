import React from 'react';
import { 
  Building, 
  CreditCard, 
  FileCheck2, 
  Phone, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import { formatINR, formatDate } from '../utils/validation';

export default function VendorsView({ records = [], payments = [], onSelectRecord }) {
  const vendors = records.filter(r => r.category === 'Vendor');
  const vendorPayments = payments.filter(p => p.category === 'Vendor');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Policy Information Box - Warm Amber Light Gradient */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-white border border-amber-200/80 text-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-200">
              FORGE INDIA CONNECT • VENDOR DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Vendor Directory & Dual Payment Cycle Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Vendors subscribe at a standard <strong className="text-slate-900">₹1,000 monthly fee</strong>, billed across two cycles per month: 
            <strong> Cycle 1 (1st - 15th)</strong> and <strong>Cycle 2 (16th - End of month)</strong>.
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-amber-200 text-center min-w-[140px] shadow-2xs">
          <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Total Registered</span>
          <span className="text-3xl font-black text-slate-900 mt-0.5 block">{vendors.length}</span>
          <span className="text-[10px] text-amber-700 block mt-0.5 font-bold">₹1,000 / Mo Dual Cycle</span>
        </div>
      </div>

      {/* Vendors List - Crisp White with Unified Indigo Accents */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600" />
            Enrolled Vendors
          </h3>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
            {vendors.length} Total records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Vendor Name & Business</th>
                <th className="py-3.5 px-4 font-bold">Contact & Mobile</th>
                <th className="py-3.5 px-4 font-bold">Banking Details</th>
                <th className="py-3.5 px-4 font-bold">KYC Verification</th>
                <th className="py-3.5 px-4 font-bold">Billing Schedule</th>
                <th className="py-3.5 px-4 font-bold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 font-medium">
                    No vendors currently enrolled.
                  </td>
                </tr>
              ) : (
                vendors.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{v.fullName}</div>
                      <div className="text-[11px] text-orange-700 font-bold">{v.businessName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.applicationNo}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-900 font-bold">{v.mobile}</span>
                      <span className="text-[11px] text-slate-500 block">{v.email}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-purple-800 font-bold">{v.bankAccountNo}</span>
                      <span className="text-[10px] text-slate-500 block">{v.ifscCode} • {v.bankName}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        v.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs' :
                        v.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          v.status === 'Approved' ? 'bg-emerald-500' :
                          v.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        {v.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-900 font-bold block">₹1,000 Monthly</span>
                      <span className="text-[10px] text-orange-600 font-bold block">Cycle 1 (₹500) + Cycle 2 (₹500)</span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectRecord(v)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold cursor-pointer transition-colors shadow-xs"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Cycle Ledger */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-5">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-indigo-600" />
          Recent Vendor Cycle Collections & Due Schedules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendorPayments.map(vp => (
            <div key={vp.id} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-600 font-bold">{vp.id}</span>
                <h4 className="text-xs font-bold text-slate-900">{vp.recipientName}</h4>
                <p className="text-[11px] text-slate-500">{vp.cycle}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono font-bold text-slate-900 block">{formatINR(vp.amount)}</span>
                <span className={`text-[10px] font-bold uppercase ${
                  vp.status === 'Paid' ? 'text-indigo-600' : 'text-amber-600'
                }`}>
                  {vp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
