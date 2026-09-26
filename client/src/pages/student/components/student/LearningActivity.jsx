import { memo, useMemo } from "react";

import {
  BarChart3,
  Clock3,
  TrendingUp,
  Flame,
  Crown,
  Sword,
  Shield,
  Sparkles,
  Swords,
  Castle,
  Moon,
  Feather,
  Mountain,
} from "lucide-react";

// =====================================================
// CONSTANTS
// =====================================================

const EMPTY_ACTIVITY = Object.freeze([]);

const BAR_HEIGHTS = [40, 65, 30, 80, 55, 70, 45];

// =====================================================
// STATIC STYLES
// =====================================================

const ACTIVITY_STYLES = `
  @keyframes activityFloat {
    0%, 100% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(0, -4px, 0);
    }
  }

  @keyframes activityFlame {
    0%, 100% {
      transform: scale(1);
      opacity: .75;
    }

    50% {
      transform: scale(1.06);
      opacity: 1;
    }
  }

  @keyframes activityCrown {
    0%, 100% {
      transform: translate3d(0, 0, 0) rotate(0deg);
    }

    50% {
      transform: translate3d(0, -3px, 0) rotate(2deg);
    }
  }

  @keyframes activitySnow {
    0% {
      transform: translate3d(0, -15px, 0);
      opacity: 0;
    }

    20% {
      opacity: .5;
    }

    100% {
      transform: translate3d(8px, 120px, 0);
      opacity: 0;
    }
  }

  @keyframes activityEmber {
    0% {
      transform: translate3d(0, 0, 0);
      opacity: 0;
    }

    20% {
      opacity: .5;
    }

    100% {
      transform: translate3d(5px, -45px, 0);
      opacity: 0;
    }
  }

  @keyframes activityFog {
    0%, 100% {
      transform: translate3d(-3%, 0, 0);
      opacity: .2;
    }

    50% {
      transform: translate3d(3%, 0, 0);
      opacity: .35;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .learning-activity-motion,
    .learning-activity-motion::before,
    .learning-activity-motion::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

// =====================================================
// HELPERS
// =====================================================

const getSafeNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
};

const getHours = (item = {}) => {
  if (item.hours != null) {
    return Math.max(getSafeNumber(item.hours), 0);
  }

  if (item.minutes != null) {
    return Math.max(getSafeNumber(item.minutes) / 60, 0);
  }

  if (item.durationSeconds != null) {
    return Math.max(
      getSafeNumber(item.durationSeconds) / 3600,
      0
    );
  }

  if (item.seconds != null) {
    return Math.max(
      getSafeNumber(item.seconds) / 3600,
      0
    );
  }

  return 0;
};

// =====================================================
// NORMALIZE ACTIVITY
// =====================================================

const normalizeActivity = (activity) => {
  if (!Array.isArray(activity) || activity.length === 0) {
    return EMPTY_ACTIVITY;
  }

  return activity.map((item) => ({
    day:
      item?.day ??
      item?.label ??
      item?.name ??
      "",

    hours: getHours(item),
  }));
};

// =====================================================
// LOADING
// =====================================================

const ActivityLoading = memo(() => {
  return (
    <section
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-slate-700/50
        bg-[#07090b]
        shadow-2xl
        shadow-black/50
      "
    >
      {/* STATIC BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#07090b]
            via-[#11161a]
            to-[#0a0d0f]
          "
        />

        <div
          className="
            absolute
            right-[-50px]
            top-[-60px]
            h-48
            w-48
            rounded-full
            bg-slate-200/[0.025]
            blur-[40px]
          "
        />

        <div
          className="
            absolute
            bottom-[-80px]
            left-[-80px]
            h-56
            w-56
            rounded-full
            bg-amber-600/[0.035]
            blur-[70px]
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(135deg,transparent_45%,white_46%,transparent_47%)]
            [background-size:24px_24px]
          "
        />
      </div>

      <div className="relative z-10">
        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/[0.07]
            px-5
            py-5
            sm:px-6
          "
        >
          <div>
            <div className="h-5 w-40 animate-pulse rounded bg-white/10" />

            <div className="mt-2 h-3 w-52 animate-pulse rounded bg-white/5" />
          </div>

          <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />
        </div>

        {/* CONTENT */}

        <div className="p-5 sm:p-6">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <div className="h-3 w-28 animate-pulse rounded bg-white/10" />

              <div className="mt-2 h-9 w-24 animate-pulse rounded bg-white/10" />
            </div>

            <div className="h-8 w-28 animate-pulse rounded-full bg-white/10" />
          </div>

          <div className="flex h-56 items-end gap-2 sm:gap-4">
            {BAR_HEIGHTS.map((height, index) => (
              <div
                key={`${height}-${index}`}
                className="
                  flex
                  h-full
                  flex-1
                  flex-col
                  items-center
                  justify-end
                "
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
            ))}
          </div>
        </div>
      </div>

      <style>{ACTIVITY_STYLES}</style>
    </section>
  );
});

ActivityLoading.displayName = "ActivityLoading";

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyActivity = memo(() => {
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
        border-slate-700/40
        bg-black/30
        px-5
        text-center
      "
    >
      {/* STATIC MOON */}

      <div
        className="
          pointer-events-none
          absolute
          right-8
          top-6
          h-14
          w-14
          rounded-full
          bg-slate-200/[0.03]
          shadow-[0_0_30px_rgba(186,230,253,0.04)]
        "
      >
        <Moon
          size={25}
          className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            text-slate-300/20
          "
        />
      </div>

      {/* DECORATIVE ICONS */}

      <Flame
        size={20}
        className="
          learning-activity-motion
          absolute
          left-8
          top-8
          animate-[activityFlame_2.4s_ease-in-out_infinite]
          text-amber-500/20
        "
      />

      <Sword
        size={22}
        className="
          absolute
          bottom-8
          right-8
          rotate-[-20deg]
          text-slate-300/20
        "
      />

      <Feather
        size={18}
        className="
          absolute
          bottom-12
          left-20
          rotate-[-10deg]
          text-sky-300/20
        "
      />

      <Sparkles
        size={16}
        className="
          absolute
          right-20
          top-12
          text-amber-400/20
        "
      />

      {/* SHIELD */}

      <div
        className="
          learning-activity-motion
          relative
          flex
          h-14
          w-14
          animate-[activityFloat_4s_ease-in-out_infinite]
          items-center
          justify-center
          rounded-2xl
          border
          border-amber-500/20
          bg-amber-500/[0.07]
          shadow-[0_0_25px_rgba(245,158,11,0.05)]
        "
      >
        <Shield
          size={24}
          className="text-amber-400"
        />

        {/* STATIC RING */}
        <div
          className="
            absolute
            inset-0
            rounded-2xl
            border
            border-amber-500/[0.08]
          "
        />
      </div>

      <p className="mt-4 text-sm font-black text-slate-200">
        No battles recorded yet
      </p>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
        Begin a lesson and your learning battles
        will be written into the weekly chronicle.
      </p>
    </div>
  );
});

EmptyActivity.displayName = "EmptyActivity";

// =====================================================
// ACTIVITY BAR
// =====================================================

const ActivityBar = memo(
  ({ item, maxHours, strongestDay }) => {
    const hours = item.hours;

    const height =
      hours > 0
        ? Math.max((hours / maxHours) * 100, 5)
        : 2;

    const isStrongest =
      strongestDay?.day === item.day &&
      strongestDay?.hours === item.hours &&
      hours > 0;

    return (
      <div
        className="
          group/bar
          flex
          h-full
          min-w-0
          flex-1
          flex-col
          items-center
          justify-end
        "
      >
        {/* CROWN */}

        <div
          className={`
            mb-1
            flex
            h-5
            items-center
            justify-center
            transition-opacity
            duration-300
            ${isStrongest ? "opacity-100" : "opacity-0"}
          `}
        >
          <Crown
            size={14}
            className={`
              text-amber-400
              ${
                isStrongest
                  ? "learning-activity-motion animate-[activityCrown_3s_ease-in-out_infinite]"
                  : ""
              }
            `}
            fill="currentColor"
          />
        </div>

        {/* HOURS */}

        <span
          className="
            mb-2
            whitespace-nowrap
            text-[10px]
            font-semibold
            text-slate-500
            transition-colors
            duration-200
            group-hover/bar:text-slate-200
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
            border-white/[0.05]
            bg-white/[0.02]
            transition-[border-color]
            duration-200
            group-hover/bar:border-amber-700/40
          "
        >
          {/* PATTERN */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-25
              [background-image:linear-gradient(135deg,transparent_45%,white_46%,transparent_47%)]
              [background-size:9px_9px]
            "
          />

          {/* BAR */}

          <div
            className={`
              relative
              w-full
              rounded-t-lg
              bg-gradient-to-t
              from-[#15191c]
              via-[#37434a]
              to-amber-400
              transition-[height]
              duration-700
              ease-out
            `}
            style={{
              height: `${height}%`,
            }}
          >
            {/* GOLD EDGE */}

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

            {/* HOVER SHINE */}

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                h-1/2
                -translate-y-full
                bg-gradient-to-b
                from-white/15
                to-transparent
                transition-transform
                duration-500
                group-hover/bar:translate-y-0
              "
            />
          </div>
        </div>

        {/* DAY */}

        <span
          className="
            mt-3
            truncate
            text-[11px]
            font-semibold
            text-slate-500
            transition-colors
            duration-200
            group-hover/bar:text-slate-200
          "
        >
          {item.day || "-"}
        </span>
      </div>
    );
  }
);

ActivityBar.displayName = "ActivityBar";

// =====================================================
// MAIN COMPONENT
// =====================================================

const LearningActivity = memo(
  ({
    activity = EMPTY_ACTIVITY,
    loading = false,
  }) => {
    // =================================================
    // NORMALIZE
    // =================================================

    const normalizedActivity = useMemo(
      () => normalizeActivity(activity),
      [activity]
    );

    // =================================================
    // STATISTICS
    // =================================================

    const statistics = useMemo(() => {
      let totalHours = 0;
      let activeDays = 0;
      let strongestDay = null;
      let maxActivityHours = 0;

      for (const item of normalizedActivity) {
        const hours = item.hours;

        totalHours += hours;

        if (hours > 0) {
          activeDays++;
        }

        if (hours > maxActivityHours) {
          maxActivityHours = hours;
        }

        if (
          !strongestDay ||
          hours > strongestDay.hours
        ) {
          strongestDay = item;
        }
      }

      const maxHours = Math.max(
        Math.ceil(maxActivityHours),
        4
      );

      const averageHours =
        activeDays > 0
          ? totalHours / activeDays
          : 0;

      return {
        totalHours,
        activeDays,
        averageHours,
        strongestDay,
        maxHours,
      };
    }, [normalizedActivity]);

    const {
      totalHours,
      activeDays,
      averageHours,
      strongestDay,
      maxHours,
    } = statistics;

    // =================================================
    // LOADING
    // =================================================

    if (loading) {
      return <ActivityLoading />;
    }

    // =================================================
    // UI
    // =================================================

    return (
      <section
        className="
          group
          relative
          min-w-0
          overflow-hidden
          rounded-[28px]
          border
          border-slate-700/50
          bg-[#07090b]
          shadow-2xl
          shadow-black/50
          transition-[transform,border-color]
          duration-300
          hover:-translate-y-1
          hover:border-amber-700/40
        "
      >
        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* BASE */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-[#050709]
              via-[#11171b]
              to-[#090b0d]
            "
          />

          {/* MOON */}

          <div
            className="
              absolute
              right-[7%]
              top-[7%]
              h-20
              w-20
              rounded-full
              bg-slate-200/[0.03]
              shadow-[0_0_45px_rgba(186,230,253,0.04)]
            "
          />

          {/* CASTLE */}

          <div
            className="
              absolute
              bottom-0
              left-0
              h-24
              w-full
              opacity-[0.12]
            "
          >
            <div className="absolute bottom-0 left-[7%] h-16 w-20 border-x border-t border-slate-500/20" />

            <div className="absolute bottom-0 left-[16%] h-24 w-7 border-x border-t border-slate-500/20" />

            <div className="absolute bottom-0 right-[14%] h-20 w-9 border-x border-t border-slate-500/20" />

            <Castle
              size={70}
              className="
                absolute
                bottom-[-5px]
                left-1/2
                -translate-x-1/2
                text-slate-400/[0.07]
              "
            />
          </div>

          {/* MOUNTAINS */}

          <div
            className="
              absolute
              bottom-0
              left-[-5%]
              h-20
              w-[110%]
              opacity-[0.05]
            "
          >
            <Mountain
              size={160}
              className="
                absolute
                bottom-[-45px]
                left-[8%]
              "
            />

            <Mountain
              size={140}
              className="
                absolute
                bottom-[-50px]
                right-[10%]
              "
            />
          </div>

          {/* STATIC GLOWS */}

          <div
            className="
              absolute
              -bottom-24
              -left-24
              h-72
              w-72
              rounded-full
              bg-amber-700/[0.05]
              blur-[75px]
            "
          />

          <div
            className="
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-sky-800/[0.055]
              blur-[80px]
            "
          />

          {/* STONE */}

          <div
            className="
              absolute
              inset-0
              opacity-[0.035]
              [background-image:linear-gradient(135deg,transparent_45%,white_46%,transparent_47%),linear-gradient(45deg,transparent_45%,white_46%,transparent_47%)]
              [background-size:25px_25px]
            "
          />

          {/* ONE FOG LAYER */}

          <div
            className="
              learning-activity-motion
              absolute
              bottom-[-20px]
              left-[-15%]
              h-24
              w-[130%]
              animate-[activityFog_18s_ease-in-out_infinite]
              rounded-[50%]
              bg-slate-300/[0.02]
              blur-2xl
            "
          />

          {/* REDUCED SNOW */}

          <span
            className="
              learning-activity-motion
              absolute
              left-[18%]
              top-[8%]
              h-1
              w-1
              animate-[activitySnow_10s_linear_infinite]
              rounded-full
              bg-sky-100/30
            "
          />

          <span
            className="
              learning-activity-motion
              absolute
              right-[20%]
              top-[15%]
              h-1
              w-1
              animate-[activitySnow_12s_linear_infinite_2s]
              rounded-full
              bg-white/25
            "
          />

          {/* ONE EMBER */}

          <span
            className="
              learning-activity-motion
              absolute
              bottom-[20%]
              left-[25%]
              h-1
              w-1
              animate-[activityEmber_7s_ease-in-out_infinite]
              rounded-full
              bg-amber-400/50
            "
          />
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
            border-white/[0.07]
            px-5
            py-5
            sm:px-6
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                learning-activity-motion
                relative
                flex
                h-11
                w-11
                animate-[activityFloat_4s_ease-in-out_infinite]
                items-center
                justify-center
                rounded-xl
                border
                border-amber-500/20
                bg-amber-500/[0.07]
                transition-[transform,border-color]
                duration-200
                group-hover:scale-105
                group-hover:border-amber-500/40
              "
            >
              <BarChart3
                size={19}
                className="text-amber-400"
              />

              {/* STATIC DOT */}
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  h-2
                  w-2
                  rounded-full
                  bg-amber-400
                "
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="
                    m-0
                    text-base
                    font-black
                    uppercase
                    tracking-tight
                    text-white
                    sm:text-lg
                  "
                >
                  Weekly Chronicle
                </h2>

                <Swords
                  size={13}
                  className="hidden text-slate-400/50 sm:block"
                />
              </div>

              <p
                className="
                  m-0
                  mt-0.5
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.13em]
                  text-slate-500
                  sm:text-xs
                "
              >
                Your battles across the realm
              </p>
            </div>
          </div>

          {/* STATUS */}

          <div
            className="
              hidden
              items-center
              gap-1.5
              rounded-full
              border
              border-amber-500/20
              bg-amber-500/[0.06]
              px-3
              py-1.5
              sm:flex
            "
          >
            <Flame
              size={13}
              className="
                learning-activity-motion
                animate-[activityFlame_2.5s_ease-in-out_infinite]
                text-amber-400
              "
            />

            <span
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.16em]
                text-amber-400
              "
            >
              Realm Active
            </span>
          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="relative z-10 p-5 sm:p-6">
          {/* SUMMARY */}

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
            <div>
              <div className="flex items-center gap-2">
                <Sword
                  size={14}
                  className="text-sky-400/70"
                />

                <p
                  className="
                    m-0
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-slate-500
                  "
                >
                  Time in the realm
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

            {/* STATS */}

            <div className="flex flex-wrap gap-2">
              <div
                className="
                  group/stat
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-sky-500/20
                  bg-sky-500/[0.06]
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-sky-400
                  transition-transform
                  duration-200
                  hover:scale-105
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

              {activeDays > 0 && (
                <div
                  className="
                    group/stat
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-amber-500/20
                    bg-amber-500/[0.06]
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-amber-400
                    transition-transform
                    duration-200
                    hover:scale-105
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
              EMPTY / CHART
          ================================================= */}

          {normalizedActivity.length === 0 ? (
            <EmptyActivity />
          ) : (
            <>
              {/* CHART */}

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
                    (item, index) => (
                      <ActivityBar
                        key={`${item.day}-${index}`}
                        item={item}
                        maxHours={maxHours}
                        strongestDay={strongestDay}
                      />
                    )
                  )}
                </div>
              </div>

              {/* STRONGEST DAY */}

              {strongestDay &&
                strongestDay.hours > 0 && (
                  <div
                    className="
                      group/crown
                      relative
                      mt-7
                      flex
                      items-center
                      gap-3
                      overflow-hidden
                      rounded-2xl
                      border
                      border-amber-500/15
                      bg-gradient-to-r
                      from-amber-500/[0.07]
                      via-slate-500/[0.03]
                      to-transparent
                      p-4
                      transition-[border-color]
                      duration-200
                      hover:border-amber-500/30
                    "
                  >
                    {/* STATIC GLOW */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-10
                        top-1/2
                        h-20
                        w-20
                        -translate-y-1/2
                        rounded-full
                        bg-amber-500/[0.045]
                        blur-xl
                      "
                    />

                    {/* CROWN */}

                    <div
                      className="
                        learning-activity-motion
                        relative
                        flex
                        h-11
                        w-11
                        shrink-0
                        animate-[activityCrown_3.5s_ease-in-out_infinite]
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-amber-500/20
                        bg-amber-500/[0.07]
                      "
                    >
                      <Crown
                        size={21}
                        className="text-amber-400"
                        fill="currentColor"
                      />

                      <Sparkles
                        size={9}
                        className="
                          absolute
                          -right-1
                          -top-1
                          text-amber-300
                        "
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          m-0
                          text-sm
                          font-black
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
                        Your strongest learning battle —{" "}
                        {strongestDay.hours.toFixed(1)}{" "}
                        hours of study.
                      </p>
                    </div>

                    <Shield
                      size={21}
                      className="hidden text-slate-300/30 sm:block"
                    />
                  </div>
                )}
            </>
          )}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-amber-700
            to-transparent
            opacity-60
          "
        />

        <style>{ACTIVITY_STYLES}</style>
      </section>
    );
  }
);

LearningActivity.displayName = "LearningActivity";

export default LearningActivity;