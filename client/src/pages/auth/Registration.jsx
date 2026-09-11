import { useEffect, useState } from "react";
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
  Sparkles,
  Sword,
  UserRound,
  Users,
  WandSparkles,
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  const [cardTilt, setCardTilt] = useState({
    x: 0,
    y: 0,
  });

  // =====================================================
  // MOUSE / CURSOR EFFECT
  // =====================================================

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      setMouse({ x, y });

      const card = document.querySelector(".register-card");

      if (!card) return;

      const rect = card.getBoundingClientRect();

      const cardX = x - (rect.left + rect.width / 2);
      const cardY = y - (rect.top + rect.height / 2);

      const rotateY = Math.max(
        -4,
        Math.min(4, cardX / 35)
      );

      const rotateX = Math.max(
        -4,
        Math.min(4, -cardY / 35)
      );

      setCardTilt({
        x: rotateX,
        y: rotateY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  // =====================================================
  // INPUT
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

      console.log(
        "Registration successful:",
        response.data
      );

      toast.success(
        "Account created! Check your email to verify your account."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PASSWORD STATUS
  // =====================================================

  const passwordsMatch =
    formData.confirmPassword &&
    formData.password ===
      formData.confirmPassword;

  const passwordStrength =
    formData.password.length === 0
      ? 0
      : formData.password.length < 6
      ? 1
      : formData.password.length < 10
      ? 2
      : 3;

  return (
    <div className="got-register-page">

      {/* =================================================
          CURSOR LIGHT
      ================================================= */}

      <div
        className="cursor-light"
        style={{
          left: mouse.x,
          top: mouse.y,
        }}
      />

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="got-background">

        <div className="moon">
          <div className="moon-glow" />
        </div>

        <div className="mountains mountains-back" />
        <div className="mountains mountains-front" />

        <div className="castle">
          <div className="tower tower-left">
            <span />
            <span />
            <span />
          </div>

          <div className="castle-center">
            <div className="castle-door" />
          </div>

          <div className="tower tower-right">
            <span />
            <span />
            <span />
          </div>
        </div>

        {/* Stars */}

        <span className="star s1" />
        <span className="star s2" />
        <span className="star s3" />
        <span className="star s4" />
        <span className="star s5" />
        <span className="star s6" />
        <span className="star s7" />
        <span className="star s8" />

        {/* Snow */}

        <div className="snow-field">
          {Array.from({ length: 35 }).map(
            (_, index) => (
              <span
                key={index}
                className={`snow snow-${index}`}
              />
            )
          )}
        </div>

        {/* Embers */}

        <div className="ember-field">
          {Array.from({ length: 18 }).map(
            (_, index) => (
              <span
                key={index}
                className={`ember ember-${index}`}
              />
            )
          )}
        </div>

        <div className="fog fog-one" />
        <div className="fog fog-two" />

        <div className="vignette" />

      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="got-header">

        <Link to="/" className="got-brand">

          <div className="sigil">
            <Crown size={21} />
          </div>

          <div>
            <div className="brand-title">
              SMART<span>LMS</span>
            </div>

            <div className="brand-subtitle">
              THE REALM OF KNOWLEDGE
            </div>
          </div>

        </Link>

        <Link
          to="/"
          className="return-home"
        >
          RETURN TO THE REALM
        </Link>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="got-main">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <section className="realm-section">

          <div className="realm-label">
            <span className="realm-line" />
            THE SEVEN REALMS OF LEARNING
            <span className="realm-line" />
          </div>

          <h2 className="realm-title">

            KNOWLEDGE

            <strong>
              IS <span>POWER.</span>
            </strong>

          </h2>

          <p className="realm-description">
            Choose your path. Forge your skills.
            <br />
            Build a kingdom of knowledge.
          </p>

          {/* Sword */}

          <div className="sword-display">

            <div className="sword-glow" />

            <div className="sword">

              <div className="blade">
                <div className="blade-highlight" />
              </div>

              <div className="guard">
                <span />
                <span />
              </div>

              <div className="handle" />

              <div className="pommel" />

            </div>

          </div>

          {/* House cards */}

          <div className="realm-cards">

            <div className="realm-card">
              <Shield size={16} />

              <div>
                <small>HOUSE</small>
                <strong>KNOWLEDGE</strong>
              </div>
            </div>

            <div className="realm-card">
              <Flame size={16} />

              <div>
                <small>FORGE</small>
                <strong>YOUR SKILLS</strong>
              </div>
            </div>

            <div className="realm-card">
              <Crown size={16} />

              <div>
                <small>DESTINY</small>
                <strong>YOUR FUTURE</strong>
              </div>
            </div>

          </div>

          <div className="realm-quote">
            "A mind needs books as a sword needs a whetstone."
          </div>

        </section>

        {/* =================================================
            REGISTER CARD
        ================================================= */}

        <section
          className="register-card"
          style={{
            transform: `
              perspective(1200px)
              rotateX(${cardTilt.x}deg)
              rotateY(${cardTilt.y}deg)
            `,
          }}
        >

          {/* Metal corners */}

          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />

          <div className="card-fire-line" />

          {/* HEADER */}

          <div className="register-header">

            <div className="oath">

              <span className="oath-dot" />

              TAKE THE OATH

              <span className="oath-dot" />

            </div>

            <h1>
              Join the
              <br />
              <span>Realm.</span>
            </h1>

            <p>
              Create your account and begin your
              journey through the realm of knowledge.
            </p>

          </div>

          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="got-field">

              <label htmlFor="name">
                YOUR NAME
              </label>

              <div className="got-input">

                <UserRound
                  size={17}
                  className="field-icon"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="got-field">

              <label htmlFor="email">
                RAVEN ADDRESS
              </label>

              <div className="got-input">

                <Mail
                  size={17}
                  className="field-icon"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                />

              </div>

            </div>

            {/* ROLE */}

            <div className="got-field">

              <label>
                CHOOSE YOUR PATH
              </label>

              <div className="path-grid">

                <RoleButton
                  active={
                    formData.role === "student"
                  }
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "student",
                    }))
                  }
                  icon={
                    <GraduationCap size={19} />
                  }
                  title="Student"
                  subtitle="Walk the path"
                />

                <RoleButton
                  active={
                    formData.role === "instructor"
                  }
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "instructor",
                    }))
                  }
                  icon={<Users size={19} />}
                  title="Maester"
                  subtitle="Teach the realm"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="password-row">

              <div className="got-field">

                <label htmlFor="password">
                  SECRET WORD
                </label>

                <div className="got-input">

                  <Lock
                    size={16}
                    className="field-icon"
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

                {/* Strength */}

                {formData.password && (
                  <div className="strength">

                    <div className="strength-bars">

                      <span
                        className={
                          passwordStrength >= 1
                            ? "active"
                            : ""
                        }
                      />

                      <span
                        className={
                          passwordStrength >= 2
                            ? "active"
                            : ""
                        }
                      />

                      <span
                        className={
                          passwordStrength >= 3
                            ? "active"
                            : ""
                        }
                      />

                    </div>

                    <small>
                      {passwordStrength === 1 &&
                        "WEAK"}
                      {passwordStrength === 2 &&
                        "STRONG"}
                      {passwordStrength === 3 &&
                        "MIGHTY"}
                    </small>

                  </div>
                )}

              </div>

              {/* CONFIRM */}

              <div className="got-field">

                <label htmlFor="confirmPassword">
                  CONFIRM OATH
                </label>

                <div
                  className={`got-input ${
                    passwordsMatch
                      ? "input-valid"
                      : ""
                  }`}
                >

                  <Lock
                    size={16}
                    className="field-icon"
                  />

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

            {/* PASSWORD MATCH */}

            {formData.confirmPassword && (
              <div
                className={`oath-status ${
                  passwordsMatch
                    ? "valid"
                    : "invalid"
                }`}
              >

                {passwordsMatch ? (
                  <>
                    <Check size={13} />
                    OATH ACCEPTED — PASSWORDS MATCH
                  </>
                ) : (
                  <>
                    <span>!</span>
                    OATH REJECTED — PASSWORDS DIFFER
                  </>
                )}

              </div>
            )}

            {/* TERMS */}

            <label className="realm-terms">

              <input
                type="checkbox"
                required
              />

              <span className="terms-check">
                <Check size={10} />
              </span>

              <span>
                I swear to uphold the
                <b> terms of the realm</b> and
                acknowledge the privacy laws of
                SmartLMS.
              </span>

            </label>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className={`join-button ${
                loading ? "loading" : ""
              }`}
            >

              {loading ? (
                <>
                  <span className="button-loader" />
                  FORGING YOUR ACCOUNT...
                </>
              ) : (
                <>
                  ENTER THE REALM
                  <ArrowRight size={18} />
                </>
              )}

            </button>

          </form>

          {/* LOGIN */}

          <div className="already-member">

            <span>
              Already sworn to the realm?
            </span>

            <Link to="/login">
              RETURN TO THE THRONE
              <ArrowRight size={12} />
            </Link>

          </div>

          {/* FOOTER */}

          <div className="card-footer">

            <ShieldCheck size={13} />

            <span>
              PROTECTED BY THE NIGHT'S WATCH
            </span>

            <i />

            <WandSparkles size={12} />

            <span>
              SECURE REALM
            </span>

          </div>

        </section>

      </main>

      {/* =================================================
          STYLE
      ================================================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #050607;
        }

        .got-register-page {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow-x: hidden;
          color: #eee;
          background:
            radial-gradient(
              circle at 72% 35%,
              rgba(116, 20, 23, .18),
              transparent 32%
            ),
            radial-gradient(
              circle at 20% 60%,
              rgba(31, 48, 62, .15),
              transparent 35%
            ),
            #050607;
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
           CURSOR
        ================================================= */

        .cursor-light {
          position: fixed;
          width: 320px;
          height: 320px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 50;
          background:
            radial-gradient(
              circle,
              rgba(182, 137, 72, .08),
              rgba(120, 20, 25, .025) 35%,
              transparent 70%
            );
          filter: blur(8px);
          mix-blend-mode: screen;
        }

        /* =================================================
           BACKGROUND
        ================================================= */

        .got-background {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .moon {
          position: absolute;
          width: 180px;
          height: 180px;
          right: 13%;
          top: 12%;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 35% 30%,
              #f4f0df,
              #d9d3bd 52%,
              #a9a38f
            );
          box-shadow:
            0 0 30px rgba(220, 215, 190, .15),
            0 0 100px rgba(220, 215, 190, .07);
          opacity: .75;
          animation: moonFloat 8s ease-in-out infinite;
        }

        .moon::before,
        .moon::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          background: rgba(80, 76, 65, .12);
        }

        .moon::before {
          width: 30px;
          height: 22px;
          left: 35px;
          top: 42px;
        }

        .moon::after {
          width: 20px;
          height: 15px;
          right: 40px;
          bottom: 42px;
        }

        .moon-glow {
          position: absolute;
          inset: -70px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(220,215,190,.08),
              transparent 65%
            );
        }

        @keyframes moonFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        /* =================================================
           STARS
        ================================================= */

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: #ddd;
          box-shadow: 0 0 8px rgba(255,255,255,.5);
          animation: twinkle 3s ease-in-out infinite;
        }

        .s1 { left: 9%; top: 17%; }
        .s2 { left: 20%; top: 28%; animation-delay: .5s; }
        .s3 { left: 34%; top: 13%; animation-delay: 1s; }
        .s4 { left: 53%; top: 20%; animation-delay: 1.5s; }
        .s5 { left: 70%; top: 10%; animation-delay: 2s; }
        .s6 { left: 84%; top: 25%; animation-delay: 1.2s; }
        .s7 { left: 92%; top: 48%; animation-delay: .7s; }
        .s8 { left: 43%; top: 34%; animation-delay: 2.2s; }

        @keyframes twinkle {
          0%, 100% {
            opacity: .15;
          }

          50% {
            opacity: 1;
          }
        }

        /* =================================================
           MOUNTAINS
        ================================================= */

        .mountains {
          position: absolute;
          left: -5%;
          right: -5%;
          bottom: 0;
          height: 34%;
          clip-path: polygon(
            0 100%,
            0 65%,
            8% 45%,
            15% 67%,
            23% 35%,
            30% 63%,
            39% 28%,
            47% 60%,
            56% 38%,
            65% 68%,
            75% 32%,
            83% 59%,
            91% 40%,
            100% 64%,
            100% 100%
          );
        }

        .mountains-back {
          background: #0a0d10;
          opacity: .8;
        }

        .mountains-front {
          bottom: -2%;
          height: 26%;
          background: #050607;
          opacity: .95;
        }

        /* =================================================
           CASTLE
        ================================================= */

        .castle {
          position: absolute;
          bottom: 8%;
          left: 13%;
          width: 310px;
          height: 190px;
          opacity: .25;
          filter: blur(.2px);
        }

        .castle-center {
          position: absolute;
          bottom: 0;
          left: 70px;
          width: 170px;
          height: 120px;
          background: #050607;
          border-top: 8px solid #090b0c;
        }

        .castle-door {
          position: absolute;
          bottom: 0;
          left: 65px;
          width: 40px;
          height: 75px;
          border-radius: 40px 40px 0 0;
          background: #020304;
        }

        .tower {
          position: absolute;
          bottom: 0;
          width: 65px;
          height: 170px;
          background: #050607;
        }

        .tower-left {
          left: 20px;
        }

        .tower-right {
          right: 20px;
        }

        .tower::before {
          content: "";
          position: absolute;
          left: -6px;
          top: -15px;
          width: 77px;
          height: 20px;
          background:
            repeating-linear-gradient(
              90deg,
              #050607 0 10px,
              transparent 10px 18px
            );
        }

        .tower span {
          display: block;
          width: 18px;
          height: 27px;
          margin: 23px auto;
          background: #010203;
          border-radius: 10px 10px 0 0;
        }

        /* =================================================
           SNOW
        ================================================= */

        .snow-field,
        .ember-field {
          position: absolute;
          inset: 0;
        }

        .snow {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: rgba(230,235,240,.65);
          animation: snowFall linear infinite;
        }

        ${Array.from({ length: 35 }).map((_, i) => `
          .snow-${i} {
            left: ${(i * 17) % 100}%;
            top: ${(i * 13) % 100}%;
            animation-duration: ${6 + (i % 6)}s;
            animation-delay: -${i % 5}s;
          }
        `).join("")}

        @keyframes snowFall {
          from {
            transform: translateY(-30px) translateX(0);
            opacity: 0;
          }

          20% {
            opacity: .7;
          }

          100% {
            transform:
              translateY(110vh)
              translateX(40px);
            opacity: 0;
          }
        }

        /* =================================================
           EMBERS
        ================================================= */

        .ember {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #b83b2d;
          box-shadow: 0 0 10px rgba(190,50,30,.6);
          animation: emberRise linear infinite;
        }

        ${Array.from({ length: 18 }).map((_, i) => `
          .ember-${i} {
            left: ${(i * 23) % 100}%;
            bottom: ${(i * 11) % 40}%;
            animation-duration: ${5 + (i % 5)}s;
            animation-delay: -${i % 4}s;
          }
        `).join("")}

        @keyframes emberRise {
          from {
            transform:
              translateY(0)
              translateX(0)
            scale(.5);
            opacity: 0;
          }

          25% {
            opacity: .8;
          }

          100% {
            transform:
              translateY(-70vh)
              translateX(80px)
              scale(1.3);
            opacity: 0;
          }
        }

        /* =================================================
           FOG
        ================================================= */

        .fog {
          position: absolute;
          width: 70%;
          height: 160px;
          border-radius: 50%;
          filter: blur(45px);
          background: rgba(120,130,135,.035);
          animation: fogMove 18s ease-in-out infinite;
        }

        .fog-one {
          bottom: 14%;
          left: -20%;
        }

        .fog-two {
          bottom: 25%;
          right: -20%;
          animation-delay: 5s;
        }

        @keyframes fogMove {
          0%, 100% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(120px);
          }
        }

        .vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle,
              transparent 35%,
              rgba(0,0,0,.75) 100%
            );
        }

        /* =================================================
           HEADER
        ================================================= */

        .got-header {
          position: relative;
          z-index: 10;
          height: 78px;
          padding: 0 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(191,155,92,.14);
          background: rgba(4,5,6,.82);
          backdrop-filter: blur(18px);
        }

        .got-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #eee;
          text-decoration: none;
        }

        .sigil {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c09a58;
          border: 1px solid rgba(192,154,88,.45);
          background:
            linear-gradient(
              145deg,
              #171512,
              #080909
            );
          box-shadow:
            inset 0 0 15px rgba(190,150,80,.06),
            0 0 25px rgba(170,120,50,.06);
        }

        .brand-title {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -.5px;
        }

        .brand-title span {
          color: #b68b4f;
        }

        .brand-subtitle {
          margin-top: 3px;
          font-size: 7px;
          letter-spacing: 2px;
          color: #666;
        }

        .return-home {
          color: #777;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-decoration: none;
          transition: .3s;
        }

        .return-home:hover {
          color: #c6a36b;
          text-shadow:
            0 0 15px rgba(198,163,107,.3);
        }

        /* =================================================
           MAIN
        ================================================= */

        .got-main {
          position: relative;
          z-index: 5;
          max-width: 1250px;
          min-height: calc(100vh - 78px);
          margin: auto;
          padding: 50px 45px 70px;
          display: grid;
          grid-template-columns:
            minmax(350px, 1fr)
            minmax(460px, 540px);
          gap: 75px;
          align-items: center;
        }

        /* =================================================
           REALM SECTION
        ================================================= */

        .realm-section {
          position: relative;
          min-height: 610px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .realm-label {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #76694f;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 2.5px;
          margin-bottom: 25px;
        }

        .realm-line {
          width: 35px;
          height: 1px;
          background:
            linear-gradient(
              90deg,
              transparent,
              #9d7c48
            );
        }

        .realm-line:last-child {
          background:
            linear-gradient(
              90deg,
              #9d7c48,
              transparent
            );
        }

        .realm-title {
          margin: 0;
          font-size: clamp(50px, 5vw, 74px);
          line-height: .9;
          letter-spacing: -4px;
          font-weight: 300;
          color: #b7b7b7;
        }

        .realm-title strong {
          display: block;
          color: #eee;
          font-weight: 900;
        }

        .realm-title span {
          color: #a87943;
          text-shadow:
            0 0 35px rgba(170,110,50,.18);
        }

        .realm-description {
          margin-top: 28px;
          color: #686868;
          line-height: 1.8;
          font-size: 13px;
        }

        /* =================================================
           SWORD
        ================================================= */

        .sword-display {
          position: absolute;
          right: 3%;
          bottom: 12%;
          width: 250px;
          height: 280px;
          display: flex;
          justify-content: center;
          opacity: .72;
          transform: rotate(12deg);
        }

        .sword {
          position: relative;
          width: 50px;
          height: 270px;
          animation: swordFloat 5s ease-in-out infinite;
        }

        @keyframes swordFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }

        .blade {
          position: absolute;
          top: 0;
          left: 16px;
          width: 20px;
          height: 190px;
          background:
            linear-gradient(
              90deg,
              #51575b,
              #d6d8d6 45%,
              #70767a
            );
          clip-path: polygon(
            0 0,
            100% 0,
            100% 85%,
            50% 100%,
            0 85%
          );
          box-shadow:
            0 0 20px rgba(200,205,205,.1);
        }

        .blade-highlight {
          position: absolute;
          width: 2px;
          height: 160px;
          left: 8px;
          top: 10px;
          background: rgba(255,255,255,.35);
        }

        .guard {
          position: absolute;
          top: 180px;
          left: 0;
          width: 52px;
          height: 15px;
          border-radius: 4px;
          background:
            linear-gradient(
              90deg,
              #6c522f,
              #c7a260,
              #6c522f
            );
          box-shadow:
            0 0 15px rgba(180,130,60,.2);
        }

        .handle {
          position: absolute;
          top: 193px;
          left: 19px;
          width: 13px;
          height: 55px;
          background:
            repeating-linear-gradient(
              0deg,
              #241a12 0 8px,
              #5e4329 8px 12px
            );
        }

        .pommel {
          position: absolute;
          top: 243px;
          left: 15px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              #d2ad68,
              #684d2d
            );
        }

        .sword-glow {
          position: absolute;
          width: 170px;
          height: 270px;
          background:
            radial-gradient(
              ellipse,
              rgba(195,160,95,.08),
              transparent 65%
            );
          filter: blur(15px);
        }

        /* =================================================
           REALM CARDS
        ================================================= */

        .realm-cards {
          position: absolute;
          left: 0;
          bottom: 3%;
          display: flex;
          gap: 10px;
        }

        .realm-card {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 115px;
          padding: 9px 11px;
          border: 1px solid rgba(255,255,255,.07);
          background: rgba(8,9,10,.6);
          backdrop-filter: blur(12px);
          transition: .3s;
        }

        .realm-card:hover {
          transform: translateY(-5px);
          border-color: rgba(190,150,80,.35);
          box-shadow:
            0 10px 30px rgba(0,0,0,.4),
            0 0 25px rgba(170,120,50,.06);
        }

        .realm-card svg {
          color: #ad8145;
        }

        .realm-card small,
        .realm-card strong {
          display: block;
        }

        .realm-card small {
          color: #555;
          font-size: 6px;
          letter-spacing: 1.4px;
        }

        .realm-card strong {
          color: #aaa;
          font-size: 8px;
          margin-top: 3px;
          letter-spacing: .8px;
        }

        .realm-quote {
          position: absolute;
          left: 0;
          bottom: -5%;
          color: #454545;
          font-size: 9px;
          font-style: italic;
          letter-spacing: .5px;
        }

        /* =================================================
           REGISTER CARD
        ================================================= */

        .register-card {
          position: relative;
          padding: 39px 40px 28px;
          background:
            linear-gradient(
              145deg,
              rgba(25,25,23,.98),
              rgba(9,10,10,.98)
            );
          border:
            1px solid
            rgba(191,155,91,.22);
          box-shadow:
            0 40px 100px rgba(0,0,0,.7),
            inset 0 0 50px rgba(255,255,255,.015),
            0 0 60px rgba(110,20,20,.04);
          transition:
            transform .15s ease-out,
            box-shadow .3s;
          transform-style: preserve-3d;
        }

        .register-card:hover {
          box-shadow:
            0 45px 110px rgba(0,0,0,.75),
            inset 0 0 50px rgba(255,255,255,.02),
            0 0 80px rgba(140,25,25,.06);
        }

        .card-fire-line {
          position: absolute;
          top: 0;
          left: 8%;
          right: 8%;
          height: 2px;
          background:
            linear-gradient(
              90deg,
              transparent,
              #9d2a25,
              #c39a57,
              #9d2a25,
              transparent
            );
          box-shadow:
            0 0 20px rgba(180,50,30,.35);
          animation: fireLine 4s linear infinite;
        }

        @keyframes fireLine {
          0% {
            opacity: .4;
          }

          50% {
            opacity: 1;
          }

          100% {
            opacity: .4;
          }
        }

        .corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: rgba(190,150,80,.55);
          border-style: solid;
        }

        .corner-tl {
          top: 10px;
          left: 10px;
          border-width: 1px 0 0 1px;
        }

        .corner-tr {
          top: 10px;
          right: 10px;
          border-width: 1px 1px 0 0;
        }

        .corner-bl {
          bottom: 10px;
          left: 10px;
          border-width: 0 0 1px 1px;
        }

        .corner-br {
          bottom: 10px;
          right: 10px;
          border-width: 0 1px 1px 0;
        }

        /* =================================================
           HEADER
        ================================================= */

        .register-header {
          margin-bottom: 27px;
        }

        .oath {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #88734f;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 2px;
          margin-bottom: 15px;
        }

        .oath-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #9b3028;
          box-shadow:
            0 0 10px rgba(180,40,30,.7);
          animation: pulseOath 2s infinite;
        }

        @keyframes pulseOath {
          0%, 100% {
            opacity: .4;
          }

          50% {
            opacity: 1;
          }
        }

        .register-header h1 {
          margin: 0;
          font-size: 31px;
          line-height: 1.05;
          letter-spacing: -1.5px;
          color: #e5e2dc;
        }

        .register-header h1 span {
          color: #ad8248;
          text-shadow:
            0 0 25px rgba(170,120,60,.15);
        }

        .register-header p {
          margin: 12px 0 0;
          color: #6c6c68;
          font-size: 11px;
          line-height: 1.65;
        }

        /* =================================================
           FORM
        ================================================= */

        .got-field {
          margin-bottom: 15px;
        }

        .got-field label {
          display: block;
          margin-bottom: 7px;
          color: #77736b;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.8px;
        }

        .got-input {
          position: relative;
          height: 46px;
          display: flex;
          align-items: center;
          border: 1px solid #292927;
          background:
            linear-gradient(
              90deg,
              #0b0c0c,
              #0d0e0e
            );
          transition: .3s;
        }

        .got-input:hover {
          border-color: #454039;
        }

        .got-input:focus-within {
          border-color:
            rgba(172,126,66,.7);
          box-shadow:
            0 0 0 1px
            rgba(172,126,66,.12),
            0 0 30px
            rgba(170,110,40,.06);
        }

        .field-icon {
          margin-left: 13px;
          color: #55524d;
          flex-shrink: 0;
          transition: .3s;
        }

        .got-input:focus-within
        .field-icon {
          color: #b78a4e;
        }

        .got-input input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #e5e3dd;
          padding: 0 12px 0 10px;
          font-size: 12px;
        }

        .got-input input::placeholder {
          color: #44443f;
        }

        .got-input input:-webkit-autofill,
        .got-input input:-webkit-autofill:hover,
        .got-input input:-webkit-autofill:focus {
          -webkit-text-fill-color: #eee;
          -webkit-box-shadow:
            0 0 0 1000px
            #0b0c0c inset;
        }

        .eye-button {
          width: 38px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: #555;
          cursor: pointer;
          transition: .2s;
        }

        .eye-button:hover {
          color: #bc914f;
        }

        /* =================================================
           PATH
        ================================================= */

        .path-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .path-button {
          position: relative;
          height: 70px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 12px;
          border: 1px solid #292927;
          background: #0b0c0c;
          color: #eee;
          text-align: left;
          cursor: pointer;
          overflow: hidden;
          transition: .3s;
        }

        .path-button::before {
          content: "";
          position: absolute;
          left: -100%;
          top: 0;
          width: 100%;
          height: 100%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(180,140,80,.06),
              transparent
            );
          transition: .5s;
        }

        .path-button:hover::before {
          left: 100%;
        }

        .path-button:hover {
          transform: translateY(-2px);
          border-color: #49453d;
        }

        .path-button.active {
          border-color:
            rgba(171,126,65,.75);
          background:
            linear-gradient(
              135deg,
              rgba(105,65,25,.16),
              #0c0d0d
            );
          box-shadow:
            inset 3px 0 0 #a87a42,
            0 0 25px
            rgba(160,110,50,.05);
        }

        .path-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid #33322e;
          background: #151514;
          color: #66635c;
          transition: .3s;
        }

        .path-button.active
        .path-icon {
          color: #c09555;
          border-color:
            rgba(180,130,60,.45);
          background:
            rgba(120,80,30,.12);
        }

        .path-title {
          color: #ddd;
          font-size: 11px;
          font-weight: 800;
        }

        .path-subtitle {
          margin-top: 4px;
          color: #55544f;
          font-size: 7px;
          letter-spacing: .5px;
        }

        .path-mark {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: 1px solid #4c4b46;
        }

        .path-button.active
        .path-mark {
          background: #b88a4d;
          border-color: #b88a4d;
          box-shadow:
            0 0 10px rgba(190,140,60,.7);
        }

        /* =================================================
           PASSWORD
        ================================================= */

        .password-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .strength {
          margin-top: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .strength-bars {
          display: flex;
          gap: 3px;
        }

        .strength-bars span {
          width: 25px;
          height: 2px;
          background: #282825;
          transition: .3s;
        }

        .strength-bars span.active {
          background: #a67b44;
          box-shadow:
            0 0 8px rgba(170,120,60,.4);
        }

        .strength small {
          color: #625b4e;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .input-valid {
          border-color:
            rgba(70,150,105,.45);
        }

        .oath-status {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: -4px;
          margin-bottom: 10px;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .oath-status.valid {
          color: #55ad80;
        }

        .oath-status.invalid {
          color: #b74b43;
        }

        .oath-status.invalid span {
          width: 12px;
          height: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #9d423c;
          border-radius: 50%;
        }

        /* =================================================
           TERMS
        ================================================= */

        .realm-terms {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 11px;
          border: 1px solid #272724;
          background: rgba(255,255,255,.012);
          color: #5e5d58;
          font-size: 8px;
          line-height: 1.65;
          cursor: pointer;
        }

        .realm-terms input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .terms-check {
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid #41413d;
          color: transparent;
          background: #090a0a;
        }

        .realm-terms input:checked
        + .terms-check {
          color: white;
          background: #9c3029;
          border-color: #9c3029;
          box-shadow:
            0 0 12px
            rgba(160,40,30,.25);
        }

        .realm-terms b {
          color: #9d8766;
        }

        /* =================================================
           BUTTON
        ================================================= */

        .join-button {
          position: relative;
          width: 100%;
          height: 50px;
          margin-top: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          overflow: hidden;
          border: 1px solid #a1352e;
          background:
            linear-gradient(
              100deg,
              #651d1b,
              #9b3029,
              #71301f,
              #9b3029
            );
          background-size: 300% 100%;
          color: #f5eee3;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
          cursor: pointer;
          box-shadow:
            0 10px 35px
            rgba(100,25,20,.18);
          animation:
            buttonFlow 6s linear infinite;
          transition: .3s;
        }

        @keyframes buttonFlow {
          from {
            background-position: 0% 50%;
          }

          to {
            background-position: 300% 50%;
          }
        }

        .join-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 55%;
          height: 100%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.14),
              transparent
            );
          transform: skewX(-25deg);
          animation: buttonShine 4s infinite;
        }

        @keyframes buttonShine {
          0% {
            left: -100%;
          }

          40%, 100% {
            left: 140%;
          }
        }

        .join-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow:
            0 15px 45px
            rgba(130,30,25,.3),
            0 0 25px
            rgba(180,100,50,.08);
        }

        .join-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .join-button.loading {
          opacity: .65;
          cursor: not-allowed;
          animation: none;
        }

        .button-loader {
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

        .already-member {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 19px;
          padding-top: 17px;
          border-top: 1px solid #22221f;
          color: #55544f;
          font-size: 9px;
        }

        .already-member a {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #b4874d;
          font-weight: 900;
          text-decoration: none;
          transition: .25s;
        }

        .already-member a:hover {
          color: #d0a76b;
          text-shadow:
            0 0 12px
            rgba(190,140,70,.25);
        }

        /* =================================================
           FOOTER
        ================================================= */

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 17px;
          color: #3f3e3a;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .card-footer svg {
          color: #5d5548;
        }

        .card-footer i {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #555047;
        }

        /* =================================================
           RESPONSIVE
        ================================================= */

        @media (max-width: 1000px) {

          .got-main {
            grid-template-columns: 1fr;
            max-width: 650px;
            gap: 30px;
          }

          .realm-section {
            min-height: 390px;
            align-items: center;
            text-align: center;
          }

          .realm-label {
            justify-content: center;
          }

          .realm-cards {
            position: relative;
            bottom: auto;
            margin-top: 25px;
          }

          .realm-quote {
            position: relative;
            bottom: auto;
            margin-top: 20px;
          }

          .sword-display {
            display: none;
          }

          .castle {
            left: 50%;
            transform: translateX(-50%);
          }

        }

        @media (max-width: 650px) {

          .got-header {
            height: 68px;
            padding: 0 18px;
          }

          .brand-subtitle {
            display: none;
          }

          .return-home {
            font-size: 7px;
          }

          .got-main {
            padding:
              30px
              14px
              50px;
          }

          .realm-section {
            min-height: 300px;
          }

          .realm-title {
            font-size: 46px;
            letter-spacing: -3px;
          }

          .realm-cards {
            width: 100%;
            justify-content: center;
          }

          .realm-card {
            min-width: 0;
            flex: 1;
          }

          .realm-card strong {
            font-size: 7px;
          }

          .register-card {
            padding:
              30px
              20px
              23px;
          }

          .password-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .register-header h1 {
            font-size: 28px;
          }

        }

        @media (max-width: 420px) {

          .realm-cards {
            gap: 5px;
          }

          .realm-card {
            padding: 8px 6px;
          }

          .realm-card svg {
            display: none;
          }

          .path-grid {
            grid-template-columns: 1fr;
          }

          .got-header {
            padding: 0 12px;
          }

          .brand-title {
            font-size: 16px;
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
      className={`path-button ${
        active ? "active" : ""
      }`}
    >

      <div className="path-icon">
        {icon}
      </div>

      <div>
        <div className="path-title">
          {title}
        </div>

        <div className="path-subtitle">
          {subtitle}
        </div>
      </div>

      <span className="path-mark" />

    </button>
  );
}

export default Register;