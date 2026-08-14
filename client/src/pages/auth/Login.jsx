import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const C = {
  bg: "#F7F6F2",
  white: "#FFFFFF",
  ink: "#15121F",
  muted: "#6B6478",
  indigo: "#4F46E5",
  teal: "#0EA5A4",
  coral: "#FF5A36",
  amber: "#F2A93B",
};

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous error when user starts typing
    if (error) {
      setError("");
    }
  };

  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(
        formData.email,
        formData.password
      );

      console.log("Login successful:", result);

      // Redirect after successful login
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Login failed:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please check your email and password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: C.bg }}
    >
      {/* ==========================================
          BACKGROUND DECORATIONS
      ========================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-40
          h-96
          w-96
          rounded-full
          blur-3xl
        "
        style={{
          backgroundColor: `${C.indigo}12`,
        }}
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-40
          h-[420px]
          w-[420px]
          rounded-full
          blur-3xl
        "
        style={{
          backgroundColor: `${C.teal}12`,
        }}
      />

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="relative z-10">
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-7xl
            items-center
            justify-between
            px-6
            py-7
            sm:px-8
            lg:px-10
          "
        >
          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >
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
                shadow-sm
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
              <span style={{ color: C.coral }}>
                LMS
              </span>
            </span>
          </Link>

          {/* Back Home */}

          <Link
            to="/"
            className="
              rounded-lg
              px-3
              py-2
              text-sm
              font-medium
              transition
              hover:bg-black/[0.04]
            "
            style={{
              color: C.muted,
            }}
          >
            Back to home
          </Link>
        </div>
      </header>

      {/* ==========================================
          MAIN
      ========================================== */}

      <main
        className="
          relative
          z-10
          px-6
          pb-20
          pt-8
          sm:px-8
          lg:px-10
          lg:pb-28
        "
      >
        <div
          className="
            mx-auto
            grid
            w-full
            max-w-6xl
            items-center
            gap-14
            lg:grid-cols-[0.9fr_1.1fr]
            lg:gap-20
          "
        >

          {/* ======================================
              LEFT CONTENT
          ====================================== */}

          <section className="hidden lg:block">
            <div className="max-w-lg">

              {/* Label */}

              <div className="flex items-center gap-3">
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
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                  "
                  style={{
                    color: C.indigo,
                  }}
                >
                  Welcome back
                </span>
              </div>

              {/* Heading */}

              <h1
                className="
                  mt-7
                  text-5xl
                  font-bold
                  leading-[1.08]
                  tracking-[-0.05em]
                "
                style={{
                  color: C.ink,
                }}
              >
                Continue learning.

                <span
                  className="block"
                  style={{
                    color: C.indigo,
                  }}
                >
                  Keep building.
                </span>

                <span
                  className="block"
                  style={{
                    color: C.muted,
                  }}
                >
                  Keep growing.
                </span>
              </h1>

              {/* Description */}

              <p
                className="
                  mt-7
                  max-w-md
                  text-base
                  leading-8
                "
                style={{
                  color: C.muted,
                }}
              >
                Sign in to continue your learning journey,
                access your courses and pick up exactly where
                you left off.
              </p>

              {/* Benefits */}

              <div className="mt-12 space-y-7">

                {/* Benefit 1 */}

                <div className="flex gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      font-semibold
                    "
                    style={{
                      backgroundColor: `${C.indigo}12`,
                      color: C.indigo,
                    }}
                  >
                    ✓
                  </div>

                  <div>
                    <h3
                      className="text-sm font-bold"
                      style={{
                        color: C.ink,
                      }}
                    >
                      Structured learning
                    </h3>

                    <p
                      className="mt-1 text-sm leading-6"
                      style={{
                        color: C.muted,
                      }}
                    >
                      Continue through organized courses
                      and structured learning paths.
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}

                <div className="flex gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      font-semibold
                    "
                    style={{
                      backgroundColor: `${C.teal}12`,
                      color: C.teal,
                    }}
                  >
                    ↗
                  </div>

                  <div>
                    <h3
                      className="text-sm font-bold"
                      style={{
                        color: C.ink,
                      }}
                    >
                      Track your progress
                    </h3>

                    <p
                      className="mt-1 text-sm leading-6"
                      style={{
                        color: C.muted,
                      }}
                    >
                      Keep track of completed lessons and
                      your overall course progress.
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}

                <div className="flex gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      font-semibold
                    "
                    style={{
                      backgroundColor: `${C.coral}12`,
                      color: C.coral,
                    }}
                  >
                    →
                  </div>

                  <div>
                    <h3
                      className="text-sm font-bold"
                      style={{
                        color: C.ink,
                      }}
                    >
                      Learn at your pace
                    </h3>

                    <p
                      className="mt-1 text-sm leading-6"
                      style={{
                        color: C.muted,
                      }}
                    >
                      Learn whenever you want and continue
                      from where you stopped.
                    </p>
                  </div>
                </div>
              </div>

              {/* Roadmap */}

              <div className="mt-14 flex max-w-sm items-center">
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
            </div>
          </section>

          {/* ======================================
              LOGIN CARD
          ====================================== */}

          <section>
            <div
              className="
                mx-auto
                w-full
                max-w-[560px]
                rounded-[28px]
                border
                bg-white
                p-7
                shadow-[0_30px_80px_rgba(21,18,31,0.08)]
                sm:p-10
                lg:p-12
              "
              style={{
                borderColor: "rgba(21,18,31,0.07)",
              }}
            >

              {/* Card Header */}

              <div>
                <p
                  className="
                    font-mono
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                  "
                  style={{
                    color: C.indigo,
                  }}
                >
                  Welcome back
                </p>

                <h2
                  className="
                    mt-3
                    text-3xl
                    font-bold
                    tracking-[-0.04em]
                  "
                  style={{
                    color: C.ink,
                  }}
                >
                  Sign in to Smart LMS
                </h2>

                <p
                  className="mt-4 text-sm leading-6"
                  style={{
                    color: C.muted,
                  }}
                >
                  Enter your account details to continue
                  your learning journey.
                </p>
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
                    leading-5
                  "
                  style={{
                    color: "#B42318",
                    backgroundColor: "#FEF3F2",
                    borderColor: "#FECACA",
                  }}
                >
                  {error}
                </div>
              )}

              {/* ==================================
                  FORM
              ================================== */}

              <form
                onSubmit={handleSubmit}
                className="space-y-7"
              >

                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="
                      mb-2.5
                      block
                      text-sm
                      font-semibold
                    "
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
                    autoComplete="email"
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
                      placeholder:text-gray-400
                      hover:border-black/20
                      focus:border-[#4F46E5]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#4F46E5]/10
                    "
                  />
                </div>

                {/* Password */}

                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="
                        text-sm
                        font-semibold
                      "
                      style={{
                        color: C.ink,
                      }}
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="
                        text-xs
                        font-semibold
                        transition-opacity
                        hover:opacity-70
                      "
                      style={{
                        color: C.indigo,
                      }}
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
                      required
                      autoComplete="current-password"
                      className="
                        h-14
                        w-full
                        rounded-xl
                        border
                        border-black/[0.12]
                        bg-[#FCFCFB]
                        px-5
                        pr-16
                        text-sm
                        text-[#15121F]
                        outline-none
                        transition-all
                        placeholder:text-gray-400
                        hover:border-black/20
                        focus:border-[#4F46E5]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#4F46E5]/10
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        rounded-md
                        px-1
                        text-xs
                        font-semibold
                        transition-opacity
                        hover:opacity-70
                      "
                      style={{
                        color: C.indigo,
                      }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Login Button */}

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
                    shadow-[0_10px_25px_rgba(79,70,229,0.18)]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:shadow-[0_15px_30px_rgba(79,70,229,0.25)]
                    active:translate-y-0
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                  style={{
                    backgroundColor: C.indigo,
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/30
                          border-t-white
                        "
                      />

                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in

                      <span
                        className="
                          transition-transform
                          group-hover:translate-x-1
                        "
                      >
                        →
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-black/[0.07]" />

                <span
                  className="text-xs font-medium"
                  style={{
                    color: C.muted,
                  }}
                >
                  OR
                </span>

                <div className="h-px flex-1 bg-black/[0.07]" />
              </div>

              {/* Google */}

              <button
                type="button"
                className="
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  border
                  border-black/[0.1]
                  bg-white
                  text-sm
                  font-semibold
                  transition-all
                  hover:border-black/20
                  hover:bg-[#F9F8F5]
                "
                style={{
                  color: C.ink,
                }}
              >
                <span className="text-lg font-bold">
                  G
                </span>

                Continue with Google
              </button>

              {/* Register */}

              <div className="mt-9 text-center">
                <p
                  className="text-sm"
                  style={{
                    color: C.muted,
                  }}
                >
                  Don't have an account?

                  <Link
                    to="/register"
                    className="
                      ml-1.5
                      font-semibold
                      transition-opacity
                      hover:opacity-70
                    "
                    style={{
                      color: C.indigo,
                    }}
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>

            {/* Bottom */}

            <p
              className="
                mt-6
                text-center
                text-xs
              "
              style={{
                color: C.muted,
              }}
            >
              Your learning journey continues here.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;