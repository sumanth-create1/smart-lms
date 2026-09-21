import { useEffect, useState } from "react";

import {
  ArrowRight,
  BookOpen,
  IndianRupee,
  LoaderCircle,
  Plus,
  Trash2,
  Users,
  Crown,
  Flame,
  Sparkles,
  Shield,
  Gem,
  Pencil,
  Eye,
  Layers3,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api";

function InstructorCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // =====================================================
  // FETCH COURSES
  // =====================================================

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/course/instructor");

      if (response.data?.success) {
        setCourses(response.data.courses || []);
      } else {
        toast.error(
          response.data?.message ||
            "Failed to load your courses.",
        );
      }
    } catch (error) {
      console.error(
        "Instructor courses error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load your courses.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // =====================================================
  // DELETE COURSE
  // =====================================================

  const handleDelete = async (courseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(courseId);

      const response = await api.delete(
        `/course/${courseId}`,
      );

      if (response.data?.success) {
        toast.success(
          "Course deleted successfully.",
        );

        setCourses((prev) =>
          prev.filter(
            (course) => course._id !== courseId,
          ),
        );
      } else {
        toast.error(
          response.data?.message ||
            "Failed to delete course.",
        );
      }
    } catch (error) {
      console.error(
        "Delete course error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to delete course.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070605] text-white">

        {/* Background */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600/[0.06] blur-[150px]" />

          <div className="absolute -left-32 -top-32 h-[400px] w-[400px] rounded-full bg-amber-500/[0.04] blur-[120px]" />

          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-orange-700/[0.04] blur-[140px]" />

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
            Opening the Course Realm...
          </p>

          <p className="mt-2 text-xs text-stone-600">
            Gathering your courses
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070605] text-white">

      {/* =================================================
          BACKGROUND ATMOSPHERE
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Main orange glow */}

        <div className="absolute -left-48 -top-48 h-[650px] w-[650px] rounded-full bg-orange-600/[0.05] blur-[170px]" />

        {/* Gold glow */}

        <div className="absolute -right-48 top-[15%] h-[600px] w-[600px] rounded-full bg-amber-500/[0.035] blur-[170px]" />

        {/* Bottom glow */}

        <div className="absolute bottom-[-300px] left-[30%] h-[650px] w-[650px] rounded-full bg-orange-700/[0.03] blur-[180px]" />

      </div>

      {/* =================================================
          SUBTLE GRID
      ================================================= */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="relative z-10 mx-auto max-w-[1700px] p-5 sm:p-7 lg:p-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="mb-10">

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

                My

                <span className="ml-3 bg-gradient-to-r from-orange-300 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                  Courses
                </span>

              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
                Command your courses, shape your learning
                kingdom, and guide your students toward
                mastery.
              </p>

            </div>

            {/* CREATE BUTTON */}

            <Link
              to="/instructor/create-course"
              className="
                group
                inline-flex
                items-center
                justify-center
                gap-3
                self-start
                rounded-2xl
                border
                border-orange-400/20
                bg-gradient-to-r
                from-orange-600
                to-orange-500
                px-6
                py-3.5
                text-sm
                font-bold
                text-white
                shadow-[0_12px_35px_rgba(249,115,22,0.15)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-orange-300/30
                hover:from-orange-500
                hover:to-amber-500
                hover:shadow-[0_18px_45px_rgba(249,115,22,0.25)]
                lg:self-auto
              "
            >
              <Plus
                size={18}
                className="transition-transform duration-300 group-hover:rotate-90"
              />

              Create Course

              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

          {/* Divider */}

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
            COURSE SUMMARY
        ================================================= */}

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* COURSE COUNT */}

          <SummaryCard
            icon={<BookOpen size={19} />}
            label="Total Courses"
            value={courses.length}
          />

          {/* STUDENTS */}

          <SummaryCard
            icon={<Users size={19} />}
            label="Learning Community"
            value={courses.reduce(
              (total, course) =>
                total +
                (Number(course.studentCount) || 0),
              0,
            )}
          />

          {/* STATUS */}

          <SummaryCard
            icon={<Shield size={19} />}
            label="Realm Status"
            value="Active"
          />

        </section>

        {/* =================================================
            COURSE SECTION HEADER
        ================================================= */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Layers3
                size={16}
                className="text-orange-400"
              />

              <h2 className="text-lg font-bold text-white">
                Your Course Realm
              </h2>

            </div>

            <p className="mt-1 text-xs text-stone-600">
              {courses.length === 1
                ? "1 course under your command"
                : `${courses.length} courses under your command`}
            </p>

          </div>

          {courses.length > 0 && (
            <span className="self-start rounded-lg border border-orange-500/[0.08] bg-orange-500/[0.035] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-orange-400/70 sm:self-auto">
              {courses.length}{" "}
              {courses.length === 1
                ? "Course"
                : "Courses"}{" "}
              Created
            </span>
          )}

        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {courses.length === 0 ? (
          <EmptyCourses />
        ) : (
          /* =================================================
             COURSE GRID
          ================================================= */

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {courses.map((course, index) => (
              <CourseCard
                key={course._id}
                course={course}
                index={index}
                deleting={
                  deletingId === course._id
                }
                onDelete={handleDelete}
                onManage={() =>
                  navigate(
                    `/instructor/courses/${course._id}`,
                  )
                }
              />
            ))}

          </div>
        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.035] pt-6 sm:flex-row">

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
            Create • Teach • Command
          </p>

        </div>

      </div>
    </div>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-orange-500/[0.08]
        bg-[#0e0b09]/90
        p-5
        shadow-[0_15px_50px_rgba(0,0,0,0.25)]
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-orange-500/[0.18]
      "
    >

      {/* Glow */}

      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-500/[0.04] blur-3xl transition-all duration-500 group-hover:bg-orange-500/[0.08]" />

      <div className="relative flex items-center gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/10 bg-orange-500/[0.06] text-orange-400 transition-all duration-300 group-hover:scale-105 group-hover:bg-orange-500/[0.1]">

          {icon}

        </div>

        <div className="min-w-0">

          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
            {label}
          </p>

          <p className="mt-1 truncate text-xl font-black text-white">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   EMPTY COURSES
===================================================== */

function EmptyCourses() {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[30px]
        border
        border-orange-500/[0.09]
        bg-[#0d0a08]/90
        px-6
        py-20
        text-center
        shadow-[0_25px_80px_rgba(0,0,0,0.35)]
        backdrop-blur-xl
      "
    >

      {/* Background decoration */}

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.035] blur-[100px]" />

      {/* Icon */}

      <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-orange-500/10 bg-orange-500/[0.05] text-orange-400 shadow-[0_0_50px_rgba(249,115,22,0.06)]">

        <BookOpen size={30} />

        <div className="absolute -inset-2 rounded-[30px] border border-orange-500/[0.05]" />

      </div>

      {/* Crown */}

      <div className="relative mx-auto mt-6 flex w-fit items-center gap-2">

        <span className="h-px w-8 bg-gradient-to-r from-transparent to-orange-500/30" />

        <Crown
          size={13}
          className="text-orange-500/50"
        />

        <span className="h-px w-8 bg-gradient-to-l from-transparent to-orange-500/30" />

      </div>

      <h2 className="relative mt-5 text-xl font-bold text-white">
        Your Realm Awaits
      </h2>

      <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-stone-600">
        You haven't created any courses yet.
        Forge your first course and begin building
        your learning kingdom.
      </p>

      <Link
        to="/instructor/create-course"
        className="
          group
          relative
          mt-7
          inline-flex
          items-center
          gap-2
          rounded-xl
          border
          border-orange-400/20
          bg-orange-500
          px-5
          py-3
          text-sm
          font-bold
          text-white
          shadow-[0_10px_30px_rgba(249,115,22,0.15)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:bg-orange-400
          hover:shadow-[0_15px_40px_rgba(249,115,22,0.25)]
        "
      >
        <Plus
          size={17}
          className="transition-transform duration-300 group-hover:rotate-90"
        />

        Create Your First Course

        <ArrowRight
          size={15}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />

      </Link>

    </div>
  );
}

/* =====================================================
   COURSE CARD
===================================================== */

function CourseCard({
  course,
  deleting,
  onDelete,
  onManage,
  index,
}) {
  const thumbnail =
    course.courseThumbnail?.url ||
    "/placeholder-course.jpg";

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-orange-500/[0.08]
        bg-[#0d0a08]
        shadow-[0_20px_65px_rgba(0,0,0,0.32)]
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-orange-500/[0.2]
        hover:shadow-[0_30px_80px_rgba(0,0,0,0.45)]
      "
    >

      {/* =================================================
          TOP GLOW
      ================================================= */}

      <div className="pointer-events-none absolute -right-16 -top-16 z-20 h-40 w-40 rounded-full bg-orange-500/[0.035] blur-3xl transition-all duration-500 group-hover:bg-orange-500/[0.08]" />

      {/* =================================================
          THUMBNAIL
      ================================================= */}

      <div className="relative aspect-video overflow-hidden bg-[#100d0b]">

        <img
          src={thumbnail}
          alt={course.courseTitle}
          className="
            h-full
            w-full
            object-cover
            opacity-90
            transition-all
            duration-700
            group-hover:scale-110
            group-hover:opacity-100
          "
          onError={(e) => {
            e.currentTarget.src =
              "/placeholder-course.jpg";
          }}
        />

        {/* Dark overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a08] via-black/10 to-black/10" />

        {/* Orange overlay */}

        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/[0.08] via-transparent to-black/[0.3] opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Top border */}

        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />

        {/* Course number */}

        <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/50 text-[10px] font-black text-white backdrop-blur-md">

          {String(index + 1).padStart(2, "0")}

        </div>

        {/* Level */}

        <div className="absolute right-4 top-4">

          <span className="rounded-lg border border-orange-300/20 bg-black/50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-orange-200 shadow-lg backdrop-blur-md">

            {course.courseLevel ||
              "Course"}

          </span>

        </div>

        {/* Hover icon */}

        <div className="absolute bottom-4 right-4 flex h-9 w-9 translate-y-3 items-center justify-center rounded-xl border border-orange-400/20 bg-black/50 text-orange-300 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">

          <Eye size={15} />

        </div>

      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="p-5">

        {/* Title */}

        <div className="mb-4">

          <h2 className="line-clamp-2 min-h-[56px] text-lg font-black leading-7 text-white transition-colors duration-300 group-hover:text-orange-300">

            {course.courseTitle}

          </h2>

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-600">

            {course.subTitle ||
              "No subtitle available."}

          </p>

        </div>

        {/* Category */}

        {course.category && (
          <div className="mb-5 flex items-center gap-2">

            <Sparkles
              size={12}
              className="text-orange-500/50"
            />

            <span className="rounded-lg border border-white/[0.05] bg-white/[0.025] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-stone-500">
              {course.category}
            </span>

          </div>
        )}

        {/* =================================================
            STATS
        ================================================= */}

        <div className="grid grid-cols-2 gap-3">

          {/* STUDENTS */}

          <div
            className="
              rounded-2xl
              border
              border-white/[0.04]
              bg-white/[0.02]
              p-3.5
              transition-all
              duration-300
              group-hover:border-orange-500/[0.07]
            "
          >

            <div className="flex items-center gap-2 text-stone-700">

              <Users size={14} />

              <span className="text-[9px] font-bold uppercase tracking-wider">
                Students
              </span>

            </div>

            <p className="mt-2 text-lg font-black text-stone-200">
              {course.studentCount || 0}
            </p>

          </div>

          {/* PRICE */}

          <div
            className="
              rounded-2xl
              border
              border-white/[0.04]
              bg-white/[0.02]
              p-3.5
              transition-all
              duration-300
              group-hover:border-orange-500/[0.07]
            "
          >

            <div className="flex items-center gap-2 text-stone-700">

              <IndianRupee size={14} />

              <span className="text-[9px] font-bold uppercase tracking-wider">
                Price
              </span>

            </div>

            <p className="mt-2 text-lg font-black text-orange-300">
              ₹{course.coursePrice || 0}
            </p>

          </div>

        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="mt-5 flex gap-2">

          {/* MANAGE */}

          <button
            type="button"
            onClick={onManage}
            className="
              group/manage
              flex
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-orange-400/20
              bg-gradient-to-r
              from-orange-600
              to-orange-500
              px-4
              py-3
              text-xs
              font-bold
              text-white
              shadow-[0_8px_25px_rgba(249,115,22,0.08)]
              transition-all
              duration-300
              hover:from-orange-500
              hover:to-amber-500
              hover:shadow-[0_12px_30px_rgba(249,115,22,0.18)]
            "
          >
            <Pencil
              size={14}
              className="transition-transform duration-300 group-hover/manage:-rotate-12"
            />

            Manage

            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover/manage:translate-x-1"
            />

          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={() =>
              onDelete(course._id)
            }
            disabled={deleting}
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-red-500/10
              bg-red-500/[0.04]
              text-red-400/70
              transition-all
              duration-300
              hover:border-red-500/20
              hover:bg-red-500/[0.09]
              hover:text-red-300
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            title="Delete course"
          >
            {deleting ? (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={16} />
            )}
          </button>

        </div>

      </div>

      {/* =================================================
          BOTTOM DECORATION
      ================================================= */}

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-100" />

    </div>
  );
}

export default InstructorCourses;