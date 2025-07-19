import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'test_secret_for_jest',
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'test_secret_for_jest');
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'test_refresh_secret',
    { expiresIn: '30d' }
  );
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'test_refresh_secret');
};
