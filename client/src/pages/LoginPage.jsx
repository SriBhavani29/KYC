import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  AlertCircle,
  ShieldCheck,
  Building,
  CheckCircle2,
  FileCheck2,
  BadgeCheck,
  Fingerprint,
  FileSearch,
  Scan,
  Shield,
  Activity,
  Award,
  Zap,
  Globe2,
  UserCheck2,
  QrCode,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your email or username and password.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Login failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf7fc] via-[#fffbf5] to-[#f8f5ff] text-slate-800 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans selection:bg-purple-600 selection:text-white">
      {/* Background Subtle Geometric Pattern & Radial Mesh Glows (No Blue) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4] overflow-hidden flex items-center justify-center">
        <svg className="w-full h-full text-purple-200/50" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="500" cy="500" r="460" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 8" />
          <circle cx="500" cy="500" r="340" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="500" cy="500" r="190" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" />
          <path d="M500 40 L500 960 M40 500 L960 500" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
          <polygon points="500,160 800,680 200,680" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
        </svg>
      </div>

      {/* Floating Ambient Mesh Glows - Warm Amber Gold & Royal Purple & Sunset Coral */}
      <div className="absolute -top-36 -left-36 w-[620px] h-[620px] bg-gradient-to-br from-amber-200/60 via-orange-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-36 -right-36 w-[680px] h-[680px] bg-gradient-to-tl from-purple-300/40 via-rose-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container: 2-Column Responsive Split */}
      <div className="w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Official Logo, Catchy Slogan & Creative KYC Illustration */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          
          {/* Official Logo, Brand Header & Slogan */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-xl p-2 border-2 border-purple-200/80 flex items-center justify-center overflow-hidden shrink-0 transform transition-transform hover:scale-105 duration-300">
              <img 
                src="/forge-logo.png" 
                alt="Forge India Connect Official Logo" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100/90 border border-purple-200 text-purple-900 text-xs font-bold mb-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Next-Gen Enterprise Trust Gateway</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
                FORGE INDIA CONNECT
              </h1>
              {/* Catchy Slogan */}
              <p className="text-sm sm:text-lg font-black tracking-wide mt-1.5 bg-gradient-to-r from-amber-600 via-orange-600 to-purple-700 bg-clip-text text-transparent">
                Secure Verification, Trusted Connections
              </p>
            </div>
          </div>

          {/* Creative KYC-Related Illustration & Interactive Visual Workspace */}
          <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-purple-100/80 rounded-3xl p-6 shadow-2xl shadow-purple-900/10 relative overflow-hidden group">
            
            {/* Top decorative auditing & stream bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 shadow-2xs" />
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-2xs" />
                <span className="w-3 h-3 rounded-full bg-purple-400 shadow-2xs" />
                <span className="text-[11px] font-mono text-slate-500 ml-2 font-bold tracking-wider">KYC.IDENTITY.VERIFY // SECURE</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                <BadgeCheck className="w-3.5 h-3.5 text-amber-600" />
                RBI & Gov Certified
              </span>
            </div>

            {/* Visual Vector KYC Illustration: Document Scan, Biometrics & Live Verification Shield */}
            <div className="py-4 relative">
              <div className="relative bg-gradient-to-b from-purple-50/60 via-amber-50/40 to-white rounded-2xl p-4 border border-purple-100/70 overflow-hidden">
                
                {/* SVG Visual Illustration of KYC Scanning Workflow */}
                <div className="flex items-center justify-between gap-3 relative z-10">
                  
                  {/* Step 1: ID Card & OCR */}
                  <div className="flex-1 bg-white rounded-xl p-3 border border-purple-100 shadow-sm flex flex-col items-center text-center hover:scale-105 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 text-white flex items-center justify-center shadow-md shadow-purple-600/25 mb-2 relative">
                      <Scan className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-900">Document Scan</span>
                    <span className="text-[9px] text-purple-700 font-medium">Aadhaar & PAN</span>
                  </div>

                  {/* Flow Connector Line */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-5 h-[2px] bg-gradient-to-r from-purple-400 to-amber-400" />
                    <Sparkles className="w-3 h-3 text-amber-600 my-0.5" />
                    <div className="w-5 h-[2px] bg-gradient-to-r from-purple-400 to-amber-400" />
                  </div>

                  {/* Step 2: Facial Biometric Recognition */}
                  <div className="flex-1 bg-white rounded-xl p-3 border border-amber-100 shadow-sm flex flex-col items-center text-center hover:scale-105 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-600/25 mb-2 relative">
                      <Fingerprint className="w-5 h-5 animate-pulse" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-900">Biometric Match</span>
                    <span className="text-[9px] text-amber-800 font-medium">Liveness 99.8%</span>
                  </div>

                  {/* Flow Connector Line */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-5 h-[2px] bg-gradient-to-r from-amber-400 to-rose-400" />
                    <Sparkles className="w-3 h-3 text-rose-500 my-0.5" />
                    <div className="w-5 h-[2px] bg-gradient-to-r from-amber-400 to-rose-400" />
                  </div>

                  {/* Step 3: Verified Badge & Vault */}
                  <div className="flex-1 bg-white rounded-xl p-3 border border-rose-100 shadow-sm flex flex-col items-center text-center hover:scale-105 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-600/25 mb-2 relative">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-600 border border-white" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-900">Instant Approval</span>
                    <span className="text-[9px] text-rose-700 font-medium">Auto-Handover</span>
                  </div>

                </div>

                {/* Laser Scan Animation Indicator */}
                <div className="mt-3 py-1.5 px-3 rounded-lg bg-white/80 border border-purple-100/60 flex items-center justify-between text-[10px]">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-slate-600 font-medium">Real-Time OCR Engine:</span>
                    <span className="font-bold text-purple-900">Verified & Active</span>
                  </div>
                  <span className="font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    256-bit Encrypted
                  </span>
                </div>

              </div>

              {/* Roles Handshake Badges */}
              <div className="mt-3 p-2.5 rounded-2xl bg-purple-50/50 border border-purple-100/70 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600" />
                  <span className="text-slate-600 font-medium">Integrated Operations:</span>
                  <span className="font-bold text-slate-900">Super Admin • KYC • Payments • Queries</span>
                </div>
                <span className="text-[10px] font-mono text-purple-700 font-bold">100% SLA</span>
              </div>
            </div>

            {/* Verification Footer Highlights */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5 text-purple-800 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Zero Manual Bottlenecks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-slate-600 font-mono font-medium">v2.4 Enterprise Trust</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Glowing Login Card (Warm Amber & Royal Purple - Zero Blue) */}
        <div className="lg:col-span-5 w-full">
          <div className="relative">
            {/* Outer Subtle Glow Halo */}
            <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-purple-400 via-rose-300 to-amber-300 opacity-30 blur-lg transition duration-500 group-hover:opacity-60" />
            
            <div className="relative bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-purple-900/10 p-6 sm:p-8 space-y-6">
              
              {/* Header inside Form Card */}
              <div className="flex items-center space-x-3 pb-5 border-b border-slate-100">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-700 to-purple-600 text-white shadow-md shadow-purple-600/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">
                    Sign In to Your Workspace
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter your credentials to launch your assigned portal
                  </p>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <strong className="block font-semibold">Authentication Failed</strong>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Single Common Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Official Email or Username
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@forgeindia.connect"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Account Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transform active:scale-[0.99]"
                >
                  <span>{loading ? 'Verifying & Redirecting...' : 'Sign In & Auto-Route'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Security Clearance Notice */}
              <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 border-t border-slate-100">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Automatic dispatch to Super Admin, KYC, Payments, or Queries dashboard.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
