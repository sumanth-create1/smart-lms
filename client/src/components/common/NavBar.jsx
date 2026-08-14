import { Link } from "react-router-dom";

const font = {
  display: "'Sora', sans-serif",
  mono: "'Fira Code', monospace",
};

const C = {
  bg: "#FBFAF7",
  ink: "#15121F",
  muted: "#655D72",
  indigo: "#4F46E5",
  amber: "#F2A93B",
  teal: "#0EA5A4",
  coral: "#FF5A36",
};

const NAV_ITEMS = [
  {
    to: "/",
    label: "Home",
    color: C.indigo,
    isRoute: true,
  },
  {
    to: "/courses",
    label: "Courses",
    color: C.amber,
    isRoute: true,
  },
  {
    to: "#features",
    label: "Features",
    color: C.teal,
    isRoute: false,
  },
  {
    to: "#about",
    label: "About",
    color: C.coral,
    isRoute: false,
  },
];

function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: `${C.bg}F2`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* ================= TOP GRADIENT LINE ================= */}
      <div
        className="h-[3px] w-full"
        style={{
          background: `linear-gradient(
            90deg,
            ${C.indigo},
            ${C.teal},
            ${C.amber},
            ${C.coral}
          )`,
        }}
      />

      {/* ================= NAVBAR CONTENT ================= */}
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between border-b border-black/[0.07] px-5 sm:px-6 lg:px-8">

        {/* ================= LOGO ================= */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3"
        >
          {/* Logo icon */}
          <div className="relative flex h-10 w-10 items-center justify-center">

            {/* Dashed outer ring */}
            <span
              className="absolute inset-0 rounded-xl transition-transform duration-300 group-hover:rotate-6"
              style={{
                border: `1.5px dashed ${C.indigo}55`,
              }}
            />

            {/* S icon */}
            <div
              className="flex h-8 w-8 items-center justify-center rounded-[9px] text-sm font-bold text-white shadow-sm"
              style={{
                backgroundColor: C.indigo,
                fontFamily: font.display,
              }}
            >
              S
            </div>
          </div>

          {/* Logo text */}
          <span
            className="text-[20px] font-bold tracking-[-0.02em]"
            style={{
              fontFamily: font.display,
              color: C.ink,
            }}
          >
            Smart
            <span style={{ color: C.coral }}>LMS</span>
          </span>
        </Link>

        {/* ================= DESKTOP NAVIGATION ================= */}
        <div className="hidden lg:flex items-center">

          {/* Roadmap container */}
          <div className="relative">

            {/* Connecting line */}
            <div
              className="absolute left-5 right-5 top-1/2 h-px -translate-y-1/2"
              style={{
                backgroundColor: "rgba(21,18,31,0.10)",
              }}
            />

            {/* Navigation items */}
            <div className="relative flex items-center gap-2">

              {NAV_ITEMS.map((item) => {

                const commonClasses =
                  "group relative flex h-10 items-center gap-2 rounded-lg px-4 transition-all duration-200";

                const content = (
                  <>
                    {/* Waypoint */}
                    <span
                      className="h-[7px] w-[7px] shrink-0 rounded-full transition-transform duration-200 group-hover:scale-150"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />

                    {/* Label */}
                    <span
                      className="text-[13px] font-medium"
                      style={{
                        color: C.muted,
                        fontFamily: font.mono,
                      }}
                    >
                      {item.label}
                    </span>
                  </>
                );

                return item.isRoute ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={commonClasses}
                    style={{
                      backgroundColor: C.bg,
                    }}
                  >
                    {content}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.to}
                    className={commonClasses}
                    style={{
                      backgroundColor: C.bg,
                    }}
                  >
                    {content}
                  </a>
                );
              })}

            </div>
          </div>
        </div>

        {/* ================= AUTH BUTTONS ================= */}
        <div className="flex shrink-0 items-center gap-2.5">

          {/* Login */}
          <Link
            to="/login"
            className="
              hidden
              sm:flex
              h-11
              items-center
              justify-center
              rounded-xl
              border
              border-black/[0.09]
              bg-white/60
              px-5
              text-[13px]
              font-semibold
              transition-all
              duration-200
              hover:border-black/[0.16]
              hover:bg-white
              hover:-translate-y-[1px]
            "
            style={{
              color: C.ink,
            }}
          >
            Log in
          </Link>

          {/* Get Started */}
          <Link
            to="/register"
            className="
              flex
              h-11
              items-center
              justify-center
              rounded-xl
              px-5
              sm:px-6
              text-[13px]
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-[1px]
              hover:shadow-md
              active:translate-y-0
            "
            style={{
              backgroundColor: C.indigo,
            }}
          >
            Get Started
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;