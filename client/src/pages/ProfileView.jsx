import React, { useState } from 'react';
import { 
  UserCircle, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Building, 
  CheckCircle, 
  Key,
  Save,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateMobile } from '../utils/validation';

export default function ProfileView() {
  const { user } = useAuth();
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [name, setName] = useState(user?.name || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    const phoneCheck = validateMobile(phone);
    if (!phoneCheck.valid) {
      setError(phoneCheck.error);
      setSuccess('');
      return;
    }
    setError('');
    setSuccess('Security profile updated successfully with verified phone compliance.');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">FORGE INDIA CONNECT</div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-indigo-600" />
          Operator Profile & Security Credentials
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Role-based compliance permissions and account verification attributes.
        </p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Banner - Unique Indigo-Cyan Light Header */}
        <div className="h-28 bg-gradient-to-r from-indigo-50/90 via-sky-50/50 to-white border-b border-indigo-100 p-6 flex items-end">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-indigo-600/20">
              {user?.name?.slice(0, 2) || 'OP'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">{user?.name}</h2>
              <span className="text-xs text-indigo-700 font-bold">{user?.role} • {user?.team}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {success && (
            <div className="p-3.5 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-indigo-600" />
              <span className="font-bold">{success}</span>
            </div>
          )}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Official Name</label>
              <input
                type="text"
                value={name || user?.name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Email ID</label>
              <input
                type="text"
                disabled
                value={user?.email || 'admin@forgeindia.connect'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-500 cursor-not-allowed font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Verified Mobile (Strict 10 digits starting with 6,7,8,9)
              </label>
              <input
                type="text"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">RBAC Role Clearance</label>
              <input
                type="text"
                disabled
                value={user?.role}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-500 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Updates</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
