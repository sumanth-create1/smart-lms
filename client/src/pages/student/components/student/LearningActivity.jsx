import {
  BarChart3,
  Clock3,
  TrendingUp,
  Flame,
  Crown,
  Sword,
  Shield,
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
    const seconds = Number(item.durationSeconds);

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
// LOADING
// =====================================================

const ActivityLoading = () => {
  return (
    <section
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-slate-800
        bg-[#0b0d12]
        shadow-xl
      "
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b0d12] via-[#17181d] to-[#241b16]" />

      <div className="relative z-10">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
          <div>
            <div className="h-5 w-40 animate-pulse rounded bg-white/10" />

            <div className="mt-2 h-3 w-52 animate-pulse rounded bg-white/5" />
          </div>

          <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />
        </div>

        {/* Content */}

        <div className="p-5 sm:p-6">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <div className="h-3 w-28 animate-pulse rounded bg-white/10" />

              <div className="mt-2 h-9 w-24 animate-pulse rounded bg-white/10" />
            </div>

            <div className="h-8 w-28 animate-pulse rounded-full bg-white/10" />
          </div>

          <div className="flex h-56 items-end gap-2 sm:gap-4">
            {[40, 65, 30, 80, 55, 70, 45].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <div
                    className="
                      w-full
                      max-w-9
                      animate-pulse
                      rounded-t-md
                      bg-white/10
                    "
                    style={{
                      height: `${height}%`,
                    }}
                  />

                  <div className="mt-3 h-3 w-7 animate-pulse rounded bg-white/10" />
                </div>
              )
            )}
          </div>
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
    <div
      className="
        relative
        flex
        h-56
        flex-col
        items-center
        justify-center
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-black/20
        px-5
        text-center
      "
    >
      {/* Decorative flames */}

      <div className="absolute left-8 top-8 text-2xl opacity-10">
        🔥
      </div>

      <div className="absolute bottom-8 right-8 text-2xl opacity-10">
        ⚔️
      </div>

      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          border
          border-amber-500/20
          bg-amber-500/10
        "
      >
        <Shield
          size={24}
          className="text-amber-500"
        />
      </div>

      <p className="mt-4 text-sm font-bold text-slate-200">
        No battles recorded yet
      </p>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
        Start a lesson and your learning battles
        will appear in the weekly chronicle.
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
  // NORMALIZE
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
  // MAX ACTIVITY
  // ===================================================

  const maxActivityHours = Math.max(
    ...normalizedActivity.map(
      (item) => Number(item.hours || 0)
    ),
    0
  );

  const maxHours = Math.max(
    Math.ceil(maxActivityHours),
    4
  );

  // ===================================================
  // ACTIVE DAYS
  // ===================================================

  const activeDays =
    normalizedActivity.filter(
      (item) => item.hours > 0
    ).length;

  // ===================================================
  // AVERAGE
  // ===================================================

  const averageHours =
    activeDays > 0
      ? totalHours / activeDays
      : 0;

  // ===================================================
  // MOST ACTIVE DAY
  // ===================================================

  const strongestDay =
    normalizedActivity.length > 0
      ? normalizedActivity.reduce(
          (max, item) =>
            item.hours > max.hours
              ? item
              : max,
          normalizedActivity[0]
        )
      : null;

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
    <section
      className="
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-slate-800
        bg-[#090b10]
        shadow-xl
        shadow-slate-300/20
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-2xl
      "
    >
      {/* =================================================
          CINEMATIC BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Base */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#090b10]
            via-[#15171d]
            to-[#211913]
          "
        />

        {/* Warm fire glow */}

        <div
          className="
            absolute
            -right-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-amber-600/10
            blur-[100px]
            transition-all
            duration-1000
            group-hover:scale-125
          "
        />

        {/* Red glow */}

        <div
          className="
            absolute
            -bottom-32
            -left-20
            h-80
            w-80
            rounded-full
            bg-red-900/10
            blur-[110px]
          "
        />

        {/* Stone texture */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(135deg,transparent_25%,white_25%,transparent_26%),linear-gradient(45deg,transparent_25%,white_25%,transparent_26%)]
            [background-size:22px_22px]
          "
        />

        {/* Ember particles */}

        <div className="absolute right-[12%] top-[18%] h-1 w-1 animate-ping rounded-full bg-amber-400/60" />

        <div className="absolute right-[25%] top-[35%] h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400/50" />

        <div className="absolute left-[18%] top-[30%] h-1 w-1 animate-ping rounded-full bg-red-400/40" />

        <div className="absolute left-[35%] bottom-[20%] h-1 w-1 animate-pulse rounded-full bg-amber-300/40" />
      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          items-center
          justify-between
          border-b
          border-white/10
          px-5
          py-5
          sm:px-6
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-amber-500/20
              bg-amber-500/10
              shadow-inner
              transition-all
              duration-300
              group-hover:scale-105
            "
          >
            <BarChart3
              size={19}
              className="text-amber-400"
            />
          </div>

          <div>
            <h2
              className="
                m-0
                text-base
                font-bold
                tracking-tight
                text-white
                sm:text-lg
              "
            >
              Weekly Chronicle
            </h2>

            <p
              className="
                m-0
                mt-0.5
                text-xs
                text-slate-500
                sm:text-sm
              "
            >
              Your battles across the realm
            </p>
          </div>
        </div>

        {/* Chronicle badge */}

        <div
          className="
            hidden
            items-center
            gap-1.5
            rounded-full
            border
            border-amber-500/20
            bg-amber-500/10
            px-3
            py-1.5
            sm:flex
          "
        >
          <Flame
            size={13}
            className="text-orange-400"
          />

          <span
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-amber-400
            "
          >
            This Week
          </span>
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="relative z-10 p-5 sm:p-6">
        {/* =================================================
            SUMMARY
        ================================================= */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          {/* Total */}

          <div>
            <div className="flex items-center gap-2">
              <Sword
                size={14}
                className="text-amber-500"
              />

              <p
                className="
                  m-0
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-slate-500
                "
              >
                Time on the realm
              </p>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <span
                className="
                  text-4xl
                  font-black
                  tracking-tight
                  text-white
                "
              >
                {totalHours.toFixed(1)}
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-slate-500
                "
              >
                hours
              </span>
            </div>
          </div>

          {/* Stats */}

          <div className="flex flex-wrap gap-2">
            {/* Active days */}

            <div
              className="
                flex
                items-center
                gap-1.5
                rounded-full
                border
                border-emerald-500/20
                bg-emerald-500/10
                px-3
                py-1.5
                text-xs
                font-semibold
                text-emerald-400
              "
            >
              <Clock3 size={13} />

              <span>
                {activeDays}{" "}
                {activeDays === 1
                  ? "battle"
                  : "battles"}
              </span>
            </div>

            {/* Average */}

            {activeDays > 0 && (
              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-amber-500/20
                  bg-amber-500/10
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-amber-400
                "
              >
                <TrendingUp size={13} />

                <span>
                  {averageHours.toFixed(1)}h/day
                </span>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            EMPTY
        ================================================= */}

        {normalizedActivity.length === 0 ? (
          <EmptyActivity />
        ) : (
          <>
            {/* =================================================
                CHART
            ================================================= */}

            <div className="w-full">
              <div
                className="
                  flex
                  h-56
                  items-end
                  gap-2
                  sm:gap-4
                "
              >
                {normalizedActivity.map(
                  (item, index) => {
                    const hours = Number(
                      item.hours || 0
                    );

                    const height =
                      hours > 0
                        ? Math.max(
                            (hours / maxHours) *
                              100,
                            5
                          )
                        : 2;

                    const isStrongest =
                      strongestDay?.day ===
                        item.day &&
                      strongestDay?.hours ===
                        item.hours &&
                      hours > 0;

                    return (
                      <div
                        key={`${item.day}-${index}`}
                        className="
                          flex
                          h-full
                          min-w-0
                          flex-1
                          flex-col
                          items-center
                          justify-end
                        "
                      >
                        {/* Crown */}

                        <div
                          className={`
                            mb-1
                            flex
                            h-5
                            items-center
                            justify-center
                            transition-all
                            duration-500
                            ${
                              isStrongest
                                ? "opacity-100"
                                : "opacity-0"
                            }
                          `}
                        >
                          <Crown
                            size={13}
                            className="text-amber-400"
                            fill="currentColor"
                          />
                        </div>

                        {/* Hours */}

                        <span
                          className="
                            mb-2
                            whitespace-nowrap
                            text-[10px]
                            font-semibold
                            text-slate-500
                          "
                        >
                          {hours.toFixed(1)}h
                        </span>

                        {/* BAR */}

                        <div
                          className="
                            relative
                            flex
                            h-full
                            w-full
                            max-w-10
                            items-end
                            overflow-hidden
                            rounded-t-lg
                            border
                            border-white/5
                            bg-white/[0.035]
                          "
                        >
                          {/* Stone background */}

                          <div
                            className="
                              absolute
                              inset-0
                              opacity-30
                              [background-image:linear-gradient(135deg,transparent_45%,white_46%,transparent_47%)]
                              [background-size:8px_8px]
                            "
                          />

                          {/* Actual bar */}

                          <div
                            className={`
                              relative
                              w-full
                              rounded-t-lg
                              bg-gradient-to-t
                              from-red-900
                              via-red-700
                              to-amber-500
                              shadow-lg
                              transition-all
                              duration-1000
                              ease-out
                              ${
                                isStrongest
                                  ? "shadow-amber-500/30"
                                  : "shadow-red-900/20"
                              }
                            `}
                            style={{
                              height: `${height}%`,
                            }}
                          >
                            {/* Fire highlight */}

                            {hours > 0 && (
                              <div
                                className="
                                  absolute
                                  left-0
                                  right-0
                                  top-0
                                  h-px
                                  bg-amber-300/80
                                "
                              />
                            )}
                          </div>
                        </div>

                        {/* Day */}

                        <span
                          className="
                            mt-3
                            truncate
                            text-[11px]
                            font-semibold
                            text-slate-500
                          "
                        >
                          {item.day || "-"}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* =================================================
                STRONGEST DAY
            ================================================= */}

            {strongestDay &&
              strongestDay.hours > 0 && (
                <div
                  className="
                    mt-7
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-amber-500/15
                    bg-gradient-to-r
                    from-amber-500/[0.08]
                    to-red-500/[0.05]
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-amber-500/10
                      text-xl
                    "
                  >
                    👑
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        m-0
                        text-sm
                        font-bold
                        text-amber-300
                      "
                    >
                      {strongestDay.day} claims the crown
                    </p>

                    <p
                      className="
                        m-0
                        mt-0.5
                        text-xs
                        leading-5
                        text-slate-500
                      "
                    >
                      Your strongest learning battle —
                      {strongestDay.hours.toFixed(1)} hours
                      of study.
                    </p>
                  </div>

                  <Shield
                    size={20}
                    className="hidden text-amber-500/50 sm:block"
                  />
                </div>
              )}
          </>
        )}
      </div>

      {/* =================================================
          CINEMATIC FOOTER
      ================================================= */}

      <div
        className="
          absolute
          bottom-0
          left-0
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-amber-600
          to-transparent
          opacity-50
        "
      />
    </section>
  );
}

export default LearningActivity;