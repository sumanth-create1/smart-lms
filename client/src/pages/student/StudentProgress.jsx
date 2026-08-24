import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  PlayCircle,
  TrendingUp,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

// =====================================================
// HELPERS
// =====================================================

const formatWatchTime = (seconds = 0) => {
  const totalSeconds = Math.max(0, Number(seconds) || 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return `${Math.floor(totalSeconds)}s`;
};

const getCourseTitle = (course) =>
  course?.courseTitle || "Untitled Course";

const getCourseThumbnail = (course) =>
  course?.thumbnail?.url ||
  course?.thumbnail ||
  null;

// =====================================================
// MAIN COMPONENT
// =====================================================

const StudentProgress = () => {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

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
          response.data?.message ||
            "Unable to load student progress."
        );
      }

      setProgress(response.data);
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
    const courses = progress?.courses || [];

    switch (activeFilter) {
      case "in-progress":
        return courses.filter(
          (course) =>
            course.progressPercentage > 0 &&
            !course.completed
        );

      case "completed":
        return courses.filter(
          (course) => course.completed
        );

      case "not-started":
        return courses.filter(
          (course) =>
            course.progressPercentage === 0
        );

      default:
        return courses;
    }
  }, [progress, activeFilter]);

  // ===================================================
  // CONTINUE LEARNING
  // ===================================================

  const handleContinueLearning = (courseData) => {
    if (!courseData?.course?._id) {
      toast.error("Course information is unavailable.");
      return;
    }

    navigate(
      `/courses/${courseData.course._id}/learn`
    );
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return <ProgressLoading />;
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">

        {/* HEADER */}

        <ProgressHeader />

        {/* STATS */}

        <ProgressStats
          stats={progress?.stats}
        />

        {/* FILTER */}

        <ProgressFilters
          activeFilter={activeFilter}
          onChange={setActiveFilter}
        />

        {/* COURSES */}

        {filteredCourses.length === 0 ? (
          <ProgressEmptyState
            filter={activeFilter}
          />
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((courseData) => (
              <CourseProgressCard
                key={courseData.course._id}
                courseData={courseData}
                onContinue={() =>
                  handleContinueLearning(courseData)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// HEADER
// =====================================================

const ProgressHeader = () => {
  return (
    <div className="mb-7">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
        Learning Analytics
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        My Progress
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
        Track your learning journey, monitor completed
        lectures, and continue where you left off.
      </p>
    </div>
  );
};

// =====================================================
// STATS
// =====================================================

const ProgressStats = ({ stats }) => {
  const items = [
    {
      title: "Total Courses",
      value: stats?.totalCourses ?? 0,
      description: "Courses enrolled",
      icon: BookOpen,
    },
    {
      title: "Completed",
      value: stats?.completedCourses ?? 0,
      description: "Courses completed",
      icon: CheckCircle2,
    },
    {
      title: "In Progress",
      value: stats?.coursesInProgress ?? 0,
      description: "Currently learning",
      icon: PlayCircle,
    },
    {
      title: "Overall Progress",
      value: `${stats?.overallProgress ?? 0}%`,
      description: "Across all courses",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400">
                  {item.title}
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {item.value}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {item.description}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <Icon
                  size={19}
                  className="text-gray-700"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =====================================================
// FILTERS
// =====================================================

const ProgressFilters = ({
  activeFilter,
  onChange,
}) => {
  const filters = [
    {
      label: "All Courses",
      value: "all",
    },
    {
      label: "In Progress",
      value: "in-progress",
    },
    {
      label: "Completed",
      value: "completed",
    },
    {
      label: "Not Started",
      value: "not-started",
    },
  ];

  return (
    <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
      {filters.map((filter) => {
        const active =
          activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={`
              shrink-0 rounded-xl px-4 py-2.5
              text-sm font-semibold transition
              ${
                active
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            {filter.label}
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
  courseData,
  onContinue,
}) => {
  const {
    course,
    completedLectures = 0,
    totalLectures = 0,
    progressPercentage = 0,
    totalWatchedSeconds = 0,
    completed,
  } = courseData;

  const thumbnail = getCourseThumbnail(course);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">

      <div className="flex flex-col md:flex-row">

        {/* THUMBNAIL */}

        <div className="h-48 shrink-0 bg-gray-100 md:h-auto md:w-64">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={getCourseTitle(course)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center">
              <BookOpen
                size={42}
                className="text-gray-300"
              />
            </div>
          )}
        </div>

        {/* CONTENT */}

        <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6">

          <div>
            <div className="flex flex-wrap items-center gap-2">
              {completed ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                  <CheckCircle2 size={13} />
                  Completed
                </span>
              ) : progressPercentage > 0 ? (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  In Progress
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                  Not Started
                </span>
              )}

              {course?.level && (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                  {course.level}
                </span>
              )}
            </div>

            <h2 className="mt-3 text-xl font-bold text-gray-900">
              {getCourseTitle(course)}
            </h2>

            {course?.courseSubtitle && (
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                {course.courseSubtitle}
              </p>
            )}

            {/* PROGRESS */}

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Course Progress
                </span>

                <span className="text-sm font-bold text-gray-900">
                  {progressPercentage}%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-900 transition-all duration-500"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>
            </div>

            {/* META */}

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} />
                {completedLectures} / {totalLectures} lectures
              </span>

              <span className="flex items-center gap-1.5">
                <Clock3 size={14} />
                {formatWatchTime(
                  totalWatchedSeconds
                )}{" "}
                watched
              </span>
            </div>
          </div>

          {/* ACTION */}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              {completed
                ? "Review Course"
                : progressPercentage > 0
                  ? "Continue Learning"
                  : "Start Learning"}

              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const ProgressEmptyState = ({ filter }) => {
  const messages = {
    all: {
      title: "No courses yet",
      description:
        "Enroll in a course to start tracking your learning progress.",
    },

    "in-progress": {
      title: "No courses in progress",
      description:
        "Start a course and your learning progress will appear here.",
    },

    completed: {
      title: "No completed courses",
      description:
        "Complete a course to see it in your achievements.",
    },

    "not-started": {
      title: "No courses waiting to start",
      description:
        "All your enrolled courses have some learning activity.",
    },
  };

  const content =
    messages[filter] || messages.all;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
        <BookOpen
          size={26}
          className="text-gray-500"
        />
      </div>

      <h2 className="mt-5 text-lg font-bold text-gray-900">
        {content.title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {content.description}
      </p>
    </div>
  );
};

// =====================================================
// LOADING
// =====================================================

const ProgressLoading = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#F7F6F2]">
      <div className="text-center">
        <LoaderCircle
          size={38}
          className="mx-auto animate-spin text-gray-900"
        />

        <p className="mt-4 text-sm text-gray-500">
          Loading your progress...
        </p>
      </div>
    </div>
  );
};

export default StudentProgress;