import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <h1 className="text-4xl font-bold text-center text-blue-700">
          Smart LMS
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Welcome back 👋 <br />
          Sign in to continue learning
        </p>

        <form className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <div className="flex items-center border rounded-lg px-3">
              <Mail className="text-gray-400" size={20} />

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <div className="flex items-center border rounded-lg px-3">

              <Lock className="text-gray-400" size={20} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-full p-3 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-gray-400" size={20} />
                ) : (
                  <Eye className="text-gray-400" size={20} />
                )}
              </button>

            </div>
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-6 text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;