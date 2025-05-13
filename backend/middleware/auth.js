  // backend/middleware/auth.js
  const jwt = require('jsonwebtoken');

  module.exports = function(req, res, next) {
    const header = req.header('Authorization');
    if (!header) return res.status(401).json({ message: 'No token, authorization denied.' });

    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer')
      return res.status(401).json({ message: 'Malformed token.' });

    try {
      const payload = jwt.verify(parts[1], process.env.JWT_SECRET);
      req.userId = payload.id;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid.' });
    }
  };
