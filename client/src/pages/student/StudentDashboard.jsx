import { useEffect, useState } from "react";
import { LoaderCircle, AlertCircle, RefreshCw } from "lucide-react";

import api from "../../services/api";

import WelcomeBanner from "./components/student/WelcomeBanner";
import StatsGrid from "./components/student/StatsGrid";
import ContinueLearning from "./components/student/ContinueLearning";
import WeeklyGoal from "./components/student/WeeklyGoal";
import LearningActivity from "./components/student/LearningActivity";
import RecentActivity from "./components/student/RecentActivity";
import MyCourses from "./components/student/MyCourses";

function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/student");

      const data = response.data;

      console.log("Dashboard API response:", data);

      if (!data?.success) {
        throw new Error(data?.message || "Failed to load dashboard");
      }

      setDashboard(data);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* Loading */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle size={32} className="animate-spin text-indigo-600" />

          <p className="text-sm font-medium text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle size={24} className="text-red-500" />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Couldn't load your dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>

          <button
            type="button"
            onClick={fetchDashboard}
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
            "
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* Dashboard */
  return (
    <div className="!block !w-full space-y-6 lg:space-y-8">
      <WelcomeBanner />

      <StatsGrid stats={dashboard?.stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
        <ContinueLearning courses={dashboard?.courses || []} />

        <WeeklyGoal weeklyGoal={dashboard?.stats?.weeklyGoal} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,1fr)]">
        <LearningActivity activity={dashboard?.activity || []} />

        <RecentActivity activities={dashboard?.recentActivity || []} />
      </div>

      <MyCourses courses={dashboard?.courses || []} />
    </div>
  );
}

export default StudentDashboard;
