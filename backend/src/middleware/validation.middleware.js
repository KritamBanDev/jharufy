import { AppError } from '../utils/errorHandler.js';

// Enhanced email validation
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 320; // RFC 5321 limit
};

// Strong password validation
export const validatePassword = (password) => {
  if (!password || password.length < 6) return false;
  if (password.length > 128) return false; // Reasonable upper limit
  
  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasLetter && hasNumber;
};

// Enhanced full name validation
export const validateFullName = (fullName) => {
  if (!fullName) return false;
  const trimmed = fullName.trim();
  if (trimmed.length < 2 || trimmed.length > 100) return false;
  
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(trimmed);
};

// MongoDB ObjectId validation
export const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// URL validation for profile pics
export const validateURL = (url) => {
  if (!url) return true; // Optional field
  try {
    new URL(url);
    return url.length <= 2048; // Reasonable URL length limit
  } catch {
    return false;
  }
};

// Bio validation
export const validateBio = (bio) => {
  if (!bio) return true; // Optional field
  return bio.trim().length <= 500; // Reasonable bio length
};

// Location validation
export const validateLocation = (location) => {
  if (!location) return true; // Optional field
  const trimmed = location.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
};

// Language validation
export const validateLanguage = (language) => {
  if (!language) return false;
  // Basic language code validation (2-3 letter codes)
  const languageRegex = /^[a-zA-Z]{2,3}(-[a-zA-Z]{2,3})?$/;
  return languageRegex.test(language);
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

// Validation middleware for signup
export const validateSignup = (req, res, next) => {
  const { email, password, fullName } = req.body;
  
  // Check required fields
  if (!email || !password || !fullName) {
    return next(new AppError('All fields (email, password, fullName) are required', 400));
  }
  
  // Sanitize inputs
  req.body.email = sanitizeInput(email.toLowerCase());
  req.body.fullName = sanitizeInput(fullName);
  
  // Validate email
  if (!validateEmail(req.body.email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }
  
  // Validate password
  if (!validatePassword(password)) {
    return next(new AppError('Password must be at least 6 characters long and contain both letters and numbers', 400));
  }
  
  // Validate full name
  if (!validateFullName(req.body.fullName)) {
    return next(new AppError('Full name must be 2-100 characters long and contain only letters, spaces, hyphens, and apostrophes', 400));
  }
  
  next();
};

// Validation middleware for login
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }
  
  if (!validateEmail(email)) {
    return next(new AppError('Invalid email format', 400));
  }
  
  next();
};

// Validation middleware for onboarding
export const validateOnboarding = (req, res, next) => {
  const { fullName, nativeLanguage, learningLanguage, bio } = req.body;
  
  const missingFields = [];
  if (!fullName || fullName.trim() === '') missingFields.push('fullName');
  if (!nativeLanguage || nativeLanguage.trim() === '') missingFields.push('nativeLanguage');
  if (!learningLanguage || learningLanguage.trim() === '') missingFields.push('learningLanguage');
  
  if (missingFields.length > 0) {
    return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
  }
  
  // Validate bio length only if provided
  if (bio && bio.length < 10) {
    return next(new AppError('Bio must be at least 10 characters long', 400));
  }
  
  // Validate that native and learning languages are different
  if (nativeLanguage === learningLanguage) {
    return next(new AppError('Native language and learning language cannot be the same', 400));
  }
  
  next();
};

// Validation middleware for ObjectId parameters
export const validateParamId = (req, res, next) => {
  // Check all possible ID parameter names
  const idParams = ['id', 'statusId', 'userId', 'commentId'];
  
  for (const param of idParams) {
    if (req.params[param] && !validateObjectId(req.params[param])) {
      return next(new AppError('Invalid ID format', 400));
    }
  }
  
  next();
};
