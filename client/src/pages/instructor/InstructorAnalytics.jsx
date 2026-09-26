import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Crown,
  Flame,
  Gem,
  IndianRupee,
  LoaderCircle,
  Shield,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../../services/api";

/* =====================================================
   CONSTANTS
===================================================== */

const ACCENT_STYLES = {
  orange: {
    icon: "border-orange-500/10 bg-orange-500/[0.07] text-orange-400",
    glow:
      "group-hover:shadow-[0_0_35px_rgba(249,115,22,0.07)]",
  },

  gold: {
    icon: "border-amber-500/10 bg-amber-500/[0.06] text-amber-300",
    glow:
      "group-hover:shadow-[0_0_35px_rgba(245,158,11,0.06)]",
  },

  fire: {
    icon: "border-orange-400/10 bg-orange-400/[0.06] text-orange-300",
    glow:
      "group-hover:shadow-[0_0_35px_rgba(251,146,60,0.07)]",
  },

  amber: {
    icon: "border-yellow-500/10 bg-yellow-500/[0.06] text-yellow-300",
    glow:
      "group-hover:shadow-[0_0_35px_rgba(234,179,8,0.06)]",
  },
};

const LEVEL_STYLES = {
  beginner:
    "border-emerald-500/10 bg-emerald-500/[0.05] text-emerald-400",

  intermediate:
    "border-amber-500/10 bg-amber-500/[0.05] text-amber-300",

  advanced:
    "border-orange-500/10 bg-orange-500/[0.07] text-orange-300",
};

const EMPTY_DATA = {
  overview: {},
  monthlyEnrollments: [],
  coursePerformance: [],
  recentEnrollments: [],
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

function InstructorAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===================================================
     FETCH
  =================================================== */

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/dashboard/instructor/analytics",
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to load analytics",
        );
      }

      setAnalytics(response.data.data);
    } catch (error) {
      console.error(
        "Instructor analytics error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load analytics",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  /* ===================================================
     DERIVED DATA
  =================================================== */

  const {
    overview,
    monthlyEnrollments,
    coursePerformance,
    recentEnrollments,
  } = useMemo(() => {
    return {
      overview:
        analytics?.overview || EMPTY_DATA.overview,

      monthlyEnrollments:
        analytics?.monthlyEnrollments ||
        EMPTY_DATA.monthlyEnrollments,

      coursePerformance:
        analytics?.coursePerformance ||
        EMPTY_DATA.coursePerformance,

      recentEnrollments:
        analytics?.recentEnrollments ||
        EMPTY_DATA.recentEnrollments,
    };
  }, [analytics]);

  const maxEnrollmentCount = useMemo(() => {
    if (!monthlyEnrollments.length) return 1;

    return Math.max(
      ...monthlyEnrollments.map(
        (item) => Number(item.count) || 0,
      ),
      1,
    );
  }, [monthlyEnrollments]);

  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {
    return <AnalyticsLoader />;
  }

  /* ===================================================
     PAGE
  =================================================== */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070605] text-white">

      {/* =================================================
          ATMOSPHERE
      ================================================= */}

      <AnalyticsBackground />

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="relative z-10 mx-auto max-w-[1700px] space-y-8 p-5 sm:p-7 lg:p-10">

        {/* HEADER */}

        <AnalyticsHeader />

        {/* OVERVIEW */}

        <OverviewSection overview={overview} />

        {/* ENROLLMENT */}

        <EnrollmentChart
          data={monthlyEnrollments}
          maxValue={maxEnrollmentCount}
        />

        {/* COURSE PERFORMANCE */}

        <CoursePerformance
          courses={coursePerformance}
        />

        {/* RECENT ENROLLMENTS */}

        <RecentEnrollments
          enrollments={recentEnrollments}
        />

        {/* FOOTER */}

        <AnalyticsFooter />
      </div>
    </main>
  );
}

/* =====================================================
   BACKGROUND
===================================================== */

const AnalyticsBackground = memo(function AnalyticsBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {/* Main orange glow */}

      <div
        className="
          absolute
          -left-48
          -top-48
          h-[600px]
          w-[600px]
          rounded-full
          bg-orange-600/[0.045]
          blur-[140px]
        "
      />

      {/* Gold glow */}

      <div
        className="
          absolute
          -right-48
          top-[10%]
          h-[550px]
          w-[550px]
          rounded-full
          bg-amber-500/[0.035]
          blur-[140px]
        "
      />

      {/* Bottom glow */}

      <div
        className="
          absolute
          bottom-[-280px]
          left-[30%]
          h-[600px]
          w-[600px]
          rounded-full
          bg-orange-700/[0.025]
          blur-[150px]
        "
      />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />
    </div>
  );
});

/* =====================================================
   LOADER
===================================================== */

const AnalyticsLoader = memo(function AnalyticsLoader() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070605] text-white">

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600/[0.055] blur-[130px]" />

        <div className="absolute left-20 top-20 h-36 w-36 rounded-full bg-amber-500/[0.035] blur-[70px]" />

        <div className="absolute bottom-10 right-20 h-48 w-48 rounded-full bg-orange-700/[0.035] blur-[90px]" />

      </div>

      <div className="relative z-10 flex flex-col items-center">

        <div className="relative mb-7">

          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-orange-500/20 bg-[#100d0b] shadow-[0_0_45px_rgba(249,115,22,0.07)]">

            <Crown
              size={30}
              className="text-orange-400"
            />

          </div>

          <div className="absolute -inset-2 animate-pulse rounded-3xl border border-orange-500/10" />

        </div>

        <LoaderCircle
          size={23}
          className="mb-4 animate-spin text-orange-400"
        />

        <p className="text-sm font-semibold tracking-wide text-stone-300">
          Entering the Realm...
        </p>

        <p className="mt-2 text-xs text-stone-600">
          Gathering your kingdom's analytics
        </p>

      </div>
    </div>
  );
});

/* =====================================================
   HEADER
===================================================== */

const AnalyticsHeader = memo(function AnalyticsHeader() {
  return (
    <section>

      <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <div className="mb-4 flex items-center gap-3">

            <div className="flex items-center gap-1">

              <span className="h-px w-8 bg-gradient-to-r from-transparent to-orange-500" />

              <Flame
                size={13}
                className="text-orange-400"
              />

              <span className="h-px w-8 bg-gradient-to-r from-orange-500 to-transparent" />

            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-400">
              The Instructor's Realm
            </span>

          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">

            Analytics

            <span className="ml-3 bg-gradient-to-r from-orange-300 via-amber-300 to-orange-500 bg-clip-text text-transparent">
              & Performance
            </span>

          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
            Command your courses, understand your
            students, and watch your learning realm grow.
          </p>

        </div>

        <div className="flex items-center gap-4 self-start rounded-2xl border border-orange-500/[0.12] bg-[#0e0b09] px-5 py-4 shadow-[0_15px_45px_rgba(0,0,0,0.3)] lg:self-auto">

          <div className="relative">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/10 bg-orange-500/[0.07]">

              <Shield
                size={18}
                className="text-orange-400"
              />

            </div>

            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#0e0b09] bg-orange-400" />

          </div>

          <div>

            <p className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Analytics Online
            </p>

            <p className="mt-1 text-[10px] text-stone-600">
              Realm data synchronized
            </p>

          </div>

        </div>

      </div>

      <div className="mt-8 flex items-center gap-3">

        <div className="h-px flex-1 bg-gradient-to-r from-orange-500/30 via-orange-500/5 to-transparent" />

        <Gem
          size={13}
          className="text-orange-500/40"
        />

        <div className="h-px flex-1 bg-gradient-to-l from-orange-500/30 via-orange-500/5 to-transparent" />

      </div>

    </section>
  );
});

/* =====================================================
   OVERVIEW
===================================================== */

const OverviewSection = memo(function OverviewSection({
  overview,
}) {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

      <AnalyticsCard
        title="Total Courses"
        value={overview.totalCourses || 0}
        icon={<BookOpen size={21} />}
        accent="orange"
        subtitle="Courses in your realm"
      />

      <AnalyticsCard
        title="Total Students"
        value={overview.totalStudents || 0}
        icon={<Users size={21} />}
        accent="gold"
        subtitle="Students under your banner"
      />

      <AnalyticsCard
        title="Total Enrollments"
        value={overview.totalEnrollments || 0}
        icon={<UserPlus size={21} />}
        accent="fire"
        subtitle="Total learning journeys"
      />

      <AnalyticsCard
        title="Estimated Revenue"
        value={`₹${overview.totalRevenue || 0}`}
        icon={<IndianRupee size={21} />}
        accent="amber"
        subtitle="Estimated course revenue"
      />

    </section>
  );
});

/* =====================================================
   ANALYTICS CARD
===================================================== */

const AnalyticsCard = memo(function AnalyticsCard({
  title,
  value,
  icon,
  accent = "orange",
  subtitle,
}) {
  const style =
    ACCENT_STYLES[accent] ||
    ACCENT_STYLES.orange;

  return (
    <article
      className={`
        group
        relative
        overflow-hidden
        rounded-[26px]
        border
        border-orange-500/[0.08]
        bg-[#0e0b09]
        p-6
        shadow-[0_20px_55px_rgba(0,0,0,0.25)]
        transition-[transform,border-color,box-shadow]
        duration-300
        hover:-translate-y-1
        hover:border-orange-500/[0.18]
        ${style.glow}
      `}
    >

      {/* Glow */}

      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-500/[0.025] blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

      {/* Top line */}

      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

      <div className="relative flex items-start justify-between gap-5">

        <div className="min-w-0">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">
            {title}
          </p>

          <p className="mt-3 truncate text-3xl font-black tracking-tight text-white sm:text-4xl">
            {value}
          </p>

          <div className="mt-3 flex items-center gap-2">

            <span className="h-1 w-1 rounded-full bg-orange-400/60" />

            <p className="truncate text-[10px] text-stone-700">
              {subtitle}
            </p>

          </div>

        </div>

        <div
          className={`
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            transition-transform
            duration-300
            group-hover:scale-105
            ${style.icon}
          `}
        >
          {icon}
        </div>

      </div>

      <div className="relative mt-6 h-px overflow-hidden bg-white/[0.035]">

        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent transition-[width] duration-500 group-hover:w-2/3" />

      </div>

    </article>
  );
});

/* =====================================================
   SECTION CARD
===================================================== */

const SectionCard = memo(function SectionCard({
  children,
  className = "",
}) {
  return (
    <section
      className={`
        overflow-hidden
        rounded-[28px]
        border
        border-orange-500/[0.09]
        bg-[#0d0a08]
        shadow-[0_25px_65px_rgba(0,0,0,0.28)]
        ${className}
      `}
    >
      {children}
    </section>
  );
});

/* =====================================================
   SECTION HEADER
===================================================== */

const SectionHeader = memo(function SectionHeader({
  icon,
  title,
  description,
  right,
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/[0.05] px-6 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between">

      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-500/10 bg-orange-500/[0.07] text-orange-400">
          {icon}
        </div>

        <div>

          <div className="flex items-center gap-2">

            <h2 className="text-lg font-bold text-white">
              {title}
            </h2>

          </div>

          <p className="mt-1 text-xs text-stone-600 sm:text-sm">
            {description}
          </p>

        </div>

      </div>

      {right}

    </div>
  );
});

/* =====================================================
   ENROLLMENT CHART
===================================================== */

const EnrollmentChart = memo(function EnrollmentChart({
  data,
  maxValue,
}) {
  return (
    <SectionCard>

      <SectionHeader
        icon={<TrendingUp size={21} />}
        title="Enrollment Overview"
        description="Monthly student enrollment activity"
        right={
          <div className="flex items-center gap-2 self-start rounded-xl border border-orange-500/[0.08] bg-orange-500/[0.035] px-3 py-2">

            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-400/80">
              Growth Watch
            </span>

          </div>
        }
      />

      {data.length === 0 ? (
        <EmptyState
          icon={<BarChart3 size={22} />}
          title="No enrollment data available"
          description="Enrollment activity will appear here."
        />
      ) : (
        <div className="px-5 pb-7 pt-8 sm:px-8">

          <div className="relative h-[330px]">

            {/* Grid */}

            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-10">

              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="border-t border-white/[0.035]"
                  />
                ),
              )}

            </div>

            {/* Bars */}

            <div className="relative flex h-full items-end gap-2 overflow-x-auto px-1 pb-9 sm:gap-4">

              {data.map((item) => {
                const count =
                  Number(item.count) || 0;

                const height =
                  (count / maxValue) * 100;

                return (
                  <div
                    key={item.month}
                    className="group flex min-w-[42px] flex-1 flex-col items-center justify-end"
                  >

                    {/* Tooltip */}

                    <div className="mb-2 rounded-lg border border-orange-500/10 bg-[#15100d] px-2 py-1 opacity-0 transition-[opacity,transform] duration-200 group-hover:-translate-y-1 group-hover:opacity-100">

                      <span className="text-[10px] font-bold text-orange-300">
                        {count}
                      </span>

                    </div>

                    {/* Bar */}

                    <div
                      className="
                        relative
                        w-full
                        max-w-[38px]
                        overflow-hidden
                        rounded-t-xl
                        border
                        border-orange-400/10
                        bg-gradient-to-t
                        from-orange-700
                        via-orange-500
                        to-amber-300
                        shadow-[0_-5px_20px_rgba(249,115,22,0.07)]
                        transition-[filter,box-shadow]
                        duration-300
                        group-hover:brightness-110
                        group-hover:shadow-[0_-8px_28px_rgba(249,115,22,0.14)]
                      "
                      style={{
                        height: `${Math.max(
                          height,
                          count > 0 ? 8 : 2,
                        )}%`,
                      }}
                      title={`${count} enrollments`}
                    >

                      <div className="absolute inset-x-0 top-0 h-1 bg-white/30" />

                      <div className="absolute inset-y-0 left-0 w-1/3 bg-white/[0.05]" />

                    </div>

                    <span className="mt-3 text-[10px] font-medium text-stone-600 transition-colors group-hover:text-orange-300">
                      {item.month}
                    </span>

                  </div>
                );
              })}

            </div>

          </div>
        </div>
      )}

    </SectionCard>
  );
});

/* =====================================================
   COURSE PERFORMANCE
===================================================== */

const CoursePerformance = memo(function CoursePerformance({
  courses,
}) {
  return (
    <SectionCard>

      <SectionHeader
        icon={<BarChart3 size={21} />}
        title="Course Performance"
        description="Compare the performance of your courses"
        right={
          <span className="self-start rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
            {courses.length} Courses
          </span>
        }
      />

      {courses.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={22} />}
          title="No course performance data"
          description="Your course statistics will appear here."
        />
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead>

              <tr className="border-b border-white/[0.04] bg-white/[0.015] text-left">

                {[
                  "Course",
                  "Level",
                  "Students",
                  "Enrollments",
                  "Price",
                  "Revenue",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600 sm:px-8"
                  >
                    {heading}
                  </th>
                ))}

              </tr>

            </thead>

            <tbody>

              {courses.map((course, index) => (
                <CourseRow
                  key={course._id}
                  course={course}
                  index={index}
                />
              ))}

            </tbody>

          </table>

        </div>
      )}

    </SectionCard>
  );
});

/* =====================================================
   COURSE ROW
===================================================== */

const CourseRow = memo(function CourseRow({
  course,
  index,
}) {
  return (
    <tr
      className="
        group
        border-b
        border-white/[0.035]
        transition-[background-color]
        duration-200
        hover:bg-orange-500/[0.025]
      "
    >

      {/* COURSE */}

      <td className="px-6 py-5 sm:px-8">

        <div className="flex items-center gap-4">

          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-orange-500/10 bg-orange-500/[0.06] text-orange-400 transition-[border-color,background-color] duration-200 group-hover:border-orange-400/20 group-hover:bg-orange-500/[0.1]">

            <BookOpen size={18} />

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />

          </div>

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <p className="max-w-[280px] truncate text-sm font-bold text-stone-200 transition-colors group-hover:text-orange-300">
                {course.courseTitle || "Course"}
              </p>

              {index === 0 && (
                <span className="hidden rounded-md border border-orange-500/10 bg-orange-500/[0.06] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-orange-400 sm:inline-block">
                  Featured
                </span>
              )}

            </div>

            <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-700">
              Course
            </p>

          </div>

        </div>

      </td>

      {/* LEVEL */}

      <td className="px-6 py-5">
        <LevelBadge level={course.courseLevel} />
      </td>

      {/* STUDENTS */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-2">

          <Users
            size={14}
            className="text-stone-700"
          />

          <span className="font-bold text-stone-300">
            {course.students || 0}
          </span>

        </div>

      </td>

      {/* ENROLLMENTS */}

      <td className="px-6 py-5">

        <span className="font-medium text-stone-500">
          {course.enrollments || 0}
        </span>

      </td>

      {/* PRICE */}

      <td className="px-6 py-5">

        <span className="font-medium text-stone-500">
          ₹{course.coursePrice || 0}
        </span>

      </td>

      {/* REVENUE */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-2">

          <span className="font-bold text-orange-300">
            ₹{course.revenue || 0}
          </span>

          <ArrowUpRight
            size={14}
            className="text-orange-500/40 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-400"
          />

        </div>

      </td>

    </tr>
  );
});

/* =====================================================
   RECENT ENROLLMENTS
===================================================== */

const RecentEnrollments = memo(function RecentEnrollments({
  enrollments,
}) {
  return (
    <SectionCard>

      <SectionHeader
        icon={<UserPlus size={21} />}
        title="Recent Enrollments"
        description="Latest students who joined your courses"
        right={
          <div className="flex items-center gap-2 self-start rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2">

            <CalendarDays
              size={13}
              className="text-stone-600"
            />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-600">
              Latest Activity
            </span>

          </div>
        }
      />

      {enrollments.length === 0 ? (
        <EmptyState
          icon={<Users size={22} />}
          title="No recent enrollments"
          description="New students will appear here."
        />
      ) : (
        <div className="divide-y divide-white/[0.035]">

          {enrollments.map((enrollment, index) => (
            <EnrollmentRow
              key={enrollment._id}
              enrollment={enrollment}
              isNew={index === 0}
            />
          ))}

        </div>
      )}

    </SectionCard>
  );
});

/* =====================================================
   ENROLLMENT ROW
===================================================== */

const EnrollmentRow = memo(function EnrollmentRow({
  enrollment,
  isNew,
}) {
  const student = enrollment.student;
  const course = enrollment.course;

  const studentName =
    student?.name || "Student";

  const initial =
    studentName.charAt(0).toUpperCase();

  const enrolledDate = enrollment.enrolledAt
    ? new Date(
        enrollment.enrolledAt,
      ).toLocaleDateString()
    : "—";

  return (
    <div
      className="
        group
        flex
        flex-col
        gap-4
        px-6
        py-5
        transition-[background-color]
        duration-200
        hover:bg-orange-500/[0.025]
        sm:flex-row
        sm:items-center
        sm:px-8
      "
    >

      {/* LEFT */}

      <div className="flex min-w-0 flex-1 items-center gap-4">

        {/* AVATAR */}

        {student?.avatar ? (
          <div className="relative shrink-0">

            <img
              src={student.avatar}
              alt={studentName}
              loading="lazy"
              decoding="async"
              className="
                h-12
                w-12
                rounded-2xl
                border
                border-orange-500/10
                object-cover
                transition-[border-color]
                duration-200
                group-hover:border-orange-400/30
              "
            />

            <OnlineDot />

          </div>
        ) : (
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-500/10 bg-gradient-to-br from-orange-500/10 to-amber-500/[0.03] text-sm font-black text-orange-300">

            {initial}

            <OnlineDot />

          </div>
        )}

        {/* STUDENT */}

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <p className="truncate text-sm font-bold text-stone-200 transition-colors group-hover:text-orange-300">
              {studentName}
            </p>

            {isNew && (
              <span className="hidden rounded-md bg-orange-500/[0.08] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-orange-400 sm:inline-block">
                New
              </span>
            )}

          </div>

          <div className="mt-1 flex items-center gap-2">

            <BookOpen
              size={11}
              className="shrink-0 text-stone-700"
            />

            <p className="truncate text-xs text-stone-600">
              {course?.courseTitle || "Course"}
            </p>

          </div>

        </div>

      </div>

      {/* DATE */}

      <div className="flex shrink-0 items-center gap-3 sm:text-right">

        <div className="hidden h-8 w-px bg-white/[0.05] sm:block" />

        <div>

          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone-700">
            Enrolled
          </p>

          <p className="mt-1 text-xs font-semibold text-stone-400">
            {enrolledDate}
          </p>

        </div>

      </div>

    </div>
  );
});

/* =====================================================
   ONLINE DOT
===================================================== */

const OnlineDot = memo(function OnlineDot() {
  return (
    <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#0d0a08] bg-orange-400" />
  );
});

/* =====================================================
   EMPTY STATE
===================================================== */

const EmptyState = memo(function EmptyState({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center px-6">

      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025] text-stone-600">
        {icon}
      </div>

      <p className="text-sm font-medium text-stone-500">
        {title}
      </p>

      <p className="mt-1 text-xs text-stone-700">
        {description}
      </p>

    </div>
  );
});

/* =====================================================
   LEVEL BADGE
===================================================== */

const LevelBadge = memo(function LevelBadge({
  level,
}) {
  const normalized = String(
    level || "N/A",
  ).toLowerCase();

  const styles =
    LEVEL_STYLES[normalized] ||
    "border-orange-500/10 bg-orange-500/[0.06] text-orange-300";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-lg
        border
        px-3
        py-1.5
        text-[10px]
        font-bold
        uppercase
        tracking-wider
        ${styles}
      `}
    >
      {level || "N/A"}
    </span>
  );
});

/* =====================================================
   FOOTER
===================================================== */

const AnalyticsFooter = memo(function AnalyticsFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.035] pt-6 sm:flex-row">

      <div className="flex items-center gap-2">

        <Crown
          size={13}
          className="text-orange-500/50"
        />

        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-700">
          Instructor Command Center
        </p>

      </div>

      <p className="text-[10px] text-stone-800">
        Analytics • Performance • Growth
      </p>

    </footer>
  );
});

export default InstructorAnalytics;