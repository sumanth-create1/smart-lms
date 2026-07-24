import express from "express";

const router = express.Router();

import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  instructorDashboard
} from "../controllers/auth.controller.js";

import { authorizeRoles, isAuthenticated } from "../middleware/auth.middleware.js";

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", isAuthenticated, getCurrentUser);

router.post("/logout", logoutUser);

router.get(
    "/instructor-dashboard",
    isAuthenticated,
    authorizeRoles("instructor"),
    instructorDashboard
);

export default router;
