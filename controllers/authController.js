const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { email, uid } = req.body;
    
    // The user is already authenticated by Firebase on the frontend.
    // We just need to issue a JWT session cookie for the API.
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Use Firebase UID as the internal ID
    const user = { id: uid || '12345', email };

    // 1. Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } // Token valid for 1 day
    );

    // 2. Store token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 24 * 60 * 60 * 1000 
    });

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

const logout = (req, res) => {
  // 3. Clear the cookie on logout
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  });
  
  res.status(200).json({ message: 'Logged out successfully' });
};

// Example protected controller
const getProfile = (req, res) => {
  // req.user is attached by the verifyToken middleware
  res.status(200).json({ message: 'Profile data retrieved', user: req.user });
}

module.exports = {
  login,
  logout,
  getProfile
};
