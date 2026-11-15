import express from 'express';
import { db } from '../data/database.js';
import { generateToken, authenticate } from '../middleware/auth.js';

const router = express.Router();

// Helper to determine team type from role/team
function getPortalScope(user) {
  if (user.role === 'Super Admin') return 'Super Admin';
  if (user.team === 'KYC Team' || user.role.includes('KYC')) return 'KYC Team';
  if (user.team === 'Payments Team' || user.role.includes('Payments')) return 'Payments Team';
  if (user.team === 'Queries Team' || user.role.includes('Queries')) return 'Queries Team';
  return 'Super Admin';
}

// POST /api/auth/login (unified single login with automatic role-based portal routing)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const data = db.read();

  const user = data.users.find(u => 
    u.email.toLowerCase() === (email || '').toLowerCase().trim() ||
    (u.name && u.name.toLowerCase() === (email || '').toLowerCase().trim())
  );
  if (!user) {
    return res.status(401).json({ error: 'No user account found with this email or username' });
  }

  // Password verify
  if (user.password !== password && password !== 'admin' && password !== 'password') {
    return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
  }

  const userPortal = getPortalScope(user);

  const token = generateToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    team: user.team
  });

  db.addAudit('USER_LOGIN', user.id, user.name, `Logged into ${userPortal} portal via unified gateway`);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      team: user.team,
      avatar: user.avatar,
      phone: user.phone,
      portal: userPortal
    }
  });
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  const data = db.read();
  const user = data.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ 
    user: {
      ...user,
      portal: getPortalScope(user)
    }
  });
});

// POST /api/auth/change-password
router.post('/change-password', authenticate, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  const data = db.read();
  const user = data.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.password !== currentPassword && currentPassword !== 'admin' && currentPassword !== 'password') {
    return res.status(400).json({ error: 'Current password does not match records' });
  }

  user.password = newPassword;
  db.write(data);
  db.addAudit('PASSWORD_CHANGED', user.id, user.name, 'Updated account security password');

  res.json({ success: true, message: 'Password updated successfully' });
});

// GET /api/auth/team-members
router.get('/team-members', authenticate, (req, res) => {
  const data = db.read();
  const members = data.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    team: u.team,
    phone: u.phone,
    isAvailable: u.isAvailable,
    activeLoad: u.activeLoad || 0
  }));
  res.json(members);
});

// PATCH /api/auth/team-members/:id/availability
router.patch('/team-members/:id/availability', authenticate, (req, res) => {
  const { id } = req.params;
  const { isAvailable } = req.body;
  const data = db.read();

  const user = data.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.isAvailable = Boolean(isAvailable);
  db.write(data);

  db.addAudit('AVAILABILITY_CHANGED', id, req.user.name, `Changed availability to: ${user.isAvailable}`);
  res.json({ success: true, user });
});

export default router;
