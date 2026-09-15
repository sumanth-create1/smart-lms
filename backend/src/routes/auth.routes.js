import express from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  instructorDashboard,
  updateProfile,
  changePassword,
  changeEmail,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import {
  authorizeRoles,
  isAuthenticated,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// =====================================================
// AUTHENTICATION
// =====================================================

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get(
  "/me",
  isAuthenticated,
  getCurrentUser
);

router.post(
  "/logout",
  isAuthenticated,
  logoutUser
);

// =====================================================
// INSTRUCTOR
// =====================================================

router.get(
  "/instructor-dashboard",
  isAuthenticated,
  authorizeRoles("instructor"),
  instructorDashboard
);

// =====================================================
// PROFILE
// =====================================================

router.put(
  "/profile",
  isAuthenticated,
  updateProfile
);

// =====================================================
// PASSWORD
// =====================================================

// Change password while logged in
router.patch(
  "/change-password",
  isAuthenticated,
  changePassword
);

// Forgot password
// No authentication required
router.post(
  "/forgot-password",
  forgotPassword
);

// Reset password using reset token
// No authentication required
router.post(
  "/reset-password/:token",
  resetPassword
);

// =====================================================
// EMAIL
// =====================================================

// Change email while logged in
router.patch(
  "/change-email",
  isAuthenticated,
  changeEmail
);

// Verify email using verification token
router.get(
  "/verify-email/:token",
  verifyEmail
);

// Resend verification email
router.post(
  "/resend-verification",
  resendVerification
);

export default router;