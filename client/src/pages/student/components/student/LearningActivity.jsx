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
  Snowflake,
  Moon,
  Feather,
  Mountain,
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
        border-slate-700/50
        bg-[#07090b]
        shadow-2xl
        shadow-black/60
      "
    >
      {/* ================================================
          MEDIEVAL BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Stone base */}
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

        {/* Moon glow */}
        <div
          className="
            absolute
            right-[-60px]
            top-[-70px]
            h-56
            w-56
            rounded-full
            bg-slate-200/[0.035]
            blur-[45px]
            animate-pulse
          "
        />

        {/* Gold glow */}
        <div
          className="
            absolute
            left-[-100px]
            bottom-[-100px]
            h-72
            w-72
            rounded-full
            bg-amber-600/[0.04]
            blur-[90px]
          "
        />

        {/* Stone texture */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.04]
            [background-image:linear-gradient(135deg,transparent_45%,white_46%,transparent_47%)]
            [background-size:24px_24px]
          "
        />

        {/* Fog */}
        <div
          className="
            absolute
            bottom-0
            left-[-20%]
            h-24
            w-[140%]
            rounded-full
            bg-slate-200/[0.025]
            blur-3xl
            animate-[fogDrift_12s_ease-in-out_infinite]
          "
        />
      </div>

      <div className="relative z-10">
        {/* Header */}

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
              )
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fogDrift {
          0%, 100% {
            transform: translateX(-5%);
            opacity: .3;
          }

          50% {
            transform: translateX(5%);
            opacity: .6;
          }
        }
      `}</style>
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
        border-slate-700/40
        bg-black/30
        px-5
        text-center
      "
    >
      {/* Moon */}

      <div
        className="
          pointer-events-none
          absolute
          right-8
          top-6
          h-14
          w-14
          rounded-full
          bg-slate-200/[0.035]
          shadow-[0_0_40px_rgba(186,230,253,0.06)]
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

      {/* Floating flame */}

      <Flame
        size={20}
        className="
          absolute
          left-8
          top-8
          animate-[flameFlicker_1.8s_ease-in-out_infinite]
          text-amber-500/20
        "
      />

      {/* Sword */}

      <Sword
        size={22}
        className="
          absolute
          bottom-8
          right-8
          rotate-[-20deg]
          animate-[swordFloat_4s_ease-in-out_infinite]
          text-slate-300/20
        "
      />

      {/* Feather */}

      <Feather
        size={18}
        className="
          absolute
          left-20
          bottom-12
          animate-[featherFloat_6s_ease-in-out_infinite]
          text-sky-300/20
        "
      />

      {/* Sparkles */}

      <Sparkles
        size={16}
        className="
          absolute
          right-20
          top-12
          animate-pulse
          text-amber-400/20
        "
      />

      {/* Shield */}

      <div
        className="
          relative
          flex
          h-14
          w-14
          animate-[floatIcon_4s_ease-in-out_infinite]
          items-center
          justify-center
          rounded-2xl
          border
          border-amber-500/20
          bg-amber-500/[0.07]
          shadow-[0_0_35px_rgba(245,158,11,0.06)]
        "
      >
        <Shield
          size={24}
          className="
            text-amber-400
            drop-shadow-[0_0_9px_rgba(245,158,11,0.45)]
          "
        />

        <div
          className="
            absolute
            inset-0
            animate-ping
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
        border-slate-700/50
        bg-[#07090b]
        shadow-2xl
        shadow-black/60
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-amber-700/40
        hover:shadow-[0_30px_90px_rgba(0,0,0,0.65)]
      "
    >
      {/* =================================================
          CINEMATIC REALM BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Base */}

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

        {/* =============================================
            MOON
        ============================================== */}

        <div
          className="
            absolute
            right-[7%]
            top-[7%]
            h-24
            w-24
            rounded-full
            bg-slate-200/[0.035]
            shadow-[0_0_70px_rgba(186,230,253,0.06)]
            animate-[moonPulse_7s_ease-in-out_infinite]
          "
        >
          <div
            className="
              absolute
              inset-3
              rounded-full
              border
              border-slate-300/[0.04]
            "
          />
        </div>

        {/* =============================================
            CASTLE SILHOUETTE
        ============================================== */}

        <div
          className="
            absolute
            bottom-0
            left-0
            h-24
            w-full
            opacity-[0.16]
          "
        >
          <div className="absolute bottom-0 left-[5%] h-16 w-20 border-x border-t border-slate-500/20" />

          <div className="absolute bottom-0 left-[12%] h-24 w-7 border-x border-t border-slate-500/20" />

          <div className="absolute bottom-0 left-[18%] h-14 w-12 border-x border-t border-slate-500/20" />

          <div className="absolute bottom-0 right-[12%] h-20 w-9 border-x border-t border-slate-500/20" />

          <div className="absolute bottom-0 right-[5%] h-14 w-16 border-x border-t border-slate-500/20" />

          <Castle
            size={75}
            className="
              absolute
              bottom-[-5px]
              left-1/2
              -translate-x-1/2
              text-slate-400/[0.08]
            "
          />
        </div>

        {/* =============================================
            MOUNTAINS
        ============================================== */}

        <div
          className="
            absolute
            bottom-0
            left-[-5%]
            h-20
            w-[110%]
            opacity-[0.07]
          "
        >
          <Mountain
            size={180}
            className="
              absolute
              bottom-[-45px]
              left-[8%]
            "
          />

          <Mountain
            size={150}
            className="
              absolute
              bottom-[-50px]
              right-[10%]
            "
          />
        </div>

        {/* =============================================
            GOLDEN TORCH GLOW
        ============================================== */}

        <div
          className="
            absolute
            -left-28
            -bottom-28
            h-80
            w-80
            rounded-full
            bg-amber-700/[0.07]
            blur-[100px]
            transition-all
            duration-1000
            group-hover:scale-125
            group-hover:bg-amber-600/[0.11]
          "
        />

        {/* =============================================
            ICE GLOW
        ============================================== */}

        <div
          className="
            absolute
            -right-28
            -top-28
            h-80
            w-80
            rounded-full
            bg-sky-800/[0.08]
            blur-[110px]
            transition-all
            duration-1000
            group-hover:scale-125
          "
        />

        {/* =============================================
            STONE TEXTURE
        ============================================== */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.045]
            [background-image:linear-gradient(135deg,transparent_45%,white_46%,transparent_47%),linear-gradient(45deg,transparent_45%,white_46%,transparent_47%)]
            [background-size:25px_25px]
          "
        />

        {/* =============================================
            FOG
        ============================================== */}

        <div
          className="
            absolute
            bottom-[-20px]
            left-[-20%]
            h-28
            w-[140%]
            rounded-[50%]
            bg-slate-300/[0.025]
            blur-3xl
            animate-[fogDrift_14s_ease-in-out_infinite]
          "
        />

        {/* =============================================
            SNOW
        ============================================== */}

        <span className="absolute left-[8%] top-[18%] h-1 w-1 rounded-full bg-sky-100/40 animate-[snowFall_8s_linear_infinite]" />

        <span className="absolute left-[22%] top-[8%] h-1 w-1 rounded-full bg-white/30 animate-[snowFall_11s_linear_infinite_1s]" />

        <span className="absolute left-[40%] top-[25%] h-1.5 w-1.5 rounded-full bg-sky-100/30 animate-[snowFall_9s_linear_infinite_2s]" />

        <span className="absolute right-[28%] top-[12%] h-1 w-1 rounded-full bg-white/35 animate-[snowFall_10s_linear_infinite_1.5s]" />

        <span className="absolute right-[12%] top-[30%] h-1.5 w-1.5 rounded-full bg-sky-100/30 animate-[snowFall_12s_linear_infinite_3s]" />

        {/* =============================================
            EMBERS
        ============================================== */}

        <span className="absolute left-[15%] bottom-[20%] h-1 w-1 rounded-full bg-amber-400/60 animate-[emberFloat_5s_ease-in-out_infinite]" />

        <span className="absolute left-[32%] bottom-[18%] h-1.5 w-1.5 rounded-full bg-amber-300/50 animate-[emberFloat_6s_ease-in-out_infinite_1s]" />

        <span className="absolute right-[18%] bottom-[25%] h-1 w-1 rounded-full bg-orange-400/50 animate-[emberFloat_7s_ease-in-out_infinite_2s]" />

        {/* =============================================
            CINEMATIC LIGHT SWEEP
        ============================================== */}

        <div
          className="
            absolute
            left-[-30%]
            top-0
            h-full
            w-[25%]
            -skew-x-12
            bg-gradient-to-r
            from-transparent
            via-amber-300/[0.025]
            to-transparent
            transition-all
            duration-[1800ms]
            group-hover:left-[120%]
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

          {/* Chronicle icon */}

          <div
            className="
              relative
              flex
              h-11
              w-11
              animate-[iconFloat_4s_ease-in-out_infinite]
              items-center
              justify-center
              rounded-xl
              border
              border-amber-500/20
              bg-amber-500/[0.07]
              shadow-[0_0_30px_rgba(245,158,11,0.07)]
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:border-amber-500/40
            "
          >
            <BarChart3
              size={19}
              className="
                text-amber-400
                drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]
              "
            />

            {/* Crown dot */}

            <span
              className="
                absolute
                -right-1
                -top-1
                h-2
                w-2
                animate-pulse
                rounded-full
                bg-amber-400
                shadow-[0_0_10px_rgba(245,158,11,0.9)]
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
                className="
                  hidden
                  animate-[swordFloat_4s_ease-in-out_infinite]
                  text-slate-400/60
                  sm:block
                "
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

        {/* Realm status */}

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
            shadow-[0_0_20px_rgba(245,158,11,0.06)]
            sm:flex
          "
        >
          <Flame
            size={13}
            className="
              animate-[flameFlicker_1.4s_ease-in-out_infinite]
              text-amber-400
              drop-shadow-[0_0_6px_rgba(245,158,11,0.7)]
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
                className="
                  animate-[swordFloat_3.5s_ease-in-out_infinite]
                  text-sky-400/70
                  drop-shadow-[0_0_7px_rgba(56,189,248,0.5)]
                "
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
                  drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]
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
                transition-all
                duration-300
                hover:scale-105
              "
            >
              <Clock3
                size={13}
                className="
                  transition-transform
                  duration-300
                  group-hover/stat:rotate-12
                "
              />

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
                  transition-all
                  duration-300
                  hover:scale-105
                "
              >
                <TrendingUp
                  size={13}
                  className="
                    transition-transform
                    duration-300
                    group-hover/stat:-translate-y-0.5
                  "
                />

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
                            size={14}
                            className={`
                              ${
                                isStrongest
                                  ? "animate-[crownFloat_2.5s_ease-in-out_infinite]"
                                  : ""
                              }
                              text-amber-400
                              drop-shadow-[0_0_7px_rgba(245,158,11,0.8)]
                            `}
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
                            transition-all
                            duration-300
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
                            transition-all
                            duration-300
                            group-hover/bar:border-amber-700/40
                          "
                        >

                          {/* Stone pattern */}

                          <div
                            className="
                              absolute
                              inset-0
                              opacity-30
                              [background-image:linear-gradient(135deg,transparent_45%,white_46%,transparent_47%)]
                              [background-size:9px_9px]
                            "
                          />

                          {/* Actual bar */}

                          <div
                            className={`
                              relative
                              w-full
                              rounded-t-lg
                              bg-gradient-to-t
                              from-[#15191c]
                              via-[#37434a]
                              to-amber-400
                              shadow-lg
                              transition-all
                              duration-1000
                              ease-out
                              ${
                                isStrongest
                                  ? "shadow-amber-500/40"
                                  : "shadow-black/40"
                              }
                            `}
                            style={{
                              height: `${height}%`,
                            }}
                          >

                            {/* Gold edge */}

                            <div
                              className="
                                absolute
                                left-0
                                right-0
                                top-0
                                h-px
                                bg-amber-300/90
                                shadow-[0_0_8px_rgba(252,211,77,0.8)]
                              "
                            />

                            {/* Moving shine */}

                            <div
                              className="
                                absolute
                                left-0
                                top-0
                                h-full
                                w-full
                                -translate-y-full
                                bg-gradient-to-b
                                from-white/20
                                via-transparent
                                to-transparent
                                transition-transform
                                duration-700
                                group-hover/bar:translate-y-full
                              "
                            />

                            {/* Ice highlight */}

                            <div
                              className="
                                absolute
                                bottom-0
                                left-1/2
                                h-1/2
                                w-px
                                -translate-x-1/2
                                bg-sky-300/20
                                blur-sm
                              "
                            />
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
                            transition-colors
                            duration-300
                            group-hover/bar:text-slate-200
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
                    transition-all
                    duration-300
                    hover:border-amber-500/30
                  "
                >

                  {/* Animated glow */}

                  <div
                    className="
                      absolute
                      -right-10
                      top-1/2
                      h-24
                      w-24
                      -translate-y-1/2
                      animate-pulse
                      rounded-full
                      bg-amber-500/[0.05]
                      blur-2xl
                    "
                  />

                  {/* Crown */}

                  <div
                    className="
                      relative
                      flex
                      h-11
                      w-11
                      shrink-0
                      animate-[crownFloat_3s_ease-in-out_infinite]
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-amber-500/20
                      bg-amber-500/[0.07]
                      shadow-[0_0_25px_rgba(245,158,11,0.08)]
                    "
                  >
                    <Crown
                      size={21}
                      className="
                        text-amber-400
                        drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]
                      "
                      fill="currentColor"
                    />

                    <Sparkles
                      size={10}
                      className="
                        absolute
                        -right-1
                        -top-1
                        animate-ping
                        text-amber-300
                      "
                    />
                  </div>

                  {/* Text */}

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
                      Your strongest learning battle —
                      {" "}
                      {strongestDay.hours.toFixed(1)}
                      {" "}
                      hours of study.
                    </p>
                  </div>

                  {/* Shield */}

                  <div className="relative hidden sm:block">

                    <Shield
                      size={21}
                      className="
                        animate-[shieldPulse_3s_ease-in-out_infinite]
                        text-slate-300/40
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        animate-ping
                        rounded-full
                        bg-amber-500/[0.07]
                      "
                    />
                  </div>
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
          absolute
          bottom-0
          left-0
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-amber-700
          to-transparent
          opacity-70
        "
      />

      {/* Animated footer scanner */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-[-20%]
          h-px
          w-[20%]
          bg-amber-300
          shadow-[0_0_12px_rgba(245,158,11,0.8)]
          transition-all
          duration-[1600ms]
          group-hover:left-[100%]
        "
      />

      {/* =================================================
          ANIMATIONS
      ================================================= */}

      <style>{`

        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-4px) rotate(1deg);
          }
        }

        @keyframes floatIcon {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes swordFloat {
          0%, 100% {
            transform: translateY(0) rotate(-20deg);
          }

          50% {
            transform: translateY(-5px) rotate(-12deg);
          }
        }

        @keyframes crownFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-5px) rotate(3deg);
          }
        }

        @keyframes shieldPulse {
          0%, 100% {
            transform: scale(1);
            opacity: .45;
          }

          50% {
            transform: scale(1.12);
            opacity: .8;
          }
        }

        @keyframes flameFlicker {
          0%, 100% {
            transform: scale(1) rotate(-2deg);
            opacity: .8;
          }

          25% {
            transform: scale(1.08) rotate(2deg);
            opacity: 1;
          }

          50% {
            transform: scale(.94) rotate(-3deg);
            opacity: .7;
          }

          75% {
            transform: scale(1.05) rotate(3deg);
            opacity: .95;
          }
        }

        @keyframes emberFloat {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }

          20% {
            opacity: .7;
          }

          50% {
            transform: translateY(-25px) translateX(8px);
            opacity: .5;
          }

          80% {
            opacity: .3;
          }

          100% {
            transform: translateY(-55px) translateX(-5px);
            opacity: 0;
          }
        }

        @keyframes snowFall {
          0% {
            transform: translateY(-20px) translateX(0);
            opacity: 0;
          }

          15% {
            opacity: .7;
          }

          50% {
            transform: translateY(90px) translateX(15px);
            opacity: .5;
          }

          100% {
            transform: translateY(190px) translateX(-10px);
            opacity: 0;
          }
        }

        @keyframes fogDrift {
          0%, 100% {
            transform: translateX(-5%);
            opacity: .25;
          }

          50% {
            transform: translateX(5%);
            opacity: .55;
          }
        }

        @keyframes moonPulse {
          0%, 100% {
            transform: scale(1);
            opacity: .7;
          }

          50% {
            transform: scale(1.04);
            opacity: 1;
          }
        }

        @keyframes featherFloat {
          0%, 100% {
            transform: translateY(0) rotate(-10deg);
          }

          50% {
            transform: translateY(-10px) rotate(8deg);
          }
        }

      `}</style>
    </section>
  );
}

export default LearningActivity;