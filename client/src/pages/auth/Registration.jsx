import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const C = {
  bg: "#F8F7F3",
  white: "#FFFFFF",
  ink: "#171522",
  muted: "#716A7F",
  lightMuted: "#9B94A8",
  indigo: "#4F46E5",
  indigoDark: "#4338CA",
  teal: "#0EA5A4",
  coral: "#FF5A36",
  amber: "#F2A93B",
  border: "rgba(23,21,34,0.10)",
};

const BENEFITS = [
  {
    number: "01",
    title: "Structured courses",
    description:
      "Follow clear learning paths instead of jumping between random resources.",
    color: C.indigo,
    icon: "✓",
  },
  {
    number: "02",
    title: "Track your progress",
    description:
      "Continue exactly where you stopped and keep your learning journey organized.",
    color: C.teal,
    icon: "↗",
  },
  {
    number: "03",
    title: "Learn at your pace",
    description: "Learn whenever you want and progress at a comfortable pace.",
    color: C.coral,
    icon: "→",
  },
];

function Register() {
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
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log("Registration successful:", response.data);

      alert("Account created successfully!");

      window.location.href = "/login";
    } catch (error) {
      console.error("Registration failed:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordLength = formData.password.length;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundColor: C.bg,
      }}
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{
          backgroundColor: `${C.indigo}10`,
        }}
      />

      <div
        className="pointer-events-none absolute -bottom-48 -right-40 h-[550px] w-[550px] rounded-full blur-3xl"
        style={{
          backgroundColor: `${C.teal}0D`,
        }}
      />

      <div
        className="pointer-events-none absolute right-[25%] top-[20%] h-40 w-40 rounded-full blur-3xl"
        style={{
          backgroundColor: `${C.coral}07`,
        }}
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative z-20">
        <div className="mx-auto flex h-[82px] max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-14">
          {/* Logo */}

          <Link to="/" className="group flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-sm
                font-bold
                text-white
                shadow-[0_8px_20px_rgba(79,70,229,0.20)]
                transition-transform
                duration-200
                group-hover:-translate-y-0.5
              "
              style={{
                backgroundColor: C.indigo,
              }}
            >
              S
            </div>

            <span
              className="text-xl font-bold tracking-tight"
              style={{
                color: C.ink,
              }}
            >
              Smart
              <span style={{ color: C.coral }}>LMS</span>
            </span>
          </Link>

          {/* Back Home */}

          <Link
            to="/"
            className="
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              transition-all
              duration-200
              hover:bg-black/[0.04]
            "
            style={{
              color: C.muted,
            }}
          >
            ← Back to home
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative z-10">
        <div
          className="
            mx-auto
            grid
            min-h-[calc(100vh-82px)]
            max-w-[1280px]
            grid-cols-1
            items-center
            gap-16
            px-6
            py-10
            sm:px-10
            lg:grid-cols-2
            lg:gap-20
            lg:px-12
            lg:py-14
          "
        >
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <section className="hidden lg:block">
            <div className="max-w-[540px]">
              {/* Eyebrow */}

              <div className="mb-7 flex items-center gap-3">
                <span
                  className="h-[2px] w-10 rounded-full"
                  style={{
                    backgroundColor: C.indigo,
                  }}
                />

                <span
                  className="
                    font-mono
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.22em]
                  "
                  style={{
                    color: C.indigo,
                  }}
                >
                  JOIN SMART LMS
                </span>
              </div>

              {/* Heading */}

              <h1
                className="
                  text-[56px]
                  font-bold
                  leading-[1.02]
                  tracking-[-0.055em]
                  xl:text-[64px]
                "
                style={{
                  color: C.ink,
                }}
              >
                Build skills.
                <span
                  className="block"
                  style={{
                    color: C.indigo,
                  }}
                >
                  Learn smarter.
                </span>
                <span
                  className="block"
                  style={{
                    color: C.muted,
                  }}
                >
                  Keep moving.
                </span>
              </h1>

              {/* Description */}

              <p
                className="
                  mt-8
                  max-w-[500px]
                  text-[16px]
                  leading-8
                "
                style={{
                  color: C.muted,
                }}
              >
                Create your account and get access to structured courses,
                practical lessons and a learning experience designed around your
                progress.
              </p>

              {/* Benefits */}

              <div className="mt-12 space-y-7">
                {BENEFITS.map((benefit) => (
                  <div key={benefit.number} className="group flex gap-5">
                    {/* Icon */}

                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        text-sm
                        font-bold
                        transition-transform
                        duration-200
                        group-hover:-translate-y-1
                      "
                      style={{
                        backgroundColor: `${benefit.color}12`,
                        color: benefit.color,
                      }}
                    >
                      {benefit.icon}
                    </div>

                    {/* Content */}

                    <div className="pt-0.5">
                      <div className="flex items-center gap-3">
                        <span
                          className="
                            font-mono
                            text-[9px]
                            font-bold
                            tracking-widest
                          "
                          style={{
                            color: benefit.color,
                          }}
                        >
                          {benefit.number}
                        </span>

                        <h3
                          className="text-[15px] font-bold"
                          style={{
                            color: C.ink,
                          }}
                        >
                          {benefit.title}
                        </h3>
                      </div>

                      <p
                        className="
                          mt-1.5
                          max-w-[430px]
                          text-sm
                          leading-6
                        "
                        style={{
                          color: C.muted,
                        }}
                      >
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Learning Path */}

              <div className="mt-14 flex max-w-[460px] items-center">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: C.indigo,
                  }}
                />

                <div className="h-px flex-1 bg-black/10" />

                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: C.teal,
                  }}
                />

                <div className="h-px flex-1 bg-black/10" />

                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: C.amber,
                  }}
                />

                <div className="h-px flex-1 bg-black/10" />

                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: C.coral,
                  }}
                />
              </div>

              <p
                className="mt-4 font-mono text-[9px] uppercase tracking-[0.18em]"
                style={{
                  color: C.lightMuted,
                }}
              >
                Start → Learn → Practice → Grow
              </p>
            </div>
          </section>

          {/* =================================================
              RIGHT SIDE — REGISTER CARD
          ================================================= */}

          <section className="w-full">
            <div
              className="
                mx-auto
                w-full
                max-w-[580px]
                rounded-[30px]
                border
                bg-white
                p-7
                shadow-[0_30px_90px_rgba(23,21,34,0.10)]
                sm:p-9
                md:p-11
                lg:mx-0
              "
              style={{
                borderColor: C.border,
              }}
            >
              {/* Card Header */}

              <div className="flex items-start justify-between gap-6">
                <div>
                  <p
                    className="
                      font-mono
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.20em]
                    "
                    style={{
                      color: C.indigo,
                    }}
                  >
                    STEP 01
                  </p>

                  <h2
                    className="
                      mt-3
                      text-[30px]
                      font-bold
                      leading-tight
                      tracking-[-0.04em]
                      sm:text-[34px]
                    "
                    style={{
                      color: C.ink,
                    }}
                  >
                    Create your account
                  </h2>

                  <p
                    className="mt-3 text-sm leading-6"
                    style={{
                      color: C.muted,
                    }}
                  >
                    Fill in your details to start your Smart LMS journey.
                  </p>
                </div>

                {/* Progress */}

                <div className="hidden shrink-0 pt-2 sm:block">
                  <div className="flex gap-1.5">
                    <span
                      className="h-1.5 w-9 rounded-full"
                      style={{
                        backgroundColor: C.indigo,
                      }}
                    />

                    <span className="h-1.5 w-9 rounded-full bg-black/10" />

                    <span className="h-1.5 w-9 rounded-full bg-black/10" />
                  </div>
                </div>
              </div>

              {/* Divider */}

              <div className="my-8 h-px bg-black/[0.07]" />

              {/* Error */}

              {error && (
                <div
                  className="
                    mb-6
                    rounded-xl
                    border
                    px-4
                    py-3
                    text-sm
                  "
                  style={{
                    borderColor: `${C.coral}30`,
                    backgroundColor: `${C.coral}08`,
                    color: C.coral,
                  }}
                >
                  {error}
                </div>
              )}

              {/* =================================================
                  FORM
              ================================================= */}

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2.5 block text-sm font-semibold"
                    style={{
                      color: C.ink,
                    }}
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="
                      h-[58px]
                      w-full
                      rounded-xl
                      border
                      border-black/[0.11]
                      bg-[#FCFCFB]
                      px-5
                      text-sm
                      outline-none
                      transition-all
                      duration-200
                      placeholder:text-[#AAA4B2]
                      hover:border-black/20
                      focus:border-[#4F46E5]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#4F46E5]/10
                    "
                    style={{
                      color: C.ink,
                    }}
                  />
                </div>

                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2.5 block text-sm font-semibold"
                    style={{
                      color: C.ink,
                    }}
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
                    required
                    className="
                      h-[58px]
                      w-full
                      rounded-xl
                      border
                      border-black/[0.11]
                      bg-[#FCFCFB]
                      px-5
                      text-sm
                      outline-none
                      transition-all
                      duration-200
                      placeholder:text-[#AAA4B2]
                      hover:border-black/20
                      focus:border-[#4F46E5]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#4F46E5]/10
                    "
                    style={{
                      color: C.ink,
                    }}
                  />
                  {/* Role */}

                  <div>
                    <label
                      htmlFor="role"
                      className="mb-2.5 block text-sm font-semibold"
                      style={{
                        color: C.ink,
                      }}
                    >
                      I want to register as
                    </label>

                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="
      h-14
      w-full
      rounded-xl
      border
      border-black/[0.12]
      bg-[#FCFCFB]
      px-5
      text-sm
      text-[#15121F]
      outline-none
      transition-all
      hover:border-black/20
      focus:border-[#4F46E5]
      focus:bg-white
      focus:ring-4
      focus:ring-[#4F46E5]/10
    "
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                    </select>
                  </div>
                </div>

                {/* Password */}

                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold"
                      style={{
                        color: C.ink,
                      }}
                    >
                      Password
                    </label>

                    <span
                      className="text-[11px]"
                      style={{
                        color: C.lightMuted,
                      }}
                    >
                      Minimum 6 characters
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      minLength={6}
                      required
                      className="
                        h-[58px]
                        w-full
                        rounded-xl
                        border
                        border-black/[0.11]
                        bg-[#FCFCFB]
                        px-5
                        pr-20
                        text-sm
                        outline-none
                        transition-all
                        duration-200
                        placeholder:text-[#AAA4B2]
                        hover:border-black/20
                        focus:border-[#4F46E5]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#4F46E5]/10
                      "
                      style={{
                        color: C.ink,
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        rounded-lg
                        px-2
                        py-1
                        text-xs
                        font-semibold
                        transition-colors
                        hover:bg-indigo-50
                      "
                      style={{
                        color: C.indigo,
                      }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {/* Password strength */}

                  {passwordLength > 0 && (
                    <div className="mt-3">
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className="h-1 flex-1 rounded-full"
                            style={{
                              backgroundColor:
                                passwordLength >= level * 3
                                  ? passwordLength >= 9
                                    ? C.teal
                                    : C.indigo
                                  : "rgba(23,21,34,0.08)",
                            }}
                          />
                        ))}
                      </div>

                      <p
                        className="mt-1.5 text-[10px]"
                        style={{
                          color: C.lightMuted,
                        }}
                      >
                        {passwordLength < 6
                          ? "Weak password"
                          : passwordLength < 9
                            ? "Good password"
                            : "Strong password"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2.5 block text-sm font-semibold"
                    style={{
                      color: C.ink,
                    }}
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                      className="
                        h-[58px]
                        w-full
                        rounded-xl
                        border
                        border-black/[0.11]
                        bg-[#FCFCFB]
                        px-5
                        pr-20
                        text-sm
                        outline-none
                        transition-all
                        duration-200
                        placeholder:text-[#AAA4B2]
                        hover:border-black/20
                        focus:border-[#4F46E5]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#4F46E5]/10
                      "
                      style={{
                        color: C.ink,
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        rounded-lg
                        px-2
                        py-1
                        text-xs
                        font-semibold
                        transition-colors
                        hover:bg-indigo-50
                      "
                      style={{
                        color: C.indigo,
                      }}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {/* Matching status */}

                  {formData.confirmPassword && (
                    <p
                      className="mt-2 text-[11px]"
                      style={{
                        color:
                          formData.password === formData.confirmPassword
                            ? C.teal
                            : C.coral,
                      }}
                    >
                      {formData.password === formData.confirmPassword
                        ? "✓ Passwords match"
                        : "Passwords do not match"}
                    </p>
                  )}
                </div>

                {/* Terms */}

                <label
                  className="
                    flex
                    cursor-pointer
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-black/[0.07]
                    bg-[#FAF9F6]
                    p-4
                    transition-colors
                    hover:bg-[#F7F6F2]
                  "
                >
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="
                      mt-0.5
                      h-4
                      w-4
                      shrink-0
                      accent-indigo-600
                    "
                  />

                  <span
                    className="text-[11px] leading-5"
                    style={{
                      color: C.muted,
                    }}
                  >
                    I agree to the Smart LMS terms and conditions and
                    acknowledge the privacy policy.
                  </span>
                </label>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
    group
    flex
    h-14
    w-full
    items-center
    justify-center
    gap-2
    rounded-xl
    text-sm
    font-semibold
    text-white
    transition-all
    duration-200
    hover:-translate-y-0.5
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
                  style={{
                    backgroundColor: C.indigo,
                  }}
                >
                  {loading ? "Creating account..." : "Create account"}

                  {!loading && (
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>
              </form>

              {/* Login */}

              <div className="mt-8 text-center">
                <p
                  className="text-sm"
                  style={{
                    color: C.muted,
                  }}
                >
                  Already have an account?
                  <Link
                    to="/login"
                    className="
                      ml-1.5
                      font-semibold
                      hover:underline
                    "
                    style={{
                      color: C.indigo,
                    }}
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>

            {/* Bottom text */}

            <p
              className="
                mt-5
                text-center
                font-mono
                text-[9px]
                uppercase
                tracking-[0.16em]
              "
              style={{
                color: C.lightMuted,
              }}
            >
              Your learning journey starts here.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Register;
