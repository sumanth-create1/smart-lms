import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Filter,
  LoaderCircle,
  Search,
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
    // Logged-in student
    if (user?.role === "student") {
      navigate("/dashboard");
      return;
    }

    // Logged-in instructor
    if (user?.role === "instructor") {
      navigate("/instructor/dashboard");
      return;
    }

    // Guest user
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
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2]">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            size={36}
            className="animate-spin text-gray-900"
          />

          <p className="text-sm text-gray-500">
            Loading courses...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F7F6F2] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <div className="mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-gray-700
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:bg-gray-50
              hover:text-gray-900
              hover:shadow-md
              active:translate-y-0
            "
          >
            <ArrowLeft size={17} />

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
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            {/* HEADER */}

            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900">
                  <BookOpen
                    size={18}
                    className="text-white"
                  />
                </div>

                <span className="text-sm font-medium text-gray-500">
                  Learning Center
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Explore Courses
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Discover courses, build new skills,
                and continue your learning journey.
              </p>
            </div>

            {/* COURSE COUNT */}

            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <BookOpen
                size={18}
                className="text-gray-500"
              />

              <div>
                <p className="text-xs text-gray-400">
                  Available Courses
                </p>

                <p className="text-lg font-bold text-gray-900">
                  {courses.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            SEARCH + FILTERS
        ================================================= */}

        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
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
                  text-gray-400
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
                placeholder="Search courses..."
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  pl-11
                  pr-10
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  focus:border-gray-400
                  focus:bg-white
                  focus:ring-2
                  focus:ring-gray-100
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
                    p-1
                    text-gray-400
                    transition
                    hover:bg-gray-200
                    hover:text-gray-700
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
                className="hidden text-gray-400 sm:block"
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
                  border-gray-200
                  bg-gray-50
                  px-4
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  focus:border-gray-400
                  focus:bg-white
                  focus:ring-2
                  focus:ring-gray-100
                "
              >
                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
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
                border-gray-200
                bg-gray-50
                px-4
                text-sm
                text-gray-700
                outline-none
                transition
                focus:border-gray-400
                focus:bg-white
                focus:ring-2
                focus:ring-gray-100
              "
            >
              <option value="All">
                All Levels
              </option>

              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>
            </select>
          </div>

          {/* ACTIVE FILTERS */}

          {hasActiveFilters && (
            <div className="
              mt-4
              flex
              flex-wrap
              items-center
              justify-between
              gap-3
              border-t
              border-gray-100
              pt-4
            ">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
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
                  font-medium
                  text-gray-600
                  transition
                  hover:text-gray-900
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
          <div className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          ">
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
      </div>
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
    <div className="
      group
      overflow-hidden
      rounded-2xl
      border
      border-gray-200
      bg-white
      shadow-sm
      transition
      duration-300
      hover:-translate-y-1
      hover:shadow-lg
    ">

      {/* THUMBNAIL */}

      <div className="
        relative
        aspect-video
        overflow-hidden
        bg-gray-100
      ">
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
              transition
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="
            flex
            h-full
            w-full
            items-center
            justify-center
            bg-gray-100
          ">
            <BookOpen
              size={42}
              className="text-gray-300"
            />
          </div>
        )}

        {/* LEVEL */}

        <div className="absolute left-3 top-3">
          <span className="
            rounded-lg
            bg-white/95
            px-3
            py-1.5
            text-xs
            font-semibold
            text-gray-700
            shadow-sm
            backdrop-blur
          ">
            {course.courseLevel ||
              "Beginner"}
          </span>
        </div>

        {/* CATEGORY */}

        {course.category && (
          <div className="absolute bottom-3 left-3">
            <span className="
              rounded-lg
              bg-gray-900/90
              px-3
              py-1.5
              text-xs
              font-medium
              text-white
              backdrop-blur
            ">
              {course.category}
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}

      <div className="p-5">

        {/* TITLE */}

        <h2 className="
          line-clamp-2
          min-h-[56px]
          text-lg
          font-bold
          leading-7
          text-gray-900
          transition
          group-hover:text-gray-700
        ">
          {course.courseTitle}
        </h2>

        {/* SUBTITLE */}

        <p className="
          mt-2
          line-clamp-2
          min-h-[40px]
          text-sm
          leading-5
          text-gray-500
        ">
          {course.subTitle ||
            "Start learning and improve your skills."}
        </p>

        {/* INSTRUCTOR */}

        <div className="mt-4 flex items-center gap-2">
          <div className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-gray-100
          ">
            <UserRound
              size={16}
              className="text-gray-500"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] text-gray-400">
              Instructor
            </p>

            <p className="
              truncate
              text-sm
              font-medium
              text-gray-700
            ">
              {instructorName}
            </p>
          </div>
        </div>

        {/* DIVIDER */}

        <div className="my-5 border-t border-gray-100" />

        {/* PRICE + BUTTON */}

        <div className="
          flex
          items-center
          justify-between
          gap-3
        ">
          <div>
            <p className="text-xs text-gray-400">
              Course Price
            </p>

            <p className="text-xl font-bold text-gray-900">
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
              flex
              items-center
              gap-2
              rounded-xl
              bg-gray-900
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-gray-800
              active:scale-95
            "
          >
            View Course
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
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
    <div className="
      rounded-2xl
      border
      border-gray-200
      bg-white
      px-6
      py-16
      text-center
      shadow-sm
    ">
      <div className="
        mx-auto
        mb-5
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-2xl
        bg-gray-100
      ">
        <BookOpen
          size={28}
          className="text-gray-400"
        />
      </div>

      <h2 className="text-xl font-semibold text-gray-900">
        No courses found
      </h2>

      <p className="
        mx-auto
        mt-2
        max-w-md
        text-sm
        leading-6
        text-gray-500
      ">
        We couldn't find any courses
        matching your current search
        or filters.
      </p>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="
            mt-6
            rounded-xl
            bg-gray-900
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-gray-800
          "
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default StudentCourses;