import { BarChart3, Clock3 } from "lucide-react";

function LearningActivity({ activity = [] }) {
  /*
   * Backend activity is expected to look something like:
   *
   * [
   *   { day: "Mon", hours: 1.5 },
   *   { day: "Tue", hours: 2.2 }
   * ]
   *
   * We also safely handle minutes if the backend later returns
   * duration in minutes.
   */

  const normalizedActivity = activity.map((item) => ({
    day: item.day || item.label || "",
    hours:
      item.hours ??
      (item.minutes != null ? Number(item.minutes) / 60 : 0),
  }));

  const totalHours = normalizedActivity.reduce(
    (total, item) => total + Number(item.hours || 0),
    0
  );

  const maxActivityHours = Math.max(
    ...normalizedActivity.map((item) => Number(item.hours || 0)),
    1
  );

  /*
   * Keep a reasonable chart scale.
   *
   * Example:
   * 2.5 hours -> max becomes 3
   * 7 hours   -> max becomes 7
   */
  const maxHours = Math.max(
    Math.ceil(maxActivityHours),
    4
  );

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Learning Activity
          </h2>

          <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
            Your study activity this week
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
          <BarChart3
            size={18}
            className="text-indigo-600"
          />
        </div>

      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">

        {/* Summary */}
        <div className="mb-7 flex items-end justify-between">

          <div>
            <p className="text-xs font-medium text-slate-400">
              Total this week
            </p>

            <div className="mt-1 flex items-baseline gap-2">

              <span className="text-3xl font-bold tracking-tight text-slate-900">
                {totalHours.toFixed(1)}
              </span>

              <span className="text-sm font-medium text-slate-400">
                hours
              </span>

            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
            <Clock3 size={13} />
            This week
          </div>

        </div>

        {/* Empty State */}
        {normalizedActivity.length === 0 ? (
          <div className="flex h-56 flex-col items-center justify-center rounded-xl bg-slate-50">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
              <BarChart3
                size={22}
                className="text-slate-400"
              />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-700">
              No learning activity yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Start a lesson to see your weekly activity here.
            </p>

          </div>
        ) : (
          /* Chart */
          <div className="flex h-56 items-end gap-2 sm:gap-4">

            {normalizedActivity.map((item, index) => {
              const hours = Number(item.hours || 0);

              const height =
                hours > 0
                  ? Math.max(
                      (hours / maxHours) * 100,
                      5
                    )
                  : 2;

              return (
                <div
                  key={`${item.day}-${index}`}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >

                  {/* Hours */}
                  <span className="mb-2 text-[10px] font-medium text-slate-400">
                    {hours.toFixed(1)}h
                  </span>

                  {/* Bar area */}
                  <div className="flex h-full w-full max-w-9 items-end rounded-lg bg-slate-50">

                    <div
                      className="w-full rounded-lg bg-indigo-500 transition-all duration-300 hover:bg-indigo-600"
                      style={{
                        height: `${height}%`,
                      }}
                    />

                  </div>

                  {/* Day */}
                  <span className="mt-3 text-[11px] font-medium text-slate-400">
                    {item.day}
                  </span>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </section>
  );
}

export default LearningActivity;