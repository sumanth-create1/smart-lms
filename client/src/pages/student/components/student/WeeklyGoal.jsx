import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowUpRight,
  Clock3,
  Crown,
  Feather,
  Flame,
  RefreshCw,
  Shield,
  Sword,
  Trophy,
  Castle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../../services/api";

/* =========================================================
   CONSTANTS
========================================================= */

const PROGRESS_RADIUS = 48;
const PROGRESS_CIRCUMFERENCE =
  2 * Math.PI * PROGRESS_RADIUS;

const WEEKLY_GRADIENT_ID = "weeklyRealmGradient";

const clampPercentage = (value) =>
  Math.min(Math.max(Math.round(value), 0), 100);

const getSafeNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(number, 0)
    : 0;
};

/* =========================================================
   MOTIVATION
========================================================= */

const getMotivation = (percentage) => {
  if (percentage >= 100) {
    return {
      title: "The quest is complete.",
      description:
        "Your weekly oath has been fulfilled. Honor earned.",
      icon: "👑",
    };
  }

  if (percentage >= 75) {
    return {
      title: "The throne is within reach.",
      description:
        "The final battle approaches. Finish the quest.",
      icon: "⚔️",
    };
  }

  if (percentage >= 50) {
    return {
      title: "Your strength grows.",
      description:
        "Half the journey is behind you. Hold the line.",
      icon: "🔥",
    };
  }

  if (percentage > 0) {
    return {
      title: "The journey has begun.",
      description:
        "Every lesson strengthens your claim to the throne.",
      icon: "🐺",
    };
  }

  return {
    title: "The realm awaits.",
    description:
      "Choose your path and begin your journey.",
    icon: "🏰",
  };
};

/* =========================================================
   LOADING SCREEN
========================================================= */

const WeeklyGoalLoading = memo(function WeeklyGoalLoading() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading weekly quest"
      className="
        relative
        min-h-[500px]
        overflow-hidden
        rounded-[28px]
        border
        border-[#39352d]
        bg-[#080a0c]
        shadow-2xl
        shadow-black/60
      "
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Base */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#080a0c]
            via-[#111417]
            to-[#17130d]
          "
        />

        {/* Static moon glow */}
        <div
          className="
            absolute
            -right-24
            -top-24
            h-80
            w-80
            rounded-full
            bg-[#d6c38a]/10
            blur-[70px]
          "
        />

        {/* Static ice glow */}
        <div
          className="
            absolute
            -bottom-28
            -left-24
            h-80
            w-80
            rounded-full
            bg-[#8eb6c7]/10
            blur-[70px]
          "
        />

        {/* Texture */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)]
            [background-size:14px_14px]
          "
        />

        {/* Cracks */}
        <div
          className="
            absolute
            left-[12%]
            top-0
            h-full
            w-px
            rotate-[12deg]
            bg-gradient-to-b
            from-transparent
            via-white/[0.04]
            to-transparent
          "
        />

        <div
          className="
            absolute
            right-[20%]
            top-0
            h-full
            w-px
            -rotate-[18deg]
            bg-gradient-to-b
            from-transparent
            via-[#d6c38a]/[0.05]
            to-transparent
          "
        />

        {/* Castle */}
        <div
          className="
            absolute
            bottom-0
            right-0
            opacity-[0.035]
          "
        >
          <Castle
            size={250}
            strokeWidth={0.7}
          />
        </div>
      </div>

      {/* Loading */}
      <div
        className="
          relative
          z-10
          flex
          min-h-[500px]
          items-center
          justify-center
        "
      >
        <div className="text-center">
          <div
            className="
              relative
              mx-auto
              mb-5
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border
              border-[#9c8350]/50
              bg-[#17130d]
              text-[#d6c38a]
              shadow-[0_0_25px_rgba(156,131,80,0.12)]
            "
          >
            <Crown
              size={25}
              className="text-[#d6c38a]"
            />

            <span
              className="
                absolute
                -right-1
                -top-1
                h-2
                w-2
                rounded-full
                bg-[#d6c38a]
                shadow-[0_0_8px_rgba(214,195,138,0.6)]
              "
            />
          </div>

          <p
            className="
              m-0
              text-sm
              font-black
              uppercase
              tracking-[0.22em]
              text-[#d8d5cc]
            "
          >
            Summoning the Maester
          </p>

          <p
            className="
              m-0
              mt-2
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#77746c]
            "
          >
            Reading the weekly record
          </p>
        </div>
      </div>
    </section>
  );
});

/* =========================================================
   MAIN COMPONENT
========================================================= */

function WeeklyGoal({
  weeklyGoal: initialWeeklyGoal,
}) {
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [weeklyGoal, setWeeklyGoal] = useState(
    initialWeeklyGoal ?? null
  );

  const [loading, setLoading] = useState(
    !initialWeeklyGoal
  );

  const [refreshing, setRefreshing] = useState(false);

  /* =======================================================
     FETCH
  ======================================================= */

  const fetchWeeklyGoal = useCallback(
    async ({
      showRefreshState = true,
      signal,
    } = {}) => {
      if (showRefreshState) {
        setRefreshing(true);
      }

      try {
        const response = await api.get(
          "/dashboard/student",
          signal
            ? { signal }
            : undefined
        );

        if (signal?.aborted) return;

        const dashboardData =
          response?.data?.dashboard ??
          response?.data?.data ??
          response?.data;

        const nextWeeklyGoal =
          dashboardData?.weeklyGoal;

        if (nextWeeklyGoal) {
          setWeeklyGoal(nextWeeklyGoal);
        }
      } catch (error) {
        if (signal?.aborted) return;

        console.error(
          "Failed to fetch weekly goal:",
          error
        );

        toast.error(
          "Unable to refresh your weekly quest."
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    []
  );

  /* =======================================================
     INITIAL FETCH
  ======================================================= */

  useEffect(() => {
    if (initialWeeklyGoal) {
      setWeeklyGoal(initialWeeklyGoal);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    fetchWeeklyGoal({
      showRefreshState: false,
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [initialWeeklyGoal, fetchWeeklyGoal]);

  /* =======================================================
     DATA
  ======================================================= */

  const {
    targetHours,
    completedHours,
    percentage,
    remainingHours,
    progressOffset,
    motivation,
  } = useMemo(() => {
    const target = getSafeNumber(
      weeklyGoal?.targetHours
    );

    const completed = getSafeNumber(
      weeklyGoal?.completedHours
    );

    const backendPercentage = Number(
      weeklyGoal?.percentage
    );

    const calculatedPercentage =
      Number.isFinite(backendPercentage)
        ? clampPercentage(backendPercentage)
        : target > 0
          ? clampPercentage(
              (completed / target) * 100
            )
          : 0;

    const remaining = Math.max(
      target - completed,
      0
    );

    const offset =
      PROGRESS_CIRCUMFERENCE -
      (calculatedPercentage / 100) *
        PROGRESS_CIRCUMFERENCE;

    return {
      targetHours: target,
      completedHours: completed,
      percentage: calculatedPercentage,
      remainingHours: remaining,
      progressOffset: offset,
      motivation:
        getMotivation(calculatedPercentage),
    };
  }, [weeklyGoal]);

  /* =======================================================
     ACTIONS
  ======================================================= */

  const handleContinueLearning = useCallback(() => {
    navigate("/courses");
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    if (refreshing) return;

    fetchWeeklyGoal({
      showRefreshState: true,
    });
  }, [fetchWeeklyGoal, refreshing]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return <WeeklyGoalLoading />;
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <section
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-[#39352d]
        bg-[#080a0c]
        shadow-2xl
        shadow-black/60
        transition-[transform,border-color,box-shadow]
        duration-300
        hover:-translate-y-1
        hover:border-[#8d7648]/70
        hover:shadow-[0_25px_70px_rgba(0,0,0,0.6)]
      "
    >
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Base */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#07090b]
            via-[#101316]
            to-[#17120c]
          "
        />

        {/* Golden moon */}
        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-96
            w-96
            rounded-full
            bg-[#d6c38a]/10
            blur-[80px]
            transition-[transform,opacity]
            duration-500
            group-hover:scale-110
            group-hover:opacity-90
          "
        />

        {/* Northern ice */}
        <div
          className="
            pointer-events-none
            absolute
            -bottom-36
            -left-28
            h-96
            w-96
            rounded-full
            bg-[#8eb6c7]/10
            blur-[80px]
          "
        />

        {/* Fire — static instead of continuous animation */}
        <div
          className="
            pointer-events-none
            absolute
            bottom-[20%]
            right-[10%]
            h-48
            w-48
            rounded-full
            bg-[#8f2d20]/10
            blur-[65px]
          "
        />

        {/* Stone texture */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.035]
            [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)]
            [background-size:14px_14px]
          "
        />

        {/* Diagonal texture */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.015]
            [background-image:linear-gradient(125deg,transparent_45%,white_46%,transparent_47%)]
            [background-size:24px_24px]
          "
        />

        {/* Cracks */}
        <div
          className="
            pointer-events-none
            absolute
            left-[12%]
            top-[-15%]
            h-[130%]
            w-px
            rotate-[13deg]
            bg-gradient-to-b
            from-transparent
            via-white/[0.04]
            to-transparent
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-[18%]
            top-[-15%]
            h-[130%]
            w-px
            -rotate-[16deg]
            bg-gradient-to-b
            from-transparent
            via-[#d6c38a]/[0.07]
            to-transparent
          "
        />

        {/* Castle */}
        <div
          className="
            pointer-events-none
            absolute
            bottom-[-35px]
            right-[-10px]
            opacity-[0.035]
            transition-[transform,opacity]
            duration-500
            group-hover:scale-105
            group-hover:opacity-[0.06]
          "
        >
          <Castle
            size={280}
            strokeWidth={0.55}
          />
        </div>

        {/* Mountains */}
        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            right-0
            h-28
            opacity-[0.025]
          "
          style={{
            clipPath:
              "polygon(0 100%, 0 72%, 10% 58%, 18% 78%, 28% 42%, 39% 74%, 52% 48%, 63% 75%, 74% 40%, 86% 70%, 100% 50%, 100% 100%)",
            background:
              "linear-gradient(to top, #d6c38a, transparent)",
          }}
        />

        {/* Static snow */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
          "
        >
          <span className="absolute left-[8%] top-[15%] h-1 w-1 rounded-full bg-white/25" />
          <span className="absolute left-[20%] top-[5%] h-1 w-1 rounded-full bg-white/15" />
          <span className="absolute left-[42%] top-[22%] h-1 w-1 rounded-full bg-white/20" />
          <span className="absolute right-[28%] top-[8%] h-1 w-1 rounded-full bg-white/25" />
          <span className="absolute right-[12%] top-[30%] h-1 w-1 rounded-full bg-white/15" />
        </div>

        {/* Atmospheric line */}
        <div
          className="
            absolute
            left-0
            top-20
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-[#9c8350]/25
            to-transparent
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
          {/* Crown */}
          <div
            className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-[#806a42]/60
              bg-[#211b11]/70
              text-[#d6c38a]
              shadow-[0_0_20px_rgba(156,131,80,0.12)]
              transition-[transform,border-color,box-shadow]
              duration-300
              group-hover:scale-105
              group-hover:border-[#b69a5f]/80
            "
          >
            <Crown
              size={21}
              className="
                text-[#d6c38a]
                drop-shadow-[0_0_6px_rgba(214,195,138,0.35)]
              "
            />

            <span
              className="
                absolute
                -right-1
                -top-1
                h-2
                w-2
                rounded-full
                bg-[#d6c38a]
                shadow-[0_0_8px_rgba(214,195,138,0.7)]
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
                  text-[#eeeae0]
                  sm:text-lg
                "
              >
                Weekly Quest
              </h2>

              <span
                className="
                  hidden
                  rounded
                  border
                  border-[#806a42]/50
                  bg-[#211b11]/50
                  px-1.5
                  py-0.5
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-[#c9ad70]
                  sm:inline-block
                "
              >
                Active
              </span>
            </div>

            <p
              className="
                m-0
                mt-0.5
                text-[9px]
                font-bold
                uppercase
                tracking-[0.14em]
                text-[#77746c]
                sm:text-[10px]
              "
            >
              Your oath. Your realm. Your progress.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <div
            className="
              hidden
              items-center
              gap-1.5
              rounded-full
              border
              border-white/[0.08]
              bg-white/[0.025]
              px-3
              py-1.5
              sm:flex
            "
          >
            <Feather
              size={12}
              className="text-[#8eb6c7]"
            />

            <span
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.16em]
                text-[#77746c]
              "
            >
              Raven · Active
            </span>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh weekly quest"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.025]
              text-[#77746c]
              transition-[border-color,background-color,color]
              duration-200
              hover:border-[#806a42]/60
              hover:bg-[#211b11]/50
              hover:text-[#d6c38a]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "animate-spin"
                  : undefined
              }
            />
          </button>
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          relative
          z-10
          p-5
          sm:p-6
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            gap-7
          "
        >
          {/* =================================================
              PROGRESS CIRCLE
          ================================================= */}

          <div
            className="
              relative
              h-48
              w-48
            "
          >
            {/* Static glow */}
            <div
              aria-hidden="true"
              className="
                absolute
                inset-3
                rounded-full
                bg-[#d6c38a]/10
                blur-xl
                transition-[background-color]
                duration-300
                group-hover:bg-[#d6c38a]/15
              "
            />

            {/* Static inner glow */}
            <div
              aria-hidden="true"
              className="
                absolute
                inset-8
                rounded-full
                bg-[#8eb6c7]/5
                blur-lg
              "
            />

            {/* Outer border */}
            <div
              aria-hidden="true"
              className="
                absolute
                inset-0
                rounded-full
                border
                border-[#806a42]/25
              "
            />

            {/* Inner border */}
            <div
              aria-hidden="true"
              className="
                absolute
                inset-4
                rounded-full
                border
                border-white/[0.035]
              "
            />

            {/* SVG */}
            <svg
              className="
                relative
                h-full
                w-full
                -rotate-90
              "
              viewBox="0 0 120 120"
              role="progressbar"
              aria-label={`Weekly quest progress: ${percentage}%`}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={percentage}
            >
              <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                strokeDasharray="2 4"
                className="text-[#d6c38a]/25"
              />

              <circle
                cx="60"
                cy="60"
                r={PROGRESS_RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="9"
                className="text-[#25272a]"
              />

              <circle
                cx="60"
                cy="60"
                r={PROGRESS_RADIUS}
                fill="none"
                stroke={`url(#${WEEKLY_GRADIENT_ID})`}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={
                  PROGRESS_CIRCUMFERENCE
                }
                strokeDashoffset={progressOffset}
                className="
                  transition-[stroke-dashoffset]
                  duration-500
                  ease-out
                "
              />

              <defs>
                <linearGradient
                  id={WEEKLY_GRADIENT_ID}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="#5f4b29"
                  />

                  <stop
                    offset="35%"
                    stopColor="#8f7443"
                  />

                  <stop
                    offset="70%"
                    stopColor="#d6c38a"
                  />

                  <stop
                    offset="100%"
                    stopColor="#f1dfaa"
                  />
                </linearGradient>
              </defs>
            </svg>

            {/* Crosshair */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <div className="h-px w-28 bg-[#d6c38a]/10" />
              <div className="absolute h-28 w-px bg-[#d6c38a]/10" />
            </div>

            {/* Center */}
            <div
              className="
                absolute
                inset-0
                flex
                flex-col
                items-center
                justify-center
              "
            >
              <span
                className="
                  text-4xl
                  font-black
                  tracking-tight
                  text-[#eeeae0]
                "
              >
                {percentage}%
              </span>

              <span
                className="
                  mt-0.5
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.22em]
                  text-[#77746c]
                "
              >
                Quest Progress
              </span>
            </div>

            {/* Motivation badge */}
            <div
              aria-hidden="true"
              className="
                absolute
                -right-2
                top-5
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-[#806a42]/60
                bg-[#090b0d]
                text-lg
                shadow-xl
                shadow-black/50
              "
            >
              {motivation.icon}
            </div>

            {/* Crown */}
            <div
              aria-hidden="true"
              className="
                absolute
                left-1/2
                top-0
                flex
                h-5
                w-5
                -translate-x-1/2
                items-center
                justify-center
                rounded-full
                border
                border-[#d6c38a]/40
                bg-[#211b11]
                text-[#d6c38a]
                shadow-[0_0_10px_rgba(214,195,138,0.3)]
              "
            >
              <Crown size={9} />
            </div>
          </div>

          {/* =================================================
              HOURS
          ================================================= */}

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Clock3
                size={17}
                className="text-[#d6c38a]"
              />

              <span
                className="
                  text-2xl
                  font-black
                  tracking-tight
                  text-[#eeeae0]
                "
              >
                {completedHours.toFixed(1)}
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-[#77746c]
                "
              >
                / {targetHours} hrs
              </span>
            </div>

            <p
              className="
                m-0
                mt-1
                text-[9px]
                font-black
                uppercase
                tracking-[0.12em]
                text-[#66635d]
              "
            >
              {percentage >= 100
                ? "The oath has been fulfilled"
                : `${remainingHours.toFixed(
                    1
                  )} hours until the quest is complete`}
            </p>
          </div>

          {/* =================================================
              MOTIVATION
          ================================================= */}

          <div
            className="
              relative
              w-full
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.08]
              bg-black/30
              p-4
              shadow-inner
              transition-[border-color,background-color]
              duration-300
              group-hover:border-[#806a42]/40
              group-hover:bg-[#211b11]/10
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute
                bottom-0
                left-0
                top-0
                w-[2px]
                bg-gradient-to-b
                from-[#d6c38a]
                via-[#806a42]
                to-transparent
              "
            />

            <div
              aria-hidden="true"
              className="
                absolute
                right-0
                top-0
                h-px
                w-1/2
                bg-gradient-to-l
                from-transparent
                via-[#8eb6c7]/20
                to-transparent
              "
            />

            <div className="flex items-center gap-3">
              <div
                className="
                  relative
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#806a42]/50
                  bg-[#211b11]/50
                  text-[#d6c38a]
                  shadow-lg
                  shadow-black/30
                "
              >
                {percentage >= 100 ? (
                  <Trophy size={19} />
                ) : (
                  <Crown size={19} />
                )}

                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    h-2
                    w-2
                    rounded-full
                    bg-[#d6c38a]
                    shadow-[0_0_8px_rgba(214,195,138,0.7)]
                  "
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    m-0
                    text-sm
                    font-black
                    uppercase
                    tracking-tight
                    text-[#eeeae0]
                  "
                >
                  {motivation.title}
                </p>

                <p
                  className="
                    m-0
                    mt-1
                    text-xs
                    leading-5
                    text-[#85827a]
                  "
                >
                  {motivation.description}
                </p>
              </div>

              <ArrowUpRight
                size={18}
                className="
                  shrink-0
                  text-[#55534e]
                  transition-[transform,color]
                  duration-200
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                  group-hover:text-[#d6c38a]
                "
              />
            </div>
          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div
            className="
              grid
              w-full
              grid-cols-2
              gap-3
            "
          >
            {/* Quest time */}
            <div
              className="
                relative
                overflow-hidden
                rounded-xl
                border
                border-white/[0.08]
                bg-black/25
                px-3
                py-3
                transition-[transform,border-color,background-color]
                duration-200
                hover:-translate-y-0.5
                hover:border-[#806a42]/50
                hover:bg-[#211b11]/10
              "
            >
              <div className="flex items-center gap-2">
                <Flame
                  size={14}
                  className="text-[#b34b35]"
                />

                <span
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-[#77746c]
                  "
                >
                  Quest Time
                </span>
              </div>

              <p
                className="
                  m-0
                  mt-1
                  text-sm
                  font-black
                  text-[#eeeae0]
                "
              >
                {completedHours.toFixed(1)} hrs
              </p>

              <div
                aria-hidden="true"
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  bg-gradient-to-r
                  from-[#806a42]
                  to-[#d6c38a]
                "
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>

            {/* Weekly oath */}
            <div
              className="
                relative
                overflow-hidden
                rounded-xl
                border
                border-white/[0.08]
                bg-black/25
                px-3
                py-3
                transition-[transform,border-color,background-color]
                duration-200
                hover:-translate-y-0.5
                hover:border-[#8eb6c7]/40
                hover:bg-[#8eb6c7]/[0.04]
              "
            >
              <div className="flex items-center gap-2">
                <Shield
                  size={14}
                  className="text-[#8eb6c7]"
                />

                <span
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-[#77746c]
                  "
                >
                  Weekly Oath
                </span>
              </div>

              <p
                className="
                  m-0
                  mt-1
                  text-sm
                  font-black
                  text-[#eeeae0]
                "
              >
                {targetHours} hrs
              </p>

              <div
                aria-hidden="true"
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  w-full
                  bg-[#25282a]
                "
              />
            </div>
          </div>

          {/* =================================================
              CONTINUE
          ================================================= */}

          <button
            type="button"
            onClick={handleContinueLearning}
            className="
              group/quest
              relative
              flex
              w-full
              items-center
              justify-center
              gap-2
              overflow-hidden
              rounded-xl
              border
              border-[#8d7648]/60
              bg-gradient-to-r
              from-[#3c2d17]
              via-[#806a42]
              to-[#3c2d17]
              px-4
              py-3
              text-xs
              font-black
              uppercase
              tracking-[0.17em]
              text-[#fff8e5]
              shadow-lg
              shadow-black/40
              transition-[transform,border-color,box-shadow]
              duration-200
              hover:-translate-y-0.5
              hover:border-[#d6c38a]/70
              hover:shadow-[0_0_30px_rgba(156,131,80,0.2)]
              active:translate-y-0
            "
          >
            {/* Lightweight sweep */}
            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-y-0
                -left-24
                w-16
                skew-x-[-20deg]
                bg-white/10
                blur-sm
                transition-[left]
                duration-500
                group-hover/quest:left-[110%]
              "
            />

            <Sword
              size={15}
              className="
                relative
                z-10
                transition-transform
                duration-200
                group-hover/quest:rotate-12
              "
            />

            <span className="relative z-10">
              Continue The Quest
            </span>

            <ArrowUpRight
              size={15}
              className="
                relative
                z-10
                transition-transform
                duration-200
                group-hover/quest:-translate-y-0.5
                group-hover/quest:translate-x-0.5
              "
            />
          </button>
        </div>
      </div>

      {/* =================================================
          FOOTER LINE
      ================================================= */}

      <div
        aria-hidden="true"
        className="
          absolute
          bottom-0
          left-0
          h-[2px]
          w-full
          bg-gradient-to-r
          from-transparent
          via-[#9c8350]
          to-transparent
          opacity-80
        "
      />

      {/* =================================================
          HOVER SCANNER

          Much smaller + no large blur.
      ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-y-0
          -left-32
          w-16
          skew-x-[-20deg]
          bg-[#d6c38a]/[0.07]
          transition-[left]
          duration-[1400ms]
          group-hover:left-[110%]
        "
      />
    </section>
  );
}

export default memo(WeeklyGoal);