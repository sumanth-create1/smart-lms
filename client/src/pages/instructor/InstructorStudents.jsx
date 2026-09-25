import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Crown,
  Eye,
  Flame,
  Gem,
  Mail,
  Search,
  Shield,
  Sparkles,
  Swords,
  UserRound,
  Users,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../../services/api";

// =====================================================
// CONSTANTS
// =====================================================

const EMPTY_ARRAY = [];

const EMBER_COUNT = 16;

// =====================================================
// MAIN COMPONENT
// =====================================================

function InstructorStudents() {
  // ---------------------------------------------------
  // DATA
  // ---------------------------------------------------

  const [enrollments, setEnrollments] =
    useState(EMPTY_ARRAY);

  const [loading, setLoading] =
    useState(true);

  // ---------------------------------------------------
  // SEARCH
  // ---------------------------------------------------

  const [search, setSearch] =
    useState("");

  // ---------------------------------------------------
  // CURSOR
  // ---------------------------------------------------

  const cursorRef = useRef(null);

  const cursorGlowRef = useRef(null);

  // ===================================================
  // FETCH STUDENTS
  // ===================================================

  useEffect(() => {
    let mounted = true;

    const fetchStudents = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          "/dashboard/instructor/students",
        );

        if (!mounted) return;

        if (response.data?.success) {
          setEnrollments(
            Array.isArray(response.data.data)
              ? response.data.data
              : EMPTY_ARRAY,
          );
        } else {
          toast.error(
            response.data?.message ||
              "Failed to load students",
          );
        }
      } catch (error) {
        if (!mounted) return;

        console.error(
          "Instructor students error:",
          error,
        );

        toast.error(
          error.response?.data?.message ||
            "Unable to load students",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStudents();

    return () => {
      mounted = false;
    };
  }, []);

  // ===================================================
  // PREMIUM CURSOR
  // ===================================================

  useEffect(() => {
    // Avoid cursor animation on touch devices.
    const isTouchDevice =
      window.matchMedia(
        "(pointer: coarse)",
      ).matches;

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    if (isTouchDevice || reducedMotion) {
      return;
    }

    let frameId = null;

    const moveCursor = (event) => {
      if (frameId !== null) {
        return;
      }

      frameId =
        requestAnimationFrame(() => {
          const { clientX, clientY } =
            event;

          if (cursorRef.current) {
            cursorRef.current.style.transform =
              `translate3d(${clientX}px, ${clientY}px, 0)`;
          }

          if (
            cursorGlowRef.current
          ) {
            cursorGlowRef.current.style.transform =
              `translate3d(${clientX}px, ${clientY}px, 0)`;
          }

          frameId = null;
        });
    };

    window.addEventListener(
      "mousemove",
      moveCursor,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        moveCursor,
      );

      if (frameId !== null) {
        cancelAnimationFrame(
          frameId,
        );
      }
    };
  }, []);

  // ===================================================
  // NORMALIZED SEARCH
  // ===================================================

  const normalizedSearch = useMemo(
    () =>
      search
        .trim()
        .toLowerCase(),
    [search],
  );

  // ===================================================
  // GROUP ENROLLMENTS BY STUDENT
  // ===================================================
  //
  // BEFORE:
  //
  // Sumanth -> Course A
  // Sumanth -> Course B
  //
  // AFTER:
  //
  // Sumanth
  //   ├── Course A
  //   └── Course B
  //
  // ===================================================

  const students = useMemo(() => {
    if (!enrollments.length) {
      return EMPTY_ARRAY;
    }

    const studentMap =
      new Map();

    for (const enrollment of enrollments) {
      const student =
        enrollment?.student;

      const course =
        enrollment?.course;

      // ------------------------------------------------
      // Student identity
      // ------------------------------------------------

      const studentId =
        student?._id
          ? String(student._id)
          : student?.email
            ? `email:${student.email.toLowerCase()}`
            : `unknown:${student?.name || "student"}`;

      // ------------------------------------------------
      // First time seeing student
      // ------------------------------------------------

      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          student,
          studentId:
            student?._id
              ? String(student._id)
              : null,

          enrollments: [],

          courses: new Map(),

          latestEnrollment: null,

          searchText: "",
        });
      }

      const record =
        studentMap.get(studentId);

      // ------------------------------------------------
      // Store enrollment
      // ------------------------------------------------

      record.enrollments.push(
        enrollment,
      );

      // ------------------------------------------------
      // Course identity
      // ------------------------------------------------

      if (course) {
        const courseId =
          course?._id
            ? String(course._id)
            : `course:${course?.courseTitle || "course"}`;

        if (
          !record.courses.has(
            courseId,
          )
        ) {
          record.courses.set(
            courseId,
            course,
          );
        }
      }

      // ------------------------------------------------
      // Latest enrollment
      // ------------------------------------------------

      const currentDate =
        enrollment?.enrolledAt
          ? new Date(
              enrollment.enrolledAt,
            ).getTime()
          : 0;

      const previousDate =
        record.latestEnrollment
          ?.enrolledAt
          ? new Date(
              record.latestEnrollment.enrolledAt,
            ).getTime()
          : 0;

      if (
        !record.latestEnrollment ||
        currentDate > previousDate
      ) {
        record.latestEnrollment =
          enrollment;
      }
    }

    // --------------------------------------------------
    // Convert Map → array
    // --------------------------------------------------

    return Array.from(
      studentMap.values(),
    ).map((record) => {
      const courses =
        Array.from(
          record.courses.values(),
        );

      const name =
        record.student?.name ||
        "Student";

      const email =
        record.student?.email ||
        "";

      const courseNames =
        courses
          .map(
            (course) =>
              course?.courseTitle ||
              "",
          )
          .join(" ");

      // Pre-compute searchable text.
      //
      // This means search doesn't repeatedly
      // traverse nested objects.
      record.searchText =
        `${name} ${email} ${courseNames}`
          .toLowerCase();

      return {
        ...record,

        courses,

        enrollmentCount:
          record.enrollments.length,

        courseCount:
          courses.length,
      };
    });
  }, [enrollments]);

  // ===================================================
  // FILTER UNIQUE STUDENTS
  // ===================================================

  const filteredStudents =
    useMemo(() => {
      if (!normalizedSearch) {
        return students;
      }

      return students.filter(
        (student) =>
          student.searchText.includes(
            normalizedSearch,
          ),
      );
    }, [
      students,
      normalizedSearch,
    ]);

  // ===================================================
  // STATS
  // ===================================================

  const totalEnrollments =
    enrollments.length;

  const totalStudents =
    students.length;

  const totalCourses =
    useMemo(() => {
      const courseIds =
        new Set();

      for (const enrollment of enrollments) {
        if (enrollment?.course?._id) {
          courseIds.add(
            String(
              enrollment.course._id,
            ),
          );
        }
      }

      return courseIds.size;
    }, [enrollments]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return <StudentsLoading />;
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="students-realm relative min-h-screen overflow-hidden bg-[#070707] text-white">

      {/* =================================================
          PREMIUM CURSOR
      ================================================= */}

      <div
        ref={cursorGlowRef}
        className="students-cursor-glow pointer-events-none fixed left-0 top-0 z-[9998]"
      />

      <div
        ref={cursorRef}
        className="students-cursor pointer-events-none fixed left-0 top-0 z-[9999]"
      >
        <div className="students-cursor-dot" />
      </div>

      {/* =================================================
          AMBIENT WORLD
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <div className="students-orb students-orb-one" />

        <div className="students-orb students-orb-two" />

        <div className="students-orb students-orb-three" />

        <div className="students-grid" />

        {Array.from({
          length: EMBER_COUNT,
        }).map((_, index) => (
          <span
            key={index}
            className="students-ember"
            style={{
              left: `${5 + index * 6}%`,
              animationDelay:
                `${index * 0.55}s`,
              animationDuration:
                `${6 + (index % 4)}s`,
            }}
          />
        ))}
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="relative z-10 space-y-7 p-4 sm:p-6 lg:p-8">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#101010]/90 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">

          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-70" />

          <div className="absolute -right-32 -top-40 h-96 w-96 rounded-full bg-orange-600/10 blur-[110px]" />

          <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-red-700/10 blur-[100px]" />

          <div className="relative p-6 sm:p-8 lg:p-10">

            <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">

              {/* HERO TEXT */}

              <div>

                <div className="mb-4 flex flex-wrap items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-500/10 text-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.08)]">
                    <Crown size={19} />
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-[0.28em] text-orange-400/70">
                    The Royal Student Registry
                  </span>

                  <span className="h-1 w-1 rounded-full bg-orange-400/40" />

                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-white/25">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    Realm Online
                  </span>

                </div>

                <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Know your{" "}
                  <span className="bg-gradient-to-r from-orange-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                    learners.
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/35 sm:text-base">
                  One learner. One realm.
                  Explore every course
                  under your command
                  from a single registry.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">

                  <RealmTag
                    icon={<Users size={13} />}
                    text={`${totalStudents} Learners`}
                  />

                  <RealmTag
                    icon={<BookOpen size={13} />}
                    text={`${totalCourses} Courses`}
                  />

                  <RealmTag
                    icon={<Sparkles size={13} />}
                    text={`${totalEnrollments} Enrollments`}
                  />

                </div>

              </div>

              {/* COMMAND EMBLEM */}

              <div className="relative hidden xl:block">

                <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-orange-400/10 bg-orange-500/[0.025]">

                  <div className="absolute inset-4 rounded-full border border-orange-400/10" />

                  <div className="absolute inset-8 rounded-full border border-dashed border-orange-400/10 students-rotating-ring" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/15 to-red-900/10 text-orange-400 shadow-[0_0_40px_rgba(249,115,22,0.12)]">
                    <Swords size={34} />
                  </div>

                  <div className="absolute left-4 top-12 text-orange-400/30">
                    <Gem size={13} />
                  </div>

                  <div className="absolute right-5 top-9 text-orange-400/30">
                    <Sparkles size={12} />
                  </div>

                  <div className="absolute bottom-8 left-9 text-orange-400/25">
                    <Flame size={13} />
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <InfoCard
            title="Total Enrollments"
            value={totalEnrollments}
            description="All enrollment records"
            icon={<Users size={21} />}
            accent="orange"
          />

          <InfoCard
            title="Unique Students"
            value={totalStudents}
            description="Distinct learners"
            icon={<UserRound size={21} />}
            accent="green"
          />

          <InfoCard
            title="Courses"
            value={totalCourses}
            description="Courses under your command"
            icon={<BookOpen size={21} />}
            accent="gold"
          />

        </section>

        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0f0f0f]/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-5">

          <div className="absolute left-0 top-0 h-px w-40 bg-gradient-to-r from-orange-500/70 to-transparent" />

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-500/5 text-orange-400">
                <Search size={18} />
              </div>

              <div>

                <p className="text-sm font-bold text-white">
                  Search the Registry
                </p>

                <p className="mt-0.5 text-[10px] text-white/25">
                  Name · email · course
                </p>

              </div>

            </div>

            <div className="relative w-full lg:max-w-xl">

              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/40"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search student, email or course..."
                className="w-full rounded-xl border border-white/8 bg-black/30 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-orange-400/30 focus:bg-orange-500/[0.025] focus:shadow-[0_0_30px_rgba(249,115,22,0.08)]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-1.5 text-white/30 transition hover:bg-white/5 hover:text-orange-300"
                >
                  <X size={15} />
                </button>
              )}

            </div>

          </div>

        </section>

        {/* =================================================
            REGISTRY
        ================================================= */}

        <section className="relative overflow-hidden rounded-[26px] border border-white/8 bg-[#0e0e0e]/95 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">

          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-orange-500/60 via-transparent to-transparent" />

          {/* HEADER */}

          <div className="border-b border-white/6 px-5 py-5 sm:px-6">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-400/10 bg-orange-500/5 text-orange-400">
                    <Shield size={15} />
                  </div>

                  <h2 className="text-lg font-bold text-white">
                    Student Registry
                  </h2>

                </div>

                <p className="mt-2 text-xs text-white/25">
                  {filteredStudents.length}{" "}
                  {filteredStudents.length === 1
                    ? "student"
                    : "students"}{" "}
                  displayed
                </p>

              </div>

              <div className="flex items-center gap-2">

                {search && (
                  <span className="rounded-full border border-orange-400/10 bg-orange-500/5 px-3 py-1.5 text-[10px] font-bold text-orange-300">
                    Filtered
                  </span>
                )}

                <span className="rounded-full border border-white/7 bg-white/[0.025] px-3 py-1.5 text-[10px] font-semibold text-white/30">
                  {filteredStudents.length} Students
                </span>

              </div>

            </div>

          </div>

          {/* EMPTY */}

          {filteredStudents.length === 0 ? (
            <EmptyStudents
              search={search}
            />
          ) : (
            <>
              {/* =================================================
                  DESKTOP
              ================================================= */}

              <div className="hidden overflow-x-auto md:block">

                <table className="w-full">

                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.015]">

                      <TableHeader>
                        Student
                      </TableHeader>

                      <TableHeader>
                        Courses
                      </TableHeader>

                      <TableHeader>
                        Enrollments
                      </TableHeader>

                      <TableHeader>
                        Latest Joined
                      </TableHeader>

                      <TableHeader>
                        Email
                      </TableHeader>

                      <TableHeader>
                        Action
                      </TableHeader>

                    </tr>
                  </thead>

                  <tbody>

                    {filteredStudents.map(
                      (
                        student,
                        index,
                      ) => (
                        <StudentTableRow
                          key={
                            student.studentId ||
                            student.searchText
                          }
                          student={student}
                          index={index}
                        />
                      ),
                    )}

                  </tbody>

                </table>

              </div>

              {/* =================================================
                  MOBILE
              ================================================= */}

              <div className="divide-y divide-white/5 md:hidden">

                {filteredStudents.map(
                  (
                    student,
                    index,
                  ) => (
                    <MobileStudentCard
                      key={
                        student.studentId ||
                        student.searchText
                      }
                      student={student}
                      index={index}
                    />
                  ),
                )}

              </div>
            </>
          )}

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <PremiumFooter />

      </div>

      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`
        /* =================================================
           CURSOR
        ================================================= */

        .students-cursor {
          width: 32px;
          height: 32px;
          margin-left: -16px;
          margin-top: -16px;
          border: 1px solid rgba(251,146,60,0.75);
          border-radius: 50%;
          box-shadow:
            0 0 18px rgba(249,115,22,0.25),
            inset 0 0 12px rgba(249,115,22,0.08);
          will-change: transform;
        }

        .students-cursor-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 4px;
          height: 4px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: #fb923c;
          box-shadow:
            0 0 8px rgba(251,146,60,0.9),
            0 0 20px rgba(249,115,22,0.6);
        }

        .students-cursor-glow {
          width: 130px;
          height: 130px;
          margin-left: -65px;
          margin-top: -65px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(249,115,22,0.09),
              rgba(249,115,22,0.025) 40%,
              transparent 72%
            );
          filter: blur(4px);
          will-change: transform;
        }

        /* =================================================
           BACKGROUND
        ================================================= */

        .students-grid {
          position: absolute;
          inset: 0;
          opacity: 0.12;
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
              transparent 90%
            );
        }

        .students-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(110px);
          will-change: transform;
        }

        .students-orb-one {
          width: 500px;
          height: 500px;
          left: -180px;
          top: -180px;
          background: rgba(180,60,10,0.10);
          animation: studentsOrbOne 16s ease-in-out infinite;
        }

        .students-orb-two {
          width: 420px;
          height: 420px;
          right: -150px;
          top: 35%;
          background: rgba(249,115,22,0.07);
          animation: studentsOrbTwo 19s ease-in-out infinite;
        }

        .students-orb-three {
          width: 380px;
          height: 380px;
          bottom: -180px;
          left: 35%;
          background: rgba(234,179,8,0.045);
          animation: studentsOrbThree 17s ease-in-out infinite;
        }

        /* =================================================
           EMBERS
        ================================================= */

        .students-ember {
          position: absolute;
          bottom: -20px;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #fb923c;
          box-shadow:
            0 0 8px rgba(251,146,60,0.9),
            0 0 18px rgba(249,115,22,0.45);
          opacity: 0;
          animation: studentsEmberRise linear infinite;
        }

        /* =================================================
           RING
        ================================================= */

        .students-rotating-ring {
          animation:
            studentsRotate
            20s
            linear
            infinite;
        }

        /* =================================================
           ANIMATIONS
        ================================================= */

        @keyframes studentsOrbOne {
          0%,100% {
            transform:
              translate3d(0,0,0)
              scale(1);
          }

          50% {
            transform:
              translate3d(70px,55px,0)
              scale(1.06);
          }
        }

        @keyframes studentsOrbTwo {
          0%,100% {
            transform:
              translate3d(0,0,0);
          }

          50% {
            transform:
              translate3d(-65px,35px,0);
          }
        }

        @keyframes studentsOrbThree {
          0%,100% {
            transform:
              translate3d(0,0,0);
          }

          50% {
            transform:
              translate3d(40px,-50px,0);
          }
        }

        @keyframes studentsEmberRise {
          0% {
            transform:
              translate3d(0,0,0)
              scale(0.4);
            opacity: 0;
          }

          15% {
            opacity: 0.7;
          }

          70% {
            opacity: 0.35;
          }

          100% {
            transform:
              translate3d(35px,-90vh,0)
              scale(1);
            opacity: 0;
          }
        }

        @keyframes studentsRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes studentsAppear {
          from {
            opacity: 0;
            transform:
              translate3d(0,8px,0);
          }

          to {
            opacity: 1;
            transform:
              translate3d(0,0,0);
          }
        }

        @media (max-width: 768px) {
          .students-cursor,
          .students-cursor-glow {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .students-orb,
          .students-ember,
          .students-rotating-ring {
            animation: none !important;
          }
        }
      `}</style>

    </div>
  );
}

// =====================================================
// REALM TAG
// =====================================================

function RealmTag({
  icon,
  text,
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.025] px-3 py-2 text-[10px] font-semibold text-white/40">
      <span className="text-orange-400/70">
        {icon}
      </span>

      {text}
    </div>
  );
}

// =====================================================
// INFO CARD
// =====================================================

function InfoCard({
  title,
  value,
  description,
  icon,
  accent,
}) {
  const themes = {
    orange: {
      icon: "border-orange-400/15 bg-orange-500/10 text-orange-400",
      glow:
        "group-hover:shadow-[0_20px_60px_rgba(249,115,22,0.08)]",
    },

    green: {
      icon:
        "border-emerald-400/15 bg-emerald-500/10 text-emerald-400",
      glow:
        "group-hover:shadow-[0_20px_60px_rgba(16,185,129,0.06)]",
    },

    gold: {
      icon:
        "border-yellow-400/15 bg-yellow-500/10 text-yellow-400",
      glow:
        "group-hover:shadow-[0_20px_60px_rgba(234,179,8,0.07)]",
    },
  };

  const theme =
    themes[accent] ||
    themes.orange;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/8 bg-[#101010]/90 p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-orange-400/15 ${theme.glow}`}
    >
      <div className="absolute left-0 top-0 h-px w-28 bg-gradient-to-r from-orange-500/60 to-transparent" />

      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-orange-500/5 blur-2xl opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">

        <div>
          <p className="text-xs font-semibold text-white/35">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-white transition group-hover:text-orange-100">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-white/20">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 group-hover:rotate-3 group-hover:scale-110 ${theme.icon}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

// =====================================================
// TABLE HEADER
// =====================================================

function TableHeader({
  children,
}) {
  return (
    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">
      {children}
    </th>
  );
}

// =====================================================
// DESKTOP STUDENT ROW
// =====================================================

function StudentTableRow({
  student,
  index,
}) {
  const {
    student: user,
    studentId,
    courses,
    enrollmentCount,
    latestEnrollment,
  } = student;

  return (
    <tr
      className="group border-b border-white/5 transition-all duration-300 hover:bg-orange-500/[0.025]"
      style={{
        animation:
          "studentsAppear 0.45s ease both",
        animationDelay:
          `${Math.min(index * 35, 350)}ms`,
      }}
    >

      {/* STUDENT */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-3">

          <StudentAvatar
            student={user}
            size="desktop"
          />

          <div className="min-w-0">

            {studentId ? (
              <Link
                to={`/instructor/students/${studentId}`}
                className="font-semibold text-white/80 transition hover:text-orange-300"
              >
                {user?.name ||
                  "Student"}
              </Link>
            ) : (
              <p className="font-semibold text-white/80">
                {user?.name ||
                  "Student"}
              </p>
            )}

            <p className="mt-1 flex items-center gap-1.5 text-[10px] text-white/20">
              <Shield size={10} />
              Registered Learner
            </p>

          </div>

        </div>

      </td>

      {/* COURSES */}

      <td className="px-6 py-5">

        <div className="flex max-w-[330px] flex-wrap gap-1.5">

          {courses
            .slice(0, 2)
            .map((course) => (
              <span
                key={
                  course?._id ||
                  course?.courseTitle
                }
                className="inline-flex max-w-[150px] items-center gap-1.5 truncate rounded-lg border border-orange-400/10 bg-orange-500/5 px-2.5 py-1.5 text-[9px] font-bold text-orange-300/70"
                title={
                  course?.courseTitle
                }
              >
                <BookOpen
                  size={11}
                  className="shrink-0"
                />

                <span className="truncate">
                  {course?.courseTitle ||
                    "Course"}
                </span>
              </span>
            ))}

          {courses.length > 2 && (
            <span className="inline-flex items-center rounded-lg border border-white/8 bg-white/[0.025] px-2.5 py-1.5 text-[9px] font-bold text-white/35">
              +{courses.length - 2} more
            </span>
          )}

        </div>

      </td>

      {/* ENROLLMENTS */}

      <td className="px-6 py-5">

        <div className="inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.025] px-3 py-2">
          <Sparkles
            size={12}
            className="text-orange-400/60"
          />

          <span className="text-xs font-bold text-white/60">
            {enrollmentCount}
          </span>
        </div>

      </td>

      {/* LATEST JOINED */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-2 text-xs text-white/35">

          <CalendarDays
            size={14}
            className="text-orange-400/50"
          />

          {formatDate(
            latestEnrollment?.enrolledAt,
          )}

        </div>

      </td>

      {/* EMAIL */}

      <td className="px-6 py-5">

        {user?.email ? (
          <a
            href={`mailto:${user.email}`}
            className="group/email inline-flex max-w-[220px] items-center gap-2 text-xs text-white/35 transition hover:text-orange-300"
          >
            <Mail
              size={14}
              className="shrink-0 text-white/20 transition group-hover/email:text-orange-400"
            />

            <span className="truncate">
              {user.email}
            </span>
          </a>
        ) : (
          <span className="text-xs text-white/20">
            No email
          </span>
        )}

      </td>

      {/* ACTION */}

      <td className="px-6 py-5">

        {studentId ? (
          <Link
            to={`/instructor/students/${studentId}`}
            className="group/view inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.025] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/40 transition-all duration-300 hover:border-orange-400/20 hover:bg-orange-500/8 hover:text-orange-300"
          >
            <Eye size={13} />

            View

            <ArrowRight
              size={13}
              className="transition-transform duration-300 group-hover/view:translate-x-0.5"
            />
          </Link>
        ) : (
          <span className="text-xs text-white/20">
            Unavailable
          </span>
        )}

      </td>

    </tr>
  );
}

// =====================================================
// MOBILE STUDENT CARD
// =====================================================

function MobileStudentCard({
  student,
  index,
}) {
  const {
    student: user,
    studentId,
    courses,
    enrollmentCount,
    latestEnrollment,
  } = student;

  return (
    <div
      className="relative overflow-hidden p-5"
      style={{
        animation:
          "studentsAppear 0.45s ease both",
        animationDelay:
          `${Math.min(index * 40, 300)}ms`,
      }}
    >

      <div className="absolute left-0 top-0 h-px w-20 bg-gradient-to-r from-orange-500/50 to-transparent" />

      {/* STUDENT */}

      <div className="flex items-start gap-4">

        <StudentAvatar
          student={user}
          size="mobile"
        />

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              {studentId ? (
                <Link
                  to={`/instructor/students/${studentId}`}
                  className="font-bold text-white/85 transition hover:text-orange-300"
                >
                  {user?.name ||
                    "Student"}
                </Link>
              ) : (
                <h3 className="font-bold text-white/85">
                  {user?.name ||
                    "Student"}
                </h3>
              )}

              <p className="mt-1 text-[10px] uppercase tracking-wider text-white/20">
                {enrollmentCount}{" "}
                {enrollmentCount === 1
                  ? "Enrollment"
                  : "Enrollments"}
              </p>

            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-400/10 bg-orange-500/5 text-orange-400/70">
              <Shield size={14} />
            </div>

          </div>

          {user?.email && (
            <a
              href={`mailto:${user.email}`}
              className="mt-3 flex items-center gap-2 text-xs text-white/35 transition hover:text-orange-300"
            >
              <Mail size={13} />

              <span className="truncate">
                {user.email}
              </span>
            </a>
          )}

        </div>

      </div>

      {/* COURSES */}

      <div className="mt-5 rounded-2xl border border-white/6 bg-white/[0.02] p-4">

        <div className="mb-3 flex items-center justify-between">

          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/20">
            Enrolled Courses
          </p>

          <span className="text-[9px] font-bold text-orange-400/60">
            {courses.length}{" "}
            {courses.length === 1
              ? "Course"
              : "Courses"}
          </span>

        </div>

        <div className="space-y-2">

          {courses.map(
            (course) => (
              <div
                key={
                  course?._id ||
                  course?.courseTitle
                }
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 p-3"
              >

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-400/10 bg-orange-500/5 text-orange-400/70">
                  <BookOpen size={15} />
                </div>

                <div className="min-w-0">

                  <p className="truncate text-xs font-semibold text-white/65">
                    {course?.courseTitle ||
                      "Course"}
                  </p>

                  <p className="mt-1 text-[9px] text-white/20">
                    {course?.courseLevel ||
                      "N/A"}
                    {" • "}
                    ₹
                    {course?.coursePrice ||
                      0}
                  </p>

                </div>

              </div>
            ),
          )}

        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3 text-[10px] text-white/25">

          <CalendarDays
            size={13}
            className="text-orange-400/50"
          />

          Latest enrollment{" "}
          {formatDate(
            latestEnrollment?.enrolledAt,
          )}

        </div>

      </div>

      {/* ACTION */}

      {studentId && (
        <Link
          to={`/instructor/students/${studentId}`}
          className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-400/15 bg-orange-500/8 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-orange-300 transition-all duration-300 hover:border-orange-400/30 hover:bg-orange-500/12 hover:shadow-[0_0_30px_rgba(249,115,22,0.08)]"
        >
          <Eye size={15} />

          View Student Details

          <ChevronRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      )}

    </div>
  );
}

// =====================================================
// STUDENT AVATAR
// =====================================================

function StudentAvatar({
  student,
  size = "desktop",
}) {
  const sizeClass =
    size === "mobile"
      ? "h-14 w-14"
      : "h-12 w-12";

  if (student?.avatar) {
    return (
      <div className="relative shrink-0">

        <div className="absolute -inset-1 rounded-2xl bg-orange-500/10 blur-md opacity-0 transition group-hover:opacity-100" />

        <img
          src={student.avatar}
          alt={
            student.name ||
            "Student"
          }
          loading="lazy"
          className={`relative ${sizeClass} rounded-2xl border border-white/10 object-cover shadow-lg transition-transform duration-300 group-hover:scale-105`}
        />

        <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#101010] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

      </div>
    );
  }

  return (
    <div
      className={`relative ${sizeClass} flex shrink-0 items-center justify-center rounded-2xl border border-orange-400/10 bg-gradient-to-br from-orange-500/15 via-white/[0.025] to-red-900/10 text-sm font-black text-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.06)] transition-all duration-300 group-hover:border-orange-400/20 group-hover:shadow-[0_0_25px_rgba(249,115,22,0.12)]`}
    >

      {student?.name
        ?.charAt(0)
        ?.toUpperCase() ||
        "S"}

      <div className="absolute inset-1.5 rounded-xl border border-orange-400/8" />

      <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#101010] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

    </div>
  );
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyStudents({
  search,
}) {
  return (
    <div className="relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden px-6 text-center">

      <div className="absolute h-80 w-80 rounded-full bg-orange-500/5 blur-[100px]" />

      <div className="relative z-10">

        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-orange-400/10 bg-orange-500/5 text-orange-400/60">
          <Users size={36} />

          <div className="absolute inset-2 rounded-[22px] border border-orange-400/8" />
        </div>

        <p className="mt-7 text-[10px] font-black uppercase tracking-[0.25em] text-orange-400/50">
          {search
            ? "No Match Found"
            : "Empty Registry"}
        </p>

        <h3 className="mt-2 text-xl font-bold text-white">
          {search
            ? "No students found"
            : "No students yet"}
        </h3>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/30">
          {search
            ? "Try searching with a different student name, email, or course."
            : "Students who enroll in your courses will appear here."}
        </p>

        {search && (
          <p className="mt-5 text-xs text-orange-300/40">
            Search query: "{search}"
          </p>
        )}

      </div>

    </div>
  );
}

// =====================================================
// LOADING
// =====================================================

function StudentsLoading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070707] text-white">

      <div className="absolute h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[130px]" />

      <div className="relative z-10 flex flex-col items-center">

        <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-orange-400/15 bg-orange-500/5">

          <div className="absolute inset-0 animate-ping rounded-[28px] border border-orange-400/10" />

          <Swords
            size={35}
            className="text-orange-400"
          />

        </div>

        <p className="mt-6 text-sm font-semibold text-white/60">
          Opening the student registry...
        </p>

        <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-orange-400/40">
          Gathering learner records
        </p>

      </div>

    </div>
  );
}

// =====================================================
// FOOTER
// =====================================================

function PremiumFooter() {
  return (
    <div className="flex items-center justify-center gap-3 pb-4 pt-2">

      <div className="h-px w-16 bg-gradient-to-r from-transparent to-stone-800" />

      <Gem
        size={11}
        className="text-[#67200f]"
      />

      <span className="font-serif text-[9px] uppercase tracking-[0.4em] text-stone-800">
        Forge Your Legacy
      </span>

      <Gem
        size={11}
        className="text-[#67200f]"
      />

      <div className="h-px w-16 bg-gradient-to-l from-transparent to-stone-800" />

    </div>
  );
}

// =====================================================
// DATE FORMATTER
// =====================================================

function formatDate(date) {
  if (!date) {
    return "N/A";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString(
    undefined,
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );
}

export default InstructorStudents;