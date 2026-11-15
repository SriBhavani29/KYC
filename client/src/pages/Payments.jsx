import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  Building, 
  User, 
  ArrowUpRight,
  RefreshCw,
  PlusCircle,
  FileCheck2,
  FileText
} from 'lucide-react';
import { formatINR, formatDate } from '../utils/validation';
import { generatePaymentInvoice } from '../utils/pdfGenerator';

export default function Payments({ 
  payments = [], 
  metrics = {}, 
  onUpdateStatus, 
  onRefresh, 
  filterCategory = 'All' 
}) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState(filterCategory || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newStatus, setNewStatus] = useState('Paid');
  const [statusNotes, setStatusNotes] = useState('');

  const filtered = payments.filter(p => {
    const matchStatus = statusFilter === 'All' || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchSearch = !searchQuery || 
      p.recipientName.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.referenceNo && p.referenceNo.toLowerCase().includes(q)) ||
      (p.beneficiaryPhone && p.beneficiaryPhone.includes(q));

    return matchStatus && matchCategory && matchSearch;
  });

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (!selectedPayment) return;
    onUpdateStatus(selectedPayment.id, newStatus, statusNotes);
    setSelectedPayment(null);
    setStatusNotes('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner - Payments Warm Amber Light Gradient */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-white border border-amber-200/80 text-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-200">
              FORGE INDIA CONNECT • PAYMENTS DESK
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-600" />
            Payments, Subscriptions & Disbursements Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Monitor vendor bi-monthly cycles (₹1,000 monthly fee), customer memberships, agent retainers, and partner payouts.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-slate-700 hover:text-slate-900 text-xs font-bold border border-amber-200 transition-all cursor-pointer shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
          <span>Sync Transactions</span>
        </button>
      </div>

      {/* KPI Cards Row - Vibrant Palette: Orange, Purple, Pink */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-orange-100 hover:border-orange-300 shadow-sm transition-all">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Collections (Paid)</span>
          <div className="text-2xl font-black text-orange-600 mt-2">
            {formatINR(metrics.totalPaid || 0)}
          </div>
          <span className="text-[11px] text-orange-600 font-bold mt-1 block">Successfully reconciled</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-sm transition-all">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Billing Cycles</span>
          <div className="text-2xl font-black text-purple-700 mt-2">
            {formatINR(metrics.totalPending || 0)}
          </div>
          <span className="text-[11px] text-purple-700 font-bold mt-1 block">Scheduled for recurring debit</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-pink-100 hover:border-pink-300 shadow-sm transition-all">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Failed / Disputed Runs</span>
          <div className="text-2xl font-black text-pink-600 mt-2">
            {formatINR(metrics.totalFailed || 0)}
          </div>
          <span className="text-[11px] text-pink-600 font-bold mt-1 block">Requires manual intervention</span>
        </div>
      </div>

      {/* Filters - Clean Light */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payments by recipient, phone, or reference #..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {['All', 'Paid', 'Pending', 'Failed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="Vendor">Vendor</option>
          <option value="Customer">Customer</option>
          <option value="Agent">Agent</option>
          <option value="Manager">Manager</option>
          <option value="Delivery Partner">Delivery Partner</option>
          <option value="Technician">Technician</option>
        </select>
      </div>

      {/* Payments Table - Crisp White */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Transaction ID</th>
                <th className="py-3.5 px-4 font-bold">Recipient & Category</th>
                <th className="py-3.5 px-4 font-bold">Cycle & Frequency</th>
                <th className="py-3.5 px-4 font-bold">Amount</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Payment Date / Due</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 font-medium">
                    No payment records match criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-orange-600 block">{p.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{p.referenceNo || 'N/A'}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{p.recipientName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px] border border-slate-200">
                          {p.category}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 font-medium">• {p.beneficiaryPhone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-900 font-bold block">{p.cycle}</span>
                      <span className="text-[10px] text-slate-500">{p.paymentMethod}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                      {formatINR(p.amount)}
                      {p.monthlyFee && p.monthlyFee !== p.amount && (
                        <span className="text-[10px] text-slate-400 block font-normal font-sans">
                          Monthly Tier: {formatINR(p.monthlyFee)}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        p.status === 'Paid' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                        p.status === 'Failed' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                        'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          p.status === 'Paid' ? 'bg-purple-600' :
                          p.status === 'Failed' ? 'bg-pink-600' : 'bg-orange-500'
                        }`} />
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px] font-mono">
                      {p.status === 'Paid' ? formatDate(p.paymentDate) : `Due: ${p.dueDate || 'Immediate'}`}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => generatePaymentInvoice(p)}
                        className="px-2.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold cursor-pointer transition-colors shadow-xs"
                        title="Download Tax Invoice PDF"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPayment(p);
                          setNewStatus(p.status);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold cursor-pointer transition-colors shadow-xs"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Status Update Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900 mb-1">
              Update Payment Status: {selectedPayment.id}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Recipient: <strong className="text-slate-900">{selectedPayment.recipientName}</strong> (₹{selectedPayment.amount})
            </p>

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Target Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Paid', 'Pending', 'Failed'].map(st => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setNewStatus(st)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        newStatus === st
                          ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Audit Notes / Transaction Ref</label>
                <input
                  type="text"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="e.g. Cleared via UPI Ref #992812"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer shadow-sm transition-all"
                >
                  Confirm Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
