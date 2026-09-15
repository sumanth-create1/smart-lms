import express from "express";
import { mentorChat } from "../controllers/ai.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/mentor", isAuthenticated, mentorChat);

export default router;