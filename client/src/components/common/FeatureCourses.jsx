import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const C = {
  bg: "#FBFAF7",
  surface: "#FFFFFF",
  ink: "#15121F",
  muted: "#655D72",
  indigo: "#4F46E5",
  amber: "#F2A93B",
  teal: "#0EA5A4",
  coral: "#FF5A36",
  purple: "#7C3AED",
};

/* ============================================================
   COLORS
   Used only for decorative course visuals
============================================================ */

const COURSE_COLORS = [
  C.indigo,
  C.amber,
  C.teal,
  C.coral,
  C.purple,
];

/* ============================================================
   COURSE CARD
============================================================ */

function CourseCard({ course, index }) {
  const color = COURSE_COLORS[index % COURSE_COLORS.length];

  return (
    <Link
      to={`/courses/${course._id}`}
      className="
        group
        flex
        h-[470px]
        w-[330px]
        shrink-0
        flex-col
        overflow-hidden
        rounded-[22px]
        border
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_45px_rgba(21,18,31,0.10)]
        sm:w-[350px]
        lg:w-[360px]
      "
      style={{
        borderColor: "rgba(21,18,31,0.08)",
      }}
    >
      {/* ======================================================
          COURSE VISUAL
      ====================================================== */}

      <div
        className="
          relative
          h-[175px]
          shrink-0
          overflow-hidden
          px-6
          py-5
        "
        style={{
          backgroundColor: `${color}0D`,
        }}
      >
        {/* Large decorative circle */}

        <div
          className="
            absolute
            -right-14
            -top-14
            h-40
            w-40
            rounded-full
            opacity-20
            transition-transform
            duration-500
            group-hover:scale-110
          "
          style={{
            backgroundColor: color,
          }}
        />

        {/* Decorative ring */}

        <div
          className="
            absolute
            -bottom-16
            -left-10
            h-36
            w-36
            rounded-full
            border-[15px]
            opacity-10
          "
          style={{
            borderColor: color,
          }}
        />

        {/* Category */}

        <span
          className="
            relative
            z-10
            font-mono
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.18em]
          "
          style={{
            color,
          }}
        >
          {course.category}
        </span>

        {/* Course thumbnail / fallback */}

        {course.courseThumbnail?.url ? (
          <img
            src={course.courseThumbnail.url}
            alt={course.courseTitle}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              opacity-90
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              absolute
              bottom-5
              right-6
              z-10
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-white
              text-xl
              font-bold
              shadow-[0_6px_18px_rgba(21,18,31,0.10)]
              transition-transform
              duration-300
              group-hover:rotate-6
            "
            style={{
              color,
            }}
          >
            📚
          </div>
        )}

        {/* Category overlay when thumbnail exists */}

        {course.courseThumbnail?.url && (
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/40
              via-transparent
              to-transparent
            "
          />
        )}
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="flex flex-1 flex-col p-6">

        {/* Level + Lectures */}

        <div className="flex h-7 items-center justify-between gap-3">
          <span
            className="
              inline-flex
              items-center
              rounded-full
              px-2.5
              py-1
              text-[10px]
              font-semibold
            "
            style={{
              backgroundColor: `${color}12`,
              color,
            }}
          >
            {course.courseLevel}
          </span>

          <span
            className="text-xs"
            style={{
              color: C.muted,
            }}
          >
            Course
          </span>
        </div>

        {/* Title */}

        <h3
          className="
            mt-4
            h-[56px]
            overflow-hidden
            text-lg
            font-bold
            leading-7
            tracking-[-0.02em]
          "
          style={{
            color: C.ink,
          }}
        >
          {course.courseTitle}
        </h3>

        {/* Description */}

        <p
          className="
            mt-3
            h-[72px]
            overflow-hidden
            text-sm
            leading-6
          "
          style={{
            color: C.muted,
          }}
        >
          {course.description}
        </p>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div
          className="
            mt-auto
            border-t
            pt-5
          "
          style={{
            borderColor: "rgba(21,18,31,0.07)",
          }}
        >
          <div className="flex items-center justify-between gap-4">

            {/* Price */}

            <div className="min-w-0">
              <p
                className="text-lg font-bold"
                style={{
                  color: C.ink,
                }}
              >
                {course.coursePrice === 0
                  ? "Free"
                  : `₹${course.coursePrice}`}
              </p>

              <p
                className="mt-0.5 text-[10px]"
                style={{
                  color: C.muted,
                }}
              >
                Lifetime access
              </p>
            </div>

            {/* Button */}

            <span
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                rounded-xl
                px-3.5
                py-2.5
                text-xs
                font-semibold
                transition-all
                duration-200
                group-hover:translate-x-1
              "
              style={{
                backgroundColor: `${color}10`,
                color,
              }}
            >
              View course
              <span className="ml-1.5">→</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ============================================================
   COURSE SET
============================================================ */

function CourseSet({ courses }) {
  return (
    <div
      className="
        flex
        shrink-0
        gap-6
        pr-6
      "
    >
      {courses.map((course, index) => (
        <CourseCard
          key={course._id}
          course={course}
          index={index}
        />
      ))}
    </div>
  );
}

/* ============================================================
   FEATURED COURSES
============================================================ */

function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ==========================================================
     FETCH PUBLIC COURSES
  ========================================================== */

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/course");

        if (response.data.success) {
          setCourses(response.data.courses || []);
        } else {
          toast.error("Unable to load courses");
        }
      } catch (error) {
        console.error("Fetch public courses error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section
      id="courses"
      className="
        overflow-hidden
        border-t
        border-black/[0.06]
      "
      style={{
        backgroundColor: C.bg,
      }}
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1280px]
          px-6
          pb-12
          pt-20
          sm:px-8
          sm:pb-14
          sm:pt-24
          lg:px-10
        "
      >
        <div
          className="
            flex
            flex-col
            gap-8
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          {/* LEFT SIDE */}

          <div className="max-w-[720px]">

            {/* Section label */}

            <div className="flex items-center gap-3">
              <span
                className="h-[3px] w-11 rounded-full"
                style={{
                  backgroundColor: C.indigo,
                }}
              />

              <span
                className="
                  font-mono
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                "
                style={{
                  color: C.indigo,
                }}
              >
                Available courses
              </span>
            </div>

            {/* Heading */}

            <h2
              className="
                mt-5
                text-4xl
                font-bold
                leading-[1.05]
                tracking-[-0.045em]
                sm:text-5xl
                lg:text-[54px]
              "
              style={{
                color: C.ink,
              }}
            >
              Choose what you want

              <span
                className="block"
                style={{
                  color: C.muted,
                }}
              >
                to learn next.
              </span>
            </h2>

            {/* Description */}

            <p
              className="
                mt-5
                max-w-[650px]
                text-sm
                leading-7
                sm:text-base
              "
              style={{
                color: C.muted,
              }}
            >
              Explore practical courses designed to help you build
              knowledge, develop real skills and keep moving forward.
            </p>
          </div>

          {/* VIEW ALL */}

          <div
            className="
              flex
              shrink-0
              lg:pb-1
            "
          >
            <Link
              to="/courses"
              className="
                inline-flex
                h-12
                items-center
                justify-center
                rounded-xl
                border
                bg-white
                px-5
                text-sm
                font-semibold
                whitespace-nowrap
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                active:translate-y-0
              "
              style={{
                borderColor: "rgba(21,18,31,0.10)",
                color: C.ink,
              }}
            >
              View all courses
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="flex justify-center pb-24">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div
              className="
                h-5
                w-5
                animate-spin
                rounded-full
                border-2
                border-gray-200
                border-t-indigo-600
              "
            />

            Loading courses...
          </div>
        </div>
      )}

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {!loading && courses.length === 0 && (
        <div className="px-6 pb-24 text-center">
          <div
            className="
              mx-auto
              max-w-md
              rounded-2xl
              border
              bg-white
              px-6
              py-12
            "
            style={{
              borderColor: "rgba(21,18,31,0.08)",
            }}
          >
            <div className="text-4xl">📚</div>

            <h3
              className="mt-4 text-lg font-bold"
              style={{
                color: C.ink,
              }}
            >
              No courses available yet
            </h3>

            <p
              className="mt-2 text-sm"
              style={{
                color: C.muted,
              }}
            >
              New courses will appear here once instructors
              create them.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================
          COURSE CAROUSEL
      ====================================================== */}

      {!loading && courses.length > 0 && (
        <div
          className="
            relative
            w-full
            overflow-hidden
            pb-20
            sm:pb-24
          "
        >

          {/* Left fade */}

          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              z-20
              w-10
              sm:w-20
            "
            style={{
              background: `
                linear-gradient(
                  to right,
                  ${C.bg},
                  transparent
                )
              `,
            }}
          />

          {/* Right fade */}

          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              right-0
              z-20
              w-10
              sm:w-20
            "
            style={{
              background: `
                linear-gradient(
                  to left,
                  ${C.bg},
                  transparent
                )
              `,
            }}
          />

          {/* ==================================================
              ANIMATED TRACK
          ================================================== */}

          <div
            className="
              smart-lms-course-track
              flex
              w-max
              flex-nowrap
            "
          >
            <CourseSet courses={courses} />

            {/* Duplicate set for infinite scrolling */}

            <CourseSet courses={courses} />
          </div>
        </div>
      )}

      {/* ======================================================
          ANIMATION
      ====================================================== */}

      <style>{`
        .smart-lms-course-track {
          animation: smartLmsCourseScroll 45s linear infinite;
        }

        .smart-lms-course-track:hover {
          animation-play-state: paused;
        }

        @keyframes smartLmsCourseScroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 639px) {
          .smart-lms-course-track {
            animation-duration: 38s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .smart-lms-course-track {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default FeaturedCourses;