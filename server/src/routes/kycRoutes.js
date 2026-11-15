import express from 'express';
import { db } from '../data/database.js';
import { authenticate } from '../middleware/auth.js';
import { validateKYCSubmission } from '../middleware/validators.js';

const router = express.Router();

// GET /api/kyc - List with filters & pagination
router.get('/', authenticate, (req, res) => {
  const { status, category, search, assignedTo } = req.query;
  const data = db.read();
  let list = [...data.kycRecords];

  if (status && status !== 'All') {
    list = list.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }

  if (category && category !== 'All') {
    list = list.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (assignedTo && assignedTo !== 'All') {
    list = list.filter(item => item.assignedTo === assignedTo);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(item => 
      item.fullName.toLowerCase().includes(q) ||
      item.applicationNo.toLowerCase().includes(q) ||
      item.mobile.includes(q) ||
      (item.businessName && item.businessName.toLowerCase().includes(q))
    );
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  res.json({
    total: list.length,
    records: list
  });
});

// GET /api/kyc/:id - Details
router.get('/:id', authenticate, (req, res) => {
  const data = db.read();
  const record = data.kycRecords.find(k => k.id === req.params.id);
  if (!record) {
    return res.status(404).json({ error: 'KYC Record not found' });
  }
  res.json(record);
});

// POST /api/kyc - Register new KYC application (Auto-assigns to available KYC Agent)
router.post('/', authenticate, (req, res) => {
  const validation = validateKYCSubmission(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ error: 'Validation failed', details: validation.errors });
  }

  const data = db.read();
  const nextWorker = db.getNextAvailableWorker('KYC Team');

  const now = new Date().toISOString();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const prefix = req.body.category.slice(0, 3).toUpperCase();

  const newRecord = {
    id: `KYC-2026-${randomSuffix}`,
    applicationNo: `APP-${prefix}-${randomSuffix}`,
    category: req.body.category,
    fullName: req.body.fullName.trim(),
    businessName: req.body.businessName || 'N/A',
    email: req.body.email || `${req.body.fullName.toLowerCase().replace(/\s+/g, '')}@example.com`,
    mobile: req.body.mobile.trim(),
    bankAccountNo: req.body.bankAccountNo.trim(),
    ifscCode: req.body.ifscCode.trim().toUpperCase(),
    bankName: req.body.bankName || 'Verified Scheduled Bank',
    status: 'Pending',
    assignedTo: nextWorker ? nextWorker.id : null,
    assignedName: nextWorker ? nextWorker.name : 'Unassigned',
    rejectionReason: null,
    reviewedAt: null,
    reviewedBy: null,
    submittedAt: now,
    documents: req.body.documents && req.body.documents.length ? req.body.documents : [
      { 
        type: req.body.category === 'Vendor' ? 'PAN Card & GST' : 'Aadhaar / ID Card', 
        docNo: 'DOC-' + randomSuffix, 
        fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800', 
        verified: false 
      },
      { 
        type: 'Bank Statement / Cheque', 
        docNo: 'BANK-' + randomSuffix, 
        fileUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800', 
        verified: false 
      }
    ],
    address: req.body.address || 'Address provided during onboarding registration',
    paymentProfile: {
      plan: req.body.category === 'Vendor' ? 'Vendor Bi-Monthly Cycles' : 'Standard Tier',
      fee: req.body.category === 'Vendor' ? 1000 : 500
    }
  };

  data.kycRecords.unshift(newRecord);
  db.write(data);

  if (nextWorker) {
    db.incrementUserLoad(nextWorker.id);
  }

  db.addAudit('KYC_CREATED', newRecord.id, req.user.name, `New KYC application registered for ${newRecord.fullName} (${newRecord.category}). Auto-assigned to ${newRecord.assignedName}`);
  db.addNotification('New KYC Application', `Application ${newRecord.applicationNo} received and assigned to ${newRecord.assignedName}`);

  res.status(201).json(newRecord);
});

// POST /api/kyc/:id/review - Approve or Reject
router.post('/:id/review', authenticate, (req, res) => {
  const { id } = req.params;
  const { action, rejectionReason } = req.body; // action: 'approve' | 'reject'

  if (!action || !['approve', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Action must be either "approve" or "reject"' });
  }

  if (action === 'reject' && (!rejectionReason || rejectionReason.trim().length < 5)) {
    return res.status(400).json({ error: 'Rejection reason is mandatory (minimum 5 characters).' });
  }

  const data = db.read();
  const record = data.kycRecords.find(k => k.id === id);
  if (!record) {
    return res.status(404).json({ error: 'KYC Record not found' });
  }

  const previousStatus = record.status;
  const now = new Date().toISOString();

  if (action === 'approve') {
    record.status = 'Approved';
    record.rejectionReason = null;
    record.reviewedAt = now;
    record.reviewedBy = req.user.id;

    // Check all documents as verified
    if (record.documents) {
      record.documents.forEach(d => { d.verified = true; });
    }

    // Append to activity history
    if (!record.activityHistory) record.activityHistory = [];
    record.activityHistory.unshift({
      action: 'APPROVED',
      actorName: req.user.name,
      actorRole: req.user.role,
      timestamp: now,
      details: `Application approved by ${req.user.name} (${req.user.role}). All documents verified.`
    });

    // AUTOMATIC FLOW: Approved KYC automatically moves to the Payments Team
    const payWorker = db.getNextAvailableWorker('Payments Team');
    const payAmount = record.category === 'Vendor' ? 500 : (record.paymentProfile?.fee || 1000);
    const cycleDesc = record.category === 'Vendor' ? 'Cycle 1 (1st-15th Monthly Subscription)' : 'Monthly Subscription Cycle';

    const newPayment = {
      id: `PAY-TXN-${Date.now().toString().slice(-4)}`,
      category: record.category,
      kycRefId: record.id,
      recipientName: record.businessName !== 'N/A' ? record.businessName : record.fullName,
      beneficiaryPhone: record.mobile,
      bankAccountNo: record.bankAccountNo,
      ifscCode: record.ifscCode,
      amount: payAmount,
      monthlyFee: record.category === 'Vendor' ? 1000 : payAmount,
      cycle: cycleDesc,
      status: 'Pending',
      paymentDate: null,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentMethod: 'Auto-Debit Nach / UPI',
      referenceNo: `AUTO-PAY-${record.applicationNo}`,
      assignedTo: payWorker ? payWorker.id : null,
      assignedName: payWorker ? payWorker.name : 'Payments Team Queue',
      notes: `Automated handover from Approved KYC ${record.applicationNo} (${record.fullName}).`
    };

    data.payments.unshift(newPayment);
    if (payWorker) db.incrementUserLoad(payWorker.id);

    db.addAudit('KYC_APPROVED', record.id, req.user.name, `Approved KYC ${record.applicationNo}. Dispatched subscription pipeline to Payments Team (${newPayment.assignedName}).`);
    db.addNotification('KYC Approved & Handover', `KYC for ${record.fullName} approved. Forwarded to Payments Team.`);
  } else {
    record.status = 'Rejected';
    record.rejectionReason = rejectionReason.trim();
    record.reviewedAt = now;
    record.reviewedBy = req.user.id;

    // Append to activity history
    if (!record.activityHistory) record.activityHistory = [];
    record.activityHistory.unshift({
      action: 'REJECTED',
      actorName: req.user.name,
      actorRole: req.user.role,
      timestamp: now,
      details: `Application rejected by ${req.user.name}. Reason: ${record.rejectionReason}`
    });

    // Send instant SMS & Email notification simulation to applicant
    const notificationLog = {
      id: `NOTIF-SMS-${Date.now()}`,
      applicantName: record.fullName,
      mobile: record.mobile,
      email: record.email,
      applicationNo: record.applicationNo,
      type: 'REJECTION_NOTICE',
      reason: record.rejectionReason,
      message: `Dear ${record.fullName}, your KYC application (${record.applicationNo}) was rejected. Reason: ${record.rejectionReason}. Please re-upload valid documents.`,
      dispatchedAt: now,
      status: 'DELIVERED'
    };

    // Auto-create a ticket in Queries Team for applicant follow-up
    const queryWorker = db.getNextAvailableWorker('Queries Team');
    const followUpQuery = {
      id: `QRY-AUTO-${Date.now().toString().slice(-4)}`,
      ticketNo: `TICK-REJ-${record.applicationNo.slice(-4)}`,
      category: record.category,
      applicantName: record.fullName,
      subject: `KYC Rejection Follow-up: ${record.applicationNo}`,
      description: `Application rejected with reason: "${record.rejectionReason}". Applicant notified via SMS to ${record.mobile} and Email to ${record.email}.`,
      priority: 'High',
      status: 'Open',
      assignedTo: queryWorker ? queryWorker.id : null,
      assignedName: queryWorker ? queryWorker.name : 'Queries Support Helpdesk',
      createdAt: now,
      resolvedAt: null,
      messages: [
        {
          sender: 'System Bot',
          role: 'System',
          message: `Applicant notification dispatched. Rejection reason recorded: "${record.rejectionReason}"`,
          timestamp: now
        }
      ]
    };
    data.queries.unshift(followUpQuery);
    if (queryWorker) db.incrementUserLoad(queryWorker.id);

    db.addAudit('KYC_REJECTED', record.id, req.user.name, `Rejected KYC ${record.applicationNo}. Reason: ${record.rejectionReason}. Notification SMS & Query ticket dispatched.`);
    db.addNotification('KYC Application Rejected', `KYC for ${record.fullName} rejected: "${record.rejectionReason}". Applicant notified via SMS.`, 'urgent');
  }

  // Release active load from reviewer
  if (previousStatus === 'Pending' && record.assignedTo) {
    db.decrementUserLoad(record.assignedTo);
  }

  db.write(data);
  res.json({ success: true, record });
});

// POST /api/kyc/:id/reassign - TL or Super Admin manual re-assignment
router.post('/:id/reassign', authenticate, (req, res) => {
  const { id } = req.params;
  const { assignedTo } = req.body;

  const data = db.read();
  const record = data.kycRecords.find(k => k.id === id);
  if (!record) return res.status(404).json({ error: 'KYC Record not found' });

  const targetUser = data.users.find(u => u.id === assignedTo);
  if (!targetUser) return res.status(400).json({ error: 'Target assignee user not found' });

  const oldAssigneeId = record.assignedTo;
  if (oldAssigneeId && record.status === 'Pending') {
    db.decrementUserLoad(oldAssigneeId);
  }

  const oldAssigneeName = record.assignedName;
  record.assignedTo = targetUser.id;
  record.assignedName = targetUser.name;

  if (record.status === 'Pending') {
    db.incrementUserLoad(targetUser.id);
  }

  const now = new Date().toISOString();
  if (!record.activityHistory) record.activityHistory = [];
  record.activityHistory.unshift({
    action: 'TRANSFERRED',
    actorName: req.user.name,
    actorRole: req.user.role,
    timestamp: now,
    details: `Transferred application from ${oldAssigneeName || 'Unassigned'} to ${targetUser.name} (${targetUser.team}).`
  });

  db.write(data);
  db.addAudit('KYC_REASSIGNED', record.id, req.user.name, `Reassigned application ${record.applicationNo} to ${targetUser.name}`);

  res.json({ success: true, record });
});

// POST /api/kyc/:id/resubmit - Resubmit a rejected application for re-verification
router.post('/:id/resubmit', authenticate, (req, res) => {
  const { id } = req.params;
  const { correctionNotes } = req.body;

  const data = db.read();
  const record = data.kycRecords.find(k => k.id === id);
  if (!record) return res.status(404).json({ error: 'KYC Record not found' });

  const now = new Date().toISOString();
  record.status = 'Pending';
  const previousReason = record.rejectionReason;
  record.rejectionReason = null;
  record.reviewedAt = null;
  record.reviewedBy = null;
  record.submittedAt = now;

  // Increment load for the assigned agent since it is active again
  if (record.assignedTo) {
    db.incrementUserLoad(record.assignedTo);
  }

  // Activity History Entry
  if (!record.activityHistory) record.activityHistory = [];
  record.activityHistory.unshift({
    action: 'RESUBMITTED',
    actorName: req.user.name,
    actorRole: req.user.role,
    timestamp: now,
    details: `Application resubmitted for re-verification.${correctionNotes ? ` Notes: "${correctionNotes}"` : ''} (Previous Rejection: "${previousReason || 'N/A'}")`
  });

  db.write(data);
  db.addAudit(
    'KYC_RESUBMITTED',
    record.id,
    req.user.name,
    `Resubmitted KYC ${record.applicationNo} (${record.fullName}) for re-verification. Assigned to ${record.assignedName}.`
  );
  db.addNotification(
    'KYC Resubmitted',
    `Application ${record.applicationNo} (${record.fullName}) was resubmitted for re-verification.`,
    'info'
  );

  res.json({ success: true, record });
});

export default router;

