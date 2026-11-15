import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  CreditCard, 
  HelpCircle, 
  Store, 
  Users2, 
  Briefcase, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Users, 
  BarChart3, 
  UserCircle, 
  Settings, 
  LogOut, 
  KeyRound, 
  ChevronDown 
} from 'lucide-react';
import { useAuth, PORTALS } from '../context/AuthContext';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  onOpenChangePassword 
}) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const portal = user?.portal || PORTALS.SUPER_ADMIN;

  const superAdminNav = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, section: 'Core' },
    { id: 'kyc', label: 'KYC Verification', icon: FileCheck2, badge: 'All Leads', section: 'Core' },
    { id: 'payments', label: 'Payments & Subscriptions', icon: CreditCard, section: 'Core' },
    { id: 'queries', label: 'Query Support Desk', icon: HelpCircle, section: 'Core' },

    { id: 'vendors', label: 'Vendors (₹1k Dual Cycle)', icon: Store, section: 'Directories' },
    { id: 'customers', label: 'Customers', icon: Users2, section: 'Directories' },
    { id: 'agents', label: 'Agents', icon: Briefcase, section: 'Directories' },
    { id: 'managers', label: 'Managers', icon: ShieldCheck, section: 'Directories' },
    { id: 'delivery', label: 'Delivery Partners', icon: Truck, section: 'Directories' },
    { id: 'technicians', label: 'Technicians', icon: Wrench, section: 'Directories' },

    { id: 'teams', label: 'Teams & Workload', icon: Users, section: 'Governance' },
    { id: 'reports', label: 'Audit & Compliance Reports', icon: BarChart3, section: 'Governance' },
    { id: 'profile', label: 'Admin Profile', icon: UserCircle, section: 'Account' },
    { id: 'settings', label: 'System Configuration', icon: Settings, section: 'Account' }
  ];

  const kycTeamNav = [
    { id: 'dashboard', label: 'KYC Operations Dashboard', icon: LayoutDashboard, section: 'Operations' },
    { id: 'kyc', label: 'KYC Verification Queue', icon: FileCheck2, badge: 'Review', section: 'Operations' },
    { id: 'vendors', label: 'Vendor Documents', icon: Store, section: 'Verification' },
    { id: 'customers', label: 'Customer Documents', icon: Users2, section: 'Verification' },
    { id: 'agents', label: 'Agent Documents', icon: Briefcase, section: 'Verification' },
    { id: 'delivery', label: 'Delivery Partner Docs', icon: Truck, section: 'Verification' },
    { id: 'technicians', label: 'Technician Docs', icon: Wrench, section: 'Verification' },
    { id: 'reports', label: 'KYC Compliance Reports', icon: BarChart3, section: 'Governance' },
    { id: 'profile', label: 'Officer Profile', icon: UserCircle, section: 'Account' }
  ];

  const paymentsTeamNav = [
    { id: 'dashboard', label: 'Payments Executive View', icon: LayoutDashboard, section: 'Disbursements' },
    { id: 'payments', label: 'Collections & Runs', icon: CreditCard, badge: '2 Cycles', section: 'Disbursements' },
    { id: 'vendors', label: 'Vendor Subscriptions', icon: Store, section: 'Ledgers' },
    { id: 'customers', label: 'Customer Billing', icon: Users2, section: 'Ledgers' },
    { id: 'agents', label: 'Agent Commission Payouts', icon: Briefcase, section: 'Ledgers' },
    { id: 'delivery', label: 'Delivery Driver Payouts', icon: Truck, section: 'Ledgers' },
    { id: 'technicians', label: 'Technician Payouts', icon: Wrench, section: 'Ledgers' },
    { id: 'reports', label: 'Reconciliation Reports', icon: BarChart3, section: 'Governance' },
    { id: 'profile', label: 'Accountant Profile', icon: UserCircle, section: 'Account' }
  ];

  const queriesTeamNav = [
    { id: 'dashboard', label: 'Query SLA Dashboard', icon: LayoutDashboard, section: 'Helpdesk' },
    { id: 'queries', label: 'Support Ticket Desk', icon: HelpCircle, badge: 'Tickets', section: 'Helpdesk' },
    { id: 'customers', label: 'Customer Inquiries', icon: Users2, section: 'User Help' },
    { id: 'vendors', label: 'Vendor Inquiries', icon: Store, section: 'User Help' },
    { id: 'agents', label: 'Agent Inquiries', icon: Briefcase, section: 'User Help' },
    { id: 'reports', label: 'SLA Resolution Reports', icon: BarChart3, section: 'Governance' },
    { id: 'profile', label: 'Support Officer Profile', icon: UserCircle, section: 'Account' }
  ];

  let currentNav = superAdminNav;
  let portalThemeLabel = 'Super Admin Portal';

  if (portal === PORTALS.KYC) {
    currentNav = kycTeamNav;
    portalThemeLabel = 'KYC Team Portal';
  } else if (portal === PORTALS.PAYMENTS) {
    currentNav = paymentsTeamNav;
    portalThemeLabel = 'Payments Team Portal';
  } else if (portal === PORTALS.QUERIES) {
    currentNav = queriesTeamNav;
    portalThemeLabel = 'Queries Team Portal';
  }

  const sections = Array.from(new Set(currentNav.map(n => n.section)));

  return (
    <aside className="w-64 bg-[#111827] border-r border-gray-800 flex flex-col h-screen select-none shrink-0 relative shadow-xl z-30 text-gray-200">
      {/* Brand Header with Official Logo */}
      <div className="p-4 border-b border-gray-800 bg-[#0b0f19]">
        <div className="flex items-center space-x-3 mb-2.5">
          <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-md flex items-center justify-center shrink-0 overflow-hidden border border-gray-700">
            <img 
              src="/forge-logo.png" 
              alt="Forge India Connect" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <h1 className="font-black tracking-tight text-white text-sm leading-none">FORGE INDIA</h1>
            <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">CONNECT ENTERPRISE</span>
          </div>
        </div>

        {/* Portal Identifier Tag */}
        <div className="p-2 rounded-xl bg-gray-800/90 border border-gray-700/80 flex items-center justify-between shadow-xs">
          <span className="text-[11px] font-bold text-gray-200">{portalThemeLabel}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" title="Active Session" />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sections.map(sec => {
          const items = currentNav.filter(n => n.section === sec);
          return (
            <div key={sec} className="space-y-1">
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">
                {sec}
              </div>
              {items.map(item => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      active
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30 font-bold'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/90 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-gray-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        active ? 'bg-purple-900 text-purple-100 border border-purple-400/30' : 'bg-gray-800 text-gray-300 border border-gray-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User Profile Card */}
      <div className="p-3 border-t border-gray-800 bg-[#0b0f19] relative">
        <div 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center justify-between p-2 rounded-xl bg-gray-800/90 border border-gray-700/80 cursor-pointer hover:border-gray-600 transition-colors shadow-xs"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              {user?.name?.slice(0, 2) || 'OP'}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs font-bold text-white truncate leading-tight">{user?.name}</p>
              <p className="text-[10px] text-gray-400 font-medium truncate">{user?.role}</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        {/* User Flyout Menu */}
        {showUserMenu && (
          <div className="absolute bottom-16 left-3 right-3 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
            <div className="px-3 py-1.5 border-b border-gray-700">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Signed in as</p>
              <p className="text-xs font-bold text-white truncate">{user?.email}</p>
            </div>

            <button
              onClick={() => {
                setCurrentTab('profile');
                setShowUserMenu(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-gray-200 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <UserCircle className="w-3.5 h-3.5 text-gray-400" />
              <span>Operator Profile</span>
            </button>

            <button
              onClick={() => {
                onOpenChangePassword();
                setShowUserMenu(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-gray-200 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-gray-400" />
              <span>Change Password</span>
            </button>

            <div className="pt-1 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/20 font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
