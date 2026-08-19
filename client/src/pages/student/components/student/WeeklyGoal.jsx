import {
  Target,
  Clock3,
  ArrowUpRight,
} from "lucide-react";

function WeeklyGoal() {
  const targetHours = 10;
  const completedHours = 6.5;
  const percentage = Math.min(
    Math.round((completedHours / targetHours) * 100),
    100
  );

  const circumference = 2 * Math.PI * 48;
  const offset =
    circumference - (percentage / 100) * circumference;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Weekly Goal
          </h2>

          <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
            Keep your learning streak alive
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
          <Target
            size={18}
            className="text-amber-500"
          />
        </div>

      </div>

      {/* Content */}
      <div className="flex flex-col items-center p-6">

        {/* Circular Progress */}
        <div className="relative h-40 w-40">

          <svg
            className="h-full w-full -rotate-90"
            viewBox="0 0 120 120"
          >
            {/* Background */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-100"
            />

            {/* Progress */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-indigo-600"
            />
          </svg>

          {/* Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {percentage}%
            </span>

            <span className="text-xs text-slate-400">
              completed
            </span>

          </div>

        </div>

        {/* Hours */}
        <div className="mt-5 text-center">

          <div className="flex items-center justify-center gap-2">

            <Clock3
              size={17}
              className="text-slate-400"
            />

            <span className="text-lg font-bold text-slate-900">
              {completedHours}
            </span>

            <span className="text-sm text-slate-400">
              / {targetHours} hrs
            </span>

          </div>

          <p className="mt-1 text-xs text-slate-400">
            {targetHours - completedHours} hours remaining this week
          </p>

        </div>

        {/* Bottom insight */}
        <div className="mt-6 flex w-full items-center justify-between rounded-xl bg-indigo-50 px-4 py-3">

          <div>

            <p className="text-xs font-semibold text-indigo-700">
              Great progress!
            </p>

            <p className="mt-0.5 text-[11px] text-indigo-500">
              You're on track this week.
            </p>

          </div>

          <ArrowUpRight
            size={17}
            className="text-indigo-500"
          />

        </div>

      </div>

    </section>
  );
}

export default WeeklyGoal;