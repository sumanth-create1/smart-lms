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

router.post(
  "/module/:moduleId/quiz",
  isAuthenticated,
  authorizeRoles("instructor"),
  createQuiz
);

router.post(
  "/module/:moduleId/quiz/generate",
  isAuthenticated,
  authorizeRoles("instructor"),
  generateAIQuiz
);

// =====================================================
// STUDENT
// =====================================================

router.get(
  "/module/:moduleId/quiz",
  isAuthenticated,
  getModuleQuiz
);

router.post(
  "/quiz/:quizId/submit",
  isAuthenticated,
  authorizeRoles("student"),
  submitQuiz
);

router.get(
  "/quiz/:quizId/my-attempt",
  isAuthenticated,
  authorizeRoles("student"),
  getMyQuizAttempt
);

export default router;