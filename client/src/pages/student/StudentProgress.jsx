import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Flame,
  LoaderCircle,
  PlayCircle,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

// =====================================================
// CONSTANTS
// =====================================================

const FILTERS = {
  ALL: "all",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  NOT_STARTED: "not-started",
};

const FILTER_CONFIG = [
  {
    key: FILTERS.ALL,
    label: "All Courses",
  },
  {
    key: FILTERS.IN_PROGRESS,
    label: "In Progress",
  },
  {
    key: FILTERS.COMPLETED,
    label: "Completed",
  },
  {
    key: FILTERS.NOT_STARTED,
    label: "Not Started",
  },
];

// =====================================================
// MAIN COMPONENT
// =====================================================

const StudentProgress = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [activeFilter, setActiveFilter] = useState(FILTERS.ALL);
  const [loading, setLoading] = useState(true);

  // ===================================================
  // FETCH PROGRESS
  // ===================================================

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);

      const response = await api.get("/progress/student");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to load progress."
        );
      }

      setData(response.data.data);
    } catch (error) {
      console.error("Student progress error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load your progress."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // FILTER COURSES
  // ===================================================

  const filteredCourses = useMemo(() => {
    if (!data?.courses) {
      return [];
    }

    if (activeFilter === FILTERS.ALL) {
      return data.courses;
    }

    return data.courses.filter(
      (course) => course.status === activeFilter
    );
  }, [data, activeFilter]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return <ProgressLoading />;
  }

  // ===================================================
  // EMPTY
  // ===================================================

  if (!data) {
    return <ProgressError onRetry={fetchProgress} />;
  }

  // ===================================================
  // CALCULATIONS
  // ===================================================

  const watchedHours = data.totalWatchedSeconds / 3600;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <ProgressHeader data={data} />

        {/* =================================================
            STATS
        ================================================= */}

        <ProgressStats data={data} />

        {/* =================================================
            COURSE PROGRESS
        ================================================= */}

        <section className="mt-8">

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
                Your Courses
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                Course Progress
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Keep building momentum across your learning journey.
              </p>
            </div>

            <ProgressFilters
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              data={data}
            />

          </div>

          {filteredCourses.length === 0 ? (
            <EmptyFilterState activeFilter={activeFilter} />
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <CourseProgressCard
                  key={course.courseId}
                  course={course}
                  onContinue={() =>
                    navigate(
                      `/courses/${course.courseId}/learn`
                    )
                  }
                />
              ))}
            </div>
          )}

        </section>

        {/* =================================================
            ANALYTICS
        ================================================= */}

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">

          <WeeklyActivity
            weeklyActivity={data.weeklyActivity}
          />

          <LearningSummary data={data} />

        </div>

        {/* =================================================
            WEEKLY GOAL
        ================================================= */}

        <WeeklyGoal
          totalWatchedSeconds={data.totalWatchedSeconds}
        />

        {/* =================================================
            BOTTOM MOTIVATION
        ================================================= */}

        <MotivationCard
          watchedHours={watchedHours}
          overallProgress={data.overallProgress}
        />

      </div>
    </div>
  );
};

// =====================================================
// PAGE HEADER
// =====================================================

const ProgressHeader = ({ data }) => {
  const progress = Math.min(
    Number(data.overallProgress) || 0,
    100
  );

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gray-950 p-6 text-white shadow-xl sm:p-8">

      {/* Background decoration */}

      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div className="max-w-2xl">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300">
            <TrendingUp size={14} />
            Learning Analytics
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Progress
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-400 sm:text-base">
            Track your learning journey, stay consistent,
            and keep moving toward your goals.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <MiniHeaderStat
              icon={BookOpen}
              value={data.totalCourses}
              label="Courses"
            />

            <MiniHeaderStat
              icon={CheckCircle2}
              value={data.completedLectures}
              label="Lectures done"
            />

            <MiniHeaderStat
              icon={Flame}
              value={`${progress}%`}
              label="Overall"
            />

          </div>

        </div>

        {/* Overall Progress */}

        <div className="flex shrink-0 items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">

          <ProgressRing percentage={progress} />

          <div>
            <p className="text-sm font-semibold text-gray-300">
              Overall Progress
            </p>

            <p className="mt-1 text-2xl font-bold">
              {progress}%
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Keep going!
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};

// =====================================================
// MINI HEADER STAT
// =====================================================

const MiniHeaderStat = ({
  icon: Icon,
  value,
  label,
}) => {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2">

      <Icon
        size={15}
        className="text-indigo-400"
      />

      <span className="text-sm font-bold">
        {value}
      </span>

      <span className="text-xs text-gray-500">
        {label}
      </span>

    </div>
  );
};

// =====================================================
// PROGRESS RING
// =====================================================

const ProgressRing = ({ percentage }) => {
  const radius = 43;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference -
    (percentage / 100) * circumference;

  return (
    <div className="relative h-24 w-24">

      <svg
        className="h-24 w-24 -rotate-90"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-white/10"
        />

        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-indigo-400 transition-all duration-700"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <TrendingUp
          size={20}
          className="text-indigo-300"
        />
      </div>

    </div>
  );
};

// =====================================================
// STATISTICS
// =====================================================

const ProgressStats = ({ data }) => {
  const totalHours =
    data.totalWatchedSeconds / 3600;

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Total Courses"
        value={data.totalCourses}
        description="Courses enrolled"
        icon={BookOpen}
        iconClass="bg-indigo-50 text-indigo-600"
      />

      <StatCard
        title="Completed"
        value={data.completedCourses}
        description="Courses completed"
        icon={CheckCircle2}
        iconClass="bg-emerald-50 text-emerald-600"
      />

      <StatCard
        title="Learning Hours"
        value={`${totalHours.toFixed(1)}h`}
        description="Total watched time"
        icon={Clock3}
        iconClass="bg-orange-50 text-orange-600"
      />

      <StatCard
        title="Overall Progress"
        value={`${data.overallProgress}%`}
        description={`${data.completedLectures} lectures completed`}
        icon={TrendingUp}
        iconClass="bg-purple-50 text-purple-600"
      />

    </section>
  );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
}) => {
  return (
    <div className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={20} />
        </div>

      </div>

    </div>
  );
};

// =====================================================
// FILTERS
// =====================================================

const ProgressFilters = ({
  activeFilter,
  setActiveFilter,
  data,
}) => {
  const getCount = (key) => {
    switch (key) {
      case FILTERS.IN_PROGRESS:
        return data.inProgressCourses;

      case FILTERS.COMPLETED:
        return data.completedCourses;

      case FILTERS.NOT_STARTED:
        return data.notStartedCourses;

      default:
        return data.totalCourses;
    }
  };

  return (
    <div className="flex w-full overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 sm:w-auto">

      {FILTER_CONFIG.map((filter) => {
        const active =
          activeFilter === filter.key;

        return (
          <button
            key={filter.key}
            type="button"
            onClick={() =>
              setActiveFilter(filter.key)
            }
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all sm:px-4 ${
              active
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {filter.label}

            <span
              className={`ml-1.5 ${
                active
                  ? "text-gray-300"
                  : "text-gray-400"
              }`}
            >
              {getCount(filter.key)}
            </span>
          </button>
        );
      })}

    </div>
  );
};

// =====================================================
// COURSE CARD
// =====================================================

const CourseProgressCard = ({
  course,
  onContinue,
}) => {
  const status = getStatusLabel(course.status);

  const watchedMinutes = Math.floor(
    course.watchedSeconds / 60
  );

  const progress = Math.min(
    Number(course.progressPercentage) || 0,
    100
  );

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md">

      <div className="flex flex-col lg:flex-row">

        {/* THUMBNAIL */}

        <div className="relative h-52 w-full shrink-0 overflow-hidden bg-gray-100 lg:h-auto lg:w-[290px]">

          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.courseTitle}
              className="h-full min-h-[210px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-[210px] items-center justify-center">
              <BookOpen
                size={42}
                className="text-gray-300"
              />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

          <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {progress}% complete
          </div>

        </div>

        {/* CONTENT */}

        <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6">

          <div>

            <div className="flex flex-wrap items-center justify-between gap-3">

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
              >
                {status.label}
              </span>

              <span className="text-lg font-bold text-gray-900">
                {progress}%
              </span>

            </div>

            <h3 className="mt-4 line-clamp-2 text-xl font-bold tracking-tight text-gray-900">
              {course.courseTitle}
            </h3>

            {/* PROGRESS */}

            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Course progress
                </span>

                <span className="text-xs font-semibold text-gray-600">
                  {progress}%
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-gray-900 transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

            {/* DETAILS */}

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">

              <span className="flex items-center gap-1.5">
                <BookOpen size={14} />

                {course.completedLectures} /{" "}
                {course.totalLectures} lectures
              </span>

              <span className="flex items-center gap-1.5">
                <Clock3 size={14} />

                {watchedMinutes}m watched
              </span>

            </div>

          </div>

          {/* ACTION */}

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-gray-100 pt-5">

            <div className="hidden text-xs text-gray-400 sm:block">
              {course.status === "completed"
                ? "Course completed"
                : course.status === "not-started"
                ? "Ready to begin?"
                : "Keep your momentum going"}
            </div>

            <button
              type="button"
              onClick={onContinue}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
            >
              <PlayCircle size={16} />

              {course.status === "not-started"
                ? "Start Learning"
                : course.status === "completed"
                ? "Review Course"
                : "Continue Learning"}

              <ArrowRight size={15} />

            </button>

          </div>

        </div>

      </div>

    </article>
  );
};

// =====================================================
// STATUS
// =====================================================

const getStatusLabel = (status) => {
  if (status === "completed") {
    return {
      label: "Completed",
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  if (status === "in-progress") {
    return {
      label: "In Progress",
      className: "bg-indigo-50 text-indigo-700",
    };
  }

  return {
    label: "Not Started",
    className: "bg-gray-100 text-gray-600",
  };
};

// =====================================================
// WEEKLY ACTIVITY
// =====================================================

const WeeklyActivity = ({
  weeklyActivity = [],
}) => {
  const maxHours = Math.max(
    ...weeklyActivity.map(
      (item) => Number(item.hours) || 0
    ),
    1
  );

  const totalWeeklyHours =
    weeklyActivity.reduce(
      (total, item) =>
        total + (Number(item.hours) || 0),
      0
    );

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-500">
            Activity
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900">
            Weekly Learning
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your study activity over the week.
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <TrendingUp size={19} />
        </div>

      </div>

      {/* TOTAL */}

      <div className="mt-5 flex items-end gap-2">

        <span className="text-3xl font-bold text-gray-900">
          {totalWeeklyHours.toFixed(1)}h
        </span>

        <span className="mb-1 text-xs text-gray-400">
          this week
        </span>

      </div>

      {/* CHART */}

      <div className="mt-7 flex h-56 items-end justify-between gap-2">

        {weeklyActivity.length > 0 ? (
          weeklyActivity.map((item) => {
            const hours =
              Number(item.hours) || 0;

            const height =
              hours > 0
                ? Math.max(
                    (hours / maxHours) * 100,
                    8
                  )
                : 4;

            return (
              <div
                key={item.day}
                className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
              >

                <div className="relative flex w-full flex-1 items-end justify-center">

                  {/* Tooltip */}

                  {hours > 0 && (
                    <div className="absolute bottom-full mb-2 hidden rounded-lg bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white group-hover:block">
                      {hours}h
                    </div>
                  )}

                  <div
                    className="w-full max-w-[38px] rounded-t-xl bg-indigo-500 transition-all duration-500 group-hover:bg-indigo-600"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                </div>

                <span className="text-xs font-medium text-gray-400">
                  {item.day}
                </span>

              </div>
            );
          })
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            No activity recorded yet.
          </div>
        )}

      </div>

    </section>
  );
};

// =====================================================
// LEARNING SUMMARY
// =====================================================

const LearningSummary = ({ data }) => {
  const completionRate =
    data.totalCourses > 0
      ? Math.round(
          (data.completedCourses /
            data.totalCourses) *
            100
        )
      : 0;

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
            Summary
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900">
            Learning Overview
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <Trophy size={19} />
        </div>

      </div>

      {/* COURSE COMPLETION */}

      <div className="mt-6 rounded-xl bg-gray-50 p-4">

        <div className="flex items-center justify-between">

          <span className="text-sm font-semibold text-gray-700">
            Course completion
          </span>

          <span className="text-sm font-bold text-gray-900">
            {completionRate}%
          </span>

        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">

          <div
            className="h-full rounded-full bg-orange-500 transition-all duration-700"
            style={{
              width: `${completionRate}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-6 space-y-4">

        <SummaryRow
          label="Courses enrolled"
          value={data.totalCourses}
        />

        <SummaryRow
          label="Courses completed"
          value={data.completedCourses}
        />

        <SummaryRow
          label="Lectures completed"
          value={data.completedLectures}
        />

        <SummaryRow
          label="Overall completion"
          value={`${data.overallProgress}%`}
        />

      </div>

    </section>
  );
};

// =====================================================
// SUMMARY ROW
// =====================================================

const SummaryRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">

      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-bold text-gray-900">
        {value}
      </span>

    </div>
  );
};

// =====================================================
// WEEKLY GOAL
// =====================================================

const WeeklyGoal = ({
  totalWatchedSeconds,
}) => {
  const goalHours = 5;

  const watchedHours =
    totalWatchedSeconds / 3600;

  const percentage = Math.min(
    Math.round(
      (watchedHours / goalHours) * 100
    ),
    100
  );

  const remainingHours = Math.max(
    goalHours - watchedHours,
    0
  );

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">

      <div className="p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Target size={21} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
                Weekly Goal
              </p>

              <h2 className="mt-1 font-bold text-gray-900">
                Keep your learning momentum
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Aim for {goalHours} hours of learning this week.
              </p>
            </div>

          </div>

          <div className="sm:text-right">

            <p className="text-3xl font-bold tracking-tight text-gray-900">
              {watchedHours.toFixed(1)}h
            </p>

            <p className="text-xs text-gray-400">
              of {goalHours}h goal
            </p>

          </div>

        </div>

        <div className="mt-6">

          <div className="flex items-center justify-between text-xs font-medium text-gray-400">
            <span>{percentage}% completed</span>

            <span>
              {remainingHours > 0
                ? `${remainingHours.toFixed(
                    1
                  )}h remaining`
                : "Goal completed 🎉"}
            </span>
          </div>

          <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">

            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-700"
              style={{
                width: `${percentage}%`,
              }}
            />

          </div>

        </div>

      </div>

    </section>
  );
};

// =====================================================
// MOTIVATION CARD
// =====================================================

const MotivationCard = ({
  watchedHours,
  overallProgress,
}) => {
  let title = "Every lecture counts.";

  let description =
    "Keep showing up consistently and your progress will follow.";

  if (overallProgress >= 80) {
    title = "You're almost there! 🚀";

    description =
      "You've made excellent progress. Finish strong and complete your courses.";
  } else if (overallProgress >= 50) {
    title = "You're halfway there! 🔥";

    description =
      "You've built a solid learning foundation. Keep the momentum going.";
  } else if (watchedHours > 0) {
    title = "Great start! 💪";

    description =
      "You've already started your journey. Stay consistent and keep learning.";
  }

  return (
    <section className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 p-6 text-white shadow-lg">

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Flame size={21} />
          </div>

          <div>

            <h2 className="font-bold">
              {title}
            </h2>

            <p className="mt-1 max-w-xl text-sm text-indigo-100">
              {description}
            </p>

          </div>

        </div>

        <div className="hidden text-right sm:block">
          <p className="text-2xl font-bold">
            {overallProgress}%
          </p>

          <p className="text-xs text-indigo-200">
            overall progress
          </p>
        </div>

      </div>

    </section>
  );
};

// =====================================================
// EMPTY FILTER STATE
// =====================================================

const EmptyFilterState = ({
  activeFilter,
}) => {
  const message =
    activeFilter === FILTERS.COMPLETED
      ? "You haven't completed any courses yet."
      : activeFilter === FILTERS.IN_PROGRESS
      ? "You don't have any courses in progress."
      : activeFilter === FILTERS.NOT_STARTED
      ? "You have started all your enrolled courses."
      : "You are not enrolled in any courses yet.";

  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
        <BookOpen
          size={25}
          className="text-gray-400"
        />
      </div>

      <h2 className="mt-4 font-bold text-gray-900">
        No courses found
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {message}
      </p>

    </div>
  );
};

// =====================================================
// LOADING
// =====================================================

const ProgressLoading = () => {
  return (
    <div className="min-h-[70vh] bg-[#f6f7fb] px-4 py-8">

      <div className="mx-auto max-w-[1500px] animate-pulse">

        <div className="h-64 rounded-3xl bg-gray-200" />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl bg-gray-200"
            />
          ))}
        </div>

        <div className="mt-8 h-10 w-80 rounded-xl bg-gray-200" />

        <div className="mt-5 space-y-4">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-64 rounded-2xl bg-gray-200"
            />
          ))}
        </div>

      </div>

    </div>
  );
};

// =====================================================
// ERROR
// =====================================================

const ProgressError = ({
  onRetry,
}) => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#f6f7fb] px-4">

      <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <TrendingUp size={24} />
        </div>

        <h2 className="mt-4 text-lg font-bold text-gray-900">
          Couldn't load your progress
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Something went wrong while loading your learning
          analytics.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          <TrendingUp size={16} />
          Try Again
        </button>

      </div>

    </div>
  );
};

export default StudentProgress;