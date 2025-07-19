import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { catchAsync } from "../utils/errorHandler.js";
import { AppError } from "../utils/errorHandler.js";

const signToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

// Utility function to generate consistent avatar URLs based on user ID
const generateConsistentAvatar = (userId) => {
  // Use the user ID to generate a consistent random number
  const seed = parseInt(userId.slice(-8), 16);
  const avatarId = (seed % 1000) + 1;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarId}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&radius=50`;
};

export const signup = catchAsync(async (req, res, next) => {
  const { email, password, fullName } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already exists. Please use a different email!', 400));
  }

  const idx = Math.floor(Math.random() * 1000) + 1;
  const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&radius=50`;

  const newUser = await User.create({
    email,
    fullName,
    password,
    profilePic: randomAvatar,
  });

  // Create the User in Stream
  try {
    await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName,
      image: newUser.profilePic || "",
    });
    console.log(`Stream user created successfully for ${newUser.fullName}`);
  } catch (error) {
    console.error("Error creating Stream user:", error.message);
    // Don't fail the signup if Stream user creation fails
  }

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    return next(new AppError('Invalid email or password', 401));
  }

  createSendToken(user, 200, res);
});

export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ 
    success: true, 
    message: "Logged out successfully" 
  });
};

export const onboard = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

  const updatedUser = await User.findByIdAndUpdate(userId, {
    ...req.body,
    isOnboarded: true,
  }, { 
    new: true,
    runValidators: true 
  });

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  try {
    await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullName,
      image: updatedUser.profilePic || "",
    });
    console.log(`Stream user updated successfully for ${updatedUser.fullName}`);
  } catch (streamError) {
    console.error("Error updating Stream user:", streamError.message);
  }

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

// Get current user
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // If user doesn't have a profile picture, provide a consistent avatar
  if (!user.profilePic) {
    user.profilePic = generateConsistentAvatar(user._id.toString());
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// New endpoint: Refresh token
export const refreshToken = catchAsync(async (req, res, next) => {
  let token;
  
  // Check token in cookies first
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } 
  // Check Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === 'loggedout') {
    return next(new AppError('Token not found. Please log in again.', 401));
  }

  try {
    // Verify existing token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Check if user still exists
    const currentUser = await User.findById(decoded.userId).select('-password');
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Generate new token
    createSendToken(currentUser, 200, res);
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
});

