import express from 'express';
import { db } from '../data/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/queries - Query listing with filters
router.get('/', authenticate, (req, res) => {
  const { status, category, priority, search } = req.query;
  const data = db.read();
  let list = [...data.queries];

  if (status && status !== 'All') {
    list = list.filter(q => q.status.toLowerCase() === status.toLowerCase());
  }

  if (category && category !== 'All') {
    list = list.filter(q => q.category.toLowerCase() === category.toLowerCase());
  }

  if (priority && priority !== 'All') {
    list = list.filter(q => q.priority.toLowerCase() === priority.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(item => 
      item.subject.toLowerCase().includes(q) ||
      item.userFullName.toLowerCase().includes(q) ||
      item.ticketNo.toLowerCase().includes(q) ||
      item.mobile.includes(q)
    );
  }

  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalOpen = list.filter(q => q.status === 'Open').length;
  const totalInProgress = list.filter(q => q.status === 'In Progress').length;
  const totalResolved = list.filter(q => q.status === 'Resolved').length;

  res.json({
    total: list.length,
    metrics: {
      open: totalOpen,
      inProgress: totalInProgress,
      resolved: totalResolved
    },
    queries: list
  });
});

// POST /api/queries - Create new query (Auto-assigns to Queries Team agent)
router.post('/', authenticate, (req, res) => {
  const { category, subject, userFullName, userEmail, mobile, message, priority } = req.body;

  if (!subject || !userFullName || !message) {
    return res.status(400).json({ error: 'Subject, Full Name, and Initial Message are required' });
  }

  const data = db.read();
  const nextWorker = db.getNextAvailableWorker('Queries Team');
  const now = new Date().toISOString();
  const ticketNo = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

  const newTicket = {
    id: `QRY-2026-${Math.floor(100 + Math.random() * 900)}`,
    ticketNo,
    category: category || 'Customer',
    subject: subject.trim(),
    userFullName: userFullName.trim(),
    userEmail: userEmail || 'user@example.com',
    mobile: mobile || '9800000000',
    priority: priority || 'Medium',
    status: 'Open',
    assignedTo: nextWorker ? nextWorker.id : null,
    assignedName: nextWorker ? nextWorker.name : 'Queries Support Pool',
    createdAt: now,
    resolvedAt: null,
    resolutionTimeMin: null,
    messages: [
      {
        sender: userFullName.trim(),
        senderType: 'Customer',
        message: message.trim(),
        time: now
      }
    ]
  };

  data.queries.unshift(newTicket);
  if (nextWorker) db.incrementUserLoad(nextWorker.id);
  db.write(data);

  db.addAudit('QUERY_SUBMITTED', newTicket.id, req.user.name, `Submitted query ${ticketNo} by ${userFullName}. Auto-assigned to ${newTicket.assignedName}`);
  db.addNotification('New Support Ticket', `Ticket ${ticketNo} from ${userFullName} assigned to ${newTicket.assignedName}`);

  res.status(201).json(newTicket);
});

// POST /api/queries/:id/reply - Add response / internal note
router.post('/:id/reply', authenticate, (req, res) => {
  const { id } = req.params;
  const { message, status } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  const data = db.read();
  const ticket = data.queries.find(q => q.id === id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  const now = new Date().toISOString();
  ticket.messages.push({
    sender: req.user.name,
    senderType: 'Agent',
    message: message.trim(),
    time: now
  });

  if (status) {
    const prevStatus = ticket.status;
    ticket.status = status;
    if (status === 'Resolved' && prevStatus !== 'Resolved') {
      ticket.resolvedAt = now;
      const createdDate = new Date(ticket.createdAt);
      ticket.resolutionTimeMin = Math.round((new Date(now) - createdDate) / 60000);
      if (ticket.assignedTo) db.decrementUserLoad(ticket.assignedTo);
    }
  }

  db.write(data);
  db.addAudit('QUERY_REPLY', ticket.id, req.user.name, `Responded to query ${ticket.ticketNo}. Status is now: ${ticket.status}`);

  res.json({ success: true, ticket });
});

// POST /api/queries/:id/reassign
router.post('/:id/reassign', authenticate, (req, res) => {
  const { id } = req.params;
  const { assignedTo } = req.body;

  const data = db.read();
  const ticket = data.queries.find(q => q.id === id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  const targetUser = data.users.find(u => u.id === assignedTo);
  if (!targetUser) return res.status(400).json({ error: 'Target assignee user not found' });

  ticket.assignedTo = targetUser.id;
  ticket.assignedName = targetUser.name;
  db.write(data);

  db.addAudit('QUERY_REASSIGNED', ticket.id, req.user.name, `Reassigned ticket ${ticket.ticketNo} to ${targetUser.name}`);
  res.json({ success: true, ticket });
});

export default router;

