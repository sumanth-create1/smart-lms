import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);

    // Backend API will be connected here later
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      {/* Login Container */}
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-blue-600">
            Smart LMS
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Learn. Grow. Achieve.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-8">

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-slate-900">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sign in to continue your learning journey.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  w-full
                  h-12
                  px-4
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  text-slate-900
                  placeholder-slate-400
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="
                    w-full
                    h-12
                    px-4
                    pr-12
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    text-slate-900
                    placeholder-slate-400
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

                {/* Show / Hide Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    hover:text-slate-600
                  "
                >
                  {showPassword ? "🙈" : "👁"}
                </button>

              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="
                w-full
                h-12
                rounded-lg
                bg-blue-600
                text-white
                font-semibold
                transition
                hover:bg-blue-700
                active:bg-blue-800
                shadow-sm
              "
            >
              Sign in
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-slate-200"></div>

            <span className="text-sm text-slate-400">
              OR
            </span>

            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="
              w-full
              h-12
              rounded-lg
              border
              border-slate-300
              bg-white
              text-slate-700
              font-medium
              flex
              items-center
              justify-center
              gap-3
              hover:bg-slate-50
              transition
            "
          >
            <span className="text-lg font-bold">
              G
            </span>

            Continue with Google
          </button>

          {/* Register */}
          <p className="text-center text-sm text-slate-500 mt-7">
            Don't have an account?{" "}
            <button
              type="button"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create account
            </button>
          </p>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 Smart LMS. All rights reserved.
        </p>

      </div>
    </div>
  );
}

export default Login;