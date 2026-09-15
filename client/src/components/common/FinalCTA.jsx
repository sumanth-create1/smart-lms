import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Crown,
  Flame,
  Shield,
  Sparkles,
  Sword,
  Trophy,
} from "lucide-react";

const C = {
  bg: "#07090C",
  surface: "#0D1015",
  surface2: "#121720",

  ink: "#F4F1E8",
  muted: "#A5A8AE",
  dim: "#6F747D",

  gold: "#C9A45C",
  goldLight: "#E6CD91",
  goldDark: "#765A2D",

  ice: "#B8D4E8",
  iceLight: "#E5F3FF",
  iceBlue: "#7FA8C7",

  crimson: "#7E2028",
  crimsonLight: "#B73740",

  border: "rgba(201,164,92,0.18)",
  frostBorder: "rgba(184,212,232,0.14)",
};

function FinalCTA() {
  return (
    <section
      className="relative w-full overflow-hidden border-t"
      style={{
        backgroundColor: C.bg,
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      {/* =====================================================
          ATMOSPHERIC BACKGROUND
      ====================================================== */}

      <div
        className="pointer-events-none absolute -left-48 top-20 h-[500px] w-[500px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(127,168,199,0.28) 0%, rgba(127,168,199,0.08) 35%, transparent 70%)",
          filter: "blur(25px)",
        }}
      />

      <div
        className="pointer-events-none absolute -right-48 bottom-0 h-[520px] w-[520px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(126,32,40,0.35) 0%, rgba(126,32,40,0.08) 40%, transparent 72%)",
          filter: "blur(25px)",
        }}
      />

      {/* Frost glow */}

      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 opacity-10"
        style={{
          background:
            "radial-gradient(ellipse, rgba(229,243,255,0.35), transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* =====================================================
          SNOW / EMBER PARTICLES
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-1 w-1 rounded-full opacity-30"
            style={{
              left: `${(index * 17 + 5) % 100}%`,
              top: `${(index * 29 + 8) % 100}%`,
              backgroundColor:
                index % 4 === 0 ? C.goldLight : C.iceLight,
              boxShadow: `0 0 8px ${
                index % 4 === 0 ? C.gold : C.iceBlue
              }`,
              animation: `cta-particle ${
                7 + (index % 5)
              }s ease-in-out infinite`,
              animationDelay: `${index * -0.7}s`,
            }}
          />
        ))}
      </div>

      {/* =====================================================
          FULL WIDTH OUTER CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          mx-auto
          flex
          w-full
          items-center
          justify-center
          px-5
          py-16
          sm:px-8
          sm:py-20
          lg:px-10
          lg:py-24
          xl:px-14
        "
      >
        {/* =================================================
            WIDE CTA BOX
        ================================================= */}

        <div
          className="
            relative
            w-full
            max-w-[1280px]
            overflow-hidden
            rounded-[4px]
            border
            px-6
            py-12
            sm:px-10
            sm:py-14
            lg:px-16
            lg:py-16
            xl:px-20
            xl:py-20
          "
          style={{
            background:
              "linear-gradient(145deg, #11151B 0%, #090B0F 48%, #0E1117 100%)",
            borderColor: C.border,
            boxShadow:
              "0 30px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* =================================================
              MEDIEVAL TOP BORDER
          ================================================= */}

          <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]">
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #765A2D 15%, #C9A45C 50%, #765A2D 85%, transparent)",
              }}
            />
          </div>

          {/* =================================================
              INNER FRAME
          ================================================= */}

          <div
            className="pointer-events-none absolute inset-3 border sm:inset-5"
            style={{
              borderColor: "rgba(201,164,92,0.08)",
            }}
          />

          {/* =================================================
              CORNER ORNAMENTS
          ================================================= */}

          <div
            className="pointer-events-none absolute left-5 top-5 h-8 w-8 border-l border-t sm:left-7 sm:top-7"
            style={{
              borderColor: "rgba(201,164,92,0.5)",
            }}
          />

          <div
            className="pointer-events-none absolute right-5 top-5 h-8 w-8 border-r border-t sm:right-7 sm:top-7"
            style={{
              borderColor: "rgba(201,164,92,0.5)",
            }}
          />

          <div
            className="pointer-events-none absolute bottom-5 left-5 h-8 w-8 border-b border-l sm:bottom-7 sm:left-7"
            style={{
              borderColor: "rgba(201,164,92,0.5)",
            }}
          />

          <div
            className="pointer-events-none absolute bottom-5 right-5 h-8 w-8 border-b border-r sm:bottom-7 sm:right-7"
            style={{
              borderColor: "rgba(201,164,92,0.5)",
            }}
          />

          {/* =================================================
              ICE / CRIMSON SIDE GLOWS
          ================================================= */}

          <div
            className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(127,168,199,0.16), transparent 68%)",
              filter: "blur(12px)",
            }}
          />

          <div
            className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(126,32,40,0.18), transparent 68%)",
              filter: "blur(12px)",
            }}
          />

          {/* =================================================
              FLOATING DECORATIONS
          ================================================= */}

          <div className="pointer-events-none absolute right-12 top-10 hidden opacity-20 sm:block">
            <Shield
              size={82}
              strokeWidth={0.7}
              style={{ color: C.ice }}
            />
          </div>

          <div className="pointer-events-none absolute bottom-12 left-10 hidden opacity-15 sm:block">
            <Sword
              size={90}
              strokeWidth={0.7}
              style={{ color: C.gold }}
            />
          </div>

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <div
            className="
              relative
              mx-auto
              flex
              max-w-[800px]
              flex-col
              items-center
              text-center
            "
          >
            {/* =================================================
                CROWN ORNAMENT
            ================================================= */}

            <div className="mb-5 flex items-center justify-center gap-4">
              <span
                className="h-px w-12 sm:w-16"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(201,164,92,0.6))",
                }}
              />

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                "
                style={{
                  borderColor: "rgba(201,164,92,0.35)",
                  background:
                    "radial-gradient(circle, rgba(201,164,92,0.14), transparent 70%)",
                  boxShadow: "0 0 25px rgba(201,164,92,0.08)",
                }}
              >
                <Crown
                  size={19}
                  strokeWidth={1.4}
                  style={{ color: C.goldLight }}
                />
              </div>

              <span
                className="h-px w-12 sm:w-16"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(201,164,92,0.6), transparent)",
                }}
              />
            </div>

            {/* =================================================
                LABEL
            ================================================= */}

            <div className="flex items-center justify-center gap-3">
              <span
                className="h-px w-8 sm:w-10"
                style={{
                  backgroundColor: C.gold,
                }}
              />

              <span
                className="
                  font-mono
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                "
                style={{
                  color: C.goldLight,
                }}
              >
                The journey begins
              </span>

              <span
                className="h-px w-8 sm:w-10"
                style={{
                  backgroundColor: C.gold,
                }}
              />
            </div>

            {/* =================================================
                HEADING
            ================================================= */}

            <h2
              className="
                mt-6
                max-w-[820px]
                text-center
                text-3xl
                font-bold
                leading-[1.04]
                tracking-[-0.045em]
                sm:text-4xl
                lg:text-[52px]
                xl:text-[58px]
              "
              style={{
                color: C.ink,
                fontFamily: "Georgia, serif",
              }}
            >
              Your next skill begins
              <span
                className="block"
                style={{
                  color: C.iceLight,
                  textShadow: "0 0 30px rgba(184,212,232,0.18)",
                }}
              >
                with one brave step.
              </span>
            </h2>

            {/* =================================================
                DIVIDER
            ================================================= */}

            <div className="mt-6 flex items-center gap-3">
              <span
                className="h-px w-14"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(201,164,92,0.5))",
                }}
              />

              <Sword
                size={15}
                strokeWidth={1.2}
                style={{
                  color: C.gold,
                  transform: "rotate(-45deg)",
                }}
              />

              <span
                className="h-px w-14"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(201,164,92,0.5), transparent)",
                }}
              />
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <p
              className="
                mx-auto
                mt-6
                max-w-[650px]
                text-center
                text-sm
                leading-7
                sm:text-base
              "
              style={{
                color: "rgba(229,243,255,0.58)",
              }}
            >
              Choose your path, sharpen your skills and continue your journey
              through the realm of knowledge. Smart LMS keeps your progress
              close while you forge your future.
            </p>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div
              className="
                mt-9
                flex
                flex-col
                items-center
                justify-center
                gap-3
                sm:flex-row
              "
            >
              {/* PRIMARY */}

              <Link
                to="/courses"
                className="
                  group
                  relative
                  inline-flex
                  min-w-[190px]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[3px]
                  border
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  hover:-translate-y-1
                "
                style={{
                  background:
                    "linear-gradient(135deg, #D7BC7B 0%, #A98245 100%)",
                  color: "#11100D",
                  borderColor: "rgba(231,201,130,0.65)",
                  boxShadow:
                    "0 10px 30px rgba(201,164,92,0.16)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <BookOpen size={16} strokeWidth={1.8} />
                  Explore Courses
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>

                {/* shine */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    -left-20
                    w-12
                    rotate-12
                    bg-white/30
                    blur-md
                    transition-all
                    duration-700
                    group-hover:left-[115%]
                  "
                />
              </Link>

              {/* SECONDARY */}

              <Link
                to="/register"
                className="
                  group
                  inline-flex
                  min-w-[190px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[3px]
                  border
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  hover:-translate-y-1
                "
                style={{
                  color: C.iceLight,
                  borderColor: "rgba(184,212,232,0.22)",
                  backgroundColor: "rgba(184,212,232,0.04)",
                }}
              >
                <Sparkles
                  size={15}
                  strokeWidth={1.5}
                  style={{ color: C.goldLight }}
                />

                Create Free Account
              </Link>
            </div>
          </div>

          {/* =================================================
              BOTTOM STATUS / DIVIDER
          ================================================= */}

          <div
            className="
              relative
              mx-auto
              mt-12
              flex
              max-w-[1050px]
              flex-col
              items-center
              justify-center
              gap-4
              border-t
              pt-6
              sm:flex-row
              sm:justify-between
            "
            style={{
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            {/* Left status */}

            <div className="flex items-center gap-3">
              <span
                className="relative flex h-2.5 w-2.5 items-center justify-center"
              >
                <span
                  className="absolute h-full w-full animate-ping rounded-full opacity-40"
                  style={{
                    backgroundColor: C.iceBlue,
                  }}
                />

                <span
                  className="relative h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: C.ice,
                    boxShadow: `0 0 8px ${C.iceBlue}`,
                  }}
                />
              </span>

              <span
                className="text-xs"
                style={{
                  color: "rgba(229,243,255,0.45)",
                }}
              >
                Learn • Practice • Progress
              </span>
            </div>

            {/* Center */}

            <div className="hidden items-center gap-2 sm:flex">
              <Flame
                size={13}
                strokeWidth={1.4}
                style={{ color: C.crimsonLight }}
              />

              <span
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                "
                style={{
                  color: "rgba(201,164,92,0.42)",
                }}
              >
                Forge your future
              </span>
            </div>

            {/* Right */}

            <div className="flex items-center gap-2">
              <Trophy
                size={13}
                strokeWidth={1.3}
                style={{ color: C.gold }}
              />

              <span
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                "
                style={{
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                Smart LMS
              </span>
            </div>
          </div>

          {/* =================================================
              BOTTOM GOLD LINE
          ================================================= */}

          <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[65%] -translate-x-1/2">
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(201,164,92,0.35), transparent)",
              }}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes cta-particle {
          0% {
            transform: translateY(30px) translateX(0);
            opacity: 0;
          }

          20% {
            opacity: 0.35;
          }

          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.22;
          }

          80% {
            opacity: 0.12;
          }

          100% {
            transform: translateY(-70px) translateX(-8px);
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
    </section>
  );
}

export default FinalCTA;