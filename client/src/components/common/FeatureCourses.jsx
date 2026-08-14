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
    color: "#7C3AED",
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

function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="
        group
        block
        w-[310px]
        shrink-0
        overflow-hidden
        rounded-[24px]
        border
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_20px_50px_rgba(21,18,31,0.10)]
        sm:w-[340px]
      "
      style={{
        borderColor: "rgba(21,18,31,0.08)",
      }}
    >
      {/* Course visual */}

      <div
        className="relative h-40 overflow-hidden p-6"
        style={{
          backgroundColor: `${course.color}0D`,
        }}
      >
        {/* Decorative circles */}

        <div
          className="
            absolute
            -right-12
            -top-12
            h-36
            w-36
            rounded-full
            opacity-20
            transition-transform
            duration-500
            group-hover:scale-125
          "
          style={{
            backgroundColor: course.color,
          }}
        />

        <div
          className="
            absolute
            -bottom-16
            -left-8
            h-32
            w-32
            rounded-full
            border-[16px]
            opacity-10
          "
          style={{
            borderColor: course.color,
          }}
        />

        <span
          className="
            relative
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

        {/* Icon */}

        <div
          className="
            absolute
            bottom-5
            right-6
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-white
            text-lg
            font-bold
            shadow-sm
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

      {/* Content */}

      <div className="p-6">

        <div className="flex items-center justify-between gap-3">

          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
            style={{
              backgroundColor: `${course.color}10`,
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

        <h3
          className="
            mt-5
            line-clamp-2
            min-h-[52px]
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

        <p
          className="
            mt-3
            line-clamp-2
            min-h-[48px]
            text-sm
            leading-6
          "
          style={{
            color: C.muted,
          }}
        >
          {course.description}
        </p>

        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            border-t
            pt-5
          "
          style={{
            borderColor: "rgba(21,18,31,0.07)",
          }}
        >

          <div>

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

          <span
            className="
              text-xs
              font-semibold
              transition-all
              duration-300
              group-hover:translate-x-1
            "
            style={{
              color: course.color,
            }}
          >
            View course →
          </span>

        </div>

      </div>
    </Link>
  );
}

function FeaturedCourses() {
  /*
    We duplicate the course list.

    Why?

    The first copy moves across the screen and the second copy
    immediately follows it. This creates a seamless infinite loop.
  */

  const scrollingCourses = [...COURSES, ...COURSES];

  return (
    <section
      id="courses"
      className="overflow-hidden border-t border-black/[0.06]"
      style={{
        backgroundColor: C.bg,
      }}
    >

      {/* =====================================================
          SECTION HEADER
      ===================================================== */}

      <div className="mx-auto max-w-[1180px] px-6 pb-12 pt-24 sm:px-8 sm:pb-14 sm:pt-28 lg:px-10">

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

          <div className="max-w-2xl">

            <div className="flex items-center gap-3">

              <span
                className="h-[2px] w-10 rounded-full"
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

            <h2
              className="
                mt-6
                text-3xl
                font-bold
                leading-tight
                tracking-[-0.04em]
                sm:text-4xl
                lg:text-[48px]
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

            <p
              className="
                mt-5
                max-w-xl
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


          {/* View all */}

          <Link
            to="/courses"
            className="
              inline-flex
              w-fit
              shrink-0
              items-center
              rounded-xl
              border
              bg-white
              px-5
              py-3
              text-xs
              font-semibold
              transition-all
              hover:-translate-y-0.5
              hover:shadow-md
            "
            style={{
              borderColor: "rgba(21,18,31,0.09)",
              color: C.ink,
            }}
          >
            View all courses
            <span className="ml-2">→</span>
          </Link>

        </div>

      </div>


      {/* =====================================================
          AUTO SCROLLING COURSES
      ===================================================== */}

      <div
        className="
          relative
          w-full
          overflow-hidden
          pb-24
          sm:pb-28
        "
      >

        {/* Left fade */}

        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            z-10
            h-full
            w-12
            sm:w-24
          "
          style={{
            background:
              `linear-gradient(to right, ${C.bg}, transparent)`,
          }}
        />

        {/* Right fade */}

        <div
          className="
            pointer-events-none
            absolute
            right-0
            top-0
            z-10
            h-full
            w-12
            sm:w-24
          "
          style={{
            background:
              `linear-gradient(to left, ${C.bg}, transparent)`,
          }}
        />


        {/* Moving track */}

        <div
          className="
            flex
            w-max
            gap-6
            pl-6
            sm:gap-7
            sm:pl-8
            lg:pl-10
          "
          style={{
            animation: "smartLmsCourseScroll 38s linear infinite",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.animationPlayState = "paused";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animationPlayState = "running";
          }}
        >

          {scrollingCourses.map((course, index) => (
            <CourseCard
              key={`${course.id}-${index}`}
              course={course}
            />
          ))}

        </div>

      </div>


      {/* Animation */}

      <style>{`
        @keyframes smartLmsCourseScroll {

          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(calc(-50% - 12px));
          }

        }

        @media (min-width: 640px) {

          @keyframes smartLmsCourseScroll {

            0% {
              transform: translateX(0);
            }

            100% {
              transform: translateX(calc(-50% - 14px));
            }

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

