import { Mail, Lock, Eye } from "lucide-react";

function Login() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600">
            Smart LMS
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back! Continue your learning journey.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <div className="relative mt-2">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-gray-300 pl-11 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

            </div>
          </div>

          {/* Password */}
          <div>

            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative mt-2">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                placeholder="Enter password"
                className="w-full rounded-xl border border-gray-300 pl-11 pr-11 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

              <Eye
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              />

            </div>
          </div>

          {/* Forgot Password */}

          <div className="text-right">

            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          {/* Login Button */}

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Login
          </button>

        </form>

        {/* Divider */}

        <div className="flex items-center my-6">

          <div className="flex-1 border-t"></div>

          <span className="mx-3 text-sm text-gray-400">
            OR
          </span>

          <div className="flex-1 border-t"></div>

        </div>

        {/* Google */}

        <button className="w-full border rounded-xl py-3 font-medium hover:bg-gray-50 transition">
          Continue with Google
        </button>

        {/* Register */}

        <p className="text-center mt-6 text-gray-500">

          Don't have an account?

          <span className="text-blue-600 font-semibold cursor-pointer ml-1">
            Register
          </span>

        </p>

      </div>
    </div>
  );
}

export default Login;