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
      className="w-full pt-10 sm:pt-12 lg:pt-14"
      style={{
        backgroundColor: C.bg,
      }}
    >
      {/* =====================================================
          FOOTER CONTAINER
      ====================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1440px]
          px-6
          sm:px-10
          lg:px-14
          xl:px-20
        "
      >
        {/* =====================================================
            MAIN FOOTER
        ====================================================== */}

        <div
          className="
            grid
            w-full
            gap-12
            border-b
            border-white/[0.08]
            py-16
            sm:py-20
            lg:grid-cols-[2fr_1fr_1fr_1fr]
            lg:gap-16
            xl:gap-24
          "
        >
          {/* BRAND */}

          <div className="max-w-[430px]">
            <Link
              to="/"
              className="
                inline-flex
                items-center
                gap-3
                transition-opacity
                hover:opacity-90
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  text-sm
                  font-bold
                  text-white
                "
                style={{
                  backgroundColor: C.indigo,
                }}
              >
                S
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                Smart
                <span style={{ color: C.coral }}>LMS</span>
              </span>
            </Link>

            <p
              className="
                mt-6
                max-w-[400px]
                text-sm
                leading-7
              "
              style={{
                color: C.muted,
              }}
            >
              A simple learning platform designed to help you learn, track
              your progress and keep moving forward.
            </p>

            <div className="mt-7 flex items-center gap-2">
              <span
                className="h-1.5 w-9 rounded-full"
                style={{ backgroundColor: C.indigo }}
              />

              <span
                className="h-1.5 w-6 rounded-full"
                style={{ backgroundColor: C.teal }}
              />

              <span
                className="h-1.5 w-4 rounded-full"
                style={{ backgroundColor: C.amber }}
              />

              <span
                className="h-1.5 w-2.5 rounded-full"
                style={{ backgroundColor: C.coral }}
              />
            </div>
          </div>

          {/* PLATFORM */}

          <div>
            <h3 className="text-sm font-semibold text-white">
              Platform
            </h3>

            <div className="mt-5 flex flex-col gap-3.5">
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

          {/* LEARN */}

          <div>
            <h3 className="text-sm font-semibold text-white">
              Learn
            </h3>

            <div className="mt-5 flex flex-col gap-3.5">
              <Link
                to="/courses"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                Development
              </Link>

              <Link
                to="/courses"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                Programming
              </Link>

              <Link
                to="/courses"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                Data Structures
              </Link>

              <Link
                to="/courses"
                className="text-sm transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                Databases
              </Link>
            </div>
          </div>

          {/* SMART LMS */}

          <div>
            <h3 className="text-sm font-semibold text-white">
              Smart LMS
            </h3>

            <div className="mt-5 flex flex-col gap-3.5">
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

        {/* =====================================================
            BOTTOM BAR
        ====================================================== */}

        <div
          className="
            flex
            min-h-[72px]
            w-full
            flex-col
            justify-center
            gap-4
            py-6
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

          <div className="flex items-center gap-4">
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

      {/* =====================================================
          BOTTOM SPACE
      ====================================================== */}

      <div className="h-8 sm:h-10 lg:h-12" />
    </footer>
  );
}

export default Footer;