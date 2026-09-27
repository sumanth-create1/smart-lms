import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  Crown,
  RefreshCw,
  Shield,
  Sparkles,
  Sword,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../../../services/api";

function WeeklyGoal({ weeklyGoal: initialWeeklyGoal }) {
  const navigate = useNavigate();

  const [weeklyGoal, setWeeklyGoal] = useState(
    initialWeeklyGoal ?? null
  );

  const [loading, setLoading] = useState(
    !initialWeeklyGoal
  );

  const [refreshing, setRefreshing] = useState(false);

  // =====================================================
  // FETCH DATA
  // =====================================================

  const fetchWeeklyGoal = useCallback(
    async ({ showRefreshState = false, signal } = {}) => {
      if (showRefreshState) {
        setRefreshing(true);
      }

      try {
        const response = await api.get(
          "/dashboard/student",
          signal ? { signal } : undefined
        );

        if (signal?.aborted) {
          return;
        }

        const data = response?.data;

        const nextWeeklyGoal =
          data?.stats?.weeklyGoal ??
          data?.dashboard?.weeklyGoal ??
          data?.data?.weeklyGoal ??
          data?.weeklyGoal ??
          null;

        if (nextWeeklyGoal) {
          setWeeklyGoal(nextWeeklyGoal);
        }
      } catch (error) {
        if (
          error?.name === "CanceledError" ||
          error?.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error(
          "Failed to fetch weekly goal:",
          error
        );

        toast.error("Failed to load weekly goal.");
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    []
  );

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const controller = new AbortController();

    fetchWeeklyGoal({
      showRefreshState: false,
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [fetchWeeklyGoal]);

  // =====================================================
  // DERIVED VALUES
  // =====================================================

  const {
    targetHours,
    completedHours,
    percentage,
    remainingHours,
    completedMinutes,
    earnedXP,
    level,
    xpToNextLevel,
  } = useMemo(() => {
    const target = Number(
      weeklyGoal?.targetHours ?? 0
    );

    const completed = Number(
      weeklyGoal?.completedHours ?? 0
    );

    const backendPercentage = Number(
      weeklyGoal?.percentage
    );

    const progress = Number.isFinite(
      backendPercentage
    )
      ? Math.min(
          Math.max(backendPercentage, 0),
          100
        )
      : target > 0
      ? Math.min(
          Math.round(
            (completed / target) * 100
          ),
          100
        )
      : 0;

    return {
      targetHours: target,
      completedHours: completed,
      percentage: progress,
      remainingHours: Math.max(
        target - completed,
        0
      ),
      completedMinutes: Math.round(
        completed * 60
      ),
      earnedXP: Math.round(completed * 2000),
      level:
        progress >= 100
          ? 3
          : progress >= 50
          ? 2
          : 1,
      xpToNextLevel:
        progress >= 100
          ? 0
          : Math.round(
              (100 - progress) * 10
            ),
    };
  }, [weeklyGoal]);

  // =====================================================
  // STATUS
  // =====================================================

  const status = useMemo(() => {
    if (percentage >= 100) {
      return {
        title: "THE REALM ENDURES",
        subtitle: "Your weekly conquest is complete.",
      };
    }

    if (percentage >= 75) {
      return {
        title: "THE THRONE IS NEAR",
        subtitle: "The final stretch awaits.",
      };
    }

    if (percentage >= 50) {
      return {
        title: "THE BATTLE RAGES",
        subtitle: "Your house grows stronger.",
      };
    }

    if (percentage > 0) {
      return {
        title: "THE JOURNEY BEGINS",
        subtitle: "Every hour strengthens your realm.",
      };
    }

    return {
      title: "THE REALM AWAITS",
      subtitle: "Your next conquest awaits.",
    };
  }, [percentage]);

  // =====================================================
  // ACTIONS
  // =====================================================

  const handleRefresh = () => {
    fetchWeeklyGoal({
      showRefreshState: true,
    });
  };

  const handleContinueLearning = () => {
    navigate("/courses");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="relative h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#080a0c] p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-32 rounded-full bg-white/5" />

          <div className="mx-auto mt-16 h-32 w-32 rounded-full bg-white/5" />

          <div className="mx-auto h-6 w-48 rounded bg-white/5" />

          <div className="mt-10 h-3 w-full rounded bg-white/5" />
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#080a0c] text-white">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0">

        {/* Main glow */}
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/[0.035] blur-3xl" />

        {/* Red glow */}
        <div className="absolute -left-24 top-20 h-48 w-48 rounded-full bg-red-950/20 blur-3xl" />

        {/* Blue glow */}
        <div className="absolute -right-24 bottom-10 h-52 w-52 rounded-full bg-blue-950/20 blur-3xl" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="relative z-10 flex items-center justify-between border-b border-white/5 px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/[0.06]">
            <Crown className="h-5 w-5 text-amber-400" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Weekly Conquest
            </h3>

            <p className="text-xs text-slate-500">
              Earn your place in the realm
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-500 transition hover:border-amber-500/30 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />
        </button>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="relative z-10 px-6 pb-6 pt-5">

        {/* =================================================
            TOP STATS
        ================================================= */}

        <div className="flex items-center justify-between">

          {/* XP */}
          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/[0.06]">
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-widest text-slate-600">
                Honor
              </p>

              <p className="text-sm font-bold text-amber-400">
                {earnedXP} XP
              </p>
            </div>

          </div>

          {/* Level */}
          <div className="flex items-center gap-2">

            <Crown className="h-4 w-4 text-amber-400" />

            <div>
              <p className="text-[9px] uppercase tracking-widest text-slate-600">
                Rank
              </p>

              <p className="text-sm font-bold text-slate-300">
                Level {level}
              </p>
            </div>

          </div>

        </div>

        {/* =================================================
            REALM VISUAL
        ================================================= */}

        <div className="relative mx-auto mt-5 flex h-[210px] max-w-[460px] items-center justify-center">

          {/* Outer circle */}
          <div className="absolute h-[205px] w-[205px] rounded-full border border-amber-500/[0.10]" />

          {/* Middle circle */}
          <div className="absolute h-[150px] w-[150px] rounded-full border border-dashed border-slate-700/50" />

          {/* Inner glow */}
          <div className="absolute h-28 w-28 rounded-full bg-amber-500/[0.035] blur-2xl" />

          {/* Orbit dots */}
          <div className="absolute left-[21%] top-[48%] h-1.5 w-1.5 rounded-full bg-amber-500" />

          <div className="absolute right-[25%] top-[25%] h-1 w-1 rounded-full bg-slate-500" />

          {/* Central throne */}
          <div className="relative flex h-28 w-24 items-center justify-center rounded-t-[28px] rounded-b-xl border border-slate-600/80 bg-gradient-to-b from-slate-800/80 to-slate-950 shadow-2xl">

            <Sword className="absolute -left-5 top-0 h-12 w-12 rotate-[25deg] text-slate-500" />

            <Sword className="absolute -right-5 top-1 h-12 w-12 rotate-[-35deg] text-slate-400" />

            <Crown className="absolute -top-5 h-9 w-9 fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,.3)]" />

            <Shield className="h-8 w-8 text-slate-700" />

          </div>

          {/* Status */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap">

            <div className="rounded-full border border-amber-600/40 bg-black/90 px-5 py-2">

              <p className="text-[10px] font-black tracking-[0.22em] text-amber-400">
                {status.title}
              </p>

            </div>

            <p className="mt-1 text-center text-[9px] text-slate-600">
              {status.subtitle}
            </p>

          </div>

        </div>

        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="mt-3">

          <div className="mb-2 flex items-end justify-between">

            <div className="flex items-baseline gap-2">

              <span className="text-3xl font-black text-amber-400">
                {percentage}%
              </span>

              <span className="text-xs text-slate-600">
                complete
              </span>

            </div>

            <span className="text-xs text-slate-500">
              {completedHours.toFixed(1)} /{" "}
              {targetHours} hrs
            </span>

          </div>

          {/* Progress bar */}
          <div className="h-2 overflow-hidden rounded-full bg-white/5">

            <div
              className="h-full rounded-full bg-gradient-to-r from-red-900 via-red-700 to-amber-400 transition-all duration-700"
              style={{
                width: `${percentage}%`,
              }}
            />

          </div>

          <div className="mt-2 flex justify-between text-[10px]">

            <span className="text-amber-500">
              {earnedXP} XP earned
            </span>

            <span className="text-slate-600">
              {xpToNextLevel > 0
                ? `${xpToNextLevel} XP to next rank`
                : "Maximum rank reached"}
            </span>

          </div>

        </div>

        {/* =================================================
            FOOTER STATS
        ================================================= */}

        <div className="mt-5 grid grid-cols-2 gap-3">

          {/* Time */}
          <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">

            <div className="flex items-center gap-2">

              <Clock3 className="h-4 w-4 text-slate-500" />

              <div>
                <p className="text-[9px] uppercase tracking-wider text-slate-600">
                  This Week
                </p>

                <p className="text-sm font-semibold text-slate-300">
                  {completedMinutes} min
                </p>
              </div>

            </div>

          </div>

          {/* Remaining */}
          <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">

            <div className="flex items-center gap-2">

              <Sword className="h-4 w-4 text-slate-500" />

              <div>
                <p className="text-[9px] uppercase tracking-wider text-slate-600">
                  Remaining
                </p>

                <p className="text-sm font-semibold text-slate-300">
                  {remainingHours.toFixed(1)} hrs
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            ACTION
        ================================================= */}

        <button
          type="button"
          onClick={handleContinueLearning}
          className="group mt-4 flex w-full items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/[0.04] px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-amber-500/40 hover:bg-amber-500/[0.08] hover:text-white"
        >

          <span className="flex items-center gap-2">

            <Shield className="h-4 w-4 text-amber-500" />

            Continue your conquest

          </span>

          <ArrowRight className="h-4 w-4 text-amber-500 transition-transform group-hover:translate-x-1" />

        </button>

      </div>
    </section>
  );
}

export default WeeklyGoal;