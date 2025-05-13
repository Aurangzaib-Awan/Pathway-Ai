// backend/routes/profile.js
const router = require('express').Router();
const User   = require('../models/User');
const auth   = require('../middleware/auth');  // your JWT-checker

// GET /api/profile
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json(user);
});

module.exports = router;
