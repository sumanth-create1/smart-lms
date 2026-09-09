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
} from "../controllers/auth.controller.js";

import {
  authorizeRoles,
  isAuthenticated,
} from "../middleware/auth.middleware.js";

const router = express.Router();

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

router.get(
  "/instructor-dashboard",
  isAuthenticated,
  authorizeRoles("instructor"),
  instructorDashboard
);

router.put(
  "/profile",
  isAuthenticated,
  updateProfile
);

router.patch(
  "/change-password",
  isAuthenticated,
  changePassword
);


router.post(
  "/change-email",
  isAuthenticated,
  changeEmail
);

router.get(
  "/verify-email/:token",
  verifyEmail
);

export default router;