import express from "express";

import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";

import { isAuthenticated, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();


// =====================================================
// CREATE PAYMENT ORDER
// =====================================================

router.post(
  "/create-order/:courseId",
  isAuthenticated,
  authorizeRoles("student"),
  createPaymentOrder
);


// =====================================================
// VERIFY PAYMENT
// =====================================================

router.post(
  "/verify",
  isAuthenticated,
  authorizeRoles("student"),
  verifyPayment
);


export default router;