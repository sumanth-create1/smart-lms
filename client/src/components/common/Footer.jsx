import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Crown,
  Flame,
  Map,
  Shield,
  Sparkles,
  Sword,
  Trophy,
} from "lucide-react";

const C = {
  bg: "#06080B",
  surface: "#0C0F14",
  surface2: "#11151B",

  ink: "#F4F1E8",
  muted: "#9B9EA4",
  dim: "#62666D",

  gold: "#C9A45C",
  goldLight: "#E6CD91",
  goldDark: "#765A2D",

  ice: "#B8D4E8",
  iceLight: "#E5F3FF",
  iceBlue: "#7FA8C7",

  crimson: "#7E2028",
  crimsonLight: "#B73740",

  border: "rgba(201,164,92,0.16)",
  frostBorder: "rgba(184,212,232,0.12)",
};

function Footer() {
  const platformLinks = [
    { label: "Home", to: "/" },
    { label: "Courses", to: "/courses" },
    { label: "Log in", to: "/login" },
    { label: "Create account", to: "/register" },
  ];

  const learningLinks = [
    { label: "Development", to: "/courses" },
    { label: "Programming", to: "/courses" },
    { label: "Data Structures", to: "/courses" },
    { label: "Databases", to: "/courses" },
  ];

  const smartLinks = [
    { label: "Features", href: "/#features" },
    { label: "Available Courses", href: "/#courses" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "About", href: "/#about" },
  ];

  return (
    <footer
      className="relative w-full overflow-hidden pt-12 sm:pt-14 lg:pt-16"
      style={{
        backgroundColor: C.bg,
      }}
    >
      {/* =====================================================
          ATMOSPHERIC BACKGROUND
      ====================================================== */}

      <div
        className="pointer-events-none absolute -left-64 top-0 h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(127,168,199,0.10), transparent 68%)",
          filter: "blur(25px)",
        }}
      />

      <div
        className="pointer-events-none absolute -right-64 top-20 h-[550px] w-[550px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(126,32,40,0.11), transparent 70%)",
          filter: "blur(25px)",
        }}
      />

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[700px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,164,92,0.05), transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* =====================================================
          SUBTLE WINTER PARTICLES
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 16 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-1 w-1 rounded-full opacity-25"
            style={{
              left: `${(index * 19 + 4) % 100}%`,
              top: `${(index * 31 + 6) % 100}%`,
              backgroundColor:
                index % 5 === 0 ? C.goldLight : C.iceLight,
              boxShadow: `0 0 7px ${
                index % 5 === 0 ? C.gold : C.iceBlue
              }`,
              animation: `footer-particle ${
                8 + (index % 4)
              }s ease-in-out infinite`,
              animationDelay: `${index * -0.8}s`,
            }}
          />
        ))}
      </div>

      {/* =====================================================
          TOP MEDIEVAL DIVIDER
      ====================================================== */}

      <div className="relative mx-auto mb-10 flex max-w-[1440px] items-center justify-center px-6 sm:px-10 lg:px-14 xl:px-20">
        <span
          className="h-px flex-1"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,164,92,0.18))",
          }}
        />

        <div
          className="
            mx-5
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
          "
          style={{
            borderColor: "rgba(201,164,92,0.25)",
            backgroundColor: C.surface,
          }}
        >
          <Crown
            size={17}
            strokeWidth={1.3}
            style={{
              color: C.gold,
            }}
          />
        </div>

        <span
          className="h-px flex-1"
          style={{
            background:
              "linear-gradient(90deg, rgba(201,164,92,0.18), transparent)",
          }}
        />
      </div>

      {/* =====================================================
          FOOTER CONTAINER
      ====================================================== */}

      <div
        className="
          relative
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
            py-14
            sm:py-16
            lg:grid-cols-[2fr_1fr_1fr_1fr]
            lg:gap-16
            xl:gap-24
          "
          style={{
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          {/* =================================================
              BRAND
          ================================================= */}

          <div className="max-w-[450px]">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >
              {/* Logo */}

              <div
                className="
                  relative
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-[3px]
                  border
                  transition-all
                  duration-300
                  group-hover:-translate-y-0.5
                "
                style={{
                  borderColor: "rgba(201,164,92,0.38)",
                  background:
                    "linear-gradient(145deg, #17140F, #0D0F13)",
                  boxShadow:
                    "0 0 25px rgba(201,164,92,0.07)",
                }}
              >
                <span
                  className="absolute inset-1 border"
                  style={{
                    borderColor: "rgba(201,164,92,0.10)",
                  }}
                />

                <Crown
                  size={19}
                  strokeWidth={1.3}
                  style={{
                    color: C.goldLight,
                  }}
                />

                {/* small glow */}

                <span
                  className="absolute bottom-1.5 h-0.5 w-5 rounded-full"
                  style={{
                    backgroundColor: C.crimson,
                    boxShadow: `0 0 8px ${C.crimson}`,
                  }}
                />
              </div>

              {/* Brand name */}

              <span
                className="
                  text-xl
                  font-bold
                  tracking-[0.02em]
                "
                style={{
                  color: C.ink,
                  fontFamily: "Georgia, serif",
                }}
              >
                Smart
                <span style={{ color: C.gold }}> LMS</span>
              </span>
            </Link>

            {/* Brand label */}

            <div className="mt-5 flex items-center gap-3">
              <Sword
                size={14}
                strokeWidth={1.2}
                style={{
                  color: C.gold,
                  transform: "rotate(-45deg)",
                }}
              />

              <span
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.28em]
                "
                style={{
                  color: C.gold,
                }}
              >
                The path to mastery
              </span>
            </div>

            {/* Description */}

            <p
              className="
                mt-5
                max-w-[410px]
                text-sm
                leading-7
              "
              style={{
                color: C.muted,
              }}
            >
              A learning realm built to help you sharpen your skills,
              track your progress and keep moving forward — one lesson
              at a time.
            </p>

            {/* Decorative bars */}

            <div className="mt-7 flex items-center gap-2">
              <span
                className="h-[2px] w-10"
                style={{
                  backgroundColor: C.gold,
                }}
              />

              <span
                className="h-[2px] w-7"
                style={{
                  backgroundColor: C.iceBlue,
                }}
              />

              <span
                className="h-[2px] w-5"
                style={{
                  backgroundColor: C.crimson,
                }}
              />

              <span
                className="h-[2px] w-3"
                style={{
                  backgroundColor: C.goldDark,
                }}
              />
            </div>

            {/* Quote */}

            <div
              className="
                mt-8
                max-w-[390px]
                border-l
                pl-4
              "
              style={{
                borderColor: "rgba(201,164,92,0.35)",
              }}
            >
              <p
                className="text-sm italic leading-6"
                style={{
                  color: "rgba(229,243,255,0.42)",
                  fontFamily: "Georgia, serif",
                }}
              >
                "Knowledge is the blade. Practice is the forge."
              </p>
            </div>
          </div>

          {/* =================================================
              PLATFORM
          ================================================= */}

          <FooterColumn
            title="Platform"
            icon={Shield}
            links={platformLinks}
          />

          {/* =================================================
              LEARN
          ================================================= */}

          <FooterColumn
            title="Learn"
            icon={BookOpen}
            links={learningLinks}
          />

          {/* =================================================
              SMART LMS
          ================================================= */}

          <div>
            <FooterHeading icon={Sparkles} title="Smart LMS" />

            <div className="mt-6 flex flex-col gap-4">
              {smartLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    text-sm
                    transition-all
                    duration-300
                    hover:translate-x-1
                  "
                  style={{
                    color: C.muted,
                  }}
                >
                  <span
                    className="
                      h-px
                      w-0
                      transition-all
                      duration-300
                      group-hover:w-4
                    "
                    style={{
                      backgroundColor: C.gold,
                    }}
                  />

                  <span className="group-hover:text-[#E5F3FF]">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>

            {/* Status card */}

            <div
              className="
                mt-8
                rounded-[3px]
                border
                p-4
              "
              style={{
                backgroundColor: "rgba(184,212,232,0.025)",
                borderColor: C.frostBorder,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className="absolute inset-0 animate-ping rounded-full opacity-30"
                    style={{
                      backgroundColor: C.iceBlue,
                    }}
                  />

                  <span
                    className="relative m-auto h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: C.ice,
                    }}
                  />
                </span>

                <span
                  className="
                    font-mono
                    text-[9px]
                    uppercase
                    tracking-[0.18em]
                  "
                  style={{
                    color: "rgba(229,243,255,0.45)",
                  }}
                >
                  The realm awaits
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM BAR
        ====================================================== */}

        <div
          className="
            flex
            min-h-[82px]
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
          {/* Copyright */}

          <p
            className="text-xs"
            style={{
              color: C.dim,
            }}
          >
            © {new Date().getFullYear()} Smart LMS. All rights reserved.
          </p>

          {/* Center message */}

          <div className="hidden items-center gap-3 sm:flex">
            <Flame
              size={13}
              strokeWidth={1.3}
              style={{
                color: C.crimsonLight,
              }}
            />

            <span
              className="
                font-mono
                text-[9px]
                uppercase
                tracking-[0.2em]
              "
              style={{
                color: "rgba(201,164,92,0.4)",
              }}
            >
              Learn • Practice • Conquer
            </span>
          </div>

          {/* Right */}

          <div className="flex items-center gap-3">
            <Trophy
              size={13}
              strokeWidth={1.3}
              style={{
                color: C.gold,
              }}
            />

            <span
              className="text-xs"
              style={{
                color: C.muted,
              }}
            >
              Keep going
            </span>

            <ArrowRight
              size={14}
              strokeWidth={1.4}
              style={{
                color: C.goldLight,
              }}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          FINAL MEDIEVAL BOTTOM LINE
      ====================================================== */}

      <div className="relative">
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,164,92,0.25), transparent)",
          }}
        />

        <div
          className="mx-auto h-8 sm:h-10 lg:h-12"
          style={{
            background:
              "linear-gradient(180deg, rgba(201,164,92,0.025), transparent)",
          }}
        />
      </div>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes footer-particle {
          0% {
            transform: translateY(30px) translateX(0);
            opacity: 0;
          }

          20% {
            opacity: 0.28;
          }

          50% {
            transform: translateY(-15px) translateX(8px);
            opacity: 0.18;
          }

          80% {
            opacity: 0.08;
          }

          100% {
            transform: translateY(-65px) translateX(-7px);
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
          }
        }
      `}</style>
    </footer>
  );
}

/* =========================================================
   FOOTER COLUMN
========================================================= */

function FooterColumn({ title, icon: Icon, links }) {
  return (
    <div>
      <FooterHeading icon={Icon} title={title} />

      <div className="mt-6 flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="
              group
              flex
              items-center
              gap-2
              text-sm
              transition-all
              duration-300
              hover:translate-x-1
            "
            style={{
              color: C.muted,
            }}
          >
            <span
              className="
                h-px
                w-0
                transition-all
                duration-300
                group-hover:w-4
              "
              style={{
                backgroundColor: C.gold,
              }}
            />

            <span className="group-hover:text-[#E5F3FF]">
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   FOOTER HEADING
========================================================= */

function FooterHeading({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-[3px]
          border
        "
        style={{
          borderColor: "rgba(201,164,92,0.18)",
          backgroundColor: "rgba(201,164,92,0.035)",
        }}
      >
        <Icon
          size={14}
          strokeWidth={1.3}
          style={{
            color: C.gold,
          }}
        />
      </div>

      <div>
        <h3
          className="text-sm font-semibold"
          style={{
            color: C.ink,
          }}
        >
          {title}
        </h3>

        <div
          className="mt-1 h-px w-8"
          style={{
            backgroundColor: C.goldDark,
          }}
        />
      </div>
    </div>
  );
}

export default Footer;