import { useCallback, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

import DashboardHeader from "./DashBoardHeader";
import WelcomeBanner from "./WelcomeBanner";
import StatsGrid from "./StatsGrid";
import LearningStreak from "./LearningStreak";
import ContinueLearning from "./ContinueLearning";
import MyCourses from "./MyCourses";
import ProgressOverview from "./ProgressOverview";
import LearningActivity from "./LearningActivity";
import AchievementCard from "./AchievementCard";
import InstructorCard from "./InstructorCard";

function UserDashboard() {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    console.log("🚀 Dashboard request started");

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/student");

      console.log("📥 Dashboard response:", response.data);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to load dashboard");
      }

      setDashboardData(response.data);
    } catch (err) {
      console.error("❌ Dashboard error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load dashboard",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return <DashboardError error={error} onRetry={fetchDashboard} />;
  }

  const stats = dashboardData?.stats ?? {};
  const courses = dashboardData?.courses ?? [];
  const recentActivity = dashboardData?.recentActivity ?? [];

  const instructors = courses
    .map((course) => course.instructor)
    .filter(Boolean)
    .filter(
      (instructor, index, array) =>
        index === array.findIndex((item) => item._id === instructor._id),
    );

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      {/* HEADER */}
      <DashboardHeader user={user} />

      {/* PAGE */}
      <main className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10">
        <div className="mx-auto w-full max-w-[1600px]">
          {/* Welcome */}
          <WelcomeBanner user={user} stats={stats} />

          {/* Stats */}
          <div className="mt-8">
            <StatsGrid stats={stats} />
          </div>

          {/* Streak */}
          <div className="mt-8">
            <LearningStreak
              streak={stats.studyStreak}
              weeklyGoal={stats.weeklyGoal}
            />
          </div>

          {/* Main dashboard */}
          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            {/* LEFT */}

            <div className="min-w-0 space-y-8">
              <ContinueLearning courses={courses} />

              <MyCourses courses={courses} />

              <LearningActivity activity={recentActivity} />
            </div>

            {/* RIGHT */}

            <div className="min-w-0 space-y-8">
              <ProgressOverview stats={stats} />

              <AchievementCard stats={stats} />

              <InstructorCard instructors={instructors} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ==========================================
   LOADING
========================================== */

function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
      <div className="flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
          <LoaderCircle size={30} className="animate-spin text-indigo-600" />
        </div>

        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
}

/* ==========================================
   ERROR
========================================== */

function DashboardError({ error, onRetry }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <span className="text-lg font-bold text-red-500">!</span>
        </div>

        <h2 className="mt-4 text-xl font-bold text-slate-900">
          Unable to load dashboard
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>

        <button
          onClick={onRetry}
          className="
            mt-6
            rounded-xl
            bg-indigo-600
            px-6
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-indigo-700
            active:scale-[0.98]
          "
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;
