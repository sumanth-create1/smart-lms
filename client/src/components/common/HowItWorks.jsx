const C = {
  bg: "#FBFAF7",
  surface: "#FFFFFF",
  ink: "#15121F",
  muted: "#655D72",
  indigo: "#4F46E5",
  amber: "#F2A93B",
  teal: "#0EA5A4",
};

const STEPS = [
  {
    number: "01",
    title: "Choose a course",
    description:
      "Explore available courses and choose the one that matches your learning goals.",
    color: C.indigo,
    icon: "⌕",
  },
  {
    number: "02",
    title: "Learn at your pace",
    description:
      "Watch lectures, pause whenever you want and continue exactly where you left off.",
    color: C.amber,
    icon: "▶",
  },
  {
    number: "03",
    title: "Track your progress",
    description:
      "Your lecture progress is automatically saved so you always know how far you've come.",
    color: C.teal,
    icon: "✓",
  },
];

function HowItWorks() {
  return (
    <section
      className="w-full border-t border-black/[0.06]"
      style={{
        backgroundColor: C.bg,
      }}
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1280px]
          flex-col
          items-center
          px-5
          py-20
          sm:px-8
          sm:py-24
          lg:px-10
          lg:py-28
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[700px]
            flex-col
            items-center
            text-center
          "
        >
          {/* Label */}

          <div className="flex items-center justify-center gap-3">
            <span
              className="h-[2px] w-8 rounded-full"
              style={{
                backgroundColor: C.indigo,
              }}
            />

            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
              "
              style={{
                color: C.indigo,
              }}
            >
              How it works
            </span>

            <span
              className="h-[2px] w-8 rounded-full"
              style={{
                backgroundColor: C.indigo,
              }}
            />
          </div>

          {/* Heading */}

          <h2
            className="
              mt-6
              text-center
              text-4xl
              font-bold
              leading-[1.05]
              tracking-[-0.045em]
              sm:text-5xl
              lg:text-[52px]
            "
            style={{
              color: C.ink,
            }}
          >
            Learning made{" "}
            <span
              style={{
                color: C.muted,
              }}
            >
              simple.
            </span>
          </h2>

          {/* Description */}

          <p
            className="
              mx-auto
              mt-5
              max-w-[560px]
              text-center
              text-sm
              leading-7
              sm:text-base
            "
            style={{
              color: C.muted,
            }}
          >
            Smart LMS keeps the learning experience focused, simple and easy
            to follow.
          </p>
        </div>

        {/* =====================================================
            STEPS
        ====================================================== */}

        <div className="relative mt-16 w-full sm:mt-20">

          {/* Connecting Line */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-[39px]
              hidden
              h-px
              w-[680px]
              -translate-x-1/2
              lg:block
            "
            style={{
              backgroundColor: "rgba(21,18,31,0.10)",
            }}
          />

          {/* ===================================================
              CENTERED CARD GROUP
          ==================================================== */}

          <div
            className="
              mx-auto
              flex
              w-full
              max-w-[1040px]
              flex-col
              items-center
              justify-center
              gap-6
              md:flex-row
              md:flex-wrap
              lg:flex-nowrap
              lg:gap-6
            "
          >
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="
                  group
                  relative
                  flex
                  min-h-[350px]
                  w-[320px]
                  shrink-0
                  flex-col
                  items-center
                  rounded-[26px]
                  border
                  bg-white
                  px-7
                  py-9
                  text-center
                  transition-all
                  duration-300
                  hover:-translate-y-1.5
                  hover:shadow-[0_20px_50px_rgba(21,18,31,0.09)]
                "
                style={{
                  borderColor: "rgba(21,18,31,0.07)",
                }}
              >
                {/* =================================================
                    ICON
                ================================================== */}

                <div
                  className="
                    relative
                    z-10
                    flex
                    h-[76px]
                    w-[76px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-[5px]
                    bg-white
                    text-xl
                    font-bold
                    shadow-[0_8px_25px_rgba(21,18,31,0.08)]
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                  style={{
                    borderColor: `${step.color}25`,
                    color: step.color,
                  }}
                >
                  {step.icon}
                </div>

                {/* =================================================
                    STEP NUMBER
                ================================================== */}

                <div
                  className="
                    mt-6
                    rounded-full
                    px-3.5
                    py-1.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                  "
                  style={{
                    backgroundColor: `${step.color}10`,
                    color: step.color,
                  }}
                >
                  Step {step.number}
                </div>

                {/* =================================================
                    TITLE
                ================================================== */}

                <h3
                  className="
                    mt-5
                    w-full
                    text-center
                    text-xl
                    font-bold
                    leading-7
                    tracking-[-0.025em]
                    sm:text-2xl
                  "
                  style={{
                    color: C.ink,
                  }}
                >
                  {step.title}
                </h3>

                {/* =================================================
                    DESCRIPTION
                ================================================== */}

                <p
                  className="
                    mx-auto
                    mt-4
                    max-w-[270px]
                    text-center
                    text-sm
                    leading-7
                  "
                  style={{
                    color: C.muted,
                  }}
                >
                  {step.description}
                </p>

                {/* =================================================
                    ACCENT
                ================================================== */}

                <div
                  className="
                    mt-auto
                    h-1
                    w-10
                    rounded-full
                    transition-all
                    duration-300
                    group-hover:w-16
                  "
                  style={{
                    backgroundColor: step.color,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================
            BOTTOM MESSAGE
        ====================================================== */}

        <div
          className="
            mx-auto
            mt-14
            flex
            w-full
            max-w-[850px]
            items-center
            justify-center
            rounded-[22px]
            border
            bg-white
            px-6
            py-6
            text-center
            sm:mt-16
            sm:px-10
            sm:py-7
          "
          style={{
            borderColor: "rgba(21,18,31,0.07)",
          }}
        >
          <p
            className="
              mx-auto
              max-w-[700px]
              text-center
              text-sm
              leading-7
              sm:text-base
            "
            style={{
              color: C.muted,
            }}
          >
            Your learning journey stays in one place —
            <span
              className="font-semibold"
              style={{
                color: C.ink,
              }}
            >
              {" "}
              from your first lecture to your final completion.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;