import { Link } from "react-router-dom";

const C = {
  bg: "#15121F",
  muted: "#A39CAF",
  indigo: "#4F46E5",
  amber: "#F2A93B",
  teal: "#0EA5A4",
  coral: "#FF5A36",
};

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: C.bg,
      }}
    >

      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-8 lg:px-10">

        {/* =================================================
            MAIN FOOTER
        ================================================= */}

        <div className="grid gap-12 border-b border-white/[0.08] py-16 sm:py-20 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">

          {/* Brand */}

          <div className="max-w-sm">

            <Link
              to="/"
              className="flex items-center gap-3"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                S
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                Smart<span style={{ color: C.coral }}>LMS</span>
              </span>

            </Link>


            <p
              className="
                mt-6
                max-w-sm
                text-sm
                leading-7
              "
              style={{
                color: C.muted,
              }}
            >
              A simple learning platform designed to help you learn,
              track your progress and keep moving forward.
            </p>


            {/* Decorative line */}

            <div className="mt-7 flex items-center gap-2">

              <span
                className="h-1.5 w-8 rounded-full"
                style={{
                  backgroundColor: C.indigo,
                }}
              />

              <span
                className="h-1.5 w-5 rounded-full"
                style={{
                  backgroundColor: C.teal,
                }}
              />

              <span
                className="h-1.5 w-3 rounded-full"
                style={{
                  backgroundColor: C.amber,
                }}
              />

              <span
                className="h-1.5 w-2 rounded-full"
                style={{
                  backgroundColor: C.coral,
                }}
              />

            </div>

          </div>


          {/* Platform */}

          <div>

            <h3 className="text-sm font-semibold text-white">
              Platform
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                to="/"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                Home
              </Link>

              <Link
                to="/courses"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                Courses
              </Link>

              <Link
                to="/login"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                Create account
              </Link>

            </div>

          </div>


          {/* Learn */}

          <div>

            <h3 className="text-sm font-semibold text-white">
              Learn
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <a
                href="/courses"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                Development
              </a>

              <a
                href="/courses"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                Programming
              </a>

              <a
                href="/courses"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                Data Structures
              </a>

              <a
                href="/courses"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                Databases
              </a>

            </div>

          </div>


          {/* Company */}

          <div>

            <h3 className="text-sm font-semibold text-white">
              Smart LMS
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <a
                href="/#features"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                Features
              </a>

              <a
                href="/#courses"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                Available Courses
              </a>

              <a
                href="/#how-it-works"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                How It Works
              </a>

              <a
                href="/#about"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                About
              </a>

            </div>

          </div>

        </div>


        {/* =================================================
            BOTTOM BAR
        ================================================= */}

        <div
          className="
            flex
            flex-col
            gap-4
            py-7
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <p
            className="text-xs"
            style={{
              color: C.muted,
            }}
          >
            © {new Date().getFullYear()} Smart LMS. All rights reserved.
          </p>


          <div className="flex items-center gap-5">

            <span
              className="text-xs"
              style={{
                color: C.muted,
              }}
            >
              Built for learning.
            </span>

            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: C.teal,
              }}
            />

            <span
              className="text-xs font-medium"
              style={{
                color: "#FFFFFF",
              }}
            >
              Keep going →
            </span>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;

