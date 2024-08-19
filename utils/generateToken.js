const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, process.env.JWT_SECRET || "your_default_secret_key", { expiresIn: '24h' });
};

module.exports = generateToken;