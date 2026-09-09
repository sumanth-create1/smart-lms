import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  Castle,
  ChevronRight,
  Crown,
  Feather,
  Filter,
  LoaderCircle,
  Search,
  Shield,
  Sparkles,
  Sword,
  UserRound,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

// =====================================================
// STUDENT COURSES / PUBLIC COURSES
// =====================================================

const StudentCourses = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [selectedLevel, setSelectedLevel] =
    useState("All");

  // =====================================================
  // FETCH COURSES
  // =====================================================

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/course");

      if (response.data.success) {
        setCourses(response.data.courses || []);
        return;
      }

      toast.error(
        response.data.message ||
          "Failed to load courses"
      );
    } catch (error) {
      console.error(
        "Fetch courses error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load courses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // BACK NAVIGATION
  // =====================================================

  const handleBack = () => {
    if (user?.role === "student") {
      navigate("/dashboard");
      return;
    }

    if (user?.role === "instructor") {
      navigate("/instructor/dashboard");
      return;
    }

    navigate("/");
  };

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        courses
          .map((course) => course.category)
          .filter(
            (category) =>
              category &&
              category.trim()
          )
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [courses]);

  // =====================================================
  // FILTER COURSES
  // =====================================================

  const filteredCourses = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    return courses.filter((course) => {
      const matchesSearch =
        !search ||
        course.courseTitle
          ?.toLowerCase()
          .includes(search) ||
        course.subTitle
          ?.toLowerCase()
          .includes(search) ||
        course.description
          ?.toLowerCase()
          .includes(search) ||
        course.instructor?.name
          ?.toLowerCase()
          .includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        course.category === selectedCategory;

      const matchesLevel =
        selectedLevel === "All" ||
        course.courseLevel === selectedLevel;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel
      );
    });
  }, [
    courses,
    searchTerm,
    selectedCategory,
    selectedLevel,
  ]);

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedLevel("All");
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedCategory !== "All" ||
    selectedLevel !== "All";

  // =====================================================
  // COURSE NAVIGATION
  // =====================================================

  const handleViewCourse = (courseId) => {
    if (!courseId) {
      toast.error("Invalid course");
      return;
    }

    navigate(`/courses/${courseId}`);
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#06080a]">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Moon */}
          <div
            className="
              absolute
              right-[12%]
              top-[8%]
              h-36
              w-36
              rounded-full
              bg-slate-100/[0.08]
              shadow-[0_0_90px_rgba(170,210,240,0.12)]
              animate-[moonPulse_7s_ease-in-out_infinite]
            "
          />

          {/* Mountains */}
          <div
            className="
              absolute
              bottom-0
              left-0
              h-[45%]
              w-full
              bg-[#0b1015]
              [clip-path:polygon(0_75%,12%_45%,23%_68%,36%_30%,49%_66%,63%_38%,76%_70%,89%_42%,100%_68%,100%_100%,0_100%)]
            "
          />

          {/* Castle */}
          <div className="absolute bottom-[9%] left-1/2 -translate-x-1/2 opacity-20">
            <Castle size={150} strokeWidth={0.8} />
          </div>

          {/* Fog */}
          <div
            className="
              absolute
              bottom-[18%]
              left-[-10%]
              h-28
              w-[120%]
              rounded-full
              bg-slate-200/[0.025]
              blur-3xl
              animate-[fogDrift_14s_ease-in-out_infinite]
            "
          />

          {/* Snow */}
          {Array.from({ length: 30 }).map(
            (_, index) => (
              <span
                key={index}
                className="
                  absolute
                  h-1
                  w-1
                  rounded-full
                  bg-white/25
                  animate-[snowFall_linear_infinite]
                "
                style={{
                  left: `${(index * 31) % 100}%`,
                  top: `${(index * 17) % 80}%`,
                  animationDuration: `${7 + (index % 7)}s`,
                  animationDelay: `${-(index % 8)}s`,
                }}
              />
            )
          )}
        </div>

        {/* Loading Card */}
        <div
          className="
            relative
            z-10
            w-[90%]
            max-w-md
            overflow-hidden
            rounded-3xl
            border
            border-[#c7a55a]/25
            bg-[#090c0f]/95
            p-8
            text-center
            shadow-[0_30px_100px_rgba(0,0,0,0.7)]
            backdrop-blur-xl
          "
        >
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7a55a] to-transparent" />

          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full border border-[#c7a55a]/20 border-t-[#c7a55a]/70" />

            <div className="absolute inset-3 animate-[spin_5s_linear_infinite_reverse] rounded-full border border-sky-300/10 border-r-sky-300/60" />

            <Crown
              size={30}
              className="animate-[crownFloat_2.5s_ease-in-out_infinite] text-[#d4b56a]"
            />
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c7a55a]/70">
            THE GREAT LIBRARY
          </p>

          <h2 className="mt-3 text-xl font-black uppercase tracking-[0.1em] text-slate-100">
            Gathering the courses
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            The maesters are preparing the realm's
            knowledge...
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-200/70">
            <LoaderCircle
              size={14}
              className="animate-spin"
            />

            Searching the archives
          </div>

          <div className="mt-7 h-px bg-gradient-to-r from-transparent via-[#c7a55a]/40 to-transparent" />
        </div>

        <style>{`
          @keyframes moonPulse {
            0%, 100% {
              transform: scale(1);
              opacity: .7;
            }

            50% {
              transform: scale(1.05);
              opacity: 1;
            }
          }

          @keyframes fogDrift {
            0%, 100% {
              transform: translateX(-3%);
            }

            50% {
              transform: translateX(3%);
            }
          }

          @keyframes snowFall {
            0% {
              transform: translateY(-30px);
              opacity: 0;
            }

            15% {
              opacity: .7;
            }

            100% {
              transform: translateY(100vh) translateX(30px);
              opacity: 0;
            }
          }

          @keyframes crownFloat {
            0%, 100% {
              transform: translateY(0) rotate(-2deg);
            }

            50% {
              transform: translateY(-5px) rotate(2deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#06080a]
        text-slate-100
      "
    >
      {/* =================================================
          GLOBAL BACKGROUND
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Base */}
        <div className="absolute inset-0 bg-[#06080a]" />

        {/* =============================================
            MOON
        ============================================== */}

        <div
          className="
            absolute
            right-[7%]
            top-[5%]
            h-44
            w-44
            rounded-full
            bg-gradient-to-br
            from-slate-100/[0.12]
            via-slate-300/[0.05]
            to-transparent
            shadow-[0_0_120px_rgba(170,205,235,0.10)]
            animate-[moonPulse_8s_ease-in-out_infinite]
          "
        >
          <div className="absolute left-8 top-10 h-5 w-5 rounded-full bg-slate-700/10" />

          <div className="absolute right-9 top-20 h-7 w-7 rounded-full bg-slate-700/10" />

          <div className="absolute bottom-9 left-14 h-4 w-4 rounded-full bg-slate-700/10" />
        </div>

        {/* =============================================
            ICE LIGHT
        ============================================== */}

        <div
          className="
            absolute
            left-[-10%]
            top-[15%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-sky-500/[0.035]
            blur-[140px]
          "
        />

        {/* =============================================
            GOLD LIGHT
        ============================================== */}

        <div
          className="
            absolute
            right-[5%]
            top-[35%]
            h-[450px]
            w-[450px]
            rounded-full
            bg-amber-500/[0.025]
            blur-[130px]
          "
        />

        {/* =============================================
            MOUNTAINS
        ============================================== */}

        <div
          className="
            absolute
            bottom-0
            left-0
            h-[42%]
            w-full
            bg-[#090e13]
            opacity-95
            [clip-path:polygon(0_75%,8%_55%,17%_68%,28%_38%,38%_68%,49%_45%,60%_72%,70%_42%,82%_67%,91%_47%,100%_66%,100%_100%,0_100%)]
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-0
            h-[28%]
            w-full
            bg-[#10161b]
            opacity-80
            [clip-path:polygon(0_78%,13%_55%,25%_73%,39%_48%,53%_72%,66%_50%,79%_74%,91%_52%,100%_70%,100%_100%,0_100%)]
          "
        />

        {/* =============================================
            CASTLE
        ============================================== */}

        <div
          className="
            absolute
            bottom-[5%]
            left-1/2
            -translate-x-1/2
            opacity-[0.10]
            animate-[castleFloat_10s_ease-in-out_infinite]
          "
        >
          <Castle
            size={250}
            strokeWidth={0.6}
          />
        </div>

        {/* =============================================
            FOG
        ============================================== */}

        <div
          className="
            absolute
            bottom-[13%]
            left-[-15%]
            h-32
            w-[130%]
            rounded-full
            bg-slate-200/[0.025]
            blur-3xl
            animate-[fogDrift_18s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute
            bottom-[28%]
            left-[-10%]
            h-24
            w-[120%]
            rounded-full
            bg-sky-200/[0.015]
            blur-3xl
            animate-[fogDrift_14s_ease-in-out_infinite_reverse]
          "
        />

        {/* =============================================
            SNOW
        ============================================== */}

        {Array.from({ length: 45 }).map(
          (_, index) => (
            <span
              key={`snow-${index}`}
              className="
                absolute
                h-[2px]
                w-[2px]
                rounded-full
                bg-white/25
                animate-[snowFall_linear_infinite]
              "
              style={{
                left: `${(index * 29) % 100}%`,
                top: `${(index * 13) % 90}%`,
                animationDuration: `${8 + (index % 9)}s`,
                animationDelay: `${-(index % 10)}s`,
              }}
            />
          )
        )}

        {/* =============================================
            EMBERS
        ============================================== */}

        {Array.from({ length: 18 }).map(
          (_, index) => (
            <span
              key={`ember-${index}`}
              className="
                absolute
                h-[3px]
                w-[3px]
                rounded-full
                bg-amber-300/20
                blur-[1px]
                animate-[emberFloat_linear_infinite]
              "
              style={{
                left: `${(index * 41) % 100}%`,
                bottom: `${5 + ((index * 11) % 45)}%`,
                animationDuration: `${5 + (index % 6)}s`,
                animationDelay: `${-(index % 7)}s`,
              }}
            />
          )
        )}

        {/* =============================================
            STONE GRID
        ============================================== */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px)]
            [background-size:80px_80px]
          "
        />

        {/* =============================================
            VIGNETTE
        ============================================== */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.2)_65%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">

          {/* =================================================
              TOP DECORATIVE LINE
          ================================================= */}

          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c7a55a]/25" />

            <div className="flex items-center gap-2 text-[#c7a55a]/50">
              <Sword size={13} />

              <Crown size={16} />

              <Shield size={13} />
            </div>

            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c7a55a]/25" />
          </div>

          {/* =================================================
              BACK BUTTON
          ================================================= */}

          <div className="mb-8">
            <button
              type="button"
              onClick={handleBack}
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-[#c7a55a]/20
                bg-[#0a0d10]/80
                px-4
                py-2.5
                text-sm
                font-bold
                uppercase
                tracking-[0.08em]
                text-slate-400
                shadow-[0_10px_35px_rgba(0,0,0,0.25)]
                backdrop-blur-xl
                transition
                duration-300
                hover:-translate-y-0.5
                hover:border-[#c7a55a]/50
                hover:bg-[#c7a55a]/[0.06]
                hover:text-[#d8bc78]
              "
            >
              <ArrowLeft
                size={17}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              {user?.role === "student"
                ? "Back to Dashboard"
                : user?.role === "instructor"
                ? "Back to Dashboard"
                : "Back to Home"}
            </button>
          </div>

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="mb-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

              {/* HEADER */}

              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="
                      relative
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-[#c7a55a]/30
                      bg-[#c7a55a]/[0.07]
                      shadow-[0_0_30px_rgba(199,165,90,0.06)]
                    "
                  >
                    <BookOpen
                      size={20}
                      className="text-[#d2b46b]"
                    />

                    <span className="absolute -right-1 -top-1">
                      <Sparkles
                        size={11}
                        className="animate-pulse text-sky-300"
                      />
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#c7a55a]/65">
                      THE GREAT LIBRARY
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Knowledge preserved for the realm
                    </p>
                  </div>
                </div>

                <h1
                  className="
                    text-3xl
                    font-black
                    uppercase
                    tracking-[0.06em]
                    text-slate-100
                    sm:text-4xl
                  "
                >
                  Explore the Realm
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  Discover courses, sharpen your skills,
                  and prepare yourself for whatever lies
                  beyond the wall.
                </p>
              </div>

              {/* COURSE COUNT */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#c7a55a]/20
                  bg-[#0a0d10]/80
                  px-5
                  py-4
                  shadow-[0_15px_50px_rgba(0,0,0,0.3)]
                  backdrop-blur-xl
                "
              >
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7a55a]/60 to-transparent" />

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/[0.07]">
                    <Castle
                      size={19}
                      className="text-sky-300"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">
                      Courses in the realm
                    </p>

                    <p className="mt-0.5 text-xl font-black text-[#d7bb72]">
                      {courses.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              SEARCH + FILTERS
          ================================================= */}

          <div
            className="
              relative
              mb-8
              overflow-hidden
              rounded-2xl
              border
              border-[#c7a55a]/15
              bg-[#090c0f]/90
              p-4
              shadow-[0_20px_70px_rgba(0,0,0,0.35)]
              backdrop-blur-xl
              sm:p-5
            "
          >
            {/* Top line */}

            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7a55a]/40 to-transparent" />

            {/* Corner decoration */}

            <div className="absolute right-3 top-3 opacity-20">
              <Feather
                size={20}
                className="text-sky-300"
              />
            </div>

            <div className="flex flex-col gap-4 lg:flex-row">

              {/* SEARCH */}

              <div className="relative flex-1">
                <Search
                  size={19}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  placeholder="Search the archives..."
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-700/60
                    bg-[#06090c]/80
                    pl-11
                    pr-10
                    text-sm
                    text-slate-200
                    outline-none
                    transition
                    duration-300
                    placeholder:text-slate-600
                    focus:border-[#c7a55a]/50
                    focus:bg-[#080c10]
                    focus:ring-2
                    focus:ring-[#c7a55a]/10
                  "
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchTerm("")
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      rounded-lg
                      p-1.5
                      text-slate-500
                      transition
                      hover:bg-slate-800
                      hover:text-slate-200
                    "
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              {/* CATEGORY */}

              <div className="flex items-center gap-2">
                <Filter
                  size={18}
                  className="hidden text-[#c7a55a]/50 sm:block"
                />

                <select
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(
                      event.target.value
                    )
                  }
                  className="
                    h-12
                    min-w-[180px]
                    rounded-xl
                    border
                    border-slate-700/60
                    bg-[#06090c]
                    px-4
                    text-sm
                    text-slate-300
                    outline-none
                    transition
                    focus:border-[#c7a55a]/50
                    focus:ring-2
                    focus:ring-[#c7a55a]/10
                  "
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-[#090c0f]"
                      >
                        {category === "All"
                          ? "All Categories"
                          : category}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* LEVEL */}

              <select
                value={selectedLevel}
                onChange={(event) =>
                  setSelectedLevel(
                    event.target.value
                  )
                }
                className="
                  h-12
                  min-w-[170px]
                  rounded-xl
                  border
                  border-slate-700/60
                  bg-[#06090c]
                  px-4
                  text-sm
                  text-slate-300
                  outline-none
                  transition
                  focus:border-[#c7a55a]/50
                  focus:ring-2
                  focus:ring-[#c7a55a]/10
                "
              >
                <option
                  value="All"
                  className="bg-[#090c0f]"
                >
                  All Levels
                </option>

                <option
                  value="Beginner"
                  className="bg-[#090c0f]"
                >
                  Beginner
                </option>

                <option
                  value="Intermediate"
                  className="bg-[#090c0f]"
                >
                  Intermediate
                </option>

                <option
                  value="Advanced"
                  className="bg-[#090c0f]"
                >
                  Advanced
                </option>
              </select>
            </div>

            {/* ACTIVE FILTERS */}

            {hasActiveFilters && (
              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-3
                  border-t
                  border-slate-800
                  pt-4
                "
              >
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-bold text-[#d7bb72]">
                    {filteredCourses.length}
                  </span>{" "}
                  course
                  {filteredCourses.length !== 1
                    ? "s"
                    : ""}
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    text-sm
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-slate-500
                    transition
                    hover:text-[#d7bb72]
                  "
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* =================================================
              COURSE GRID
          ================================================= */}

          {filteredCourses.length > 0 ? (
            <div
              className="
                grid
                grid-cols-1
                gap-6
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {filteredCourses.map(
                (course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onViewCourse={
                      handleViewCourse
                    }
                  />
                )
              )}
            </div>
          ) : (
            <EmptyState
              hasActiveFilters={
                hasActiveFilters
              }
              onClear={clearFilters}
            />
          )}

          {/* =================================================
              BOTTOM DECORATION
          ================================================= */}

          <div className="mt-12 flex items-center justify-center gap-4 pb-8">
            <span className="h-px w-20 bg-gradient-to-r from-transparent to-[#c7a55a]/25" />

            <Sword
              size={14}
              className="text-[#c7a55a]/35"
            />

            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-600">
              Knowledge · Honor · Mastery
            </span>

            <Sword
              size={14}
              className="scale-x-[-1] text-[#c7a55a]/35"
            />

            <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#c7a55a]/25" />
          </div>
        </div>
      </div>

      {/* =================================================
          ANIMATIONS
      ================================================= */}

      <style>{`
        @keyframes moonPulse {
          0%, 100% {
            transform: scale(1);
            opacity: .75;
          }

          50% {
            transform: scale(1.04);
            opacity: 1;
          }
        }

        @keyframes castleFloat {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }

          50% {
            transform: translateX(-50%) translateY(-5px);
          }
        }

        @keyframes fogDrift {
          0%, 100% {
            transform: translateX(-3%);
            opacity: .25;
          }

          50% {
            transform: translateX(3%);
            opacity: .55;
          }
        }

        @keyframes snowFall {
          0% {
            transform: translate3d(0, -30px, 0);
            opacity: 0;
          }

          15% {
            opacity: .7;
          }

          100% {
            transform: translate3d(35px, 110vh, 0);
            opacity: 0;
          }
        }

        @keyframes emberFloat {
          0% {
            transform: translate3d(0, 20px, 0) scale(.5);
            opacity: 0;
          }

          20% {
            opacity: .6;
          }

          70% {
            opacity: .4;
          }

          100% {
            transform: translate3d(35px, -180px, 0) scale(1);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

// =====================================================
// COURSE CARD
// =====================================================

const CourseCard = ({
  course,
  onViewCourse,
}) => {
  const thumbnailUrl =
    course.courseThumbnail?.url;

  const instructorName =
    course.instructor?.name ||
    "Unknown Instructor";

  const price = Number(
    course.coursePrice || 0
  );

  const formattedPrice =
    price.toLocaleString("en-IN");

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-700/50
        bg-[#090c0f]/95
        shadow-[0_15px_50px_rgba(0,0,0,0.35)]
        transition
        duration-500
        hover:-translate-y-2
        hover:border-[#c7a55a]/35
        hover:shadow-[0_25px_70px_rgba(0,0,0,0.55)]
      "
    >
      {/* =================================================
          CARD TOP GOLD LINE
      ================================================= */}

      <div className="absolute left-0 right-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#c7a55a]/60 to-transparent opacity-60 transition group-hover:opacity-100" />

      {/* =================================================
          THUMBNAIL
      ================================================= */}

      <div
        className="
          relative
          aspect-video
          overflow-hidden
          bg-[#0d1217]
        "
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={
              course.courseTitle ||
              "Course thumbnail"
            }
            className="
              h-full
              w-full
              object-cover
              opacity-80
              transition
              duration-700
              group-hover:scale-110
              group-hover:opacity-100
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              bg-gradient-to-br
              from-[#101820]
              via-[#0b1116]
              to-[#080a0d]
            "
          >
            <div className="relative">
              <Castle
                size={52}
                strokeWidth={0.8}
                className="text-slate-700"
              />

              <Sparkles
                size={15}
                className="absolute -right-2 -top-2 text-[#c7a55a]/60"
              />
            </div>
          </div>
        )}

        {/* Dark cinematic overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-[#050708] via-transparent to-black/20" />

        {/* Ice glow */}

        <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-sky-400/[0.08] blur-3xl transition duration-500 group-hover:bg-sky-400/[0.14]" />

        {/* Gold glow */}

        <div className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-amber-400/[0.05] blur-3xl transition duration-500 group-hover:bg-amber-400/[0.10]" />

        {/* LEVEL */}

        <div className="absolute left-3 top-3">
          <span
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              border
              border-[#c7a55a]/25
              bg-[#080b0e]/85
              px-3
              py-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-[#d6ba72]
              shadow-lg
              backdrop-blur-md
            "
          >
            <Shield size={11} />

            {course.courseLevel ||
              "Beginner"}
          </span>
        </div>

        {/* CATEGORY */}

        {course.category && (
          <div className="absolute bottom-3 left-3">
            <span
              className="
                rounded-lg
                border
                border-sky-300/15
                bg-[#071015]/85
                px-3
                py-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.1em]
                text-sky-200/80
                backdrop-blur-md
              "
            >
              {course.category}
            </span>
          </div>
        )}

        {/* Corner sword */}

        <div className="absolute right-3 top-3 opacity-0 transition duration-500 group-hover:opacity-70">
          <Sword
            size={18}
            className="text-[#d6ba72]"
          />
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="relative p-5">

        {/* Decorative background */}

        <div className="pointer-events-none absolute bottom-0 right-0 opacity-[0.025]">
          <Castle size={100} />
        </div>

        {/* TITLE */}

        <h2
          className="
            relative
            line-clamp-2
            min-h-[56px]
            text-lg
            font-black
            leading-7
            tracking-[0.01em]
            text-slate-100
            transition
            duration-300
            group-hover:text-[#e1c77e]
          "
        >
          {course.courseTitle}
        </h2>

        {/* SUBTITLE */}

        <p
          className="
            mt-2
            line-clamp-2
            min-h-[40px]
            text-sm
            leading-5
            text-slate-500
          "
        >
          {course.subTitle ||
            "Begin your journey and sharpen your skills."}
        </p>

        {/* INSTRUCTOR */}

        <div className="mt-5 flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-700/60
              bg-slate-800/40
            "
          >
            <UserRound
              size={16}
              className="text-slate-400"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
              Maester
            </p>

            <p
              className="
                truncate
                text-sm
                font-semibold
                text-slate-300
              "
            >
              {instructorName}
            </p>
          </div>
        </div>

        {/* DIVIDER */}

        <div className="my-5 flex items-center gap-2">
          <span className="h-px flex-1 bg-slate-800" />

          <Crown
            size={12}
            className="text-[#c7a55a]/35"
          />

          <span className="h-px flex-1 bg-slate-800" />
        </div>

        {/* PRICE + BUTTON */}

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
              Price
            </p>

            <p className="mt-1 text-xl font-black text-[#d7bb72]">
              {price === 0
                ? "Free"
                : `₹${formattedPrice}`}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onViewCourse(course._id)
            }
            className="
              group/button
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-[#c7a55a]/25
              bg-[#c7a55a]/[0.07]
              px-4
              py-2.5
              text-xs
              font-bold
              uppercase
              tracking-[0.08em]
              text-[#d6ba72]
              transition
              duration-300
              hover:border-[#c7a55a]/60
              hover:bg-[#c7a55a]/[0.13]
              hover:text-[#f0d898]
              active:scale-95
            "
          >
            Enter

            <ChevronRight
              size={16}
              className="transition-transform duration-300 group-hover/button:translate-x-1"
            />
          </button>
        </div>
      </div>

      {/* =================================================
          BOTTOM LINE
      ================================================= */}

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c7a55a]/20 to-transparent transition group-hover:via-[#c7a55a]/60" />
    </div>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyState = ({
  hasActiveFilters,
  onClear,
}) => {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-700/50
        bg-[#090c0f]/90
        px-6
        py-20
        text-center
        shadow-[0_20px_70px_rgba(0,0,0,0.35)]
        backdrop-blur-xl
      "
    >
      {/* Background glow */}

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.025] blur-[100px]" />

      {/* Castle */}

      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 opacity-[0.035]">
        <Castle size={300} />
      </div>

      {/* Icon */}

      <div
        className="
          relative
          mx-auto
          mb-6
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-2xl
          border
          border-[#c7a55a]/20
          bg-[#c7a55a]/[0.05]
          shadow-[0_0_50px_rgba(199,165,90,0.05)]
        "
      >
        <BookOpen
          size={32}
          className="text-[#c7a55a]/60"
        />

        <Sparkles
          size={13}
          className="absolute -right-1 -top-1 text-sky-300/60"
        />
      </div>

      <div className="relative">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c7a55a]/50">
          THE ARCHIVES ARE SILENT
        </p>

        <h2 className="mt-3 text-2xl font-black uppercase tracking-[0.06em] text-slate-100">
          No courses found
        </h2>

        <p
          className="
            mx-auto
            mt-3
            max-w-md
            text-sm
            leading-6
            text-slate-500
          "
        >
          No knowledge was found matching your
          current search or filters.
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="
              mt-7
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-[#c7a55a]/30
              bg-[#c7a55a]/[0.07]
              px-5
              py-2.5
              text-xs
              font-bold
              uppercase
              tracking-[0.12em]
              text-[#d7bb72]
              transition
              hover:border-[#c7a55a]/60
              hover:bg-[#c7a55a]/[0.13]
            "
          >
            <RefreshIcon />

            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

// =====================================================
// SMALL REFRESH ICON
// =====================================================

const RefreshIcon = () => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
      <path d="M4 5v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
      <path d="M20 19v-4h-4" />
    </svg>
  );
};

export default StudentCourses;