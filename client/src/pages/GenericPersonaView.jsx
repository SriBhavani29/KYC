import React from 'react';
import { 
  Users2, 
  Briefcase, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  CreditCard, 
  CheckCircle, 
  Eye, 
  Calendar, 
  Phone,
  Store
} from 'lucide-react';
import { formatINR, formatDate } from '../utils/validation';

export default function GenericPersonaView({ 
  category, 
  title, 
  description, 
  records = [], 
  payments = [], 
  onSelectRecord 
}) {
  const filtered = records.filter(r => r.category.toLowerCase() === category.toLowerCase());
  const categoryPayments = payments.filter(p => p.category.toLowerCase() === category.toLowerCase());

  // Standard Unified Theme Configuration with specific light header themes
  const SECTION_CONFIG = {
    'Vendor': {
      icon: Store,
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      bannerBg: 'from-amber-50/90 via-orange-50/40 to-white border-amber-200/80',
      iconColor: 'text-amber-600'
    },
    'Customer': {
      icon: Users2,
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      bannerBg: 'from-indigo-50/90 via-sky-50/40 to-white border-indigo-200/80',
      iconColor: 'text-indigo-600'
    },
    'Agent': {
      icon: Briefcase,
      badge: 'bg-teal-100 text-teal-800 border-teal-200',
      bannerBg: 'from-teal-50/90 via-emerald-50/40 to-white border-teal-200/80',
      iconColor: 'text-teal-600'
    },
    'Manager': {
      icon: ShieldCheck,
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      bannerBg: 'from-purple-50/90 via-fuchsia-50/40 to-white border-purple-200/80',
      iconColor: 'text-purple-600'
    },
    'Delivery Partner': {
      icon: Truck,
      badge: 'bg-orange-100 text-orange-800 border-orange-200',
      bannerBg: 'from-orange-50/90 via-amber-50/40 to-white border-orange-200/80',
      iconColor: 'text-orange-600'
    },
    'Technician': {
      icon: Wrench,
      badge: 'bg-violet-100 text-violet-800 border-violet-200',
      bannerBg: 'from-violet-50/90 via-purple-50/40 to-white border-violet-200/80',
      iconColor: 'text-violet-600'
    }
  };

  const config = SECTION_CONFIG[category] || { 
    icon: Users2, 
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bannerBg: 'from-indigo-50/90 via-slate-50 to-white border-indigo-200/80',
    iconColor: 'text-indigo-600'
  };
  const Icon = config.icon;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner - Specific Section Light Theme Gradient */}
      <div className={`p-6 rounded-2xl bg-gradient-to-r ${config.bannerBg} border text-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${config.badge}`}>
              FORGE INDIA CONNECT • {category.toUpperCase()} DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
            {title}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">{description}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 text-center min-w-[140px] shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Registered</span>
          <span className="text-3xl font-black text-slate-900 mt-0.5 block">{filtered.length}</span>
          <span className="text-[10px] text-emerald-700 font-bold block">Active Profiles</span>
        </div>
      </div>

      {/* Directory Table - Crisp White with Unified Indigo Accents */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Icon className="w-4 h-4 text-indigo-600" />
            Registered {category} Profiles
          </h3>
          <span className="text-xs font-bold border border-indigo-200 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
            {filtered.length} Entities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Name & ID</th>
                <th className="py-3.5 px-4 font-bold">Contact & Mobile</th>
                <th className="py-3.5 px-4 font-bold">Banking (IFSC / Account)</th>
                <th className="py-3.5 px-4 font-bold">KYC Verification</th>
                <th className="py-3.5 px-4 font-bold">Assigned Agent</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 font-medium">
                    No {category} records found.
                  </td>
                </tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.fullName}</div>
                      <div className="text-[10px] font-mono font-bold" style={{ color: config.color }}>{item.applicationNo}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-900 font-bold">{item.mobile}</span>
                      <span className="text-[11px] text-slate-500 block">{item.email}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900">{item.bankAccountNo}</span>
                      <span className="text-[10px] text-slate-500 block">{item.ifscCode} • {item.bankName}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        item.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs' :
                        item.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'Approved' ? 'bg-emerald-500' :
                          item.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-800 font-semibold">
                      {item.assignedName}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectRecord(item)}
                        className="px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors shadow-xs"
                        style={{ backgroundColor: `${config.color}15`, color: config.color, borderColor: `${config.color}40` }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout / Subscription Records */}
      {categoryPayments.length > 0 && (
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            Financial Transactions & Subscriptions for {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryPayments.map(p => (
              <div key={p.id} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-600">{p.id}</span>
                  <h4 className="text-xs font-bold text-slate-900">{p.recipientName}</h4>
                  <p className="text-[11px] text-slate-500">{p.cycle}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-bold block text-slate-900">{formatINR(p.amount)}</span>
                  <span className={`text-[10px] font-bold uppercase ${
                    p.status === 'Paid' ? 'text-indigo-600' : 'text-amber-600'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
