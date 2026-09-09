import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Castle,
  Clock3,
  Crown,
  Feather,
  Flame,
  LoaderCircle,
  PlayCircle,
  Shield,
  Sparkles,
  Sword,
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
    <div className="relative min-h-screen overflow-hidden bg-[#07090b] text-white">

      {/* =================================================
          GLOBAL MEDIEVAL BACKGROUND
      ================================================= */}

      <RealmBackground />

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

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

        <section className="mt-10">

          <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <Sword
                  size={14}
                  className="text-[#c9a45c]"
                />

                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c9a45c]">
                  The Great Chronicle
                </p>

              </div>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Course Progress
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Every lesson mastered strengthens your place within the realm.
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
            <div className="space-y-5">

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

      <style>{`
        @keyframes moonFloat {
          0%,100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(10px);
          }
        }

        @keyframes fogMove {
          0%,100% {
            transform: translateX(-3%);
          }
          50% {
            transform: translateX(3%);
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
            transform: translateY(100vh) translateX(35px);
            opacity: 0;
          }
        }

        @keyframes emberFloat {
          0% {
            transform: translateY(0) scale(.7);
            opacity: 0;
          }
          20% {
            opacity: .8;
          }
          100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
          }
        }

        @keyframes torchFlicker {
          0%,100% {
            opacity: .4;
            transform: scale(.9);
          }
          50% {
            opacity: .9;
            transform: scale(1.1);
          }
        }

        @keyframes castlePulse {
          0%,100% {
            opacity: .55;
          }
          50% {
            opacity: .8;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        @keyframes crownFloat {
          0%,100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-6px) rotate(2deg);
          }
        }

        @keyframes swordFloat {
          0%,100% {
            transform: rotate(-8deg) translateY(0);
          }
          50% {
            transform: rotate(-3deg) translateY(-4px);
          }
        }

        @keyframes shieldPulse {
          0%,100% {
            box-shadow: 0 0 0 rgba(125,211,252,0);
          }
          50% {
            box-shadow: 0 0 30px rgba(125,211,252,.15);
          }
        }

        @keyframes runeGlow {
          0%,100% {
            opacity: .25;
          }
          50% {
            opacity: .8;
          }
        }
      `}</style>

    </div>
  );
};

// =====================================================
// REALM BACKGROUND
// =====================================================

const RealmBackground = () => {
  const snow = Array.from({ length: 35 });
  const embers = Array.from({ length: 18 });

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

      {/* Deep sky */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(87,112,135,.16),transparent_32%),linear-gradient(180deg,#080b0f_0%,#090b0e_45%,#050608_100%)]" />

      {/* Moon */}

      <div
        className="absolute right-[8%] top-[7%] h-32 w-32 rounded-full bg-[#dce5e8]/10 blur-[1px]"
        style={{
          animation: "moonFloat 7s ease-in-out infinite",
          boxShadow:
            "0 0 70px rgba(190,215,225,.10)",
        }}
      />

      <div className="absolute right-[8.7%] top-[7.7%] h-28 w-28 rounded-full border border-white/10 bg-[#cbd5d9]/10" />

      {/* Mountains */}

      <div className="absolute bottom-0 left-0 right-0 h-[42%] opacity-70">

        <div
          className="absolute bottom-0 left-[-10%] h-[55%] w-[65%]"
          style={{
            clipPath:
              "polygon(0 100%,0 75%,18% 40%,31% 70%,47% 18%,61% 60%,75% 30%,100% 100%)",
            background:
              "linear-gradient(145deg,#11161b,#07090b)",
          }}
        />

        <div
          className="absolute bottom-0 right-[-15%] h-[65%] w-[70%]"
          style={{
            clipPath:
              "polygon(0 100%,12% 48%,25% 72%,43% 20%,56% 55%,72% 30%,88% 62%,100% 40%,100% 100%)",
            background:
              "linear-gradient(145deg,#0e1317,#050608)",
          }}
        />

      </div>

      {/* Castle silhouette */}

      <div
        className="absolute bottom-[7%] left-1/2 -translate-x-1/2 text-zinc-800/60"
        style={{
          animation: "castlePulse 8s ease-in-out infinite",
        }}
      >
        <Castle size={230} strokeWidth={0.6} />
      </div>

      {/* Horizon glow */}

      <div className="absolute bottom-[20%] left-1/2 h-32 w-[70%] -translate-x-1/2 rounded-full bg-[#8abbd4]/5 blur-3xl" />

      {/* Fog */}

      <div
        className="absolute bottom-[13%] left-[-10%] h-32 w-[120%] rounded-[50%] bg-zinc-300/[0.035] blur-3xl"
        style={{
          animation: "fogMove 16s ease-in-out infinite",
        }}
      />

      <div
        className="absolute bottom-[24%] left-[-10%] h-20 w-[120%] rounded-[50%] bg-zinc-300/[0.025] blur-2xl"
        style={{
          animation: "fogMove 21s ease-in-out infinite reverse",
        }}
      />

      {/* Snow */}

      {snow.map((_, index) => (
        <span
          key={`snow-${index}`}
          className="absolute h-1 w-1 rounded-full bg-white/40"
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 13) % 70}%`,
            animation: `snowFall ${
              8 + (index % 7)
            }s linear infinite`,
            animationDelay: `${-(index % 9)}s`,
          }}
        />
      ))}

      {/* Embers */}

      {embers.map((_, index) => (
        <span
          key={`ember-${index}`}
          className="absolute h-1 w-1 rounded-full bg-[#c9a45c]/50"
          style={{
            left: `${(index * 47) % 100}%`,
            bottom: `${8 + ((index * 7) % 35)}%`,
            animation: `emberFloat ${
              4 + (index % 4)
            }s ease-out infinite`,
            animationDelay: `${-(index % 5)}s`,
          }}
        />
      ))}

      {/* Vignette */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,.68)_100%)]" />

      {/* Top atmospheric line */}

      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/30 to-transparent" />

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
    <section className="relative overflow-hidden rounded-3xl border border-[#c9a45c]/20 bg-[#090c10]/90 p-6 shadow-[0_25px_80px_rgba(0,0,0,.45)] backdrop-blur-md sm:p-8">

      {/* Cinematic glows */}

      <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#86c7e8]/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#c9a45c]/10 blur-3xl" />

      {/* Stone texture */}

      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(135deg,transparent_45%,white_46%,transparent_47%)] [background-size:9px_9px]" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div className="max-w-2xl">

          {/* Label */}

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c9a45c]/25 bg-[#c9a45c]/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#d5b66d]">

            <Feather
              size={14}
              className="text-[#8fc7e5]"
            />

            The Maester's Record

          </div>

          {/* Heading */}

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">

            My Progress

          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">

            The realm keeps record of every lesson you conquer.
            Track your journey, strengthen your knowledge,
            and continue your march toward mastery.

          </p>

          {/* Mini stats */}

          <div className="mt-6 flex flex-wrap gap-3">

            <MiniHeaderStat
              icon={BookOpen}
              value={data.totalCourses}
              label="Courses"
            />

            <MiniHeaderStat
              icon={CheckCircle2}
              value={data.completedLectures}
              label="Lectures conquered"
            />

            <MiniHeaderStat
              icon={Flame}
              value={`${progress}%`}
              label="Realm progress"
            />

          </div>

        </div>

        {/* Overall Progress */}

        <div className="relative flex shrink-0 items-center gap-5 overflow-hidden rounded-2xl border border-[#c9a45c]/20 bg-black/30 p-5 backdrop-blur-sm">

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/60 to-transparent" />

          <div
            className="absolute -right-8 -top-8 opacity-10"
            style={{
              animation:
                "crownFloat 5s ease-in-out infinite",
            }}
          >
            <Crown size={100} />
          </div>

          <ProgressRing percentage={progress} />

          <div className="relative">

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Realm Progress
            </p>

            <p className="mt-1 text-3xl font-bold text-white">
              {progress}%
            </p>

            <p className="mt-1 text-xs text-[#c9a45c]">
              The journey continues
            </p>

          </div>

        </div>

      </div>

      {/* Bottom gold line */}

      <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/50 to-transparent" />

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
    <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2">

      <Icon
        size={15}
        className="text-[#9bd2ed]"
      />

      <span className="text-sm font-bold text-white">
        {value}
      </span>

      <span className="text-xs text-zinc-500">
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

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (percentage / 100) *
      circumference;

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
          strokeWidth="7"
          className="text-white/[0.07]"
        />

        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-[#9bd2ed] transition-all duration-1000"
          style={{
            filter:
              "drop-shadow(0 0 6px rgba(155,210,237,.45))",
          }}
        />

      </svg>

      <div className="absolute inset-0 flex items-center justify-center">

        <Shield
          size={21}
          className="text-[#c9a45c]"
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
        iconClass="text-[#9bd2ed]"
        accent="ice"
      />

      <StatCard
        title="Completed"
        value={data.completedCourses}
        description="Courses completed"
        icon={Crown}
        iconClass="text-[#d7b66c]"
        accent="gold"
      />

      <StatCard
        title="Learning Hours"
        value={`${totalHours.toFixed(1)}h`}
        description="Total watched time"
        icon={Clock3}
        iconClass="text-[#b9c5cc]"
        accent="steel"
      />

      <StatCard
        title="Overall Progress"
        value={`${data.overallProgress}%`}
        description={`${data.completedLectures} lectures completed`}
        icon={TrendingUp}
        iconClass="text-[#9bd2ed]"
        accent="blue"
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
  accent,
}) => {
  const accentColor =
    accent === "gold"
      ? "hover:border-[#c9a45c]/40"
      : "hover:border-[#8fc7e5]/35";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e12]/90 p-5 shadow-[0_12px_35px_rgba(0,0,0,.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${accentColor}`}
    >

      {/* Decorative corner */}

      <div className="absolute right-0 top-0 h-16 w-16 border-l border-b border-white/5 opacity-40" />

      <div className="absolute -right-4 -top-4 opacity-[0.025] transition-transform duration-500 group-hover:scale-125">
        <Castle size={90} />
      </div>

      <div className="relative flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-zinc-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            {description}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] ${iconClass}`}
        >
          <Icon size={20} />
        </div>

      </div>

      <div className="mt-5 h-px bg-gradient-to-r from-[#c9a45c]/20 via-white/5 to-transparent" />

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
    <div className="flex w-full overflow-x-auto rounded-xl border border-white/10 bg-[#0b0e12] p-1 shadow-lg sm:w-auto">

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
            className={`relative whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all sm:px-4 ${
              active
                ? "bg-[#c9a45c]/15 text-[#e0c47b] shadow-[inset_0_0_15px_rgba(201,164,92,.08)]"
                : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
            }`}
          >

            {filter.label}

            <span
              className={`ml-1.5 ${
                active
                  ? "text-[#8fc7e5]"
                  : "text-zinc-600"
              }`}
            >
              {getCount(filter.key)}
            </span>

            {active && (
              <span className="absolute bottom-0 left-1/2 h-px w-8 -translate-x-1/2 bg-[#c9a45c]" />
            )}

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

  const status =
    getStatusLabel(course.status);

  const watchedMinutes = Math.floor(
    course.watchedSeconds / 60
  );

  const progress = Math.min(
    Number(course.progressPercentage) || 0,
    100
  );

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d11]/95 shadow-[0_18px_50px_rgba(0,0,0,.28)] transition-all duration-300 hover:border-[#c9a45c]/25 hover:shadow-[0_20px_60px_rgba(0,0,0,.45)]">

      {/* Gold top line */}

      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/35 to-transparent" />

      <div className="flex flex-col lg:flex-row">

        {/* =================================================
            THUMBNAIL
        ================================================= */}

        <div className="relative h-52 w-full shrink-0 overflow-hidden bg-[#0d1115] lg:h-auto lg:w-[310px]">

          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.courseTitle}
              className="h-full min-h-[230px] w-full object-cover opacity-75 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
            />
          ) : (
            <div className="flex h-full min-h-[230px] items-center justify-center">

              <BookOpen
                size={48}
                className="text-zinc-700"
              />

            </div>
          )}

          {/* Cinematic overlay */}

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-black/70" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Snow-like texture */}

          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_30%,white_0,transparent_1px),radial-gradient(circle_at_70%_65%,white_0,transparent_1px)] [background-size:45px_45px]" />

          {/* Castle icon */}

          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/35 text-[#c9a45c] backdrop-blur-sm">

            <Castle size={19} />

          </div>

          {/* Progress */}

          <div className="absolute bottom-4 left-4 right-4">

            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">

              <span>
                Quest Progress
              </span>

              <span>
                {progress}%
              </span>

            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/60">

              <div
                className="h-full rounded-full bg-gradient-to-r from-[#8fc7e5] via-[#c9a45c] to-[#e0c47b] transition-all duration-700"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6">

          <div>

            <div className="flex flex-wrap items-center justify-between gap-3">

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${status.className}`}
              >

                {status.icon && (
                  <status.icon size={12} />
                )}

                {status.label}

              </span>

              <span className="text-lg font-bold text-[#d7b66c]">
                {progress}%
              </span>

            </div>

            <h3 className="mt-4 line-clamp-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              {course.courseTitle}
            </h3>

            {/* Progress */}

            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">
                  Chronicle Progress
                </span>

                <span className="text-xs font-semibold text-zinc-400">
                  {progress}%
                </span>

              </div>

              <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.06]">

                <div
                  className="relative h-full rounded-full bg-gradient-to-r from-[#8fc7e5] via-[#c9a45c] to-[#d8b86d] transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                  }}
                >

                  <div
                    className="absolute inset-y-0 w-20 bg-white/20 blur-sm"
                    style={{
                      animation:
                        "shimmer 2.5s linear infinite",
                    }}
                  />

                </div>

              </div>

            </div>

            {/* DETAILS */}

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-zinc-500">

              <span className="flex items-center gap-1.5">

                <BookOpen
                  size={14}
                  className="text-[#8fc7e5]"
                />

                {course.completedLectures} /{" "}
                {course.totalLectures} lectures

              </span>

              <span className="flex items-center gap-1.5">

                <Clock3
                  size={14}
                  className="text-[#c9a45c]"
                />

                {watchedMinutes}m watched

              </span>

            </div>

          </div>

          {/* ACTION */}

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-5">

            <div className="hidden text-xs text-zinc-600 sm:block">

              {course.status === "completed"
                ? "The quest has been conquered."
                : course.status === "not-started"
                ? "Your quest awaits."
                : "The road continues."}

            </div>

            <button
              type="button"
              onClick={onContinue}
              className="ml-auto inline-flex items-center gap-2 rounded-xl border border-[#c9a45c]/30 bg-[#c9a45c]/10 px-4 py-2.5 text-sm font-semibold text-[#dfc47b] transition-all hover:border-[#c9a45c]/50 hover:bg-[#c9a45c]/15 hover:text-white active:scale-[0.98]"
            >

              <PlayCircle size={16} />

              {course.status === "not-started"
                ? "Begin Quest"
                : course.status === "completed"
                ? "Review Chronicle"
                : "Continue Quest"}

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />

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
      icon: Crown,
      className:
        "border-[#c9a45c]/20 bg-[#c9a45c]/10 text-[#d9bd72]",
    };
  }

  if (status === "in-progress") {
    return {
      label: "In Progress",
      icon: Flame,
      className:
        "border-[#8fc7e5]/20 bg-[#8fc7e5]/10 text-[#9fd6ee]",
    };
  }

  return {
    label: "Not Started",
    icon: Shield,
    className:
      "border-white/10 bg-white/[0.04] text-zinc-400",
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
        total +
        (Number(item.hours) || 0),
      0
    );

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d11]/95 p-6 shadow-[0_15px_50px_rgba(0,0,0,.3)]">

      <div className="absolute -right-12 -top-12 opacity-[0.025]">
        <Castle size={170} />
      </div>

      <div className="relative flex items-start justify-between">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8fc7e5]">
            Weekly Chronicle
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-white">
            Learning Activity
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            The record of your training across the realm.
          </p>

        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#8fc7e5]/15 bg-[#8fc7e5]/5 text-[#8fc7e5]">

          <TrendingUp size={19} />

        </div>

      </div>

      {/* TOTAL */}

      <div className="relative mt-5 flex items-end gap-2">

        <span className="text-3xl font-bold text-white">
          {totalWeeklyHours.toFixed(1)}h
        </span>

        <span className="mb-1 text-xs text-zinc-600">
          this week
        </span>

      </div>

      {/* CHART */}

      <div className="relative mt-7 flex h-56 items-end justify-between gap-2">

        {weeklyActivity.length > 0 ? (
          weeklyActivity.map((item) => {

            const hours =
              Number(item.hours) || 0;

            const height =
              hours > 0
                ? Math.max(
                    (hours / maxHours) *
                      100,
                    8
                  )
                : 4;

            return (
              <div
                key={item.day}
                className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
              >

                <div className="relative flex w-full flex-1 items-end justify-center">

                  {hours > 0 && (
                    <div className="absolute bottom-full mb-2 hidden rounded-lg border border-[#c9a45c]/20 bg-[#090c10] px-2 py-1 text-[10px] font-semibold text-[#dfc47b] shadow-xl group-hover:block">
                      {hours}h
                    </div>
                  )}

                  <div
                    className="relative w-full max-w-[38px] overflow-hidden rounded-t-xl border border-[#c9a45c]/10 bg-gradient-to-t from-[#536c79] via-[#9bb5c0] to-[#d2b36b] opacity-80 transition-all duration-500 group-hover:opacity-100"
                    style={{
                      height: `${height}%`,
                    }}
                  >

                    <div className="absolute inset-x-0 top-0 h-px bg-white/40" />

                    <div
                      className="absolute inset-y-0 -left-full w-1/2 bg-white/20 blur-sm"
                      style={{
                        animation:
                          "shimmer 3s linear infinite",
                      }}
                    />

                  </div>

                </div>

                <span className="text-xs font-medium text-zinc-600 transition-colors group-hover:text-zinc-300">
                  {item.day}
                </span>

              </div>
            );
          })
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-zinc-600">

            <Feather size={22} />

            No activity recorded yet.

          </div>
        )}

      </div>

      <div className="mt-5 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/15 to-transparent" />

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
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d11]/95 p-6 shadow-[0_15px_50px_rgba(0,0,0,.3)]">

      <div className="absolute -right-8 -top-8 opacity-[0.025]">
        <Crown size={150} />
      </div>

      <div className="relative flex items-start justify-between">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c9a45c]">
            Realm Record
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-white">
            Learning Overview
          </h2>

        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c9a45c]/15 bg-[#c9a45c]/5 text-[#c9a45c]">

          <Trophy size={19} />

        </div>

      </div>

      {/* COURSE COMPLETION */}

      <div className="relative mt-6 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">

        <div className="flex items-center justify-between">

          <span className="text-sm font-semibold text-zinc-300">
            Course completion
          </span>

          <span className="text-sm font-bold text-[#dfc47b]">
            {completionRate}%
          </span>

        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">

          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8fc7e5] to-[#c9a45c] transition-all duration-700"
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
    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">

      <span className="text-sm text-zinc-500">
        {label}
      </span>

      <span className="text-sm font-bold text-zinc-200">
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
      (watchedHours / goalHours) *
        100
    ),
    100
  );

  const remainingHours = Math.max(
    goalHours - watchedHours,
    0
  );

  return (
    <section className="relative mt-6 overflow-hidden rounded-2xl border border-[#c9a45c]/20 bg-[#0a0d11]/95 shadow-[0_15px_50px_rgba(0,0,0,.3)]">

      {/* Decorative sword */}

      <div
        className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 opacity-[0.035] sm:block"
        style={{
          animation:
            "swordFloat 5s ease-in-out infinite",
        }}
      >
        <Sword size={170} />
      </div>

      <div className="relative p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">

            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#c9a45c]/20 bg-[#c9a45c]/10 text-[#d9bd72]"
              style={{
                animation:
                  "shieldPulse 4s ease-in-out infinite",
              }}
            >
              <Target size={21} />
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c9a45c]">
                Weekly Quest
              </p>

              <h2 className="mt-1 font-bold text-white">
                Earn your place in the realm
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Aim for {goalHours} hours of learning this week.
              </p>

            </div>

          </div>

          <div className="sm:text-right">

            <p className="text-3xl font-bold tracking-tight text-white">
              {watchedHours.toFixed(1)}h
            </p>

            <p className="text-xs text-zinc-600">
              of {goalHours}h goal
            </p>

          </div>

        </div>

        <div className="mt-6">

          <div className="flex items-center justify-between text-xs font-medium text-zinc-500">

            <span>
              {percentage}% conquered
            </span>

            <span className="text-[#c9a45c]">

              {remainingHours > 0
                ? `${remainingHours.toFixed(
                    1
                  )}h remaining`
                : "Quest completed"}

            </span>

          </div>

          <div className="mt-2 h-3 overflow-hidden rounded-full border border-white/[0.05] bg-white/[0.04]">

            <div
              className="relative h-full rounded-full bg-gradient-to-r from-[#7caec7] via-[#c9a45c] to-[#e1c77f] transition-all duration-700"
              style={{
                width: `${percentage}%`,
              }}
            >

              <div className="absolute right-0 top-0 h-full w-8 bg-white/25 blur-sm" />

            </div>

          </div>

        </div>

      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#c9a45c]/40 to-transparent" />

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

  let title =
    "Every lesson strengthens your blade.";

  let description =
    "Keep showing up. The realm rewards those who remain disciplined.";

  if (overallProgress >= 80) {

    title =
      "Your conquest is nearly complete.";

    description =
      "You've crossed most of the road. Finish strong and claim your mastery.";

  } else if (overallProgress >= 50) {

    title =
      "Half the road is behind you.";

    description =
      "Your foundation is strong. Keep moving forward and sharpen your knowledge.";

  } else if (watchedHours > 0) {

    title =
      "The journey has begun.";

    description =
      "You've taken your first steps. Stay consistent and continue your quest.";

  }

  return (
    <section className="relative mt-6 overflow-hidden rounded-2xl border border-[#c9a45c]/25 bg-gradient-to-r from-[#0c1115] via-[#111820] to-[#0a0d10] p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,.35)]">

      {/* Atmospheric glow */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#8fc7e5]/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-[#c9a45c]/10 blur-3xl" />

      {/* Castle */}

      <div className="pointer-events-none absolute bottom-0 right-10 opacity-[0.035]">
        <Castle size={190} />
      </div>

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#c9a45c]/20 bg-[#c9a45c]/10">

            <Flame
              size={21}
              className="text-[#d9bd72]"
            />

          </div>

          <div>

            <h2 className="font-bold text-white">
              {title}
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-6 text-zinc-400">
              {description}
            </p>

          </div>

        </div>

        <div className="hidden text-right sm:block">

          <div className="flex items-center justify-end gap-2">

            <Sparkles
              size={14}
              className="text-[#c9a45c]"
            />

            <p className="text-2xl font-bold text-[#dfc47b]">
              {overallProgress}%
            </p>

          </div>

          <p className="text-xs uppercase tracking-[0.12em] text-zinc-600">
            Realm progress
          </p>

        </div>

      </div>

      <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/50 to-transparent" />

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
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-[#c9a45c]/20 bg-[#0a0d11]/90 p-12 text-center">

      <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[#8fc7e5]/5 blur-3xl" />

      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c9a45c]/20 bg-[#c9a45c]/5">

        <Shield
          size={28}
          className="text-[#c9a45c]"
        />

      </div>

      <h2 className="relative mt-5 font-bold text-white">
        No quests found
      </h2>

      <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
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
    <div className="relative min-h-screen overflow-hidden bg-[#07090b] px-4 py-8">

      <RealmBackground />

      <div className="relative z-10 mx-auto max-w-[1500px] animate-pulse">

        <div className="relative h-64 overflow-hidden rounded-3xl border border-white/10 bg-[#0b0e12]">

          <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-[#8fc7e5]/5 blur-3xl" />

        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl border border-white/5 bg-[#0b0e12]"
            />
          ))}

        </div>

        <div className="mt-8 h-10 w-80 rounded-xl bg-[#0b0e12]" />

        <div className="mt-5 space-y-4">

          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-64 rounded-2xl border border-white/5 bg-[#0b0e12]"
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07090b] px-4">

      <RealmBackground />

      <div className="relative z-10 max-w-md overflow-hidden rounded-2xl border border-[#c9a45c]/20 bg-[#0a0d11]/95 p-8 text-center shadow-[0_25px_80px_rgba(0,0,0,.5)]">

        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/50 to-transparent" />

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-400/20 bg-red-400/5 text-red-300">

          <TrendingUp size={25} />

        </div>

        <h2 className="mt-5 text-lg font-bold text-white">
          The chronicle could not be opened
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Something went wrong while loading your learning record.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#c9a45c]/30 bg-[#c9a45c]/10 px-5 py-2.5 text-sm font-semibold text-[#dfc47b] transition hover:bg-[#c9a45c]/20 hover:text-white"
        >

          <LoaderCircle size={16} />

          Reopen Chronicle

        </button>

      </div>

    </div>
  );
};

// =====================================================
// EXPORT
// =====================================================

export default StudentProgress;