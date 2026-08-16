import express from "express";

import {
    getStudentDashboard,
} from "../controllers/dashboard.controller.js";

import {
    isAuthenticated,
    authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
    "/student",
    isAuthenticated,
    authorizeRoles("student"),
    getStudentDashboard
);

export default router;