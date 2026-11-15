import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kyc-enterprise-secret-key-2026';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired authentication token' });
  }
}

export function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    if (roles.length && !roles.includes(req.user.role) && req.user.role !== 'Super Admin') {
      return res.status(403).json({ 
        error: `Forbidden: requires one of [${roles.join(', ')}] but user has role '${req.user.role}'` 
      });
    }

    next();
  };
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
}

