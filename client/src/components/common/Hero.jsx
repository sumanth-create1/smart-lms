import { Link } from "react-router-dom";
 
const C = {
  bg: "#FBFAF7",
  ink: "#15121F",
  muted: "#655D72",
  indigo: "#4F46E5",
  amber: "#F2A93B",
  teal: "#0EA5A4",
  coral: "#FF5A36",
  violet: "#7C3AED",
};
 
function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: C.bg }}
    >
      {/* Decorative background elements — larger, softer, further apart */}
      <div
        className="absolute -left-40 top-20 h-96 w-96 rounded-full opacity-25 blur-3xl"
        style={{ backgroundColor: `${C.indigo}25` }}
      />
 
      <div
        className="absolute -right-40 top-52 h-[26rem] w-[26rem] rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: `${C.coral}25` }}
      />
 
      <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-28 sm:pb-36 sm:pt-36 lg:px-10 lg:pb-44 lg:pt-44">
 
        <div className="grid items-center gap-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-28">
 
          {/* ================= LEFT CONTENT ================= */}
          <div>
 
            {/* Small label */}
            <div
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5"
              style={{
                borderColor: `${C.indigo}25`,
                backgroundColor: `${C.indigo}08`,
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: C.indigo }}
              />
 
              <span
                className="text-xs font-semibold uppercase tracking-[0.16em]"
                style={{ color: C.indigo }}
              >
                Your learning journey
              </span>
            </div>
 
            {/* Heading */}
            <h1
              className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-[-0.04em] sm:text-6xl lg:text-[72px]"
              style={{ color: C.ink }}
            >
              Learn skills.
 
              <span
                className="mt-3 block"
                style={{ color: C.indigo }}
              >
                Build your future.
              </span>
            </h1>
 
            {/* Description */}
            <p
              className="mt-9 max-w-xl text-base leading-8 sm:text-lg"
              style={{ color: C.muted }}
            >
              Smart LMS helps you learn practical technology skills through
              structured courses, hands-on lessons, and progress tracking —
              all in one place.
            </p>
 
            {/* Buttons */}
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
 
              <Link
                to="/register"
                className="
                  flex
                  h-[3.25rem]
                  items-center
                  justify-center
                  rounded-xl
                  px-8
                  py-4
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-lg
                "
                style={{
                  backgroundColor: C.indigo,
                }}
              >
                Start learning
                <span className="ml-2">→</span>
              </Link>
 
              <Link
                to="/courses"
                className="
                  flex
                  h-[3.25rem]
                  items-center
                  justify-center
                  rounded-xl
                  border
                  px-8
                  py-4
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-white
                "
                style={{
                  borderColor: "rgba(21,18,31,0.12)",
                  color: C.ink,
                }}
              >
                Explore courses
              </Link>
 
            </div>
 
            {/* Trust / stats */}
            <div className="mt-16 flex flex-wrap items-center gap-x-12 gap-y-7">
 
              <div>
                <p
                  className="text-3xl font-bold"
                  style={{ color: C.ink }}
                >
                  50+
                </p>
 
                <p
                  className="mt-1.5 text-xs"
                  style={{ color: C.muted }}
                >
                  Courses
                </p>
              </div>
 
              <div className="h-10 w-px bg-black/10" />
 
              <div>
                <p
                  className="text-3xl font-bold"
                  style={{ color: C.ink }}
                >
                  1K+
                </p>
 
                <p
                  className="mt-1.5 text-xs"
                  style={{ color: C.muted }}
                >
                  Learners
                </p>
              </div>
 
              <div className="h-10 w-px bg-black/10" />
 
              <div>
                <p
                  className="text-3xl font-bold"
                  style={{ color: C.ink }}
                >
                  24/7
                </p>
 
                <p
                  className="mt-1.5 text-xs"
                  style={{ color: C.muted }}
                >
                  Learning
                </p>
              </div>
 
            </div>
          </div>
 
          {/* ================= RIGHT LEARNING PATH ================= */}
          <div className="relative">
 
            {/* Main card */}
            <div
              className="relative rounded-3xl border p-8 shadow-[0_30px_90px_rgba(21,18,31,0.10)] sm:p-10"
              style={{
                borderColor: "rgba(21,18,31,0.08)",
                backgroundColor: "#FFFFFF",
              }}
            >
 
              {/* Card header */}
              <div className="flex items-center justify-between">
 
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.14em]"
                    style={{ color: C.muted }}
                  >
                    Learning path
                  </p>
 
                  <h2
                    className="mt-2 text-2xl font-bold"
                    style={{ color: C.ink }}
                  >
                    Full Stack Development
                  </h2>
                </div>
 
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold"
                  style={{
                    backgroundColor: `${C.indigo}12`,
                    color: C.indigo,
                  }}
                >
                  68%
                </div>
 
              </div>
 
              {/* Progress */}
              <div className="mt-9">
 
                <div className="mb-2.5 flex justify-between text-xs">
                  <span style={{ color: C.muted }}>
                    Course progress
                  </span>
 
                  <span
                    className="font-semibold"
                    style={{ color: C.indigo }}
                  >
                    68%
                  </span>
                </div>
 
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
 
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "68%",
                      background: `linear-gradient(90deg, ${C.indigo}, ${C.teal})`,
                    }}
                  />
 
                </div>
              </div>
 
              {/* Learning roadmap */}
              <div className="mt-12">
 
                <p
                  className="mb-7 text-xs font-semibold uppercase tracking-[0.14em]"
                  style={{ color: C.muted }}
                >
                  Your roadmap
                </p>
 
                <div className="relative">
 
                  {/* Connecting line */}
                  <div
                    className="absolute bottom-7 left-[13px] top-7 w-px"
                    style={{
                      backgroundColor: "rgba(21,18,31,0.12)",
                    }}
                  />
 
                  {/* Step 1 */}
                  <div className="relative flex gap-5 pb-9">
 
                    <div
                      className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{
                        backgroundColor: C.indigo,
                      }}
                    >
                      ✓
                    </div>
 
                    <div className="pt-0.5">
 
                      <p
                        className="text-sm font-semibold"
                        style={{ color: C.ink }}
                      >
                        HTML & CSS
                      </p>
 
                      <p
                        className="mt-1.5 text-xs"
                        style={{ color: C.muted }}
                      >
                        Completed
                      </p>
 
                    </div>
                  </div>
 
                  {/* Step 2 */}
                  <div className="relative flex gap-5 pb-9">
 
                    <div
                      className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 bg-white text-xs font-bold"
                      style={{
                        borderColor: C.teal,
                        color: C.teal,
                      }}
                    >
                      2
                    </div>
 
                    <div className="pt-0.5">
 
                      <p
                        className="text-sm font-semibold"
                        style={{ color: C.ink }}
                      >
                        JavaScript
                      </p>
 
                      <p
                        className="mt-1.5 text-xs"
                        style={{ color: C.muted }}
                      >
                        In progress · 72%
                      </p>
 
                    </div>
                  </div>
 
                  {/* Step 3 */}
                  <div className="relative flex gap-5 pb-9">
 
                    <div
                      className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 bg-white text-xs font-bold"
                      style={{
                        borderColor: C.amber,
                        color: C.amber,
                      }}
                    >
                      3
                    </div>
 
                    <div className="pt-0.5">
 
                      <p
                        className="text-sm font-semibold"
                        style={{ color: C.ink }}
                      >
                        React
                      </p>
 
                      <p
                        className="mt-1.5 text-xs"
                        style={{ color: C.muted }}
                      >
                        Upcoming
                      </p>
 
                    </div>
                  </div>
 
                  {/* Step 4 */}
                  <div className="relative flex gap-5">
 
                    <div
                      className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 bg-white text-xs font-bold"
                      style={{
                        borderColor: C.coral,
                        color: C.coral,
                      }}
                    >
                      4
                    </div>
 
                    <div className="pt-0.5">
 
                      <p
                        className="text-sm font-semibold"
                        style={{ color: C.ink }}
                      >
                        Node.js & MongoDB
                      </p>
 
                      <p
                        className="mt-1.5 text-xs"
                        style={{ color: C.muted }}
                      >
                        Upcoming
                      </p>
 
                    </div>
                  </div>
 
                </div>
              </div>
 
              {/* Continue learning */}
              <div
                className="mt-12 flex items-center justify-between rounded-2xl p-5"
                style={{
                  backgroundColor: "#F7F6FB",
                }}
              >
 
                <div>
 
                  <p
                    className="text-xs"
                    style={{ color: C.muted }}
                  >
                    Continue learning
                  </p>
 
                  <p
                    className="mt-1.5 text-sm font-semibold"
                    style={{ color: C.ink }}
                  >
                    React Fundamentals
                  </p>
 
                </div>
 
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:-translate-y-0.5"
                  style={{
                    backgroundColor: C.coral,
                  }}
                >
                  →
                </button>
 
              </div>
 
            </div>
 
            {/* Floating badge */}
            <div
              className="absolute -bottom-7 -left-7 hidden rounded-2xl border p-5 shadow-lg sm:block"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "rgba(21,18,31,0.08)",
              }}
            >
 
              <div className="flex items-center gap-3.5">
 
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${C.teal}15`,
                    color: C.teal,
                  }}
                >
                  ✓
                </div>
 
                <div>
 
                  <p
                    className="text-xs"
                    style={{ color: C.muted }}
                  >
                    Weekly streak
                  </p>
 
                  <p
                    className="text-sm font-bold"
                    style={{ color: C.ink }}
                  >
                    7 days 🔥
                  </p>
 
                </div>
 
              </div>
 
            </div>
 
            {/* Decorative colored dot */}
            <div
              className="absolute -right-4 -top-4 h-7 w-7 rounded-full border-4"
              style={{
                backgroundColor: C.amber,
                borderColor: C.bg,
              }}
            />
 
          </div>
        </div>
      </div>
    </section>
  );
}
 
export default Hero;
 