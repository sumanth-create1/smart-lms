import { useEffect, useState } from "react";

import {
  BarChart3,
  BookOpen,
  Users,
  UserPlus,
  IndianRupee,
  LoaderCircle,
  TrendingUp,
  Crown,
  Flame,
  Shield,
  Sparkles,
  CalendarDays,
  ArrowUpRight,
  Gem,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../../services/api";

function InstructorAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH ANALYTICS
  // =====================================================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/dashboard/instructor/analytics",
      );

      if (response.data?.success) {
        setAnalytics(response.data.data);
      } else {
        toast.error(
          response.data?.message || "Failed to load analytics",
        );
      }
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
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070605] text-white">

        {/* Background glow */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600/[0.07] blur-[150px]" />

          <div className="absolute left-20 top-20 h-40 w-40 rounded-full bg-amber-500/[0.04] blur-[80px]" />

          <div className="absolute bottom-10 right-20 h-52 w-52 rounded-full bg-orange-700/[0.04] blur-[100px]" />

        </div>

        {/* Loader */}

        <div className="relative z-10 flex flex-col items-center">

          <div className="relative mb-7">

            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-orange-500/20 bg-[#100d0b] shadow-[0_0_60px_rgba(249,115,22,0.08)]">

              <Crown
                size={30}
                className="text-orange-400"
              />

            </div>

            <div className="absolute -inset-2 animate-pulse rounded-3xl border border-orange-500/10" />

          </div>

          <LoaderCircle
            size={24}
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
  }

  // =====================================================
  // DATA
  // =====================================================

  const overview = analytics?.overview || {};

  const monthlyEnrollments =
    analytics?.monthlyEnrollments || [];

  const coursePerformance =
    analytics?.coursePerformance || [];

  const recentEnrollments =
    analytics?.recentEnrollments || [];

  const maxEnrollmentCount = Math.max(
    ...monthlyEnrollments.map(
      (item) => Number(item.count) || 0,
    ),
    1,
  );

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070605] text-white">

      {/* =================================================
          ATMOSPHERE
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Orange glow */}

        <div className="absolute -left-48 -top-48 h-[650px] w-[650px] rounded-full bg-orange-600/[0.055] blur-[170px]" />

        {/* Gold glow */}

        <div className="absolute -right-48 top-[10%] h-[600px] w-[600px] rounded-full bg-amber-500/[0.04] blur-[170px]" />

        {/* Bottom glow */}

        <div className="absolute bottom-[-300px] left-[30%] h-[650px] w-[650px] rounded-full bg-orange-700/[0.035] blur-[180px]" />

        {/* Small center glow */}

        <div className="absolute left-[45%] top-[35%] h-[250px] w-[250px] rounded-full bg-orange-400/[0.025] blur-[100px]" />

      </div>

      {/* =================================================
          SUBTLE GRID
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
        "
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="relative z-10 mx-auto max-w-[1700px] space-y-8 p-5 sm:p-7 lg:p-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <section>

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            {/* LEFT */}

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
                students, and watch your learning realm
                grow.
              </p>

            </div>

            {/* RIGHT STATUS */}

            <div
              className="
                flex
                items-center
                gap-4
                self-start
                rounded-2xl
                border
                border-orange-500/[0.12]
                bg-[#0e0b09]/80
                px-5
                py-4
                shadow-[0_15px_50px_rgba(0,0,0,0.35)]
                backdrop-blur-xl
                lg:self-auto
              "
            >

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

          {/* Decorative divider */}

          <div className="mt-8 flex items-center gap-3">

            <div className="h-px flex-1 bg-gradient-to-r from-orange-500/30 via-orange-500/5 to-transparent" />

            <Gem
              size={13}
              className="text-orange-500/40"
            />

            <div className="h-px flex-1 bg-gradient-to-l from-orange-500/30 via-orange-500/5 to-transparent" />

          </div>

        </section>

        {/* =================================================
            OVERVIEW CARDS
        ================================================= */}

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

        {/* =================================================
            ENROLLMENT OVERVIEW
        ================================================= */}

        <section
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-orange-500/[0.09]
            bg-[#0d0a08]/90
            shadow-[0_25px_80px_rgba(0,0,0,0.35)]
            backdrop-blur-xl
          "
        >

          {/* Header */}

          <div className="flex flex-col gap-5 border-b border-white/[0.05] px-6 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/10 bg-orange-500/[0.07] text-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.05)]">

                <TrendingUp size={21} />

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-lg font-bold text-white">
                    Enrollment Overview
                  </h2>

                  <Sparkles
                    size={14}
                    className="text-orange-400/60"
                  />

                </div>

                <p className="mt-1 text-xs text-stone-600 sm:text-sm">
                  Monthly student enrollment activity
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2 self-start rounded-xl border border-orange-500/[0.08] bg-orange-500/[0.035] px-3 py-2">

              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-400/80">
                Growth Watch
              </span>

            </div>

          </div>

          {/* Chart */}

          {monthlyEnrollments.length === 0 ? (
            <div className="flex h-80 flex-col items-center justify-center px-6">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025]">

                <BarChart3
                  size={22}
                  className="text-stone-600"
                />

              </div>

              <p className="text-sm font-medium text-stone-500">
                No enrollment data available
              </p>

              <p className="mt-1 text-xs text-stone-700">
                Enrollment activity will appear here.
              </p>

            </div>
          ) : (
            <div className="px-5 pb-7 pt-8 sm:px-8">

              {/* Chart area */}

              <div className="relative h-[330px]">

                {/* Horizontal guide lines */}

                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-10">

                  {[0, 1, 2, 3, 4].map(
                    (line) => (
                      <div
                        key={line}
                        className="border-t border-white/[0.035]"
                      />
                    ),
                  )}

                </div>

                {/* Bars */}

                <div className="relative flex h-full items-end gap-2 overflow-x-auto px-1 pb-9 sm:gap-4">

                  {monthlyEnrollments.map(
                    (item, index) => {
                      const count =
                        Number(item.count) || 0;

                      const height =
                        (count /
                          maxEnrollmentCount) *
                        100;

                      return (
                        <div
                          key={item.month}
                          className="
                            group
                            flex
                            min-w-[42px]
                            flex-1
                            flex-col
                            items-center
                            justify-end
                          "
                        >

                          {/* Count */}

                          <div
                            className="
                              mb-2
                              rounded-lg
                              border
                              border-orange-500/10
                              bg-[#15100d]
                              px-2
                              py-1
                              opacity-0
                              transition-all
                              duration-300
                              group-hover:-translate-y-1
                              group-hover:opacity-100
                            "
                          >
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
                              shadow-[0_-5px_25px_rgba(249,115,22,0.08)]
                              transition-all
                              duration-500
                              group-hover:from-orange-600
                              group-hover:via-orange-400
                              group-hover:to-amber-200
                              group-hover:shadow-[0_-8px_35px_rgba(249,115,22,0.18)]
                            "
                            style={{
                              height: `${Math.max(
                                height,
                                count > 0 ? 8 : 2,
                              )}%`,
                            }}
                            title={`${count} enrollments`}
                          >

                            {/* Inner shine */}

                            <div className="absolute inset-x-0 top-0 h-1 bg-white/30" />

                            <div className="absolute inset-y-0 left-0 w-1/3 bg-white/[0.05]" />

                          </div>

                          {/* Month */}

                          <span className="mt-3 text-[10px] font-medium text-stone-600 transition-colors group-hover:text-orange-300">
                            {item.month}
                          </span>

                        </div>
                      );
                    },
                  )}

                </div>

              </div>

            </div>
          )}

        </section>

        {/* =================================================
            COURSE PERFORMANCE
        ================================================= */}

        <section
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-orange-500/[0.09]
            bg-[#0d0a08]/90
            shadow-[0_25px_80px_rgba(0,0,0,0.35)]
            backdrop-blur-xl
          "
        >

          {/* Header */}

          <div className="flex flex-col gap-4 border-b border-white/[0.05] px-6 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/10 bg-orange-500/[0.07] text-orange-400">

                <BarChart3 size={21} />

              </div>

              <div>

                <h2 className="text-lg font-bold text-white">
                  Course Performance
                </h2>

                <p className="mt-1 text-xs text-stone-600 sm:text-sm">
                  Compare the performance of your courses
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2 self-start">

              <span className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                {coursePerformance.length} Courses
              </span>

            </div>

          </div>

          {coursePerformance.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025]">

                <BookOpen
                  size={22}
                  className="text-stone-600"
                />

              </div>

              <p className="text-sm font-medium text-stone-500">
                No course performance data
              </p>

              <p className="mt-1 text-xs text-stone-700">
                Your course statistics will appear here.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                {/* TABLE HEADER */}

                <thead>

                  <tr className="border-b border-white/[0.04] bg-white/[0.015] text-left">

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600 sm:px-8">
                      Course
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600">
                      Level
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600">
                      Students
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600">
                      Enrollments
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600">
                      Price
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600">
                      Revenue
                    </th>

                  </tr>

                </thead>

                {/* TABLE BODY */}

                <tbody>

                  {coursePerformance.map(
                    (course, index) => (
                      <tr
                        key={course._id}
                        className="
                          group
                          border-b
                          border-white/[0.035]
                          transition-all
                          duration-300
                          hover:bg-orange-500/[0.025]
                        "
                      >

                        {/* COURSE */}

                        <td className="px-6 py-5 sm:px-8">

                          <div className="flex items-center gap-4">

                            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-orange-500/10 bg-orange-500/[0.06] text-orange-400 transition-all duration-300 group-hover:border-orange-400/20 group-hover:bg-orange-500/[0.12]">

                              <BookOpen size={18} />

                              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />

                            </div>

                            <div className="min-w-0">

                              <div className="flex items-center gap-2">

                                <p className="max-w-[280px] truncate text-sm font-bold text-stone-200 transition-colors group-hover:text-orange-300">
                                  {course.courseTitle ||
                                    "Course"}
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

                          <LevelBadge
                            level={
                              course.courseLevel
                            }
                          />

                        </td>

                        {/* STUDENTS */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <Users
                              size={14}
                              className="text-stone-700"
                            />

                            <span className="font-bold text-stone-300">
                              {course.students ||
                                0}
                            </span>

                          </div>

                        </td>

                        {/* ENROLLMENTS */}

                        <td className="px-6 py-5">

                          <span className="font-medium text-stone-500">
                            {course.enrollments ||
                              0}
                          </span>

                        </td>

                        {/* PRICE */}

                        <td className="px-6 py-5">

                          <span className="font-medium text-stone-500">
                            ₹
                            {course.coursePrice ||
                              0}
                          </span>

                        </td>

                        {/* REVENUE */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <span className="font-bold text-orange-300">
                              ₹
                              {course.revenue ||
                                0}
                            </span>

                            <ArrowUpRight
                              size={14}
                              className="text-orange-500/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-400"
                            />

                          </div>

                        </td>

                      </tr>
                    ),
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* =================================================
            RECENT ENROLLMENTS
        ================================================= */}

        <section
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-orange-500/[0.09]
            bg-[#0d0a08]/90
            shadow-[0_25px_80px_rgba(0,0,0,0.35)]
            backdrop-blur-xl
          "
        >

          {/* HEADER */}

          <div className="flex flex-col gap-4 border-b border-white/[0.05] px-6 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/10 bg-orange-500/[0.07] text-orange-400">

                <UserPlus size={21} />

              </div>

              <div>

                <h2 className="text-lg font-bold text-white">
                  Recent Enrollments
                </h2>

                <p className="mt-1 text-xs text-stone-600 sm:text-sm">
                  Latest students who joined your courses
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2 self-start rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2">

              <CalendarDays
                size={13}
                className="text-stone-600"
              />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-600">
                Latest Activity
              </span>

            </div>

          </div>

          {/* CONTENT */}

          {recentEnrollments.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center px-6">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025]">

                <Users
                  size={22}
                  className="text-stone-600"
                />

              </div>

              <p className="text-sm font-medium text-stone-500">
                No recent enrollments
              </p>

              <p className="mt-1 text-xs text-stone-700">
                New students will appear here.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-white/[0.035]">

              {recentEnrollments.map(
                (enrollment, index) => (
                  <div
                    key={enrollment._id}
                    className="
                      group
                      flex
                      flex-col
                      gap-4
                      px-6
                      py-5
                      transition-all
                      duration-300
                      hover:bg-orange-500/[0.025]
                      sm:flex-row
                      sm:items-center
                      sm:px-8
                    "
                  >

                    {/* LEFT */}

                    <div className="flex min-w-0 flex-1 items-center gap-4">

                      {/* AVATAR */}

                      {enrollment.student?.avatar ? (
                        <div className="relative shrink-0">

                          <img
                            src={
                              enrollment
                                .student.avatar
                            }
                            alt={
                              enrollment.student
                                .name ||
                              "Student"
                            }
                            className="
                              h-12
                              w-12
                              rounded-2xl
                              border
                              border-orange-500/10
                              object-cover
                              transition-all
                              duration-300
                              group-hover:border-orange-400/30
                            "
                          />

                          <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#0d0a08] bg-orange-400" />

                        </div>
                      ) : (
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-500/10 bg-gradient-to-br from-orange-500/10 to-amber-500/[0.03] text-sm font-black text-orange-300">

                          {enrollment.student?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "S"}

                          <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#0d0a08] bg-orange-400" />

                        </div>
                      )}

                      {/* STUDENT */}

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">

                          <p className="truncate text-sm font-bold text-stone-200 transition-colors group-hover:text-orange-300">
                            {enrollment.student
                              ?.name ||
                              "Student"}
                          </p>

                          {index === 0 && (
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
                            {enrollment.course
                              ?.courseTitle ||
                              "Course"}
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

                          {enrollment.enrolledAt
                            ? new Date(
                                enrollment.enrolledAt,
                              ).toLocaleDateString()
                            : "—"}

                        </p>

                      </div>

                    </div>

                  </div>
                ),
              )}

            </div>
          )}

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.035] pt-6 sm:flex-row">

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

        </div>

      </div>

    </div>
  );
}

// =====================================================
// ANALYTICS CARD
// =====================================================

function AnalyticsCard({
  title,
  value,
  icon,
  accent,
  subtitle,
}) {
  const accentStyles = {
    orange: {
      icon:
        "border-orange-500/10 bg-orange-500/[0.07] text-orange-400",
      glow:
        "group-hover:shadow-[0_0_40px_rgba(249,115,22,0.08)]",
    },

    gold: {
      icon:
        "border-amber-500/10 bg-amber-500/[0.06] text-amber-300",
      glow:
        "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.07)]",
    },

    fire: {
      icon:
        "border-orange-400/10 bg-orange-400/[0.06] text-orange-300",
      glow:
        "group-hover:shadow-[0_0_40px_rgba(251,146,60,0.08)]",
    },

    amber: {
      icon:
        "border-yellow-500/10 bg-yellow-500/[0.06] text-yellow-300",
      glow:
        "group-hover:shadow-[0_0_40px_rgba(234,179,8,0.07)]",
    },
  };

  const style =
    accentStyles[accent] ||
    accentStyles.orange;

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-[26px]
        border
        border-orange-500/[0.08]
        bg-[#0e0b09]/90
        p-6
        shadow-[0_20px_60px_rgba(0,0,0,0.28)]
        backdrop-blur-xl
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-orange-500/[0.18]
        ${style.glow}
      `}
    >

      {/* Top glow */}

      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-500/[0.035] blur-3xl transition-all duration-500 group-hover:bg-orange-500/[0.07]" />

      {/* Decorative line */}

      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Content */}

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

        {/* Icon */}

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
            transition-all
            duration-500
            group-hover:scale-105
            ${style.icon}
          `}
        >
          {icon}
        </div>

      </div>

      {/* Bottom decoration */}

      <div className="relative mt-6 h-px overflow-hidden bg-white/[0.035]">

        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent transition-all duration-700 group-hover:w-2/3" />

      </div>

    </div>
  );
}

// =====================================================
// LEVEL BADGE
// =====================================================

function LevelBadge({ level }) {
  const normalized =
    String(level || "N/A").toLowerCase();

  let styles =
    "border-orange-500/10 bg-orange-500/[0.06] text-orange-300";

  if (normalized === "beginner") {
    styles =
      "border-emerald-500/10 bg-emerald-500/[0.05] text-emerald-400";
  }

  if (normalized === "intermediate") {
    styles =
      "border-amber-500/10 bg-amber-500/[0.05] text-amber-300";
  }

  if (normalized === "advanced") {
    styles =
      "border-orange-500/10 bg-orange-500/[0.07] text-orange-300";
  }

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
}

export default InstructorAnalytics;