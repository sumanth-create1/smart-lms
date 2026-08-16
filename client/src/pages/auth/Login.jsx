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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // =========================================
  // STATE
  // =========================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // =========================================
  // INPUT HANDLER
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // ROLE HANDLER
  // =========================================

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  // =========================================
  // LOGIN
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();
    const password = formData.password.trim();

    // -------------------------------
    // FRONTEND VALIDATION
    // -------------------------------

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    if (!formData.role) {
      toast.error("Please select your role.");
      return;
    }

    // Basic email validation

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // IMPORTANT:
      // AuthContext should accept:
      // login(email, password, role)

      await login(email, password, formData.role);

      toast.success(
        `Welcome back! Logged in as ${
          formData.role === "student" ? "Student" : "Instructor"
        }.`,
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Login failed:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed. Please check your email and password.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // GOOGLE LOGIN
  // =========================================

  const handleGoogleLogin = async () => {
    if (!formData.role) {
      toast.error("Please select your role first.");
      return;
    }

    setGoogleLoading(true);

    try {
      /*
       * Connect your Google OAuth here.
       *
       * Example:
       * await googleLogin(formData.role);
       */

      toast(
        `Google sign-in for ${
          formData.role === "student" ? "Student" : "Instructor"
        } will be connected soon.`,
        {
          icon: "ℹ️",
        },
      );
    } catch (err) {
      console.error("Google login failed:", err);

      toast.error(
        err?.response?.data?.message ||
          "Google sign-in failed. Please try again.",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="min-h-screen bg-[#F6F8FC] font-sans text-slate-900">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-sm transition hover:bg-indigo-700">
              <BookOpen size={20} strokeWidth={2.2} className="text-white" />
            </div>

            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
                Smart
                <span className="text-indigo-600">LMS</span>
              </h1>

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Learning Platform
              </p>
            </div>
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#F6F8FC] px-4 py-6 sm:px-6">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/30 blur-3xl" />

        {/* =====================================================
      MAIN CENTER WRAPPER
  ===================================================== */}

        <div className="relative z-10 flex min-h-[calc(100vh-120px)] flex-col items-center justify-center">
          {/* =================================================
        LOGIN CARD
    ================================================= */}

          <div
            className="w-full rounded-[26px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.09)]"
            style={{
              maxWidth: "580px",
            }}
          >
            {/* =================================================
          CARD CONTENT
      ================================================= */}

            <div
              style={{
                padding: "30px 44px 26px",
              }}
            >
              {/* =================================================
            HEADER
        ================================================= */}

              <div className="text-left">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                  <Sparkles
                    size={20}
                    strokeWidth={2}
                    className="text-indigo-600"
                  />
                </div>

                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-600">
                  Welcome back
                </p>

                <h2 className="text-[30px] font-extrabold leading-tight tracking-tight text-slate-900">
                  Sign in to SmartLMS
                </h2>

                <p className="mt-1.5 max-w-[440px] text-[13px] leading-5 text-slate-500">
                  Access your courses, track your progress, and continue
                  learning from where you left off.
                </p>
              </div>

              {/* =================================================
            FORM
        ================================================= */}

              <form onSubmit={handleSubmit} className="mt-5">
                <div className="mx-auto w-full max-w-[470px]">
                  {/* =================================================
                ROLE
            ================================================= */}

                  <div className="mb-4">
                    <label className="mb-1.5 block text-[13px] font-semibold text-slate-800">
                      Continue as
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      {/* STUDENT */}

                      <button
                        type="button"
                        onClick={() => handleRoleChange("student")}
                        className={`flex h-[52px] items-center gap-3 rounded-xl border px-3 text-left transition-all ${
                          formData.role === "student"
                            ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/10"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            formData.role === "student"
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <GraduationCap size={18} />
                        </div>

                        <div>
                          <p className="text-[13px] font-bold text-slate-800">
                            Student
                          </p>

                          <p className="text-[10px] text-slate-500">
                            Learn & track
                          </p>
                        </div>
                      </button>

                      {/* INSTRUCTOR */}

                      <button
                        type="button"
                        onClick={() => handleRoleChange("instructor")}
                        className={`flex h-[52px] items-center gap-3 rounded-xl border px-3 text-left transition-all ${
                          formData.role === "instructor"
                            ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/10"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            formData.role === "instructor"
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Users size={18} />
                        </div>

                        <div>
                          <p className="text-[13px] font-bold text-slate-800">
                            Instructor
                          </p>

                          <p className="text-[10px] text-slate-500">
                            Teach & manage
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* =================================================
                EMAIL
            ================================================= */}

                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-[13px] font-semibold text-slate-800"
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
                        className="
                    block
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-4
                    text-[13px]
                    text-slate-900
                    outline-none
                    placeholder:text-slate-400
                    focus:border-indigo-500
                    focus:ring-2
                    focus:ring-indigo-500/10
                  "
                      />
                    </div>
                  </div>

                  {/* =================================================
                PASSWORD
            ================================================= */}

                  <div className="mb-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-[13px] font-semibold text-slate-800"
                      >
                        Password
                      </label>

                      <Link
                        to="/forgot-password"
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div
                      style={{
                        padding: "5px",
                        borderRadius: "13px",
                        background: "#f8fafc",
                      }}
                    >
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className="
                      block
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-4
                      pr-12
                      text-[13px]
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      focus:border-indigo-500
                      focus:ring-2
                      focus:ring-indigo-500/10
                    "
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                        >
                          {showPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                REMEMBER
            ================================================= */}

                  <div className="mb-4 flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />

                      <span className="text-[11px] font-medium text-slate-500">
                        Remember me
                      </span>
                    </label>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <ShieldCheck size={13} />
                      Secure login
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
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-indigo-600
                text-[13px]
                font-bold
                text-white
                shadow-lg
                shadow-indigo-600/20
                transition-all
                hover:-translate-y-0.5
                hover:bg-indigo-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in as{" "}
                        {formData.role === "student" ? "Student" : "Instructor"}
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* =================================================
            DIVIDER
        ================================================= */}

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-[10px] font-bold text-slate-400">OR</span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* =================================================
            GOOGLE
        ================================================= */}

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="
            flex
            h-11
            w-full
            items-center
            justify-center
            gap-3
            rounded-xl
            border
            border-slate-200
            bg-white
            text-[13px]
            font-semibold
            text-slate-700
            shadow-sm
            transition
            hover:border-slate-300
            hover:bg-slate-50
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
              >
                {googleLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 font-bold">
                      G
                    </span>
                    Continue with Google
                  </>
                )}
              </button>

              {/* =================================================
            REGISTER
        ================================================= */}

              <p className="mt-4 text-center text-[12px] text-slate-500">
                Don't have an account?
                <Link
                  to="/register"
                  className="ml-1 font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>

          {/* =====================================================
        FOOTER
        IMPORTANT: OUTSIDE CARD BUT BELOW IT
    ===================================================== */}

          <p className="mt-3 text-center text-[11px] text-slate-400">
            © {new Date().getFullYear()} SmartLMS · Secure learning platform
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
