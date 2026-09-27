import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    console.log("🔐 AUTH MIDDLEWARE: START");

    const token = req.cookies.token;

    console.log(
      "🍪 TOKEN:",
      token ? "FOUND" : "NOT FOUND"
    );

    if (!token) {
      console.log("❌ AUTH: No token");

      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    console.log("🔑 Verifying JWT...");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      "✅ JWT VERIFIED:",
      decoded
    );

    console.log(
      "👤 Finding user:",
      decoded.id
    );

    const user = await User.findById(
      decoded.id
    );

    console.log(
      "👤 USER RESULT:",
      user ? "FOUND" : "NOT FOUND"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;

    console.log(
      "✅ AUTH COMPLETE → calling next()"
    );

    next();
  } catch (error) {
    console.error(
      "❌ AUTH MIDDLEWARE ERROR:",
      error
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message:
          "Access Denied. You don't have permission.",
      });
    }

    next();
  };
};