import {
  Flame,
  Target,
  Clock3,
  TrendingUp,
} from "lucide-react";

function LearningStreak({ streak, weeklyGoal }) {
  const currentStreak = streak ?? 0;

  const targetHours = weeklyGoal?.targetHours ?? 10;
  const completedHours = weeklyGoal?.completedHours ?? 0;

  const percentage = Math.min(
    Math.max(weeklyGoal?.percentage ?? 0, 0),
    100
  );

  const remainingHours = Math.max(
    targetHours - completedHours,
    0
  );

  return (
    <section className="w-full">
      <div
        className="
          grid
          w-full
          grid-cols-1
          gap-5
          lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]
        "
      >

        {/* =================================================
            LEARNING STREAK
        ================================================== */}

        <article
          className="
            group
            relative
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-200
            hover:-translate-y-1
            hover:border-orange-100
            hover:shadow-lg
            hover:shadow-slate-200/60
            sm:p-7
          "
        >

          {/* Background decoration */}

          <div
            className="
              pointer-events-none
              absolute
              -right-12
              -top-12
              h-32
              w-32
              rounded-full
              bg-orange-50
              opacity-0
              transition
              duration-300
              group-hover:opacity-100
            "
          />

          {/* Content */}

          <div className="relative m-1">

            {/* Header */}

            <div className="flex items-start justify-between gap-5">

              <div className="min-w-0">

                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-slate-400
                  "
                >
                  Learning Streak
                </p>

                <div className="mt-4 flex items-baseline gap-2">

                  <h2
                    className="
                      text-4xl
                      font-bold
                      leading-none
                      tracking-tight
                      text-slate-900
                    "
                  >
                    {currentStreak}
                  </h2>

                  <span className="text-sm font-medium text-slate-500">
                    {currentStreak === 1 ? "day" : "days"}
                  </span>

                </div>

              </div>

              {/* Icon */}

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-orange-50
                  text-orange-500
                  transition-all
                  duration-200
                  group-hover:bg-orange-500
                  group-hover:text-white
                "
              >
                <Flame
                  size={23}
                  strokeWidth={2}
                />
              </div>

            </div>

            {/* Divider */}

            <div className="my-6 h-px bg-slate-100" />

            {/* Description */}

            <div className="flex items-center gap-2">

              <TrendingUp
                size={15}
                className="shrink-0 text-orange-500"
              />

              <p className="text-sm font-medium leading-5 text-slate-500">
                {currentStreak > 0
                  ? "Keep your learning momentum going!"
                  : "Start learning today to build your streak!"}
              </p>

            </div>

          </div>
        </article>


        {/* =================================================
            WEEKLY GOAL
        ================================================== */}

        <article
          className="
            group
            relative
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-200
            hover:-translate-y-1
            hover:border-indigo-100
            hover:shadow-lg
            hover:shadow-slate-200/60
            sm:p-7
          "
        >

          {/* Background decoration */}

          <div
            className="
              pointer-events-none
              absolute
              -right-12
              -top-12
              h-32
              w-32
              rounded-full
              bg-indigo-50
              opacity-0
              transition
              duration-300
              group-hover:opacity-100
            "
          />

          {/* Content */}

          <div className="relative m-1">

            {/* Header */}

            <div className="flex items-start justify-between gap-5">

              <div className="min-w-0">

                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-slate-400
                  "
                >
                  Weekly Learning Goal
                </p>

                <div className="mt-4 flex items-baseline gap-2">

                  <h2
                    className="
                      text-4xl
                      font-bold
                      leading-none
                      tracking-tight
                      text-slate-900
                    "
                  >
                    {completedHours}
                  </h2>

                  <span className="text-sm font-medium text-slate-500">
                    / {targetHours} hours
                  </span>

                </div>

              </div>

              {/* Icon */}

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-50
                  text-indigo-600
                  transition-all
                  duration-200
                  group-hover:bg-indigo-600
                  group-hover:text-white
                "
              >
                <Target
                  size={23}
                  strokeWidth={2}
                />
              </div>

            </div>


            {/* =================================================
                PROGRESS
            ================================================== */}

            <div className="mt-7">

              <div className="mb-3 flex items-center justify-between">

                <span
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Progress
                </span>

                <span className="text-sm font-bold text-indigo-600">
                  {percentage}%
                </span>

              </div>

              <div
                className="
                  h-3
                  w-full
                  overflow-hidden
                  rounded-full
                  bg-slate-100
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-indigo-500
                    to-violet-600
                    transition-all
                    duration-500
                  "
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

            </div>


            {/* =================================================
                FOOTER
            ================================================== */}

            <div
              className="
                mt-5
                flex
                items-center
                gap-2
                rounded-xl
                bg-slate-50
                px-3
                py-2.5
                text-xs
                font-medium
                text-slate-500
              "
            >
              <Clock3
                size={15}
                className="shrink-0 text-slate-400"
              />

              <span>
                {remainingHours > 0
                  ? `${remainingHours} hours remaining`
                  : "Weekly goal completed 🎉"}
              </span>

            </div>

          </div>
        </article>

      </div>
    </section>
  );
}

export default LearningStreak;