import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // =========================================
    // VALIDATION
    // =========================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Please select a role",
      });
    }

    // Only allow valid roles
    if (!["student", "instructor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    // =========================================
    // FIND USER
    // =========================================

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // =========================================
    // CHECK ROLE
    // =========================================

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as ${user.role}. Please select ${user.role}.`,
      });
    }

    // =========================================
    // CHECK PASSWORD
    // =========================================

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // =========================================
    // GENERATE JWT
    // =========================================

    const token = user.generateToken();

    // =========================================
    // COOKIE OPTIONS
    // =========================================

    const options = {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    // =========================================
    // REMOVE PASSWORD
    // =========================================

    const userData = user.toObject();

    delete userData.password;

    // =========================================
    // RESPONSE
    // =========================================

    return res.status(200).cookie("token", token, options).json({
      success: true,
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user.toObject();
    delete user.password;

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// for testing purpose

export const instructorDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome Instructor ${req.user.name}`,
  });
};
