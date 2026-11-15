import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  ExternalLink, 
  ShieldAlert, 
  ChevronRight,
  Eye,
  RefreshCw,
  Building
} from 'lucide-react';
import { formatDate } from '../utils/validation';

export default function KYCVerification({ 
  records = [], 
  onSelectRecord, 
  onRefresh, 
  teamMembers = [],
  filterCategory = 'All'
}) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState(filterCategory || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('All');

  // Filter logic
  const filtered = records.filter(item => {
    const matchStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchCategory = categoryFilter === 'All' || item.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchAssignee = assigneeFilter === 'All' || item.assignedTo === assigneeFilter;
    
    const q = searchQuery.toLowerCase();
    const matchSearch = !searchQuery || 
      item.fullName.toLowerCase().includes(q) ||
      item.applicationNo.toLowerCase().includes(q) ||
      item.mobile.includes(q) ||
      (item.businessName && item.businessName.toLowerCase().includes(q));

    return matchStatus && matchCategory && matchAssignee && matchSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner - KYC Deep Violet & Royal Purple Light Gradient (No Green) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-50/90 via-purple-50/40 to-white border border-violet-200/80 text-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-violet-100 text-violet-800 border border-violet-200">
              FORGE INDIA CONNECT • VERIFICATION DESK
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-violet-600" />
            KYC Verification & Inspection Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Inspect proof of identity, validate bank compliance, approve or reject with mandatory audit remarks.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-violet-50 text-slate-700 hover:text-slate-900 text-xs font-bold border border-violet-200 transition-all cursor-pointer shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-violet-600" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter and Search Bar - Clean Light Surface */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, app #, mobile, or trade name..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="Vendor">Vendor</option>
          <option value="Customer">Customer</option>
          <option value="Agent">Agent</option>
          <option value="Manager">Manager</option>
          <option value="Delivery Partner">Delivery Partner</option>
          <option value="Technician">Technician</option>
        </select>

        {/* Assigned Officer Filter */}
        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
        >
          <option value="All">All Assignees</option>
          {teamMembers.map(m => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.team})
            </option>
          ))}
        </select>
      </div>

      {/* KYC Table List */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Application / ID</th>
                <th className="py-3.5 px-4 font-bold">Entity & Category</th>
                <th className="py-3.5 px-4 font-bold">Mobile & Banking</th>
                <th className="py-3.5 px-4 font-bold">Assigned Agent</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Submitted</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 font-medium">
                    No KYC applications match the selected criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    {/* App Number */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-rose-600 block">{rec.applicationNo}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{rec.id}</span>
                    </td>

                    {/* Entity Name & Category */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{rec.fullName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px] border border-slate-200">
                          {rec.category}
                        </span>
                        {rec.businessName && rec.businessName !== 'N/A' && (
                          <span className="truncate max-w-[150px] font-medium">• {rec.businessName}</span>
                        )}
                      </div>
                    </td>

                    {/* Mobile & Bank */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{rec.mobile}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {rec.bankName || 'Bank'}: {rec.ifscCode}
                      </div>
                    </td>

                    {/* Assigned Officer */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center text-[10px] font-bold">
                          {(rec.assignedName || 'U').slice(0, 2)}
                        </div>
                        <span className="font-semibold text-slate-900">{rec.assignedName}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        rec.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs' :
                        rec.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          rec.status === 'Approved' ? 'bg-emerald-500' :
                          rec.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        {rec.status}
                      </span>
                    </td>

                    {/* Submitted At */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] font-mono">
                      {formatDate(rec.submittedAt)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectRecord(rec)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Inspect & Review</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
