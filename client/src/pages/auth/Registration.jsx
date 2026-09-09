import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Users,
  Zap,
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
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
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

  const passwordsMatch =
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  return (
    <div className="register-page">

      {/* =====================================================
          CINEMATIC BACKGROUND
      ===================================================== */}

      <div className="background">

        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="ambient ambient-three" />

        <div className="grid-overlay" />

        <div className="scan-line" />

        {/* Floating particles */}
        <span className="particle p1" />
        <span className="particle p2" />
        <span className="particle p3" />
        <span className="particle p4" />
        <span className="particle p5" />
        <span className="particle p6" />
        <span className="particle p7" />

      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="topbar">

        <Link to="/" className="brand">

          <div className="brand-mark">
            <Target size={21} strokeWidth={2.2} />

            <span className="brand-dot" />
          </div>

          <div>
            <div className="brand-name">
              Smart<span>LMS</span>
            </div>

            <div className="brand-subtitle">
              LEARNING INTELLIGENCE SYSTEM
            </div>
          </div>

        </Link>

        <Link to="/" className="back-home">
          ← Back to home
        </Link>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main-container">

        {/* =================================================
            LEFT CINEMATIC PANEL
        ================================================= */}

        <section className="visual-panel">

          <div className="classified">
            <span className="classified-dot" />
            ACCESS PROTOCOL
          </div>

          <div className="visual-title">

            <span>BUILD YOUR</span>

            <strong>
              NEXT <em>LEVEL.</em>
            </strong>

          </div>

          <p className="visual-description">
            One account. One mission.
            <br />
            Unlimited learning potential.
          </p>

          {/* Tactical circle */}

          <div className="target-system">

            <div className="target-ring ring-one" />
            <div className="target-ring ring-two" />
            <div className="target-ring ring-three" />

            <div className="crosshair horizontal" />
            <div className="crosshair vertical" />

            <div className="target-core">
              <Shield size={28} />
            </div>

          </div>

          {/* Floating info cards */}

          <div className="intel-card intel-one">
            <Sparkles size={14} />
            <div>
              <span>MISSION</span>
              <strong>LEARN</strong>
            </div>
          </div>

          <div className="intel-card intel-two">
            <Zap size={14} />
            <div>
              <span>STATUS</span>
              <strong>READY</strong>
            </div>
          </div>

          <div className="intel-card intel-three">
            <ShieldCheck size={14} />
            <div>
              <span>SECURITY</span>
              <strong>ACTIVE</strong>
            </div>
          </div>

          <div className="vertical-text">
            SMART LMS // 2026
          </div>

        </section>

        {/* =================================================
            REGISTRATION CARD
        ================================================= */}

        <section className="register-card">

          {/* Card top decoration */}

          <div className="card-top-line" />

          <div className="card-header">

            <div className="access-badge">
              <span />
              NEW OPERATIVE
            </div>

            <h1>
              Create your
              <br />
              <span>SmartLMS account.</span>
            </h1>

            <p>
              Enter your details and begin your learning mission.
            </p>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="field">

              <label htmlFor="name">
                FULL NAME
              </label>

              <div className="input-container">

                <UserRound
                  size={17}
                  className="input-icon"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="field">

              <label htmlFor="email">
                EMAIL ADDRESS
              </label>

              <div className="input-container">

                <Target
                  size={17}
                  className="input-icon"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />

              </div>

            </div>

            {/* ROLE */}

            <div className="field">

              <label>
                SELECT YOUR ROLE
              </label>

              <div className="role-grid">

                <RoleButton
                  active={formData.role === "student"}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "student",
                    }))
                  }
                  icon={<GraduationCap size={19} />}
                  title="Student"
                  subtitle="Learn & track"
                />

                <RoleButton
                  active={formData.role === "instructor"}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "instructor",
                    }))
                  }
                  icon={<Users size={19} />}
                  title="Instructor"
                  subtitle="Teach & manage"
                />

              </div>

            </div>

            {/* PASSWORD ROW */}

            <div className="password-grid">

              {/* PASSWORD */}

              <div className="field">

                <label htmlFor="password">
                  PASSWORD
                </label>

                <div className="input-container">

                  <Lock
                    size={16}
                    className="input-icon"
                  />

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
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

              </div>

              {/* CONFIRM */}

              <div className="field">

                <label htmlFor="confirmPassword">
                  CONFIRM PASSWORD
                </label>

                <div
                  className={`input-container ${
                    passwordsMatch
                      ? "password-valid"
                      : ""
                  }`}
                >

                  <Lock
                    size={16}
                    className="input-icon"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
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

            {/* PASSWORD STATUS */}

            {formData.confirmPassword && (
              <div
                className={
                  passwordsMatch
                    ? "password-status valid"
                    : "password-status invalid"
                }
              >
                {passwordsMatch ? (
                  <>
                    <Check size={12} />
                    PASSWORDS MATCH
                  </>
                ) : (
                  <>
                    <span>!</span>
                    PASSWORDS DO NOT MATCH
                  </>
                )}
              </div>
            )}

            {/* TERMS */}

            <label className="terms">

              <input
                type="checkbox"
                required
              />

              <span className="custom-check">
                <Check size={10} />
              </span>

              <span>
                I agree to the SmartLMS{" "}
                <b>terms and conditions</b>{" "}
                and acknowledge the privacy policy.
              </span>

            </label>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className={`register-button ${
                loading ? "loading" : ""
              }`}
            >

              {loading ? (
                <>
                  <span className="loader" />
                  CREATING ACCOUNT...
                </>
              ) : (
                <>
                  CREATE ACCOUNT
                  <ArrowRight size={17} />
                </>
              )}

            </button>

          </form>

          {/* =================================================
              LOGIN
          ================================================= */}

          <div className="login-section">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
              <ArrowRight size={12} />
            </Link>

          </div>

          {/* SECURITY */}

          <div className="security-footer">

            <ShieldCheck size={13} />

            <span>
              ENCRYPTED ACCOUNT CREATION
            </span>

            <i />

            <span>
              SMARTLMS SECURE
            </span>

          </div>

        </section>

      </main>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .register-page {
          min-height: 100vh;
          width: 100%;
          background:
            radial-gradient(
              circle at 75% 45%,
              rgba(110, 10, 20, 0.12),
              transparent 35%
            ),
            #070707;
          color: #fff;
          position: relative;
          overflow-x: hidden;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        /* =================================================
           BACKGROUND
        ================================================= */

        .background {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .ambient {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: .28;
        }

        .ambient-one {
          width: 500px;
          height: 500px;
          background: rgba(128, 12, 22, .25);
          left: -180px;
          top: 20%;
        }

        .ambient-two {
          width: 420px;
          height: 420px;
          background: rgba(150, 18, 28, .18);
          right: -160px;
          bottom: -100px;
        }

        .ambient-three {
          width: 250px;
          height: 250px;
          background: rgba(255, 255, 255, .025);
          top: 8%;
          right: 25%;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          opacity: .055;
          background-image:
            linear-gradient(
              rgba(255,255,255,.4) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.4) 1px,
              transparent 1px
            );
          background-size: 55px 55px;
        }

        .scan-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(180,20,35,.4),
              transparent
            );
          box-shadow:
            0 0 18px rgba(180,20,35,.3);
          animation: scan 8s linear infinite;
        }

        @keyframes scan {
          0% {
            top: -5%;
          }

          100% {
            top: 105%;
          }
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255,255,255,.45);
          border-radius: 50%;
          animation: particleFloat 6s ease-in-out infinite;
        }

        .p1 { left: 12%; top: 22%; }
        .p2 { left: 27%; top: 70%; animation-delay: 1s; }
        .p3 { left: 51%; top: 15%; animation-delay: 2s; }
        .p4 { left: 74%; top: 30%; animation-delay: 3s; }
        .p5 { left: 88%; top: 65%; animation-delay: 1.5s; }
        .p6 { left: 63%; top: 82%; animation-delay: 2.5s; }
        .p7 { left: 8%; top: 85%; animation-delay: 4s; }

        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0);
            opacity: .2;
          }

          50% {
            transform: translateY(-18px);
            opacity: .8;
          }
        }

        /* =================================================
           HEADER
        ================================================= */

        .topbar {
          height: 76px;
          width: 100%;
          padding: 0 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 10;
          border-bottom: 1px solid rgba(255,255,255,.06);
          background: rgba(5,5,5,.72);
          backdrop-filter: blur(18px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: white;
        }

        .brand-mark {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(190,25,40,.65);
          background:
            linear-gradient(
              145deg,
              #19090b,
              #090909
            );
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          color: #d51e35;
          box-shadow:
            0 0 25px rgba(170,15,30,.14);
        }

        .brand-dot {
          width: 4px;
          height: 4px;
          position: absolute;
          top: 5px;
          right: 5px;
          border-radius: 50%;
          background: #d51e35;
          box-shadow:
            0 0 8px #d51e35;
        }

        .brand-name {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -.5px;
        }

        .brand-name span {
          color: #c51b31;
        }

        .brand-subtitle {
          font-size: 7px;
          letter-spacing: 1.8px;
          color: #686868;
          margin-top: 4px;
        }

        .back-home {
          color: #777;
          text-decoration: none;
          font-size: 12px;
          transition: .2s;
        }

        .back-home:hover {
          color: #ddd;
        }

        /* =================================================
           MAIN
        ================================================= */

        .main-container {
          min-height: calc(100vh - 76px);
          display: grid;
          grid-template-columns: minmax(300px, .9fr) minmax(440px, 560px);
          max-width: 1250px;
          margin: 0 auto;
          padding: 55px 45px 70px;
          gap: 65px;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        /* =================================================
           VISUAL PANEL
        ================================================= */

        .visual-panel {
          position: relative;
          min-height: 610px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .classified {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2.5px;
          color: #8d8d8d;
          margin-bottom: 22px;
        }

        .classified-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c51b31;
          box-shadow:
            0 0 10px rgba(197,27,49,.8);
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: .45;
            transform: scale(.8);
          }

          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .visual-title {
          font-size: clamp(42px, 5vw, 67px);
          line-height: .94;
          letter-spacing: -3px;
          font-weight: 300;
          position: relative;
          z-index: 3;
        }

        .visual-title span {
          display: block;
          color: #a5a5a5;
        }

        .visual-title strong {
          display: block;
          color: #f3f3f3;
          font-weight: 800;
        }

        .visual-title em {
          color: #bd1b30;
          font-style: normal;
          text-shadow:
            0 0 30px rgba(190,25,45,.25);
        }

        .visual-description {
          color: #777;
          line-height: 1.7;
          font-size: 13px;
          margin-top: 25px;
        }

        /* =================================================
           TARGET
        ================================================= */

        .target-system {
          width: 270px;
          height: 270px;
          position: absolute;
          right: 5%;
          bottom: 5%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: .7;
        }

        .target-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(170,25,40,.3);
        }

        .ring-one {
          width: 270px;
          height: 270px;
          animation: rotate 20s linear infinite;
        }

        .ring-two {
          width: 205px;
          height: 205px;
          border-style: dashed;
          animation: rotateReverse 14s linear infinite;
        }

        .ring-three {
          width: 130px;
          height: 130px;
          border-color: rgba(255,255,255,.12);
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        .crosshair {
          position: absolute;
          background: rgba(190,25,40,.2);
        }

        .horizontal {
          width: 100%;
          height: 1px;
        }

        .vertical {
          height: 100%;
          width: 1px;
        }

        .target-core {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          border: 1px solid rgba(190,25,40,.6);
          background: rgba(10,10,10,.8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c51b31;
          box-shadow:
            0 0 35px rgba(180,20,35,.16);
          animation: corePulse 3s ease-in-out infinite;
        }

        @keyframes corePulse {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(180,20,35,.1);
          }

          50% {
            box-shadow:
              0 0 45px rgba(180,20,35,.25);
          }
        }

        /* =================================================
           INTEL CARDS
        ================================================= */

        .intel-card {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 12px;
          background: rgba(10,10,10,.65);
          border: 1px solid rgba(255,255,255,.07);
          backdrop-filter: blur(10px);
          min-width: 115px;
          animation: cardFloat 5s ease-in-out infinite;
        }

        .intel-card svg {
          color: #bd1b30;
        }

        .intel-card span,
        .intel-card strong {
          display: block;
        }

        .intel-card span {
          color: #5f5f5f;
          font-size: 6px;
          letter-spacing: 1.5px;
        }

        .intel-card strong {
          margin-top: 2px;
          color: #ddd;
          font-size: 9px;
          letter-spacing: 1px;
        }

        .intel-one {
          right: 0;
          top: 28%;
        }

        .intel-two {
          left: 4%;
          bottom: 18%;
          animation-delay: 1.5s;
        }

        .intel-three {
          right: 15%;
          bottom: 2%;
          animation-delay: 3s;
        }

        @keyframes cardFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        .vertical-text {
          position: absolute;
          left: -15px;
          top: 50%;
          transform: rotate(-90deg);
          color: #303030;
          font-size: 8px;
          letter-spacing: 3px;
        }

        /* =================================================
           REGISTER CARD
        ================================================= */

        .register-card {
          position: relative;
          background:
            linear-gradient(
              145deg,
              rgba(27,27,27,.97),
              rgba(12,12,12,.98)
            );
          border: 1px solid rgba(255,255,255,.09);
          padding: 37px 39px 27px;
          box-shadow:
            0 30px 100px rgba(0,0,0,.6),
            0 0 70px rgba(120,10,20,.07);
          overflow: hidden;
        }

        .card-top-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background:
            linear-gradient(
              90deg,
              transparent,
              #c51b31,
              transparent
            );
          box-shadow:
            0 0 20px rgba(197,27,49,.4);
        }

        .register-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .025;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              white 4px
            );
        }

        .card-header {
          position: relative;
          margin-bottom: 28px;
        }

        .access-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #a4a4a4;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 14px;
        }

        .access-badge span {
          width: 5px;
          height: 5px;
          background: #c51b31;
          border-radius: 50%;
          box-shadow: 0 0 8px #c51b31;
        }

        .card-header h1 {
          margin: 0;
          color: #eee;
          font-size: 30px;
          line-height: 1.1;
          letter-spacing: -1px;
          font-weight: 700;
        }

        .card-header h1 span {
          color: #b7192f;
          text-shadow:
            0 0 25px rgba(183,25,47,.18);
        }

        .card-header p {
          color: #777;
          font-size: 11px;
          line-height: 1.6;
          margin: 11px 0 0;
        }

        /* =================================================
           FORM
        ================================================= */

        .field {
          margin-bottom: 16px;
        }

        .field label {
          display: block;
          color: #777;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.7px;
          margin-bottom: 7px;
        }

        .input-container {
          height: 45px;
          display: flex;
          align-items: center;
          position: relative;
          border: 1px solid #292929;
          background: #0b0b0b;
          transition: .25s;
        }

        .input-container:focus-within {
          border-color: rgba(184,26,47,.7);
          box-shadow:
            0 0 0 1px rgba(184,26,47,.12),
            0 0 25px rgba(150,15,30,.06);
        }

        .input-icon {
          margin-left: 13px;
          color: #575757;
          flex-shrink: 0;
          transition: .25s;
        }

        .input-container:focus-within .input-icon {
          color: #b7192f;
        }

        .input-container input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #eee;
          padding: 0 13px 0 10px;
          font-size: 12px;
        }

        .input-container input::placeholder {
          color: #444;
        }

        .input-container input:-webkit-autofill,
        .input-container input:-webkit-autofill:hover,
        .input-container input:-webkit-autofill:focus {
          -webkit-text-fill-color: #eee;
          -webkit-box-shadow: 0 0 0 1000px #0b0b0b inset;
          transition: background-color 5000s ease-in-out 0s;
        }

        .eye-button {
          width: 36px;
          height: 100%;
          border: none;
          background: transparent;
          color: #555;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .eye-button:hover {
          color: #b7192f;
        }

        /* =================================================
           ROLE
        ================================================= */

        .role-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .role-button {
          height: 66px;
          border: 1px solid #292929;
          background: #0b0b0b;
          color: white;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 12px;
          cursor: pointer;
          text-align: left;
          position: relative;
          overflow: hidden;
          transition: .25s;
        }

        .role-button:hover {
          border-color: #454545;
          transform: translateY(-1px);
        }

        .role-button.active {
          border-color: rgba(190,25,45,.8);
          background:
            linear-gradient(
              135deg,
              rgba(100,10,20,.2),
              rgba(15,15,15,.95)
            );
          box-shadow:
            inset 3px 0 0 #bd1b30,
            0 0 25px rgba(170,15,30,.06);
        }

        .role-icon {
          width: 38px;
          height: 38px;
          border: 1px solid #2c2c2c;
          background: #151515;
          color: #6b6b6b;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .role-button.active .role-icon {
          color: #d31e37;
          border-color: rgba(190,25,45,.4);
          background: rgba(120,10,20,.14);
        }

        .role-title {
          color: #ddd;
          font-size: 11px;
          font-weight: 700;
        }

        .role-subtitle {
          color: #555;
          font-size: 8px;
          margin-top: 3px;
        }

        .role-status {
          position: absolute;
          right: 8px;
          top: 8px;
          width: 6px;
          height: 6px;
          border: 1px solid #555;
          border-radius: 50%;
        }

        .role-button.active .role-status {
          background: #bd1b30;
          border-color: #bd1b30;
          box-shadow: 0 0 8px #bd1b30;
        }

        /* =================================================
           PASSWORDS
        ================================================= */

        .password-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .password-valid {
          border-color: rgba(20,140,90,.55);
        }

        .password-status {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: -7px;
          margin-bottom: 11px;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .password-status.valid {
          color: #4bc58a;
        }

        .password-status.invalid {
          color: #d53a4d;
        }

        .password-status.invalid span {
          width: 12px;
          height: 12px;
          border: 1px solid #d53a4d;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* =================================================
           TERMS
        ================================================= */

        .terms {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 11px;
          border: 1px solid #252525;
          background: rgba(255,255,255,.015);
          cursor: pointer;
          color: #5e5e5e;
          font-size: 8px;
          line-height: 1.6;
          margin-top: 5px;
        }

        .terms input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .custom-check {
          width: 14px;
          height: 14px;
          border: 1px solid #414141;
          background: #090909;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: transparent;
        }

        .terms input:checked + .custom-check {
          background: #b7192f;
          border-color: #b7192f;
          color: white;
        }

        .terms b {
          color: #a9a9a9;
          font-weight: 700;
        }

        /* =================================================
           REGISTER BUTTON
        ================================================= */

        .register-button {
          position: relative;
          width: 100%;
          height: 48px;
          border: 1px solid #c21b32;
          margin-top: 15px;
          background:
            linear-gradient(
              100deg,
              #8e1225,
              #bd1b30,
              #8e1225
            );
          background-size: 200% 100%;
          color: white;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          box-shadow:
            0 8px 30px rgba(150,15,30,.16);
          transition: .25s;
          overflow: hidden;
          animation: buttonGradient 5s linear infinite;
        }

        @keyframes buttonGradient {
          0% {
            background-position: 0% 50%;
          }

          100% {
            background-position: 200% 50%;
          }
        }

        .register-button::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.15),
              transparent
            );
          transform: skewX(-20deg);
          animation: buttonShine 3.5s infinite;
        }

        @keyframes buttonShine {
          0% {
            left: -100%;
          }

          45%, 100% {
            left: 140%;
          }
        }

        .register-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 12px 40px rgba(170,15,30,.28);
        }

        .register-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .register-button.loading {
          opacity: .7;
          cursor: not-allowed;
          animation: none;
        }

        .loader {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =================================================
           LOGIN
        ================================================= */

        .login-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid #222;
          font-size: 9px;
          color: #555;
        }

        .login-section a {
          color: #bd1b30;
          text-decoration: none;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          transition: .2s;
        }

        .login-section a:hover {
          color: #e42b43;
        }

        /* =================================================
           SECURITY
        ================================================= */

        .security-footer {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          margin-top: 19px;
          color: #414141;
          font-size: 7px;
          letter-spacing: 1.3px;
          font-weight: 700;
        }

        .security-footer svg {
          color: #555;
        }

        .security-footer i {
          width: 3px;
          height: 3px;
          background: #5a5a5a;
          border-radius: 50%;
        }

        /* =================================================
           RESPONSIVE
        ================================================= */

        @media (max-width: 950px) {

          .main-container {
            grid-template-columns: 1fr;
            max-width: 620px;
            gap: 20px;
            padding-top: 35px;
          }

          .visual-panel {
            min-height: 250px;
            text-align: center;
            align-items: center;
          }

          .visual-title {
            font-size: 45px;
          }

          .visual-description {
            margin-top: 15px;
          }

          .target-system {
            width: 180px;
            height: 180px;
            position: relative;
            right: auto;
            bottom: auto;
            margin-top: 25px;
          }

          .ring-one {
            width: 180px;
            height: 180px;
          }

          .ring-two {
            width: 135px;
            height: 135px;
          }

          .ring-three {
            width: 85px;
            height: 85px;
          }

          .intel-card {
            display: none;
          }

          .vertical-text {
            display: none;
          }
        }

        @media (max-width: 620px) {

          .topbar {
            height: 68px;
            padding: 0 18px;
          }

          .brand-subtitle {
            display: none;
          }

          .back-home {
            font-size: 10px;
          }

          .main-container {
            min-height: auto;
            padding: 30px 14px 45px;
          }

          .visual-panel {
            min-height: 205px;
          }

          .visual-title {
            font-size: 37px;
            letter-spacing: -2px;
          }

          .target-system {
            width: 130px;
            height: 130px;
            margin-top: 18px;
          }

          .ring-one {
            width: 130px;
            height: 130px;
          }

          .ring-two {
            width: 98px;
            height: 98px;
          }

          .ring-three {
            width: 60px;
            height: 60px;
          }

          .target-core {
            width: 42px;
            height: 42px;
          }

          .target-core svg {
            width: 18px;
          }

          .register-card {
            padding: 28px 20px 22px;
          }

          .card-header h1 {
            font-size: 27px;
          }

          .password-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .role-grid {
            grid-template-columns: 1fr 1fr;
          }

        }

        @media (max-width: 400px) {

          .brand-name {
            font-size: 16px;
          }

          .role-grid {
            grid-template-columns: 1fr;
          }

          .register-card {
            padding: 25px 16px 20px;
          }

        }

      `}</style>
    </div>
  );
}

/* =====================================================
   ROLE BUTTON
===================================================== */

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
      className={`role-button ${
        active ? "active" : ""
      }`}
    >

      <div className="role-icon">
        {icon}
      </div>

      <div>
        <div className="role-title">
          {title}
        </div>

        <div className="role-subtitle">
          {subtitle}
        </div>
      </div>

      <span className="role-status" />

    </button>
  );
}

export default Register;