import {
  BookOpen,
  Clock3,
  ArrowRight,
  Play,
  CheckCircle2,
  Flame,
  Crown,
  Crosshair,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function MyCourses({ courses = [] }) {
  const navigate = useNavigate();

  // =====================================================
  // VIEW ALL COURSES
  // =====================================================

  const handleViewAll = () => {
    navigate("/courses");
  };

  // =====================================================
  // OPEN COURSE
  // =====================================================

  const handleOpenCourse = (course) => {
    if (!course?._id) {
      toast.error("Course information is unavailable.");
      return;
    }

    navigate(`/courses/${course._id}/learn`);
  };

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (courses.length === 0) {
    return (
      <section
        className="
          relative
          min-w-0
          overflow-hidden
          rounded-[28px]
          border
          border-zinc-800
          bg-[#090909]
          shadow-2xl
        "
      >
        {/* CINEMATIC GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-red-600/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            -left-24
            h-64
            w-64
            rounded-full
            bg-orange-500/5
            blur-3xl
          "
        />

        {/* HEADER */}

        <div
          className="
            relative
            flex
            items-center
            justify-between
            border-b
            border-zinc-800
            px-5
            py-5
            sm:px-7
          "
        >
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Crown
                size={15}
                className="text-red-500"
              />

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.25em]
                  text-red-500
                "
              >
                The Collection
              </span>
            </div>

            <h2
              className="
                text-lg
                font-black
                uppercase
                tracking-tight
                text-white
                sm:text-xl
              "
            >
              My Courses
            </h2>

            <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
              Your missions in progress
            </p>
          </div>

          <button
            type="button"
            onClick={handleViewAll}
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              border-zinc-700
              bg-zinc-900
              px-3
              py-2
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-zinc-300
              transition
              hover:border-red-600
              hover:bg-red-600/10
              hover:text-red-500
              sm:px-4
            "
          >
            View all
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* EMPTY STATE */}

        <div
          className="
            relative
            flex
            min-h-[320px]
            flex-col
            items-center
            justify-center
            px-5
            py-12
            text-center
          "
        >
          {/* TARGET */}

          <div
            className="
              relative
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border
              border-red-600/30
              bg-red-600/5
              shadow-[0_0_50px_rgba(220,38,38,0.12)]
            "
          >
            <div
              className="
                absolute
                inset-2
                rounded-full
                border
                border-red-600/20
              "
            />

            <Crosshair
              size={30}
              className="text-red-500"
            />
          </div>

          <h3
            className="
              mt-6
              text-xl
              font-black
              uppercase
              tracking-tight
              text-white
            "
          >
            No missions assigned
          </h3>

          <p
            className="
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-zinc-500
            "
          >
            Choose your next mission. Build your skills.
            Become the one they call when it matters.
          </p>

          <button
            type="button"
            onClick={handleViewAll}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-red-600
              px-5
              py-3
              text-sm
              font-black
              uppercase
              tracking-wide
              text-white
              shadow-lg
              shadow-red-900/30
              transition
              hover:bg-red-500
              hover:shadow-red-600/20
              active:scale-[0.98]
            "
          >
            Choose Mission
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    );
  }

  // =====================================================
  // COURSES
  // =====================================================

  return (
    <section
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-zinc-800
        bg-[#090909]
        shadow-2xl
      "
    >
      {/* =================================================
          BACKGROUND CINEMATIC GLOW
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-red-600/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -left-32
          h-80
          w-80
          rounded-full
          bg-orange-600/5
          blur-3xl
        "
      />

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          relative
          flex
          items-center
          justify-between
          border-b
          border-zinc-800
          px-5
          py-5
          sm:px-7
        "
      >
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Flame
              size={14}
              className="text-red-500"
            />

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.3em]
                text-red-500
              "
            >
              Active Missions
            </span>
          </div>

          <h2
            className="
              text-lg
              font-black
              uppercase
              tracking-tight
              text-white
              sm:text-xl
            "
          >
            My Courses
          </h2>

          <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
            Every course is another mission.
          </p>
        </div>

        <button
          type="button"
          onClick={handleViewAll}
          className="
            group
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-zinc-700
            bg-zinc-900
            px-3
            py-2
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-zinc-300
            transition
            hover:border-red-600
            hover:bg-red-600/10
            hover:text-red-500
            sm:px-4
          "
        >
          All missions

          <ArrowRight
            size={14}
            className="
              transition-transform
              group-hover:translate-x-1
            "
          />
        </button>
      </div>

      {/* =================================================
          COURSE GRID
      ================================================= */}

      <div
        className="
          relative
          grid
          grid-cols-1
          divide-y
          divide-zinc-800
          xl:grid-cols-3
          xl:divide-x
          xl:divide-y-0
        "
      >
        {courses.map((course, index) => {
          const title =
            course.courseTitle ||
            course.title ||
            "Untitled Course";

          const instructor =
            course.instructor?.name ||
            "Smart LMS Instructor";

          const category =
            course.category ||
            "Course";

          const level =
            course.courseLevel ||
            "Beginner";

          const progress = Math.min(
            Math.max(
              Number(course.progress ?? 0),
              0
            ),
            100
          );

          const completedLessons = Math.max(
            Number(course.completedLessons ?? 0),
            0
          );

          const totalLessons = Math.max(
            Number(course.totalLessons ?? 0),
            0
          );

          const thumbnail =
            course.courseThumbnail?.url ||
            course.thumbnail ||
            "";

          const isCompleted =
            progress >= 100;

          return (
            <div
              key={course._id}
              className="
                group
                relative
                p-5
                transition
                duration-300
                hover:bg-white/[0.02]
                sm:p-6
              "
            >
              {/* SIDE RED LINE */}

              <div
                className="
                  absolute
                  left-0
                  top-0
                  h-full
                  w-[2px]
                  origin-top
                  scale-y-0
                  bg-red-600
                  transition-transform
                  duration-500
                  group-hover:scale-y-100
                "
              />

              {/* =================================================
                  COURSE VISUAL
              ================================================= */}

              <div
                className="
                  relative
                  h-36
                  overflow-hidden
                  rounded-2xl
                  border
                  border-zinc-800
                  bg-zinc-900
                  shadow-xl
                "
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={title}
                    className="
                      h-full
                      w-full
                      object-cover
                      opacity-80
                      grayscale-[15%]
                      transition
                      duration-700
                      group-hover:scale-110
                      group-hover:opacity-100
                    "
                  />
                ) : (
                  <>
                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-br
                        from-zinc-900
                        via-red-950
                        to-black
                      "
                    />

                    <div
                      className="
                        absolute
                        -right-10
                        -top-10
                        h-32
                        w-32
                        rounded-full
                        bg-red-600/10
                        blur-2xl
                      "
                    />

                    <div
                      className="
                        absolute
                        -bottom-10
                        -left-10
                        h-32
                        w-32
                        rounded-full
                        bg-orange-600/10
                        blur-2xl
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <div
                        className="
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-red-500/30
                          bg-black/60
                          text-red-500
                          shadow-[0_0_30px_rgba(220,38,38,0.2)]
                        "
                      >
                        <BookOpen size={23} />
                      </div>
                    </div>
                  </>
                )}

                {/* CINEMATIC OVERLAY */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-black/10
                    to-black/20
                  "
                />

                {/* MISSION NUMBER */}

                <div
                  className="
                    absolute
                    bottom-3
                    left-3
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.25em]
                    text-white/40
                  "
                >
                  Mission {String(index + 1).padStart(2, "0")}
                </div>

                {/* LEVEL */}

                <span
                  className="
                    absolute
                    left-3
                    top-3
                    rounded-md
                    border
                    border-white/10
                    bg-black/60
                    px-2
                    py-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-white
                    backdrop-blur-md
                  "
                >
                  {level}
                </span>

                {/* COMPLETED */}

                {isCompleted && (
                  <span
                    className="
                      absolute
                      right-3
                      top-3
                      inline-flex
                      items-center
                      gap-1
                      rounded-md
                      border
                      border-green-500/30
                      bg-green-950/80
                      px-2
                      py-1
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-green-400
                      backdrop-blur-md
                    "
                  >
                    <CheckCircle2 size={11} />
                    Complete
                  </span>
                )}
              </div>

              {/* =================================================
                  CATEGORY
              ================================================= */}

              <div className="mt-5 flex items-center gap-2">
                <span className="h-px w-5 bg-red-600" />

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.25em]
                    text-red-500
                  "
                >
                  {category}
                </p>
              </div>

              {/* =================================================
                  TITLE
              ================================================= */}

              <h3
                className="
                  mt-2
                  line-clamp-1
                  text-base
                  font-black
                  uppercase
                  tracking-tight
                  text-white
                "
                title={title}
              >
                {title}
              </h3>

              {/* =================================================
                  SUBTITLE
              ================================================= */}

              {course.subTitle && (
                <p
                  className="
                    mt-1
                    line-clamp-1
                    text-xs
                    text-zinc-500
                  "
                >
                  {course.subTitle}
                </p>
              )}

              {/* =================================================
                  INSTRUCTOR
              ================================================= */}

              <p className="mt-2 text-xs text-zinc-600">
                Operated by{" "}
                <span className="text-zinc-400">
                  {instructor}
                </span>
              </p>

              {/* =================================================
                  PROGRESS
              ================================================= */}

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-zinc-600
                    "
                  >
                    Mission Progress
                  </span>

                  <span
                    className="
                      text-xs
                      font-black
                      text-red-500
                    "
                  >
                    {progress}%
                  </span>
                </div>

                <div
                  className="
                    relative
                    h-1.5
                    overflow-hidden
                    rounded-full
                    bg-zinc-800
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-red-700
                      via-red-500
                      to-orange-500
                      shadow-[0_0_10px_rgba(239,68,68,0.4)]
                      transition-all
                      duration-700
                    "
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* =================================================
                  META
              ================================================= */}

              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-between
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wider
                  text-zinc-600
                "
              >
                <span>
                  {completedLessons}/{totalLessons} lessons
                </span>

                <span className="inline-flex items-center gap-1">
                  <Clock3 size={11} />

                  {isCompleted
                    ? "Mission complete"
                    : progress > 0
                    ? "In operation"
                    : "Awaiting start"}
                </span>
              </div>

              {/* =================================================
                  ACTION BUTTON
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  handleOpenCourse(course)
                }
                className="
                  group/btn
                  mt-5
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-zinc-700
                  bg-zinc-900
                  px-4
                  py-3
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-zinc-300
                  transition
                  duration-300
                  hover:border-red-600
                  hover:bg-red-600
                  hover:text-white
                  hover:shadow-[0_0_25px_rgba(220,38,38,0.18)]
                  active:scale-[0.98]
                "
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2
                      size={14}
                      className="transition-transform group-hover/btn:scale-110"
                    />

                    Review Mission
                  </>
                ) : (
                  <>
                    <Play
                      size={13}
                      fill="currentColor"
                      className="transition-transform group-hover/btn:scale-110"
                    />

                    {progress > 0
                      ? "Continue Mission"
                      : "Begin Mission"}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div
        className="
          relative
          flex
          items-center
          justify-center
          border-t
          border-zinc-800
          bg-black/20
          px-5
          py-3
        "
      >
        <p
          className="
            text-[9px]
            font-bold
            uppercase
            tracking-[0.3em]
            text-zinc-700
          "
        >
          Stay focused • Complete the mission • Become OG
        </p>
      </div>
    </section>
  );
}

export default MyCourses;