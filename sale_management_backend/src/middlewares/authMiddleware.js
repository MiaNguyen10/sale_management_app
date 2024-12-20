const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT tokens.
 */
const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: 'Bearer TOKEN'

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.organization = decoded; // Attach decoded info to request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
