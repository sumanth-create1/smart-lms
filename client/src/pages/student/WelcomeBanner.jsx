import {
  BookOpen,
  Clock3,
  Sparkles,
} from "lucide-react";

function WelcomeBanner({ user, stats }) {
  const weeklyGoal = stats?.weeklyGoal || {};

  const enrolledCourses = stats?.enrolledCourses ?? 0;
  const completedHours = weeklyGoal?.completedHours ?? 0;

  return (
    <section className="relative mb-8 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 shadow-lg">

      {/* Background decoration */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl" />

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div className="relative px-6 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10">

        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">

          {/* =================================
              LEFT CONTENT
          ================================= */}

          <div className="min-w-0 flex-1 pr-0 xl:max-w-2xl xl:pr-10">

            {/* Label */}

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <Sparkles
                  size={15}
                  className="text-white"
                />
              </div>

              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-100">
                Welcome back
              </span>

            </div>

            {/* Name */}

            <h1 className="mt-4 break-words text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              {user?.name || "Student"}
              <span className="ml-2 inline-block">
                👋
              </span>
            </h1>

            {/* Description */}

            <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100 sm:text-[15px]">
              Keep learning, stay consistent, and make progress
              every day. You're doing great!
            </p>

          </div>

          {/* =================================
              STATS
          ================================= */}

          <div className="grid w-full shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:w-[340px]">

            {/* Courses */}

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <BookOpen
                    size={19}
                    className="text-white"
                  />
                </div>

                <div className="min-w-0">

                  <p className="text-2xl font-bold leading-none text-white">
                    {enrolledCourses}
                  </p>

                  <p className="mt-1 text-xs font-medium text-indigo-100">
                    Enrolled Courses
                  </p>

                </div>

              </div>

            </div>

            {/* Hours */}

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Clock3
                    size={19}
                    className="text-white"
                  />
                </div>

                <div className="min-w-0">

                  <p className="text-2xl font-bold leading-none text-white">
                    {completedHours}
                    <span className="ml-1 text-base">
                      h
                    </span>
                  </p>

                  <p className="mt-1 text-xs font-medium text-indigo-100">
                    This Week
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default WelcomeBanner;