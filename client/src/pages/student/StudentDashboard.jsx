import { useCallback, useEffect, useRef, useState } from "react";
import {
  LoaderCircle,
  AlertCircle,
  RefreshCw,
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const isFetchingRef = useRef(false);
  const firstLoadRef = useRef(true);

  // ===================================================
  // FETCH DASHBOARD
  // ===================================================

  const fetchDashboard = useCallback(
    async ({ showLoader = true, showToast = false } = {}) => {
      // Prevent duplicate requests
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

        const response = await api.get(
          "/dashboard/student",
          {
            params: {
              _t: Date.now(),
            },
          }
        );

        const data = response.data;

        console.log(
          "Student Dashboard API response:",
          data
        );

        if (!data?.success) {
          throw new Error(
            data?.message ||
              "Failed to load dashboard"
          );
        }

        // -----------------------------------------------
        // IMPORTANT
        // -----------------------------------------------
        // Replace the entire dashboard object with
        // the latest backend response.
        //
        // This makes all dashboard components receive
        // fresh data.
        // -----------------------------------------------

        setDashboard(data);

        if (showToast) {
          toast.success(
            "Dashboard updated successfully."
          );
        }
      } catch (err) {
        console.error(
          "Student dashboard error:",
          err
        );

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load dashboard";

        // Don't destroy already loaded dashboard
        // when a background refresh fails.
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
  // REFRESH WHEN USER RETURNS TO DASHBOARD
  // ===================================================

  useEffect(() => {
    const handleFocus = () => {
      fetchDashboard({
        showLoader: false,
        showToast: false,
      });
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible"
      ) {
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

    window.addEventListener(
      "focus",
      handleFocus
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener(
      "pageshow",
      handlePageShow
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "pageshow",
        handlePageShow
      );
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
  //
  // Your learning page can dispatch:
  //
  // window.dispatchEvent(
  //   new Event("student-dashboard-refresh")
  // );
  //
  // This is useful immediately after completing
  // a lecture.
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
      if (
        document.visibilityState === "visible"
      ) {
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
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            size={32}
            className="animate-spin text-indigo-600"
          />

          <p className="text-sm font-medium text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error && !dashboard) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle
              size={24}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Couldn't load your dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
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
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-indigo-700
              disabled:cursor-not-allowed
              disabled:opacity-60
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
        </div>
      </div>
    );
  }

  // ===================================================
  // DASHBOARD DATA
  // ===================================================

  const stats = dashboard?.stats || {};

  const courses =
    dashboard?.courses || [];

  const activity =
    dashboard?.activity || [];

  const recentActivity =
    dashboard?.recentActivity || [];

  const weeklyGoal =
    stats?.weeklyGoal || {};

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="!block !w-full space-y-6 lg:space-y-8">

      {/* =================================================
          DASHBOARD REFRESH INDICATOR
      ================================================= */}

      {refreshing && (
        <div className="pointer-events-none fixed right-5 top-5 z-50">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-lg">
            <LoaderCircle
              size={14}
              className="animate-spin text-indigo-600"
            />

            Updating dashboard...
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

      <StatsGrid
        stats={stats}
      />

      {/* =================================================
          CONTINUE LEARNING + WEEKLY GOAL
      ================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">

        <ContinueLearning
          courses={courses}
        />

        <WeeklyGoal
          weeklyGoal={weeklyGoal}
        />

      </div>

      {/* =================================================
          LEARNING ACTIVITY + RECENT ACTIVITY
      ================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,1fr)]">

        <LearningActivity
          activity={activity}
        />

        <RecentActivity
          activities={recentActivity}
        />

      </div>

      {/* =================================================
          MY COURSES
      ================================================= */}

      <MyCourses
        courses={courses}
      />

      {/* =================================================
          MANUAL REFRESH
      ================================================= */}

      <div className="flex justify-end pb-4">
        <button
          type="button"
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2
            text-xs
            font-semibold
            text-slate-600
            shadow-sm
            transition
            hover:border-indigo-200
            hover:bg-indigo-50
            hover:text-indigo-600
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <RefreshCw
            size={14}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh Dashboard
        </button>
      </div>

    </div>
  );
}

export default StudentDashboard;