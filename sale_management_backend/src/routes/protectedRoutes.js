const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Example protected route
router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Welcome, ${req.organization.username}!` });
});

module.exports = router;