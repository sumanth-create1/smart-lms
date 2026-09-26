import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bird,
  BookOpen,
  Crown,
  Eye,
  EyeOff,
  Fingerprint,
  Flame,
  GraduationCap,
  LockKeyhole,
  MailCheck,
  Moon,
  ShieldCheck,
  Sword,
  Users,
  X,
  Zap,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

/* =========================================================
   STATIC STYLES

   Defined outside the component so the CSS string is not
   recreated on every render.
========================================================= */

const LOGIN_STYLES = `
  .login-page {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(
        circle at 15% 20%,
        rgba(180, 45, 20, 0.13),
        transparent 28%
      ),
      radial-gradient(
        circle at 85% 75%,
        rgba(245, 158, 11, 0.08),
        transparent 25%
      ),
      linear-gradient(
        135deg,
        #050505 0%,
        #0b0807 45%,
        #080808 100%
      );
  }

  .login-page::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.22;

    background-image:
      linear-gradient(
        rgba(255,255,255,0.025) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        rgba(255,255,255,0.025) 1px,
        transparent 1px
      );

    background-size: 60px 60px;
  }

  .login-page::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;

    background:
      radial-gradient(
        circle at center,
        transparent 35%,
        rgba(0,0,0,0.42) 100%
      );
  }

  .login-card {
    position: relative;
    isolation: isolate;

    background: rgba(12, 10, 9, 0.94);

    border: 1px solid rgba(245, 158, 11, 0.16);

    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.45),
      0 0 35px rgba(120, 30, 10, 0.08);
  }

  .login-card::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;

    background:
      linear-gradient(
        135deg,
        rgba(245, 158, 11, 0.035),
        transparent 35%
      );
  }

  .login-input {
    transition:
      border-color 180ms ease,
      background-color 180ms ease,
      box-shadow 180ms ease;
  }

  .login-input:focus {
    border-color: rgba(245, 158, 11, 0.55);

    box-shadow:
      0 0 0 3px rgba(245, 158, 11, 0.06);
  }

  .login-button {
    transition:
      transform 180ms ease,
      background-color 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease;
  }

  .login-button:hover {
    transform: translateY(-1px);
  }

  .login-button:active {
    transform: translateY(0);
  }

  /*
   * Only the verification message uses an animation.
   * Decorative infinite animations were removed to reduce
   * unnecessary compositor/GPU work.
   */
  .login-verification {
    animation: loginVerification 180ms ease-out;
  }

  @keyframes loginVerification {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .login-verification {
      animation: none !important;
    }

    .login-input,
    .login-button {
      transition: none !important;
    }
  }
`;

/* =========================================================
   LOGIN
========================================================= */

export default function Login() {
  const navigate = useNavigate();

  const { user, authLoading, login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showResendVerification, setShowResendVerification] =
    useState(false);

  const [resendingVerification, setResendingVerification] =
    useState(false);

  /* =========================================================
     AUTH REDIRECT
  ========================================================= */

  useEffect(() => {
    if (authLoading || !user) return;

    const destination =
      user.role === "instructor"
        ? "/instructor/dashboard"
        : "/dashboard";

    navigate(destination, { replace: true });
  }, [user, authLoading, navigate]);

  /* =========================================================
     FORM HANDLERS
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "email") {
      setShowResendVerification(false);
    }
  };

  const handleRoleChange = (role) => {
    setFormData((previous) => ({
      ...previous,
      role,
    }));

    setShowResendVerification(false);
  };

  /* =========================================================
     RESEND VERIFICATION
  ========================================================= */

  const handleResendVerification = async () => {
    const email = formData.email.trim();

    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }

    try {
      setResendingVerification(true);

      const response = await api.post(
        "/auth/resend-verification",
        { email }
      );

      toast.success(
        response?.data?.message ||
          "Verification email sent successfully."
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to resend verification email."
      );
    } finally {
      setResendingVerification(false);
    }
  };

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      setShowResendVerification(false);

      /*
       * AuthContext expects:
       *
       * login(email, password, role)
       */
      const result = await login(
        email,
        password,
        formData.role
      );

      /*
       * Email verification required
       */
      if (result?.requiresVerification) {
        setShowResendVerification(true);

        toast.error(
          "Please verify your email before logging in."
        );

        return;
      }

      toast.success("Welcome back to the realm!");

      const destination =
        formData.role === "instructor"
          ? "/instructor/dashboard"
          : "/dashboard";

      navigate(destination, { replace: true });
    } catch (error) {
      const requiresVerification =
        error?.response?.data?.requiresVerification ||
        error?.requiresVerification;

      if (requiresVerification) {
        setShowResendVerification(true);

        toast.error(
          "Please verify your email before logging in."
        );

        return;
      }

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     GOOGLE LOGIN
  ========================================================= */

  const handleGoogleLogin = () => {
    toast("Google login will be available soon.", {
      icon: "ℹ️",
    });
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <style>{LOGIN_STYLES}</style>

      <main className="login-page flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">

        {/* =================================================
            STATIC AMBIENT ELEMENTS
        ================================================= */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[8%] top-[14%] h-40 w-40 rounded-full bg-red-900/10"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[10%] right-[8%] h-48 w-48 rounded-full bg-orange-500/5"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[7%] top-[9%] opacity-30"
        >
          <Moon
            size={44}
            strokeWidth={1}
            className="text-amber-500/30"
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[9%] top-[16%] opacity-20"
        >
          <Bird
            size={32}
            strokeWidth={1}
            className="text-zinc-400"
          />
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <section className="relative z-10 w-full max-w-md">

          {/* BRAND */}

          <div className="mb-7 text-center">

            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-black/60 shadow-lg shadow-orange-950/20">
                <Crown
                  size={30}
                  strokeWidth={1.4}
                  className="text-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">

              <Sword
                size={15}
                className="text-red-700"
              />

              <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-500/80">
                Smart LMS
              </span>

              <Sword
                size={15}
                className="rotate-180 text-red-700"
              />

            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Enter the Realm
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Continue your journey of knowledge.
            </p>

          </div>

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <div className="login-card rounded-3xl p-6 sm:p-8">

            {/* TOP DECORATION */}

            <div className="mb-6 flex items-center justify-center gap-4">

              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/20" />

              <Flame
                size={18}
                className="text-orange-500/70"
              />

              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/20" />

            </div>

            {/* ROLE SELECTOR */}

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-white/5 bg-black/30 p-1">

              <button
                type="button"
                onClick={() =>
                  handleRoleChange("student")
                }
                aria-pressed={
                  formData.role === "student"
                }
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  formData.role === "student"
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <GraduationCap size={16} />
                Student
              </button>

              <button
                type="button"
                onClick={() =>
                  handleRoleChange("instructor")
                }
                aria-pressed={
                  formData.role === "instructor"
                }
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  formData.role === "instructor"
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Users size={16} />
                Instructor
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
            >

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Email Address
                </label>

                <div className="relative">

                  <MailCheck
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"

                    /*
                     * IMPORTANT:
                     * For a password form Chrome should know
                     * this is the login username/identifier.
                     */
                    autoComplete="username"

                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={loading}

                    aria-label="Email address"

                    className="login-input h-12 w-full rounded-xl border border-white/10 bg-black/40 pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="block text-xs font-medium uppercase tracking-wider text-zinc-500"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs text-amber-500/80 transition-colors hover:text-amber-400"
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="relative">

                  <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    disabled={loading}
                    aria-label="Password"
                    className="login-input h-12 w-full rounded-xl border border-white/10 bg-black/40 pl-11 pr-12 text-sm text-white outline-none placeholder:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:text-zinc-300"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

              {/* VERIFICATION */}

              {showResendVerification && (
                <div className="login-verification rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">

                  <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
                      <MailCheck
                        size={17}
                        className="text-orange-400"
                      />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-sm font-medium text-orange-300">
                        Email verification required
                      </p>

                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        Please verify your email before continuing.
                      </p>

                      <button
                        type="button"
                        onClick={
                          handleResendVerification
                        }
                        disabled={
                          resendingVerification
                        }
                        className="mt-3 text-xs font-medium text-orange-400 transition-colors hover:text-orange-300 disabled:opacity-50"
                      >
                        {resendingVerification
                          ? "Sending..."
                          : "Resend verification email"}
                      </button>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowResendVerification(
                          false
                        )
                      }
                      className="shrink-0 text-zinc-600 transition-colors hover:text-zinc-300"
                      aria-label="Close verification message"
                    >
                      <X size={15} />
                    </button>

                  </div>

                </div>
              )}

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="login-button flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-amber-400/20 bg-gradient-to-r from-amber-500 to-orange-600 text-sm font-semibold text-black shadow-lg shadow-orange-950/20 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />

                    Entering the realm...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={17} />

                    Enter the Realm

                    <ArrowRight size={17} />
                  </>
                )}

              </button>

            </form>

            {/* DIVIDER */}

            <div className="my-6 flex items-center gap-3">

              <div className="h-px flex-1 bg-white/5" />

              <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-700">
                Or
              </span>

              <div className="h-px flex-1 bg-white/5" />

            </div>

            {/* GOOGLE */}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="login-button flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-medium text-zinc-300 hover:border-white/15 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
            >

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                G
              </span>

              Continue with Google

            </button>

            {/* REGISTER */}

            <p className="mt-7 text-center text-sm text-zinc-600">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-medium text-amber-500 transition-colors hover:text-amber-400"
              >
                Create one
              </Link>

            </p>

            {/* SECURITY */}

            <div className="mt-7 flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-zinc-700">

              <Fingerprint size={13} />

              Secure authentication

              <Zap size={11} />

            </div>

          </div>

          {/* FOOTER */}

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-700">

            <BookOpen size={12} />

            Knowledge is the greatest kingdom

          </div>

        </section>
      </main>
    </>
  );
}