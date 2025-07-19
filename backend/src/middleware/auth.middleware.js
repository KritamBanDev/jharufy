import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { catchAsync } from "../utils/errorHandler.js";
import { AppError } from "../utils/errorHandler.js";

export const protectRoute = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  
  console.log('🔍 Auth Debug - URL:', req.originalUrl);
  console.log('🍪 Cookies:', req.cookies);
  console.log('📋 Headers Authorization:', req.headers.authorization);
  
  // Check for token in cookies first (for browser requests)
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
    console.log('✅ Found JWT in cookies');
  }
  // Check for Bearer token in Authorization header (for API requests)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('✅ Found JWT in Authorization header');
  }

  if (!token) {
    console.log('❌ No token found');
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.userId).select("-password");
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // 4) Grant access to protected route
  req.user = currentUser;
  next();
});