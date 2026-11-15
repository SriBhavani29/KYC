import express from 'express';
import { db } from '../data/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/payments - List payments with filters
router.get('/', authenticate, (req, res) => {
  const { status, category, search, cycle } = req.query;
  const data = db.read();
  let list = [...data.payments];

  if (status && status !== 'All') {
    list = list.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }

  if (category && category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => 
      p.recipientName.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.referenceNo && p.referenceNo.toLowerCase().includes(q)) ||
      (p.beneficiaryPhone && p.beneficiaryPhone.includes(q))
    );
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.paymentDate || b.dueDate || 0) - new Date(a.paymentDate || a.dueDate || 0));

  // Compute payment summaries
  const totalPaid = list.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = list.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const totalFailed = list.filter(p => p.status === 'Failed').reduce((sum, p) => sum + p.amount, 0);

  res.json({
    total: list.length,
    metrics: {
      totalPaid,
      totalPending,
      totalFailed
    },
    payments: list
  });
});

// POST /api/payments/:id/status - Update payment status (Paid / Pending / Failed)
router.post('/:id/status', authenticate, (req, res) => {
  const { id } = req.params;
  const { status, referenceNo, notes } = req.body;

  if (!status || !['Paid', 'Pending', 'Failed'].includes(status)) {
    return res.status(400).json({ error: 'Status must be Paid, Pending, or Failed' });
  }

  const data = db.read();
  const payment = data.payments.find(p => p.id === id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment record not found' });
  }

  const prevStatus = payment.status;
  payment.status = status;
  if (notes) payment.notes = notes;
  if (referenceNo) payment.referenceNo = referenceNo;

  if (status === 'Paid') {
    payment.paymentDate = new Date().toISOString();
  } else if (status === 'Pending') {
    payment.paymentDate = null;
  }

  if (prevStatus === 'Pending' && status !== 'Pending' && payment.assignedTo) {
    db.decrementUserLoad(payment.assignedTo);
  }

  db.write(data);
  db.addAudit('PAYMENT_STATUS_UPDATE', payment.id, req.user.name, `Updated payment ${payment.id} status to ${status} for ${payment.recipientName} (₹${payment.amount})`);

  res.json({ success: true, payment });
});

// POST /api/payments - Manually generate or schedule a new subscription / disbursement
router.post('/', authenticate, (req, res) => {
  const { category, recipientName, beneficiaryPhone, bankAccountNo, ifscCode, amount, cycle, paymentMethod } = req.body;

  if (!recipientName || !amount) {
    return res.status(400).json({ error: 'Recipient name and amount are required' });
  }

  const data = db.read();
  const payWorker = db.getNextAvailableWorker('Payments Team');
  const now = new Date().toISOString();

  const newPay = {
    id: `PAY-TXN-${Date.now().toString().slice(-4)}`,
    category: category || 'Vendor',
    kycRefId: null,
    recipientName,
    beneficiaryPhone: beneficiaryPhone || '9800000000',
    bankAccountNo: bankAccountNo || '123456789012',
    ifscCode: ifscCode || 'HDFC0001234',
    amount: Number(amount),
    monthlyFee: category === 'Vendor' ? 1000 : Number(amount),
    cycle: cycle || (category === 'Vendor' ? 'Cycle 1 (₹500 / ₹1,000 monthly tier)' : 'Monthly Payment Cycle'),
    status: 'Pending',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentDate: null,
    paymentMethod: paymentMethod || 'Direct Bank NEFT/RTGS',
    referenceNo: `MAN-PAY-${Math.floor(1000 + Math.random() * 9000)}`,
    assignedTo: payWorker ? payWorker.id : null,
    assignedName: payWorker ? payWorker.name : 'Payments Team Queue',
    notes: 'Created via payments management module.'
  };

  data.payments.unshift(newPay);
  if (payWorker) db.incrementUserLoad(payWorker.id);
  db.write(data);

  db.addAudit('PAYMENT_CREATED', newPay.id, req.user.name, `Scheduled new payment of ₹${newPay.amount} for ${newPay.recipientName}`);
  res.status(201).json(newPay);
});

export default router;

