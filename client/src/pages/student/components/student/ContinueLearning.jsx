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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// =====================================================
// CONTINUE LEARNING — FIGHT CLUB THEME
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
          group
          relative
          min-w-0
          overflow-hidden
          rounded-[28px]
          border
          border-zinc-800
          bg-[#090909]
          shadow-xl
          shadow-black/30
          transition-all
          duration-500
          hover:-translate-y-1
          hover:border-red-900/60
          hover:shadow-2xl
        "
      >
        {/* =================================================
            CINEMATIC BACKGROUND
        ================================================= */}

        <div className="absolute inset-0 overflow-hidden">
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-[#050505]
              via-[#111111]
              to-[#1a0505]
            "
          />

          <div
            className="
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-red-700/15
              blur-[100px]
              transition-transform
              duration-1000
              group-hover:scale-125
            "
          />

          <div
            className="
              absolute
              -bottom-24
              -left-20
              h-72
              w-72
              rounded-full
              bg-red-900/10
              blur-[100px]
            "
          />

          {/* Grit texture */}

          <div
            className="
              absolute
              inset-0
              opacity-[0.035]
              [background-image:linear-gradient(120deg,transparent_45%,white_46%,transparent_47%)]
              [background-size:14px_14px]
            "
          />

          {/* Silhouette */}

          <div
            className="
              pointer-events-none
              absolute
              -bottom-12
              -right-2
              text-[170px]
              leading-none
              opacity-[0.025]
              grayscale
              transition-all
              duration-700
              group-hover:opacity-[0.05]
            "
          >
            🥊
          </div>
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
            border-zinc-800
            px-5
            py-5
            sm:px-6
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-red-900/50
                  bg-red-950/30
                "
              >
                <Swords
                  size={18}
                  className="text-red-500"
                />
              </div>

              <h2
                className="
                  m-0
                  text-base
                  font-black
                  tracking-tight
                  text-white
                  sm:text-lg
                "
              >
                Fight Record
              </h2>
            </div>

            <p
              className="
                m-0
                mt-1
                pl-11
                text-xs
                text-zinc-600
                sm:text-sm
              "
            >
              No excuses. Keep training.
            </p>
          </div>

          <button
            type="button"
            onClick={handleViewAll}
            className="
              inline-flex
              items-center
              gap-1
              rounded-lg
              px-2
              py-1.5
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-red-500
              transition-all
              hover:bg-red-950/30
              sm:text-sm
            "
          >
            All fights
            <ArrowRight size={15} />
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
            min-h-[300px]
            flex-col
            items-center
            justify-center
            px-5
            py-10
            text-center
          "
        >
          <div className="relative">
            <div
              className="
                absolute
                inset-0
                rounded-full
                bg-red-600/10
                blur-3xl
                animate-pulse
              "
            />

            <div
              className="
                relative
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-[26px]
                border
                border-red-900/40
                bg-red-950/30
                text-4xl
                shadow-lg
                shadow-red-950/30
                animate-[fightFloat_4s_ease-in-out_infinite]
              "
            >
              🥊
            </div>

            <Sparkles
              size={15}
              className="
                absolute
                -right-4
                -top-2
                text-red-500
                animate-pulse
              "
            />

            <Zap
              size={13}
              className="
                absolute
                -bottom-3
                -left-4
                text-zinc-600
                animate-pulse
              "
            />
          </div>

          <h3
            className="
              m-0
              mt-6
              text-lg
              font-black
              uppercase
              tracking-tight
              text-white
            "
          >
            No fight has started
          </h3>

          <p
            className="
              m-0
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-zinc-600
            "
          >
            Pick a course, enter the arena, and start
            sharpening your skills.
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
              border-red-700/50
              bg-red-700
              px-5
              py-3
              text-sm
              font-black
              uppercase
              tracking-wide
              text-white
              shadow-lg
              shadow-red-950/40
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-red-600
              hover:shadow-[0_0_30px_rgba(220,38,38,0.25)]
            "
          >
            Enter The Fight
            <ArrowRight size={16} />
          </button>
        </div>

        <div
          className="
            absolute
            bottom-0
            left-0
            h-[2px]
            w-full
            bg-gradient-to-r
            from-transparent
            via-red-700
            to-transparent
          "
        />

        <style>{`
          @keyframes fightFloat {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-8px) rotate(-2deg);
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
      return "Fight won. But the training never ends.";
    }

    if (progress >= 75) {
      return "Final round. Finish what you started.";
    }

    if (progress >= 50) {
      return "Halfway through. Don't lose momentum.";
    }

    if (progress > 0) {
      return "You've entered the fight. Keep moving.";
    }

    return "The first rule: you have to start.";
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <section
      className="
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-zinc-800
        bg-[#090909]
        shadow-xl
        shadow-black/30
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-red-900/60
        hover:shadow-2xl
      "
    >
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#050505]
            via-[#101010]
            to-[#190606]
          "
        />

        {/* Red glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-red-700/15
            blur-[100px]
            transition-transform
            duration-1000
            group-hover:scale-125
          "
        />

        {/* Bottom glow */}

        <div
          className="
            pointer-events-none
            absolute
            -bottom-28
            left-1/3
            h-72
            w-72
            rounded-full
            bg-red-900/10
            blur-[100px]
          "
        />

        {/* Grit */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(120deg,transparent_45%,white_46%,transparent_47%)]
            [background-size:16px_16px]
          "
        />

        {/* Horizontal fight-club line */}

        <div
          className="
            absolute
            left-0
            top-16
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-red-900/30
            to-transparent
          "
        />

        {/* Silhouette */}

        <div
          className="
            pointer-events-none
            absolute
            -bottom-16
            -right-5
            text-[190px]
            leading-none
            opacity-[0.025]
            grayscale
            transition-all
            duration-700
            group-hover:scale-105
            group-hover:opacity-[0.05]
          "
        >
          🥊
        </div>
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
          border-zinc-800
          px-5
          py-5
          sm:px-6
        "
      >
        <div>
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-red-900/50
                bg-red-950/30
                text-red-500
                transition-all
                duration-300
                group-hover:border-red-700/60
                group-hover:shadow-[0_0_18px_rgba(220,38,38,0.15)]
              "
            >
              <Swords size={18} />
            </div>

            <h2
              className="
                m-0
                text-base
                font-black
                uppercase
                tracking-tight
                text-white
                sm:text-lg
              "
            >
              Fight Record
            </h2>
          </div>

          <p
            className="
              m-0
              mt-1
              pl-11
              text-xs
              text-zinc-600
              sm:text-sm
            "
          >
            Pick up where you left off
          </p>
        </div>

        <button
          type="button"
          onClick={handleViewAll}
          className="
            inline-flex
            items-center
            gap-1
            rounded-lg
            px-2
            py-1.5
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-red-500
            transition-all
            hover:bg-red-950/30
            sm:text-sm
          "
        >
          All fights
          <ArrowRight size={15} />
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
              COURSE IMAGE / FIGHT POSTER
          ================================================= */}

          <div
            className="
              relative
              h-52
              w-full
              overflow-hidden
              rounded-3xl
              border
              border-zinc-800
              bg-gradient-to-br
              from-zinc-900
              via-[#111111]
              to-red-950
              shadow-xl
              shadow-black/40
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
                  grayscale-[15%]
                  transition-all
                  duration-700
                  group-hover:scale-105
                  group-hover:grayscale-0
                "
              />
            ) : (
              <>
                {/* Background circles */}

                <div
                  className="
                    absolute
                    -right-12
                    -top-12
                    h-40
                    w-40
                    rounded-full
                    bg-red-700/20
                    blur-sm
                  "
                />

                <div
                  className="
                    absolute
                    -bottom-14
                    -left-12
                    h-44
                    w-44
                    rounded-full
                    bg-red-900/20
                  "
                />

                {/* Fight illustration */}

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
                      h-28
                      w-28
                      items-center
                      justify-center
                      rounded-[32px]
                      border
                      border-red-800/40
                      bg-black/40
                      text-6xl
                      shadow-2xl
                      shadow-black
                      backdrop-blur-sm
                      animate-[fightFloat_4s_ease-in-out_infinite]
                    "
                  >
                    🥊
                  </div>
                </div>
              </>
            )}

            {/* Dark overlay */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/80
                via-black/20
                to-black/30
              "
            />

            {/* =================================================
                TOP BADGES
            ================================================= */}

            <div
              className="
                absolute
                left-3
                right-3
                top-3
                flex
                items-center
                justify-between
              "
            >
              <span
                className="
                  rounded-lg
                  border
                  border-red-700/40
                  bg-black/60
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wider
                  text-red-400
                  backdrop-blur-md
                "
              >
                {level}
              </span>

              <span
                className="
                  rounded-lg
                  border
                  border-white/10
                  bg-black/60
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-zinc-300
                  backdrop-blur-md
                "
              >
                {category}
              </span>
            </div>

            {/* =================================================
                PLAY BUTTON
            ================================================= */}

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
              {/* Red pulse */}

              <div
                className="
                  absolute
                  h-20
                  w-20
                  rounded-full
                  border
                  border-red-500/40
                  animate-ping
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
                  border-white/20
                  bg-black/80
                  text-red-500
                  shadow-2xl
                  shadow-black
                  backdrop-blur-md
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:border-red-500/60
                  group-hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]
                "
              >
                {isCompleted ? (
                  <CheckCircle2
                    size={27}
                    className="text-red-500"
                    strokeWidth={2.5}
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

            {/* =================================================
                BOTTOM INFO
            ================================================= */}

            <div
              className="
                absolute
                bottom-4
                left-4
                right-4
                flex
                items-center
                justify-between
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
                  bg-black/60
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-medium
                  text-zinc-300
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
                  className="
                    rounded-lg
                    border
                    border-red-700/40
                    bg-red-950/80
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-black
                    text-red-400
                    shadow-lg
                    shadow-black/30
                  "
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
            {/* Fight category */}

            <div className="flex items-center gap-2">
              <span
                className="
                  rounded-full
                  border
                  border-red-900/40
                  bg-red-950/30
                  px-2.5
                  py-1
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wider
                  text-red-500
                "
              >
                {category}
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
                    text-emerald-500
                  "
                >
                  <CheckCircle2 size={11} />
                  Fight Won
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
                tracking-tight
                text-white
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
                text-zinc-600
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
                  border-zinc-800
                  bg-zinc-900
                "
              >
                <GraduationCap
                  size={13}
                  className="text-zinc-500"
                />
              </div>

              <span>
                Trained by{" "}
                <span className="font-semibold text-zinc-400">
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
                border-red-900/30
                bg-gradient-to-br
                from-red-950/30
                to-zinc-900
                p-4
              "
            >
              {/* Red glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-6
                  -top-6
                  h-20
                  w-20
                  rounded-full
                  bg-red-600/10
                  blur-xl
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
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-red-900/40
                    bg-black/50
                    text-red-500
                  "
                >
                  <BookOpen size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-wider
                        text-red-500
                      "
                    >
                      Current Round
                    </span>

                    <span className="h-1 w-1 rounded-full bg-zinc-700" />

                    <span
                      className="
                        text-[10px]
                        font-medium
                        text-zinc-600
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
                      text-zinc-300
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
                    text-zinc-700
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                    group-hover:text-red-500
                  "
                />
              </div>
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
                      tracking-wider
                      text-zinc-500
                    "
                  >
                    Fight Progress
                  </span>

                  {progress > 0 &&
                    progress < 100 && (
                      <Flame
                        size={14}
                        className="
                          text-red-500
                          animate-pulse
                        "
                      />
                    )}
                </div>

                <span
                  className="
                    text-sm
                    font-black
                    text-red-500
                  "
                >
                  {progress}%
                </span>
              </div>

              {/* Progress */}

              <div
                className="
                  relative
                  h-3
                  overflow-hidden
                  rounded-full
                  bg-zinc-900
                "
              >
                <div
                  className="
                    relative
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-red-950
                    via-red-700
                    to-red-500
                    shadow-[0_0_14px_rgba(220,38,38,0.35)]
                    transition-all
                    duration-1000
                  "
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
                          -left-8
                          w-8
                          bg-white/25
                          blur-sm
                          animate-[progressShine_2s_infinite]
                        "
                      />
                    )}
                </div>
              </div>

              {/* Progress details */}

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
                    text-[11px]
                    font-medium
                    text-zinc-600
                  "
                >
                  {completedLessons} of{" "}
                  {totalLessons} rounds
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    text-[11px]
                    font-medium
                    text-zinc-600
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
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-red-900/40
                    bg-red-950/30
                  "
                >
                  {isCompleted ? (
                    <Trophy
                      size={15}
                      className="text-red-500"
                    />
                  ) : (
                    <Target
                      size={15}
                      className="text-red-500"
                    />
                  )}
                </div>

                <p
                  className="
                    m-0
                    text-xs
                    font-semibold
                    leading-5
                    text-zinc-500
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
                  group/fight
                  inline-flex
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-red-700/50
                  bg-red-700
                  px-5
                  py-3
                  text-sm
                  font-black
                  uppercase
                  tracking-wide
                  text-white
                  shadow-lg
                  shadow-red-950/40
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-red-600
                  hover:shadow-[0_0_30px_rgba(220,38,38,0.25)]
                  active:translate-y-0
                "
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={16} />
                    Review Fight
                  </>
                ) : (
                  <>
                    <Play
                      size={15}
                      fill="currentColor"
                    />

                    {progress > 0
                      ? "Continue Fight"
                      : "Enter Fight"}
                  </>
                )}

                <ArrowRight
                  size={15}
                  className="
                    transition-transform
                    duration-300
                    group-hover/fight:translate-x-1
                  "
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          CINEMATIC FOOTER
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
          via-red-700
          to-transparent
          opacity-70
        "
      />

      {/* Moving red light */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          -left-40
          w-24
          skew-x-[-20deg]
          bg-red-500/10
          blur-xl
          transition-all
          duration-[1800ms]
          group-hover:left-[110%]
        "
      />

      {/* =================================================
          ANIMATIONS
      ================================================= */}

      <style>{`
        @keyframes fightFloat {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px) rotate(-2deg);
          }
        }

        @keyframes progressShine {
          0% {
            left: -32px;
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