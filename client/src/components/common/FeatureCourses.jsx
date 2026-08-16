import { Link } from "react-router-dom";

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

const COURSES = [
  {
    id: 1,
    title: "MERN Stack Development",
    description:
      "Build modern full-stack applications using MongoDB, Express, React and Node.js.",
    category: "Development",
    level: "Intermediate",
    lectures: 42,
    duration: "18h 30m",
    price: "₹1,499",
    color: C.indigo,
    icon: "⌘",
  },
  {
    id: 2,
    title: "Java Programming",
    description:
      "Master Java fundamentals, OOP concepts and practical programming skills.",
    category: "Programming",
    level: "Beginner",
    lectures: 36,
    duration: "14h 20m",
    price: "₹999",
    color: C.amber,
    icon: "☕",
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    description:
      "Learn important DSA concepts and develop strong problem-solving skills.",
    category: "DSA",
    level: "Intermediate",
    lectures: 55,
    duration: "24h 10m",
    price: "₹1,799",
    color: C.teal,
    icon: "◈",
  },
  {
    id: 4,
    title: "React.js Fundamentals",
    description:
      "Learn React and build reusable, interactive and scalable interfaces.",
    category: "Frontend",
    level: "Beginner",
    lectures: 28,
    duration: "10h 45m",
    price: "₹799",
    color: C.coral,
    icon: "⚛",
  },
  {
    id: 5,
    title: "SQL & Database Management",
    description:
      "Understand SQL queries, relational databases and database design.",
    category: "Database",
    level: "Beginner",
    lectures: 30,
    duration: "11h 30m",
    price: "₹899",
    color: C.purple,
    icon: "▣",
  },
  {
    id: 6,
    title: "Node.js Backend Development",
    description:
      "Create REST APIs, authentication systems and scalable backend applications.",
    category: "Backend",
    level: "Intermediate",
    lectures: 38,
    duration: "16h 15m",
    price: "₹1,299",
    color: C.indigo,
    icon: "◆",
  },
];

/* ============================================================
   COURSE CARD
============================================================ */

function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.id}`}
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
          backgroundColor: `${course.color}0D`,
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
            backgroundColor: course.color,
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
            borderColor: course.color,
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
            color: course.color,
          }}
        >
          {course.category}
        </span>

        {/* Course Icon */}

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
            color: course.color,
          }}
        >
          {course.icon}
        </div>
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
              backgroundColor: `${course.color}12`,
              color: course.color,
            }}
          >
            {course.level}
          </span>

          <span
            className="text-xs"
            style={{
              color: C.muted,
            }}
          >
            {course.lectures} lectures
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
          {course.title}
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
                {course.price}
              </p>

              <p
                className="mt-0.5 text-[10px]"
                style={{
                  color: C.muted,
                }}
              >
                {course.duration}
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
                backgroundColor: `${course.color}10`,
                color: course.color,
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
   Keeping each set identical makes the infinite animation
   seamless.
============================================================ */

function CourseSet() {
  return (
    <div
      className="
        flex
        shrink-0
        gap-6
        pr-6
      "
    >
      {COURSES.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
        />
      ))}
    </div>
  );
}

/* ============================================================
   FEATURED COURSES
============================================================ */

function FeaturedCourses() {
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

          {/* ==================================================
              VIEW ALL BUTTON
          ================================================== */}

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
          COURSE CAROUSEL
      ====================================================== */}

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
          {/* First set */}

          <CourseSet />

          {/* Exact duplicate */}

          <CourseSet />
        </div>
      </div>

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