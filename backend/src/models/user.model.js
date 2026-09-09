import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    // =====================================================
    // BASIC USER INFORMATION
    // =====================================================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // =====================================================
    // AUTHENTICATION
    // =====================================================

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    // =====================================================
    // ROLE
    // =====================================================

    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },

    // =====================================================
    // PROFILE
    // =====================================================

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 300,
      default: "",
      trim: true,
    },

    // =====================================================
    // EMAIL VERIFICATION
    // =====================================================

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: "",
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },

    // =====================================================
    // EMAIL CHANGE
    // =====================================================

    // New email is stored here temporarily until verified.
    pendingEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// PASSWORD HASHING
// =====================================================

userSchema.pre("save", async function () {
  // Only hash password when it has been changed.
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcryptjs.hash(this.password, 10);
});

// =====================================================
// COMPARE PASSWORD
// =====================================================

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// =====================================================
// GENERATE JWT TOKEN
// =====================================================

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

// =====================================================
// MODEL
// =====================================================

const User = mongoose.model("User", userSchema);

export default User;