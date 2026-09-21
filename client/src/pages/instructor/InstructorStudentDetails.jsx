import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Crown,
  Flame,
  Gem,
  LoaderCircle,
  Mail,
  PlayCircle,
  Shield,
  Sparkles,
  Swords,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";

/* =====================================================
   MAIN COMPONENT
===================================================== */

function InstructorStudentDetails() {
  const { studentId } = useParams();

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Premium cursor
  const cursorRef = useRef(null);
  const cursorGlowRef = useRef(null);

  /* =====================================================
     PREMIUM CURSOR
  ===================================================== */

  useEffect(() => {
    let animationFrame;

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;

      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
        }

        if (cursorGlowRef.current) {
          cursorGlowRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  /* =====================================================
     FETCH STUDENT DETAILS
  ===================================================== */

  useEffect(() => {
    if (!studentId) return;

    const fetchStudentDetails = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/dashboard/instructor/students/${studentId}`,
        );

        if (response.data?.success) {
          setStudentData(response.data.data);
        } else {
          toast.error(
            response.data?.message ||
              "Failed to load student details",
          );
        }
      } catch (error) {
        console.error(
          "Student details error:",
          error,
        );

        toast.error(
          error.response?.data?.message ||
            "Unable to load student details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  /* =====================================================
     SAFE DATA
  ===================================================== */

  const student = studentData?.student || null;
  const courses = studentData?.courses || [];

  /* =====================================================
     OVERALL PROGRESS
  ===================================================== */

  const overallStats = useMemo(() => {
    const totalLectures = courses.reduce(
      (total, course) =>
        total +
        Number(course.progress?.totalLectures || 0),
      0,
    );

    const completedLectures = courses.reduce(
      (total, course) =>
        total +
        Number(
          course.progress?.completedLectures || 0,
        ),
      0,
    );

    const remainingLectures = Math.max(
      totalLectures - completedLectures,
      0,
    );

    const percentage =
      totalLectures > 0
        ? Math.round(
            (completedLectures / totalLectures) * 100,
          )
        : 0;

    return {
      totalLectures,
      completedLectures,
      remainingLectures,
      percentage,
    };
  }, [courses]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return <LoadingState />;
  }

  /* =====================================================
     NO DATA
  ===================================================== */

  if (!student) {
    return <StudentNotFound />;
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="student-details-page relative min-h-screen overflow-hidden bg-[#080808] text-white">

      {/* =================================================
          PREMIUM CURSOR
      ================================================= */}

      <div
        ref={cursorGlowRef}
        className="student-cursor-glow pointer-events-none fixed left-0 top-0 z-[9998]"
      />

      <div
        ref={cursorRef}
        className="student-cursor pointer-events-none fixed left-0 top-0 z-[9999]"
      >
        <span />
      </div>

      {/* =================================================
          AMBIENT BACKGROUND
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <div className="student-ambient student-ambient-one" />

        <div className="student-ambient student-ambient-two" />

        <div className="student-ambient student-ambient-three" />

        <div className="student-grid" />

        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="student-ember"
            style={{
              left: `${5 + index * 5}%`,
              animationDelay: `${index * 0.55}s`,
              animationDuration: `${5 + (index % 4)}s`,
            }}
          />
        ))}

      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="relative z-10 space-y-8 p-5 sm:p-6 lg:p-8">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <Link
            to="/instructor/students"
            className="
              realm-back-button
              group
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-xl
              border
              border-white/10
              bg-white/[0.035]
              px-4
              py-2.5
              text-sm
              font-medium
              text-white/60
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-orange-400/30
              hover:bg-orange-500/10
              hover:text-orange-300
              hover:shadow-[0_0_25px_rgba(249,115,22,0.12)]
            "
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back to Students
          </Link>

          <div className="flex items-center gap-2">

            <div className="realm-status-pill">
              <span className="realm-status-dot" />
              Instructor Realm
            </div>

            <div className="hidden rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-white/40 backdrop-blur-xl sm:block">
              Student Intelligence
            </div>

          </div>

        </div>

        {/* =================================================
            STUDENT PROFILE
        ================================================= */}

        <StudentProfile
          student={student}
          courseCount={courses.length}
          overallPercentage={overallStats.percentage}
        />

        {/* =================================================
            SUMMARY TITLE
        ================================================= */}

        <SectionHeading
          eyebrow="REALM OVERVIEW"
          title="Learning Intelligence"
          description="A complete overview of this student's journey across your courses."
          icon={<Crown size={18} />}
        />

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            title="Enrolled Courses"
            value={courses.length}
            description="Courses enrolled"
            icon={<BookOpen size={22} />}
            accent="orange"
            index={0}
          />

          <SummaryCard
            title="Overall Progress"
            value={`${overallStats.percentage}%`}
            description="Across all courses"
            icon={<TrendingUp size={22} />}
            accent="gold"
            index={1}
          />

          <SummaryCard
            title="Completed Lectures"
            value={overallStats.completedLectures}
            description={`Out of ${overallStats.totalLectures} lectures`}
            icon={<CheckCircle2 size={22} />}
            accent="green"
            index={2}
          />

          <SummaryCard
            title="Remaining Lectures"
            value={overallStats.remainingLectures}
            description="Lectures left"
            icon={<PlayCircle size={22} />}
            accent="red"
            index={3}
          />

        </div>

        {/* =================================================
            OVERALL PROGRESS HERO
        ================================================= */}

        <OverallProgressPanel
          percentage={overallStats.percentage}
          completed={overallStats.completedLectures}
          total={overallStats.totalLectures}
          remaining={overallStats.remainingLectures}
        />

        {/* =================================================
            COURSE PROGRESS
        ================================================= */}

        <SectionHeading
          eyebrow="COURSE REALM"
          title="Learning Journey"
          description="Track how the student is progressing through every enrolled course."
          icon={<Swords size={18} />}
        />

        {courses.length === 0 ? (
          <EmptyCourses />
        ) : (
          <div className="space-y-7">
            {courses.map((item, index) => (
              <CourseProgressCard
                key={
                  item.enrollmentId ||
                  item.course?._id
                }
                item={item}
                index={index}
              />
            ))}
          </div>
        )}

      </div>

      {/* =================================================
          PAGE STYLES
      ================================================= */}

      <style>{`
        /* ================================================
           CURSOR
        ================================================ */

        .student-cursor {
          width: 34px;
          height: 34px;
          margin-left: -17px;
          margin-top: -17px;
          border: 1px solid rgba(251,146,60,0.75);
          border-radius: 50%;
          transition:
            width 180ms ease,
            height 180ms ease;
          box-shadow:
            0 0 18px rgba(249,115,22,0.28),
            inset 0 0 10px rgba(249,115,22,0.12);
        }

        .student-cursor span {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 5px;
          height: 5px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: #fb923c;
          box-shadow:
            0 0 10px rgba(251,146,60,0.9),
            0 0 22px rgba(249,115,22,0.6);
        }

        .student-cursor-glow {
          width: 120px;
          height: 120px;
          margin-left: -60px;
          margin-top: -60px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(249,115,22,0.10),
              rgba(249,115,22,0.03) 35%,
              transparent 70%
            );
          filter: blur(4px);
        }

        /* ================================================
           BACKGROUND
        ================================================ */

        .student-details-page {
          isolation: isolate;
        }

        .student-grid {
          position: absolute;
          inset: 0;
          opacity: 0.13;
          background-image:
            linear-gradient(
              rgba(255,255,255,0.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.025) 1px,
              transparent 1px
            );
          background-size: 52px 52px;
          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 85%
            );
        }

        .student-ambient {
          position: absolute;
          border-radius: 999px;
          filter: blur(100px);
          pointer-events: none;
        }

        .student-ambient-one {
          width: 500px;
          height: 500px;
          left: -180px;
          top: -180px;
          background: rgba(180, 60, 10, 0.10);
          animation: ambientFloatOne 12s ease-in-out infinite;
        }

        .student-ambient-two {
          width: 450px;
          height: 450px;
          right: -160px;
          top: 25%;
          background: rgba(249,115,22,0.07);
          animation: ambientFloatTwo 15s ease-in-out infinite;
        }

        .student-ambient-three {
          width: 400px;
          height: 400px;
          bottom: -200px;
          left: 35%;
          background: rgba(234,179,8,0.055);
          animation: ambientFloatThree 13s ease-in-out infinite;
        }

        .student-ember {
          position: absolute;
          bottom: -20px;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #fb923c;
          box-shadow:
            0 0 8px rgba(251,146,60,0.8),
            0 0 16px rgba(249,115,22,0.4);
          animation: emberRise linear infinite;
          opacity: 0;
        }

        /* ================================================
           STATUS
        ================================================ */

        .realm-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(249,115,22,0.16);
          background: rgba(249,115,22,0.055);
          color: rgba(253,186,116,0.78);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          backdrop-filter: blur(12px);
        }

        .realm-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fb923c;
          box-shadow:
            0 0 8px rgba(251,146,60,0.9);
          animation: statusPulse 2s ease-in-out infinite;
        }

        /* ================================================
           ANIMATIONS
        ================================================ */

        @keyframes ambientFloatOne {
          0%, 100% {
            transform: translate(0,0) scale(1);
          }

          50% {
            transform: translate(90px,60px) scale(1.08);
          }
        }

        @keyframes ambientFloatTwo {
          0%,100% {
            transform: translate(0,0);
          }

          50% {
            transform: translate(-80px,30px);
          }
        }

        @keyframes ambientFloatThree {
          0%,100% {
            transform: translate(0,0);
          }

          50% {
            transform: translate(50px,-50px);
          }
        }

        @keyframes emberRise {
          0% {
            transform:
              translateY(0)
              translateX(0)
              scale(0.4);
            opacity: 0;
          }

          15% {
            opacity: 0.75;
          }

          70% {
            opacity: 0.4;
          }

          100% {
            transform:
              translateY(-90vh)
              translateX(30px)
              scale(1.1);
            opacity: 0;
          }
        }

        @keyframes statusPulse {
          0%,100% {
            transform: scale(1);
            opacity: 0.7;
          }

          50% {
            transform: scale(1.35);
            opacity: 1;
          }
        }

        @keyframes crownGlow {
          0%,100% {
            box-shadow:
              0 0 0 rgba(249,115,22,0);
          }

          50% {
            box-shadow:
              0 0 35px rgba(249,115,22,0.15);
          }
        }

        @keyframes profileFloat {
          0%,100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes progressShine {
          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(350%);
          }
        }

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .student-cursor,
          .student-cursor-glow {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .student-ambient,
          .student-ember,
          .realm-status-dot {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/* =====================================================
   SECTION HEADING
===================================================== */

function SectionHeading({
  eyebrow,
  title,
  description,
  icon,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

      <div>

        <div className="mb-2 flex items-center gap-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-400/15 bg-orange-500/10 text-orange-400">
            {icon}
          </div>

          <span className="text-[10px] font-bold tracking-[0.22em] text-orange-400/70">
            {eyebrow}
          </span>

        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-white/40">
          {description}
        </p>

      </div>

      <div className="hidden h-px w-32 bg-gradient-to-r from-orange-500/50 to-transparent sm:block" />

    </div>
  );
}

/* =====================================================
   LOADING STATE
===================================================== */

function LoadingState() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808]">

      <div className="absolute h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center">

        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-orange-400/20 bg-orange-500/5">

          <div className="absolute inset-0 rounded-3xl border border-orange-400/10 animate-ping" />

          <LoaderCircle
            size={34}
            className="animate-spin text-orange-400"
          />

        </div>

        <p className="mt-5 text-sm font-medium text-white/60">
          Entering the student's realm...
        </p>

        <p className="mt-1 text-xs text-white/30">
          Gathering learning intelligence
        </p>

      </div>

    </div>
  );
}

/* =====================================================
   STUDENT NOT FOUND
===================================================== */

function StudentNotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#080808] px-6 text-center text-white">

      <div className="absolute h-[450px] w-[450px] rounded-full bg-orange-600/10 blur-[120px]" />

      <div className="relative z-10">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-orange-400/20 bg-orange-500/5 shadow-[0_0_50px_rgba(249,115,22,0.08)]">

          <UserRound
            size={38}
            className="text-orange-400/70"
          />

        </div>

        <p className="mt-6 text-[10px] font-bold tracking-[0.25em] text-orange-400/60">
          REALM ERROR
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">
          Student not found
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
          This student could not be found in your courses.
        </p>

        <Link
          to="/instructor/students"
          className="
            group
            mt-7
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-orange-400/20
            bg-orange-500/10
            px-5
            py-3
            text-sm
            font-semibold
            text-orange-300
            transition-all
            duration-300
            hover:border-orange-400/40
            hover:bg-orange-500/15
            hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]
          "
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-1"
          />

          Back to Students
        </Link>

      </div>

    </div>
  );
}

/* =====================================================
   STUDENT PROFILE
===================================================== */

function StudentProfile({
  student,
  courseCount,
  overallPercentage,
}) {
  const initial =
    student.name?.charAt(0)?.toUpperCase() || "S";

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#101010]/90 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">

      {/* TOP GLOW */}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/70 to-transparent" />

      {/* AMBIENT */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-orange-500/10 blur-[100px]" />

      <div className="pointer-events-none absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-red-700/10 blur-[90px]" />

      {/* COVER */}

      <div className="relative h-32 overflow-hidden sm:h-40">

        <div className="absolute inset-0 bg-gradient-to-r from-[#1c0b05] via-[#291007] to-[#100807]" />

        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_40%,rgba(249,115,22,0.4),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(234,179,8,0.18),transparent_30%)]" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#101010] to-transparent" />

        {/* Decorative lines */}

        <div className="absolute left-6 top-6 h-px w-32 bg-gradient-to-r from-orange-400/50 to-transparent" />

        <div className="absolute right-6 top-6 h-px w-24 bg-gradient-to-l from-orange-400/30 to-transparent" />

        <div className="absolute right-8 top-8 opacity-10">
          <Crown size={80} />
        </div>

      </div>

      {/* CONTENT */}

      <div className="relative px-5 pb-7 sm:px-7 lg:px-9">

        <div className="-mt-14 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

          {/* PROFILE */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">

            {/* AVATAR */}

            <div className="relative shrink-0">

              <div className="absolute -inset-2 rounded-[24px] bg-gradient-to-br from-orange-500/30 via-transparent to-red-500/20 blur-xl opacity-70" />

              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name || "Student"}
                  className="
                    relative
                    h-28
                    w-28
                    rounded-[22px]
                    border-4
                    border-[#17100d]
                    object-cover
                    shadow-[0_15px_50px_rgba(0,0,0,0.5)]
                    transition-all
                    duration-500
                    group-hover:scale-[1.03]
                  "
                />
              ) : (
                <div
                  className="
                    relative
                    flex
                    h-28
                    w-28
                    items-center
                    justify-center
                    rounded-[22px]
                    border-4
                    border-[#17100d]
                    bg-gradient-to-br
                    from-orange-500/20
                    via-[#1a100b]
                    to-red-900/20
                    text-4xl
                    font-black
                    text-orange-300
                    shadow-[0_15px_50px_rgba(0,0,0,0.5)]
                  "
                >
                  {initial}

                  <div className="absolute inset-2 rounded-[16px] border border-orange-400/15" />

                </div>
              )}

              <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#101010] bg-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                <Shield size={17} />
              </div>

            </div>

            {/* IDENTITY */}

            <div className="pb-1">

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {student.name || "Student"}
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  Active
                </span>

              </div>

              {student.email && (
                <a
                  href={`mailto:${student.email}`}
                  className="
                    mt-3
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    text-white/40
                    transition
                    hover:text-orange-300
                  "
                >
                  <Mail size={15} />

                  {student.email}
                </a>
              )}

              <div className="mt-4 flex flex-wrap gap-2">

                <IdentityBadge
                  icon={<BookOpen size={13} />}
                  text={`${courseCount} Courses`}
                />

                <IdentityBadge
                  icon={<TrendingUp size={13} />}
                  text={`${overallPercentage}% Progress`}
                />

                <IdentityBadge
                  icon={<Sparkles size={13} />}
                  text="Learner"
                />

              </div>

            </div>

          </div>

          {/* COURSE COUNT */}

          <div className="relative overflow-hidden rounded-2xl border border-orange-400/10 bg-orange-500/[0.045] px-5 py-4">

            <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-orange-500/10 blur-2xl" />

            <div className="relative flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-500/10 text-orange-400">
                <BookOpen size={21} />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
                  Enrolled Courses
                </p>

                <p className="mt-1 text-2xl font-black text-white">
                  {courseCount}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   IDENTITY BADGE
===================================================== */

function IdentityBadge({ icon, text }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.035] px-2.5 py-1.5 text-[10px] font-semibold text-white/45">
      <span className="text-orange-400/70">
        {icon}
      </span>

      {text}
    </div>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({
  title,
  value,
  description,
  icon,
  accent = "orange",
  index = 0,
}) {
  const accents = {
    orange: {
      icon: "border-orange-400/15 bg-orange-500/10 text-orange-400",
      glow: "rgba(249,115,22,0.12)",
      line: "from-orange-500/70",
    },

    gold: {
      icon: "border-yellow-400/15 bg-yellow-500/10 text-yellow-400",
      glow: "rgba(234,179,8,0.12)",
      line: "from-yellow-500/70",
    },

    green: {
      icon: "border-emerald-400/15 bg-emerald-500/10 text-emerald-400",
      glow: "rgba(16,185,129,0.10)",
      line: "from-emerald-500/70",
    },

    red: {
      icon: "border-red-400/15 bg-red-500/10 text-red-400",
      glow: "rgba(239,68,68,0.10)",
      line: "from-red-500/70",
    },
  };

  const current =
    accents[accent] || accents.orange;

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/8
        bg-[#101010]/90
        p-5
        backdrop-blur-xl
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-orange-400/20
      "
      style={{
        boxShadow: `0 20px 60px ${current.glow}`,
        animation:
          "cardAppear 0.6s ease both",
        animationDelay: `${index * 80}ms`,
      }}
    >

      <div
        className={`absolute left-0 right-0 top-0 h-px bg-gradient-to-r ${current.line} to-transparent opacity-40`}
      />

      <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-orange-500/5 blur-2xl transition-all duration-500 group-hover:bg-orange-500/10" />

      <div className="relative flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold text-white/40">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-white transition-transform duration-300 group-hover:scale-[1.03] group-hover:text-orange-100">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-white/25">
            {description}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${current.icon} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

/* =====================================================
   OVERALL PROGRESS PANEL
===================================================== */

function OverallProgressPanel({
  percentage,
  completed,
  total,
  remaining,
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-orange-400/10 bg-[#101010]/90 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-7">

      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-orange-500/7 blur-[100px]" />

      <div className="relative">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-500/10 text-orange-400">
                <Award size={18} />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400/60">
                  Overall Mastery
                </p>

                <h3 className="mt-0.5 text-lg font-bold text-white">
                  Student Learning Progress
                </h3>

              </div>

            </div>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              {completed} lectures completed out of{" "}
              {total} total lectures across the student's enrolled courses.
            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="text-right">

              <p className="text-3xl font-black text-orange-300">
                {percentage}%
              </p>

              <p className="text-[10px] uppercase tracking-wider text-white/25">
                Complete
              </p>

            </div>

            <div className="h-14 w-px bg-white/8" />

            <div>

              <p className="text-lg font-bold text-white">
                {remaining}
              </p>

              <p className="text-[10px] uppercase tracking-wider text-white/25">
                Remaining
              </p>

            </div>

          </div>

        </div>

        <div className="mt-7">

          <div className="relative h-3 overflow-hidden rounded-full border border-white/5 bg-white/[0.035]">

            <div
              className="
                relative
                h-full
                rounded-full
                bg-gradient-to-r
                from-orange-700
                via-orange-500
                to-amber-300
                shadow-[0_0_25px_rgba(249,115,22,0.35)]
                transition-all
                duration-1000
              "
              style={{
                width: `${percentage}%`,
              }}
            >

              <div
                className="
                  absolute
                  inset-y-0
                  w-32
                  bg-gradient-to-r
                  from-transparent
                  via-white/30
                  to-transparent
                "
                style={{
                  animation:
                    "progressShine 2.8s linear infinite",
                }}
              />

            </div>

          </div>

          <div className="mt-2 flex justify-between text-[10px] text-white/25">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   COURSE PROGRESS CARD
===================================================== */

function CourseProgressCard({
  item,
  index,
}) {
  const course = item.course || {};
  const progress = item.progress || {};

  const percentage = Math.min(
    Number(progress.percentage || 0),
    100,
  );

  const completedLectures =
    Number(progress.completedLectures || 0);

  const totalLectures =
    Number(progress.totalLectures || 0);

  const remainingLectures = Math.max(
    totalLectures - completedLectures,
    0,
  );

  const lectures = progress.lectures || [];

  const status = getCourseStatus({
    percentage,
    completedLectures,
    totalLectures,
  });

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/8
        bg-[#101010]/95
        shadow-[0_25px_70px_rgba(0,0,0,0.25)]
        backdrop-blur-xl
        transition-all
        duration-500
        hover:border-orange-400/15
        hover:shadow-[0_30px_90px_rgba(249,115,22,0.06)]
      "
      style={{
        animation:
          "cardAppear 0.65s ease both",
        animationDelay: `${index * 120}ms`,
      }}
    >

      {/* TOP ENERGY LINE */}

      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-orange-500/70 via-amber-400/20 to-transparent opacity-60" />

      {/* =================================================
          COURSE HEADER
      ================================================= */}

      <div className="border-b border-white/6 p-5 sm:p-6">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* COURSE INFO */}

          <div className="flex min-w-0 items-center gap-4">

            <div className="relative shrink-0">

              <div className="absolute -inset-1 rounded-2xl bg-orange-500/10 blur-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {course.courseThumbnail?.url ? (
                <img
                  src={course.courseThumbnail.url}
                  alt={
                    course.courseTitle ||
                    "Course"
                  }
                  className="
                    relative
                    h-20
                    w-28
                    rounded-2xl
                    border
                    border-white/10
                    object-cover
                    shadow-lg
                    transition-transform
                    duration-500
                    group-hover:scale-[1.03]
                  "
                />
              ) : (
                <div className="relative flex h-20 w-28 items-center justify-center rounded-2xl border border-orange-400/10 bg-orange-500/5 text-orange-400">
                  <BookOpen size={26} />
                </div>
              )}

              <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-lg border border-[#101010] bg-orange-500 text-black">
                <BookOpen size={13} />
              </div>

            </div>

            <div className="min-w-0">

              <h2 className="truncate text-lg font-bold text-white sm:text-xl">
                {course.courseTitle ||
                  "Course"}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2">

                <span className="rounded-full border border-orange-400/10 bg-orange-500/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-300/80">
                  {course.courseLevel ||
                    "N/A"}
                </span>

                <span className="text-xs text-white/25">
                  ₹{course.coursePrice || 0}
                </span>

              </div>

            </div>

          </div>

          <StatusBadge status={status} />

        </div>

        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="mt-7">

          <div className="mb-3 flex items-end justify-between">

            <div>

              <p className="text-sm font-semibold text-white">
                Course Progress
              </p>

              <p className="mt-1 text-xs text-white/30">
                {completedLectures} of{" "}
                {totalLectures} lectures completed
              </p>

            </div>

            <span className="text-2xl font-black text-orange-300">
              {percentage}%
            </span>

          </div>

          <div className="relative h-3 overflow-hidden rounded-full border border-white/5 bg-white/[0.035]">

            <div
              className="
                relative
                h-full
                rounded-full
                bg-gradient-to-r
                from-orange-800
                via-orange-500
                to-amber-300
                shadow-[0_0_18px_rgba(249,115,22,0.3)]
                transition-all
                duration-1000
              "
              style={{
                width: `${percentage}%`,
              }}
            >

              <div className="absolute inset-0 overflow-hidden rounded-full">

                <div
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  style={{
                    animation:
                      "progressShine 2.6s linear infinite",
                  }}
                />

              </div>

            </div>

          </div>

          <div className="mt-2 flex justify-between text-[10px] text-white/25">

            <span>
              {completedLectures} completed
            </span>

            <span>
              {remainingLectures} remaining
            </span>

          </div>

        </div>

      </div>

      {/* =================================================
          LAST ACTIVITY
      ================================================= */}

      <LastActivity
        lastActivity={progress.lastActivity}
      />

      {/* =================================================
          LECTURE PROGRESS
      ================================================= */}

      <div>

        <div className="border-b border-white/6 px-5 py-5 sm:px-6">

          <div className="flex items-center justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-400/10 bg-orange-500/5 text-orange-400">
                  <PlayCircle size={16} />
                </div>

                <h3 className="font-semibold text-white">
                  Lecture Progress
                </h3>

              </div>

              <p className="mt-2 text-xs text-white/30">
                Track the student's progress through each lecture.
              </p>

            </div>

            <div className="hidden items-center gap-2 rounded-lg border border-white/6 bg-white/[0.025] px-3 py-2 text-[10px] font-semibold text-white/30 sm:flex">
              <Sparkles
                size={13}
                className="text-orange-400/60"
              />
              Learning Timeline
            </div>

          </div>

        </div>

        {lectures.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center px-6 text-center">

            <div>

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.025] text-white/20">
                <BookOpen size={28} />
              </div>

              <p className="mt-4 text-sm text-white/45">
                Detailed lecture progress is not available yet.
              </p>

              <p className="mt-1 max-w-md text-xs leading-5 text-white/25">
                Lecture progress will appear here once the backend returns individual lecture data.
              </p>

            </div>

          </div>
        ) : (
          <div className="divide-y divide-white/5">

            {lectures.map((lecture, lectureIndex) => (
              <LectureProgressRow
                key={
                  lecture._id ||
                  lecture.lecture ||
                  `${lecture.order}-${lecture.title}`
                }
                lecture={lecture}
                index={lectureIndex}
              />
            ))}

          </div>
        )}

      </div>

      {/* =================================================
          ENROLLMENT DATE
      ================================================= */}

      <div className="border-t border-white/6 bg-white/[0.015] px-5 py-4 sm:px-6">

        <div className="flex items-center gap-2 text-xs text-white/35">

          <CalendarDays
            size={15}
            className="text-orange-400/60"
          />

          <span>
            Enrolled{" "}
            {item.enrolledAt
              ? formatDate(item.enrolledAt)
              : "N/A"}
          </span>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   LAST ACTIVITY
===================================================== */

function LastActivity({
  lastActivity,
}) {
  if (!lastActivity) {
    return (
      <div className="border-b border-white/6 bg-white/[0.015] px-5 py-4 sm:px-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/7 bg-white/[0.025] text-white/25">
            <Clock3 size={18} />
          </div>

          <div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-white/25">
              Last Activity
            </p>

            <p className="mt-1 text-sm text-white/35">
              No activity recorded yet
            </p>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="border-b border-white/6 bg-orange-500/[0.018] px-5 py-4 sm:px-6">

      <div className="flex items-center gap-3">

        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-500/5 text-orange-400">

          <div className="absolute inset-0 rounded-xl bg-orange-500/10 blur-md" />

          <Clock3
            size={18}
            className="relative"
          />

        </div>

        <div className="min-w-0">

          <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400/50">
            Last Activity
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-white/75">
            {lastActivity.lectureTitle ||
              "Lecture activity"}
          </p>

          {lastActivity.completedAt && (
            <p className="mt-1 text-xs text-white/25">
              Completed{" "}
              {formatDateTime(
                lastActivity.completedAt,
              )}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   LECTURE PROGRESS ROW
===================================================== */

function LectureProgressRow({
  lecture,
  index,
}) {
  const completed = Boolean(
    lecture.completed,
  );

  const watchedSeconds =
    Number(
      lecture.watchedSeconds || 0,
    );

  const videoDuration =
    Number(
      lecture.videoDuration ||
        lecture.duration ||
        0,
    );

  const watchedPercentage =
    videoDuration > 0
      ? Math.min(
          Math.round(
            (watchedSeconds /
              videoDuration) *
              100,
          ),
          100,
        )
      : 0;

  const lectureTitle =
    lecture.title ||
    lecture.lectureTitle ||
    "Lecture";

  const lectureOrder =
    lecture.order || "";

  return (
    <div
      className="
        group
        relative
        flex
        flex-col
        gap-4
        px-5
        py-5
        transition-all
        duration-300
        hover:bg-orange-500/[0.025]
        sm:flex-row
        sm:items-center
        sm:px-6
      "
    >

      {/* TIMELINE */}

      <div className="relative shrink-0">

        {!completed && (
          <div className="absolute left-1/2 top-full h-5 w-px -translate-x-1/2 bg-gradient-to-b from-white/10 to-transparent sm:hidden" />
        )}

        {completed ? (
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.08)]">

            <Check
              size={19}
              strokeWidth={3}
            />

          </div>
        ) : watchedSeconds > 0 ? (
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-orange-400/20 bg-orange-500/10 text-orange-400">

            <PlayCircle size={19} />

          </div>
        ) : (
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-white/[0.025] text-white/25">

            <Circle size={18} />

          </div>
        )}

      </div>

      {/* INFO */}

      <div className="min-w-0 flex-1">

        <div className="flex flex-wrap items-center gap-2">

          <p className="font-semibold text-white/75 transition-colors group-hover:text-orange-100">

            {lectureOrder
              ? `${lectureOrder}. `
              : ""}

            {lectureTitle}

          </p>

          {completed && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/10 bg-emerald-500/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
              <Check size={9} />
              Completed
            </span>
          )}

        </div>

        {/* WATCHED PROGRESS */}

        {!completed &&
          watchedSeconds > 0 && (
            <div className="mt-3 max-w-xl">

              <div className="mb-1.5 flex items-center justify-between text-[10px] text-white/25">

                <span>
                  Watched
                </span>

                <span className="font-semibold text-orange-300/70">
                  {watchedPercentage}%
                </span>

              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-700 to-orange-400 transition-all duration-700"
                  style={{
                    width: `${watchedPercentage}%`,
                  }}
                />

              </div>

            </div>
          )}

        {completed &&
          lecture.completedAt && (
            <p className="mt-2 flex items-center gap-1.5 text-[10px] text-white/25">

              <CalendarDays size={12} />

              Completed{" "}
              {formatDateTime(
                lecture.completedAt,
              )}

            </p>
          )}

      </div>

      {/* STATUS */}

      <div className="shrink-0">

        {completed ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/10 bg-emerald-500/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 size={13} />
            Completed
          </span>
        ) : watchedSeconds > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-orange-400/10 bg-orange-500/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-orange-300">
            <Flame size={13} />
            In Progress
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/7 bg-white/[0.025] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/25">
            <Circle size={12} />
            Not Started
          </span>
        )}

      </div>

    </div>
  );
}

/* =====================================================
   COURSE STATUS
===================================================== */

function getCourseStatus({
  percentage,
  completedLectures,
  totalLectures,
}) {
  if (
    totalLectures > 0 &&
    completedLectures >= totalLectures
  ) {
    return "Completed";
  }

  if (
    completedLectures > 0 ||
    percentage > 0
  ) {
    return "In Progress";
  }

  return "Not Started";
}

/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({
  status,
}) {
  const styles = {
    Completed:
      "border-emerald-400/15 bg-emerald-500/8 text-emerald-400",
    "In Progress":
      "border-orange-400/15 bg-orange-500/8 text-orange-300",
    "Not Started":
      "border-white/8 bg-white/[0.025] text-white/30",
  };

  const icons = {
    Completed: <CheckCircle2 size={13} />,
    "In Progress": <Flame size={13} />,
    "Not Started": <Circle size={12} />,
  };

  return (
    <span
      className={`
        inline-flex
        shrink-0
        items-center
        gap-1.5
        rounded-full
        border
        px-3
        py-1.5
        text-[10px]
        font-bold
        uppercase
        tracking-wider
        ${styles[status] || styles["Not Started"]}
      `}
    >
      {icons[status]}

      {status}
    </span>
  );
}

/* =====================================================
   EMPTY COURSES
===================================================== */

function EmptyCourses() {
  return (
    <div className="relative flex min-h-[330px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/8 bg-[#101010]/90 px-6 text-center shadow-[0_25px_70px_rgba(0,0,0,0.25)]">

      <div className="absolute h-72 w-72 rounded-full bg-orange-500/5 blur-[100px]" />

      <div className="relative z-10">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-orange-400/10 bg-orange-500/5 text-orange-400/60">

          <BookOpen size={32} />

        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-400/50">
          Empty Realm
        </p>

        <h3 className="mt-2 text-lg font-bold text-white">
          No courses found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/30">
          This student is not enrolled in any of your courses.
        </p>

      </div>

    </div>
  );
}

/* =====================================================
   DATE HELPERS
===================================================== */

function formatDate(date) {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString();
}

function formatDateTime(date) {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "N/A";
  }

  return parsedDate.toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );
}

export default InstructorStudentDetails;