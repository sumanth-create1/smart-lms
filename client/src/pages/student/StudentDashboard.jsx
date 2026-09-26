import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Castle,
  Crown,
  Feather,
  LoaderCircle,
  RefreshCw,
  Shield,
  Sparkles,
  Sword,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import PremiumCursor from "../../components/common/ui/PremiumCursor";

import WelcomeBanner from "./components/student/WelcomeBanner";
import StatsGrid from "./components/student/StatsGrid";
import ContinueLearning from "./components/student/ContinueLearning";
import WeeklyGoal from "./components/student/WeeklyGoal";
import LearningActivity from "./components/student/LearningActivity";
import RecentActivity from "./components/student/RecentActivity";
import MyCourses from "./components/student/MyCourses";
import StudentXPCard from "./components/student/StudentXPCard";

// =====================================================
// CONSTANTS
// =====================================================

const DASHBOARD_REFRESH_INTERVAL = 30000;

const SNOW_PARTICLES = Array.from({ length: 20 }, (_, index) => index);
const EMBER_PARTICLES = Array.from({ length: 8 }, (_, index) => index);

// =====================================================
// BACKGROUND
// =====================================================

function RealmBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-[#06080a]" />

      {/* Moon */}
      <div
        className="
          absolute right-[8%] top-[6%]
          h-36 w-36
          rounded-full
          bg-gradient-to-br
          from-slate-100/15
          via-slate-300/8
          to-transparent
          shadow-[0_0_90px_rgba(170,205,235,0.08)]
          animate-[moonPulse_8s_ease-in-out_infinite]
        "
      >
        <div className="absolute inset-3 rounded-full border border-white/5" />
        <div className="absolute left-7 top-9 h-4 w-4 rounded-full bg-slate-700/10" />
        <div className="absolute right-8 top-16 h-5 w-5 rounded-full bg-slate-700/10" />
      </div>

      {/* Cold glow */}
      <div
        className="
          absolute left-[-12%] top-[18%]
          h-[420px] w-[420px]
          rounded-full
          bg-sky-500/[0.025]
          blur-[120px]
        "
      />

      {/* Gold glow */}
      <div
        className="
          absolute right-[10%] top-[40%]
          h-[360px] w-[360px]
          rounded-full
          bg-amber-500/[0.025]
          blur-[120px]
        "
      />

      {/* Back mountains */}
      <div
        className="
          absolute bottom-0 left-0
          h-[42%] w-full
          bg-[#0a0e12]
          opacity-90
          [clip-path:polygon(
            0_75%,8%_55%,17%_68%,28%_38%,
            38%_68%,49%_45%,60%_72%,70%_42%,
            82%_67%,91%_47%,100%_66%,
            100%_100%,0_100%
          )]
        "
      />

      {/* Front mountains */}
      <div
        className="
          absolute bottom-0 left-0
          h-[30%] w-full
          bg-[#0e1419]
          opacity-80
          [clip-path:polygon(
            0_78%,13%_55%,25%_73%,39%_48%,
            53%_72%,66%_50%,79%_74%,91%_52%,
            100%_70%,100%_100%,0_100%
          )]
        "
      />

      {/* Castle */}
      <div
        className="
          absolute bottom-[7%] left-1/2
          -translate-x-1/2
          opacity-[0.10]
          animate-[castlePulse_10s_ease-in-out_infinite]
        "
      >
        <div className="relative h-24 w-56 bg-[#020304]">
          <div className="absolute -left-2 -top-10 h-14 w-9 bg-[#020304]" />
          <div className="absolute left-[25%] -top-14 h-18 w-11 bg-[#020304]" />
          <div className="absolute right-[25%] -top-14 h-18 w-11 bg-[#020304]" />
          <div className="absolute -right-2 -top-10 h-14 w-9 bg-[#020304]" />

          <div className="absolute bottom-0 left-1/2 h-12 w-9 -translate-x-1/2 rounded-t-full bg-[#11161a]" />

          <div className="absolute left-5 top-4 h-2.5 w-2 rounded-full bg-[#c7a55a]/30" />
          <div className="absolute left-[28%] top-5 h-2.5 w-2 rounded-full bg-sky-300/20" />
          <div className="absolute right-[28%] top-5 h-2.5 w-2 rounded-full bg-[#c7a55a]/30" />
          <div className="absolute right-5 top-4 h-2.5 w-2 rounded-full bg-sky-300/20" />
        </div>
      </div>

      {/* Fog */}
      <div
        className="
          absolute bottom-[14%] left-[-15%]
          h-28 w-[130%]
          rounded-full
          bg-slate-200/[0.022]
          blur-3xl
          animate-[fogDrift_18s_ease-in-out_infinite]
        "
      />

      <div
        className="
          absolute bottom-[28%] left-[-10%]
          h-20 w-[120%]
          rounded-full
          bg-sky-200/[0.015]
          blur-3xl
          animate-[fogDrift_15s_ease-in-out_infinite_reverse]
        "
      />

      {/* Snow */}
      {SNOW_PARTICLES.map((index) => (
        <span
          key={`snow-${index}`}
          className="
            absolute
            h-[2px] w-[2px]
            rounded-full
            bg-white/20
            animate-[snowFall_linear_infinite]
          "
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 23) % 75}%`,
            animationDuration: `${9 + (index % 6)}s`,
            animationDelay: `${-(index % 7)}s`,
          }}
        />
      ))}

      {/* Embers */}
      {EMBER_PARTICLES.map((index) => (
        <span
          key={`ember-${index}`}
          className="
            absolute
            h-[3px] w-[3px]
            rounded-full
            bg-amber-300/20
            blur-[1px]
            animate-[emberFloat_linear_infinite]
          "
          style={{
            left: `${(index * 53) % 100}%`,
            bottom: `${12 + ((index * 17) % 35)}%`,
            animationDuration: `${6 + (index % 4)}s`,
            animationDelay: `${-(index % 5)}s`,
          }}
        />
      ))}

      {/* Vignette */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(
            circle_at_center,
            transparent_20%,
            rgba(0,0,0,0.20)_70%,
            rgba(0,0,0,0.55)_100%
          )]
        "
      />

      {/* Subtle stone texture */}
      <div
        className="
          absolute inset-0
          opacity-[0.025]
          [background-image:
            linear-gradient(
              90deg,
              rgba(255,255,255,.35)_1px,
              transparent_1px
            ),
            linear-gradient(
              rgba(255,255,255,.2)_1px,
              transparent_1px
            )
          ]
          [background-size:80px_80px]
        "
      />

      {/* Horizon */}
      <div
        className="
          absolute bottom-[18%] left-0 right-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#c7a55a]/10
          to-transparent
        "
      />
    </div>
  );
}

// =====================================================
// LOADING SCREEN
// =====================================================

function LoadingScreen() {
  return (
    <div className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-[#06080a] px-4">
      <RealmBackground />

      <div
        className="
          relative z-10
          w-full max-w-md
          overflow-hidden
          rounded-3xl
          border border-[#b99855]/25
          bg-[#0a0d10]/90
          p-8
          text-center
          shadow-[0_30px_100px_rgba(0,0,0,0.65)]
          backdrop-blur-xl
        "
      >
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7a55a] to-transparent" />

        <div className="relative mx-auto mb-6 h-20 w-20">
          <div className="absolute inset-0 animate-spin rounded-full border border-[#c7a55a]/20 border-t-[#c7a55a]/70" />

          <div className="absolute inset-3 animate-spin rounded-full border border-sky-300/10 border-r-sky-300/50 [animation-direction:reverse] [animation-duration:4s]" />

          <div className="absolute inset-0 flex items-center justify-center">
            <Crown
              size={30}
              className="animate-[crownFloat_2.5s_ease-in-out_infinite] text-[#d4b56a]"
            />
          </div>

          <Sparkles
            size={14}
            className="absolute -right-1 top-1 animate-pulse text-sky-200"
          />

          <Feather
            size={13}
            className="absolute -bottom-1 -left-1 text-sky-300/50"
          />
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c7a55a]/70">
          The Realm Awakens
        </p>

        <h2 className="mt-2 text-xl font-black uppercase tracking-[0.1em] text-slate-100">
          Preparing Your Chronicle
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Gathering your quests, progress and earned honor...
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200/70">
          <LoaderCircle size={14} className="animate-spin" />
          Summoning the records
        </div>

        <div className="mt-7 h-px bg-gradient-to-r from-transparent via-[#c7a55a]/30 to-transparent" />
      </div>
    </div>
  );
}

// =====================================================
// ERROR SCREEN
// =====================================================

function ErrorScreen({ error, refreshing, onRetry }) {
  return (
    <div className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-[#06080a] px-4">
      <RealmBackground />

      <div
        className="
          relative z-10
          w-full max-w-md
          overflow-hidden
          rounded-3xl
          border border-red-900/40
          bg-[#0b0e11]/95
          p-7
          text-center
          shadow-[0_30px_100px_rgba(0,0,0,0.7)]
          backdrop-blur-xl
        "
      >
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-red-700/80 to-transparent" />

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-700/30 bg-red-950/30">
          <AlertCircle size={28} className="text-red-400" />
        </div>

        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.35em] text-red-400/70">
          The Raven Brings Dark News
        </p>

        <h2 className="mt-3 text-xl font-black uppercase tracking-[0.08em] text-slate-100">
          Chronicle Could Not Be Opened
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {error}
        </p>

        <button
          type="button"
          onClick={onRetry}
          disabled={refreshing}
          className="
            mt-6 inline-flex items-center gap-2
            rounded-xl
            border border-[#c7a55a]/30
            bg-[#c7a55a]/10
            px-5 py-2.5
            text-sm font-bold uppercase
            tracking-[0.12em]
            text-[#d8bc78]
            transition-all duration-300
            hover:border-[#c7a55a]/60
            hover:bg-[#c7a55a]/15
            hover:text-[#f0d899]
            disabled:opacity-50
          "
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />

          Try Again
        </button>

        <div className="mt-7 flex items-center justify-center gap-3 text-[#c7a55a]/30">
          <Sword size={14} />
          <span className="h-px w-12 bg-[#c7a55a]/30" />
          <Castle size={16} />
          <span className="h-px w-12 bg-[#c7a55a]/30" />
          <Sword size={14} className="scale-x-[-1]" />
        </div>
      </div>
    </div>
  );
}

// =====================================================
// REFRESH INDICATOR
// =====================================================

function RefreshIndicator() {
  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[100]">
      <div
        className="
          relative flex items-center gap-3
          rounded-xl
          border border-[#c7a55a]/30
          bg-[#090c0f]/95
          px-4 py-2.5
          text-xs font-bold uppercase
          tracking-[0.12em]
          text-[#d6b96e]
          shadow-[0_15px_50px_rgba(0,0,0,0.5)]
          backdrop-blur-xl
        "
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7a55a] to-transparent" />

        <LoaderCircle
          size={14}
          className="animate-spin text-sky-300"
        />

        <span>Updating the Chronicle...</span>
      </div>
    </div>
  );
}

// =====================================================
// COMPONENT
// =====================================================

function StudentDashboard() {
  const location = useLocation();

  const [dashboard, setDashboard] = useState(null);
  const [xp, setXp] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const isFetchingRef = useRef(false);
  const dashboardRef = useRef(null);

  // Keep the latest dashboard available without making
  // fetchDashboard depend on dashboard state.
  useEffect(() => {
    dashboardRef.current = dashboard;
  }, [dashboard]);

  // ===================================================
  // FETCH DASHBOARD
  // ===================================================

  const fetchDashboard = useCallback(
    async ({ showLoader = false, showToast = false } = {}) => {
      if (isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;

      const hasDashboard = Boolean(dashboardRef.current);

      if (showLoader && !hasDashboard) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      try {
        const timestamp = Date.now();

        const [dashboardResult, xpResult] =
          await Promise.allSettled([
            api.get("/dashboard/student", {
              params: { _t: timestamp },
            }),

            api.get("/achievements/xp", {
              params: { _t: timestamp },
            }),
          ]);

        // Dashboard is the important request.
        if (dashboardResult.status === "rejected") {
          throw dashboardResult.reason;
        }

        const dashboardData = dashboardResult.value?.data;

        if (!dashboardData?.success) {
          throw new Error(
            dashboardData?.message ||
              "Failed to load dashboard"
          );
        }

        setDashboard(dashboardData);
        setError("");

        // XP should not break the whole dashboard
        // if its endpoint temporarily fails.
        if (xpResult.status === "fulfilled") {
          const xpData = xpResult.value?.data;

          if (xpData?.success) {
            setXp(xpData.xp);
          }
        }

        if (showToast) {
          toast.success("The realm has been refreshed.");
        }
      } catch (err) {
        console.error("Student dashboard error:", err);

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load dashboard";

        // Keep existing dashboard during background
        // refresh failures.
        if (!dashboardRef.current) {
          setError(message);
        }

        if (showToast) {
          toast.error(message);
        }
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchDashboard({ showLoader: true });
  }, [fetchDashboard]);

  // ===================================================
  // REFRESH WHEN USER RETURNS
  // ===================================================

  useEffect(() => {
    const refresh = () => {
      fetchDashboard();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    window.addEventListener("focus", refresh);
    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [fetchDashboard]);

  // ===================================================
  // REFRESH WHEN RETURNING TO DASHBOARD
  // ===================================================

  useEffect(() => {
    if (location.pathname !== "/dashboard") {
      return;
    }

    fetchDashboard();
  }, [location.pathname, fetchDashboard]);

  // ===================================================
  // CUSTOM REFRESH EVENT
  // ===================================================

  useEffect(() => {
    const handleRefresh = () => {
      fetchDashboard();
    };

    window.addEventListener(
      "student-dashboard-refresh",
      handleRefresh
    );

    return () => {
      window.removeEventListener(
        "student-dashboard-refresh",
        handleRefresh
      );
    };
  }, [fetchDashboard]);

  // ===================================================
  // PERIODIC REFRESH
  // ===================================================

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchDashboard();
      }
    }, DASHBOARD_REFRESH_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, [fetchDashboard]);

  // ===================================================
  // MANUAL REFRESH
  // ===================================================

  const handleManualRefresh = () => {
    fetchDashboard({
      showToast: true,
    });
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading && !dashboard) {
    return <LoadingScreen />;
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error && !dashboard) {
    return (
      <ErrorScreen
        error={error}
        refreshing={refreshing}
        onRetry={() =>
          fetchDashboard({
            showToast: true,
          })
        }
      />
    );
  }

  // ===================================================
  // DATA
  // ===================================================

  const stats = dashboard?.stats || {};
  const courses = dashboard?.courses || [];
  const activity = dashboard?.activity || [];
  const recentActivity =
    dashboard?.recentActivity || [];
  const weeklyGoal = stats?.weeklyGoal || {};

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div
      className="
        relative min-h-screen w-full
        overflow-hidden
        bg-[#06080a]
        text-slate-100
      "
    >
      {/* Shared premium cursor */}
      <PremiumCursor />

      {/* Background */}
      <RealmBackground />

      {/* Content */}
      <main className="relative z-10 w-full space-y-6 lg:space-y-8">
        {/* Background refresh status */}
        {refreshing && <RefreshIndicator />}

        {/* Welcome */}
        <WelcomeBanner />

        {/* Stats */}
        <StatsGrid stats={stats} />

        {/* XP */}
        <StudentXPCard xp={xp} />

        {/* Learning */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
          <ContinueLearning courses={courses} />

          <WeeklyGoal weeklyGoal={weeklyGoal} />
        </div>

        {/* Activity */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,1fr)]">
          <LearningActivity activity={activity} />

          <RecentActivity activities={recentActivity} />
        </div>

        {/* Courses */}
        <MyCourses courses={courses} />

        {/* Footer */}
        <footer className="flex flex-col items-center justify-center gap-3 pb-8 pt-2">
          <div className="flex w-full items-center justify-center gap-4">
            <span className="h-px w-20 bg-gradient-to-r from-transparent to-[#c7a55a]/30" />

            <Crown
              size={15}
              className="text-[#c7a55a]/40"
            />

            <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#c7a55a]/30" />
          </div>

          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="
              group inline-flex items-center gap-2.5
              rounded-xl
              border border-[#c7a55a]/20
              bg-[#0a0d10]/80
              px-5 py-2.5
              text-xs font-bold uppercase
              tracking-[0.16em]
              text-slate-400
              shadow-[0_10px_40px_rgba(0,0,0,0.25)]
              backdrop-blur-xl
              transition-all duration-300
              hover:border-[#c7a55a]/50
              hover:bg-[#c7a55a]/[0.06]
              hover:text-[#d8bc78]
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={14}
              className={
                refreshing
                  ? "animate-spin"
                  : "transition-transform duration-500 group-hover:rotate-180"
              }
            />

            Refresh the Chronicle
          </button>

          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-600">
            <Sword size={10} />

            Learn · Master · Earn Your Place

            <Sword
              size={10}
              className="scale-x-[-1]"
            />
          </div>
        </footer>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes moonPulse {
          0%, 100% {
            transform: scale(1);
            opacity: .75;
          }

          50% {
            transform: scale(1.035);
            opacity: .95;
          }
        }

        @keyframes castlePulse {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
            opacity: .10;
          }

          50% {
            transform: translateX(-50%) translateY(-3px);
            opacity: .15;
          }
        }

        @keyframes fogDrift {
          0%, 100% {
            transform: translateX(-3%);
            opacity: .25;
          }

          50% {
            transform: translateX(3%);
            opacity: .55;
          }
        }

        @keyframes snowFall {
          0% {
            transform: translate3d(0, -30px, 0);
            opacity: 0;
          }

          15% {
            opacity: .55;
          }

          100% {
            transform: translate3d(35px, 110vh, 0);
            opacity: 0;
          }
        }

        @keyframes emberFloat {
          0% {
            transform: translate3d(0, 20px, 0) scale(.5);
            opacity: 0;
          }

          20% {
            opacity: .6;
          }

          70% {
            opacity: .35;
          }

          100% {
            transform: translate3d(30px, -180px, 0) scale(1);
            opacity: 0;
          }
        }

        @keyframes crownFloat {
          0%, 100% {
            transform: translateY(0) rotate(-2deg);
          }

          50% {
            transform: translateY(-5px) rotate(2deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}

export default StudentDashboard;