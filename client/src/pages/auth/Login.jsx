import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
  Crosshair,
  Target,
  ScanLine,
  Activity,
  LockKeyhole,
  Fingerprint,
  Radio,
  CircleDot,
  ChevronRight,
  Crown,
  Zap,
  Orbit,
  BadgeCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password, formData.role);

      toast.success(
        `Welcome back, ${
          formData.role === "student"
            ? "Student"
            : "Instructor"
        }!`
      );

      if (formData.role === "instructor") {
        navigate("/instructor/dashboard", {
          replace: true,
        });
      } else {
        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* =====================================================
          GLOBAL CINEMATIC BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Red cinematic glow */}

        <div
          className="
            absolute
            -left-40
            top-1/4
            h-[500px]
            w-[500px]
            rounded-full
            bg-red-950/30
            blur-[120px]
            animate-[ambientGlow_8s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute
            -right-40
            bottom-0
            h-[500px]
            w-[500px]
            rounded-full
            bg-red-950/20
            blur-[120px]
            animate-[ambientGlow_10s_ease-in-out_infinite_reverse]
          "
        />

        {/* Tactical grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.055]
            [background-image:linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)]
            [background-size:45px_45px]
          "
        />

        {/* Diagonal cinematic pattern */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:repeating-linear-gradient(135deg,#ffffff_0px,#ffffff_1px,transparent_1px,transparent_18px)]
          "
        />

        {/* Horizontal scan */}

        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-red-500
            to-transparent
            shadow-[0_0_15px_rgba(239,68,68,0.8)]
            animate-[scan_7s_linear_infinite]
          "
        />

        {/* Small floating particles */}

        <CircleDot
          size={8}
          className="
            absolute
            left-[12%]
            top-[25%]
            text-red-500/60
            animate-[particle_5s_ease-in-out_infinite]
          "
        />

        <CircleDot
          size={6}
          className="
            absolute
            left-[42%]
            top-[15%]
            text-zinc-500/50
            animate-[particle_7s_ease-in-out_infinite_1s]
          "
        />

        <CircleDot
          size={7}
          className="
            absolute
            right-[20%]
            top-[35%]
            text-red-500/50
            animate-[particle_6s_ease-in-out_infinite_2s]
          "
        />

        <Sparkles
          size={13}
          className="
            absolute
            right-[12%]
            bottom-[20%]
            text-amber-500/40
            animate-[sparkFloat_4s_ease-in-out_infinite]
          "
        />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          relative
          z-20
          border-b
          border-zinc-900
          bg-black/60
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            h-[74px]
            max-w-[1500px]
            items-center
            justify-between
            px-5
            sm:px-8
            lg:px-10
          "
        >
          {/* Logo */}

          <Link
            to="/"
            className="
              group
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-red-800/70
                bg-gradient-to-br
                from-red-700
                to-black
                shadow-[0_0_20px_rgba(220,38,38,0.2)]
                transition-all
                duration-300
                group-hover:scale-105
                group-hover:shadow-[0_0_30px_rgba(220,38,38,0.35)]
              "
            >
              <BookOpen
                size={19}
                className="text-red-100"
              />

              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  h-2
                  w-2
                  animate-pulse
                  rounded-full
                  bg-red-500
                  shadow-[0_0_8px_rgba(239,68,68,0.9)]
                "
              />
            </div>

            <div>
              <h1
                className="
                  text-lg
                  font-black
                  tracking-tight
                  text-white
                "
              >
                Smart<span className="text-red-500">LMS</span>
              </h1>

              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.3em]
                  text-zinc-600
                "
              >
                Learning Intelligence
              </p>
            </div>
          </Link>

          {/* Security status */}

          <div
            className="
              hidden
              items-center
              gap-2
              rounded-full
              border
              border-zinc-800
              bg-zinc-950/80
              px-3
              py-1.5
              sm:flex
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                animate-pulse
                rounded-full
                bg-emerald-500
                shadow-[0_0_8px_rgba(16,185,129,0.7)]
              "
            />

            <span
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.18em]
                text-zinc-500
              "
            >
              System Secure
            </span>

            <ShieldCheck
              size={12}
              className="text-emerald-500"
            />
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          relative
          z-10
          flex
          min-h-[calc(100vh-74px)]
          items-center
          justify-center
          px-4
          py-8
          sm:px-6
          lg:px-10
          lg:py-12
        "
      >
        <div
          className="
            mx-auto
            grid
            w-full
            max-w-[1180px]
            overflow-hidden
            rounded-[30px]
            border
            border-zinc-800
            bg-[#0a0a0a]/95
            shadow-[0_30px_100px_rgba(0,0,0,0.65)]
            lg:grid-cols-[1.05fr_0.95fr]
          "
        >
          {/* =================================================
              LEFT CINEMATIC PANEL
          ================================================= */}

          <div
            className="
              relative
              hidden
              min-h-[680px]
              overflow-hidden
              border-r
              border-zinc-800
              bg-[#080808]
              lg:block
            "
          >
            {/* Cinematic red glow */}

            <div
              className="
                absolute
                -left-32
                top-1/4
                h-[500px]
                w-[500px]
                rounded-full
                bg-red-950/40
                blur-[130px]
              "
            />

            {/* Vertical light */}

            <div
              className="
                absolute
                bottom-0
                left-[18%]
                top-0
                w-px
                bg-gradient-to-b
                from-transparent
                via-red-900/60
                to-transparent
              "
            />

            {/* Tactical HUD */}

            <div className="absolute inset-0">
              <div
                className="
                  absolute
                  left-10
                  top-10
                  h-16
                  w-16
                  border-l
                  border-t
                  border-red-800/70
                "
              />

              <div
                className="
                  absolute
                  bottom-10
                  right-10
                  h-16
                  w-16
                  border-b
                  border-r
                  border-red-800/70
                "
              />

              <div
                className="
                  absolute
                  right-12
                  top-12
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.25em]
                  text-zinc-700
                "
              >
                INTELLIGENCE // 01
              </div>
            </div>

            {/* Main content */}

            <div
              className="
                relative
                z-10
                flex
                h-full
                flex-col
                justify-between
                p-10
                xl:p-12
              "
            >
              {/* Top */}

              <div>
                <div
                  className="
                    mb-8
                    flex
                    items-center
                    gap-2
                    text-red-500
                  "
                >
                  <Crosshair
                    size={16}
                    className="animate-pulse"
                  />

                  <span
                    className="
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.3em]
                    "
                  >
                    Mission Control
                  </span>
                </div>

                <h2
                  className="
                    max-w-lg
                    text-5xl
                    font-black
                    leading-[0.98]
                    tracking-[-0.04em]
                    text-white
                    xl:text-6xl
                  "
                >
                  MASTER
                  <br />
                  <span className="text-red-600">
                    YOUR CRAFT.
                  </span>
                </h2>

                <p
                  className="
                    mt-6
                    max-w-md
                    text-sm
                    leading-7
                    text-zinc-500
                  "
                >
                  Enter the learning network. Build your
                  skills, complete your missions, and move
                  one level closer to mastery.
                </p>
              </div>

              {/* Central tactical graphic */}

              <div
                className="
                  relative
                  mx-auto
                  flex
                  h-[290px]
                  w-[290px]
                  items-center
                  justify-center
                "
              >
                {/* Outer rotating ring */}

                <div
                  className="
                    absolute
                    inset-0
                    rounded-full
                    border
                    border-dashed
                    border-red-900/50
                    animate-[rotate_18s_linear_infinite]
                  "
                />

                {/* Middle ring */}

                <div
                  className="
                    absolute
                    inset-7
                    rounded-full
                    border
                    border-zinc-800
                    animate-[rotateReverse_25s_linear_infinite]
                  "
                />

                {/* Crosshair */}

                <div className="absolute inset-12">
                  <div
                    className="
                      absolute
                      left-1/2
                      top-0
                      h-full
                      w-px
                      -translate-x-1/2
                      bg-gradient-to-b
                      from-transparent
                      via-red-900
                      to-transparent
                    "
                  />

                  <div
                    className="
                      absolute
                      left-0
                      top-1/2
                      h-px
                      w-full
                      -translate-y-1/2
                      bg-gradient-to-r
                      from-transparent
                      via-red-900
                      to-transparent
                    "
                  />
                </div>

                {/* Center */}

                <div
                  className="
                    relative
                    flex
                    h-32
                    w-32
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-red-700/60
                    bg-gradient-to-br
                    from-zinc-800
                    via-zinc-950
                    to-black
                    shadow-[0_0_60px_rgba(220,38,38,0.18)]
                    animate-[centerPulse_4s_ease-in-out_infinite]
                  "
                >
                  <Crosshair
                    size={65}
                    strokeWidth={1}
                    className="
                      text-red-600
                      drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]
                    "
                  />

                  <div
                    className="
                      absolute
                      h-2
                      w-2
                      animate-ping
                      rounded-full
                      bg-red-500
                    "
                  />
                </div>

                {/* Orbiting icons */}

                <div
                  className="
                    absolute
                    -right-2
                    top-1/2
                    flex
                    h-10
                    w-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-zinc-800
                    bg-black
                    text-red-500
                    shadow-lg
                    animate-[iconOrbit_4s_ease-in-out_infinite]
                  "
                >
                  <Target size={17} />
                </div>

                <div
                  className="
                    absolute
                    bottom-5
                    left-10
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-zinc-800
                    bg-black
                    text-amber-500
                    animate-[iconFloat_3s_ease-in-out_infinite]
                  "
                >
                  <Crown size={15} />
                </div>

                <div
                  className="
                    absolute
                    left-4
                    top-10
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-zinc-800
                    bg-black
                    text-zinc-500
                    animate-[iconFloat_4s_ease-in-out_infinite]
                  "
                >
                  <Activity size={15} />
                </div>
              </div>

              {/* Bottom status */}

              <div>
                <div
                  className="
                    mb-4
                    flex
                    items-center
                    justify-between
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                  "
                >
                  <span className="text-zinc-600">
                    Progress System
                  </span>

                  <span className="text-red-500">
                    Online
                  </span>
                </div>

                <div className="h-1 overflow-hidden bg-zinc-900">
                  <div
                    className="
                      h-full
                      w-[72%]
                      bg-gradient-to-r
                      from-red-950
                      via-red-700
                      to-red-500
                      shadow-[0_0_12px_rgba(239,68,68,0.5)]
                      animate-[progressPulse_3s_ease-in-out_infinite]
                    "
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className="
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.2em]
                      text-zinc-700
                    "
                  >
                    SMART LMS // SECURE NETWORK
                  </span>

                  <Radio
                    size={13}
                    className="
                      animate-pulse
                      text-red-600
                    "
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT LOGIN PANEL
          ================================================= */}

          <div
            className="
              relative
              flex
              items-center
              bg-[#0c0c0c]
              p-6
              sm:p-10
              lg:p-12
            "
          >
            {/* Corner decorations */}

            <div
              className="
                pointer-events-none
                absolute
                right-0
                top-0
                h-24
                w-24
                border-r
                border-t
                border-red-900/30
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                left-0
                h-20
                w-20
                border-b
                border-l
                border-red-900/30
              "
            />

            <div className="relative z-10 w-full">
              {/* =================================================
                  FORM HEADER
              ================================================= */}

              <div className="mb-8">
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-red-900/60
                      bg-red-950/30
                      text-red-500
                      shadow-[0_0_20px_rgba(220,38,38,0.1)]
                      animate-[iconFloat_3s_ease-in-out_infinite]
                    "
                  >
                    <Fingerprint size={20} />
                  </div>

                  <div>
                    <p
                      className="
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.25em]
                        text-red-500
                      "
                    >
                      Authentication
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-zinc-700
                      "
                    >
                      Secure access protocol
                    </p>
                  </div>
                </div>

                <h2
                  className="
                    text-3xl
                    font-black
                    tracking-[-0.03em]
                    text-white
                    sm:text-4xl
                  "
                >
                  Welcome back.
                </h2>

                <p
                  className="
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-zinc-500
                  "
                >
                  Sign in to continue your learning mission.
                </p>
              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <form onSubmit={handleSubmit}>
                {/* =================================================
                    ROLE SELECTOR
                ================================================= */}

                <div className="mb-6">
                  <div className="mb-3 flex items-center justify-between">
                    <label
                      className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.18em]
                        text-zinc-500
                      "
                    >
                      Access level
                    </label>

                    <span
                      className="
                        flex
                        items-center
                        gap-1
                        text-[9px]
                        font-bold
                        text-zinc-700
                      "
                    >
                      <LockKeyhole size={10} />

                      Role based
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Student */}

                    <button
                      type="button"
                      onClick={() =>
                        handleRoleChange("student")
                      }
                      className={`
                        group/role
                        relative
                        overflow-hidden
                        rounded-xl
                        border
                        p-3
                        text-left
                        transition-all
                        duration-300
                        ${
                          formData.role === "student"
                            ? "border-red-700/70 bg-red-950/20 shadow-[0_0_25px_rgba(220,38,38,0.08)]"
                            : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                        }
                      `}
                    >
                      {formData.role === "student" && (
                        <div
                          className="
                            absolute
                            bottom-0
                            left-0
                            h-px
                            w-full
                            bg-gradient-to-r
                            from-transparent
                            via-red-500
                            to-transparent
                          "
                        />
                      )}

                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            transition-all
                            ${
                              formData.role === "student"
                                ? "border-red-800 bg-red-950/50 text-red-500"
                                : "border-zinc-800 bg-zinc-900 text-zinc-600"
                            }
                          `}
                        >
                          <GraduationCap size={18} />
                        </div>

                        <div>
                          <p
                            className={`
                              text-xs
                              font-black
                              ${
                                formData.role === "student"
                                  ? "text-white"
                                  : "text-zinc-400"
                              }
                            `}
                          >
                            Student
                          </p>

                          <p className="mt-0.5 text-[9px] text-zinc-600">
                            Learn & progress
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Instructor */}

                    <button
                      type="button"
                      onClick={() =>
                        handleRoleChange("instructor")
                      }
                      className={`
                        group/role
                        relative
                        overflow-hidden
                        rounded-xl
                        border
                        p-3
                        text-left
                        transition-all
                        duration-300
                        ${
                          formData.role === "instructor"
                            ? "border-red-700/70 bg-red-950/20 shadow-[0_0_25px_rgba(220,38,38,0.08)]"
                            : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                        }
                      `}
                    >
                      {formData.role === "instructor" && (
                        <div
                          className="
                            absolute
                            bottom-0
                            left-0
                            h-px
                            w-full
                            bg-gradient-to-r
                            from-transparent
                            via-red-500
                            to-transparent
                          "
                        />
                      )}

                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            transition-all
                            ${
                              formData.role === "instructor"
                                ? "border-red-800 bg-red-950/50 text-red-500"
                                : "border-zinc-800 bg-zinc-900 text-zinc-600"
                            }
                          `}
                        >
                          <Users size={18} />
                        </div>

                        <div>
                          <p
                            className={`
                              text-xs
                              font-black
                              ${
                                formData.role === "instructor"
                                  ? "text-white"
                                  : "text-zinc-400"
                              }
                            `}
                          >
                            Instructor
                          </p>

                          <p className="mt-0.5 text-[9px] text-zinc-600">
                            Teach & manage
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* =================================================
                    EMAIL
                ================================================= */}

                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.15em]
                      text-zinc-500
                    "
                  >
                    Email address
                  </label>

                  <div className="group/input relative">
                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-0
                        top-0
                        h-full
                        w-0.5
                        bg-red-600
                        opacity-0
                        transition-opacity
                        group-focus-within/input:opacity-100
                      "
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-zinc-800
                        bg-zinc-950
                        px-4
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-zinc-700
                        transition-all
                        focus:border-red-800
                        focus:bg-black
                        focus:ring-1
                        focus:ring-red-900/40
                      "
                    />
                  </div>
                </div>

                {/* =================================================
                    PASSWORD
                ================================================= */}

                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-zinc-500
                      "
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="
                        text-[10px]
                        font-bold
                        text-red-500
                        transition-colors
                        hover:text-red-400
                      "
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="group/input relative">
                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-0
                        top-0
                        h-full
                        w-0.5
                        bg-red-600
                        opacity-0
                        transition-opacity
                        group-focus-within/input:opacity-100
                      "
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
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-zinc-800
                        bg-zinc-950
                        px-4
                        pr-12
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-zinc-700
                        transition-all
                        focus:border-red-800
                        focus:bg-black
                        focus:ring-1
                        focus:ring-red-900/40
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      className="
                        absolute
                        right-2
                        top-1/2
                        flex
                        h-8
                        w-8
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-lg
                        text-zinc-600
                        transition-all
                        hover:bg-zinc-900
                        hover:text-red-500
                      "
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {/* =================================================
                    SECURITY
                ================================================= */}

                <div className="mb-6 flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="
                        h-3.5
                        w-3.5
                        rounded
                        border-zinc-700
                        bg-zinc-900
                        accent-red-600
                      "
                    />

                    <span className="text-[10px] text-zinc-600">
                      Remember this session
                    </span>
                  </label>

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-zinc-600
                    "
                  >
                    <ShieldCheck
                      size={12}
                      className="text-emerald-600"
                    />

                    Encrypted
                  </div>
                </div>

                {/* =================================================
                    LOGIN BUTTON
                ================================================= */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    relative
                    flex
                    h-13
                    w-full
                    items-center
                    justify-center
                    gap-2
                    overflow-hidden
                    rounded-xl
                    border
                    border-red-600/70
                    bg-gradient-to-r
                    from-red-800
                    via-red-700
                    to-red-800
                    text-sm
                    font-black
                    text-white
                    shadow-[0_0_25px_rgba(220,38,38,0.15)]
                    transition-all
                    duration-300
                    hover:border-red-500
                    hover:shadow-[0_0_35px_rgba(220,38,38,0.3)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {/* Button shine */}

                  <span
                    className="
                      absolute
                      inset-y-0
                      -left-20
                      w-16
                      -skew-x-12
                      bg-white/20
                      blur-sm
                      animate-[buttonShine_3s_linear_infinite]
                    "
                  />

                  {loading ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white
                          border-t-transparent
                        "
                      />

                      <span>
                        Authenticating...
                      </span>
                    </>
                  ) : (
                    <>
                      <Crosshair
                        size={16}
                        className="
                          transition-transform
                          duration-300
                          group-hover:rotate-90
                        "
                      />

                      <span>
                        Enter as{" "}
                        {formData.role === "student"
                          ? "Student"
                          : "Instructor"}
                      </span>

                      <ArrowRight
                        size={17}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </>
                  )}
                </button>
              </form>

              {/* =================================================
                  DIVIDER
              ================================================= */}

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-900" />

                <span
                  className="
                    flex
                    items-center
                    gap-2
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-zinc-700
                  "
                >
                  <CircleDot size={8} />
                  Alternative
                </span>

                <div className="h-px flex-1 bg-zinc-900" />
              </div>

              {/* =================================================
                  GOOGLE
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  toast.info(
                    "Google login will be available soon."
                  )
                }
                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-950
                  text-sm
                  font-bold
                  text-zinc-400
                  transition-all
                  duration-300
                  hover:border-zinc-700
                  hover:bg-zinc-900
                  hover:text-white
                "
              >
                <span
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-zinc-700
                    bg-black
                    text-xs
                    font-black
                    text-zinc-400
                  "
                >
                  G
                </span>

                Continue with Google
              </button>

              {/* =================================================
                  REGISTER
              ================================================= */}

              <p
                className="
                  mt-6
                  text-center
                  text-[10px]
                  text-zinc-600
                "
              >
                Don't have an account?

                <Link
                  to="/register"
                  className="
                    ml-1.5
                    font-black
                    text-red-500
                    transition-colors
                    hover:text-red-400
                  "
                >
                  Create account
                </Link>
              </p>

              {/* =================================================
                  BOTTOM SECURITY
              ================================================= */}

              <div
                className="
                  mt-7
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-zinc-800
                "
              >
                <BadgeCheck
                  size={11}
                  className="text-emerald-700"
                />

                SmartLMS Secure Authentication

                <Zap
                  size={10}
                  className="text-red-800"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes scan {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          70% {
            opacity: 0.6;
          }

          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
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

        @keyframes centerPulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 0 35px rgba(220, 38, 38, 0.12);
          }

          50% {
            transform: scale(1.04);
            box-shadow:
              0 0 65px rgba(220, 38, 38, 0.25);
          }
        }

        @keyframes iconOrbit {
          0%,
          100% {
            transform:
              translateY(-50%)
              translateX(0);
          }

          50% {
            transform:
              translateY(-50%)
              translateX(8px);
          }
        }

        @keyframes iconFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes particle {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.2;
          }

          50% {
            transform: translateY(-18px);
            opacity: 0.8;
          }
        }

        @keyframes sparkFloat {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(0deg);
            opacity: 0.3;
          }

          50% {
            transform:
              translateY(-12px)
              rotate(15deg);
            opacity: 0.8;
          }
        }

        @keyframes ambientGlow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }

          50% {
            transform: scale(1.15);
            opacity: 0.8;
          }
        }

        @keyframes progressPulse {
          0%,
          100% {
            width: 65%;
          }

          50% {
            width: 78%;
          }
        }

        @keyframes buttonShine {
          0% {
            left: -80px;
          }

          45%,
          100% {
            left: 120%;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;