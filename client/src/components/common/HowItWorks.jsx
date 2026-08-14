const C = {
  bg: "#FBFAF7",
  surface: "#FFFFFF",
  ink: "#15121F",
  muted: "#655D72",
  indigo: "#4F46E5",
  amber: "#F2A93B",
  teal: "#0EA5A4",
  coral: "#FF5A36",
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
      className="overflow-hidden border-t border-black/[0.06]"
      style={{
        backgroundColor: C.bg,
      }}
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mx-auto max-w-2xl text-center">

          <div className="flex items-center justify-center gap-3">

            <span
              className="h-[2px] w-8 rounded-full"
              style={{
                backgroundColor: C.indigo,
              }}
            />

            <span
              className="
                font-mono
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

          <h2
            className="
              mt-6
              text-3xl
              font-bold
              leading-tight
              tracking-[-0.04em]
              sm:text-4xl
              lg:text-[48px]
            "
            style={{
              color: C.ink,
            }}
          >
            Learning made
            <span
              className="block"
              style={{
                color: C.muted,
              }}
            >
              simple.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-xl
              text-sm
              leading-7
              sm:text-base
            "
            style={{
              color: C.muted,
            }}
          >
            Smart LMS keeps the learning experience focused, simple and
            easy to follow.
          </p>

        </div>


        {/* =====================================================
            STEPS
        ===================================================== */}

        <div className="relative mt-20">

          {/* Connecting line */}

          <div
            className="
              absolute
              left-[16.66%]
              right-[16.66%]
              top-[31px]
              hidden
              h-px
              lg:block
            "
            style={{
              backgroundColor: "rgba(21,18,31,0.10)",
            }}
          />


          <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">

            {STEPS.map((step, index) => (

              <div
                key={step.number}
                className="relative text-center"
              >

                {/* Step circle */}

                <div className="relative z-10 mx-auto flex w-fit">

                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      border-[5px]
                      bg-white
                      text-lg
                      font-bold
                      shadow-sm
                    "
                    style={{
                      borderColor: `${step.color}20`,
                      color: step.color,
                    }}
                  >
                    {step.icon}
                  </div>

                </div>


                {/* Number */}

                <p
                  className="
                    mt-6
                    font-mono
                    text-[10px]
                    font-semibold
                    tracking-[0.2em]
                  "
                  style={{
                    color: step.color,
                  }}
                >
                  STEP {step.number}
                </p>


                {/* Title */}

                <h3
                  className="
                    mt-4
                    text-xl
                    font-bold
                    tracking-[-0.025em]
                    sm:text-2xl
                  "
                  style={{
                    color: C.ink,
                  }}
                >
                  {step.title}
                </h3>


                {/* Description */}

                <p
                  className="
                    mx-auto
                    mt-4
                    max-w-sm
                    text-sm
                    leading-7
                  "
                  style={{
                    color: C.muted,
                  }}
                >
                  {step.description}
                </p>


                {/* Small progress marker */}

                {index < STEPS.length - 1 && (
                  <div
                    className="
                      mx-auto
                      mt-8
                      h-1
                      w-1
                      rounded-full
                      lg:hidden
                    "
                    style={{
                      backgroundColor: step.color,
                    }}
                  />
                )}

              </div>

            ))}

          </div>

        </div>


        {/* =====================================================
            BOTTOM MESSAGE
        ===================================================== */}

        <div
          className="
            mx-auto
            mt-20
            max-w-3xl
            rounded-[24px]
            border
            bg-white
            px-6
            py-7
            text-center
            sm:px-10
          "
          style={{
            borderColor: "rgba(21,18,31,0.07)",
          }}
        >

          <p
            className="
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
              {" "}from your first lecture to your final completion.
            </span>
          </p>

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;

