import { useEffect, useMemo, useState } from "react";
import {
  Target,
  Clock3,
  ArrowUpRight,
  Flame,
  Zap,
  Trophy,
  RefreshCw,
  Crosshair,
  Shield,
  Swords,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../../services/api";

function WeeklyGoal({ weeklyGoal: initialWeeklyGoal }) {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [weeklyGoal, setWeeklyGoal] = useState(
    initialWeeklyGoal || null
  );

  const [loading, setLoading] = useState(
    !initialWeeklyGoal
  );

  const [refreshing, setRefreshing] = useState(false);

  // =====================================================
  // FETCH WEEKLY GOAL
  // =====================================================

  const fetchWeeklyGoal = async () => {
    try {
      setRefreshing(true);

      const response = await api.get("/dashboard/student");

      const dashboardData =
        response?.data?.dashboard ||
        response?.data?.data ||
        response?.data;

      if (dashboardData?.weeklyGoal) {
        setWeeklyGoal(dashboardData.weeklyGoal);
      }
    } catch (error) {
      console.error(
        "Failed to fetch weekly goal:",
        error
      );

      toast.error(
        "Unable to refresh your weekly mission."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (!initialWeeklyGoal) {
      fetchWeeklyGoal();
    }
  }, []);

  // =====================================================
  // UPDATE WHEN PARENT DATA CHANGES
  // =====================================================

  useEffect(() => {
    if (initialWeeklyGoal) {
      setWeeklyGoal(initialWeeklyGoal);
    }
  }, [initialWeeklyGoal]);

  // =====================================================
  // DATA
  // =====================================================

  const targetHours = useMemo(() => {
    const value = Number(
      weeklyGoal?.targetHours ?? 0
    );

    return Number.isFinite(value)
      ? Math.max(value, 0)
      : 0;
  }, [weeklyGoal]);

  const completedHours = useMemo(() => {
    const value = Number(
      weeklyGoal?.completedHours ?? 0
    );

    return Number.isFinite(value)
      ? Math.max(value, 0)
      : 0;
  }, [weeklyGoal]);

  const percentage = useMemo(() => {
    const backendPercentage = Number(
      weeklyGoal?.percentage
    );

    if (Number.isFinite(backendPercentage)) {
      return Math.min(
        Math.max(Math.round(backendPercentage), 0),
        100
      );
    }

    if (targetHours <= 0) {
      return 0;
    }

    return Math.min(
      Math.max(
        Math.round(
          (completedHours / targetHours) * 100
        ),
        0
      ),
      100
    );
  }, [
    weeklyGoal,
    targetHours,
    completedHours,
  ]);

  const remainingHours = Math.max(
    targetHours - completedHours,
    0
  );

  // =====================================================
  // PROGRESS CIRCLE
  // =====================================================

  const radius = 48;

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (percentage / 100) * circumference;

  // =====================================================
  // MOTIVATION
  // =====================================================

  const motivation = useMemo(() => {
    if (percentage >= 100) {
      return {
        title: "Contract complete.",
        description:
          "Target eliminated. Operation successful.",
        icon: "🏆",
      };
    }

    if (percentage >= 75) {
      return {
        title: "Final operation.",
        description:
          "The target is within reach. Finish the job.",
        icon: "🔥",
      };
    }

    if (percentage >= 50) {
      return {
        title: "Momentum secured.",
        description:
          "Half the fight is over. Stay disciplined.",
        icon: "⚡",
      };
    }

    if (percentage > 0) {
      return {
        title: "The fight has begun.",
        description:
          "Keep moving. No distractions. No excuses.",
        icon: "🎯",
      };
    }

    return {
      title: "Mission briefing.",
      description:
        "Choose your target and enter the fight.",
      icon: "🕴️",
    };
  }, [percentage]);

  // =====================================================
  // ACTIONS
  // =====================================================

  const handleContinueLearning = () => {
    navigate("/courses");
  };

  const handleRefresh = async () => {
    await fetchWeeklyGoal();
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section
        className="
          relative
          min-h-[500px]
          overflow-hidden
          rounded-[28px]
          border
          border-zinc-800
          bg-[#070707]
          shadow-2xl
          shadow-black/50
        "
      >
        {/* Background */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#030303]
            via-[#0b0b0b]
            to-[#190505]
          "
        />

        {/* Red light */}

        <div
          className="
            absolute
            -right-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-red-800/20
            blur-[100px]
          "
        />

        {/* Grit */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)]
            [background-size:12px_12px]
          "
        />

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
                mx-auto
                mb-5
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-red-900/60
                bg-red-950/30
                shadow-[0_0_25px_rgba(127,29,29,0.25)]
              "
            >
              <Crosshair
                size={24}
                className="
                  animate-spin
                  text-red-500
                "
              />
            </div>

            <p
              className="
                m-0
                text-sm
                font-black
                uppercase
                tracking-[0.2em]
                text-zinc-300
              "
            >
              Initializing operation
            </p>

            <p
              className="
                m-0
                mt-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-zinc-700
              "
            >
              Establishing combat record
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <section
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-zinc-800
        bg-[#070707]
        shadow-2xl
        shadow-black/50
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-red-900/70
        hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)]
      "
    >
      {/* =================================================
          CINEMATIC BACKGROUND
      ================================================= */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Base */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#030303]
            via-[#0b0b0b]
            to-[#190505]
          "
        />

        {/* John Wick red light */}

        <div
          className="
            absolute
            -right-32
            -top-32
            h-96
            w-96
            rounded-full
            bg-red-800/20
            blur-[120px]
            transition-all
            duration-1000
            group-hover:scale-125
            group-hover:bg-red-600/25
          "
        />

        {/* Fight Club red shadow */}

        <div
          className="
            absolute
            -bottom-36
            -left-28
            h-96
            w-96
            rounded-full
            bg-red-950/30
            blur-[120px]
          "
        />

        {/* Concrete texture */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)]
            [background-size:13px_13px]
          "
        />

        {/* Diagonal scratches */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(120deg,transparent_45%,white_46%,transparent_47%)]
            [background-size:18px_18px]
          "
        />

        {/* Tactical lines */}

        <div
          className="
            absolute
            right-[15%]
            top-[-20%]
            h-[140%]
            w-px
            rotate-[17deg]
            bg-gradient-to-b
            from-transparent
            via-red-500/20
            to-transparent
          "
        />

        <div
          className="
            absolute
            left-[15%]
            top-[-20%]
            h-[140%]
            w-px
            -rotate-[14deg]
            bg-gradient-to-b
            from-transparent
            via-white/[0.04]
            to-transparent
          "
        />

        {/* Red cinematic beam */}

        <div
          className="
            absolute
            left-0
            top-0
            h-1/2
            w-full
            bg-gradient-to-r
            from-transparent
            via-red-600/[0.035]
            to-transparent
          "
        />

        {/* Silhouette */}

        <div
          className="
            pointer-events-none
            absolute
            -bottom-16
            -right-3
            select-none
            text-[175px]
            leading-none
            opacity-[0.025]
            grayscale
            transition-all
            duration-700
            group-hover:scale-105
            group-hover:opacity-[0.05]
          "
        >
          🕴️
        </div>
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
          border-white/[0.08]
          px-5
          py-5
          sm:px-6
        "
      >
        <div className="flex items-center gap-3">
          {/* Swords */}

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
              border-red-900/60
              bg-red-950/30
              shadow-[0_0_25px_rgba(127,29,29,0.2)]
              backdrop-blur-md
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:border-red-700/70
            "
          >
            <Swords
              size={20}
              className="
                text-red-500
                drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]
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
                bg-red-500
                shadow-[0_0_10px_rgba(239,68,68,0.9)]
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
                Weekly Mission
              </h2>

              <span
                className="
                  hidden
                  rounded
                  border
                  border-red-900/50
                  bg-red-950/30
                  px-1.5
                  py-0.5
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-red-500
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
                text-zinc-600
                sm:text-[10px]
              "
            >
              No excuses. No distractions.
            </p>
          </div>
        </div>

        {/* Header controls */}

        <div className="flex items-center gap-2">
          {/* Operation status */}

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
              backdrop-blur-md
              sm:flex
            "
          >
            <Activity
              size={12}
              className="text-red-500"
            />

            <span
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.16em]
                text-zinc-600
              "
            >
              Operation 01
            </span>
          </div>

          {/* Refresh */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh weekly mission"
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
              text-zinc-600
              transition-all
              duration-300
              hover:border-red-900/60
              hover:bg-red-950/30
              hover:text-red-400
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
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
              TARGET CIRCLE
          ================================================= */}

          <div className="relative h-48 w-48">
            {/* Red glow */}

            <div
              className="
                absolute
                inset-3
                rounded-full
                bg-red-700/10
                blur-2xl
                transition-all
                duration-700
                group-hover:bg-red-600/20
              "
            />

            {/* Tactical outer ring */}

            <div
              className="
                absolute
                inset-0
                rounded-full
                border
                border-red-900/20
              "
            />

            {/* Tactical inner ring */}

            <div
              className="
                absolute
                inset-4
                rounded-full
                border
                border-white/[0.035]
              "
            />

            <svg
              className="
                relative
                h-full
                w-full
                -rotate-90
              "
              viewBox="0 0 120 120"
            >
              {/* Outer tactical ring */}

              <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                strokeDasharray="2 4"
                className="text-red-500/20"
              />

              {/* Background */}

              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="9"
                className="text-zinc-800"
              />

              {/* Progress */}

              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="url(#weeklyGoalGradient)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="
                  transition-all
                  duration-1000
                  ease-out
                  drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]
                "
              />

              <defs>
                <linearGradient
                  id="weeklyGoalGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="#450a0a"
                  />

                  <stop
                    offset="45%"
                    stopColor="#991b1b"
                  />

                  <stop
                    offset="75%"
                    stopColor="#dc2626"
                  />

                  <stop
                    offset="100%"
                    stopColor="#fca5a5"
                  />
                </linearGradient>
              </defs>
            </svg>

            {/* Crosshair */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <div
                className="
                  h-px
                  w-28
                  bg-red-500/10
                "
              />

              <div
                className="
                  absolute
                  h-28
                  w-px
                  bg-red-500/10
                "
              />
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
                  text-white
                  drop-shadow-[0_0_12px_rgba(255,255,255,0.12)]
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
                  text-zinc-600
                "
              >
                Target Status
              </span>
            </div>

            {/* Status badge */}

            <div
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
                border-red-900/60
                bg-[#070707]/95
                text-lg
                shadow-xl
                shadow-red-950/40
                backdrop-blur-md
              "
            >
              {motivation.icon}
            </div>

            {/* Target marker */}

            <div
              className="
                absolute
                left-1/2
                top-0
                h-2
                w-2
                -translate-x-1/2
                rounded-full
                bg-red-500
                shadow-[0_0_12px_rgba(239,68,68,0.9)]
              "
            />
          </div>

          {/* =================================================
              HOURS
          ================================================= */}

          <div className="text-center">
            <div
              className="
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <Clock3
                size={17}
                className="
                  text-red-500
                  drop-shadow-[0_0_7px_rgba(239,68,68,0.6)]
                "
              />

              <span
                className="
                  text-2xl
                  font-black
                  tracking-tight
                  text-white
                "
              >
                {completedHours.toFixed(1)}
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-zinc-600
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
                text-zinc-700
              "
            >
              {percentage >= 100
                ? "Contract successfully completed"
                : `${remainingHours.toFixed(
                    1
                  )} hours until extraction`}
            </p>
          </div>

          {/* =================================================
              MOTIVATION CARD
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
              backdrop-blur-md
              transition-all
              duration-300
              group-hover:border-red-900/40
              group-hover:bg-red-950/[0.05]
            "
          >
            {/* Red edge */}

            <div
              className="
                absolute
                bottom-0
                left-0
                top-0
                w-[2px]
                bg-red-700
              "
            />

            <div className="flex items-center gap-3">
              {/* Icon */}

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
                  border-red-800/50
                  bg-red-950/40
                  text-red-500
                  shadow-lg
                  shadow-red-950/30
                "
              >
                {percentage >= 100 ? (
                  <Trophy size={19} />
                ) : (
                  <Zap
                    size={19}
                    fill="currentColor"
                  />
                )}

                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    h-2
                    w-2
                    rounded-full
                    bg-red-500
                    shadow-[0_0_8px_rgba(239,68,68,0.8)]
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
                    uppercase
                    tracking-tight
                    text-white
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
                    text-zinc-500
                  "
                >
                  {motivation.description}
                </p>
              </div>

              <ArrowUpRight
                size={18}
                className="
                  shrink-0
                  text-zinc-700
                  transition-all
                  duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                  group-hover:text-red-500
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
            {/* Fight Time */}

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
                transition-all
                duration-300
                hover:border-red-900/50
                hover:bg-red-950/[0.06]
              "
            >
              <div className="flex items-center gap-2">
                <Flame
                  size={14}
                  className="
                    text-red-500
                    drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]
                  "
                />

                <span
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-zinc-600
                  "
                >
                  Fight Time
                </span>
              </div>

              <p
                className="
                  m-0
                  mt-1
                  text-sm
                  font-black
                  text-white
                "
              >
                {completedHours.toFixed(1)} hrs
              </p>

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  bg-red-700
                  transition-all
                  duration-700
                "
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>

            {/* Contract */}

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
                transition-all
                duration-300
                hover:border-red-900/50
                hover:bg-red-950/[0.06]
              "
            >
              <div className="flex items-center gap-2">
                <Target
                  size={14}
                  className="
                    text-red-400
                    drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]
                  "
                />

                <span
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-zinc-600
                  "
                >
                  Contract
                </span>
              </div>

              <p
                className="
                  m-0
                  mt-1
                  text-sm
                  font-black
                  text-white
                "
              >
                {targetHours} hrs
              </p>

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  w-full
                  bg-zinc-800
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
              group/mission
              relative
              flex
              w-full
              items-center
              justify-center
              gap-2
              overflow-hidden
              rounded-xl
              border
              border-red-700/50
              bg-gradient-to-r
              from-red-950
              via-red-800
              to-red-950
              px-4
              py-3
              text-xs
              font-black
              uppercase
              tracking-[0.17em]
              text-white
              shadow-lg
              shadow-red-950/40
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-red-500/60
              hover:from-red-900
              hover:via-red-700
              hover:to-red-900
              hover:shadow-[0_0_35px_rgba(220,38,38,0.25)]
              active:translate-y-0
            "
          >
            {/* Scan light */}

            <span
              className="
                pointer-events-none
                absolute
                inset-y-0
                -left-24
                w-20
                skew-x-[-20deg]
                bg-white/10
                blur-md
                transition-all
                duration-700
                group-hover/mission:left-[110%]
              "
            />

            <Crosshair
              size={15}
              className="
                relative
                z-10
                transition-transform
                duration-300
                group-hover/mission:rotate-90
              "
            />

            <span className="relative z-10">
              Enter The Fight
            </span>

            <ArrowUpRight
              size={15}
              className="
                relative
                z-10
                transition-transform
                duration-300
                group-hover/mission:-translate-y-0.5
                group-hover/mission:translate-x-0.5
              "
            />
          </button>
        </div>
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div
        className="
          absolute
          bottom-0
          left-0
          h-[2px]
          w-full
          bg-gradient-to-r
          from-transparent
          via-red-700
          to-transparent
          opacity-80
        "
      />

      {/* Moving red scanner */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          -left-40
          w-24
          skew-x-[-20deg]
          bg-red-500/10
          blur-xl
          transition-all
          duration-[1800ms]
          group-hover:left-[110%]
        "
      />
    </section>
  );
}

export default WeeklyGoal;