import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRight,
  BookOpen,
  Crown,
  Eye,
  Flame,
  LockKeyhole,
  Play,
  ScrollText,
  Sparkles,
  Sword,
  Trophy,
} from "lucide-react";

import api from "../../services/api";

/* ============================================================
   CINEMATIC MEDIEVAL PALETTE
============================================================ */

const C = {
  bg: "#08090B",
  surface: "#101114",
  surface2: "#15171B",
  stone: "#1B1D21",

  gold: "#C9A45C",
  goldLight: "#E7C982",
  goldDark: "#80632F",

  crimson: "#8F2028",
  crimsonLight: "#C43A42",

  ink: "#F4EFE5",
  muted: "#9A968C",
  dim: "#65625C",

  border: "rgba(201,164,92,0.18)",
};

/* ============================================================
   COURSE ACCENT COLORS
============================================================ */

const COURSE_COLORS = [
  "#C9A45C",
  "#8F2028",
  "#7D8794",
  "#A67C52",
  "#B4A06A",
];

/* ============================================================
   COURSE CARD
============================================================ */

function CourseCard({ course, index }) {
  const accent = COURSE_COLORS[index % COURSE_COLORS.length];

  return (
    <Link
      to={`/courses/${course._id}`}
      className="
        got-course-card
        group
        relative
        flex
        h-[500px]
        w-[330px]
        shrink-0
        flex-col
        overflow-hidden
        border
        sm:w-[350px]
        lg:w-[365px]
      "
      style={{
        borderColor: "rgba(201,164,92,0.16)",
        background:
          "linear-gradient(145deg, #15171B 0%, #0D0F12 55%, #090A0C 100%)",
      }}
    >
      {/* ======================================================
          AMBIENT CARD GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-52
          w-52
          rounded-full
          opacity-0
          blur-3xl
          transition-all
          duration-700
          group-hover:opacity-30
        "
        style={{
          backgroundColor: accent,
        }}
      />

      {/* ======================================================
          TOP GOLD LINE
      ====================================================== */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          z-30
          h-[2px]
          origin-left
          scale-x-0
          transition-transform
          duration-700
          group-hover:scale-x-100
        "
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      {/* ======================================================
          COURSE VISUAL
      ====================================================== */}

      <div
        className="
          relative
          h-[205px]
          shrink-0
          overflow-hidden
        "
        style={{
          background: `
            radial-gradient(circle at 80% 20%, ${accent}22, transparent 35%),
            linear-gradient(135deg, #191B20, #090A0C)
          `,
        }}
      >
        {/* Decorative rings */}

        <div
          className="
            absolute
            -right-16
            -top-16
            h-44
            w-44
            rounded-full
            border
            opacity-20
            transition-all
            duration-700
            group-hover:scale-125
            group-hover:rotate-12
          "
          style={{
            borderColor: accent,
          }}
        />

        <div
          className="
            absolute
            -right-8
            -top-8
            h-28
            w-28
            rounded-full
            border
            opacity-10
            transition-all
            duration-700
            group-hover:scale-125
          "
          style={{
            borderColor: C.gold,
          }}
        />

        {/* Corner ornament */}

        <div
          className="
            absolute
            left-5
            top-5
            h-8
            w-8
            border-l
            border-t
            opacity-60
          "
          style={{
            borderColor: C.gold,
          }}
        />

        <div
          className="
            absolute
            bottom-5
            right-5
            h-8
            w-8
            border-b
            border-r
            opacity-60
          "
          style={{
            borderColor: C.gold,
          }}
        />

        {/* Category */}

        <div className="absolute left-6 top-6 z-20">
          <div
            className="
              flex
              items-center
              gap-2
              font-mono
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.22em]
            "
            style={{
              color: C.goldLight,
            }}
          >
            <Crown size={13} strokeWidth={1.5} />

            {course.category || "The Realm"}
          </div>
        </div>

        {/* Thumbnail */}

        {course.courseThumbnail?.url ? (
          <>
            <img
              src={course.courseThumbnail.url}
              alt={course.courseTitle}
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                opacity-65
                grayscale-[15%]
                transition-all
                duration-700
                group-hover:scale-110
                group-hover:opacity-80
              "
            />

            {/* Cinematic image overlay */}

            <div
              className="
                absolute
                inset-0
              "
              style={{
                background: `
                  linear-gradient(
                    to bottom,
                    rgba(8,9,11,0.25),
                    rgba(8,9,11,0.65) 65%,
                    rgba(8,9,11,1)
                  )
                `,
              }}
            />

            {/* Image color wash */}

            <div
              className="
                absolute
                inset-0
                opacity-20
                mix-blend-overlay
              "
              style={{
                backgroundColor: accent,
              }}
            />
          </>
        ) : (
          <>
            {/* Sword emblem */}

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="
                  relative
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  border
                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:rotate-6
                "
                style={{
                  borderColor: `${C.gold}55`,
                  background: `radial-gradient(circle, ${accent}18, transparent 70%)`,
                  boxShadow: `0 0 45px ${accent}18`,
                }}
              >
                <Sword
                  size={38}
                  strokeWidth={1.2}
                  style={{
                    color: C.goldLight,
                  }}
                />

                <div
                  className="
                    absolute
                    inset-3
                    rounded-full
                    border
                    border-dashed
                    opacity-30
                  "
                  style={{
                    borderColor: C.gold,
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Bottom visual title */}

        <div className="absolute bottom-5 left-6 right-6 z-20">
          <div className="flex items-center gap-2">
            <span
              className="h-[1px] w-8"
              style={{
                backgroundColor: C.gold,
              }}
            />

            <span
              className="
                font-mono
                text-[9px]
                uppercase
                tracking-[0.2em]
              "
              style={{
                color: C.gold,
              }}
            >
              Knowledge is power
            </span>
          </div>
        </div>

        {/* Scan effect */}

        <div className="got-card-scan pointer-events-none absolute inset-0 z-20" />
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-5">
        {/* Level + realm */}

        <div className="flex items-center justify-between">
          <span
            className="
              inline-flex
              items-center
              gap-1.5
              border
              px-3
              py-1.5
              font-mono
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.15em]
            "
            style={{
              borderColor: `${accent}45`,
              backgroundColor: `${accent}0D`,
              color: accent,
            }}
          >
            <ShieldIcon />

            {course.courseLevel || "Beginner"}
          </span>

          <span
            className="
              flex
              items-center
              gap-1.5
              text-[10px]
              uppercase
              tracking-[0.15em]
            "
            style={{
              color: C.dim,
            }}
          >
            <ScrollText size={12} />

            Course
          </span>
        </div>

        {/* Title */}

        <h3
          className="
            mt-4
            line-clamp-2
            min-h-[58px]
            text-[19px]
            font-semibold
            leading-7
            tracking-[-0.02em]
            transition-colors
            duration-300
            group-hover:text-[#E7C982]
          "
          style={{
            color: C.ink,
          }}
        >
          {course.courseTitle}
        </h3>

        {/* Decorative divider */}

        <div className="mt-3 flex items-center gap-2">
          <span
            className="h-[1px] w-10"
            style={{
              backgroundColor: C.gold,
            }}
          />

          <span
            className="
              h-1
              w-1
              rotate-45
            "
            style={{
              backgroundColor: C.gold,
            }}
          />

          <span
            className="h-[1px] flex-1"
            style={{
              backgroundColor: "rgba(201,164,92,0.10)",
            }}
          />
        </div>

        {/* Description */}

        <p
          className="
            mt-4
            line-clamp-3
            h-[72px]
            text-sm
            leading-6
          "
          style={{
            color: C.muted,
          }}
        >
          {course.description ||
            "Sharpen your skills, master practical concepts and forge your path toward becoming a better developer."}
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
            borderColor: "rgba(201,164,92,0.12)",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Price */}

            <div>
              <div className="flex items-baseline gap-2">
                <p
                  className="text-xl font-bold"
                  style={{
                    color:
                      course.coursePrice === 0
                        ? "#D7B96E"
                        : C.ink,
                  }}
                >
                  {course.coursePrice === 0
                    ? "FREE"
                    : `₹${course.coursePrice}`}
                </p>

                {course.coursePrice === 0 && (
                  <Sparkles
                    size={13}
                    style={{
                      color: C.gold,
                    }}
                  />
                )}
              </div>

              <p
                className="
                  mt-1
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.15em]
                "
                style={{
                  color: C.dim,
                }}
              >
                Lifetime access
              </p>
            </div>

            {/* View button */}

            <div
              className="
                got-view-button
                flex
                items-center
                gap-2
                border
                px-4
                py-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.12em]
                transition-all
                duration-300
                group-hover:gap-3
              "
              style={{
                borderColor: "rgba(201,164,92,0.28)",
                color: C.goldLight,
                background:
                  "linear-gradient(135deg, rgba(201,164,92,0.10), rgba(201,164,92,0.03))",
              }}
            >
              Enter

              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          HOVER LIGHT SWEEP
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[100%]
          top-0
          z-40
          h-full
          w-[50%]
          rotate-[15deg]
          bg-gradient-to-r
          from-transparent
          via-white/[0.06]
          to-transparent
          transition-all
          duration-1000
          group-hover:left-[150%]
        "
      />
    </Link>
  );
}

/* ============================================================
   SMALL SHIELD ICON
============================================================ */

function ShieldIcon() {
  return (
    <span
      className="
        inline-block
        h-1.5
        w-1.5
        rotate-45
      "
      style={{
        backgroundColor: "currentColor",
      }}
    />
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
   EMBERS
============================================================ */

function Embers() {
  const embers = Array.from({ length: 18 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {embers.map((_, index) => (
        <span
          key={index}
          className="got-ember absolute rounded-full"
          style={{
            left: `${(index * 17) % 100}%`,
            bottom: `${(index * 13) % 20}%`,
            animationDelay: `${(index % 7) * 0.7}s`,
            animationDuration: `${5 + (index % 5)}s`,
          }}
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
        got-courses-section
        relative
        overflow-hidden
        border-t
      "
      style={{
        backgroundColor: C.bg,
        borderColor: "rgba(201,164,92,0.10)",
      }}
    >
      {/* ======================================================
          BACKGROUND ATMOSPHERE
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Radial light */}

        <div
          className="
            absolute
            left-1/2
            top-0
            h-[500px]
            w-[800px]
            -translate-x-1/2
            rounded-full
            opacity-20
            blur-[120px]
          "
          style={{
            background:
              "radial-gradient(circle, rgba(201,164,92,0.16), transparent 65%)",
          }}
        />

        {/* Crimson glow */}

        <div
          className="
            absolute
            -right-40
            top-[30%]
            h-[400px]
            w-[400px]
            rounded-full
            opacity-20
            blur-[120px]
          "
          style={{
            backgroundColor: C.crimson,
          }}
        />

        {/* Stone texture */}

        <div className="got-stone-texture absolute inset-0 opacity-30" />

        {/* Vertical atmospheric lines */}

        <div
          className="
            absolute
            left-[12%]
            top-0
            h-full
            w-px
          "
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(201,164,92,0.08), transparent)",
          }}
        />

        <div
          className="
            absolute
            right-[12%]
            top-0
            h-full
            w-px
          "
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(201,164,92,0.08), transparent)",
          }}
        />
      </div>

      <Embers />

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1280px]
          px-6
          pb-12
          pt-24
          sm:px-8
          sm:pb-16
          sm:pt-28
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
          {/* LEFT */}

          <div className="max-w-[760px]">
            {/* Eyebrow */}

            <div className="flex items-center gap-3">
              <Sword
                size={18}
                strokeWidth={1.3}
                style={{
                  color: C.gold,
                }}
              />

              <span
                className="
                  font-mono
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                "
                style={{
                  color: C.gold,
                }}
              >
                The learning realm
              </span>

              <span
                className="h-px w-14"
                style={{
                  backgroundColor: "rgba(201,164,92,0.35)",
                }}
              />
            </div>

            {/* Heading */}

            <h2
              className="
                mt-6
                text-4xl
                font-semibold
                leading-[1.04]
                tracking-[-0.045em]
                sm:text-5xl
                lg:text-[58px]
              "
              style={{
                color: C.ink,
              }}
            >
              Choose your path.
              <span
                className="block"
                style={{
                  color: C.goldLight,
                  textShadow:
                    "0 0 30px rgba(201,164,92,0.18)",
                }}
              >
                Forge your future.
              </span>
            </h2>

            {/* Divider */}

            <div className="mt-7 flex items-center gap-3">
              <div
                className="h-px w-20"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #C9A45C)",
                }}
              />

              <div
                className="
                  h-2
                  w-2
                  rotate-45
                "
                style={{
                  backgroundColor: C.gold,
                  boxShadow:
                    "0 0 15px rgba(201,164,92,0.5)",
                }}
              />

              <div
                className="h-px w-8"
                style={{
                  backgroundColor: C.goldDark,
                }}
              />
            </div>

            {/* Description */}

            <p
              className="
                mt-6
                max-w-[650px]
                text-sm
                leading-7
                sm:text-base
              "
              style={{
                color: C.muted,
              }}
            >
              Enter a collection of carefully forged courses.
              Master practical skills, sharpen your craft and
              build the knowledge required to claim your place
              in the world of technology.
            </p>
          </div>

          {/* VIEW ALL */}

          <div className="shrink-0 lg:pb-1">
            <Link
              to="/courses"
              className="
                got-view-all
                group
                relative
                inline-flex
                h-12
                items-center
                justify-center
                gap-3
                overflow-hidden
                border
                px-6
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                transition-all
                duration-300
                hover:-translate-y-1
              "
              style={{
                borderColor: "rgba(201,164,92,0.30)",
                color: C.goldLight,
                background:
                  "linear-gradient(135deg, rgba(201,164,92,0.09), rgba(201,164,92,0.02))",
              }}
            >
              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/[0.08]
                  to-transparent
                  transition-transform
                  duration-700
                  group-hover:translate-x-full
                "
              />

              <Trophy size={14} strokeWidth={1.5} />

              View all courses

              <ArrowRight
                size={15}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="relative z-10 flex justify-center pb-28">
          <div
            className="
              flex
              items-center
              gap-4
              border
              px-6
              py-4
            "
            style={{
              borderColor: "rgba(201,164,92,0.15)",
              backgroundColor: "rgba(201,164,92,0.03)",
            }}
          >
            <div
              className="
                h-5
                w-5
                animate-spin
                rounded-full
                border-2
                border-transparent
              "
              style={{
                borderTopColor: C.gold,
                borderRightColor: `${C.gold}55`,
              }}
            />

            <span
              className="
                font-mono
                text-[10px]
                uppercase
                tracking-[0.15em]
              "
              style={{
                color: C.muted,
              }}
            >
              Summoning courses...
            </span>
          </div>
        </div>
      )}

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {!loading && courses.length === 0 && (
        <div className="relative z-10 px-6 pb-28 text-center">
          <div
            className="
              mx-auto
              max-w-md
              border
              px-6
              py-14
            "
            style={{
              borderColor: "rgba(201,164,92,0.15)",
              background:
                "linear-gradient(145deg, #111317, #090A0C)",
            }}
          >
            <div
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                border
              "
              style={{
                borderColor: "rgba(201,164,92,0.25)",
              }}
            >
              <BookOpen
                size={30}
                strokeWidth={1}
                style={{
                  color: C.gold,
                }}
              />
            </div>

            <h3
              className="mt-6 text-xl font-semibold"
              style={{
                color: C.ink,
              }}
            >
              The realm awaits its courses
            </h3>

            <p
              className="mt-3 text-sm leading-6"
              style={{
                color: C.muted,
              }}
            >
              New courses will appear here once instructors
              forge and publish them.
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
            z-10
            w-full
            overflow-hidden
            pb-24
          "
        >
          {/* Left fade */}

          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              z-30
              w-16
              sm:w-28
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
              z-30
              w-16
              sm:w-28
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

          {/* Track */}

          <div
            className="
              smart-lms-course-track
              flex
              w-max
              flex-nowrap
            "
          >
            <CourseSet courses={courses} />
            <CourseSet courses={courses} />
          </div>
        </div>
      )}

      {/* ======================================================
          BOTTOM DECLARATION
      ====================================================== */}

      {!loading && courses.length > 0 && (
        <div className="relative z-10 pb-20 text-center">
          <div className="mx-auto flex max-w-[600px] items-center justify-center gap-4 px-6">
            <span
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(201,164,92,0.25))",
              }}
            />

            <Flame
              size={16}
              strokeWidth={1.3}
              style={{
                color: C.gold,
              }}
            />

            <span
              className="
                font-mono
                text-[9px]
                uppercase
                tracking-[0.25em]
              "
              style={{
                color: C.dim,
              }}
            >
              Knowledge • Discipline • Mastery
            </span>

            <Flame
              size={16}
              strokeWidth={1.3}
              style={{
                color: C.gold,
              }}
              className="rotate-180"
            />

            <span
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(201,164,92,0.25))",
              }}
            />
          </div>
        </div>
      )}

      {/* ======================================================
          CINEMATIC CSS
      ====================================================== */}

      <style>{`
        /* ============================================
           COURSE TRACK
        ============================================ */

        .smart-lms-course-track {
          animation: smartLmsCourseScroll 55s linear infinite;
          will-change: transform;
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

        /* ============================================
           CARD
        ============================================ */

        .got-course-card {
          border-radius: 4px;
          box-shadow:
            0 15px 45px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.025);

          transition:
            transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 500ms ease,
            border-color 500ms ease;
        }

        .got-course-card:hover {
          transform:
            translateY(-14px)
            scale(1.015);

          border-color:
            rgba(201, 164, 92, 0.42) !important;

          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.55),
            0 0 40px rgba(201, 164, 92, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        /* ============================================
           CARD SCAN
        ============================================ */

        .got-card-scan {
          background:
            linear-gradient(
              to bottom,
              transparent,
              rgba(255,255,255,0.035),
              transparent
            );

          transform: translateY(-100%);
          transition: transform 900ms ease;
        }

        .got-course-card:hover .got-card-scan {
          transform: translateY(100%);
        }

        /* ============================================
           VIEW ALL
        ============================================ */

        .got-view-all:hover {
          box-shadow:
            0 15px 35px rgba(0, 0, 0, 0.35),
            0 0 25px rgba(201, 164, 92, 0.08);
        }

        /* ============================================
           STONE TEXTURE
        ============================================ */

        .got-stone-texture {
          background-image:
            linear-gradient(
              rgba(255,255,255,0.018) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.012) 1px,
              transparent 1px
            );

          background-size:
            45px 45px,
            45px 45px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 90%
            );
        }

        /* ============================================
           EMBERS
        ============================================ */

        .got-ember {
          width: 2px;
          height: 2px;
          background: #C9A45C;
          box-shadow:
            0 0 8px rgba(201,164,92,0.7),
            0 0 14px rgba(201,164,92,0.25);

          opacity: 0;

          animation:
            gotEmberRise
            linear
            infinite;
        }

        @keyframes gotEmberRise {
          0% {
            transform:
              translate3d(0, 0, 0)
              scale(0.6);
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
              translate3d(
                20px,
                -420px,
                0
              )
              scale(0);
            opacity: 0;
          }
        }

        /* ============================================
           REDUCED MOTION
        ============================================ */

        @media (prefers-reduced-motion: reduce) {
          .smart-lms-course-track {
            animation: none !important;
          }

          .got-course-card,
          .got-card-scan,
          .got-ember {
            animation: none !important;
            transition: none !important;
          }
        }

        /* ============================================
           MOBILE
        ============================================ */

        @media (max-width: 639px) {
          .smart-lms-course-track {
            animation-duration: 42s;
          }

          .got-course-card:hover {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </section>
  );
}

export default FeaturedCourses;