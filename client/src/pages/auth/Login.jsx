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
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <BookOpen size={20} className="text-white" />
            </div>

            <div>
              <h1 className="text-lg font-extrabold tracking-tight">
                Smart<span className="text-indigo-600">LMS</span>
              </h1>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Learning Platform
              </p>
            </div>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">

        <div className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center">

          {/* Login Card */}
          <div className="w-full rounded-3xl border border-slate-200 bg-white shadow-xl">

            <div className="p-6 sm:p-10">

              {/* Title */}
              <div className="mb-7">

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                  <Sparkles
                    size={20}
                    className="text-indigo-600"
                  />
                </div>

                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Welcome back
                </p>

                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Sign in to SmartLMS
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Access your courses, track your progress,
                  and continue learning.
                </p>

              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>

                {/* Role */}
                <div className="mb-5">

                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Continue as
                  </label>

                  <div className="grid grid-cols-2 gap-3">

                    {/* Student */}
                    <button
                      type="button"
                      onClick={() =>
                        handleRoleChange("student")
                      }
                      className={
                        formData.role === "student"
                          ? "flex min-h-14 items-center gap-3 rounded-xl border border-indigo-500 bg-indigo-50 px-4 text-left"
                          : "flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-left hover:bg-slate-50"
                      }
                    >
                      <div
                        className={
                          formData.role === "student"
                            ? "flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white"
                            : "flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
                        }
                      >
                        <GraduationCap size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Student
                        </p>

                        <p className="text-xs text-slate-500">
                          Learn & track
                        </p>
                      </div>
                    </button>

                    {/* Instructor */}
                    <button
                      type="button"
                      onClick={() =>
                        handleRoleChange("instructor")
                      }
                      className={
                        formData.role === "instructor"
                          ? "flex min-h-14 items-center gap-3 rounded-xl border border-indigo-500 bg-indigo-50 px-4 text-left"
                          : "flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-left hover:bg-slate-50"
                      }
                    >
                      <div
                        className={
                          formData.role === "instructor"
                            ? "flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white"
                            : "flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
                        }
                      >
                        <Users size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Instructor
                        </p>

                        <p className="text-xs text-slate-500">
                          Teach & manage
                        </p>
                      </div>
                    </button>

                  </div>
                </div>

                {/* Email */}
                <div className="mb-5">

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                </div>

                {/* Password */}
                <div className="mb-5">

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-800"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-indigo-600"
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <div className="relative">

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
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Security */}
                <div className="mb-5 flex items-center justify-between">

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                    />

                    <span className="text-xs text-slate-500">
                      Remember me
                    </span>
                  </label>

                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <ShieldCheck size={14} />
                    Secure login
                  </div>

                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in as{" "}
                      {formData.role === "student"
                        ? "Student"
                        : "Instructor"}

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

              </form>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">

                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-bold text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200" />

              </div>

              {/* Google */}
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    "Google login will be available soon."
                  )
                }
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 font-bold">
                  G
                </span>

                Continue with Google
              </button>

              {/* Register */}
              <p className="mt-5 text-center text-xs text-slate-500">
                Don't have an account?

                <Link
                  to="/register"
                  className="ml-1 font-bold text-indigo-600"
                >
                  Create account
                </Link>
              </p>

            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

export default Login;