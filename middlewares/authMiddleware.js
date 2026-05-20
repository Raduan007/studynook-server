const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get token from HTTP-only cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user info to request
    req.user = decoded;
    
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = {
  verifyToken
};
