import express from 'express';
import { signup, login, logout, onboard, getMe, refreshToken } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { validateSignup, validateLogin, validateOnboarding } from '../middleware/validation.middleware.js';
import { authLimiter } from '../middleware/security.middleware.js';

const router = express.Router();

// Apply stricter rate limiting to sensitive routes
router.use(['/signup', '/login'], authLimiter);

// Authentication routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

// Protected routes
router.use(protectRoute); // Apply authentication to all routes below

router.post("/onboarding", validateOnboarding, onboard);

// Route to get the current user's details
router.get("/me", getMe);

export default router;