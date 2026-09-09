import {
  Play,
  Clock3,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Flame,
  GraduationCap,
  ChevronRight,
  Trophy,
  Swords,
  Target,
  Zap,
  Crown,
  Shield,
  Castle,
  Feather,
  Snowflake,
  Mountain,
  ScrollText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// =====================================================
// CONTINUE LEARNING — GAME OF THRONES INSPIRED THEME
// =====================================================

function ContinueLearning({ courses = [] }) {
  const navigate = useNavigate();

  const course = courses[0];

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleViewAll = () => {
    navigate("/courses");
  };

  const handleContinueCourse = () => {
    if (!course?._id) {
      toast.error("Course information is unavailable.");
      return;
    }

    navigate(`/courses/${course._id}/learn`);
  };

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!course) {
    return (
      <section
        className="
          realm-card
          group
          relative
          min-w-0
          overflow-hidden
          rounded-[28px]
          border
          border-[#3b4145]
          bg-[#080b0d]
          shadow-2xl
          shadow-black/50
          transition-all
          duration-500
          hover:-translate-y-1
          hover:border-[#9b7a38]/60
          hover:shadow-[0_25px_80px_rgba(0,0,0,0.55)]
        "
      >
        {/* =================================================
            MEDIEVAL BACKGROUND
        ================================================= */}

        <div className="absolute inset-0 overflow-hidden">
          {/* Stone gradient */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-[#07090a]
              via-[#101416]
              to-[#15120d]
            "
          />

          {/* North blue glow */}
          <div
            className="
              absolute
              -left-24
              -top-24
              h-80
              w-80
              rounded-full
              bg-sky-500/[0.07]
              blur-[100px]
              transition-all
              duration-1000
              group-hover:scale-125
            "
          />

          {/* Royal gold glow */}
          <div
            className="
              absolute
              -bottom-32
              -right-24
              h-80
              w-80
              rounded-full
              bg-amber-500/[0.08]
              blur-[100px]
              transition-all
              duration-1000
              group-hover:scale-125
            "
          />

          {/* Stone texture */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.08]
            "
            style={{
              backgroundImage: `
                linear-gradient(
                  115deg,
                  transparent 0%,
                  rgba(255,255,255,0.06) 50%,
                  transparent 100%
                ),
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 31px,
                  rgba(255,255,255,0.035) 32px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 47px,
                  rgba(255,255,255,0.025) 48px
                )
              `,
            }}
          />

          {/* Mountain silhouette */}
          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              right-0
              h-32
              opacity-20
            "
            style={{
              clipPath:
                "polygon(0 100%,0 65%,12% 42%,21% 68%,34% 25%,46% 62%,58% 35%,72% 70%,83% 40%,100% 65%,100% 100%)",
              background:
                "linear-gradient(to top, #020405, #12181c)",
            }}
          />

          {/* Moon */}
          <div
            className="
              absolute
              right-16
              top-12
              h-20
              w-20
              rounded-full
              border
              border-sky-100/10
              bg-sky-100/[0.05]
              shadow-[0_0_50px_rgba(186,230,253,0.08)]
            "
          />

          {/* Raven */}
          <div
            className="
              absolute
              right-10
              top-5
              text-5xl
              opacity-[0.035]
              grayscale
              transition-all
              duration-700
              group-hover:opacity-[0.08]
              group-hover:-translate-x-2
            "
          >
            🐦‍⬛
          </div>

          {/* Castle */}
          <div
            className="
              absolute
              bottom-0
              right-12
              h-28
              w-44
              opacity-[0.08]
            "
          >
            <div className="absolute bottom-0 left-0 h-20 w-16 bg-black" />
            <div className="absolute bottom-0 right-0 h-24 w-14 bg-black" />
            <div className="absolute bottom-0 left-14 h-28 w-20 bg-black" />

            <div className="absolute -top-5 left-1 h-8 w-5 bg-black" />
            <div className="absolute -top-7 left-14 h-10 w-6 bg-black" />
            <div className="absolute -top-6 right-1 h-9 w-5 bg-black" />
          </div>

          {/* Snow particles */}
          {[
            "left-[8%] top-[20%]",
            "left-[18%] top-[55%]",
            "left-[31%] top-[14%]",
            "left-[44%] top-[38%]",
            "left-[57%] top-[18%]",
            "left-[68%] top-[60%]",
            "left-[79%] top-[28%]",
            "left-[91%] top-[45%]",
          ].map((position, index) => (
            <span
              key={index}
              className={`
                absolute
                ${position}
                h-1
                w-1
                rounded-full
                bg-sky-100/30
                animate-[snowFall_${3 + (index % 3)}s_linear_infinite]
              `}
            />
          ))}

          {/* Gold horizon */}
          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-amber-500/40
              to-transparent
            "
          />
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
            border-[#30363a]
            px-5
            py-5
            sm:px-6
          "
        >
          <div>
            <div className="flex items-center gap-2.5">
              <div
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-amber-700/40
                  bg-amber-950/20
                  text-amber-500
                  shadow-[0_0_20px_rgba(245,158,11,0.08)]
                  transition-all
                  duration-500
                  group-hover:border-amber-500/60
                  group-hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]
                "
              >
                <Crown
                  size={19}
                  className="transition-transform duration-500 group-hover:-translate-y-0.5"
                />

                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    h-2
                    w-2
                    rounded-full
                    bg-amber-400
                    shadow-[0_0_8px_rgba(251,191,36,0.8)]
                    animate-pulse
                  "
                />
              </div>

              <div>
                <h2
                  className="
                    m-0
                    text-base
                    font-black
                    uppercase
                    tracking-[0.08em]
                    text-[#e7e1d3]
                    sm:text-lg
                  "
                >
                  Your Quest
                </h2>

                <p
                  className="
                    m-0
                    mt-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-slate-600
                    sm:text-xs
                  "
                >
                  The realm awaits
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleViewAll}
            className="
              group/all
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              border
              border-transparent
              px-2.5
              py-2
              text-xs
              font-black
              uppercase
              tracking-[0.12em]
              text-amber-500
              transition-all
              duration-300
              hover:border-amber-800/40
              hover:bg-amber-950/20
              sm:text-sm
            "
          >
            All Quests

            <ArrowRight
              size={15}
              className="
                transition-transform
                duration-300
                group-hover/all:translate-x-1
              "
            />
          </button>
        </div>

        {/* =================================================
            EMPTY CONTENT
        ================================================= */}

        <div
          className="
            relative
            z-10
            flex
            min-h-[330px]
            flex-col
            items-center
            justify-center
            px-5
            py-12
            text-center
          "
        >
          {/* Castle emblem */}
          <div className="relative">
            <div
              className="
                absolute
                inset-[-20px]
                rounded-full
                bg-sky-500/[0.06]
                blur-3xl
                animate-pulse
              "
            />

            <div
              className="
                relative
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-[28px]
                border
                border-[#56616a]
                bg-gradient-to-br
                from-[#182126]
                to-[#080b0d]
                text-amber-500
                shadow-[0_0_45px_rgba(245,158,11,0.08)]
                animate-[realmFloat_5s_ease-in-out_infinite]
              "
            >
              <Castle
                size={42}
                strokeWidth={1.4}
              />

              <div
                className="
                  absolute
                  inset-2
                  rounded-[22px]
                  border
                  border-amber-500/10
                "
              />
            </div>

            <Sparkles
              size={15}
              className="
                absolute
                -right-5
                top-0
                text-amber-400
                animate-pulse
              "
            />

            <Snowflake
              size={15}
              className="
                absolute
                -bottom-3
                -left-5
                text-sky-400/70
                animate-[spin_8s_linear_infinite]
              "
            />
          </div>

          <h3
            className="
              m-0
              mt-7
              text-lg
              font-black
              uppercase
              tracking-[0.08em]
              text-[#e7e1d3]
            "
          >
            No Quest Has Begun
          </h3>

          <p
            className="
              m-0
              mt-3
              max-w-sm
              text-sm
              leading-6
              text-slate-500
            "
          >
            Choose a course, enter the realm, and begin
            your journey toward mastery.
          </p>

          <button
            type="button"
            onClick={handleViewAll}
            className="
              group/quest
              mt-7
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-amber-600/50
              bg-gradient-to-r
              from-amber-700
              to-amber-600
              px-6
              py-3
              text-sm
              font-black
              uppercase
              tracking-[0.08em]
              text-black
              shadow-lg
              shadow-amber-950/30
              transition-all
              duration-300
              hover:-translate-y-1
              hover:from-amber-500
              hover:to-amber-400
              hover:shadow-[0_0_35px_rgba(245,158,11,0.2)]
            "
          >
            Enter The Realm

            <ArrowRight
              size={16}
              className="
                transition-transform
                duration-300
                group-hover/quest:translate-x-1
              "
            />
          </button>
        </div>

        {/* Bottom realm line */}
        <div
          className="
            absolute
            bottom-0
            left-0
            h-[2px]
            w-full
            bg-gradient-to-r
            from-transparent
            via-amber-600/70
            to-transparent
          "
        />

        <style>{`
          @keyframes realmFloat {
            0%, 100% {
              transform: translateY(0px);
            }

            50% {
              transform: translateY(-9px) rotate(-1deg);
            }
          }

          @keyframes snowFall {
            0% {
              transform: translateY(-20px) translateX(0);
              opacity: 0;
            }

            20% {
              opacity: 0.8;
            }

            100% {
              transform: translateY(340px) translateX(25px);
              opacity: 0;
            }
          }
        `}</style>
      </section>
    );
  }

  // =====================================================
  // COURSE DATA
  // =====================================================

  const title =
    course.courseTitle ||
    course.title ||
    "Untitled Course";

  const instructor =
    course.instructor?.name ||
    "Smart LMS Instructor";

  const currentLesson =
    course.currentLesson?.lectureTitle ||
    course.currentLesson?.title ||
    "Start your first lesson";

  const completedLessons = Math.max(
    Number(course.completedLessons ?? 0),
    0
  );

  const totalLessons = Math.max(
    Number(course.totalLessons ?? 0),
    0
  );

  const progress = Math.min(
    Math.max(Number(course.progress ?? 0), 0),
    100
  );

  const watchedSeconds = Math.max(
    Number(
      course.currentLesson?.watchedSeconds ??
        course.watchedSeconds ??
        0
    ),
    0
  );

  const watchedMinutes = Math.floor(
    watchedSeconds / 60
  );

  const thumbnail =
    course.courseThumbnail?.url ||
    course.thumbnail ||
    "";

  const level =
    course.courseLevel ||
    "Beginner";

  const category =
    course.category ||
    "Course";

  const isCompleted =
    progress >= 100;

  // =====================================================
  // PROGRESS MESSAGE
  // =====================================================

  const getProgressMessage = () => {
    if (isCompleted) {
      return "The quest is complete. Your journey continues.";
    }

    if (progress >= 75) {
      return "The final stretch lies ahead. Claim your victory.";
    }

    if (progress >= 50) {
      return "Halfway through the journey. Hold the line.";
    }

    if (progress > 0) {
      return "You have entered the realm. Keep moving forward.";
    }

    return "Every great journey begins with a single step.";
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <section
      className="
        realm-card
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-[#343b40]
        bg-[#080b0d]
        shadow-2xl
        shadow-black/50
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-amber-700/50
        hover:shadow-[0_25px_80px_rgba(0,0,0,0.55)]
      "
    >
      {/* =================================================
          CINEMATIC BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Base */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#07090a]
            via-[#101416]
            to-[#15110c]
          "
        />

        {/* Blue northern glow */}
        <div
          className="
            absolute
            -left-32
            -top-32
            h-96
            w-96
            rounded-full
            bg-sky-500/[0.06]
            blur-[110px]
            transition-transform
            duration-[1500ms]
            group-hover:scale-125
          "
        />

        {/* Gold throne glow */}
        <div
          className="
            absolute
            -bottom-36
            -right-28
            h-96
            w-96
            rounded-full
            bg-amber-500/[0.07]
            blur-[110px]
            transition-transform
            duration-[1500ms]
            group-hover:scale-125
          "
        />

        {/* Red war glow */}
        <div
          className="
            absolute
            right-[25%]
            top-[15%]
            h-44
            w-44
            rounded-full
            bg-red-900/[0.04]
            blur-[80px]
          "
        />

        {/* Stone texture */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.07]
          "
          style={{
            backgroundImage: `
              linear-gradient(
                115deg,
                transparent 0%,
                rgba(255,255,255,0.08) 50%,
                transparent 100%
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 31px,
                rgba(255,255,255,0.035) 32px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 47px,
                rgba(255,255,255,0.025) 48px
              )
            `,
          }}
        />

        {/* Medieval grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        {/* Moon */}
        <div
          className="
            absolute
            right-24
            top-10
            h-24
            w-24
            rounded-full
            border
            border-sky-100/10
            bg-sky-100/[0.035]
            shadow-[0_0_60px_rgba(186,230,253,0.06)]
          "
        />

        {/* Mountains */}
        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-36
            opacity-[0.10]
          "
          style={{
            clipPath:
              "polygon(0 100%,0 70%,10% 48%,18% 67%,29% 28%,40% 65%,52% 35%,63% 68%,74% 42%,84% 62%,93% 38%,100% 68%,100% 100%)",
            background:
              "linear-gradient(to top, #020405, #182126)",
          }}
        />

        {/* Castle */}
        <div
          className="
            absolute
            bottom-0
            right-8
            h-36
            w-52
            opacity-[0.055]
            transition-all
            duration-700
            group-hover:opacity-[0.09]
          "
        >
          <div className="absolute bottom-0 left-0 h-24 w-20 bg-black" />
          <div className="absolute bottom-0 right-0 h-28 w-16 bg-black" />
          <div className="absolute bottom-0 left-16 h-36 w-24 bg-black" />

          <div className="absolute -top-7 left-2 h-11 w-6 bg-black" />
          <div className="absolute -top-8 left-[76px] h-13 w-7 bg-black" />
          <div className="absolute -top-7 right-1 h-11 w-6 bg-black" />

          <div className="absolute bottom-6 left-[95px] h-10 w-6 rounded-t-full bg-amber-500/20" />
        </div>

        {/* Raven */}
        <div
          className="
            absolute
            right-16
            top-8
            text-6xl
            opacity-[0.025]
            grayscale
            transition-all
            duration-700
            group-hover:translate-x-2
            group-hover:-translate-y-1
            group-hover:opacity-[0.07]
          "
        >
          🐦‍⬛
        </div>

        {/* Snow */}
        {[
          "left-[4%] top-[22%]",
          "left-[13%] top-[63%]",
          "left-[23%] top-[12%]",
          "left-[34%] top-[42%]",
          "left-[47%] top-[18%]",
          "left-[58%] top-[66%]",
          "left-[69%] top-[31%]",
          "left-[81%] top-[14%]",
          "left-[93%] top-[50%]",
        ].map((position, index) => (
          <span
            key={index}
            className={`
              absolute
              ${position}
              h-1
              w-1
              rounded-full
              bg-sky-100/30
              animate-[snowFall_${4 + (index % 3)}s_linear_infinite]
            `}
          />
        ))}

        {/* Gold particles */}
        {[
          "left-[15%] top-[80%]",
          "left-[38%] top-[75%]",
          "left-[63%] top-[82%]",
          "left-[87%] top-[72%]",
        ].map((position, index) => (
          <span
            key={index}
            className={`
              absolute
              ${position}
              h-1
              w-1
              rounded-full
              bg-amber-400/30
              animate-[emberFloat_${3 + index}s_ease-in-out_infinite]
            `}
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
          border-[#30363a]
          px-5
          py-5
          sm:px-6
        "
      >
        <div>
          <div className="flex items-center gap-2.5">
            <div
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-amber-700/40
                bg-amber-950/20
                text-amber-500
                transition-all
                duration-500
                group-hover:border-amber-500/60
                group-hover:shadow-[0_0_25px_rgba(245,158,11,0.13)]
              "
            >
              <Crown
                size={19}
                className="
                  transition-transform
                  duration-500
                  group-hover:-translate-y-0.5
                "
              />

              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  h-2
                  w-2
                  rounded-full
                  bg-amber-400
                  shadow-[0_0_8px_rgba(251,191,36,0.8)]
                  animate-pulse
                "
              />
            </div>

            <div>
              <h2
                className="
                  m-0
                  text-base
                  font-black
                  uppercase
                  tracking-[0.08em]
                  text-[#e7e1d3]
                  sm:text-lg
                "
              >
                Continue Your Quest
              </h2>

              <p
                className="
                  m-0
                  mt-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-slate-600
                  sm:text-xs
                "
              >
                Pick up where you left off
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleViewAll}
          className="
            group/all
            inline-flex
            items-center
            gap-1.5
            rounded-lg
            border
            border-transparent
            px-2.5
            py-2
            text-xs
            font-black
            uppercase
            tracking-[0.12em]
            text-amber-500
            transition-all
            duration-300
            hover:border-amber-800/40
            hover:bg-amber-950/20
            sm:text-sm
          "
        >
          All Quests

          <ArrowRight
            size={15}
            className="
              transition-transform
              duration-300
              group-hover/all:translate-x-1
            "
          />
        </button>
      </div>

      {/* =================================================
          COURSE CONTENT
      ================================================= */}

      <div
        className="
          relative
          z-10
          p-5
          sm:p-6
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-[280px_1fr]
          "
        >
          {/* =================================================
              COURSE IMAGE / QUEST POSTER
          ================================================= */}

          <div
            className="
              relative
              h-52
              w-full
              overflow-hidden
              rounded-3xl
              border
              border-[#3b4247]
              bg-gradient-to-br
              from-[#11181c]
              via-[#0a0d0f]
              to-[#19150e]
              shadow-2xl
              shadow-black/50
              sm:h-56
              xl:h-full
              xl:min-h-[330px]
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
                  brightness-[0.75]
                  saturate-[0.75]
                  transition-all
                  duration-700
                  group-hover:scale-105
                  group-hover:brightness-[0.9]
                  group-hover:saturate-100
                "
              />
            ) : (
              <>
                {/* Background sky */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-b
                    from-[#18262e]
                    via-[#10171b]
                    to-[#050708]
                  "
                />

                {/* Moon */}
                <div
                  className="
                    absolute
                    right-8
                    top-8
                    h-16
                    w-16
                    rounded-full
                    bg-slate-100/[0.08]
                    shadow-[0_0_45px_rgba(186,230,253,0.12)]
                  "
                />

                {/* Mountains */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-40
                    bg-[#070a0c]
                  "
                  style={{
                    clipPath:
                      "polygon(0 100%,0 68%,13% 42%,24% 72%,37% 22%,50% 70%,63% 37%,77% 72%,89% 40%,100% 65%,100% 100%)",
                  }}
                />

                {/* Castle towers */}
                <div
                  className="
                    absolute
                    bottom-7
                    left-1/2
                    -translate-x-1/2
                  "
                >
                  <div className="relative h-32 w-36">
                    <div className="absolute bottom-0 left-7 h-24 w-24 bg-[#050607]" />

                    <div className="absolute bottom-0 left-0 h-32 w-10 bg-[#050607]" />
                    <div className="absolute bottom-0 right-0 h-28 w-10 bg-[#050607]" />

                    <div className="absolute -top-6 left-0 h-9 w-10 bg-[#050607]" />
                    <div className="absolute -top-5 right-0 h-8 w-10 bg-[#050607]" />

                    <div
                      className="
                        absolute
                        bottom-0
                        left-[47px]
                        h-12
                        w-10
                        rounded-t-full
                        bg-amber-500/[0.13]
                        shadow-[0_0_25px_rgba(245,158,11,0.15)]
                      "
                    />
                  </div>
                </div>

                {/* Raven */}
                <div
                  className="
                    absolute
                    right-8
                    top-4
                    text-3xl
                    opacity-30
                    grayscale
                    animate-[ravenFly_6s_ease-in-out_infinite]
                  "
                >
                  🐦‍⬛
                </div>
              </>
            )}

            {/* Image overlay */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/90
                via-black/25
                to-black/30
              "
            />

            {/* Frost vignette */}
            <div
              className="
                absolute
                inset-0
                ring-1
                ring-inset
                ring-sky-100/[0.08]
              "
            />

            {/* Top badges */}
            <div
              className="
                absolute
                left-3
                right-3
                top-3
                flex
                items-center
                justify-between
                gap-2
              "
            >
              <span
                className="
                  rounded-lg
                  border
                  border-amber-600/40
                  bg-black/65
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.12em]
                  text-amber-400
                  backdrop-blur-md
                "
              >
                {level}
              </span>

              <span
                className="
                  max-w-[55%]
                  truncate
                  rounded-lg
                  border
                  border-sky-300/10
                  bg-black/65
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-300
                  backdrop-blur-md
                "
              >
                {category}
              </span>
            </div>

            {/* Play */}
            <button
              type="button"
              onClick={handleContinueCourse}
              aria-label={
                isCompleted
                  ? "Review course"
                  : "Continue course"
              }
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              {/* Outer ring */}
              <div
                className="
                  absolute
                  h-24
                  w-24
                  rounded-full
                  border
                  border-amber-400/20
                  animate-[realmPulse_3s_ease-out_infinite]
                "
              />

              <div
                className="
                  absolute
                  h-20
                  w-20
                  rounded-full
                  border
                  border-sky-300/10
                  animate-[realmPulse_3s_ease-out_1s_infinite]
                "
              />

              <div
                className="
                  relative
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-amber-500/40
                  bg-black/80
                  text-amber-400
                  shadow-[0_0_30px_rgba(245,158,11,0.12)]
                  backdrop-blur-md
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:border-amber-400/70
                  group-hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]
                "
              >
                {isCompleted ? (
                  <CheckCircle2
                    size={27}
                    strokeWidth={2}
                  />
                ) : (
                  <Play
                    size={25}
                    fill="currentColor"
                    className="ml-1"
                  />
                )}
              </div>
            </button>

            {/* Bottom info */}
            <div
              className="
                absolute
                bottom-4
                left-4
                right-4
                flex
                items-center
                justify-between
                gap-2
              "
            >
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  border-white/10
                  bg-black/65
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-medium
                  text-slate-300
                  backdrop-blur-md
                "
              >
                <Clock3 size={12} />

                {watchedMinutes > 0
                  ? `${watchedMinutes} min watched`
                  : "Not started"}
              </span>

              {progress > 0 && (
                <span
                  className={`
                    rounded-lg
                    border
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-black
                    shadow-lg
                    backdrop-blur-md
                    ${
                      isCompleted
                        ? "border-emerald-500/30 bg-emerald-950/70 text-emerald-400"
                        : "border-amber-600/40 bg-amber-950/70 text-amber-400"
                    }
                  `}
                >
                  {progress}% complete
                </span>
              )}
            </div>
          </div>

          {/* =================================================
              COURSE DETAILS
          ================================================= */}

          <div className="flex min-w-0 flex-col">
            {/* Category */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="
                  rounded-full
                  border
                  border-amber-700/40
                  bg-amber-950/20
                  px-2.5
                  py-1
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.12em]
                  text-amber-500
                "
              >
                {category}
              </span>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  border
                  border-sky-900/40
                  bg-sky-950/20
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-sky-400
                "
              >
                <Feather size={10} />
                Realm Training
              </span>

              {isCompleted && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    border
                    border-emerald-900/40
                    bg-emerald-950/30
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-emerald-400
                  "
                >
                  <CheckCircle2 size={11} />
                  Quest Complete
                </span>
              )}
            </div>

            {/* Title */}
            <h3
              className="
                m-0
                mt-3
                line-clamp-2
                text-xl
                font-black
                uppercase
                leading-tight
                tracking-[0.02em]
                text-[#e8e2d5]
                sm:text-2xl
              "
              title={title}
            >
              {title}
            </h3>

            {/* Instructor */}
            <div
              className="
                mt-2
                flex
                items-center
                gap-2
                text-xs
                text-slate-600
              "
            >
              <div
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#343b40]
                  bg-[#111619]
                "
              >
                <GraduationCap
                  size={13}
                  className="text-slate-500"
                />
              </div>

              <span>
                Taught by{" "}
                <span className="font-semibold text-slate-400">
                  {instructor}
                </span>
              </span>
            </div>

            {/* =================================================
                CURRENT LESSON
            ================================================= */}

            <div
              className="
                relative
                mt-6
                overflow-hidden
                rounded-2xl
                border
                border-[#3a3d37]
                bg-gradient-to-br
                from-[#191710]
                via-[#111416]
                to-[#0b0e10]
                p-4
                shadow-lg
                shadow-black/20
                transition-all
                duration-500
                hover:border-amber-700/40
              "
            >
              {/* Gold glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  h-28
                  w-28
                  rounded-full
                  bg-amber-500/[0.08]
                  blur-2xl
                "
              />

              {/* Blue glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-10
                  -left-10
                  h-24
                  w-24
                  rounded-full
                  bg-sky-500/[0.05]
                  blur-2xl
                "
              />

              <div
                className="
                  relative
                  z-10
                  flex
                  items-start
                  gap-3
                "
              >
                <div
                  className="
                    relative
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-amber-700/40
                    bg-black/50
                    text-amber-500
                    shadow-[0_0_20px_rgba(245,158,11,0.06)]
                  "
                >
                  <ScrollText size={18} />

                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-sky-400
                      shadow-[0_0_7px_rgba(56,189,248,0.8)]
                      animate-pulse
                    "
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-amber-500
                      "
                    >
                      Current Quest
                    </span>

                    <span className="h-1 w-1 rounded-full bg-slate-700" />

                    <span
                      className="
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-wider
                        text-slate-600
                      "
                    >
                      Training
                    </span>
                  </div>

                  <p
                    className="
                      m-0
                      mt-1
                      line-clamp-2
                      text-sm
                      font-bold
                      leading-5
                      text-slate-300
                    "
                  >
                    {currentLesson}
                  </p>
                </div>

                <ChevronRight
                  size={17}
                  className="
                    mt-2
                    shrink-0
                    text-slate-700
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                    group-hover:text-amber-500
                  "
                />
              </div>

              {/* Moving light */}
              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-0
                  left-[-30%]
                  h-px
                  w-1/3
                  bg-gradient-to-r
                  from-transparent
                  via-amber-400/50
                  to-transparent
                  transition-all
                  duration-[1800ms]
                  group-hover:left-[100%]
                "
              />
            </div>

            {/* =================================================
                PROGRESS
            ================================================= */}

            <div className="mt-6">
              <div
                className="
                  mb-2.5
                  flex
                  items-center
                  justify-between
                "
              >
                <div className="flex items-center gap-2">
                  <span
                    className="
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.12em]
                      text-slate-500
                    "
                  >
                    Quest Progress
                  </span>

                  {progress > 0 &&
                    progress < 100 && (
                      <Flame
                        size={14}
                        className="
                          text-amber-500
                          animate-pulse
                        "
                      />
                    )}
                </div>

                <span
                  className={`
                    text-sm
                    font-black
                    ${
                      isCompleted
                        ? "text-emerald-400"
                        : "text-amber-500"
                    }
                  `}
                >
                  {progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div
                className="
                  relative
                  h-3
                  overflow-hidden
                  rounded-full
                  border
                  border-[#252b2f]
                  bg-[#090c0e]
                "
              >
                <div
                  className={`
                    relative
                    h-full
                    rounded-full
                    transition-all
                    duration-1000
                    ${
                      isCompleted
                        ? "bg-gradient-to-r from-emerald-950 via-emerald-700 to-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.3)]"
                        : "bg-gradient-to-r from-amber-950 via-amber-700 to-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.3)]"
                    }
                  `}
                  style={{
                    width: `${progress}%`,
                  }}
                >
                  {progress > 0 &&
                    progress < 100 && (
                      <div
                        className="
                          absolute
                          inset-y-0
                          -left-10
                          w-10
                          bg-white/30
                          blur-sm
                          animate-[progressShine_2.2s_linear_infinite]
                        "
                      />
                    )}
                </div>

                {/* Progress endpoint */}
                {progress > 0 && (
                  <span
                    className="
                      absolute
                      top-1/2
                      h-2
                      w-2
                      -translate-y-1/2
                      rounded-full
                      bg-white
                      shadow-[0_0_8px_rgba(255,255,255,0.6)]
                      transition-all
                      duration-1000
                    "
                    style={{
                      left: `calc(${progress}% - 4px)`,
                    }}
                  />
                )}
              </div>

              {/* Details */}
              <div
                className="
                  mt-2.5
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-2
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    text-[11px]
                    font-medium
                    text-slate-600
                  "
                >
                  <Swords size={12} />

                  {completedLessons} of{" "}
                  {totalLessons} lessons
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    text-[11px]
                    font-medium
                    text-slate-600
                  "
                >
                  <Clock3 size={12} />

                  {watchedMinutes > 0
                    ? `${watchedMinutes} min watched`
                    : "Training not started"}
                </span>
              </div>
            </div>

            {/* =================================================
                MOTIVATION + ACTION
            ================================================= */}

            <div
              className="
                mt-6
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              {/* Message */}
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="
                    relative
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-amber-700/40
                    bg-amber-950/20
                  "
                >
                  {isCompleted ? (
                    <Trophy
                      size={16}
                      className="text-amber-400"
                    />
                  ) : (
                    <Target
                      size={16}
                      className="text-amber-500"
                    />
                  )}

                  <span
                    className="
                      absolute
                      -right-0.5
                      -top-0.5
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-sky-400
                      animate-pulse
                    "
                  />
                </div>

                <p
                  className="
                    m-0
                    max-w-md
                    text-xs
                    font-semibold
                    leading-5
                    text-slate-500
                  "
                >
                  {getProgressMessage()}
                </p>
              </div>

              {/* Continue */}
              <button
                type="button"
                onClick={handleContinueCourse}
                className="
                  group/quest
                  inline-flex
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-amber-600/50
                  bg-gradient-to-r
                  from-amber-700
                  to-amber-600
                  px-5
                  py-3
                  text-sm
                  font-black
                  uppercase
                  tracking-[0.07em]
                  text-black
                  shadow-lg
                  shadow-amber-950/30
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:from-amber-500
                  hover:to-amber-400
                  hover:shadow-[0_0_35px_rgba(245,158,11,0.18)]
                  active:translate-y-0
                "
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={16} />
                    Review Quest
                  </>
                ) : (
                  <>
                    <Play
                      size={15}
                      fill="currentColor"
                    />

                    {progress > 0
                      ? "Continue Quest"
                      : "Begin Quest"}
                  </>
                )}

                <ArrowRight
                  size={15}
                  className="
                    transition-transform
                    duration-300
                    group-hover/quest:translate-x-1
                  "
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          CORNER DECORATIONS
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-3
          top-3
          h-5
          w-5
          border-l
          border-t
          border-amber-600/30
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-3
          top-3
          h-5
          w-5
          border-r
          border-t
          border-amber-600/30
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-3
          left-3
          h-5
          w-5
          border-b
          border-l
          border-amber-600/30
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-3
          right-3
          h-5
          w-5
          border-b
          border-r
          border-amber-600/30
        "
      />

      {/* =================================================
          MOVING CINEMATIC LIGHT
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          -left-40
          w-28
          skew-x-[-20deg]
          bg-amber-400/[0.06]
          blur-xl
          transition-all
          duration-[2000ms]
          group-hover:left-[110%]
        "
      />

      {/* =================================================
          FOOTER LINE
      ================================================= */}

      <div
        className="
          absolute
          bottom-0
          left-0
          h-[2px]
          w-full
          bg-gradient-to-r
          from-transparent
          via-amber-600/70
          to-transparent
          opacity-80
        "
      />

      {/* =================================================
          ANIMATIONS
      ================================================= */}

      <style>{`
        @keyframes realmFloat {
          0%, 100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px) rotate(-1deg);
          }
        }

        @keyframes ravenFly {
          0%, 100% {
            transform: translate(0, 0);
          }

          25% {
            transform: translate(-12px, -5px);
          }

          50% {
            transform: translate(-25px, 3px);
          }

          75% {
            transform: translate(-12px, -4px);
          }
        }

        @keyframes snowFall {
          0% {
            transform: translateY(-25px) translateX(0);
            opacity: 0;
          }

          15% {
            opacity: 0.7;
          }

          50% {
            opacity: 0.5;
          }

          100% {
            transform: translateY(360px) translateX(30px);
            opacity: 0;
          }
        }

        @keyframes emberFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.15;
          }

          50% {
            transform: translateY(-18px) scale(1.5);
            opacity: 0.6;
          }
        }

        @keyframes realmPulse {
          0% {
            transform: scale(0.8);
            opacity: 0.7;
          }

          70% {
            transform: scale(1.25);
            opacity: 0;
          }

          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }

        @keyframes progressShine {
          0% {
            left: -40px;
          }

          100% {
            left: 100%;
          }
        }
      `}</style>
    </section>
  );
}

export default ContinueLearning;