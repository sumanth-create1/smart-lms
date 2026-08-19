import express from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  instructorDashboard,
  updateProfile,
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


export default router;