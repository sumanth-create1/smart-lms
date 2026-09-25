import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  BookOpen,
  Crown,
  Eye,
  Flame,
  IndianRupee,
  Layers3,
  LoaderCircle,
  Plus,
  Search,
  Shield,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api";


// =====================================================
// CONSTANTS
// =====================================================

const SORT_OPTIONS = {
  newest: "Newest",
  students: "Most Students",
  priceHigh: "Price: High → Low",
  priceLow: "Price: Low → High",
  title: "Title",
};

const REFRESH_INTERVAL = 10000;


// =====================================================
// MAIN COMPONENT
// =====================================================

function InstructorCourses() {
  const navigate = useNavigate();

  // ===================================================
  // DATA
  // ===================================================

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ===================================================
  // FILTERS
  // ===================================================

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [priceType, setPriceType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // ===================================================
  // PREMIUM CURSOR
  // ===================================================

  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const cursorGlowRef = useRef(null);

  usePremiumCursor(
    cursorDotRef,
    cursorRingRef,
    cursorGlowRef,
  );

  // ===================================================
  // FETCH COURSES
  // ===================================================

  const fetchCourses = async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const response = await api.get(
        "/course/instructor",
      );

      if (response.data?.success) {
        setCourses(
          response.data.courses || [],
        );
      } else if (showLoader) {
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

      if (showLoader) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load your courses.",
        );
      }
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  // ===================================================
  // INITIAL LOAD + DYNAMIC REFRESH
  // ===================================================

  useEffect(() => {
    // Initial request
    fetchCourses(true);

    // Automatically update student/course statistics
    const interval = setInterval(() => {
      fetchCourses(false);
    }, REFRESH_INTERVAL);

    // Refresh when user returns to the tab
    const handleFocus = () => {
      fetchCourses(false);
    };

    // Refresh when browser tab becomes visible
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible"
      ) {
        fetchCourses(false);
      }
    };

    window.addEventListener(
      "focus",
      handleFocus,
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      clearInterval(interval);

      window.removeEventListener(
        "focus",
        handleFocus,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, []);

  // ===================================================
  // DELETE COURSE
  // ===================================================

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

        setCourses((previous) =>
          previous.filter(
            (course) =>
              course._id !== courseId,
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

  // ===================================================
  // DYNAMIC CATEGORIES
  // ===================================================

  const categories = useMemo(() => {
    return [
      ...new Set(
        courses
          .map(
            (course) => course.category,
          )
          .filter(Boolean),
      ),
    ];
  }, [courses]);

  // ===================================================
  // DYNAMIC LEVELS
  // ===================================================

  const levels = useMemo(() => {
    return [
      ...new Set(
        courses
          .map(
            (course) =>
              course.courseLevel,
          )
          .filter(Boolean),
      ),
    ];
  }, [courses]);

  // ===================================================
  // FILTER + SORT
  // ===================================================

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // SEARCH
    if (search.trim()) {
      const query =
        search.toLowerCase().trim();

      result = result.filter(
        (course) =>
          [
            course.courseTitle,
            course.subTitle,
            course.category,
            course.courseLevel,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query),
            ),
      );
    }

    // CATEGORY
    if (category !== "all") {
      result = result.filter(
        (course) =>
          course.category === category,
      );
    }

    // LEVEL
    if (level !== "all") {
      result = result.filter(
        (course) =>
          course.courseLevel === level,
      );
    }

    // PRICE
    if (priceType === "free") {
      result = result.filter(
        (course) =>
          Number(
            course.coursePrice || 0,
          ) === 0,
      );
    }

    if (priceType === "paid") {
      result = result.filter(
        (course) =>
          Number(
            course.coursePrice || 0,
          ) > 0,
      );
    }

    // SORT
    switch (sortBy) {
      case "students":
        result.sort(
          (a, b) =>
            Number(
              b.studentCount || 0,
            ) -
            Number(
              a.studentCount || 0,
            ),
        );
        break;

      case "priceHigh":
        result.sort(
          (a, b) =>
            Number(
              b.coursePrice || 0,
            ) -
            Number(
              a.coursePrice || 0,
            ),
        );
        break;

      case "priceLow":
        result.sort(
          (a, b) =>
            Number(
              a.coursePrice || 0,
            ) -
            Number(
              b.coursePrice || 0,
            ),
        );
        break;

      case "title":
        result.sort((a, b) =>
          String(
            a.courseTitle || "",
          ).localeCompare(
            String(
              b.courseTitle || "",
            ),
          ),
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    courses,
    search,
    category,
    level,
    priceType,
    sortBy,
  ]);

  // ===================================================
  // SUMMARY
  // ===================================================

  const totalStudents = useMemo(() => {
    return courses.reduce(
      (total, course) =>
        total +
        Number(
          course.studentCount || 0,
        ),
      0,
    );
  }, [courses]);

  const freeCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        Number(
          course.coursePrice || 0,
        ) === 0,
    ).length;
  }, [courses]);

  const paidCourses =
    courses.length - freeCourses;

  const totalValue = useMemo(() => {
    return courses.reduce(
      (total, course) =>
        total +
        Number(
          course.coursePrice || 0,
        ),
      0,
    );
  }, [courses]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return <LoadingScreen />;
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070605] text-white">

      {/* PREMIUM CURSOR */}

      <PremiumCursor
        dotRef={cursorDotRef}
        ringRef={cursorRingRef}
        glowRef={cursorGlowRef}
      />

      {/* BACKGROUND */}

      <BackgroundAtmosphere />

      {/* GRID */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* MAIN */}

      <main className="relative z-10 mx-auto max-w-[1700px] px-5 py-7 sm:px-7 lg:px-10 lg:py-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mb-8">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-4 flex items-center gap-3">

                <div className="flex items-center gap-1">

                  <span className="h-px w-7 bg-gradient-to-r from-transparent to-orange-500" />

                  <Flame
                    size={13}
                    className="text-orange-400"
                  />

                  <span className="h-px w-7 bg-gradient-to-l from-transparent to-orange-500" />

                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-orange-400/80">
                  Instructor Realm
                </span>

              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">

                Your{" "}

                <span className="bg-gradient-to-r from-orange-300 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                  Courses
                </span>

              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
                Manage your learning domains,
                monitor your students, and continue
                building your teaching kingdom.
              </p>

            </div>

            <Link
              to="/instructor/create-course"
              className="
                interactive
                group
                inline-flex
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                border-orange-400/20
                bg-orange-500
                px-5
                py-3
                text-sm
                font-bold
                text-white
                shadow-[0_12px_30px_rgba(249,115,22,0.12)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-orange-400
                hover:shadow-[0_18px_40px_rgba(249,115,22,0.2)]
              "
            >

              <Plus
                size={17}
                className="transition-transform duration-300 group-hover:rotate-90"
              />

              Create Course

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </Link>

          </div>

        </header>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <SummaryCard
            icon={<BookOpen size={18} />}
            label="Courses"
            value={courses.length}
          />

          <SummaryCard
            icon={<Users size={18} />}
            label="Students"
            value={totalStudents}
          />

          <SummaryCard
            icon={<Shield size={18} />}
            label="Free / Paid"
            value={`${freeCourses} / ${paidCourses}`}
          />

          <SummaryCard
            icon={<IndianRupee size={18} />}
            label="Course Value"
            value={`₹${totalValue.toLocaleString(
              "en-IN",
            )}`}
          />

        </section>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <section className="mb-7 rounded-2xl border border-white/[0.06] bg-[#0d0a08]/80 p-3 backdrop-blur-xl">

          <div className="flex flex-col gap-3 xl:flex-row">

            {/* SEARCH */}

            <div className="relative flex-1">

              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search courses, categories, levels..."
                className="
                  interactive
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-white/[0.06]
                  bg-black/20
                  pl-11
                  pr-10
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-stone-700
                  transition
                  focus:border-orange-500/30
                  focus:bg-orange-500/[0.025]
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="interactive absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 transition hover:text-white"
                >
                  <X size={15} />
                </button>
              )}

            </div>

            {/* FILTERS */}

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:flex">

              <FilterSelect
                value={category}
                onChange={setCategory}
                options={[
                  [
                    "all",
                    "All Categories",
                  ],
                  ...categories.map(
                    (item) => [
                      item,
                      item,
                    ],
                  ),
                ]}
              />

              <FilterSelect
                value={level}
                onChange={setLevel}
                options={[
                  [
                    "all",
                    "All Levels",
                  ],
                  ...levels.map(
                    (item) => [
                      item,
                      item,
                    ],
                  ),
                ]}
              />

              <FilterSelect
                value={priceType}
                onChange={setPriceType}
                options={[
                  [
                    "all",
                    "All Prices",
                  ],
                  ["free", "Free"],
                  ["paid", "Paid"],
                ]}
              />

              <FilterSelect
                value={sortBy}
                onChange={setSortBy}
                options={Object.entries(
                  SORT_OPTIONS,
                )}
              />

            </div>

          </div>

        </section>

        {/* =================================================
            RESULTS HEADER
        ================================================= */}

        <div className="mb-5 flex items-center justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Layers3
                size={16}
                className="text-orange-400"
              />

              <h2 className="text-lg font-bold">
                Course Realm
              </h2>

            </div>

            <p className="mt-1 text-xs text-stone-600">
              Showing{" "}
              <span className="text-stone-400">
                {filteredCourses.length}
              </span>{" "}
              of{" "}
              <span className="text-stone-400">
                {courses.length}
              </span>{" "}
              courses
            </p>

          </div>

          {/* LIVE INDICATOR */}

          <div className="hidden items-center gap-2 sm:flex">

            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-50" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-400" />

            </span>

            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-600">
              Live Statistics
            </span>

          </div>

        </div>

        {/* =================================================
            RESULTS
        ================================================= */}

        {filteredCourses.length === 0 &&
        courses.length > 0 ? (
          <NoResults
            onClear={() => {
              setSearch("");
              setCategory("all");
              setLevel("all");
              setPriceType("all");
            }}
          />
        ) : courses.length === 0 ? (
          <EmptyCourses />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

            {filteredCourses.map(
              (course, index) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  index={index}
                  deleting={
                    deletingId ===
                    course._id
                  }
                  onDelete={
                    handleDelete
                  }
                  onManage={() =>
                    navigate(
                      `/instructor/courses/${course._id}`,
                    )
                  }
                />
              ),
            )}

          </div>
        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="mt-12 flex items-center justify-between border-t border-white/[0.04] pt-6">

          <div className="flex items-center gap-2">

            <Crown
              size={13}
              className="text-orange-500/40"
            />

            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-700">
              Instructor Command Center
            </span>

          </div>

          <span className="hidden text-[9px] text-stone-800 sm:block">
            Create • Teach • Command
          </span>

        </footer>

      </main>
    </div>
  );
}


// =====================================================
// PREMIUM CURSOR HOOK
// =====================================================

function usePremiumCursor(
  dotRef,
  ringRef,
  glowRef,
) {
  useEffect(() => {
    // Disable custom cursor on touch devices
    if (
      window.matchMedia(
        "(pointer: coarse)",
      ).matches
    ) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;

    if (!dot || !ring || !glow) {
      return;
    }

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;

    let animationFrame;

    const moveCursor = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      dot.style.transform =
        `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      glow.style.transform =
        `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    const animateRing = () => {
      ringX +=
        (mouseX - ringX) * 0.15;

      ringY +=
        (mouseY - ringY) * 0.15;

      ring.style.transform =
        `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      animationFrame =
        requestAnimationFrame(
          animateRing,
        );
    };

    const handleEnter = () => {
      ring.style.width = "52px";
      ring.style.height = "52px";

      ring.style.borderColor =
        "rgba(249,115,22,0.8)";

      dot.style.transform +=
        " scale(1.4)";
    };

    const handleLeave = () => {
      ring.style.width = "34px";
      ring.style.height = "34px";

      ring.style.borderColor =
        "rgba(249,115,22,0.35)";
    };

    document.addEventListener(
      "mousemove",
      moveCursor,
    );

    document.addEventListener(
      "mouseenter",
      handleEnter,
      true,
    );

    document.addEventListener(
      "mouseleave",
      handleLeave,
      true,
    );

    const interactiveElements =
      document.querySelectorAll(
        "button, a, input, select, article, .interactive",
      );

    interactiveElements.forEach(
      (element) => {
        element.addEventListener(
          "mouseenter",
          handleEnter,
        );

        element.addEventListener(
          "mouseleave",
          handleLeave,
        );
      },
    );

    animateRing();

    return () => {
      document.removeEventListener(
        "mousemove",
        moveCursor,
      );

      document.removeEventListener(
        "mouseenter",
        handleEnter,
        true,
      );

      document.removeEventListener(
        "mouseleave",
        handleLeave,
        true,
      );

      interactiveElements.forEach(
        (element) => {
          element.removeEventListener(
            "mouseenter",
            handleEnter,
          );

          element.removeEventListener(
            "mouseleave",
            handleLeave,
          );
        },
      );

      cancelAnimationFrame(
        animationFrame,
      );
    };
  }, [
    dotRef,
    ringRef,
    glowRef,
  ]);
}


// =====================================================
// PREMIUM CURSOR UI
// =====================================================

function PremiumCursor({
  dotRef,
  ringRef,
  glowRef,
}) {
  return (
    <>
      {/* GOLDEN GLOW */}

      <div
        ref={glowRef}
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[9998]
          hidden
          h-32
          w-32
          rounded-full
          bg-orange-500/[0.07]
          blur-3xl
          md:block
        "
      />

      {/* OUTER RING */}

      <div
        ref={ringRef}
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[9999]
          hidden
          h-[34px]
          w-[34px]
          rounded-full
          border
          border-orange-500/35
          bg-orange-500/[0.015]
          shadow-[0_0_25px_rgba(249,115,22,0.12)]
          backdrop-blur-[1px]
          transition-[width,height,border-color]
          duration-200
          md:block
        "
      />

      {/* CENTER DOT */}

      <div
        ref={dotRef}
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[10000]
          hidden
          h-[6px]
          w-[6px]
          rounded-full
          bg-orange-300
          shadow-[0_0_12px_rgba(251,146,60,0.95)]
          md:block
        "
      />
    </>
  );
}


// =====================================================
// BACKGROUND
// =====================================================

function BackgroundAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      <div className="absolute -left-60 -top-60 h-[650px] w-[650px] rounded-full bg-orange-600/[0.045] blur-[170px]" />

      <div className="absolute -right-60 top-[20%] h-[600px] w-[600px] rounded-full bg-amber-500/[0.025] blur-[170px]" />

      <div className="absolute bottom-[-350px] left-[30%] h-[650px] w-[650px] rounded-full bg-orange-700/[0.025] blur-[180px]" />

      {/* SMALL EMBERS */}

      <div className="absolute left-[12%] top-[25%] h-1 w-1 animate-pulse rounded-full bg-orange-400/50" />

      <div className="absolute left-[70%] top-[18%] h-1 w-1 animate-pulse rounded-full bg-amber-300/40 [animation-delay:700ms]" />

      <div className="absolute left-[85%] top-[60%] h-1 w-1 animate-pulse rounded-full bg-orange-500/40 [animation-delay:1200ms]" />

      <div className="absolute left-[35%] top-[80%] h-1 w-1 animate-pulse rounded-full bg-amber-400/30 [animation-delay:1800ms]" />

    </div>
  );
}


// =====================================================
// LOADING
// =====================================================

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070605] text-white">

      <div className="flex flex-col items-center">

        <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/15 bg-[#100d0b] shadow-[0_0_40px_rgba(249,115,22,0.08)]">

          <div className="absolute inset-0 animate-pulse rounded-2xl bg-orange-500/[0.04]" />

          <Crown
            size={25}
            className="relative text-orange-400"
          />

        </div>

        <LoaderCircle
          size={22}
          className="mb-3 animate-spin text-orange-400"
        />

        <p className="text-sm font-semibold text-stone-300">
          Opening your course realm...
        </p>

        <p className="mt-1 text-xs text-stone-700">
          Gathering your courses
        </p>

      </div>

    </div>
  );
}


// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="
        interactive
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.055]
        bg-[#0d0a08]/80
        p-4
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-orange-500/[0.16]
        hover:shadow-[0_15px_45px_rgba(249,115,22,0.05)]
      "
    >

      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-orange-500/[0.04] blur-2xl transition group-hover:bg-orange-500/[0.08]" />

      <div className="relative flex items-center gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/10 bg-orange-500/[0.05] text-orange-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">

          {icon}

        </div>

        <div className="min-w-0">

          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-stone-600">
            {label}
          </p>

          <p className="mt-1 truncate text-lg font-black text-white">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}


// =====================================================
// FILTER SELECT
// =====================================================

function FilterSelect({
  value,
  onChange,
  options,
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="
        interactive
        h-11
        min-w-0
        rounded-xl
        border
        border-white/[0.06]
        bg-[#100d0b]
        px-3
        text-xs
        font-semibold
        text-stone-400
        outline-none
        transition
        focus:border-orange-500/30
        focus:bg-orange-500/[0.03]
      "
    >
      {options.map(
        ([optionValue, label]) => (
          <option
            key={optionValue}
            value={optionValue}
          >
            {label}
          </option>
        ),
      )}
    </select>
  );
}


// =====================================================
// COURSE CARD
// =====================================================

function CourseCard({
  course,
  deleting,
  onDelete,
  onManage,
  index,
}) {
  const price = Number(
    course.coursePrice || 0,
  );

  const students = Number(
    course.studentCount || 0,
  );

  const isFree = price === 0;

  const isPopular = students >= 10;

  const thumbnail =
    course.courseThumbnail?.url ||
    "/placeholder-course.jpg";

  return (
    <article
      className="
        interactive
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.06]
        bg-[#0d0a08]
        shadow-[0_20px_55px_rgba(0,0,0,0.3)]
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-orange-500/[0.18]
        hover:shadow-[0_30px_70px_rgba(0,0,0,0.45)]
      "
    >

      {/* THUMBNAIL */}

      <div className="relative aspect-[16/9] overflow-hidden">

        <img
          src={thumbnail}
          alt={
            course.courseTitle ||
            "Course"
          }
          className="
            h-full
            w-full
            object-cover
            opacity-80
            transition-all
            duration-700
            group-hover:scale-105
            group-hover:opacity-100
          "
          onError={(event) => {
            event.currentTarget.src =
              "/placeholder-course.jpg";
          }}
        />

        {/* IMAGE OVERLAY */}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a08] via-black/10 to-black/20" />

        {/* COURSE NUMBER */}

        <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/50 text-[9px] font-black backdrop-blur-md">

          {String(index + 1).padStart(
            2,
            "0",
          )}

        </div>

        {/* PRICE */}

        <div className="absolute right-3 top-3">

          <span
            className={`
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              border
              px-2.5
              py-1.5
              text-[9px]
              font-black
              uppercase
              tracking-wider
              backdrop-blur-md
              ${
                isFree
                  ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                  : "border-orange-400/20 bg-black/50 text-orange-200"
              }
            `}
          >

            {isFree ? (
              <>
                <Sparkles size={11} />
                Free
              </>
            ) : (
              <>
                <IndianRupee
                  size={11}
                />

                {price.toLocaleString(
                  "en-IN",
                )}
              </>
            )}

          </span>

        </div>

        {/* POPULAR */}

        {isPopular && (
          <div className="absolute bottom-3 left-3">

            <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/20 bg-amber-500/10 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-wider text-amber-300 backdrop-blur-md">

              <Flame size={10} />

              Popular

            </span>

          </div>
        )}

        {/* VIEW */}

        <div className="absolute bottom-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-lg border border-white/10 bg-black/50 text-orange-300 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">

          <Eye size={14} />

        </div>

      </div>

      {/* CONTENT */}

      <div className="p-4 sm:p-5">

        {/* TITLE */}

        <div className="mb-4">

          <h2 className="line-clamp-2 min-h-[48px] text-base font-black leading-6 text-white transition-colors group-hover:text-orange-300">

            {course.courseTitle ||
              "Untitled Course"}

          </h2>

          <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-stone-600">

            {course.subTitle ||
              "Build knowledge and guide your students toward mastery."}

          </p>

        </div>

        {/* TAGS */}

        <div className="mb-4 flex flex-wrap gap-1.5">

          {course.category && (
            <span className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-stone-500">
              {course.category}
            </span>
          )}

          {course.courseLevel && (
            <span className="rounded-md border border-orange-500/[0.08] bg-orange-500/[0.035] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-orange-400/70">
              {course.courseLevel}
            </span>
          )}

        </div>

        {/* DYNAMIC STATS */}

        <div className="grid grid-cols-2 gap-2">

          <StatBox
            icon={<Users size={13} />}
            label="Students"
            value={students}
          />

          <StatBox
            icon={
              isFree ? (
                <Sparkles
                  size={13}
                />
              ) : (
                <IndianRupee
                  size={13}
                />
              )
            }
            label="Access"
            value={
              isFree
                ? "Free"
                : `₹${price.toLocaleString(
                    "en-IN",
                  )}`
            }
            accent={!isFree}
          />

        </div>

        {/* ACTIONS */}

        <div className="mt-4 flex gap-2">

          <button
            type="button"
            onClick={onManage}
            className="
              interactive
              group/manage
              flex
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-orange-600
              to-orange-500
              px-3
              py-2.5
              text-xs
              font-bold
              text-white
              transition-all
              duration-300
              hover:from-orange-500
              hover:to-amber-500
              hover:shadow-[0_10px_25px_rgba(249,115,22,0.15)]
            "
          >

            Manage

            <ArrowRight
              size={13}
              className="transition-transform group-hover/manage:translate-x-1"
            />

          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(course._id)
            }
            disabled={deleting}
            className="
              interactive
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-red-500/10
              bg-red-500/[0.035]
              text-red-400/70
              transition-all
              hover:border-red-500/20
              hover:bg-red-500/[0.08]
              hover:text-red-300
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            title="Delete course"
          >

            {deleting ? (
              <LoaderCircle
                size={15}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={15} />
            )}

          </button>

        </div>

      </div>

      {/* BOTTOM GLOW */}

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent opacity-30 transition-opacity group-hover:opacity-100" />

    </article>
  );
}


// =====================================================
// STAT BOX
// =====================================================

function StatBox({
  icon,
  label,
  value,
  accent = false,
}) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.018] px-3 py-2.5 transition-all duration-300 hover:border-orange-500/[0.08] hover:bg-orange-500/[0.025]">

      <div className="flex items-center gap-1.5 text-stone-700">

        {icon}

        <span className="text-[8px] font-bold uppercase tracking-wider">
          {label}
        </span>

      </div>

      <p
        className={`mt-1 text-sm font-black ${
          accent
            ? "text-orange-300"
            : "text-stone-300"
        }`}
      >
        {value}
      </p>

    </div>
  );
}


// =====================================================
// NO RESULTS
// =====================================================

function NoResults({
  onClear,
}) {
  return (
    <div className="rounded-[24px] border border-white/[0.05] bg-[#0d0a08]/80 px-6 py-20 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/10 bg-orange-500/[0.04]">

        <Search
          size={22}
          className="text-orange-400/70"
        />

      </div>

      <h3 className="mt-5 text-lg font-bold">
        No courses found
      </h3>

      <p className="mt-2 text-sm text-stone-600">
        Try changing your search or filters.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="interactive mt-5 rounded-lg border border-orange-500/15 bg-orange-500/[0.05] px-4 py-2 text-xs font-bold text-orange-300 transition hover:bg-orange-500/10"
      >
        Clear Filters
      </button>

    </div>
  );
}


// =====================================================
// EMPTY COURSES
// =====================================================

function EmptyCourses() {
  return (
    <div className="rounded-[28px] border border-orange-500/[0.08] bg-[#0d0a08]/80 px-6 py-20 text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/10 bg-orange-500/[0.04] shadow-[0_0_35px_rgba(249,115,22,0.06)]">

        <BookOpen
          size={27}
          className="text-orange-400"
        />

      </div>

      <div className="mt-5 flex items-center justify-center gap-2">

        <span className="h-px w-7 bg-orange-500/20" />

        <Crown
          size={13}
          className="text-orange-500/50"
        />

        <span className="h-px w-7 bg-orange-500/20" />

      </div>

      <h2 className="mt-5 text-xl font-bold">
        Your Realm Awaits
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
        You haven't created any courses
        yet. Forge your first course and
        begin building your learning
        kingdom.
      </p>

      <Link
        to="/instructor/create-course"
        className="
          interactive
          mt-6
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-orange-500
          px-5
          py-3
          text-sm
          font-bold
          text-white
          transition
          hover:-translate-y-1
          hover:bg-orange-400
          hover:shadow-[0_12px_30px_rgba(249,115,22,0.15)]
        "
      >

        <Plus size={16} />

        Create Your First Course

        <ArrowRight size={14} />

      </Link>

    </div>
  );
}


export default InstructorCourses;