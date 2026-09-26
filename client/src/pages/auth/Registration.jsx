import { memo, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Check,
  Crown,
  Eye,
  EyeOff,
  Flame,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  UserRound,
  Users,
  WandSparkles,
} from "lucide-react";

import { toast } from "react-hot-toast";
import api from "../../services/api";

/* =========================================================
   STATIC BACKGROUND DATA
========================================================= */

const STARS = [
  ["9%", "17%"],
  ["20%", "28%"],
  ["34%", "13%"],
  ["53%", "20%"],
  ["70%", "10%"],
  ["84%", "25%"],
  ["92%", "48%"],
  ["43%", "34%"],
];

const SNOW = [
  ["8%", "18%"],
  ["16%", "42%"],
  ["27%", "22%"],
  ["38%", "55%"],
  ["51%", "15%"],
  ["63%", "39%"],
  ["76%", "20%"],
  ["88%", "52%"],
  ["94%", "30%"],
];

const EMBERS = [
  ["12%", "20%"],
  ["24%", "10%"],
  ["38%", "25%"],
  ["52%", "12%"],
  ["68%", "22%"],
  ["82%", "8%"],
];

/* =========================================================
   PASSWORD STRENGTH
========================================================= */

const getPasswordStrength = (password) => {
  if (!password) return 0;
  if (password.length < 6) return 1;
  if (password.length < 10) return 2;
  return 3;
};

/* =========================================================
   REALM BACKGROUND
========================================================= */

const RealmBackground = memo(function RealmBackground() {
  return (
    <div className="realm-background" aria-hidden="true">
      {/* Background glows */}
      <div className="realm-glow realm-glow-one" />
      <div className="realm-glow realm-glow-two" />

      {/* Moon */}
      <div className="realm-moon">
        <div className="moon-crater moon-crater-one" />
        <div className="moon-crater moon-crater-two" />
        <div className="moon-crater moon-crater-three" />
      </div>

      {/* Stars */}
      <div className="realm-stars">
        {STARS.map(([left, top], index) => (
          <span
            key={index}
            className="realm-star"
            style={{
              left,
              top,
            }}
          />
        ))}
      </div>

      {/* Mountains */}
      <div className="mountain mountain-back" />
      <div className="mountain mountain-middle" />
      <div className="mountain mountain-front" />

      {/* Castle */}
      <div className="realm-castle">
        <div className="castle-tower castle-tower-left" />
        <div className="castle-tower castle-tower-center" />
        <div className="castle-tower castle-tower-right" />

        <div className="castle-wall">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="castle-window castle-window-one" />
        <div className="castle-window castle-window-two" />
        <div className="castle-window castle-window-three" />
      </div>

      {/* Snow */}
      <div className="realm-snow">
        {SNOW.map(([left, top], index) => (
          <span
            key={index}
            className="snow-dot"
            style={{
              left,
              top,
            }}
          />
        ))}
      </div>

      {/* Embers */}
      <div className="realm-embers">
        {EMBERS.map(([left, top], index) => (
          <span
            key={index}
            className="ember-dot"
            style={{
              left,
              top,
            }}
          />
        ))}
      </div>

      <div className="realm-vignette" />
    </div>
  );
});

/* =========================================================
   ROLE BUTTON
========================================================= */

const RoleButton = memo(function RoleButton({
  role,
  active,
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`role-button ${active ? "role-button-active" : ""}`}
      onClick={() => onClick(role)}
    >
      <div className="role-icon">
        <Icon size={19} />
      </div>

      <div className="role-content">
        <span className="role-title">{title}</span>
        <span className="role-description">{description}</span>
      </div>

      {active && (
        <div className="role-check">
          <Check size={15} />
        </div>
      )}
    </button>
  );
});

/* =========================================================
   REGISTER
========================================================= */

function Register() {
  const navigate = useNavigate();

  const cursorRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =======================================================
     LIGHTWEIGHT CUSTOM CURSOR

     IMPORTANT:
     - No React state
     - No getBoundingClientRect()
     - No card tilt
     - Only one requestAnimationFrame
  ======================================================= */

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) return;

    let rafId = 0;
    let mouseX = -999;
    let mouseY = -999;

    const updateCursor = () => {
      rafId = 0;

      cursor.style.transform =
        `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    const handlePointerMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(updateCursor);
      }
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     ROLE CHANGE
  ======================================================= */

  const handleRoleChange = (role) => {
    setFormData((previous) => ({
      ...previous,
      role,
    }));
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      name,
      email,
      password,
      confirmPassword,
      role,
    } = formData;

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      toast.success(
        "Your account has been forged successfully!"
      );

      window.setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     DERIVED VALUES
  ======================================================= */

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const passwordStrength =
    getPasswordStrength(formData.password);

  return (
    <main className="register-page">
      {/* Lightweight cursor */}
      <div
        ref={cursorRef}
        className="cursor-light"
        aria-hidden="true"
      />

      {/* Background */}
      <RealmBackground />

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="register-header">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <Crown size={20} />
          </div>

          <div className="brand-text">
            <span className="brand-title">
              SMART LMS
            </span>

            <span className="brand-subtitle">
              KNOWLEDGE IS POWER
            </span>
          </div>
        </Link>

        <div className="header-login">
          <span>Already have an account?</span>

          <Link to="/login">
            Enter the Realm
            <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="register-content">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="register-intro">

          <div className="intro-badge">
            <Flame size={14} />
            JOIN THE REALM
          </div>

          <h1>
            Forge Your
            <span>Legacy</span>
          </h1>

          <p className="intro-description">
            Begin your journey through the realm of knowledge.
            Learn powerful skills, master new technologies,
            and build your path toward greatness.
          </p>

          {/* Decorative sword */}
          <div className="sword-decoration">
            <div className="sword-line" />
            <div className="sword">
              <div className="sword-blade" />
              <div className="sword-guard" />
              <div className="sword-handle" />
            </div>
            <div className="sword-line" />
          </div>

          {/* Features */}
          <div className="realm-features">

            <div className="feature-card">
              <div className="feature-icon">
                <GraduationCap size={20} />
              </div>

              <div>
                <strong>Master Your Craft</strong>
                <span>
                  Learn from structured courses
                </span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ShieldCheck size={20} />
              </div>

              <div>
                <strong>Earn Your Honor</strong>
                <span>
                  Complete challenges and achievements
                </span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <WandSparkles size={20} />
              </div>

              <div>
                <strong>AI-Powered Guidance</strong>
                <span>
                  Learn with your personal AI mentor
                </span>
              </div>
            </div>

          </div>

          <div className="realm-quote">
            <span className="quote-mark">"</span>

            <p>
              Knowledge is the flame that lights
              the darkest path.
            </p>

            <span className="quote-line" />
          </div>

        </div>

        {/* =================================================
            REGISTER CARD
        ================================================= */}

        <section className="register-card">

          <div className="card-header">

            <div className="card-icon">
              <Shield size={22} />
            </div>

            <div>
              <span className="card-eyebrow">
                CREATE YOUR ACCOUNT
              </span>

              <h2>
                Claim Your Place
              </h2>
            </div>

          </div>

          <div className="card-divider">
            <span />
            <Crown size={13} />
            <span />
          </div>

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* =================================================
                NAME
            ================================================= */}

            <div className="form-group">

              <label htmlFor="name">
                Your Name
              </label>

              <div className="input-wrapper">

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
                  placeholder="Enter your name"
                  autoComplete="name"
                  disabled={loading}
                />

              </div>

            </div>

            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="form-group">

              <label htmlFor="email">
                Raven Address
              </label>

              <div className="input-wrapper">

                <Mail
                  size={17}
                  className="input-icon"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>

            {/* =================================================
                ROLE
            ================================================= */}

            <div className="form-group">

              <label>
                Choose Your Path
              </label>

              <div className="role-grid">

                <RoleButton
                  role="student"
                  active={formData.role === "student"}
                  icon={GraduationCap}
                  title="Student"
                  description="Learn & conquer"
                  onClick={handleRoleChange}
                />

                <RoleButton
                  role="instructor"
                  active={formData.role === "instructor"}
                  icon={Users}
                  title="Instructor"
                  description="Teach & lead"
                  onClick={handleRoleChange}
                />

              </div>

            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="input-wrapper">

                  <Lock
                    size={17}
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
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

                {/* Password strength */}
                {formData.password && (
                  <div className="password-strength">

                    <div className="strength-bars">

                      {[1, 2, 3].map((level) => (
                        <span
                          key={level}
                          className={
                            level <= passwordStrength
                              ? `strength-active strength-${passwordStrength}`
                              : ""
                          }
                        />
                      ))}

                    </div>

                    <span>
                      {passwordStrength === 1 &&
                        "Weak"}

                      {passwordStrength === 2 &&
                        "Good"}

                      {passwordStrength === 3 &&
                        "Strong"}
                    </span>

                  </div>
                )}

              </div>

              {/* =================================================
                  CONFIRM PASSWORD
              ================================================= */}

              <div className="form-group">

                <label htmlFor="confirmPassword">
                  Confirm
                </label>

                <div
                  className={`input-wrapper ${
                    passwordsMatch
                      ? "input-success"
                      : ""
                  }`}
                >

                  <ShieldCheck
                    size={17}
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
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

            </div>

            {/* =================================================
                OATH
            ================================================= */}

            <div className="oath-box">

              <div className="oath-icon">
                <ShieldCheck size={18} />
              </div>

              <div className="oath-content">

                <span className="oath-title">
                  THE OATH
                </span>

                <p>
                  I pledge to pursue knowledge,
                  honor the realm, and never stop learning.
                </p>

              </div>

              <div className="oath-status">
                <Check size={13} />
              </div>

            </div>

            {/* =================================================
                TERMS
            ================================================= */}

            <p className="terms-text">
              By joining the realm, you agree to our{" "}
              <Link to="/terms">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy">
                Privacy Policy
              </Link>
              .
            </p>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-loader" />
                  Forging Your Account...
                </>
              ) : (
                <>
                  <Crown size={17} />
                  Forge My Account
                  <ArrowRight size={17} />
                </>
              )}
            </button>

          </form>

          {/* =================================================
              LOGIN
          ================================================= */}

          <div className="login-footer">

            <span>
              Already sworn your oath?
            </span>

            <Link to="/login">
              Enter the Realm
              <ArrowRight size={14} />
            </Link>

          </div>

        </section>

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="register-footer">

        <span>
          © {new Date().getFullYear()} Smart LMS
        </span>

        <span className="footer-divider" />

        <span>
          Forged for those who seek knowledge
        </span>

      </footer>

      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        /* =====================================================
           PAGE
        ===================================================== */

        .register-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 20%,
              rgba(117, 28, 35, 0.16),
              transparent 40%
            ),
            #080808;
          color: #f4eadb;
          isolation: isolate;
        }

        /* =====================================================
           CURSOR

           IMPORTANT:
           No filter blur.
           No React state.
           No layout calculations.
        ===================================================== */

        .cursor-light {
          position: fixed;
          left: 0;
          top: 0;

          width: 180px;
          height: 180px;

          transform:
            translate3d(-999px, -999px, 0);

          transform-origin: center;

          border-radius: 50%;

          pointer-events: none;

          z-index: 100;

          background:
            radial-gradient(
              circle,
              rgba(182, 137, 72, 0.05),
              rgba(120, 20, 25, 0.015) 40%,
              transparent 70%
            );

          will-change: transform;
        }

        /* =====================================================
           BACKGROUND
        ===================================================== */

        .realm-background {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
        }

        .realm-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .realm-glow-one {
          width: 550px;
          height: 550px;
          top: -220px;
          right: -180px;
          background:
            radial-gradient(
              circle,
              rgba(122, 24, 29, 0.18),
              transparent 70%
            );
        }

        .realm-glow-two {
          width: 500px;
          height: 500px;
          bottom: -250px;
          left: -200px;
          background:
            radial-gradient(
              circle,
              rgba(137, 98, 44, 0.1),
              transparent 70%
            );
        }

        /* =====================================================
           MOON
        ===================================================== */

        .realm-moon {
          position: absolute;

          width: 190px;
          height: 190px;

          right: 10%;
          top: 12%;

          border-radius: 50%;

          background:
            radial-gradient(
              circle at 38% 35%,
              #f7ead3,
              #d5c3a4 58%,
              #9c8b72 100%
            );

          box-shadow:
            0 0 70px rgba(225, 208, 175, 0.12);
        }

        .moon-crater {
          position: absolute;
          border-radius: 50%;
          background: rgba(85, 73, 57, 0.12);
        }

        .moon-crater-one {
          width: 28px;
          height: 28px;
          top: 32px;
          left: 48px;
        }

        .moon-crater-two {
          width: 18px;
          height: 18px;
          top: 95px;
          left: 105px;
        }

        .moon-crater-three {
          width: 13px;
          height: 13px;
          top: 125px;
          left: 55px;
        }

        /* =====================================================
           STARS
        ===================================================== */

        .realm-star {
          position: absolute;

          width: 2px;
          height: 2px;

          border-radius: 50%;

          background: rgba(255, 236, 199, 0.7);

          box-shadow:
            0 0 7px rgba(255, 236, 199, 0.4);
        }

        /* =====================================================
           MOUNTAINS
        ===================================================== */

        .mountain {
          position: absolute;
          bottom: 0;

          width: 120%;
          left: -10%;

          clip-path: polygon(
            0 100%,
            0 65%,
            12% 45%,
            22% 62%,
            34% 34%,
            44% 58%,
            55% 28%,
            66% 60%,
            78% 39%,
            88% 58%,
            100% 35%,
            100% 100%
          );
        }

        .mountain-back {
          height: 48%;
          background: #0f1011;
          opacity: 0.9;
        }

        .mountain-middle {
          height: 35%;
          background: #0a0b0c;
          transform: scaleX(1.1);
        }

        .mountain-front {
          height: 22%;
          background: #060707;
        }

        /* =====================================================
           CASTLE
        ===================================================== */

        .realm-castle {
          position: absolute;

          bottom: 9%;
          left: 50%;

          width: 300px;
          height: 190px;

          transform: translateX(-50%);

          opacity: 0.72;
        }

        .castle-wall {
          position: absolute;

          left: 70px;
          right: 70px;
          bottom: 0;

          height: 95px;

          background: #090a0a;

          border-top:
            4px solid #141414;
        }

        .castle-wall span {
          position: absolute;
          top: -13px;

          width: 17px;
          height: 13px;

          background: #090a0a;
        }

        .castle-wall span:nth-child(1) {
          left: 8px;
        }

        .castle-wall span:nth-child(2) {
          left: 65px;
        }

        .castle-wall span:nth-child(3) {
          right: 65px;
        }

        .castle-wall span:nth-child(4) {
          right: 8px;
        }

        .castle-tower {
          position: absolute;
          bottom: 0;

          width: 58px;

          background: #080909;

          border-top:
            4px solid #151515;
        }

        .castle-tower-left {
          left: 25px;
          height: 150px;
        }

        .castle-tower-center {
          left: 121px;
          height: 178px;
        }

        .castle-tower-right {
          right: 25px;
          height: 150px;
        }

        .castle-window {
          position: absolute;

          width: 8px;
          height: 15px;

          background: rgba(181, 137, 66, 0.55);

          box-shadow:
            0 0 8px rgba(181, 137, 66, 0.2);
        }

        .castle-window-one {
          left: 50px;
          bottom: 58px;
        }

        .castle-window-two {
          left: 146px;
          bottom: 92px;
        }

        .castle-window-three {
          right: 50px;
          bottom: 58px;
        }

        /* =====================================================
           SNOW / EMBERS
        ===================================================== */

        .snow-dot,
        .ember-dot {
          position: absolute;

          width: 2px;
          height: 2px;

          border-radius: 50%;
        }

        .snow-dot {
          background: rgba(255, 255, 255, 0.4);
        }

        .ember-dot {
          background: rgba(191, 94, 40, 0.6);

          box-shadow:
            0 0 5px rgba(191, 94, 40, 0.25);
        }

        .realm-vignette {
          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              circle,
              transparent 35%,
              rgba(0, 0, 0, 0.45) 100%
            );
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .register-header {
          position: relative;
          z-index: 5;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 28px 5vw;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;

          color: inherit;
          text-decoration: none;
        }

        .brand-icon {
          display: grid;
          place-items: center;

          width: 40px;
          height: 40px;

          border:
            1px solid rgba(182, 137, 72, 0.4);

          color: #c79b59;

          background:
            rgba(182, 137, 72, 0.06);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .brand-title {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .brand-subtitle {
          color: #857b6e;
          font-size: 8px;
          letter-spacing: 0.25em;
        }

        .header-login {
          display: flex;
          align-items: center;
          gap: 10px;

          color: #8e8579;
          font-size: 12px;
        }

        .header-login a {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          color: #c79b59;
          text-decoration: none;

          transition: color 160ms ease;
        }

        .header-login a:hover {
          color: #e0b66d;
        }

        /* =====================================================
           CONTENT
        ===================================================== */

        .register-content {
          position: relative;
          z-index: 2;

          display: grid;

          grid-template-columns:
            minmax(0, 0.9fr)
            minmax(420px, 0.72fr);

          gap: 70px;

          width: min(1180px, 90vw);

          margin: 35px auto 70px;
        }

        /* =====================================================
           INTRO
        ===================================================== */

        .register-intro {
          align-self: center;
          padding: 25px 0;
        }

        .intro-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          margin-bottom: 18px;

          color: #c79b59;

          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .register-intro h1 {
          max-width: 620px;

          margin: 0;

          font-size: clamp(48px, 6vw, 82px);

          line-height: 0.92;

          letter-spacing: -0.045em;
          font-weight: 800;

          color: #eee3d2;
        }

        .register-intro h1 span {
          display: block;

          margin-top: 7px;

          color: #bd8b48;
        }

        .intro-description {
          max-width: 510px;

          margin: 28px 0;

          color: #91887c;

          font-size: 14px;
          line-height: 1.8;
        }

        /* =====================================================
           SWORD
        ===================================================== */

        .sword-decoration {
          display: flex;
          align-items: center;
          gap: 14px;

          width: min(460px, 100%);

          margin: 26px 0;
        }

        .sword-line {
          flex: 1;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(182, 137, 72, 0.35),
              transparent
            );
        }

        .sword {
          position: relative;

          width: 80px;
          height: 34px;
        }

        .sword-blade {
          position: absolute;

          left: 21px;
          top: 9px;

          width: 40px;
          height: 5px;

          background:
            linear-gradient(
              90deg,
              #7b7469,
              #d6ccbc,
              #81796d
            );

          clip-path:
            polygon(
              0 0,
              100% 50%,
              0 100%
            );
        }

        .sword-guard {
          position: absolute;

          left: 18px;
          top: 4px;

          width: 5px;
          height: 15px;

          background: #b98a4c;
        }

        .sword-handle {
          position: absolute;

          left: 3px;
          top: 8px;

          width: 17px;
          height: 7px;

          background: #6f492a;
        }

        /* =====================================================
           FEATURES
        ===================================================== */

        .realm-features {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 10px;

          max-width: 620px;
        }

        .feature-card {
          display: flex;
          align-items: flex-start;
          gap: 9px;

          padding: 13px;

          border:
            1px solid rgba(255, 255, 255, 0.055);

          background:
            rgba(255, 255, 255, 0.018);
        }

        .feature-icon {
          display: grid;
          place-items: center;

          min-width: 31px;
          height: 31px;

          color: #c79b59;

          background:
            rgba(182, 137, 72, 0.08);
        }

        .feature-card strong,
        .feature-card span {
          display: block;
        }

        .feature-card strong {
          color: #d8ccbb;

          font-size: 10px;
          line-height: 1.3;
        }

        .feature-card span {
          margin-top: 4px;

          color: #706960;

          font-size: 8px;
          line-height: 1.4;
        }

        /* =====================================================
           QUOTE
        ===================================================== */

        .realm-quote {
          display: flex;
          align-items: center;
          gap: 12px;

          margin-top: 35px;

          color: #6f685f;
        }

        .quote-mark {
          color: #9c7039;
          font-size: 30px;
        }

        .realm-quote p {
          margin: 0;

          max-width: 330px;

          font-family: Georgia, serif;

          font-size: 13px;
          font-style: italic;

          line-height: 1.5;
        }

        .quote-line {
          width: 35px;
          height: 1px;

          background: #76562e;
        }

        /* =====================================================
           REGISTER CARD

           IMPORTANT:
           NO transform-style
           NO will-change
           NO JS transform
        ===================================================== */

        .register-card {
          position: relative;

          padding: 34px;

          border:
            1px solid rgba(182, 137, 72, 0.18);

          background:
            linear-gradient(
              145deg,
              rgba(24, 23, 22, 0.96),
              rgba(12, 12, 12, 0.97)
            );

          box-shadow:
            0 25px 80px rgba(0, 0, 0, 0.45);

          transition:
            box-shadow 180ms ease,
            border-color 180ms ease;
        }

        .register-card:hover {
          border-color:
            rgba(182, 137, 72, 0.3);

          box-shadow:
            0 30px 90px rgba(0, 0, 0, 0.52);
        }

        /* =====================================================
           CARD HEADER
        ===================================================== */

        .card-header {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .card-icon {
          display: grid;
          place-items: center;

          width: 44px;
          height: 44px;

          color: #c79b59;

          border:
            1px solid rgba(182, 137, 72, 0.25);

          background:
            rgba(182, 137, 72, 0.06);
        }

        .card-eyebrow {
          display: block;

          color: #8c806f;

          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .card-header h2 {
          margin: 4px 0 0;

          color: #eee5d7;

          font-size: 25px;
          letter-spacing: -0.02em;
        }

        .card-divider {
          display: flex;
          align-items: center;
          gap: 9px;

          margin: 22px 0;
        }

        .card-divider span {
          flex: 1;

          height: 1px;

          background:
            rgba(255, 255, 255, 0.06);
        }

        .card-divider svg {
          color: #a7793f;
        }

        /* =====================================================
           FORM
        ===================================================== */

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .form-group {
          min-width: 0;
        }

        .form-group label {
          display: block;

          margin-bottom: 7px;

          color: #aaa092;

          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .input-wrapper {
          position: relative;

          display: flex;
          align-items: center;

          min-height: 46px;

          border:
            1px solid rgba(255, 255, 255, 0.075);

          background:
            rgba(255, 255, 255, 0.025);

          transition:
            border-color 160ms ease,
            background-color 160ms ease;
        }

        .input-wrapper:focus-within {
          border-color:
            rgba(182, 137, 72, 0.55);

          background:
            rgba(182, 137, 72, 0.025);
        }

        .input-icon {
          flex-shrink: 0;

          margin-left: 13px;

          color: #766e64;
        }

        .input-wrapper input {
          width: 100%;

          min-width: 0;

          height: 44px;

          padding:
            0 13px;

          border: 0;
          outline: 0;

          color: #e9dfd1;

          background: transparent;

          font-size: 12px;
        }

        .input-wrapper input::placeholder {
          color: #57514a;
        }

        .input-wrapper input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .input-success {
          border-color:
            rgba(91, 154, 92, 0.5);
        }

        .password-toggle {
          display: grid;
          place-items: center;

          width: 42px;
          height: 42px;

          flex-shrink: 0;

          border: 0;

          color: #6d665e;

          background: transparent;

          cursor: pointer;

          transition: color 160ms ease;
        }

        .password-toggle:hover {
          color: #c79b59;
        }

        /* =====================================================
           ROLE
        ===================================================== */

        .role-grid {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 9px;
        }

        .role-button {
          position: relative;

          display: flex;
          align-items: center;
          gap: 10px;

          min-height: 63px;

          padding: 10px;

          border:
            1px solid rgba(255, 255, 255, 0.065);

          color: #8d857a;

          background:
            rgba(255, 255, 255, 0.018);

          text-align: left;

          cursor: pointer;

          transition:
            border-color 160ms ease,
            background-color 160ms ease;
        }

        .role-button:hover {
          border-color:
            rgba(182, 137, 72, 0.3);
        }

        .role-button-active {
          border-color:
            rgba(182, 137, 72, 0.55);

          background:
            rgba(182, 137, 72, 0.065);

          color: #d6bd91;
        }

        .role-icon {
          display: grid;
          place-items: center;

          width: 34px;
          height: 34px;

          flex-shrink: 0;

          background:
            rgba(182, 137, 72, 0.07);

          color: #b48a50;
        }

        .role-content {
          min-width: 0;
        }

        .role-title {
          display: block;

          color: #d6ccbd;

          font-size: 10px;
          font-weight: 800;
        }

        .role-description {
          display: block;

          margin-top: 3px;

          color: #6d665e;

          font-size: 8px;
        }

        .role-check {
          position: absolute;

          top: 8px;
          right: 8px;

          display: grid;
          place-items: center;

          width: 19px;
          height: 19px;

          border-radius: 50%;

          color: #0c0b09;

          background: #b98a4c;
        }

        /* =====================================================
           PASSWORD STRENGTH
        ===================================================== */

        .password-strength {
          display: flex;
          align-items: center;
          gap: 8px;

          margin-top: 6px;
        }

        .strength-bars {
          display: flex;
          gap: 3px;

          flex: 1;
        }

        .strength-bars span {
          height: 3px;
          flex: 1;

          background: #262421;
        }

        .strength-bars .strength-active {
          background: #b98a4c;
        }

        .password-strength > span {
          min-width: 34px;

          color: #71695f;

          font-size: 8px;
          text-align: right;
        }

        /* =====================================================
           FORM ROW
        ===================================================== */

        .form-row {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 10px;
        }

        /* =====================================================
           OATH
        ===================================================== */

        .oath-box {
          display: flex;
          align-items: center;
          gap: 10px;

          padding: 12px;

          border:
            1px solid rgba(182, 137, 72, 0.12);

          background:
            rgba(182, 137, 72, 0.025);
        }

        .oath-icon {
          display: grid;
          place-items: center;

          width: 33px;
          height: 33px;

          flex-shrink: 0;

          color: #b98a4c;

          background:
            rgba(182, 137, 72, 0.08);
        }

        .oath-content {
          flex: 1;
          min-width: 0;
        }

        .oath-title {
          display: block;

          color: #b98a4c;

          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .oath-content p {
          margin: 4px 0 0;

          color: #756e65;

          font-size: 9px;
          line-height: 1.45;
        }

        .oath-status {
          display: grid;
          place-items: center;

          width: 20px;
          height: 20px;

          border-radius: 50%;

          color: #10100e;

          background: #8c744f;
        }

        /* =====================================================
           TERMS
        ===================================================== */

        .terms-text {
          margin: -3px 0 0;

          color: #625c55;

          font-size: 8px;
          line-height: 1.5;
        }

        .terms-text a {
          color: #a67b43;
          text-decoration: none;
        }

        .terms-text a:hover {
          color: #c99a5a;
        }

        /* =====================================================
           BUTTON
        ===================================================== */

        .register-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          width: 100%;
          min-height: 48px;

          border: 0;

          color: #17130d;

          background:
            linear-gradient(
              135deg,
              #d0a25c,
              #9d703a
            );

          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;

          cursor: pointer;

          transition:
            transform 160ms ease,
            filter 160ms ease;
        }

        .register-button:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.08);
        }

        .register-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .register-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .button-loader {
          width: 15px;
          height: 15px;

          border:
            2px solid rgba(20, 15, 8, 0.25);

          border-top-color: #16110b;

          border-radius: 50%;

          animation:
            button-spin 700ms linear infinite;
        }

        @keyframes button-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           LOGIN FOOTER
        ===================================================== */

        .login-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;

          margin-top: 20px;

          color: #645e56;

          font-size: 9px;
        }

        .login-footer a {
          display: inline-flex;
          align-items: center;
          gap: 4px;

          color: #b98a4c;

          text-decoration: none;
        }

        /* =====================================================
           FOOTER
        ===================================================== */

        .register-footer {
          position: relative;
          z-index: 3;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;

          padding:
            0 20px 24px;

          color: #4f4a44;

          font-size: 8px;
          letter-spacing: 0.08em;
        }

        .footer-divider {
          width: 3px;
          height: 3px;

          border-radius: 50%;

          background: #66502e;
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 950px) {

          .register-content {
            grid-template-columns: 1fr;

            width: min(650px, 90vw);

            margin-top: 20px;
          }

          .register-intro {
            text-align: center;
          }

          .register-intro h1 {
            margin-inline: auto;
          }

          .intro-description {
            margin-inline: auto;
          }

          .sword-decoration {
            margin-inline: auto;
          }

          .realm-features {
            margin-inline: auto;
          }

          .realm-quote {
            justify-content: center;
          }

          .realm-moon {
            width: 130px;
            height: 130px;

            right: 4%;
            top: 12%;
          }

        }

        @media (max-width: 640px) {

          .register-header {
            padding:
              20px 5vw;
          }

          .header-login > span {
            display: none;
          }

          .register-content {
            width: 92vw;

            gap: 25px;

            margin-top: 5px;
          }

          .register-intro {
            padding-top: 5px;
          }

          .register-intro h1 {
            font-size: 48px;
          }

          .realm-features {
            grid-template-columns: 1fr;
          }

          .feature-card {
            text-align: left;
          }

          .register-card {
            padding: 22px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .role-grid {
            grid-template-columns: 1fr;
          }

          .cursor-light {
            display: none;
          }

          .register-footer {
            flex-direction: column;
            gap: 5px;
          }

          .footer-divider {
            display: none;
          }

        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }

          .cursor-light {
            display: none;
          }

        }

      `}</style>
    </main>
  );
}

export default memo(Register);