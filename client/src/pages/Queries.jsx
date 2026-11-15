import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Send, 
  User, 
  Calendar,
  RefreshCw,
  PlusCircle,
  FileCheck2,
  ChevronRight
} from 'lucide-react';
import { formatDate } from '../utils/validation';

export default function Queries({ 
  queries = [], 
  metrics = {}, 
  onAddReply, 
  onUpdateStatus, 
  onCreateQuery, 
  onRefresh 
}) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    senderName: '',
    senderCategory: 'Customer',
    senderMobile: '',
    subject: '',
    category: 'Billing',
    priority: 'Medium',
    message: ''
  });

  const activeTicket = selectedTicket || queries[0] || null;

  const filtered = queries.filter(q => {
    const matchStatus = statusFilter === 'All' || q.status.toLowerCase() === statusFilter.toLowerCase();
    const s = searchQuery.toLowerCase();
    const matchSearch = !searchQuery || 
      q.subject.toLowerCase().includes(s) ||
      q.id.toLowerCase().includes(s) ||
      q.senderName.toLowerCase().includes(s) ||
      (q.senderMobile && q.senderMobile.includes(s));
    return matchStatus && matchSearch;
  });

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicket) return;
    onAddReply(activeTicket.id, replyMessage.trim());
    setReplyMessage('');
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    onCreateQuery(newTicket);
    setShowCreateModal(false);
    setNewTicket({
      senderName: '',
      senderCategory: 'Customer',
      senderMobile: '',
      subject: '',
      category: 'Billing',
      priority: 'Medium',
      message: ''
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner - Queries Soft Rose Light Gradient */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-50/90 via-pink-50/40 to-white border border-rose-200/80 text-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-100 text-rose-800 border border-rose-200">
              FORGE INDIA CONNECT • SUPPORT DESK
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-rose-600" />
            Queries & Support Ticket Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Automated ticket routing, response histories, SLA turnaround metrics, and resolution workflows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-rose-600/20"
          >
            <PlusCircle className="w-3.5 h-3.5 text-white" />
            <span>Create Support Query</span>
          </button>
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-slate-900 cursor-pointer transition-all border border-rose-200"
            title="Refresh Tickets"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row - Unified Indigo & Slate Neutrals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Open Inquiries</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{metrics.open || 0}</div>
            <span className="text-[11px] text-amber-600 font-medium">Awaiting agent response</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Under Investigation</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{metrics.inProgress || 0}</div>
            <span className="text-[11px] text-indigo-600 font-medium">In Progress tickets</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Resolved Tickets</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{metrics.resolved || 0}</div>
            <span className="text-[11px] text-indigo-600 font-medium">SLA fulfilled within compliance</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Ticket Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ticket List (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket #, sender, or keyword..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              {['All', 'Open', 'In Progress', 'Resolved'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-pink-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
                No support queries found.
              </div>
            ) : (
              filtered.map(t => {
                const isSelected = activeTicket && activeTicket.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-pink-50/50 border-pink-400 shadow-sm ring-1 ring-pink-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-bold text-pink-700 bg-pink-100/60 px-2 py-0.5 rounded-md">
                        {t.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        t.status === 'Resolved' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                        t.status === 'In Progress' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs mb-1 line-clamp-1">{t.subject}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">{t.message}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                      <span className="font-semibold text-slate-700">{t.senderName} ({t.senderCategory})</span>
                      <span>{formatDate(t.createdAt)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Conversation Thread (Right 7 Cols) */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[670px]">
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-xs text-pink-700">{activeTicket.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {activeTicket.priority} Priority
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      {activeTicket.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{activeTicket.subject}</h3>
                  <p className="text-[11px] text-slate-500">
                    From <strong className="text-slate-800">{activeTicket.senderName}</strong> • {activeTicket.senderMobile} • Assigned: <strong className="text-pink-700">{activeTicket.assignedName}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <select
                    value={activeTicket.status}
                    onChange={(e) => onUpdateStatus(activeTicket.id, e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer shadow-xs"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Thread Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
                {/* Initial Query Post */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-pink-100 text-pink-800 flex items-center justify-center font-bold text-xs">
                        {activeTicket.senderName?.slice(0, 2) || 'CL'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900">{activeTicket.senderName}</span>
                        <span className="text-[10px] text-slate-400 block">{activeTicket.senderCategory}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{formatDate(activeTicket.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{activeTicket.message}</p>
                </div>

                {/* Follow-up Replies */}
                {(activeTicket.replies || []).map((rep, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border shadow-xs ${
                      rep.senderRole?.includes('Officer') || rep.senderRole?.includes('Agent') || rep.senderRole?.includes('TL')
                        ? 'bg-pink-50/60 border-pink-200 ml-6'
                        : 'bg-white border-slate-200 mr-6'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                          {rep.sender?.slice(0, 2) || 'AG'}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900">{rep.sender}</span>
                          <span className="text-[10px] text-pink-700 font-bold block">{rep.senderRole}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{formatDate(rep.timestamp)}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{rep.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply Input Box */}
              <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type an official resolution or follow-up note..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={!replyMessage.trim()}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
              Select a ticket from the left panel to inspect the full conversation and reply.
            </div>
          )}
        </div>
      </div>

      {/* Create Support Query Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900 mb-1">
              Create New Support Ticket
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Submit an operational query on behalf of a vendor, partner, or user.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Sender Name *</label>
                  <input
                    type="text"
                    required
                    value={newTicket.senderName}
                    onChange={(e) => setNewTicket({ ...newTicket, senderName: e.target.value })}
                    placeholder="e.g. Alok Verma"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category Role</label>
                  <select
                    value={newTicket.senderCategory}
                    onChange={(e) => setNewTicket({ ...newTicket, senderCategory: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Agent">Agent</option>
                    <option value="Delivery Partner">Delivery Partner</option>
                    <option value="Technician">Technician</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Contact Mobile</label>
                <input
                  type="text"
                  maxLength={10}
                  value={newTicket.senderMobile}
                  onChange={(e) => setNewTicket({ ...newTicket, senderMobile: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full font-mono bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Inquiry Domain</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Billing">Billing & Subscription</option>
                    <option value="KYC Verification">KYC & Documents</option>
                    <option value="Technical">Technical Support</option>
                    <option value="Operational">Field Operations</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Urgent">Urgent (15 min SLA)</option>
                    <option value="High">High (30 min SLA)</option>
                    <option value="Medium">Medium (1 hr SLA)</option>
                    <option value="Low">Low (2 hr SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subject Title *</label>
                <input
                  type="text"
                  required
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Brief summary of query"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Inquiry *</label>
                <textarea
                  required
                  rows={3}
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                  placeholder="Describe inquiry specifics..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Create & Route Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
