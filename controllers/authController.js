const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Example validation (replace with actual DB check)
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Mock user data
    const user = { id: '12345', email };

    // 1. Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } // Token valid for 1 day
    );

    // 2. Store token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevents client-side JS from reading the cookie
      secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
      sameSite: 'strict', // Protects against CSRF attacks
      maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
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
    sameSite: 'strict',
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
