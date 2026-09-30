const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'swachhta_green_compliance_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
