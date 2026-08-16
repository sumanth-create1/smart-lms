import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (
      formData.password !== formData.confirmPassword
    ) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      });

      console.log("Registration successful:", response.data);

      toast.success("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      console.error("Registration error:", error);

      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#f6f8fc",
        margin: 0,
        padding: 0,
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <header
        style={{
          width: "100%",
          height: "72px",
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO */}

          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px",
                fontWeight: 800,
              }}
            >
              S
            </div>

            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1,
                }}
              >
                Smart<span style={{ color: "#4f46e5" }}>LMS</span>
              </div>

              <div
                style={{
                  marginTop: "5px",
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  color: "#94a3b8",
                }}
              >
                LEARNING PLATFORM
              </div>
            </div>
          </Link>

          {/* BACK */}

          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#475569",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            ← Back to home
          </Link>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main
        style={{
          width: "100%",
          minHeight: "calc(100vh - 72px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "42px 20px 50px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* BACKGROUND GLOW */}

        <div
          style={{
            position: "absolute",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background:
              "rgba(99, 102, 241, 0.08)",
            filter: "blur(80px)",
            top: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />

        {/* =================================================
            CARD
        ================================================= */}

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: "620px",
            boxSizing: "border-box",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "24px",
            boxShadow:
              "0 20px 60px rgba(15, 23, 42, 0.08)",
            padding: "34px 38px 26px",
          }}
        >
          {/* =================================================
              TITLE
          ================================================= */}

          <div style={{ marginBottom: "26px" }}>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                background: "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "14px",
              }}
            >
              <Sparkles
                size={21}
                color="#4f46e5"
              />
            </div>

            <div
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1.7px",
                color: "#4f46e5",
                marginBottom: "5px",
              }}
            >
              GET STARTED
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "32px",
                lineHeight: "1.15",
                fontWeight: 800,
                letterSpacing: "-0.8px",
                color: "#0f172a",
              }}
            >
              Create your SmartLMS account
            </h1>

            <p
              style={{
                margin: "9px 0 0",
                fontSize: "13px",
                lineHeight: "20px",
                color: "#64748b",
              }}
            >
              Join SmartLMS and start learning,
              teaching, and tracking your progress.
            </p>
          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form onSubmit={handleSubmit}>
            {/* NAME */}

            <div style={{ marginBottom: "17px" }}>
              <label
                htmlFor="name"
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#1e293b",
                }}
              >
                Full name
              </label>

              <div
                style={{
                  padding: "5px",
                  borderRadius: "13px",
                  background: "#f8fafc",
                }}
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* EMAIL */}

            <div style={{ marginBottom: "17px" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#1e293b",
                }}
              >
                Email address
              </label>

              <div
                style={{
                  padding: "5px",
                  borderRadius: "13px",
                  background: "#f8fafc",
                }}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* ROLE */}

            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#1e293b",
                }}
              >
                Register as
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "12px",
                }}
              >
                {/* STUDENT */}

                <RoleButton
                  active={formData.role === "student"}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "student",
                    }))
                  }
                  icon={<GraduationCap size={18} />}
                  title="Student"
                  subtitle="Learn & track"
                />

                {/* INSTRUCTOR */}

                <RoleButton
                  active={formData.role === "instructor"}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "instructor",
                    }))
                  }
                  icon={<Users size={18} />}
                  title="Instructor"
                  subtitle="Teach & manage"
                />
              </div>
            </div>

            {/* PASSWORDS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "14px",
              }}
            >
              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  style={labelStyle}
                >
                  Password
                </label>

                <div style={inputWrapperStyle}>
                  <div style={{ position: "relative" }}>
                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      style={{
                        ...inputStyle,
                        paddingRight: "44px",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      style={eyeButtonStyle}
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* CONFIRM */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  style={labelStyle}
                >
                  Confirm password
                </label>

                <div style={inputWrapperStyle}>
                  <div style={{ position: "relative" }}>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleChange}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      required
                      style={{
                        ...inputStyle,
                        paddingRight: "44px",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      style={eyeButtonStyle}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PASSWORD MATCH */}

            {formData.confirmPassword && (
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "10px",
                  fontWeight: 600,
                  color:
                    formData.password ===
                    formData.confirmPassword
                      ? "#059669"
                      : "#ef4444",
                }}
              >
                {formData.password ===
                formData.confirmPassword
                  ? "✓ Passwords match"
                  : "Passwords do not match"}
              </div>
            )}

            {/* TERMS */}

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "9px",
                marginTop: "19px",
                padding: "11px 12px",
                borderRadius: "11px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                required
                style={{
                  width: "15px",
                  height: "15px",
                  marginTop: "1px",
                  accentColor: "#4f46e5",
                  flexShrink: 0,
                }}
              />

              <span
                style={{
                  fontSize: "10px",
                  lineHeight: "15px",
                  color: "#64748b",
                }}
              >
                I agree to the SmartLMS{" "}
                <span
                  style={{
                    color: "#4f46e5",
                    fontWeight: 700,
                  }}
                >
                  terms and conditions
                </span>{" "}
                and acknowledge the privacy policy.
              </span>
            </label>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "46px",
                marginTop: "18px",
                border: "none",
                borderRadius: "12px",
                background: loading
                  ? "#818cf8"
                  : "#4f46e5",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow:
                  "0 8px 20px rgba(79,70,229,0.20)",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,.35)",
                      borderTopColor: "#ffffff",
                      animation:
                        "spin 0.8s linear infinite",
                    }}
                  />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* LOGIN */}

          <div
            style={{
              marginTop: "18px",
              paddingTop: "16px",
              borderTop: "1px solid #eef2f7",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              Already have an account?
            </span>

            <Link
              to="/login"
              style={{
                marginLeft: "5px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#4f46e5",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* SECURITY */}

        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#94a3b8",
            fontSize: "10px",
            whiteSpace: "nowrap",
          }}
        >
          <ShieldCheck size={12} />
          Secure account creation · SmartLMS
        </div>
      </main>

      {/* SPINNER */}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 640px) {
            main {
              padding: 24px 12px 50px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

// =====================================================
// REUSABLE STYLES
// =====================================================

const inputStyle = {
  width: "100%",
  height: "44px",
  boxSizing: "border-box",
  border: "1px solid #e2e8f0",
  borderRadius: "9px",
  background: "#ffffff",
  padding: "0 14px",
  outline: "none",
  fontSize: "13px",
  color: "#0f172a",
};

const inputWrapperStyle = {
  padding: "5px",
  borderRadius: "13px",
  background: "#f8fafc",
};

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  fontSize: "13px",
  fontWeight: 700,
  color: "#1e293b",
};

const eyeButtonStyle = {
  position: "absolute",
  right: "7px",
  top: "50%",
  transform: "translateY(-50%)",
  width: "32px",
  height: "32px",
  border: "none",
  borderRadius: "8px",
  background: "transparent",
  color: "#94a3b8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

// =====================================================
// ROLE BUTTON
// =====================================================

function RoleButton({
  active,
  onClick,
  icon,
  title,
  subtitle,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: "62px",
        borderRadius: "13px",
        border: active
          ? "1.5px solid #4f46e5"
          : "1px solid #e2e8f0",
        background: active
          ? "#eef2ff"
          : "#ffffff",
        display: "flex",
        alignItems: "center",
        gap: "11px",
        padding: "0 12px",
        textAlign: "left",
        cursor: "pointer",
        boxShadow: active
          ? "0 0 0 3px rgba(79,70,229,0.08)"
          : "none",
      }}
    >
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "10px",
          flexShrink: 0,
          background: active
            ? "#4f46e5"
            : "#f1f5f9",
          color: active
            ? "#ffffff"
            : "#64748b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: "2px",
            fontSize: "10px",
            color: "#64748b",
          }}
        >
          {subtitle}
        </div>
      </div>
    </button>
  );
}

export default Register;