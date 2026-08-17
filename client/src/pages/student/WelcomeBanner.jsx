import {
  BookOpen,
  Clock3,
  Sparkles,
} from "lucide-react";

function WelcomeBanner({ user, stats }) {
  const weeklyGoal = stats?.weeklyGoal ?? {};

  const enrolledCourses = stats?.enrolledCourses ?? 0;
  const completedHours = weeklyGoal?.completedHours ?? 0;

  return (
    <section
      className="
        relative
        isolate
        w-full
        overflow-hidden
        rounded-[28px]
        bg-gradient-to-br
        from-indigo-600
        via-indigo-600
        to-violet-700
        shadow-lg
        shadow-indigo-200/40
      "
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-72
          w-72
          rounded-full
          bg-white/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          left-1/3
          h-64
          w-64
          rounded-full
          bg-violet-400/20
          blur-3xl
        "
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          p-6
          sm:p-8
          lg:p-9
          xl:p-10
        "
      >
        <div
          className="
            grid
            w-full
            grid-cols-1
            gap-8
            xl:grid-cols-[minmax(0,1fr)_400px]
            xl:items-center
            xl:gap-10
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================== */}

          <div className="min-w-0">

            {/* Label */}

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/15
                  ring-1
                  ring-white/10
                "
              >
                <Sparkles
                  size={16}
                  className="text-white"
                />
              </div>

              <span
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-indigo-100
                "
              >
                Welcome back
              </span>

            </div>

            {/* Name */}

            <h2
              className="
                mt-5
                break-words
                text-3xl
                font-bold
                leading-tight
                tracking-tight
                text-white
                sm:text-4xl
                lg:text-[40px]
              "
            >
              {user?.name || "Student"}

              <span className="ml-2 inline-block">
                👋
              </span>
            </h2>

            {/* Description */}

            <p
              className="
                mt-4
                max-w-2xl
                text-sm
                font-medium
                leading-6
                text-indigo-100
                sm:text-[15px]
              "
            >
              Keep learning, stay consistent, and make
              progress every day. You're doing great!
            </p>

          </div>

          {/* =================================================
              QUICK STATS
          ================================================== */}

          <div
            className="
              grid
              w-full
              grid-cols-1
              gap-3
              sm:grid-cols-2
              xl:grid-cols-1
            "
          >

            {/* =================================================
                ENROLLED COURSES
            ================================================== */}

            <div
              className="
                flex
                min-h-[96px]
                items-center
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-4
                backdrop-blur-md
                transition
                duration-200
                hover:bg-white/[0.15]
                sm:p-5
              "
            >
              <div className="flex w-full items-center gap-4">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/15
                    ring-1
                    ring-white/10
                  "
                >
                  <BookOpen
                    size={21}
                    className="text-white"
                  />
                </div>

                <div className="min-w-0">

                  <p
                    className="
                      text-2xl
                      font-bold
                      leading-none
                      text-white
                    "
                  >
                    {enrolledCourses}
                  </p>

                  <p
                    className="
                      mt-1.5
                      text-xs
                      font-semibold
                      text-indigo-100
                    "
                  >
                    Enrolled Courses
                  </p>

                </div>

              </div>
            </div>

            {/* =================================================
                WEEKLY HOURS
            ================================================== */}

            <div
              className="
                flex
                min-h-[96px]
                items-center
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-4
                backdrop-blur-md
                transition
                duration-200
                hover:bg-white/[0.15]
                sm:p-5
              "
            >
              <div className="flex w-full items-center gap-4">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/15
                    ring-1
                    ring-white/10
                  "
                >
                  <Clock3
                    size={21}
                    className="text-white"
                  />
                </div>

                <div className="min-w-0">

                  <p
                    className="
                      text-2xl
                      font-bold
                      leading-none
                      text-white
                    "
                  >
                    {completedHours}

                    <span className="ml-1 text-base font-semibold">
                      h
                    </span>
                  </p>

                  <p
                    className="
                      mt-1.5
                      text-xs
                      font-semibold
                      text-indigo-100
                    "
                  >
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