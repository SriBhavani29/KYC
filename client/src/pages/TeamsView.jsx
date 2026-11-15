import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Activity, 
  TrendingUp, 
  UserCheck,
  RefreshCw,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TeamsView({ employees = [], onToggleAvailability, onRefresh }) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const teams = ['KYC Team', 'Payments Team', 'Queries Team', 'Executive'];

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.team.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner - Governance Violet-Purple Light Gradient */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-50/90 via-purple-50/40 to-white border border-violet-200/80 text-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-violet-100 text-violet-800 border border-violet-200">
              FORGE INDIA CONNECT • WORKFORCE
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-violet-600" />
            Teams, Officers & Dynamic Load Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Monitor real-time officer availability, automated least-workload lead routing, and team performance metrics.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-violet-50 text-slate-700 hover:text-slate-900 text-xs font-bold border border-violet-200 transition-all cursor-pointer shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-violet-600" />
          <span>Refresh Staff List</span>
        </button>
      </div>

      {/* Team Summary Cards - Coral, Orange, Pink Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {teams.filter(t => t !== 'Executive').map((teamName, idx) => {
          const members = employees.filter(e => e.team === teamName);
          const activeMembers = members.filter(e => e.isAvailable).length;
          const totalLoad = members.reduce((s, m) => s + (m.activeLoad || 0), 0);

          // Dedicated Portal Colors
          const borderColors = [
            'border-rose-200 hover:border-rose-400',
            'border-orange-200 hover:border-orange-400',
            'border-pink-200 hover:border-pink-400'
          ];
          const tagColors = [
            'text-rose-700 bg-rose-50',
            'text-orange-700 bg-orange-50',
            'text-pink-700 bg-pink-50'
          ];
          const loadBarColors = ['bg-rose-500', 'bg-orange-500', 'bg-pink-500'];

          return (
            <div key={teamName} className={`p-5 rounded-2xl bg-white border ${borderColors[idx % 3]} shadow-sm transition-all`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${tagColors[idx % 3]}`}>
                {teamName}
              </span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-2xl font-black text-slate-900">{members.length} Officers</span>
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {activeMembers} Active
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Active Queue Load:</span>
                <strong className="text-slate-900 font-bold">{totalLoad} Assigned Tasks</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Roster Table - Crisp White Surface */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
          <div>
            <h3 className="text-sm font-black text-slate-900">Employee Roster & Real-Time Availability</h3>
            <p className="text-xs text-slate-500">Live toggling takes officers off auto-assignment queues instantly.</p>
          </div>
          <div className="w-full sm:w-72">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search team member..."
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Employee</th>
                <th className="py-3.5 px-4 font-bold">Team & Role</th>
                <th className="py-3.5 px-4 font-bold">Availability Status</th>
                <th className="py-3.5 px-4 font-bold">Active Workload Gauge</th>
                <th className="py-3.5 px-4 font-bold">KYC Handled</th>
                <th className="py-3.5 px-4 font-bold">Queries Resolved</th>
                <th className="py-3.5 px-4 font-bold text-right">Toggle Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-900 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 flex items-center justify-center font-bold text-xs shadow-xs">
                      {emp.name.slice(0, 2)}
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900">{emp.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{emp.id}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 block">{emp.team}</span>
                    <span className="text-[10px] text-slate-500">{emp.role}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      emp.isAvailable 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${emp.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {emp.isAvailable ? 'Active & Receiving Leads' : 'Offline / Paused'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full ${
                            (emp.activeLoad || 0) > 3 ? 'bg-orange-500' : 'bg-purple-600'
                          }`}
                          style={{ width: `${Math.min((emp.activeLoad || 0) * 25, 100)}%` }} 
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-900">{emp.activeLoad || 0} active</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-rose-600 font-bold">{emp.completedKYC || 0}</span>
                    <span className="text-slate-400"> / {emp.totalAssignedKYC || 0}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-pink-600 font-bold">{emp.resolvedQueries || 0}</span>
                    <span className="text-slate-400"> / {emp.totalQueries || 0}</span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onToggleAvailability(emp.id, !emp.isAvailable)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs ${
                        emp.isAvailable
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200'
                      }`}
                    >
                      {emp.isAvailable ? 'Set Inactive' : 'Set Active'}
                    </button>
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
