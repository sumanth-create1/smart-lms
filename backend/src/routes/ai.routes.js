import express from "express";

import {
  mentorChat,
  courseAISuggestions,
} from "../controllers/ai.controller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

/* AI Mentor */
router.post(
  "/mentor",
  isAuthenticated,
  mentorChat
);

/* Course AI Architect */
router.post(
  "/course-suggestions",
  isAuthenticated,
  courseAISuggestions
);

export default router;