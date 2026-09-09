import {
  ArrowRight,
  BookOpen,
  Castle,
  CheckCircle2,
  Clock3,
  Crown,
  Feather,
  Play,
  Shield,
  Sparkles,
  Sword,
  Trophy,
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
          border-[#2a2925]
          bg-[#090b0d]
          shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        "
      >
        {/* =================================================
            MEDIEVAL BACKGROUND
        ================================================= */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Moon */}
          <div
            className="
              absolute
              right-10
              top-8
              h-24
              w-24
              rounded-full
              bg-[#d8e8ee]/10
              shadow-[0_0_50px_rgba(180,220,235,0.12)]
            "
          />

          <div
            className="
              absolute
              right-16
              top-14
              h-20
              w-20
              rounded-full
              bg-[#090b0d]
            "
          />

          {/* Ice glow */}
          <div
            className="
              absolute
              -left-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-sky-500/8
              blur-3xl
            "
          />

          {/* Gold glow */}
          <div
            className="
              absolute
              -bottom-24
              -right-24
              h-72
              w-72
              rounded-full
              bg-amber-500/8
              blur-3xl
            "
          />

          {/* Mountains */}
          <div
            className="
              absolute
              bottom-0
              left-0
              h-32
              w-full
              bg-gradient-to-t
              from-black
              via-[#111417]/90
              to-transparent
              opacity-90
            "
          />

          {/* Castle silhouette */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-20">
            <div className="relative h-20 w-40 bg-[#151719]">
              <div className="absolute -left-5 bottom-0 h-28 w-8 bg-[#151719]" />
              <div className="absolute -right-5 bottom-0 h-28 w-8 bg-[#151719]" />

              <div className="absolute left-1/2 top-0 h-32 w-10 -translate-x-1/2 bg-[#151719]" />

              <div className="absolute -left-5 top-0 h-3 w-8 bg-[#151719]" />
              <div className="absolute right-[-20px] top-0 h-3 w-8 bg-[#151719]" />
              <div className="absolute left-1/2 top-0 h-3 w-10 -translate-x-1/2 bg-[#151719]" />
            </div>
          </div>

          {/* Snow particles */}
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-sky-100/30"
              style={{
                left: `${8 + i * 7}%`,
                top: `${12 + ((i * 17) % 65)}%`,
                animation: `myCoursesSnow ${4 + (i % 4)}s linear infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            relative
            z-10
            flex
            items-center
            justify-between
            border-b
            border-[#292a27]
            px-5
            py-5
            sm:px-7
          "
        >
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Feather
                size={14}
                className="text-sky-300"
              />

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.3em]
                  text-sky-300
                "
              >
                The Great Library
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
              The knowledge within your realm
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
              border-[#444039]
              bg-[#121416]/80
              px-3
              py-2
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-zinc-300
              transition
              hover:border-amber-500/50
              hover:bg-amber-500/10
              hover:text-amber-300
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

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        <div
          className="
            relative
            z-10
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
          {/* Shield */}
          <div
            className="
              relative
              flex
              h-24
              w-24
              items-center
              justify-center
            "
          >
            <div
              className="
                absolute
                inset-0
                rounded-full
                border
                border-amber-400/10
                bg-amber-400/5
                shadow-[0_0_60px_rgba(212,175,55,0.08)]
              "
            />

            <div
              className="
                absolute
                inset-3
                rounded-full
                border
                border-sky-300/10
              "
            />

            <Shield
              size={38}
              strokeWidth={1.3}
              className="text-amber-300"
            />

            <Sparkles
              size={14}
              className="
                absolute
                right-0
                top-2
                animate-pulse
                text-sky-300
              "
            />
          </div>

          <h3
            className="
              mt-6
              text-xl
              font-black
              uppercase
              tracking-[0.08em]
              text-white
            "
          >
            No courses in your realm
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
            The path awaits. Choose a course, sharpen your
            skills, and begin your journey toward mastery.
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
              border
              border-amber-500/40
              bg-amber-500/10
              px-5
              py-3
              text-sm
              font-black
              uppercase
              tracking-wide
              text-amber-300
              shadow-[0_0_25px_rgba(212,175,55,0.08)]
              transition
              hover:border-amber-400
              hover:bg-amber-400
              hover:text-black
              active:scale-[0.98]
            "
          >
            Enter the Library
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Bottom realm line */}
        <div
          className="
            absolute
            bottom-0
            left-0
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-amber-400/40
            to-transparent
          "
        />

        <style>{`
          @keyframes myCoursesSnow {
            0% {
              transform: translateY(-20px);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            100% {
              transform: translateY(340px);
              opacity: 0;
            }
          }
        `}</style>
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
        border-[#2a2925]
        bg-[#090b0d]
        shadow-[0_25px_80px_rgba(0,0,0,0.45)]
      "
    >
      {/* =================================================
          MEDIEVAL SCENE
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Ice glow */}
        <div
          className="
            absolute
            -left-32
            -top-32
            h-80
            w-80
            rounded-full
            bg-sky-500/7
            blur-3xl
          "
        />

        {/* Gold glow */}
        <div
          className="
            absolute
            -right-32
            -top-32
            h-80
            w-80
            rounded-full
            bg-amber-500/7
            blur-3xl
          "
        />

        {/* Moon */}
        <div
          className="
            absolute
            right-[12%]
            top-[-35px]
            h-32
            w-32
            rounded-full
            bg-slate-100/5
            shadow-[0_0_70px_rgba(200,220,230,0.08)]
          "
        />

        {/* Castle silhouette */}
        <div
          className="
            absolute
            bottom-0
            right-[8%]
            h-28
            w-44
            opacity-[0.08]
          "
        >
          <div className="absolute bottom-0 left-0 h-20 w-12 bg-slate-300" />
          <div className="absolute bottom-0 right-0 h-24 w-12 bg-slate-300" />
          <div className="absolute bottom-0 left-1/2 h-28 w-14 -translate-x-1/2 bg-slate-300" />

          <div className="absolute left-0 top-0 h-3 w-12 bg-slate-300" />
          <div className="absolute right-0 top-0 h-3 w-12 bg-slate-300" />
          <div className="absolute left-1/2 top-0 h-3 w-14 -translate-x-1/2 bg-slate-300" />
        </div>

        {/* Fog */}
        <div
          className="
            absolute
            bottom-0
            left-0
            h-20
            w-full
            bg-gradient-to-t
            from-slate-400/[0.04]
            to-transparent
            blur-xl
          "
        />

        {/* Snow */}
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-sky-100/20"
            style={{
              left: `${3 + ((i * 13) % 94)}%`,
              top: `${5 + ((i * 19) % 80)}%`,
              animation: `myCoursesSnow ${5 + (i % 5)}s linear infinite`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          items-center
          justify-between
          border-b
          border-[#292a27]
          px-5
          py-5
          sm:px-7
        "
      >
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Crown
              size={14}
              className="text-amber-300"
            />

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.3em]
                text-amber-300
              "
            >
              Your Realm
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
            Knowledge earned. Skills forged.
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
            border-[#444039]
            bg-[#121416]/80
            px-3
            py-2
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-zinc-300
            transition
            hover:border-amber-500/50
            hover:bg-amber-500/10
            hover:text-amber-300
            sm:px-4
          "
        >
          All courses

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
          z-10
          grid
          grid-cols-1
          divide-y
          divide-[#292a27]
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
                duration-500
                hover:bg-white/[0.018]
                sm:p-6
              "
            >
              {/* =================================================
                  GOLD SIDE LINE
              ================================================= */}

              <div
                className="
                  absolute
                  left-0
                  top-0
                  h-full
                  w-[2px]
                  origin-top
                  scale-y-0
                  bg-gradient-to-b
                  from-amber-300
                  via-amber-500
                  to-sky-400
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
                  border-[#302f2b]
                  bg-[#111315]
                  shadow-[0_15px_40px_rgba(0,0,0,0.35)]
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
                      opacity-75
                      transition
                      duration-700
                      group-hover:scale-110
                      group-hover:opacity-95
                    "
                  />
                ) : (
                  <>
                    {/* Mountain background */}
                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-br
                        from-[#15191c]
                        via-[#101518]
                        to-[#070809]
                      "
                    />

                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        h-16
                        w-28
                        rotate-[-18deg]
                        bg-slate-500/10
                      "
                    />

                    <div
                      className="
                        absolute
                        bottom-0
                        right-0
                        h-20
                        w-36
                        rotate-[16deg]
                        bg-slate-400/10
                      "
                    />

                    {/* Moon */}
                    <div
                      className="
                        absolute
                        right-5
                        top-4
                        h-9
                        w-9
                        rounded-full
                        bg-sky-100/10
                        shadow-[0_0_25px_rgba(180,220,240,0.1)]
                      "
                    />

                    {/* Castle */}
                    <div
                      className="
                        absolute
                        bottom-0
                        left-1/2
                        h-14
                        w-24
                        -translate-x-1/2
                        bg-[#171a1c]
                        opacity-80
                      "
                    >
                      <div className="absolute -left-3 bottom-0 h-20 w-5 bg-[#171a1c]" />
                      <div className="absolute -right-3 bottom-0 h-16 w-5 bg-[#171a1c]" />
                      <div className="absolute left-1/2 bottom-0 h-24 w-5 -translate-x-1/2 bg-[#171a1c]" />
                    </div>

                    {/* Course icon */}
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
                          border-amber-400/25
                          bg-black/60
                          text-amber-300
                          shadow-[0_0_35px_rgba(212,175,55,0.1)]
                          backdrop-blur-sm
                        "
                      >
                        <BookOpen size={23} />
                      </div>
                    </div>
                  </>
                )}

                {/* Medieval overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/85
                    via-black/20
                    to-black/25
                  "
                />

                {/* =================================================
                    COURSE NUMBER
                ================================================= */}

                <div
                  className="
                    absolute
                    bottom-3
                    left-3
                    flex
                    items-center
                    gap-1.5
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.25em]
                    text-white/45
                  "
                >
                  <Sword size={10} />
                  Quest {String(index + 1).padStart(2, "0")}
                </div>

                {/* =================================================
                    LEVEL
                ================================================= */}

                <span
                  className="
                    absolute
                    left-3
                    top-3
                    rounded-md
                    border
                    border-sky-200/10
                    bg-black/60
                    px-2
                    py-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-sky-100
                    backdrop-blur-md
                  "
                >
                  {level}
                </span>

                {/* =================================================
                    COMPLETED
                ================================================= */}

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
                      border-amber-400/30
                      bg-black/70
                      px-2
                      py-1
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-amber-300
                      backdrop-blur-md
                    "
                  >
                    <Trophy size={11} />
                    Mastered
                  </span>
                )}
              </div>

              {/* =================================================
                  CATEGORY
              ================================================= */}

              <div className="mt-5 flex items-center gap-2">
                <span
                  className="
                    h-px
                    w-5
                    bg-gradient-to-r
                    from-amber-400
                    to-sky-400
                  "
                />

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.25em]
                    text-amber-300
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
                Guided by{" "}
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
                    Journey Progress
                  </span>

                  <span
                    className="
                      text-xs
                      font-black
                      text-amber-300
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
                    bg-[#292a27]
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-sky-600
                      via-sky-400
                      to-amber-400
                      shadow-[0_0_12px_rgba(125,211,252,0.2)]
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
                    ? "Quest complete"
                    : progress > 0
                    ? "Journey underway"
                    : "Awaiting your blade"}
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
                  border-[#45423a]
                  bg-[#121416]
                  px-4
                  py-3
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-zinc-300
                  transition
                  duration-300
                  hover:border-amber-400/60
                  hover:bg-amber-400
                  hover:text-black
                  hover:shadow-[0_0_30px_rgba(212,175,55,0.12)]
                  active:scale-[0.98]
                "
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2
                      size={14}
                      className="
                        transition-transform
                        group-hover/btn:scale-110
                      "
                    />

                    Review the Chronicle
                  </>
                ) : (
                  <>
                    <Play
                      size={13}
                      fill="currentColor"
                      className="
                        transition-transform
                        group-hover/btn:scale-110
                      "
                    />

                    {progress > 0
                      ? "Continue the Quest"
                      : "Begin the Quest"}
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
          z-10
          flex
          items-center
          justify-center
          border-t
          border-[#292a27]
          bg-black/20
          px-5
          py-3
        "
      >
        <p
          className="
            flex
            items-center
            gap-2
            text-[9px]
            font-bold
            uppercase
            tracking-[0.3em]
            text-zinc-700
          "
        >
          <Castle size={11} />

          Learn • Master • Earn Your Place

          <Feather size={11} />
        </p>
      </div>

      <style>{`
        @keyframes myCoursesSnow {
          0% {
            transform: translateY(-30px);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          100% {
            transform: translateY(420px);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}

export default MyCourses;