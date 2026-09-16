import express from "express";

import {
  createQuiz,
  getModuleQuiz,
  submitQuiz,
  getMyQuizAttempt,
  generateAIQuiz,
} from "../controllers/quiz.controller.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// =====================================================
// INSTRUCTOR
// =====================================================

// Create quiz for a module
router.post(
  "/module/:moduleId/quiz",
  isAuthenticated,
  authorizeRoles("instructor"),
  createQuiz,
);

// =====================================================
// STUDENT
// =====================================================

// Get module quiz
router.get("/module/:moduleId/quiz", isAuthenticated, getModuleQuiz);

// Submit quiz
router.post(
  "/quiz/:quizId/submit",
  isAuthenticated,
  authorizeRoles("student"),
  submitQuiz,
);

// Get student's latest attempt
router.get(
  "/quiz/:quizId/my-attempt",
  isAuthenticated,
  authorizeRoles("student"),
  getMyQuizAttempt,
);

export default router;
