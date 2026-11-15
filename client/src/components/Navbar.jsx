import React, { useState } from 'react';
import { 
  Bell, 
  Sparkles, 
  ChevronDown, 
  UserCircle, 
  KeyRound, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  title, 
  notifications = [], 
  onOpenRegister,
  onOpenChangePassword,
  onNavigateProfile 
}) {
  const { user, logout } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="h-16 bg-gradient-to-r from-purple-50/90 via-amber-50/40 to-white border-b border-purple-100/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs backdrop-blur-md">
      {/* Title & Portal Badge */}
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md border-2 border-amber-300 flex items-center justify-center shrink-0 overflow-hidden transform hover:scale-105 transition-all">
          <img 
            src="/forge-logo.png" 
            alt="Forge India Connect Logo" 
            className="w-full h-full object-cover rounded-full" 
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-900/70">
              FORGE INDIA CONNECT
            </span>
            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border bg-purple-100/80 text-purple-900 border-purple-200 shadow-2xs">
              {user?.portal || user?.role}
            </span>
          </div>
          <h2 className="text-base font-black text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center space-x-3">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 border border-purple-100 shadow-xs relative transition-colors cursor-pointer"
            title="Real-time Notifications"
          >
            <Bell className="w-4 h-4 text-purple-700" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse shadow-xs">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-purple-100 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">System Activity Stream</span>
                <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">Real-time</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No new alerts</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-purple-50/40 border border-purple-100 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900">{n.title}</span>
                        <span className="text-[9px] text-slate-500">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account Controls */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs border border-purple-100 shadow-xs cursor-pointer transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-700 to-purple-600 text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm shadow-purple-600/30">
              {user?.name?.slice(0, 2) || 'OP'}
            </div>
            <span className="font-bold hidden sm:inline text-slate-800">{user?.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-purple-700" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-purple-100 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[10px] text-purple-800/80 font-bold uppercase tracking-wider">Role Clearance</p>
                <p className="text-xs font-bold text-slate-900">{user?.role}</p>
              </div>

              <button
                onClick={() => {
                  onNavigateProfile();
                  setShowUserDropdown(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-900 transition-colors cursor-pointer font-medium"
              >
                <UserCircle className="w-3.5 h-3.5 text-purple-600" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  onOpenChangePassword();
                  setShowUserDropdown(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-900 transition-colors cursor-pointer font-medium"
              >
                <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                <span>Change Password</span>
              </button>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
