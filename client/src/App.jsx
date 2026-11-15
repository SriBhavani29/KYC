import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth, PORTALS } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard'; // Super Admin Executive Dashboard
import KYCDashboard from './pages/KYCDashboard'; // KYC Team Dedicated Dashboard
import PaymentsDashboard from './pages/PaymentsDashboard'; // Payments Team Dedicated Dashboard
import QueriesDashboard from './pages/QueriesDashboard'; // Queries Team Dedicated Dashboard
import KYCVerification from './pages/KYCVerification';
import Payments from './pages/Payments';
import Queries from './pages/Queries';
import VendorsView from './pages/VendorsView';
import GenericPersonaView from './pages/GenericPersonaView';
import TeamsView from './pages/TeamsView';
import ReportsView from './pages/ReportsView';
import ProfileView from './pages/ProfileView';
import SettingsView from './pages/SettingsView';
import KYCDetailModal from './components/KYCDetailModal';
import RegisterEntityModal from './components/RegisterEntityModal';
import ChangePasswordModal from './components/ChangePasswordModal';

function AuthenticatedApp() {
  const { user, token, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [kycRecords, setKycRecords] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentMetrics, setPaymentMetrics] = useState({});
  const [queries, setQueries] = useState([]);
  const [queryMetrics, setQueryMetrics] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  
  // Modals
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const portal = user?.portal || PORTALS.SUPER_ADMIN;

  // Fetch all initial data from server
  const fetchAllData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // 1. Dashboard Reports
      const resReports = await fetch('/api/reports/dashboard', { headers });
      if (resReports.ok) {
        const d = await resReports.json();
        setDashboardData(d);
        if (d.employees) setTeamMembers(d.employees);
      }

      // 2. KYC Records
      const resKyc = await fetch('/api/kyc', { headers });
      if (resKyc.ok) {
        const k = await resKyc.json();
        setKycRecords(k.records || []);
      }

      // 3. Payments
      const resPay = await fetch('/api/payments', { headers });
      if (resPay.ok) {
        const p = await resPay.json();
        setPayments(p.payments || []);
        setPaymentMetrics(p.metrics || {});
      }

      // 4. Queries
      const resQry = await fetch('/api/queries', { headers });
      if (resQry.ok) {
        const q = await resQry.json();
        setQueries(q.queries || []);
        setQueryMetrics(q.metrics || {});
      }
    } catch (err) {
      console.error('Data sync failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
      setCurrentTab('dashboard'); // Always redirect to team's dashboard upon login
    }
  }, [user, token]);

  // Review KYC (Approve / Reject)
  const handleReviewKYC = async (id, action, rejectionReason) => {
    try {
      const res = await fetch(`/api/kyc/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, rejectionReason })
      });
      if (res.ok) {
        setSelectedRecord(null);
        await fetchAllData();
      } else {
        const err = await res.json();
        alert(err.error || 'Action failed');
      }
    } catch (e) {
      alert('Error updating KYC: ' + e.message);
    }
  };

  // Reassign KYC
  const handleReassignKYC = async (id, assignedTo) => {
    try {
      const res = await fetch(`/api/kyc/${id}/reassign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ assignedTo })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchAllData();
        setSelectedRecord(data.record || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Resubmit Rejected KYC for Re-verification
  const handleResubmitKYC = async (id, correctionNotes) => {
    try {
      const res = await fetch(`/api/kyc/${id}/resubmit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ correctionNotes })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchAllData();
        setSelectedRecord(data.record || null);
      } else {
        const err = await res.json();
        alert(err.error || 'Resubmit failed');
      }
    } catch (e) {
      alert('Error resubmitting KYC: ' + e.message);
    }
  };

  // Payment Status Update
  const handleUpdatePaymentStatus = async (id, status, notes) => {
    try {
      const res = await fetch(`/api/payments/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Query Reply
  const handleQueryReply = async (id, message, status) => {
    try {
      const res = await fetch(`/api/queries/${id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message, status })
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create Query
  const handleCreateQuery = async (queryData) => {
    try {
      const res = await fetch('/api/queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(queryData)
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Employee availability toggle
  const handleToggleAvailability = async (id, isAvailable) => {
    try {
      const res = await fetch(`/api/auth/team-members/${id}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isAvailable })
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard': 
        if (portal === PORTALS.KYC) return 'KYC Team Operations Dashboard';
        if (portal === PORTALS.PAYMENTS) return 'Payments & Subscriptions Dashboard';
        if (portal === PORTALS.QUERIES) return 'Queries & SLA Dashboard';
        return 'Super Admin Global Operations Control';
      case 'kyc': return 'KYC Applications Verification';
      case 'payments': return 'Payments & Subscription Cycles';
      case 'queries': return 'Queries & SLA Management';
      case 'vendors': return 'Vendors Directory (₹1,000/mo Dual Cycle)';
      case 'customers': return 'Customers Directory';
      case 'agents': return 'Agents & Financial Partners';
      case 'managers': return 'Operational Managers';
      case 'delivery': return 'Delivery Partners';
      case 'technicians': return 'Technicians & Field Specialists';
      case 'teams': return 'Teams, Officers & Load Distribution';
      case 'reports': return 'Executive Analytics & Audit Reports';
      case 'profile': return 'User Profile & Identity';
      case 'settings': return 'Enterprise System Settings';
      default: return `${portal} Operations`;
    }
  };

  // Render team-specific Dashboard when on 'dashboard' tab
  const renderDashboard = () => {
    if (portal === PORTALS.KYC) {
      return (
        <KYCDashboard
          data={dashboardData}
          records={kycRecords}
          onRefresh={fetchAllData}
          onNavigate={(tab) => setCurrentTab(tab)}
          onSelectRecord={(r) => setSelectedRecord(r)}
        />
      );
    }
    if (portal === PORTALS.PAYMENTS) {
      return (
        <PaymentsDashboard
          payments={payments}
          metrics={paymentMetrics}
          onRefresh={fetchAllData}
          onNavigate={(tab) => setCurrentTab(tab)}
        />
      );
    }
    if (portal === PORTALS.QUERIES) {
      return (
        <QueriesDashboard
          queries={queries}
          metrics={queryMetrics}
          onRefresh={fetchAllData}
          onNavigate={(tab) => setCurrentTab(tab)}
        />
      );
    }
    // Default: Super Admin Executive Dashboard with full global visibility
    return (
      <Dashboard 
        data={dashboardData} 
        onRefresh={fetchAllData} 
        onNavigate={(tab) => setCurrentTab(tab)} 
      />
    );
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans">
      {/* Role-Specific Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onOpenChangePassword={() => setShowChangePasswordModal(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar 
          title={getTabTitle()} 
          notifications={dashboardData?.notifications || []}
          onOpenRegister={() => setShowRegisterModal(true)}
          onOpenChangePassword={() => setShowChangePasswordModal(true)}
          onNavigateProfile={() => setCurrentTab('profile')}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50 transition-colors">
          {currentTab === 'dashboard' && renderDashboard()}

          {currentTab === 'kyc' && (
            <KYCVerification 
              records={kycRecords}
              teamMembers={teamMembers}
              onSelectRecord={(r) => setSelectedRecord(r)}
              onRefresh={fetchAllData}
            />
          )}

          {currentTab === 'payments' && (
            <Payments 
              payments={payments}
              metrics={paymentMetrics}
              onUpdateStatus={handleUpdatePaymentStatus}
              onRefresh={fetchAllData}
            />
          )}

          {currentTab === 'queries' && (
            <Queries 
              queries={queries}
              metrics={queryMetrics}
              teamMembers={teamMembers}
              onSendReply={handleQueryReply}
              onCreateQuery={handleCreateQuery}
              onRefresh={fetchAllData}
            />
          )}

          {currentTab === 'vendors' && (
            <VendorsView 
              records={kycRecords}
              payments={payments}
              onSelectRecord={(r) => setSelectedRecord(r)}
            />
          )}

          {currentTab === 'customers' && (
            <GenericPersonaView 
              category="Customer"
              title="Customer Subscriptions & Onboarding"
              description="Review verified individual accounts, monthly membership activations, and identity KYC documents."
              records={kycRecords}
              payments={payments}
              onSelectRecord={(r) => setSelectedRecord(r)}
            />
          )}

          {currentTab === 'agents' && (
            <GenericPersonaView 
              category="Agent"
              title="Agent Compliance & Retainers"
              description="Channel partners and field agents submitting certification, GST, and bank passbooks."
              records={kycRecords}
              payments={payments}
              onSelectRecord={(r) => setSelectedRecord(r)}
            />
          )}

          {currentTab === 'managers' && (
            <GenericPersonaView 
              category="Manager"
              title="Managerial Profiles & Payout Tracking"
              description="Regional hub managers and operations coordinators."
              records={kycRecords}
              payments={payments}
              onSelectRecord={(r) => setSelectedRecord(r)}
            />
          )}

          {currentTab === 'delivery' && (
            <GenericPersonaView 
              category="Delivery Partner"
              title="Delivery Fleet Partners"
              description="Fleet drivers and delivery riders with driving license, Aadhaar, and bank verification."
              records={kycRecords}
              payments={payments}
              onSelectRecord={(r) => setSelectedRecord(r)}
            />
          )}

          {currentTab === 'technicians' && (
            <GenericPersonaView 
              category="Technician"
              title="Field Technicians & Trade Specialists"
              description="Certified electricians, service personnel, and trade repair technicians."
              records={kycRecords}
              payments={payments}
              onSelectRecord={(r) => setSelectedRecord(r)}
            />
          )}

          {currentTab === 'teams' && (
            <TeamsView 
              employees={teamMembers}
              onToggleAvailability={handleToggleAvailability}
              onRefresh={fetchAllData}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView reportData={dashboardData} />
          )}

          {currentTab === 'profile' && (
            <ProfileView />
          )}

          {currentTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* KYC Inspection Modal */}
      {selectedRecord && (
        <KYCDetailModal 
          record={selectedRecord}
          teamMembers={teamMembers}
          onClose={() => setSelectedRecord(null)}
          onReview={handleReviewKYC}
          onReassign={handleReassignKYC}
          onResubmit={handleResubmitKYC}
        />
      )}

      {/* New Entity Registration Modal */}
      {showRegisterModal && (
        <RegisterEntityModal 
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => {
            fetchAllData();
            setCurrentTab('kyc');
          }}
        />
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  // If not logged in, show the 4 separated login portals
  if (!user) {
    return <LoginPage />;
  }
  return <AuthenticatedApp />;
}
