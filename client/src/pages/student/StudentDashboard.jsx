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
  Trophy,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

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
  const firstLoadRef = useRef(true);

  // ===================================================
  // FETCH DASHBOARD + XP
  // ===================================================

  const fetchDashboard = useCallback(
    async ({ showLoader = true, showToast = false } = {}) => {
      if (isFetchingRef.current) {
        return;
      }

      try {
        isFetchingRef.current = true;

        if (firstLoadRef.current && showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        // ------------------------------------------------
        // Fetch dashboard + XP together
        // ------------------------------------------------

        const [dashboardResponse, xpResponse] = await Promise.all([
          api.get("/dashboard/student", {
            params: {
              _t: Date.now(),
            },
          }),

          api.get("/achievements/xp", {
            params: {
              _t: Date.now(),
            },
          }),
        ]);

        const data = dashboardResponse.data;
        const xpData = xpResponse.data;

        console.log("Student Dashboard API response:", data);
        console.log("Student XP API response:", xpData);

        // ------------------------------------------------
        // Validate dashboard
        // ------------------------------------------------

        if (!data?.success) {
          throw new Error(
            data?.message || "Failed to load dashboard"
          );
        }

        // ------------------------------------------------
        // Update dashboard
        // ------------------------------------------------

        setDashboard(data);

        // ------------------------------------------------
        // Update XP
        // ------------------------------------------------

        if (xpData?.success) {
          setXp(xpData.xp);
        }

        // ------------------------------------------------
        // Success toast
        // ------------------------------------------------

        if (showToast) {
          toast.success("The realm has been refreshed.");
        }
      } catch (err) {
        console.error("Student dashboard error:", err);

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load dashboard";

        // Don't destroy existing dashboard
        // during background refresh failures.
        if (!dashboard) {
          setError(message);
        }

        if (showToast) {
          toast.error(message);
        }
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
        setRefreshing(false);
        firstLoadRef.current = false;
      }
    },
    [dashboard]
  );

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchDashboard({
      showLoader: true,
      showToast: false,
    });
  }, []);

  // ===================================================
  // REFRESH WHEN USER RETURNS
  // ===================================================

  useEffect(() => {
    const handleFocus = () => {
      fetchDashboard({
        showLoader: false,
        showToast: false,
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchDashboard({
          showLoader: false,
          showToast: false,
        });
      }
    };

    const handlePageShow = () => {
      fetchDashboard({
        showLoader: false,
        showToast: false,
      });
    };

    window.addEventListener("focus", handleFocus);

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("focus", handleFocus);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [fetchDashboard]);

  // ===================================================
  // REFRESH WHEN ROUTE BECOMES DASHBOARD
  // ===================================================

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      fetchDashboard({
        showLoader: false,
        showToast: false,
      });
    }
  }, [location.pathname]);

  // ===================================================
  // CUSTOM REFRESH EVENT
  // ===================================================

  useEffect(() => {
    const handleDashboardRefresh = () => {
      fetchDashboard({
        showLoader: false,
        showToast: false,
      });
    };

    window.addEventListener(
      "student-dashboard-refresh",
      handleDashboardRefresh
    );

    return () => {
      window.removeEventListener(
        "student-dashboard-refresh",
        handleDashboardRefresh
      );
    };
  }, [fetchDashboard]);

  // ===================================================
  // PERIODIC REFRESH
  // ===================================================

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchDashboard({
          showLoader: false,
          showToast: false,
        });
      }
    }, DASHBOARD_REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [fetchDashboard]);

  // ===================================================
  // MANUAL REFRESH
  // ===================================================

  const handleManualRefresh = async () => {
    await fetchDashboard({
      showLoader: false,
      showToast: true,
    });
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading && !dashboard) {
    return (
      <div className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-[#06080a] px-4">
        {/* =============================================
            BACKGROUND
        ============================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Moon */}
          <div
            className="
              absolute
              left-[50%]
              top-[12%]
              h-32
              w-32
              -translate-x-1/2
              rounded-full
              bg-[#dcecff]/10
              shadow-[0_0_80px_rgba(160,205,255,0.18)]
            "
          />

          {/* Mountain layers */}
          <div
            className="
              absolute
              bottom-0
              left-0
              h-[45%]
              w-full
              bg-[#0c1116]
              [clip-path:polygon(0_75%,12%_45%,23%_68%,36%_30%,49%_66%,63%_38%,76%_70%,89%_42%,100%_68%,100%_100%,0_100%)]
            "
          />

          <div
            className="
              absolute
              bottom-0
              left-0
              h-[32%]
              w-full
              bg-[#10161c]
              opacity-90
              [clip-path:polygon(0_80%,15%_52%,29%_73%,43%_45%,57%_72%,72%_48%,86%_70%,100%_50%,100%_100%,0_100%)]
            "
          />

          {/* Castle silhouette */}
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 opacity-30">
            <div className="relative h-20 w-44 bg-[#050709]">
              <div className="absolute -top-8 left-3 h-10 w-7 bg-[#050709]" />
              <div className="absolute -top-10 left-14 h-12 w-9 bg-[#050709]" />
              <div className="absolute -top-8 right-3 h-10 w-7 bg-[#050709]" />

              <div className="absolute -top-10 left-3 h-3 w-7 bg-[#050709]" />
              <div className="absolute -top-12 left-14 h-3 w-9 bg-[#050709]" />
              <div className="absolute -top-10 right-3 h-3 w-7 bg-[#050709]" />

              <div className="absolute bottom-0 left-1/2 h-10 w-7 -translate-x-1/2 rounded-t-full bg-[#12171c]" />

              <div className="absolute left-4 top-8 h-2 w-2 bg-[#c9a55b]/40" />
              <div className="absolute left-12 top-10 h-2 w-2 bg-[#9bd7f5]/30" />
              <div className="absolute right-5 top-8 h-2 w-2 bg-[#c9a55b]/40" />
            </div>
          </div>

          {/* Fog */}
          <div
            className="
              absolute
              bottom-[15%]
              left-[-10%]
              h-24
              w-[120%]
              rounded-full
              bg-slate-300/[0.035]
              blur-3xl
              animate-[fogDrift_12s_ease-in-out_infinite]
            "
          />

          <div
            className="
              absolute
              bottom-[28%]
              left-[-15%]
              h-20
              w-[130%]
              rounded-full
              bg-slate-200/[0.025]
              blur-3xl
              animate-[fogDrift_16s_ease-in-out_infinite_reverse]
            "
          />

          {/* Gold glow */}
          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-96
              w-96
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-amber-500/[0.035]
              blur-[100px]
            "
          />

          {/* Ice glow */}
          <div
            className="
              absolute
              left-[15%]
              top-[30%]
              h-72
              w-72
              rounded-full
              bg-sky-400/[0.025]
              blur-[100px]
            "
          />

          {/* Snow */}
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={`snow-${index}`}
              className="absolute h-1 w-1 rounded-full bg-white/30 animate-[snowFall_linear_infinite]"
              style={{
                left: `${(index * 37) % 100}%`,
                top: `${(index * 19) % 70}%`,
                animationDuration: `${7 + (index % 6)}s`,
                animationDelay: `${-(index % 8)}s`,
              }}
            />
          ))}
        </div>

        {/* =============================================
            LOADING CARD
        ============================================== */}

        <div
          className="
            relative
            z-10
            w-full
            max-w-md
            overflow-hidden
            rounded-3xl
            border
            border-[#b99855]/25
            bg-[#0a0d10]/90
            p-8
            text-center
            shadow-[0_30px_100px_rgba(0,0,0,0.65)]
            backdrop-blur-xl
          "
        >
          {/* top gold line */}
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7a55a] to-transparent" />

          <div className="relative mx-auto mb-6 h-24 w-24">
            <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full border border-[#c7a55a]/20 border-t-[#c7a55a]/70" />

            <div className="absolute inset-3 animate-[spin_5s_linear_infinite_reverse] rounded-full border border-sky-300/10 border-r-sky-300/60" />

            <div className="absolute inset-0 flex items-center justify-center">
              <Crown
                size={32}
                className="animate-[crownFloat_2.5s_ease-in-out_infinite] text-[#d4b56a]"
              />
            </div>

            <div className="absolute -right-1 top-2">
              <Sparkles
                size={15}
                className="animate-pulse text-sky-200"
              />
            </div>

            <div className="absolute -left-1 bottom-3">
              <Feather
                size={14}
                className="animate-[featherFloat_3s_ease-in-out_infinite] text-sky-300/60"
              />
            </div>
          </div>

          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-[#c7a55a]/70">
            THE REALM AWAKENS
          </div>

          <h2 className="text-xl font-black uppercase tracking-[0.12em] text-slate-100">
            Preparing your chronicle
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Gathering your quests, deeds, progress and earned honor...
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/70">
            <LoaderCircle
              size={14}
              className="animate-spin"
            />
            Summoning the records
          </div>

          <div className="mt-7 h-px w-full bg-gradient-to-r from-transparent via-[#c7a55a]/40 to-transparent" />
        </div>

        {/* Bottom decoration */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 text-[#c7a55a]/30">
          <Sword size={15} />
          <span className="h-px w-16 bg-[#c7a55a]/30" />
          <Shield size={14} />
          <span className="h-px w-16 bg-[#c7a55a]/30" />
          <Sword size={15} className="scale-x-[-1]" />
        </div>

        <style>{`
          @keyframes fogDrift {
            0%, 100% {
              transform: translateX(-3%);
              opacity: .35;
            }
            50% {
              transform: translateX(3%);
              opacity: .65;
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
            100% {
              transform: translateY(90vh) translateX(35px);
              opacity: 0;
            }
          }

          @keyframes crownFloat {
            0%, 100% {
              transform: translateY(0) rotate(-2deg);
            }
            50% {
              transform: translateY(-6px) rotate(2deg);
            }
          }

          @keyframes featherFloat {
            0%, 100% {
              transform: translateY(0) rotate(-8deg);
            }
            50% {
              transform: translateY(-7px) rotate(8deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error && !dashboard) {
    return (
      <div className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-[#06080a] px-4">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[10%] top-[15%] h-64 w-64 rounded-full bg-red-900/10 blur-[100px]" />

          <div className="absolute right-[10%] top-[30%] h-72 w-72 rounded-full bg-sky-900/10 blur-[110px]" />

          <div className="absolute bottom-0 left-0 h-[35%] w-full bg-[#0d1115] [clip-path:polygon(0_70%,15%_45%,28%_68%,42%_40%,58%_67%,72%_45%,86%_65%,100%_40%,100%_100%,0_100%)]" />

          <div className="absolute left-1/2 top-[12%] h-28 w-28 -translate-x-1/2 rounded-full bg-slate-200/10 blur-[1px] shadow-[0_0_80px_rgba(180,210,240,0.12)]" />
        </div>

        <div
          className="
            relative
            z-10
            w-full
            max-w-md
            overflow-hidden
            rounded-3xl
            border
            border-red-900/40
            bg-[#0b0e11]/95
            p-7
            text-center
            shadow-[0_30px_100px_rgba(0,0,0,0.7)]
            backdrop-blur-xl
          "
        >
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-red-700/80 to-transparent" />

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-700/30 bg-red-950/30 shadow-[0_0_40px_rgba(180,40,40,0.12)]">
            <AlertCircle
              size={28}
              className="text-red-400"
            />
          </div>

          <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.35em] text-red-400/70">
            THE RAVEN BRINGS DARK NEWS
          </div>

          <h2 className="mt-3 text-xl font-black uppercase tracking-[0.08em] text-slate-100">
            The chronicle could not be opened
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              fetchDashboard({
                showLoader: false,
                showToast: true,
              })
            }
            disabled={refreshing}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-[#c7a55a]/30
              bg-[#c7a55a]/10
              px-5
              py-2.5
              text-sm
              font-bold
              uppercase
              tracking-[0.12em]
              text-[#d8bc78]
              shadow-[0_0_25px_rgba(199,165,90,0.05)]
              transition
              duration-300
              hover:border-[#c7a55a]/60
              hover:bg-[#c7a55a]/15
              hover:text-[#f0d899]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Try Again
          </button>

          <div className="mt-7 flex items-center justify-center gap-3 text-[#c7a55a]/30">
            <Sword size={14} />
            <span className="h-px w-12 bg-[#c7a55a]/30" />
            <Castle size={16} />
            <span className="h-px w-12 bg-[#c7a55a]/30" />
            <Sword
              size={14}
              className="scale-x-[-1]"
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/60 to-transparent" />
        </div>
      </div>
    );
  }

  // ===================================================
  // DASHBOARD DATA
  // ===================================================

  const stats = dashboard?.stats || {};

  const courses = dashboard?.courses || [];

  const activity = dashboard?.activity || [];

  const recentActivity =
    dashboard?.recentActivity || [];

  const weeklyGoal =
    stats?.weeklyGoal || {};

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-[#06080a]
        text-slate-100
      "
    >
      {/* =================================================
          GLOBAL MEDIEVAL FANTASY BACKGROUND
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Deep base */}
        <div className="absolute inset-0 bg-[#06080a]" />

        {/* =============================================
            MOON
        ============================================== */}

        <div
          className="
            absolute
            right-[8%]
            top-[6%]
            h-40
            w-40
            rounded-full
            bg-gradient-to-br
            from-slate-100/15
            via-slate-300/8
            to-transparent
            shadow-[0_0_100px_rgba(170,205,235,0.10)]
            animate-[moonPulse_7s_ease-in-out_infinite]
          "
        >
          <div className="absolute inset-3 rounded-full border border-white/5" />
          <div className="absolute left-7 top-9 h-4 w-4 rounded-full bg-slate-700/10" />
          <div className="absolute right-8 top-16 h-6 w-6 rounded-full bg-slate-700/10" />
          <div className="absolute bottom-8 left-12 h-3 w-3 rounded-full bg-slate-700/10" />
        </div>

        {/* =============================================
            ICE GLOW
        ============================================== */}

        <div
          className="
            absolute
            left-[-10%]
            top-[18%]
            h-[450px]
            w-[450px]
            rounded-full
            bg-sky-500/[0.035]
            blur-[130px]
          "
        />

        {/* =============================================
            THRONE / GOLD GLOW
        ============================================== */}

        <div
          className="
            absolute
            right-[15%]
            top-[42%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-amber-500/[0.025]
            blur-[120px]
          "
        />

        {/* =============================================
            MOUNTAINS
        ============================================== */}

        <div
          className="
            absolute
            bottom-0
            left-0
            h-[42%]
            w-full
            bg-[#0a0e12]
            opacity-90
            [clip-path:polygon(0_75%,8%_55%,17%_68%,28%_38%,38%_68%,49%_45%,60%_72%,70%_42%,82%_67%,91%_47%,100%_66%,100%_100%,0_100%)]
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-0
            h-[30%]
            w-full
            bg-[#0e1419]
            opacity-80
            [clip-path:polygon(0_78%,13%_55%,25%_73%,39%_48%,53%_72%,66%_50%,79%_74%,91%_52%,100%_70%,100%_100%,0_100%)]
          "
        />

        {/* =============================================
            CASTLE SILHOUETTE
        ============================================== */}

        <div
          className="
            absolute
            bottom-[7%]
            left-[50%]
            -translate-x-1/2
            opacity-[0.12]
            animate-[castlePulse_9s_ease-in-out_infinite]
          "
        >
          <div className="relative h-28 w-64 bg-[#020304]">
            {/* Main towers */}
            <div className="absolute -left-3 -top-12 h-16 w-10 bg-[#020304]" />
            <div className="absolute left-[25%] -top-16 h-20 w-12 bg-[#020304]" />
            <div className="absolute right-[25%] -top-16 h-20 w-12 bg-[#020304]" />
            <div className="absolute -right-3 -top-12 h-16 w-10 bg-[#020304]" />

            {/* Battlements */}
            <div className="absolute -top-14 left-[-3px] flex gap-2">
              <span className="h-3 w-4 bg-[#020304]" />
              <span className="h-3 w-4 bg-[#020304]" />
              <span className="h-3 w-4 bg-[#020304]" />
            </div>

            <div className="absolute -top-[18px] left-[25%] flex gap-2">
              <span className="h-3 w-4 bg-[#020304]" />
              <span className="h-3 w-4 bg-[#020304]" />
              <span className="h-3 w-4 bg-[#020304]" />
            </div>

            <div className="absolute -top-[18px] right-[25%] flex gap-2">
              <span className="h-3 w-4 bg-[#020304]" />
              <span className="h-3 w-4 bg-[#020304]" />
              <span className="h-3 w-4 bg-[#020304]" />
            </div>

            {/* Gate */}
            <div className="absolute bottom-0 left-1/2 h-14 w-10 -translate-x-1/2 rounded-t-full bg-[#11161a]" />

            {/* Windows */}
            <div className="absolute left-5 top-4 h-3 w-2 rounded-full bg-[#c7a55a]/30" />
            <div className="absolute left-[28%] top-5 h-3 w-2 rounded-full bg-sky-300/20" />
            <div className="absolute right-[28%] top-5 h-3 w-2 rounded-full bg-[#c7a55a]/30" />
            <div className="absolute right-5 top-4 h-3 w-2 rounded-full bg-sky-300/20" />

            {/* Flag */}
            <div className="absolute -top-24 left-1/2 h-10 w-px bg-[#020304]" />
            <div className="absolute -top-24 left-1/2 h-4 w-7 bg-[#7d2730] opacity-60" />
          </div>
        </div>

        {/* =============================================
            FOG
        ============================================== */}

        <div
          className="
            absolute
            bottom-[13%]
            left-[-15%]
            h-32
            w-[130%]
            rounded-full
            bg-slate-200/[0.025]
            blur-3xl
            animate-[fogDrift_18s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute
            bottom-[28%]
            left-[-10%]
            h-24
            w-[120%]
            rounded-full
            bg-sky-200/[0.018]
            blur-3xl
            animate-[fogDrift_14s_ease-in-out_infinite_reverse]
          "
        />

        {/* =============================================
            SNOW PARTICLES
        ============================================== */}

        {Array.from({ length: 38 }).map((_, index) => (
          <span
            key={`snow-${index}`}
            className="
              absolute
              h-[2px]
              w-[2px]
              rounded-full
              bg-white/25
              animate-[snowFall_linear_infinite]
            "
            style={{
              left: `${(index * 29) % 100}%`,
              top: `${(index * 17) % 80}%`,
              animationDuration: `${8 + (index % 8)}s`,
              animationDelay: `${-(index % 10)}s`,
            }}
          />
        ))}

        {/* =============================================
            EMBERS
        ============================================== */}

        {Array.from({ length: 14 }).map((_, index) => (
          <span
            key={`ember-${index}`}
            className="
              absolute
              h-[3px]
              w-[3px]
              rounded-full
              bg-amber-300/20
              blur-[1px]
              animate-[emberFloat_linear_infinite]
            "
            style={{
              left: `${(index * 47) % 100}%`,
              bottom: `${10 + ((index * 13) % 40)}%`,
              animationDuration: `${5 + (index % 5)}s`,
              animationDelay: `${-(index % 6)}s`,
            }}
          />
        ))}

        {/* =============================================
            TOP VIGNETTE
        ============================================== */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.22)_70%,rgba(0,0,0,0.55)_100%)]" />

        {/* =============================================
            STONE TEXTURE
        ============================================== */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px)]
            [background-size:80px_80px]
          "
        />

        {/* =============================================
            GOLD HORIZON
        ============================================== */}

        <div
          className="
            absolute
            bottom-[18%]
            left-0
            right-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#c7a55a]/10
            to-transparent
          "
        />
      </div>

      {/* =================================================
          MAIN DASHBOARD CONTENT
      ================================================= */}

      <div className="relative z-10 w-full space-y-6 lg:space-y-8">
        {/* =================================================
            REFRESH INDICATOR
        ================================================= */}

        {refreshing && (
          <div className="pointer-events-none fixed right-5 top-5 z-[100]">
            <div
              className="
                relative
                flex
                items-center
                gap-3
                overflow-hidden
                rounded-xl
                border
                border-[#c7a55a]/30
                bg-[#090c0f]/95
                px-4
                py-2.5
                text-xs
                font-bold
                uppercase
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

              <span>Ravens are updating the chronicle...</span>
            </div>
          </div>
        )}

        {/* =================================================
            WELCOME
        ================================================= */}

        <WelcomeBanner />

        {/* =================================================
            STATS
        ================================================= */}

        <StatsGrid stats={stats} />

        {/* =================================================
            XP / LEVEL
        ================================================= */}

        <StudentXPCard xp={xp} />

        {/* =================================================
            CONTINUE LEARNING + WEEKLY GOAL
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
          <ContinueLearning courses={courses} />

          <WeeklyGoal weeklyGoal={weeklyGoal} />
        </div>

        {/* =================================================
            LEARNING ACTIVITY + RECENT ACTIVITY
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,1fr)]">
          <LearningActivity activity={activity} />

          <RecentActivity activities={recentActivity} />
        </div>

        {/* =================================================
            MY COURSES
        ================================================= */}

        <MyCourses courses={courses} />

        {/* =================================================
            FOOTER REFRESH
        ================================================= */}

        <div className="flex flex-col items-center justify-center gap-3 pb-8 pt-2">
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
              group
              inline-flex
              items-center
              gap-2.5
              rounded-xl
              border
              border-[#c7a55a]/20
              bg-[#0a0d10]/80
              px-5
              py-2.5
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-slate-400
              shadow-[0_10px_40px_rgba(0,0,0,0.25)]
              backdrop-blur-xl
              transition
              duration-300
              hover:border-[#c7a55a]/50
              hover:bg-[#c7a55a]/[0.06]
              hover:text-[#d8bc78]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={14}
              className={`
                transition-transform
                duration-500
                ${
                  refreshing
                    ? "animate-spin"
                    : "group-hover:rotate-180"
                }
              `}
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
        </div>
      </div>

      {/* =================================================
          GLOBAL ANIMATIONS
      ================================================= */}

      <style>{`
        @keyframes moonPulse {
          0%, 100% {
            transform: scale(1);
            opacity: .8;
          }

          50% {
            transform: scale(1.04);
            opacity: 1;
          }
        }

        @keyframes castlePulse {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
            opacity: .12;
          }

          50% {
            transform: translateX(-50%) translateY(-4px);
            opacity: .18;
          }
        }

        @keyframes fogDrift {
          0%, 100% {
            transform: translateX(-3%);
            opacity: .25;
          }

          50% {
            transform: translateX(3%);
            opacity: .6;
          }
        }

        @keyframes snowFall {
          0% {
            transform: translate3d(0, -30px, 0);
            opacity: 0;
          }

          15% {
            opacity: .7;
          }

          100% {
            transform: translate3d(40px, 110vh, 0);
            opacity: 0;
          }
        }

        @keyframes emberFloat {
          0% {
            transform: translate3d(0, 20px, 0) scale(.5);
            opacity: 0;
          }

          20% {
            opacity: .7;
          }

          70% {
            opacity: .45;
          }

          100% {
            transform: translate3d(35px, -180px, 0) scale(1);
            opacity: 0;
          }
        }

        @keyframes crownFloat {
          0%, 100% {
            transform: translateY(0) rotate(-2deg);
          }

          50% {
            transform: translateY(-6px) rotate(2deg);
          }
        }

        @keyframes featherFloat {
          0%, 100% {
            transform: translateY(0) rotate(-8deg);
          }

          50% {
            transform: translateY(-7px) rotate(8deg);
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