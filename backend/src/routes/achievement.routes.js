import express from "express";

import {
  getStudentAchievements,
  getAllAchievements,
  getStudentXP,
} from "../controllers/achievement.controller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Get student's unlocked achievements
 *
 * GET /api/v1/achievements
 */
router.get(
  "/",
  isAuthenticated,
  getStudentAchievements
);

/**
 * Get all achievements with
 * locked/unlocked status
 *
 * GET /api/v1/achievements/all
 */
router.get(
  "/all",
  isAuthenticated,
  getAllAchievements
);

/**
 * Get student's XP and level
 *
 * GET /api/v1/achievements/xp
 */
router.get(
  "/xp",
  isAuthenticated,
  getStudentXP
);

export default router;