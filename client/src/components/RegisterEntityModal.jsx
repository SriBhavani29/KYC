import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Building, 
  CreditCard, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Upload
} from 'lucide-react';
import { validateMobile, validateBankAccount, validateIFSC } from '../utils/validation';

export default function RegisterEntityModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    category: 'Vendor',
    businessName: '',
    email: '',
    mobile: '',
    bankAccountNo: '',
    ifscCode: '',
    bankName: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation clearance
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // 1. Mobile validation: Exactly 10 digits starting with 6,7,8,9
    const mobileCheck = validateMobile(formData.mobile);
    if (!mobileCheck.valid) {
      newErrors.mobile = mobileCheck.error;
    }

    // 2. Bank Account validation: Numeric only 9-18 digits
    const bankCheck = validateBankAccount(formData.bankAccountNo);
    if (!bankCheck.valid) {
      newErrors.bankAccountNo = bankCheck.error;
    }

    // 3. IFSC Code validation: Indian IFSC regex
    const ifscCheck = validateIFSC(formData.ifscCode);
    if (!ifscCheck.valid) {
      newErrors.ifscCode = ifscCheck.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('kyc_ops_token');
      const res = await fetch('/api/kyc/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      onSuccess(data);
      onClose();
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">FORGE INDIA CONNECT</div>
              <h2 className="text-base font-black text-slate-900">Register New Entity</h2>
              <p className="text-xs text-slate-500">Automated least-workload assignment to active KYC agents</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errors.form && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-medium">{errors.form}</span>
            </div>
          )}

          {/* User Category & Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">User Role / Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="Vendor">Vendor (₹1,000/mo - 2 Cycles)</option>
                <option value="Customer">Customer (Monthly Membership)</option>
                <option value="Agent">Agent (Monthly Payouts)</option>
                <option value="Manager">Manager</option>
                <option value="Delivery Partner">Delivery Partner</option>
                <option value="Technician">Technician</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Legal Name *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Ramesh Chandra Sharma"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Business / Trade Name & Contact Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Business / Enterprise Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Trade name (if applicable)"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Mobile Number * (Strict 10 digits starting with 6,7,8,9)
              </label>
              <input
                type="text"
                name="mobile"
                required
                maxLength={10}
                value={formData.mobile}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className={`w-full font-mono bg-white border ${errors.mobile ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-300'} rounded-xl px-3.5 py-2 text-xs font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500`}
              />
              {errors.mobile && <span className="text-[10px] text-rose-600 mt-1 block font-semibold">{errors.mobile}</span>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="operator@domain.com"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Banking Verification Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-purple-600" /> Banking & Payout Credentials
              </span>
              <span className="text-[10px] text-purple-800 font-bold bg-purple-100/60 px-2 py-0.5 rounded-full">RBI Standard Validation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Bank Account Number *</label>
                <input
                  type="text"
                  name="bankAccountNo"
                  required
                  value={formData.bankAccountNo}
                  onChange={handleChange}
                  placeholder="9 to 18 digits numeric"
                  className={`w-full font-mono bg-white border ${errors.bankAccountNo ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-300'} rounded-xl px-3.5 py-2 text-xs font-bold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                {errors.bankAccountNo && <span className="text-[10px] text-rose-600 mt-1 block font-semibold">{errors.bankAccountNo}</span>}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Bank IFSC Code *</label>
                <input
                  type="text"
                  name="ifscCode"
                  required
                  maxLength={11}
                  value={formData.ifscCode}
                  onChange={handleChange}
                  placeholder="e.g. HDFC0001234"
                  className={`w-full font-mono uppercase bg-white border ${errors.ifscCode ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-300'} rounded-xl px-3.5 py-2 text-xs font-bold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                {errors.ifscCode && <span className="text-[10px] text-rose-600 mt-1 block font-semibold">{errors.ifscCode}</span>}
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="e.g. HDFC Bank, SBI, ICICI Bank"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Registered Address</label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="Operating commercial or residential address"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              {submitting ? 'Submitting & Auto-Assigning...' : 'Register & Assign Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
