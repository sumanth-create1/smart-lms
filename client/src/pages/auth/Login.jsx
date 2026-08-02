import { useState } from "react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-5">

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-10">

        {/* Logo */}

        <div className="text-center">

          <div className="text-5xl font-extrabold text-blue-600">
            Smart LMS
          </div>

          <p className="text-gray-500 mt-3 text-lg">
            Welcome back! Continue your learning journey.
          </p>

        </div>

        {/* Form */}

        <form className="mt-10 space-y-6">

          {/* Email */}

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              Email
            </label>

            <div className="relative">

              <FiMail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type="email"
                placeholder="Enter your email"
                className="
                  w-full
                  h-14
                  pl-12
                  pr-4
                  rounded-xl
                  border
                  border-gray-300
                  focus:outline-none
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                  transition
                "
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              Password
            </label>

            <div className="relative">

              <FiLock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="
                  w-full
                  h-14
                  pl-12
                  pr-12
                  rounded-xl
                  border
                  border-gray-300
                  focus:outline-none
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                  transition
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Forgot */}

          <div className="flex justify-end">

            <button
              type="button"
              className="text-blue-600 font-medium hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          {/* Login */}

          <button
            className="
              w-full
              h-14
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              text-lg
              transition
            "
          >
            Login
          </button>

          {/* Divider */}

          <div className="flex items-center">

            <div className="flex-1 h-px bg-gray-300"></div>

            <span className="mx-4 text-gray-500">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-300"></div>

          </div>

          {/* Google */}

          <button
            type="button"
            className="
              w-full
              h-14
              border
              border-gray-300
              rounded-xl
              flex
              items-center
              justify-center
              gap-3
              hover:bg-gray-50
              transition
            "
          >

            <FcGoogle size={24} />

            <span className="font-medium">
              Continue with Google
            </span>

          </button>

          {/* Register */}

          <p className="text-center text-gray-600">

            Don't have an account?

            <span className="ml-2 text-blue-600 font-semibold cursor-pointer hover:underline">
              Register
            </span>

          </p>

        </form>

      </div>

    </div>
  );
}

export default Login;