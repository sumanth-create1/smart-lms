const C = {
  bg: "#FBFAF7",
  surface: "#FFFFFF",
  ink: "#15121F",
  muted: "#655D72",
  soft: "#F3F1EC",
  indigo: "#4F46E5",
  amber: "#F2A93B",
  teal: "#0EA5A4",
  coral: "#FF5A36",
};

const FEATURES = [
  {
    number: "01",
    title: "Structured learning",
    description:
      "Follow a clear learning path with organized courses and lessons designed to keep you moving forward.",
    color: C.indigo,
    icon: "↗",
  },
  {
    number: "02",
    title: "Track your progress",
    description:
      "Your lecture progress is automatically saved so you always know what you have completed and what comes next.",
    color: C.teal,
    icon: "✓",
  },
  {
    number: "03",
    title: "Resume anytime",
    description:
      "Leave a lecture and come back later. Smart LMS remembers where you stopped and lets you continue.",
    color: C.coral,
    icon: "▶",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden border-t border-black/[0.06]"
      style={{ backgroundColor: C.bg }}
    >
      {/* Background decoration */}

      <div
        className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full opacity-[0.035]"
        style={{
          backgroundColor: C.indigo,
          filter: "blur(90px)",
        }}
      />

      <div
        className="pointer-events-none absolute -left-32 bottom-20 h-80 w-80 rounded-full opacity-[0.03]"
        style={{
          backgroundColor: C.coral,
          filter: "blur(90px)",
        }}
      />

      {/* Main centered container */}

      <div className="relative mx-auto w-full max-w-[1180px] px-6 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-36">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mx-auto max-w-5xl">

          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">

            {/* Left */}

            <div className="min-w-0">

              <div className="flex items-center gap-4">

                <span
                  className="h-[2px] w-10 shrink-0 rounded-full"
                  style={{
                    backgroundColor: C.indigo,
                  }}
                />

                <span
                  className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]"
                  style={{
                    color: C.indigo,
                  }}
                >
                  Why Smart LMS
                </span>

              </div>

              <h2
                className="
                  mt-7
                  max-w-2xl
                  break-words
                  text-4xl
                  font-bold
                  leading-[1.05]
                  tracking-[-0.04em]
                  sm:text-5xl
                  lg:text-[58px]
                "
                style={{
                  color: C.ink,
                }}
              >
                Learning should feel

                <span
                  className="mt-2 block"
                  style={{
                    color: C.muted,
                  }}
                >
                  simple.
                </span>
              </h2>

            </div>


            {/* Right */}

            <div className="min-w-0 lg:pb-2">

              <p
                className="
                  max-w-lg
                  break-words
                  text-base
                  leading-7
                  sm:text-[17px]
                  sm:leading-8
                "
                style={{
                  color: C.muted,
                }}
              >
                Smart LMS gives students a focused environment to discover
                courses, follow their progress and continue learning without
                unnecessary complexity.
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            FEATURE CARDS
        ===================================================== */}

        <div className="mx-auto mt-20 max-w-5xl sm:mt-24 lg:mt-28">

          <div className="grid gap-6 lg:grid-cols-2">


            {/* =================================================
                FEATURE 01 — LARGE CARD
            ================================================= */}

            <div
              className="
                group
                relative
                min-w-0
                overflow-hidden
                rounded-[28px]
                border
                bg-white
                p-7
                sm:p-9
                lg:p-10
              "
              style={{
                borderColor: "rgba(21,18,31,0.08)",
                boxShadow: "0 18px 55px rgba(21,18,31,0.045)",
              }}
            >

              {/* Top accent */}

              <div
                className="absolute left-0 right-0 top-0 h-[4px]"
                style={{
                  backgroundColor: C.indigo,
                }}
              />

              {/* Decorative circle */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-24
                  -top-24
                  h-64
                  w-64
                  rounded-full
                  opacity-[0.06]
                  transition-transform
                  duration-700
                  group-hover:scale-110
                "
                style={{
                  backgroundColor: C.indigo,
                }}
              />

              {/* Card header */}

              <div className="relative flex items-center justify-between">

                <span
                  className="font-mono text-xs font-semibold"
                  style={{
                    color: C.indigo,
                  }}
                >
                  01
                </span>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    text-lg
                    font-semibold
                    transition-transform
                    duration-300
                    group-hover:rotate-6
                  "
                  style={{
                    backgroundColor: `${C.indigo}10`,
                    color: C.indigo,
                  }}
                >
                  ↗
                </div>

              </div>


              {/* Main content */}

              <div className="relative mt-20 min-w-0">

                <h3
                  className="
                    max-w-lg
                    break-words
                    text-2xl
                    font-bold
                    leading-[1.1]
                    tracking-[-0.03em]
                    sm:text-3xl
                  "
                  style={{
                    color: C.ink,
                  }}
                >
                  Learn with
                  <span className="block">
                    a clear direction.
                  </span>
                </h3>

                <p
                  className="
                    mt-5
                    max-w-lg
                    break-words
                    text-sm
                    leading-7
                    sm:text-[15px]
                  "
                  style={{
                    color: C.muted,
                  }}
                >
                  Courses are organized into meaningful lessons so you can
                  focus on learning instead of figuring out what comes next.
                </p>

              </div>


              {/* Learning roadmap */}

              <div className="relative mt-16 w-full">

                <div className="flex w-full items-center">

                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{
                      backgroundColor: C.indigo,
                    }}
                  />

                  <div
                    className="mx-2 h-[2px] min-w-0 flex-1"
                    style={{
                      backgroundColor: `${C.indigo}20`,
                    }}
                  />

                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: `${C.indigo}60`,
                    }}
                  />

                  <div
                    className="mx-2 h-[2px] min-w-0 flex-1"
                    style={{
                      backgroundColor: `${C.indigo}20`,
                    }}
                  />

                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: `${C.indigo}40`,
                    }}
                  />

                  <div
                    className="mx-2 h-[2px] min-w-0 flex-1"
                    style={{
                      backgroundColor: `${C.indigo}20`,
                    }}
                  />

                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: `${C.indigo}25`,
                    }}
                  />

                </div>

                <div
                  className="
                    mt-4
                    flex
                    justify-between
                    font-mono
                    text-[9px]
                    uppercase
                    tracking-[0.12em]
                  "
                  style={{
                    color: `${C.muted}99`,
                  }}
                >
                  <span>Start</span>
                  <span>Learn</span>
                  <span>Practice</span>
                  <span>Complete</span>
                </div>

              </div>

            </div>


            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

            <div className="flex min-w-0 flex-col gap-6">


              {/* =================================================
                  FEATURE 02
              ================================================= */}

              <div
                className="
                  group
                  min-w-0
                  rounded-[28px]
                  border
                  bg-white
                  p-7
                  sm:p-9
                  lg:p-10
                "
                style={{
                  borderColor: "rgba(21,18,31,0.08)",
                  boxShadow: "0 18px 55px rgba(21,18,31,0.045)",
                }}
              >

                <div className="flex min-w-0 flex-col gap-6 sm:flex-row">

                  {/* Icon */}

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      text-lg
                      font-bold
                      transition-transform
                      duration-300
                      group-hover:scale-105
                    "
                    style={{
                      backgroundColor: `${C.teal}10`,
                      color: C.teal,
                    }}
                  >
                    ✓
                  </div>


                  {/* Content */}

                  <div className="min-w-0 flex-1">

                    <div className="flex min-w-0 items-center justify-between gap-4">

                      <span
                        className="shrink-0 font-mono text-xs font-semibold"
                        style={{
                          color: C.teal,
                        }}
                      >
                        02
                      </span>

                      <span
                        className="truncate text-xs"
                        style={{
                          color: C.muted,
                        }}
                      >
                        Progress tracking
                      </span>

                    </div>

                    <h3
                      className="
                        mt-5
                        break-words
                        text-xl
                        font-bold
                        leading-tight
                        tracking-[-0.025em]
                        sm:text-2xl
                      "
                      style={{
                        color: C.ink,
                      }}
                    >
                      Always know where you stand.
                    </h3>

                    <p
                      className="
                        mt-4
                        max-w-xl
                        break-words
                        text-sm
                        leading-7
                      "
                      style={{
                        color: C.muted,
                      }}
                    >
                      Every lecture you watch contributes to your course
                      progress, giving you a simple view of your learning
                      journey.
                    </p>


                    {/* Progress bar */}

                    <div className="mt-7 w-full">

                      <div className="mb-3 flex min-w-0 items-center justify-between gap-4">

                        <span
                          className="min-w-0 truncate text-xs"
                          style={{
                            color: C.muted,
                          }}
                        >
                          MERN Stack Bootcamp
                        </span>

                        <span
                          className="shrink-0 font-mono text-xs font-semibold"
                          style={{
                            color: C.teal,
                          }}
                        >
                          68%
                        </span>

                      </div>

                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F0ED]">

                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: "68%",
                            backgroundColor: C.teal,
                          }}
                        />

                      </div>

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  FEATURE 03
              ================================================= */}

              <div
                className="
                  group
                  min-w-0
                  rounded-[28px]
                  border
                  bg-white
                  p-7
                  sm:p-9
                  lg:p-10
                "
                style={{
                  borderColor: "rgba(21,18,31,0.08)",
                  boxShadow: "0 18px 55px rgba(21,18,31,0.045)",
                }}
              >

                <div className="flex min-w-0 flex-col gap-6 sm:flex-row">

                  {/* Icon */}

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      text-sm
                      font-bold
                      transition-transform
                      duration-300
                      group-hover:scale-105
                    "
                    style={{
                      backgroundColor: `${C.coral}10`,
                      color: C.coral,
                    }}
                  >
                    ▶
                  </div>


                  {/* Content */}

                  <div className="min-w-0 flex-1">

                    <div className="flex min-w-0 items-center justify-between gap-4">

                      <span
                        className="shrink-0 font-mono text-xs font-semibold"
                        style={{
                          color: C.coral,
                        }}
                      >
                        03
                      </span>

                      <span
                        className="truncate text-xs"
                        style={{
                          color: C.muted,
                        }}
                      >
                        Resume learning
                      </span>

                    </div>

                    <h3
                      className="
                        mt-5
                        break-words
                        text-xl
                        font-bold
                        leading-tight
                        tracking-[-0.025em]
                        sm:text-2xl
                      "
                      style={{
                        color: C.ink,
                      }}
                    >
                      Pick up exactly where you stopped.
                    </h3>

                    <p
                      className="
                        mt-4
                        max-w-xl
                        break-words
                        text-sm
                        leading-7
                      "
                      style={{
                        color: C.muted,
                      }}
                    >
                      Your lecture progress is saved so you can leave and
                      return whenever it is convenient.
                    </p>


                    {/* Resume mini card */}

                    <div
                      className="
                        mt-7
                        flex
                        min-w-0
                        items-center
                        justify-between
                        gap-4
                        rounded-2xl
                        px-4
                        py-4
                        sm:px-5
                      "
                      style={{
                        backgroundColor: C.soft,
                      }}
                    >

                      <div className="min-w-0">

                        <p
                          className="
                            truncate
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                          "
                          style={{
                            color: C.muted,
                          }}
                        >
                          Continue learning
                        </p>

                        <p
                          className="mt-2 truncate text-sm font-semibold"
                          style={{
                            color: C.ink,
                          }}
                        >
                          React Fundamentals
                        </p>

                      </div>

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          text-sm
                          font-bold
                          shadow-sm
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                        style={{
                          color: C.coral,
                        }}
                      >
                        →
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            BOTTOM STATEMENT
        ===================================================== */}

        <div className="mx-auto mt-24 max-w-5xl sm:mt-28 lg:mt-32">

          <div className="h-px w-full bg-black/[0.07]" />

          <div
            className="
              flex
              flex-col
              gap-6
              pt-8
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <p
              className="
                max-w-2xl
                break-words
                text-sm
                leading-7
              "
              style={{
                color: C.muted,
              }}
            >
              From your first lecture to your final course completion,
              Smart LMS keeps your learning journey organized.
            </p>


            {/* Color waypoints */}

            <div className="flex shrink-0 items-center gap-2">

              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: C.indigo,
                }}
              />

              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: C.teal,
                }}
              />

              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: C.amber,
                }}
              />

              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: C.coral,
                }}
              />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Features;
