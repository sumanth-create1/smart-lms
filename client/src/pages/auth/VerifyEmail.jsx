import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  LoaderCircle,
  MailCheck,
} from "lucide-react";

import api from "../../services/api";

function VerifyEmail() {
  const { token } = useParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  // Prevent duplicate verification request in React StrictMode
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    // React StrictMode can execute the effect twice in development.
    // We only want to consume the verification token once.
    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    const verifyEmail = async () => {
      try {
        const response = await api.get(
          `/auth/verify-email/${token}`
        );

        setStatus("success");

        setMessage(
          response.data.message ||
            "Email verified successfully."
        );
      } catch (error) {
        console.error("Email verification error:", error);

        setStatus("error");

        setMessage(
          error.response?.data?.message ||
            "This verification link is invalid or expired."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#06080a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div
          className="
            rounded-2xl
            border border-[#29251d]
            bg-[#101214]
            p-8
            text-center
            shadow-2xl
          "
        >

          {/* ============================= */}
          {/* LOADING */}
          {/* ============================= */}

          {status === "loading" && (
            <>
              <div
                className="
                  mx-auto mb-6
                  flex h-16 w-16 items-center justify-center
                  rounded-full
                  bg-slate-800
                "
              >
                <LoaderCircle
                  size={32}
                  className="animate-spin text-slate-300"
                />
              </div>

              <h1 className="text-2xl font-bold text-slate-100">
                Verifying your email
              </h1>

              <p className="mt-3 text-sm text-slate-400">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {/* ============================= */}
          {/* SUCCESS */}
          {/* ============================= */}

          {status === "success" && (
            <>
              <div
                className="
                  mx-auto mb-6
                  flex h-16 w-16 items-center justify-center
                  rounded-full
                  bg-emerald-500/10
                  border border-emerald-500/20
                "
              >
                <CheckCircle2
                  size={34}
                  className="text-emerald-400"
                />
              </div>

              <h1 className="text-2xl font-bold text-slate-100">
                Email Verified
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {message}
              </p>

              <div className="mt-7">
                <Link
                  to="/login"
                  className="
                    inline-flex items-center gap-2
                    rounded-lg
                    bg-[#b08d57]
                    px-6 py-3
                    text-sm font-semibold
                    text-white
                    transition
                    hover:bg-[#c19a68]
                  "
                >
                  <MailCheck size={18} />
                  Continue to Login
                </Link>
              </div>
            </>
          )}

          {/* ============================= */}
          {/* ERROR */}
          {/* ============================= */}

          {status === "error" && (
            <>
              <div
                className="
                  mx-auto mb-6
                  flex h-16 w-16 items-center justify-center
                  rounded-full
                  bg-red-500/10
                  border border-red-500/20
                "
              >
                <XCircle
                  size={34}
                  className="text-red-400"
                />
              </div>

              <h1 className="text-2xl font-bold text-slate-100">
                Verification Failed
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {message}
              </p>

              <div className="mt-7">
                <Link
                  to="/login"
                  className="
                    inline-flex items-center gap-2
                    rounded-lg
                    border border-[#38342c]
                    px-5 py-3
                    text-sm font-medium
                    text-slate-300
                    transition
                    hover:bg-[#181a1c]
                  "
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}

        </div>

        {/* Branding */}
        <p className="mt-6 text-center text-xs text-slate-600">
          Smart LMS • Learn. Build. Master.
        </p>

      </div>
    </div>
  );
}

export default VerifyEmail;