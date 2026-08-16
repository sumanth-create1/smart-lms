import { Flame, Target, Clock3 } from "lucide-react";

function LearningStreak({ streak, weeklyGoal }) {
  const currentStreak = streak ?? 0;

  const targetHours = weeklyGoal?.targetHours ?? 10;
  const completedHours = weeklyGoal?.completedHours ?? 0;
  const percentage = weeklyGoal?.percentage ?? 0;

  return (
    <section className="mt-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">

        {/* =========================
            LEARNING STREAK
        ========================= */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Learning Streak
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {currentStreak}
                <span className="ml-2 text-base font-medium text-gray-500">
                  {currentStreak === 1 ? "day" : "days"}
                </span>
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
              <Flame
                size={25}
                className="text-orange-500"
              />
            </div>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            {currentStreak > 0
              ? "Keep your learning momentum going!"
              : "Start learning today to build your streak!"}
          </p>

        </div>


        {/* =========================
            WEEKLY GOAL
        ========================= */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Weekly Learning Goal
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  {completedHours}
                </h2>

                <span className="text-sm text-gray-500">
                  / {targetHours} hours
                </span>
              </div>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
              <Target
                size={23}
                className="text-indigo-600"
              />
            </div>

          </div>


          {/* PROGRESS BAR */}

          <div className="mt-5">

            <div className="mb-2 flex items-center justify-between">

              <span className="text-xs font-medium text-gray-500">
                Progress
              </span>

              <span className="text-xs font-bold text-indigo-600">
                {percentage}%
              </span>

            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">

              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                }}
              />

            </div>

          </div>


          {/* FOOTER */}

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">

            <Clock3 size={14} />

            <span>
              {Math.max(targetHours - completedHours, 0)} hours remaining
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}

export default LearningStreak;