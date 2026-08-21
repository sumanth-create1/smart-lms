import {
  BarChart3,
  Clock3,
  TrendingUp,
} from "lucide-react";

// =====================================================
// HELPERS
// =====================================================

const getHours = (item = {}) => {
  if (item.hours != null) {
    const hours = Number(item.hours);

    return Number.isFinite(hours)
      ? Math.max(hours, 0)
      : 0;
  }

  if (item.minutes != null) {
    const minutes = Number(item.minutes);

    return Number.isFinite(minutes)
      ? Math.max(minutes / 60, 0)
      : 0;
  }

  if (item.durationSeconds != null) {
    const seconds = Number(
      item.durationSeconds
    );

    return Number.isFinite(seconds)
      ? Math.max(seconds / 3600, 0)
      : 0;
  }

  if (item.seconds != null) {
    const seconds = Number(item.seconds);

    return Number.isFinite(seconds)
      ? Math.max(seconds / 3600, 0)
      : 0;
  }

  return 0;
};

// =====================================================
// NORMALIZE ACTIVITY
// =====================================================

const normalizeActivity = (activity) => {
  if (!Array.isArray(activity)) {
    return [];
  }

  return activity.map((item) => ({
    day:
      item?.day ||
      item?.label ||
      item?.name ||
      "",

    hours: getHours(item),
  }));
};

// =====================================================
// LOADING SKELETON
// =====================================================

const ActivityLoading = () => {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <div className="h-5 w-36 animate-pulse rounded bg-slate-100" />

          <div className="mt-2 h-3 w-48 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-100" />
      </div>

      {/* Content */}

      <div className="p-5 sm:p-6">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />

            <div className="mt-2 h-9 w-20 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="h-8 w-24 animate-pulse rounded-full bg-slate-100" />
        </div>

        {/* Chart Skeleton */}

        <div className="flex h-56 items-end gap-2 sm:gap-4">
          {[40, 65, 30, 80, 55, 70, 45].map(
            (height, index) => (
              <div
                key={index}
                className="flex h-full flex-1 flex-col items-center justify-end"
              >
                <div
                  className="w-full max-w-9 animate-pulse rounded-lg bg-slate-100"
                  style={{
                    height: `${height}%`,
                  }}
                />

                <div className="mt-3 h-3 w-7 animate-pulse rounded bg-slate-100" />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyActivity = () => {
  return (
    <div className="flex h-56 flex-col items-center justify-center rounded-xl bg-slate-50 px-5 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
        <BarChart3
          size={22}
          className="text-slate-400"
        />
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-700">
        No learning activity yet
      </p>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
        Start a lesson to see your weekly
        learning activity here.
      </p>
    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

function LearningActivity({
  activity = [],
  loading = false,
}) {
  // ===================================================
  // NORMALIZE DATA
  // ===================================================

  const normalizedActivity =
    normalizeActivity(activity);

  // ===================================================
  // TOTAL HOURS
  // ===================================================

  const totalHours =
    normalizedActivity.reduce(
      (total, item) =>
        total + Number(item.hours || 0),
      0
    );

  // ===================================================
  // MAX BAR
  // ===================================================

  const maxActivityHours = Math.max(
    ...normalizedActivity.map(
      (item) =>
        Number(item.hours || 0)
    ),
    0
  );

  /*
   * Minimum chart scale is 4 hours.
   *
   * Example:
   *
   * 1.5h -> 4h scale
   * 3.2h -> 4h scale
   * 6.7h -> 7h scale
   */

  const maxHours = Math.max(
    Math.ceil(maxActivityHours),
    4
  );

  // ===================================================
  // WEEKLY AVERAGE
  // ===================================================

  const activeDays =
    normalizedActivity.filter(
      (item) => item.hours > 0
    ).length;

  const averageHours =
    activeDays > 0
      ? totalHours / activeDays
      : 0;

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return <ActivityLoading />;
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* =================================================
          HEADER
      ================================================= */}

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

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="p-5 sm:p-6">
        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Total */}

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

          {/* Stats */}

          <div className="flex flex-wrap gap-2">
            {/* Active Days */}

            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
              <Clock3 size={13} />

              <span>
                {activeDays}{" "}
                {activeDays === 1
                  ? "day"
                  : "days"}
              </span>
            </div>

            {/* Average */}

            {activeDays > 0 && (
              <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                <TrendingUp size={13} />

                <span>
                  {averageHours.toFixed(1)}h/day
                </span>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {normalizedActivity.length === 0 ? (
          <EmptyActivity />
        ) : (
          /* =================================================
             CHART
          ================================================= */

          <div className="w-full">
            {/* Chart */}

            <div className="flex h-56 items-end gap-2 sm:gap-4">
              {normalizedActivity.map(
                (item, index) => {
                  const hours = Number(
                    item.hours || 0
                  );

                  /*
                   * Calculate bar height.
                   *
                   * Minimum visible height is 3%
                   * for days with activity.
                   */

                  const height =
                    hours > 0
                      ? Math.max(
                          (hours /
                            maxHours) *
                            100,
                          5
                        )
                      : 2;

                  return (
                    <div
                      key={`${item.day}-${index}`}
                      className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                    >
                      {/* Hours */}

                      <span className="mb-2 whitespace-nowrap text-[10px] font-medium text-slate-400">
                        {hours.toFixed(1)}h
                      </span>

                      {/* Bar Area */}

                      <div className="flex h-full w-full max-w-9 items-end overflow-hidden rounded-lg bg-slate-50">
                        <div
                          className="w-full rounded-lg bg-indigo-500 transition-all duration-500 hover:bg-indigo-600"
                          style={{
                            height: `${height}%`,
                          }}
                          title={`${item.day}: ${hours.toFixed(
                            1
                          )} hours`}
                        />
                      </div>

                      {/* Day */}

                      <span className="mt-3 truncate text-[11px] font-medium text-slate-400">
                        {item.day || "-"}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default LearningActivity;