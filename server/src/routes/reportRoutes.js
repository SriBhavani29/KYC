import express from 'express';
import { db } from '../data/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reports/dashboard - Aggregated KPIs and role-based data
router.get('/dashboard', authenticate, (req, res) => {
  const data = db.read();
  const user = req.user;

  // 1. KYC Metrics
  const totalKYC = data.kycRecords.length;
  const pendingKYC = data.kycRecords.filter(k => k.status === 'Pending').length;
  const approvedKYC = data.kycRecords.filter(k => k.status === 'Approved').length;
  const rejectedKYC = data.kycRecords.filter(k => k.status === 'Rejected').length;

  // Category-wise KYC
  const kycCategories = ['Vendor', 'Customer', 'Agent', 'Manager', 'Delivery Partner', 'Technician'];
  const categoryBreakdown = kycCategories.map(cat => ({
    name: cat,
    count: data.kycRecords.filter(k => k.category.toLowerCase() === cat.toLowerCase()).length,
    approved: data.kycRecords.filter(k => k.category.toLowerCase() === cat.toLowerCase() && k.status === 'Approved').length
  }));

  // 2. Payments Metrics
  const totalCollections = data.payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const totalPendingPayments = data.payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);
  const totalFailedPayments = data.payments.filter(p => p.status === 'Failed').reduce((s, p) => s + p.amount, 0);

  // 3. Queries Metrics
  const totalQueries = data.queries.length;
  const openQueries = data.queries.filter(q => q.status === 'Open').length;
  const inProgressQueries = data.queries.filter(q => q.status === 'In Progress').length;
  const resolvedQueries = data.queries.filter(q => q.status === 'Resolved').length;

  const resolvedWithTime = data.queries.filter(q => q.resolutionTimeMin != null);
  const avgResolutionTimeMin = resolvedWithTime.length 
    ? Math.round(resolvedWithTime.reduce((s, q) => s + q.resolutionTimeMin, 0) / resolvedWithTime.length) 
    : 45;

  // 4. Employee Workload & Performance
  const employees = data.users.map(u => {
    const assignedKYC = data.kycRecords.filter(k => k.assignedTo === u.id);
    const completedKYC = assignedKYC.filter(k => k.status !== 'Pending').length;
    const assignedQueries = data.queries.filter(q => q.assignedTo === u.id);
    const resolvedQ = assignedQueries.filter(q => q.status === 'Resolved').length;
    const assignedPayments = data.payments.filter(p => p.assignedTo === u.id);

    return {
      id: u.id,
      name: u.name,
      team: u.team,
      role: u.role,
      isAvailable: u.isAvailable,
      activeLoad: u.activeLoad || 0,
      totalAssignedKYC: assignedKYC.length,
      completedKYC,
      totalQueries: assignedQueries.length,
      resolvedQueries: resolvedQ,
      assignedPayments: assignedPayments.length
    };
  });

  // 5. Team-wise distribution
  const teamPerformance = [
    {
      team: 'KYC Team',
      assigned: data.kycRecords.length,
      completed: approvedKYC + rejectedKYC,
      pending: pendingKYC,
      slaRate: '96.4%'
    },
    {
      team: 'Payments Team',
      assigned: data.payments.length,
      completed: data.payments.filter(p => p.status === 'Paid').length,
      pending: data.payments.filter(p => p.status === 'Pending').length,
      slaRate: '98.1%'
    },
    {
      team: 'Queries Team',
      assigned: data.queries.length,
      completed: resolvedQueries,
      pending: openQueries + inProgressQueries,
      slaRate: '94.2%'
    }
  ];

  // 6. Trend / Chart Data
  const monthlyTrends = [
    { month: 'Jun', kyc: 42, payments: 38000, queries: 28 },
    { month: 'Jul', kyc: 58, payments: 52000, queries: 35 },
    { month: 'Aug', kyc: 72, payments: 69000, queries: 40 },
    { month: 'Sep', kyc: 85, payments: 81000, queries: 51 },
    { month: 'Oct', kyc: 110, payments: 104000, queries: 62 },
    { month: 'Nov', kyc: totalKYC, payments: totalCollections, queries: totalQueries }
  ];

  res.json({
    userRole: user.role,
    userTeam: user.team,
    kpi: {
      totalKYC,
      pendingKYC,
      approvedKYC,
      rejectedKYC,
      totalCollections,
      totalPendingPayments,
      totalFailedPayments,
      totalQueries,
      openQueries,
      inProgressQueries,
      resolvedQueries,
      avgResolutionTimeMin
    },
    categoryBreakdown,
    employees,
    teamPerformance,
    monthlyTrends,
    recentAudits: data.auditLogs.slice(0, 10),
    notifications: data.notifications
  });
});

export default router;

