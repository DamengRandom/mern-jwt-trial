const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    
    if (!token) {
      res.status(401).json({ error: 'No authentication token, authorization denied ..' });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) {
      res.status(403).json({ error: 'Token verification failed, authorization denied ..' });
    }

    // get token verify response id
    req.user = verified.id;

    next();
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

module.exports = auth;