import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Crown,
  Menu,
  ScrollText,
  Shield,
  Sparkles,
  Sword,
  X,
} from "lucide-react";

/* =========================================================
   GAME OF THRONES-INSPIRED MEDIEVAL / WINTER PALETTE
========================================================= */

const C = {
  bg: "#07090C",
  surface: "#0C1015",
  surface2: "#11161D",
  surface3: "#151B23",

  ink: "#F4F1E8",
  white: "#FFFFFF",

  muted: "#9B9EA4",
  dim: "#626872",

  gold: "#C9A45C",
  goldLight: "#E6CD91",
  goldDark: "#765A2D",

  ice: "#B8D4E8",
  iceLight: "#E5F3FF",
  iceBlue: "#7FA8C7",

  crimson: "#7E2028",
  crimsonLight: "#B73740",

  border: "rgba(201,164,92,0.16)",
  frostBorder: "rgba(184,212,232,0.14)",
};

/* =========================================================
   NAVIGATION
========================================================= */

const navItems = [
  {
    label: "Home",
    to: "/",
    icon: Crown,
    route: true,
  },
  {
    label: "Courses",
    to: "/courses",
    icon: ScrollText,
    route: true,
  },
  {
    label: "Features",
    to: "/#features",
    icon: Shield,
    route: false,
  },
  {
    label: "About",
    to: "/#about",
    icon: Sparkles,
    route: false,
  },
];

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  /* =======================================================
     CLOSE MOBILE MENU ON ROUTE CHANGE
  ======================================================= */

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* =======================================================
     PREVENT BODY SCROLL WHEN MOBILE MENU IS OPEN
  ======================================================= */

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <nav
      className="
        sticky
        top-0
        z-[100]
        w-full
        border-b
      "
      style={{
        background:
          "linear-gradient(180deg, rgba(7,9,12,0.985) 0%, rgba(8,11,15,0.96) 100%)",

        borderColor: "rgba(201,164,92,0.13)",

        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",

        boxShadow:
          "0 12px 45px rgba(0,0,0,0.38), inset 0 -1px 0 rgba(255,255,255,0.015)",
      }}
    >
      {/* ===================================================
          ATMOSPHERIC BACKGROUND
      =================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gold glow */}

        <div
          className="
            absolute
            left-[30%]
            top-[-100px]
            h-[220px]
            w-[420px]
            rounded-full
            opacity-[0.045]
            blur-[70px]
          "
          style={{
            backgroundColor: C.gold,
          }}
        />

        {/* Ice glow */}

        <div
          className="
            absolute
            right-[12%]
            top-[-80px]
            h-[180px]
            w-[280px]
            rounded-full
            opacity-[0.035]
            blur-[70px]
          "
          style={{
            backgroundColor: C.iceBlue,
          }}
        />
      </div>

      {/* ===================================================
          TOP ROYAL GOLD LINE
      =================================================== */}

      <div className="relative h-[2px] w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #765A2D 16%, #C9A45C 38%, #E6CD91 50%, #C9A45C 62%, #765A2D 84%, transparent 100%)",
          }}
        />

        {/* Moving shine */}

        <div
          className="
            absolute
            inset-y-0
            -left-20
            w-20
            rotate-12
            bg-white/30
            blur-md
          "
          style={{
            animation: "navbar-shine 5s ease-in-out infinite",
          }}
        />
      </div>

      {/* ===================================================
          MAIN NAVBAR
      =================================================== */}

      <div
        className="
          relative
          mx-auto
          flex
          w-full
          max-w-[1440px]
          items-center
          justify-between
          px-5
          sm:px-8
          lg:px-10
          xl:px-14
        "
        style={{
          height: "76px",
        }}
      >
        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          onClick={closeMobileMenu}
          className="
            group
            flex
            shrink-0
            items-center
            gap-3
          "
        >
          {/* Logo crest */}

          <div
            className="
              relative
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-[3px]
              border
              transition-all
              duration-500
              group-hover:-translate-y-0.5
              group-hover:rotate-[1deg]
            "
            style={{
              background:
                "linear-gradient(145deg, #19150F 0%, #0D1014 55%, #090B0E 100%)",

              borderColor: "rgba(201,164,92,0.40)",

              boxShadow:
                "0 0 0 1px rgba(201,164,92,0.04), 0 0 25px rgba(201,164,92,0.06)",
            }}
          >
            {/* Outer ornament */}

            <div
              className="
                absolute
                inset-[3px]
                border
                transition-all
                duration-500
                group-hover:inset-[2px]
              "
              style={{
                borderColor: "rgba(201,164,92,0.12)",
              }}
            />

            {/* Four corner ornaments */}

            <span
              className="absolute left-[3px] top-[3px] h-1 w-1"
              style={{
                borderLeft: `1px solid ${C.gold}`,
                borderTop: `1px solid ${C.gold}`,
              }}
            />

            <span
              className="absolute right-[3px] top-[3px] h-1 w-1"
              style={{
                borderRight: `1px solid ${C.gold}`,
                borderTop: `1px solid ${C.gold}`,
              }}
            />

            <span
              className="absolute bottom-[3px] left-[3px] h-1 w-1"
              style={{
                borderBottom: `1px solid ${C.gold}`,
                borderLeft: `1px solid ${C.gold}`,
              }}
            />

            <span
              className="absolute bottom-[3px] right-[3px] h-1 w-1"
              style={{
                borderBottom: `1px solid ${C.gold}`,
                borderRight: `1px solid ${C.gold}`,
              }}
            />

            <BookOpen
              size={19}
              strokeWidth={1.45}
              className="
                relative
                transition-all
                duration-500
                group-hover:scale-110
              "
              style={{
                color: C.goldLight,
                filter: "drop-shadow(0 0 6px rgba(230,205,145,0.15))",
              }}
            />

            {/* Crimson royal mark */}

            <span
              className="
                absolute
                bottom-[4px]
                left-1/2
                h-[2px]
                w-4
                -translate-x-1/2
              "
              style={{
                backgroundColor: C.crimson,
                boxShadow: `0 0 8px ${C.crimson}`,
              }}
            />
          </div>

          {/* =================================================
              LOGO TEXT
          ================================================= */}

          <div className="leading-none">
            <div
              className="
                text-[19px]
                font-bold
                tracking-[-0.03em]
                transition-colors
                duration-300
                group-hover:text-[#E6CD91]
                sm:text-[20px]
              "
              style={{
                color: C.ink,
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              Smart
              <span
                style={{
                  color: C.gold,
                }}
              >
                LMS
              </span>
            </div>

            <div
              className="
                mt-[5px]
                hidden
                font-mono
                text-[7px]
                font-semibold
                uppercase
                tracking-[0.24em]
                sm:block
              "
              style={{
                color: C.dim,
              }}
            >
              The Learning Realm
            </div>
          </div>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <div className="hidden lg:flex lg:items-center">
          <div
            className="
              relative
              flex
              items-center
              rounded-[4px]
              border
              p-1
            "
            style={{
              gap: "2px",
              background:
                "linear-gradient(180deg, rgba(184,212,232,0.035), rgba(184,212,232,0.012))",

              borderColor: C.frostBorder,

              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.025), 0 12px 35px rgba(0,0,0,0.22)",
            }}
          >
            {/* Top ornament */}

            <span
              className="
                pointer-events-none
                absolute
                left-1/2
                top-0
                h-px
                w-24
                -translate-x-1/2
              "
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(201,164,92,0.42), transparent)",
              }}
            />

            {navItems.map((item) => {
              const Icon = item.icon;

              if (item.route) {
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={({ isActive }) =>
                      `
                        group
                        relative
                        flex
                        items-center
                        gap-2
                        rounded-[3px]
                        px-4
                        text-[12px]
                        font-semibold
                        uppercase
                        tracking-[0.065em]
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "bg-white/[0.055] shadow-[inset_0_0_20px_rgba(201,164,92,0.025)]"
                            : "hover:bg-white/[0.035]"
                        }
                      `
                    }
                    style={({ isActive }) => ({
                      height: "42px",

                      color: isActive
                        ? C.iceLight
                        : C.muted,

                      textShadow: isActive
                        ? "0 0 15px rgba(229,243,255,0.10)"
                        : "none",
                    })}
                  >
                    {/* Icon */}

                    <Icon
                      size={14}
                      strokeWidth={1.45}
                      className="
                        shrink-0
                        transition-all
                        duration-300
                        group-hover:-translate-y-0.5
                        group-hover:scale-110
                      "
                      style={{
                        color: C.gold,
                        filter:
                          "drop-shadow(0 0 5px rgba(201,164,92,0.15))",
                      }}
                    />

                    <span>{item.label}</span>

                    {/* Active / hover underline */}

                    <span
                      className="
                        absolute
                        bottom-0
                        left-1/2
                        h-px
                        w-0
                        -translate-x-1/2
                        transition-all
                        duration-300
                        group-hover:w-1/2
                      "
                      style={{
                        backgroundColor: C.gold,
                        boxShadow: `0 0 8px ${C.gold}`,
                      }}
                    />

                    {/* Small active diamond */}

                    <span
                      className="
                        absolute
                        -bottom-[3px]
                        left-1/2
                        h-[3px]
                        w-[3px]
                        rotate-45
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:opacity-100
                      "
                      style={{
                        backgroundColor: C.gold,
                      }}
                    />
                  </NavLink>
                );
              }

              return (
                <a
                  key={item.label}
                  href={item.to}
                  className="
                    group
                    relative
                    flex
                    items-center
                    gap-2
                    rounded-[3px]
                    px-4
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-[0.065em]
                    transition-all
                    duration-300
                    hover:bg-white/[0.035]
                  "
                  style={{
                    height: "42px",
                    color: C.muted,
                  }}
                >
                  <Icon
                    size={14}
                    strokeWidth={1.45}
                    className="
                      shrink-0
                      transition-all
                      duration-300
                      group-hover:-translate-y-0.5
                      group-hover:scale-110
                    "
                    style={{
                      color: C.iceBlue,
                    }}
                  />

                  <span className="transition-colors duration-300 group-hover:text-[#E5F3FF]">
                    {item.label}
                  </span>

                  <span
                    className="
                      absolute
                      bottom-0
                      left-1/2
                      h-px
                      w-0
                      -translate-x-1/2
                      transition-all
                      duration-300
                      group-hover:w-1/2
                    "
                    style={{
                      backgroundColor: C.iceBlue,
                      boxShadow: `0 0 8px ${C.iceBlue}`,
                    }}
                  />
                </a>
              );
            })}
          </div>
        </div>

        {/* =================================================
            DESKTOP ACTIONS
        ================================================= */}

        <div className="hidden items-center gap-3 sm:flex">
          {/* LOGIN */}

          <Link
            to="/login"
            className="
              group
              relative
              flex
              h-11
              min-w-[100px]
              items-center
              justify-center
              gap-2
              overflow-hidden
              rounded-[3px]
              border
              px-6
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.06em]
              transition-all
              duration-300
              hover:-translate-y-0.5
            "
            style={{
              color: C.iceLight,

              borderColor:
                "rgba(184,212,232,0.18)",

              backgroundColor:
                "rgba(184,212,232,0.025)",

              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.025)",
            }}
          >
            <Shield
              size={14}
              strokeWidth={1.4}
              style={{
                color: C.iceBlue,
              }}
            />

            <span>Log in</span>

            <span
              className="
                absolute
                bottom-0
                left-1/2
                h-px
                w-0
                -translate-x-1/2
                bg-[#B8D4E8]
                transition-all
                duration-300
                group-hover:w-1/2
              "
            />
          </Link>

          {/* BEGIN JOURNEY */}

          <Link
            to="/register"
            className="
              group
              relative
              flex
              h-11
              min-w-[164px]
              items-center
              justify-center
              gap-2
              overflow-hidden
              rounded-[3px]
              border
              px-7
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.07em]
              transition-all
              duration-300
              hover:-translate-y-0.5
              active:translate-y-0
            "
            style={{
              color: "#11100D",

              background:
                "linear-gradient(135deg, #E6CD91 0%, #C9A45C 52%, #9A753A 100%)",

              borderColor:
                "rgba(230,205,145,0.55)",

              boxShadow:
                "0 8px 28px rgba(201,164,92,0.13), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            <Crown
              size={14}
              strokeWidth={1.5}
            />

            <span>Begin Journey</span>

            <ArrowRight
              size={15}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />

            {/* Shine */}

            <span
              className="
                pointer-events-none
                absolute
                inset-y-0
                -left-16
                w-10
                rotate-12
                bg-white/30
                blur-md
                transition-all
                duration-700
                group-hover:left-[115%]
              "
            />
          </Link>
        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            setMobileOpen((prev) => !prev)
          }
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-[3px]
            border
            transition-all
            duration-300
            hover:-translate-y-0.5
            lg:hidden
          "
          style={{
            borderColor: C.frostBorder,

            background:
              "linear-gradient(145deg, rgba(184,212,232,0.04), rgba(184,212,232,0.015))",

            color: C.iceLight,

            boxShadow:
              "0 8px 25px rgba(0,0,0,0.28)",
          }}
          aria-label={
            mobileOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X
              size={20}
              strokeWidth={1.5}
            />
          ) : (
            <Menu
              size={20}
              strokeWidth={1.5}
            />
          )}
        </button>
      </div>

      {/* ===================================================
          MOBILE MENU
      =================================================== */}

      {mobileOpen && (
        <div
          className="
            border-t
            lg:hidden
          "
          style={{
            background:
              "linear-gradient(180deg, #090C11 0%, #06080B 100%)",

            borderColor:
              "rgba(201,164,92,0.10)",

            boxShadow:
              "0 25px 60px rgba(0,0,0,0.55)",
          }}
        >
          {/* Atmospheric glow */}

          <div className="pointer-events-none absolute left-0 right-0 h-32 overflow-hidden">
            <div
              className="
                absolute
                left-1/2
                top-[-80px]
                h-40
                w-80
                -translate-x-1/2
                rounded-full
                opacity-[0.045]
                blur-[60px]
              "
              style={{
                backgroundColor: C.gold,
              }}
            />
          </div>

          <div
            className="
              relative
              mx-auto
              w-full
              max-w-[1440px]
              px-5
              pb-7
              pt-5
              sm:px-8
            "
          >
            {/* =================================================
                MOBILE TITLE
            ================================================= */}

            <div className="mb-4 flex items-center gap-3 px-3">
              <Sword
                size={15}
                strokeWidth={1.2}
                style={{
                  color: C.gold,
                  transform: "rotate(-45deg)",
                  filter:
                    "drop-shadow(0 0 5px rgba(201,164,92,0.2))",
                }}
              />

              <span
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                "
                style={{
                  color: C.gold,
                }}
              >
                Navigate the Realm
              </span>

              <span
                className="
                  ml-auto
                  h-px
                  flex-1
                "
                style={{
                  background:
                    "linear-gradient(90deg, rgba(201,164,92,0.22), transparent)",
                }}
              />
            </div>

            {/* =================================================
                MOBILE NAVIGATION
            ================================================= */}

            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;

                if (item.route) {
                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `
                          group
                          relative
                          flex
                          h-12
                          items-center
                          gap-3
                          rounded-[3px]
                          border
                          px-4
                          text-sm
                          font-semibold
                          transition-all
                          duration-300
                          ${
                            isActive
                              ? "bg-white/[0.05]"
                              : "border-transparent hover:bg-white/[0.025]"
                          }
                        `
                      }
                      style={({ isActive }) => ({
                        color: isActive
                          ? C.iceLight
                          : C.muted,

                        borderColor: isActive
                          ? "rgba(201,164,92,0.13)"
                          : "transparent",

                        boxShadow: isActive
                          ? "inset 0 0 20px rgba(201,164,92,0.025)"
                          : "none",
                      })}
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.4}
                        style={{
                          color: C.gold,
                        }}
                      />

                      <span>{item.label}</span>

                      <ArrowRight
                        size={14}
                        className="
                          ml-auto
                          opacity-0
                          transition-all
                          duration-300
                          group-hover:translate-x-1
                          group-hover:opacity-100
                        "
                        style={{
                          color: C.gold,
                        }}
                      />

                      <span
                        className="
                          absolute
                          bottom-0
                          left-4
                          h-px
                          w-0
                          transition-all
                          duration-300
                          group-hover:w-10
                        "
                        style={{
                          backgroundColor: C.gold,
                          boxShadow: `0 0 7px ${C.gold}`,
                        }}
                      />
                    </NavLink>
                  );
                }

                return (
                  <a
                    key={item.label}
                    href={item.to}
                    onClick={closeMobileMenu}
                    className="
                      group
                      relative
                      flex
                      h-12
                      items-center
                      gap-3
                      rounded-[3px]
                      px-4
                      text-sm
                      font-semibold
                      transition-all
                      duration-300
                      hover:bg-white/[0.025]
                    "
                    style={{
                      color: C.muted,
                    }}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.4}
                      style={{
                        color: C.iceBlue,
                      }}
                    />

                    <span className="transition-colors duration-300 group-hover:text-[#E5F3FF]">
                      {item.label}
                    </span>

                    <ArrowRight
                      size={14}
                      className="
                        ml-auto
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:translate-x-1
                        group-hover:opacity-100
                      "
                      style={{
                        color: C.iceBlue,
                      }}
                    />
                  </a>
                );
              })}
            </div>

            {/* =================================================
                MOBILE ACTIONS
            ================================================= */}

            <div
              className="
                mt-5
                grid
                grid-cols-2
                gap-3
                border-t
                pt-5
              "
              style={{
                borderColor:
                  "rgba(255,255,255,0.07)",
              }}
            >
              {/* LOGIN */}

              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="
                  group
                  flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-[3px]
                  border
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.06em]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                "
                style={{
                  color: C.iceLight,

                  borderColor: C.frostBorder,

                  backgroundColor:
                    "rgba(184,212,232,0.025)",
                }}
              >
                <Shield
                  size={14}
                  strokeWidth={1.4}
                />

                Log in
              </Link>

              {/* BEGIN JOURNEY */}

              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="
                  group
                  relative
                  flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  overflow-hidden
                  rounded-[3px]
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.06em]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                "
                style={{
                  color: "#11100D",

                  background:
                    "linear-gradient(135deg, #E6CD91, #A98245)",

                  boxShadow:
                    "0 8px 22px rgba(201,164,92,0.13)",
                }}
              >
                <Crown
                  size={14}
                  strokeWidth={1.4}
                />

                Begin Journey

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    -left-10
                    w-8
                    rotate-12
                    bg-white/30
                    blur-md
                    transition-all
                    duration-700
                    group-hover:left-[120%]
                  "
                />
              </Link>
            </div>

            {/* =================================================
                MOBILE BOTTOM ORNAMENT
            ================================================= */}

            <div className="mt-6 flex items-center justify-center gap-3">
              <span
                className="h-px w-10"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(201,164,92,0.3))",
                }}
              />

              <Crown
                size={11}
                strokeWidth={1.2}
                style={{
                  color: C.goldDark,
                }}
              />

              <span
                className="
                  font-mono
                  text-[8px]
                  uppercase
                  tracking-[0.2em]
                "
                style={{
                  color: C.dim,
                }}
              >
                Learn • Practice • Conquer
              </span>

              <Crown
                size={11}
                strokeWidth={1.2}
                style={{
                  color: C.goldDark,
                  transform: "scaleX(-1)",
                }}
              />

              <span
                className="h-px w-10"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(201,164,92,0.3), transparent)",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          ANIMATIONS
      =================================================== */}

      <style>{`
        @keyframes navbar-shine {
          0% {
            left: -80px;
            opacity: 0;
          }

          15% {
            opacity: 0.7;
          }

          35% {
            left: 110%;
            opacity: 0;
          }

          100% {
            left: 110%;
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;