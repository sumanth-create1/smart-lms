import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Castle,
  ChevronRight,
  Crown,
  Eye,
  Flame,
  Gem,
  IndianRupee,
  Layers,
  LoaderCircle,
  MoreVertical,
  Pencil,
  Plus,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
  TrendingUp,
  UserPlus,
  Users,
  Video,
  WandSparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";


// ============================================================
// MAIN DASHBOARD
// ============================================================

function InstructorDashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCourseMenu, setOpenCourseMenu] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({
    x: -100,
    y: -100,
  });

  const [mouseInside, setMouseInside] = useState(false);


  // ==========================================================
  // FETCH DASHBOARD
  // ==========================================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/dashboard/instructor");

      if (response.data?.success) {
        setDashboard(response.data.data);
      } else {
        toast.error(
          response.data?.message ||
            "Failed to load instructor dashboard"
        );
      }
    } catch (error) {
      console.error(
        "Instructor dashboard error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load instructor dashboard"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDashboard();
  }, []);


  // ==========================================================
  // CURSOR
  // ==========================================================

  useEffect(() => {
    const moveCursor = (event) => {
      setCursorPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    const enter = () => setMouseInside(true);
    const leave = () => setMouseInside(false);

    window.addEventListener(
      "mousemove",
      moveCursor
    );

    window.addEventListener(
      "mouseenter",
      enter
    );

    window.addEventListener(
      "mouseleave",
      leave
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        moveCursor
      );

      window.removeEventListener(
        "mouseenter",
        enter
      );

      window.removeEventListener(
        "mouseleave",
        leave
      );
    };
  }, []);


  // ==========================================================
  // CLOSE COURSE MENU
  // ==========================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(
          "[data-course-menu]"
        )
      ) {
        setOpenCourseMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#030303] text-stone-200">

        <PremiumBackground />

        <div className="relative z-20 flex min-h-screen items-center justify-center px-6">

          <div className="text-center">

            <div className="relative mx-auto flex h-28 w-28 items-center justify-center">

              <div className="absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full border border-[#c9a227]/20 border-t-[#d4af37]/80" />

              <div className="absolute inset-3 animate-[spin_8s_linear_infinite_reverse] rounded-full border border-red-900/20 border-r-red-700/70" />

              <div className="absolute inset-7 rounded-full bg-[#c9a227]/5 shadow-[0_0_70px_rgba(201,162,39,0.18)]" />

              <Crown
                size={36}
                className="relative text-[#d4af37] drop-shadow-[0_0_18px_rgba(212,175,55,0.45)]"
              />

            </div>


            <p className="mt-8 font-serif text-xl uppercase tracking-[0.45em] text-[#d4af37]">
              The Realm Awaits
            </p>

            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-stone-700">
              Summoning your instructor council
            </p>

            <LoaderCircle
              size={18}
              className="mx-auto mt-6 animate-spin text-stone-700"
            />

          </div>

        </div>

      </div>
    );
  }


  // ==========================================================
  // DATA
  // ==========================================================

  const stats = dashboard?.stats || {};

  const courses =
    dashboard?.courses || [];

  const recentEnrollments =
    dashboard?.recentEnrollments || [];

  const firstName =
    user?.name?.split(" ")[0] ||
    "Instructor";

  const maxStudents = Math.max(
    ...courses.map(
      (course) =>
        course.studentCount || 0
    ),
    1
  );


  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#030303] text-stone-200 selection:bg-[#c9a227]/30 selection:text-[#f3dc7c]"
      onMouseEnter={() =>
        setMouseInside(true)
      }
      onMouseLeave={() =>
        setMouseInside(false)
      }
    >

      {/* ======================================================
          GLOBAL ATMOSPHERE
      ====================================================== */}

      <PremiumBackground />


      {/* ======================================================
          CURSOR
      ====================================================== */}

      <PremiumCursor
        x={cursorPosition.x}
        y={cursorPosition.y}
        visible={mouseInside}
      />


      {/* ======================================================
          PAGE CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-[1700px] space-y-8 p-4 sm:p-6 lg:p-8">


        {/* ====================================================
            HERO
        ==================================================== */}

        <PremiumHero
          firstName={firstName}
        />


        {/* ====================================================
            STATS
        ==================================================== */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <PremiumStatCard
            title="Courses"
            value={stats.totalCourses || 0}
            subtitle="Learning domains"
            icon={<BookOpen size={21} />}
            accent="gold"
            delay="0ms"
          />

          <PremiumStatCard
            title="Students"
            value={stats.totalStudents || 0}
            subtitle="Learners in your realm"
            icon={<Users size={21} />}
            accent="ice"
            delay="100ms"
          />

          <PremiumStatCard
            title="Enrollments"
            value={stats.totalEnrollments || 0}
            subtitle="Student journeys"
            icon={<UserPlus size={21} />}
            accent="red"
            delay="200ms"
          />

          <PremiumStatCard
            title="Course Value"
            value={`₹${stats.totalCourseValue || 0}`}
            subtitle="Combined course pricing"
            icon={<IndianRupee size={21} />}
            accent="green"
            delay="300ms"
          />

        </section>


        {/* ====================================================
            MAIN CONTENT
        ==================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">


          {/* ==================================================
              COURSES
          ================================================== */}

          <PremiumPanel
            className="xl:col-span-2"
          >

            <PanelHeader
              eyebrow="YOUR DOMAINS"
              title="The Learning Realm"
              description="Courses under your command"
              icon={<Castle size={18} />}
              action={
                <Link
                  to="/instructor/courses"
                  className="group flex items-center gap-2 rounded-full border border-stone-800 bg-white/[0.025] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 transition-all duration-300 hover:border-[#c9a227]/30 hover:bg-[#c9a227]/5 hover:text-[#d4af37]"
                >
                  View all

                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              }
            />


            {courses.length === 0 ? (

              <EmptyCourses />

            ) : (

              <div className="p-3 sm:p-4">

                {courses
                  .slice(0, 5)
                  .map((course, index) => (

                    <PremiumCourseCard
                      key={course._id}
                      course={course}
                      index={index}
                      menuOpen={
                        openCourseMenu ===
                        course._id
                      }
                      setOpenCourseMenu={
                        setOpenCourseMenu
                      }
                    />

                  ))}

              </div>

            )}

          </PremiumPanel>


          {/* ==================================================
              RECENT ENROLLMENTS
          ================================================== */}

          <PremiumPanel>

            <PanelHeader
              eyebrow="NEW ARRIVALS"
              title="Recent Enrollments"
              description="Students entering your realm"
              icon={<Shield size={18} />}
            />


            {recentEnrollments.length === 0 ? (

              <EmptyEnrollments />

            ) : (

              <div className="p-3 sm:p-4">

                {recentEnrollments.map(
                  (enrollment, index) => (

                    <PremiumEnrollment
                      key={enrollment._id}
                      enrollment={enrollment}
                      index={index}
                    />

                  )
                )}

              </div>

            )}

          </PremiumPanel>

        </div>


        {/* ====================================================
            ENROLLMENT OVERVIEW
        ==================================================== */}

        <PremiumPanel>

          <PanelHeader
            eyebrow="THE COUNCIL'S RECORD"
            title="Enrollment Overview"
            description="A visual map of your learning domains"
            icon={<TrendingUp size={18} />}
            action={
              <div className="hidden items-center gap-2 rounded-full border border-emerald-900/40 bg-emerald-950/10 px-4 py-2 sm:flex">

                <span className="relative flex h-2 w-2">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />

                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500">
                  Realm Active
                </span>

              </div>
            }
          />


          {courses.length === 0 ? (

            <EmptyOverview />

          ) : (

            <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-2">

              {courses
                .slice(0, 6)
                .map((course, index) => {

                  const students =
                    course.studentCount ||
                    0;

                  const percentage =
                    Math.round(
                      (students /
                        maxStudents) *
                        100
                    );


                  return (

                    <EnrollmentDomain
                      key={course._id}
                      course={course}
                      index={index}
                      students={students}
                      percentage={
                        percentage
                      }
                    />

                  );

                })}

            </div>

          )}

        </PremiumPanel>


        {/* ====================================================
            QUICK ACTIONS
        ==================================================== */}

        <section>

          <div className="mb-5 flex items-end justify-between px-1">

            <div>

              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.4em] text-[#8e7630]">
                THE ARMORY
              </p>

              <h2 className="font-serif text-2xl font-semibold text-stone-100 sm:text-3xl">
                Command Center
              </h2>

            </div>


            <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-700 md:flex">

              <Sparkles
                size={13}
              />

              Forge your legacy

            </div>

          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <PremiumQuickAction
              title="Create Course"
              description="Forge a new learning domain"
              icon={<Plus size={20} />}
              to="/instructor/create-course"
              number="01"
            />

            <PremiumQuickAction
              title="Manage Courses"
              description="Command your existing domains"
              icon={<BookOpen size={20} />}
              to="/instructor/courses"
              number="02"
            />

            <PremiumQuickAction
              title="Manage Students"
              description="Inspect your enrolled learners"
              icon={<Users size={20} />}
              to="/instructor/students"
              number="03"
            />

            {courses[0]?._id ? (

              <PremiumQuickAction
                title="Manage Modules"
                description="Build modules and AI quizzes"
                icon={<Layers size={20} />}
                to={`/instructor/courses/${courses[0]._id}/modules`}
                number="04"
                featured
              />

            ) : (

              <PremiumQuickAction
                title="Build Structure"
                description="Create a course first"
                icon={<Layers size={20} />}
                to="/instructor/create-course"
                number="04"
                featured
              />

            )}

          </div>

        </section>


        {/* ====================================================
            FOOTER
        ==================================================== */}

        <PremiumFooter />

      </div>

    </div>
  );
}


// ============================================================
// PREMIUM BACKGROUND
// ============================================================

function PremiumBackground() {
  const particles = Array.from(
    { length: 34 },
    (_, index) => index
  );

  return (
    <>
      {/* Main gradient atmosphere */}

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(201,162,39,0.11),transparent_32%),radial-gradient(circle_at_100%_45%,rgba(95,20,20,0.12),transparent_28%),radial-gradient(circle_at_0%_75%,rgba(20,40,55,0.08),transparent_25%)]" />


      {/* Moving gold aura */}

      <div className="pointer-events-none fixed -left-40 top-20 h-[500px] w-[500px] animate-[pulse_9s_ease-in-out_infinite] rounded-full bg-[#c9a227]/[0.025] blur-[100px]" />

      <div className="pointer-events-none fixed -right-40 top-[45%] h-[500px] w-[500px] animate-[pulse_12s_ease-in-out_infinite] rounded-full bg-red-950/10 blur-[110px]" />


      {/* Fine grid */}

      <div className="pointer-events-none fixed inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:55px_55px]" />


      {/* Noise */}

      <div className="pointer-events-none fixed inset-0 opacity-[0.025] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.45%22/%3E%3C/svg%3E')]" />


      {/* Floating embers */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {particles.map((particle) => (

          <span
            key={particle}
            className="absolute h-[2px] w-[2px] rounded-full bg-[#d4af37]/60 shadow-[0_0_8px_rgba(212,175,55,0.5)]"
            style={{
              left: `${(particle * 29) % 100}%`,
              top: `${(particle * 47) % 100}%`,
              animation:
                `emberFloat ${
                  6 + (particle % 7)
                }s ease-in-out ${
                  -(particle % 8)
                }s infinite`,
              opacity:
                0.2 +
                ((particle % 5) * 0.1),
            }}
          />

        ))}

      </div>


      {/* Bottom vignette */}

      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black via-black/20 to-transparent" />


      <style>
        {`
          @keyframes emberFloat {
            0% {
              transform: translate3d(0, 20px, 0) scale(0.7);
              opacity: 0;
            }

            20% {
              opacity: 0.7;
            }

            50% {
              transform: translate3d(18px, -80px, 0) scale(1);
            }

            80% {
              opacity: 0.25;
            }

            100% {
              transform: translate3d(-12px, -170px, 0) scale(0.4);
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  );
}


// ============================================================
// PREMIUM CURSOR
// ============================================================

function PremiumCursor({
  x,
  y,
  visible,
}) {
  if (!visible) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed z-[9999] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e3c65b] shadow-[0_0_15px_5px_rgba(212,175,55,0.35)] lg:block"
        style={{
          left: x,
          top: y,
        }}
      />

      <div
        className="pointer-events-none fixed z-[9998] hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d4af37]/25 lg:block"
        style={{
          left: x,
          top: y,
          transition:
            "left 120ms ease-out, top 120ms ease-out",
        }}
      />

      <div
        className="pointer-events-none fixed z-[9997] hidden h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a227]/[0.035] blur-2xl lg:block"
        style={{
          left: x,
          top: y,
          transition:
            "left 220ms ease-out, top 220ms ease-out",
        }}
      />
    </>
  );
}


// ============================================================
// HERO
// ============================================================

function PremiumHero({
  firstName,
}) {

  return (
    <section className="group relative overflow-hidden rounded-[30px] border border-[#c9a227]/20 bg-[#090908]/90 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">

      {/* Animated border */}

      <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[linear-gradient(120deg,transparent,rgba(212,175,55,0.12),transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />


      {/* Light beam */}

      <div className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 rotate-12 bg-gradient-to-r from-transparent via-[#d4af37]/[0.025] to-transparent transition-transform duration-[1800ms] group-hover:translate-x-[420%]" />


      {/* Hero grid */}

      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(212,175,55,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.6)_1px,transparent_1px)] [background-size:70px_70px]" />


      {/* Glows */}

      <div className="pointer-events-none absolute -right-20 -top-40 h-[450px] w-[450px] rounded-full bg-[#c9a227]/[0.055] blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-[350px] w-[350px] rounded-full bg-red-950/10 blur-[100px]" />


      <div className="relative grid min-h-[430px] items-center gap-12 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-14">


        {/* LEFT */}

        <div className="animate-[fadeUp_.8s_ease-out_both]">

          <div className="mb-6 flex flex-wrap items-center gap-3">

            <div className="relative flex items-center gap-2 overflow-hidden rounded-full border border-[#c9a227]/25 bg-[#c9a227]/[0.045] px-4 py-2">

              <div className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent transition-all duration-700 group-hover:left-full" />

              <Crown
                size={14}
                className="relative text-[#d4af37]"
              />

              <span className="relative text-[9px] font-bold uppercase tracking-[0.3em] text-[#c9a227]">
                Instructor Council
              </span>

            </div>


            <span className="text-[9px] uppercase tracking-[0.3em] text-stone-700">
              Est. Learning Realm
            </span>

          </div>


          <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-[1.08] text-stone-100 sm:text-5xl lg:text-6xl">

            Welcome back,

            <br />

            <span className="relative inline-block text-[#d4af37]">

              {firstName}

              <span className="absolute -bottom-2 left-0 h-px w-full bg-gradient-to-r from-[#d4af37] via-[#d4af37]/30 to-transparent" />

            </span>

          </h1>


          <p className="mt-7 max-w-2xl text-sm leading-8 text-stone-500 sm:text-base">

            The courses you forge become worlds
            for your students. Shape their journey,
            command your modules, and build a
            learning experience worthy of legend.

          </p>


          <div className="mt-8 flex flex-wrap gap-3">

            <MagneticButton
              to="/instructor/create-course"
              primary
            >
              <Plus size={17} />

              Forge New Course

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </MagneticButton>


            <MagneticButton
              to="/instructor/courses"
            >
              <ScrollText size={16} />

              Enter Course Hall

            </MagneticButton>

          </div>


          {/* mini metrics */}

          <div className="mt-10 flex flex-wrap gap-8">

            <MiniMetric
              label="Your Domains"
              value="COURSES"
              icon={<Castle size={13} />}
            />

            <MiniMetric
              label="Your Realm"
              value="ACTIVE"
              icon={<Flame size={13} />}
            />

            <MiniMetric
              label="Your Mission"
              value="TEACH"
              icon={<Swords size={13} />}
            />

          </div>

        </div>


        {/* RIGHT SIGIL */}

        <PremiumSigil />

      </div>


      {/* Bottom line */}

      <div className="relative h-px bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent" />

    </section>
  );
}


// ============================================================
// MAGNETIC BUTTON
// ============================================================

function MagneticButton({
  to,
  children,
  primary = false,
}) {

  const buttonRef = useRef(null);

  const handleMove = (event) => {

    const element =
      buttonRef.current;

    if (!element) return;

    const rect =
      element.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left -
      rect.width / 2;

    const y =
      event.clientY -
      rect.top -
      rect.height / 2;

    element.style.transform =
      `translate(${x * 0.06}px, ${y * 0.06}px)`;
  };


  const reset = () => {

    if (buttonRef.current) {
      buttonRef.current.style.transform =
        "translate(0,0)";
    }

  };


  return (
    <Link
      ref={buttonRef}
      to={to}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300 ${
        primary
          ? "border-[#d4af37]/50 bg-[#c9a227] text-[#0c0a05] shadow-[0_12px_40px_rgba(201,162,39,0.14)] hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(201,162,39,0.24)]"
          : "border-stone-800 bg-white/[0.025] text-stone-400 hover:-translate-y-1 hover:border-[#c9a227]/30 hover:bg-[#c9a227]/5 hover:text-[#d4af37]"
      }`}
    >

      <span className="absolute inset-y-0 -left-full w-1/3 skew-x-[-20deg] bg-white/20 transition-all duration-700 group-hover:left-[130%]" />

      <span className="relative">
        {children}
      </span>

    </Link>
  );
}


// ============================================================
// MINI METRIC
// ============================================================

function MiniMetric({
  label,
  value,
  icon,
}) {

  return (
    <div className="flex items-center gap-3">

      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-800 bg-white/[0.02] text-[#8e7630]">
        {icon}
      </div>

      <div>

        <p className="text-[8px] uppercase tracking-[0.2em] text-stone-700">
          {label}
        </p>

        <p className="mt-1 text-[10px] font-bold tracking-wider text-stone-500">
          {value}
        </p>

      </div>

    </div>
  );
}


// ============================================================
// PREMIUM SIGIL
// ============================================================

function PremiumSigil() {

  return (
    <div className="relative mx-auto hidden h-[330px] w-[330px] items-center justify-center lg:flex">


      <div className="absolute inset-4 animate-[spin_35s_linear_infinite] rounded-full border border-dashed border-[#c9a227]/15" />

      <div className="absolute inset-10 animate-[spin_25s_linear_infinite_reverse] rounded-full border border-[#c9a227]/10 border-t-[#c9a227]/50" />

      <div className="absolute inset-[60px] rounded-full border border-[#c9a227]/15 shadow-[0_0_100px_rgba(201,162,39,0.06)]" />


      <div className="absolute h-[190px] w-[190px] animate-[sigilPulse_5s_ease-in-out_infinite] rounded-full bg-[#c9a227]/[0.025] blur-2xl" />


      <div className="relative flex h-36 w-36 flex-col items-center justify-center rounded-full border border-[#d4af37]/35 bg-[#0b0a07]/95 shadow-[inset_0_0_40px_rgba(201,162,39,0.04),0_0_60px_rgba(201,162,39,0.08)]">

        <Castle
          size={45}
          strokeWidth={1}
          className="text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        />

        <span className="mt-3 text-[8px] font-bold uppercase tracking-[0.4em] text-[#8e7630]">
          THE REALM
        </span>

      </div>


      <div className="absolute left-5 top-16 animate-[float_5s_ease-in-out_infinite]">

        <Gem
          size={15}
          className="text-[#d4af37]"
        />

      </div>


      <div className="absolute bottom-12 right-8 animate-[float_6s_ease-in-out_1s_infinite]">

        <Sparkles
          size={15}
          className="text-stone-600"
        />

      </div>


      <div className="absolute right-2 top-1/3">

        <div className="h-1.5 w-1.5 rounded-full bg-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />

      </div>


      <div className="absolute bottom-1/3 left-1">

        <div className="h-1 w-1 rounded-full bg-[#d4af37]/70 shadow-[0_0_12px_rgba(212,175,55,0.6)]" />

      </div>


      <style>
        {`
          @keyframes sigilPulse {
            0%, 100% {
              transform: scale(0.94);
              opacity: .5;
            }
            50% {
              transform: scale(1.06);
              opacity: .9;
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
}


// ============================================================
// STAT CARD
// ============================================================

function PremiumStatCard({
  title,
  value,
  subtitle,
  icon,
  accent,
  delay,
}) {

  const accents = {

    gold: {
      icon:
        "text-[#d4af37] border-[#c9a227]/20 bg-[#c9a227]/[0.045]",
      glow:
        "bg-[#c9a227]/[0.045]",
      line:
        "via-[#d4af37]/50",
    },

    ice: {
      icon:
        "text-sky-400 border-sky-900/30 bg-sky-950/20",
      glow:
        "bg-sky-950/10",
      line:
        "via-sky-500/40",
    },

    red: {
      icon:
        "text-red-400 border-red-900/30 bg-red-950/20",
      glow:
        "bg-red-950/10",
      line:
        "via-red-500/40",
    },

    green: {
      icon:
        "text-emerald-400 border-emerald-900/30 bg-emerald-950/20",
      glow:
        "bg-emerald-950/10",
      line:
        "via-emerald-500/40",
    },

  };


  const theme =
    accents[accent] ||
    accents.gold;


  return (
    <div
      className="group relative animate-[fadeUp_.7s_ease-out_both] overflow-hidden rounded-[22px] border border-stone-800/80 bg-[#0a0a09]/90 p-5 shadow-[0_15px_60px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-2 hover:border-[#c9a227]/20 hover:shadow-[0_25px_80px_rgba(0,0,0,0.5)]"
      style={{
        animationDelay: delay,
      }}
    >

      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150 ${theme.glow}`}
      />


      <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent transition-all duration-700 group-hover:w-full" />


      <div className="relative flex items-start justify-between">

        <div>

          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-700">
            {title}
          </p>

          <p className="mt-3 font-serif text-3xl font-semibold tracking-tight text-stone-100 transition-colors duration-300 group-hover:text-[#f1df91]">
            {value}
          </p>

          <p className="mt-2 text-[10px] uppercase tracking-wider text-stone-700">
            {subtitle}
          </p>

        </div>


        <div
          className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${theme.icon}`}
        >
          {icon}

          <span className="absolute inset-0 rounded-xl opacity-0 ring-1 ring-[#d4af37]/20 transition-opacity duration-300 group-hover:opacity-100" />

        </div>

      </div>

    </div>
  );
}


// ============================================================
// PREMIUM PANEL
// ============================================================

function PremiumPanel({
  children,
  className = "",
}) {

  return (
    <section
      className={`group relative overflow-hidden rounded-[25px] border border-stone-800/80 bg-[#080808]/90 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl ${className}`}
    >

      {/* top glow */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent transition-all duration-700 group-hover:w-3/4" />

      {children}

    </section>
  );
}


// ============================================================
// PANEL HEADER
// ============================================================

function PanelHeader({
  eyebrow,
  title,
  description,
  icon,
  action,
}) {

  return (
    <div className="relative flex flex-col gap-4 border-b border-stone-800/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

      <div className="flex items-center gap-3">

        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#c9a227]/15 bg-[#c9a227]/[0.035] text-[#c9a227] transition-all duration-500 group-hover:border-[#c9a227]/30 group-hover:shadow-[0_0_25px_rgba(201,162,39,0.08)]">

          {icon}

        </div>


        <div>

          <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#806b30]">
            {eyebrow}
          </p>

          <h2 className="mt-1 font-serif text-lg font-semibold text-stone-100">
            {title}
          </h2>

          <p className="mt-0.5 text-[10px] text-stone-700">
            {description}
          </p>

        </div>

      </div>


      {action}

    </div>
  );
}


// ============================================================
// PREMIUM COURSE CARD
// ============================================================

function PremiumCourseCard({
  course,
  index,
  menuOpen,
  setOpenCourseMenu,
}) {

  const [tilt, setTilt] = useState({
    x: 0,
    y: 0,
  });


  const handleMove = (event) => {

    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left;

    const y =
      event.clientY -
      rect.top;

    const rotateY =
      ((x / rect.width) - 0.5) * 5;

    const rotateX =
      ((y / rect.height) - 0.5) * -5;

    setTilt({
      x: rotateX,
      y: rotateY,
    });
  };


  const resetTilt = () => {
    setTilt({
      x: 0,
      y: 0,
    });
  };


  return (
    <div
      className="group relative mb-3 overflow-visible rounded-2xl border border-stone-800/80 bg-[#0d0d0c] transition-all duration-500 hover:border-[#c9a227]/25 hover:bg-[#11110f] hover:shadow-[0_20px_70px_rgba(0,0,0,0.45)]"
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition:
          "transform 180ms ease-out, border-color 300ms ease, box-shadow 300ms ease",
      }}
    >

      {/* cinematic sweep */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">

        <div className="absolute -left-1/2 top-0 h-full w-1/3 -skew-x-[20deg] bg-gradient-to-r from-transparent via-[#d4af37]/[0.035] to-transparent transition-transform duration-[1200ms] group-hover:translate-x-[430%]" />

      </div>


      <div className="relative flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-4">

        {/* thumbnail */}

        <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl border border-stone-800 bg-black sm:h-20 sm:w-32">

          <img
            src={
              course.courseThumbnail?.url ||
              "/placeholder-course.jpg"
            }
            alt={course.courseTitle}
            className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-110 group-hover:opacity-100"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

          <div className="absolute bottom-2 left-2 flex items-center gap-1.5">

            <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />

            <span className="text-[8px] font-bold uppercase tracking-wider text-stone-300">
              Domain {String(index + 1).padStart(2, "0")}
            </span>

          </div>

        </div>


        {/* information */}

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <h3 className="truncate font-serif text-base font-semibold text-stone-200 transition-colors duration-300 group-hover:text-[#d4af37]">
                {course.courseTitle}
              </h3>


              <div className="mt-2 flex flex-wrap gap-2">

                {course.category && (

                  <span className="rounded-full border border-stone-800 bg-black/30 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-stone-600">
                    {course.category}
                  </span>

                )}

                <span className="rounded-full border border-[#c9a227]/10 bg-[#c9a227]/[0.035] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#90772d]">
                  {course.courseLevel ||
                    "Course"}
                </span>

              </div>

            </div>


            {/* menu */}

            <div
              className="relative shrink-0"
              data-course-menu
            >

              <button
                type="button"
                onClick={() =>
                  setOpenCourseMenu(
                    menuOpen
                      ? null
                      : course._id
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-700 transition-all hover:bg-stone-900 hover:text-[#d4af37]"
              >

                <MoreVertical
                  size={17}
                />

              </button>


              {menuOpen && (

                <div className="absolute right-0 top-10 z-[100] w-56 overflow-hidden rounded-xl border border-stone-700 bg-[#0c0c0b] py-1.5 shadow-[0_25px_80px_rgba(0,0,0,0.8)]">

                  <MenuItem
                    to={`/courses/${course._id}`}
                    icon={<Eye size={15} />}
                    label="View Course"
                    onClick={() =>
                      setOpenCourseMenu(
                        null
                      )
                    }
                  />

                  <MenuItem
                    to={`/instructor/courses/edit/${course._id}`}
                    icon={<Pencil size={15} />}
                    label="Edit Course"
                    onClick={() =>
                      setOpenCourseMenu(
                        null
                      )
                    }
                  />

                  <MenuItem
                    to={`/instructor/courses/${course._id}/lectures`}
                    icon={<Video size={15} />}
                    label="Manage Lectures"
                    onClick={() =>
                      setOpenCourseMenu(
                        null
                      )
                    }
                  />

                  <MenuItem
                    to={`/instructor/courses/${course._id}/modules`}
                    icon={<Layers size={15} />}
                    label="Manage Modules + AI Quiz"
                    featured
                    onClick={() =>
                      setOpenCourseMenu(
                        null
                      )
                    }
                  />

                </div>

              )}

            </div>

          </div>


          {/* stats */}

          <div className="mt-4 flex flex-wrap items-center gap-5">

            <CourseMiniStat
              icon={<Users size={13} />}
              label="Students"
              value={
                course.studentCount ||
                0
              }
            />

            <CourseMiniStat
              icon={<IndianRupee size={13} />}
              label="Price"
              value={
                course.coursePrice ||
                0
              }
              currency
            />

            <div className="hidden h-5 w-px bg-stone-800 sm:block" />

            <div className="hidden items-center gap-1.5 text-[9px] uppercase tracking-wider text-stone-700 sm:flex">

              <Sparkles size={11} />

              Active Domain

            </div>

          </div>

        </div>


        {/* arrow */}

        <ChevronRight
          size={18}
          className="hidden shrink-0 text-stone-800 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#c9a227] sm:block"
        />

      </div>

    </div>
  );
}


// ============================================================
// COURSE MINI STAT
// ============================================================

function CourseMiniStat({
  icon,
  label,
  value,
  currency = false,
}) {

  return (
    <div className="flex items-center gap-2">

      <span className="text-[#6d5c2d]">
        {icon}
      </span>

      <div>

        <p className="text-[7px] uppercase tracking-wider text-stone-700">
          {label}
        </p>

        <p className="mt-0.5 text-[11px] font-semibold text-stone-400">

          {currency
            ? `₹${value}`
            : value}

        </p>

      </div>

    </div>
  );
}


// ============================================================
// MENU ITEM
// ============================================================

function MenuItem({
  to,
  icon,
  label,
  onClick,
  featured = false,
}) {

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group/item flex items-center gap-3 px-4 py-2.5 text-xs transition-all ${
        featured
          ? "text-[#d4af37] hover:bg-[#c9a227]/[0.05]"
          : "text-stone-500 hover:bg-white/[0.03] hover:text-stone-100"
      }`}
    >

      <span className="transition-transform duration-300 group-hover/item:scale-110">
        {icon}
      </span>

      <span>
        {label}
      </span>

    </Link>
  );
}


// ============================================================
// ENROLLMENT
// ============================================================

function PremiumEnrollment({
  enrollment,
  index,
}) {

  const name =
    enrollment.student?.name ||
    "Student";

  const initial =
    name.charAt(0).toUpperCase();


  return (
    <div
      className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition-all duration-300 hover:border-stone-800 hover:bg-white/[0.02]"
      style={{
        animation:
          "fadeUp .6s ease-out both",
        animationDelay:
          `${index * 80}ms`,
      }}
    >

      {enrollment.student?.avatar ? (

        <img
          src={
            enrollment.student.avatar
          }
          alt={name}
          className="h-10 w-10 shrink-0 rounded-full border border-stone-800 object-cover transition-all duration-300 group-hover:border-[#c9a227]/30 group-hover:shadow-[0_0_20px_rgba(201,162,39,0.1)]"
        />

      ) : (

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c9a227]/15 bg-[#c9a227]/[0.04] font-serif font-semibold text-[#a68a36] transition-all duration-300 group-hover:border-[#c9a227]/30 group-hover:bg-[#c9a227]/[0.08]">
          {initial || "S"}
        </div>

      )}


      <div className="min-w-0 flex-1">

        <p className="truncate text-xs font-semibold text-stone-400 transition-colors group-hover:text-stone-200">
          {name}
        </p>

        <p className="mt-1 truncate text-[9px] text-stone-700">
          {enrollment.course?.courseTitle ||
            "Course"}
        </p>

      </div>


      <div className="text-right">

        <p className="text-[8px] uppercase tracking-wider text-stone-800">
          Joined
        </p>

        <p className="mt-1 text-[9px] text-stone-600">

          {enrollment.enrolledAt
            ? new Date(
                enrollment.enrolledAt
              ).toLocaleDateString()
            : ""}

        </p>

      </div>

    </div>
  );
}


// ============================================================
// ENROLLMENT DOMAIN
// ============================================================

function EnrollmentDomain({
  course,
  index,
  students,
  percentage,
}) {

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-stone-800 bg-[#0b0b0a] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#c9a227]/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#c9a227]/[0.025] blur-3xl transition-transform duration-700 group-hover:scale-150" />


      <div className="relative flex items-center justify-between gap-5">

        <div className="min-w-0">

          <div className="mb-2 flex items-center gap-2">

            <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-stone-700">
              Domain{" "}
              {String(index + 1).padStart(
                2,
                "0"
              )}
            </span>

            <span className="h-1 w-1 rounded-full bg-[#806b30]" />

            <span className="text-[8px] uppercase tracking-wider text-[#806b30]">
              Active
            </span>

          </div>


          <p className="truncate font-serif text-sm font-semibold text-stone-300 transition-colors group-hover:text-[#d4af37]">
            {course.courseTitle}
          </p>

        </div>


        <div className="shrink-0 text-right">

          <p className="font-serif text-xl font-semibold text-[#d4af37]">
            {students}
          </p>

          <p className="text-[7px] uppercase tracking-wider text-stone-700">
            Students
          </p>

        </div>

      </div>


      {/* progress */}

      <div className="mt-5">

        <div className="relative h-1.5 overflow-hidden rounded-full bg-stone-900">

          <div
            className="h-full rounded-full bg-gradient-to-r from-[#59470e] via-[#c9a227] to-[#f0d86b] shadow-[0_0_12px_rgba(201,162,39,0.2)] transition-all duration-1000 ease-out"
            style={{
              width: `${percentage}%`,
            }}
          />

          <div className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-white/20 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />

        </div>


        <div className="mt-3 flex justify-between text-[8px] uppercase tracking-wider text-stone-700">

          <span>
            Realm Population
          </span>

          <span>
            {percentage}% peak
          </span>

        </div>

      </div>

    </div>
  );
}


// ============================================================
// QUICK ACTION
// ============================================================

function PremiumQuickAction({
  title,
  description,
  icon,
  to,
  number,
  featured = false,
}) {

  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-[21px] border p-5 transition-all duration-500 hover:-translate-y-2 ${
        featured
          ? "border-[#c9a227]/25 bg-[#111009]"
          : "border-stone-800/80 bg-[#090909]"
      } hover:shadow-[0_25px_70px_rgba(0,0,0,0.45)]`}
    >

      {/* sweep */}

      <div className="absolute -left-1/2 top-0 h-full w-1/3 -skew-x-[20deg] bg-gradient-to-r from-transparent via-[#d4af37]/[0.05] to-transparent transition-transform duration-[1100ms] group-hover:translate-x-[450%]" />


      {/* glow */}

      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#c9a227]/[0.035] blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-[#c9a227]/[0.07]" />


      <div className="relative">

        <div className="mb-7 flex items-start justify-between">

          <div className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
            featured
              ? "border-[#c9a227]/25 bg-[#c9a227]/[0.06] text-[#d4af37]"
              : "border-stone-800 bg-white/[0.02] text-stone-500 group-hover:border-[#c9a227]/20 group-hover:text-[#d4af37]"
          }`}>
            {icon}
          </div>


          <span className="font-serif text-3xl font-semibold text-stone-900 transition-colors duration-500 group-hover:text-[#c9a227]/10">
            {number}
          </span>

        </div>


        <h3 className="font-serif text-base font-semibold text-stone-200 transition-colors duration-300 group-hover:text-[#d4af37]">
          {title}
        </h3>


        <p className="mt-2 max-w-[220px] text-[10px] leading-5 text-stone-700">
          {description}
        </p>


        <div className="mt-6 flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.2em] text-stone-700 transition-all duration-300 group-hover:gap-3 group-hover:text-[#a68a36]">

          Enter

          <ArrowRight
            size={13}
          />

        </div>

      </div>

    </Link>
  );
}


// ============================================================
// EMPTY STATES
// ============================================================

function EmptyCourses() {

  return (
    <div className="flex min-h-[330px] flex-col items-center justify-center px-6 text-center">

      <div className="relative">

        <div className="absolute inset-0 animate-pulse rounded-full bg-[#c9a227]/10 blur-2xl" />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a227]/20 bg-[#111009] text-[#c9a227]">
          <Castle size={27} />
        </div>

      </div>


      <h3 className="mt-5 font-serif text-lg font-semibold text-stone-200">
        Your Realm Is Empty
      </h3>


      <p className="mt-2 max-w-sm text-xs leading-6 text-stone-700">
        Forge your first course and begin
        building a learning kingdom.
      </p>


      <Link
        to="/instructor/create-course"
        className="group mt-5 inline-flex items-center gap-2 rounded-xl border border-[#c9a227]/25 bg-[#c9a227]/[0.05] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#d4af37] transition-all hover:-translate-y-1 hover:bg-[#c9a227]/10"
      >

        <Plus size={16} />

        Forge Course

        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-1"
        />

      </Link>

    </div>
  );
}


function EmptyEnrollments() {

  return (
    <div className="flex min-h-[330px] flex-col items-center justify-center px-6 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-stone-800 bg-stone-900/40 text-stone-700">
        <Shield size={24} />
      </div>

      <p className="mt-4 font-serif font-semibold text-stone-500">
        The Gates Are Quiet
      </p>

      <p className="mt-2 max-w-xs text-xs leading-6 text-stone-700">
        New students entering your courses
        will appear here.
      </p>

    </div>
  );
}


function EmptyOverview() {

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center text-center">

      <TrendingUp
        size={26}
        className="text-stone-800"
      />

      <p className="mt-3 font-serif font-semibold text-stone-500">
        No Records Yet
      </p>

      <p className="mt-1 text-xs text-stone-700">
        Enrollment statistics will appear
        once students join your courses.
      </p>

    </div>
  );
}


// ============================================================
// FOOTER
// ============================================================

function PremiumFooter() {

  return (
    <div className="flex items-center justify-center gap-3 pb-4 pt-4">

      <div className="h-px w-16 bg-gradient-to-r from-transparent to-stone-800" />

      <Gem
        size={11}
        className="text-[#806b30]"
      />

      <span className="font-serif text-[9px] uppercase tracking-[0.4em] text-stone-800">
        Build Your Legacy
      </span>

      <Gem
        size={11}
        className="text-[#806b30]"
      />

      <div className="h-px w-16 bg-gradient-to-l from-transparent to-stone-800" />

    </div>
  );
}


export default InstructorDashboard;