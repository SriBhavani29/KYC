import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Bell, 
  Database, 
  Key, 
  Lock,
  Cpu,
  CheckCircle2
} from 'lucide-react';

export default function SettingsView() {
  const [vendorFee, setVendorFee] = useState(1000);
  const [autoAssign, setAutoAssign] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header Banner - Settings Slate-Indigo Gradient */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-100/90 via-indigo-50/40 to-white border border-slate-200 text-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-200 text-slate-700 border border-slate-300">
              FORGE INDIA CONNECT • CONFIGURATION
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-indigo-600" />
            Enterprise System Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Configure automated assignment rules, subscription tier tariffs, and compliance parameters.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {saved && (
          <div className="p-3.5 bg-purple-50 border border-purple-200 text-purple-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-purple-600" />
            <span className="font-bold">Operational configuration parameters successfully committed.</span>
          </div>
        )}

        {/* Vendor Subscription Cycle Rule */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Vendor Billing & Cycle Rules</h3>
          <p className="text-xs text-slate-500">
            Default monthly subscription amount for vendors, split across two monthly reconciliation runs.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-48">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Monthly Subscription (INR)</label>
              <input
                type="number"
                value={vendorFee}
                onChange={(e) => setVendorFee(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="text-xs text-slate-600 pt-0 sm:pt-4">
              Cycle 1: <strong className="text-indigo-600">₹{vendorFee / 2}</strong> (1st-15th) • Cycle 2: <strong className="text-indigo-600">₹{vendorFee / 2}</strong> (16th-End)
            </div>
          </div>
        </div>

        {/* Dynamic Assignment Engine */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Automated Least-Workload Lead Distribution</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-lg">
              Incoming KYC submissions and query tickets automatically assign to available officers with the lowest active queue.
            </p>
          </div>
          <button
            onClick={() => setAutoAssign(!autoAssign)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              autoAssign
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-300'
                : 'bg-slate-100 text-slate-600 border border-slate-300'
            }`}
          >
            {autoAssign ? '✓ Enabled' : 'Manual Assignment Only'}
          </button>
        </div>

        {/* Security & Token Parameters - Unified Indigo & Slate Neutrals */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Compliance & Validation Enforcements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Mobile Format Check</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Strict 10 digits starting with [6-9] enforced via regex.</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">IFSC Indian Banking Code</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">4 characters, 0, 6 alphanumeric matching RBI directory.</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Mandatory Rejection Remarks</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">KYC rejections require verified reason before dispatch.</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Automated Payments Handoff</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Approved applications trigger pending payment records.</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
