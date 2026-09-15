import {
  ArrowRight,
  BookOpen,
  Check,
  Crown,
  Flame,
  Map,
  Play,
  ScrollText,
  Sparkles,
  Sword,
  Trophy,
} from "lucide-react";

/* ============================================================
   SMART LMS — MEDIEVAL / CINEMATIC THEME
============================================================ */

const C = {
  bg: "#08090B",
  surface: "#101114",
  surface2: "#15171B",
  stone: "#1B1D21",

  gold: "#C9A45C",
  goldLight: "#E7C982",
  goldDark: "#80632F",

  crimson: "#8F2028",
  crimsonLight: "#C43A42",

  ink: "#F4EFE5",
  muted: "#9A968C",
  dim: "#65625C",

  border: "rgba(201,164,92,0.17)",
};

/* ============================================================
   JOURNEY STEPS
============================================================ */

const STEPS = [
  {
    number: "I",
    step: "01",
    title: "Choose Your Path",
    description:
      "Enter the realm of knowledge and choose a course that matches the skills you seek to master.",
    icon: Map,
    accent: "#C9A45C",
    label: "CHOOSE",
  },
  {
    number: "II",
    step: "02",
    title: "Forge Your Skills",
    description:
      "Watch lectures at your own pace, practice what you learn and continue from exactly where you stopped.",
    icon: Sword,
    accent: "#A67C52",
    label: "FORGE",
  },
  {
    number: "III",
    step: "03",
    title: "Claim Your Mastery",
    description:
      "Track your progress automatically, complete your journey and prove how far your skills have grown.",
    icon: Trophy,
    accent: "#B4A06A",
    label: "MASTER",
  },
];

/* ============================================================
   STEP CARD
============================================================ */

function JourneyCard({ step, index }) {
  const Icon = step.icon;

  return (
    <div
      className="
        got-journey-card
        group
        relative
        flex
        min-h-[390px]
        w-full
        max-w-[360px]
        flex-col
        overflow-hidden
        border
        px-7
        py-8
        transition-all
        duration-500
        md:w-[330px]
        lg:w-[350px]
      "
      style={{
        background:
          "linear-gradient(145deg, #15171B 0%, #0D0F12 55%, #090A0C 100%)",
        borderColor: C.border,
      }}
    >
      {/* ======================================================
          HOVER GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-56
          w-56
          rounded-full
          opacity-0
          blur-3xl
          transition-opacity
          duration-700
          group-hover:opacity-20
        "
        style={{
          backgroundColor: step.accent,
        }}
      />

      {/* ======================================================
          TOP LIGHT
      ====================================================== */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          h-[2px]
          origin-left
          scale-x-0
          transition-transform
          duration-700
          group-hover:scale-x-100
        "
        style={{
          background: `
            linear-gradient(
              90deg,
              transparent,
              ${step.accent},
              transparent
            )
          `,
        }}
      />

      {/* ======================================================
          CORNER ORNAMENTS
      ====================================================== */}

      <div
        className="
          absolute
          left-4
          top-4
          h-7
          w-7
          border-l
          border-t
          opacity-50
        "
        style={{
          borderColor: step.accent,
        }}
      />

      <div
        className="
          absolute
          bottom-4
          right-4
          h-7
          w-7
          border-b
          border-r
          opacity-50
        "
        style={{
          borderColor: step.accent,
        }}
      />

      {/* ======================================================
          ROMAN NUMBER
      ====================================================== */}

      <div
        className="
          absolute
          right-6
          top-5
          font-serif
          text-5xl
          font-semibold
          opacity-[0.055]
          transition-all
          duration-500
          group-hover:opacity-[0.12]
          group-hover:scale-110
        "
        style={{
          color: step.accent,
        }}
      >
        {step.number}
      </div>

      {/* ======================================================
          ICON
      ====================================================== */}

      <div className="relative z-10 flex items-center justify-between">
        <div
          className="
            got-step-icon
            relative
            flex
            h-[78px]
            w-[78px]
            items-center
            justify-center
            rounded-full
            border
            transition-all
            duration-500
            group-hover:scale-110
            group-hover:rotate-3
          "
          style={{
            borderColor: `${step.accent}55`,
            background: `
              radial-gradient(
                circle,
                ${step.accent}16,
                transparent 68%
              )
            `,
            boxShadow: `0 0 35px ${step.accent}0D`,
          }}
        >
          {/* Outer ring */}

          <div
            className="
              absolute
              inset-2
              rounded-full
              border
              border-dashed
              opacity-25
              transition-transform
              duration-700
              group-hover:rotate-180
            "
            style={{
              borderColor: step.accent,
            }}
          />

          <Icon
            size={29}
            strokeWidth={1.2}
            style={{
              color: step.accent,
            }}
          />
        </div>

        {/* Step label */}

        <div className="text-right">
          <p
            className="
              font-mono
              text-[9px]
              uppercase
              tracking-[0.25em]
            "
            style={{
              color: C.dim,
            }}
          >
            Chapter
          </p>

          <p
            className="
              mt-1
              font-mono
              text-[11px]
              font-semibold
              tracking-[0.2em]
            "
            style={{
              color: step.accent,
            }}
          >
            {step.step}
          </p>
        </div>
      </div>

      {/* ======================================================
          LABEL
      ====================================================== */}

      <div className="relative z-10 mt-8">
        <div className="flex items-center gap-3">
          <span
            className="h-px w-8"
            style={{
              backgroundColor: step.accent,
            }}
          />

          <span
            className="
              font-mono
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.25em]
            "
            style={{
              color: step.accent,
            }}
          >
            {step.label}
          </span>
        </div>
      </div>

      {/* ======================================================
          TITLE
      ====================================================== */}

      <h3
        className="
          relative
          z-10
          mt-4
          text-2xl
          font-semibold
          leading-8
          tracking-[-0.025em]
          transition-colors
          duration-300
          group-hover:text-[#E7C982]
        "
        style={{
          color: C.ink,
        }}
      >
        {step.title}
      </h3>

      {/* ======================================================
          DESCRIPTION
      ====================================================== */}

      <p
        className="
          relative
          z-10
          mt-4
          text-sm
          leading-7
        "
        style={{
          color: C.muted,
        }}
      >
        {step.description}
      </p>

      {/* ======================================================
          BOTTOM
      ====================================================== */}

      <div className="relative z-10 mt-auto pt-8">
        <div className="flex items-center justify-between">
          {/* Progress indicator */}

          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="
                  h-1
                  w-1
                  rounded-full
                  transition-all
                  duration-300
                  group-hover:w-5
                "
                style={{
                  backgroundColor:
                    dot === index
                      ? step.accent
                      : "rgba(201,164,92,0.20)",
                }}
              />
            ))}
          </div>

          {/* Arrow */}

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              border
              transition-all
              duration-300
              group-hover:translate-x-1
            "
            style={{
              borderColor: `${step.accent}30`,
              color: step.accent,
            }}
          >
            <ArrowRight size={15} />
          </div>
        </div>
      </div>

      {/* ======================================================
          LIGHT SWEEP
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[120%]
          top-0
          z-30
          h-full
          w-[55%]
          rotate-[18deg]
          bg-gradient-to-r
          from-transparent
          via-white/[0.055]
          to-transparent
          transition-all
          duration-1000
          group-hover:left-[150%]
        "
      />
    </div>
  );
}

/* ============================================================
   CONNECTING PATH
============================================================ */

function ConnectingPath() {
  return (
    <div
      className="
        pointer-events-none
        absolute
        left-1/2
        top-[115px]
        hidden
        w-[720px]
        -translate-x-1/2
        lg:block
      "
    >
      {/* Main line */}

      <div
        className="h-px w-full"
        style={{
          background: `
            linear-gradient(
              90deg,
              transparent,
              rgba(201,164,92,0.25),
              rgba(201,164,92,0.25),
              transparent
            )
          `,
        }}
      />

      {/* Center diamond */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-2
          w-2
          -translate-x-1/2
          -translate-y-1/2
          rotate-45
        "
        style={{
          backgroundColor: C.gold,
          boxShadow:
            "0 0 15px rgba(201,164,92,0.45)",
        }}
      />
    </div>
  );
}

/* ============================================================
   BOTTOM JOURNEY MESSAGE
============================================================ */

function JourneyFooter() {
  return (
    <div
      className="
        got-journey-footer
        relative
        mx-auto
        mt-16
        w-full
        max-w-[900px]
        overflow-hidden
        border
        px-6
        py-8
        text-center
        sm:px-10
      "
      style={{
        borderColor: "rgba(201,164,92,0.17)",
        background:
          "linear-gradient(135deg, rgba(201,164,92,0.05), rgba(8,9,11,0.8))",
      }}
    >
      {/* Glow */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-32
          w-64
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          blur-3xl
        "
        style={{
          backgroundColor: "rgba(201,164,92,0.08)",
        }}
      />

      <div className="relative z-10">
        {/* Icon */}

        <div className="flex items-center justify-center gap-4">
          <span
            className="h-px w-12"
            style={{
              background:
                "linear-gradient(to right, transparent, #C9A45C)",
            }}
          />

          <Crown
            size={19}
            strokeWidth={1.2}
            style={{
              color: C.gold,
            }}
          />

          <span
            className="h-px w-12"
            style={{
              background:
                "linear-gradient(to left, transparent, #C9A45C)",
            }}
          />
        </div>

        <p
          className="
            mx-auto
            mt-5
            max-w-[680px]
            text-sm
            leading-7
            sm:text-base
          "
          style={{
            color: C.muted,
          }}
        >
          Your journey remains in one place —
          <span
            className="font-semibold"
            style={{
              color: C.ink,
            }}
          >
            {" "}
            from your first lesson to the moment you claim mastery.
          </span>
        </p>

        <div className="mt-5 flex items-center justify-center gap-2">
          <Sparkles
            size={13}
            style={{
              color: C.gold,
            }}
          />

          <span
            className="
              font-mono
              text-[9px]
              uppercase
              tracking-[0.22em]
            "
            style={{
              color: C.gold,
            }}
          >
            The path is yours to forge
          </span>

          <Sparkles
            size={13}
            style={{
              color: C.gold,
            }}
            className="rotate-180"
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HOW IT WORKS
============================================================ */

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="
        got-how-section
        relative
        w-full
        overflow-hidden
        border-t
      "
      style={{
        backgroundColor: C.bg,
        borderColor: "rgba(201,164,92,0.10)",
      }}
    >
      {/* ======================================================
          ATMOSPHERIC BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Main gold glow */}

        <div
          className="
            absolute
            left-1/2
            top-0
            h-[550px]
            w-[900px]
            -translate-x-1/2
            rounded-full
            blur-[130px]
          "
          style={{
            background:
              "radial-gradient(circle, rgba(201,164,92,0.075), transparent 68%)",
          }}
        />

        {/* Crimson glow */}

        <div
          className="
            absolute
            -left-48
            top-[35%]
            h-[400px]
            w-[400px]
            rounded-full
            blur-[120px]
          "
          style={{
            backgroundColor: "rgba(143,32,40,0.08)",
          }}
        />

        {/* Stone texture */}

        <div className="got-how-texture absolute inset-0" />

        {/* Vertical lines */}

        <div
          className="
            absolute
            left-[8%]
            top-0
            h-full
            w-px
          "
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(201,164,92,0.06), transparent)",
          }}
        />

        <div
          className="
            absolute
            right-[8%]
            top-0
            h-full
            w-px
          "
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(201,164,92,0.06), transparent)",
          }}
        />
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-[1280px]
          flex-col
          items-center
          px-5
          py-24
          sm:px-8
          sm:py-28
          lg:px-10
          lg:py-32
        "
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[760px]
            flex-col
            items-center
            text-center
          "
        >
          {/* Label */}

          <div className="flex items-center justify-center gap-3">
            <Sword
              size={16}
              strokeWidth={1.2}
              style={{
                color: C.gold,
              }}
            />

            <span
              className="
                font-mono
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.28em]
              "
              style={{
                color: C.gold,
              }}
            >
              Your journey begins
            </span>

            <Sword
              size={16}
              strokeWidth={1.2}
              style={{
                color: C.gold,
              }}
              className="rotate-180"
            />
          </div>

          {/* Heading */}

          <h2
            className="
              mt-7
              text-center
              text-4xl
              font-semibold
              leading-[1.04]
              tracking-[-0.045em]
              sm:text-5xl
              lg:text-[56px]
            "
            style={{
              color: C.ink,
            }}
          >
            Three steps.
            <span
              className="block"
              style={{
                color: C.goldLight,
                textShadow:
                  "0 0 30px rgba(201,164,92,0.15)",
              }}
            >
              One path to mastery.
            </span>
          </h2>

          {/* Decorative divider */}

          <div className="mt-7 flex items-center gap-3">
            <span
              className="h-px w-16"
              style={{
                background:
                  "linear-gradient(to right, transparent, #C9A45C)",
              }}
            />

            <span
              className="
                h-2
                w-2
                rotate-45
              "
              style={{
                backgroundColor: C.gold,
                boxShadow:
                  "0 0 16px rgba(201,164,92,0.45)",
              }}
            />

            <span
              className="h-px w-16"
              style={{
                background:
                  "linear-gradient(to left, transparent, #C9A45C)",
              }}
            />
          </div>

          {/* Description */}

          <p
            className="
              mx-auto
              mt-6
              max-w-[600px]
              text-center
              text-sm
              leading-7
              sm:text-base
            "
            style={{
              color: C.muted,
            }}
          >
            Smart LMS keeps your learning journey simple.
            Choose your path, forge your skills and track
            every step toward mastery.
          </p>
        </div>

        {/* ====================================================
            JOURNEY
        ==================================================== */}

        <div className="relative mt-16 w-full sm:mt-20">
          <ConnectingPath />

          <div
            className="
              relative
              mx-auto
              flex
              w-full
              max-w-[1100px]
              flex-col
              items-center
              justify-center
              gap-7
              md:flex-row
              md:flex-wrap
              lg:flex-nowrap
              lg:gap-6
            "
          >
            {STEPS.map((step, index) => (
              <JourneyCard
                key={step.step}
                step={step}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* ====================================================
            FOOTER MESSAGE
        ==================================================== */}

        <JourneyFooter />

        {/* ====================================================
            SMALL BOTTOM STATEMENT
        ==================================================== */}

        <div className="mt-10 flex items-center gap-3">
          <BookOpen
            size={14}
            strokeWidth={1.3}
            style={{
              color: C.goldDark,
            }}
          />

          <span
            className="
              font-mono
              text-[9px]
              uppercase
              tracking-[0.22em]
            "
            style={{
              color: C.dim,
            }}
          >
            Learn • Practice • Conquer
          </span>

          <Flame
            size={14}
            strokeWidth={1.3}
            style={{
              color: C.goldDark,
            }}
          />
        </div>
      </div>

      {/* ======================================================
          CINEMATIC CSS
      ====================================================== */}

      <style>{`
        /* ============================================
           TEXTURE
        ============================================ */

        .got-how-texture {
          background-image:
            linear-gradient(
              rgba(255,255,255,0.014) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.010) 1px,
              transparent 1px
            );

          background-size:
            42px 42px,
            42px 42px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 90%
            );
        }

        /* ============================================
           JOURNEY CARD
        ============================================ */

        .got-journey-card {
          border-radius: 4px;

          box-shadow:
            0 18px 50px rgba(0,0,0,0.32),
            inset 0 1px 0 rgba(255,255,255,0.025);

          will-change: transform;

          transition:
            transform 500ms cubic-bezier(0.2,0.8,0.2,1),
            box-shadow 500ms ease,
            border-color 500ms ease;
        }

        .got-journey-card:hover {
          transform:
            translateY(-14px)
            scale(1.015);

          border-color:
            rgba(201,164,92,0.40) !important;

          box-shadow:
            0 30px 80px rgba(0,0,0,0.50),
            0 0 45px rgba(201,164,92,0.06),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        /* ============================================
           ICON
        ============================================ */

        .got-step-icon {
          box-shadow:
            inset 0 0 20px rgba(201,164,92,0.02);
        }

        /* ============================================
           FOOTER HOVER
        ============================================ */

        .got-journey-footer {
          transition:
            border-color 400ms ease,
            box-shadow 400ms ease,
            transform 400ms ease;
        }

        .got-journey-footer:hover {
          transform: translateY(-3px);

          border-color:
            rgba(201,164,92,0.30);

          box-shadow:
            0 20px 50px rgba(0,0,0,0.30),
            0 0 35px rgba(201,164,92,0.05);
        }

        /* ============================================
           MOBILE
        ============================================ */

        @media (max-width: 767px) {
          .got-journey-card:hover {
            transform: translateY(-7px);
          }
        }

        /* ============================================
           REDUCED MOTION
        ============================================ */

        @media (prefers-reduced-motion: reduce) {
          .got-journey-card,
          .got-step-icon,
          .got-journey-footer {
            transition: none !important;
          }

          .got-journey-card:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default HowItWorks;