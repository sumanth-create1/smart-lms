import {
  Award,
  ChevronRight,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

function StudentXPCard({ xp }) {
  if (!xp) return null;

  const {
    totalXP = 0,
    level = 1,
    progressXP = 0,
    remainingXP = 1000,
    progressPercentage = 0,
  } = xp;

  const safeProgress = Math.min(
    100,
    Math.max(0, progressPercentage)
  );

  return (
    <section
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-[28px]
        border
        border-violet-100
        bg-gradient-to-br
        from-violet-50
        via-white
        to-fuchsia-50
        p-6
        shadow-sm
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-xl
        hover:shadow-violet-100/60
        sm:p-7
        lg:p-8
      "
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-64
          w-64
          rounded-full
          bg-violet-200/40
          blur-3xl
          transition-transform
          duration-1000
          group-hover:scale-125
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          left-1/3
          h-56
          w-56
          rounded-full
          bg-fuchsia-200/30
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-1/3
          top-1/2
          h-24
          w-24
          rounded-full
          bg-amber-200/20
          blur-2xl
          animate-pulse
        "
      />

      {/* Floating particles */}

      <Sparkles
        size={15}
        className="
          pointer-events-none
          absolute
          right-[38%]
          top-7
          text-violet-300
          animate-pulse
        "
      />

      <Star
        size={11}
        className="
          pointer-events-none
          absolute
          right-[28%]
          bottom-12
          text-fuchsia-300
          animate-pulse
        "
      />

      <Sparkles
        size={12}
        className="
          pointer-events-none
          absolute
          left-[42%]
          bottom-8
          text-amber-300
          animate-pulse
        "
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10">
        <div
          className="
            grid
            grid-cols-1
            gap-8
            lg:grid-cols-[1fr_240px]
            lg:items-center
          "
        >
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div>
            {/* Header */}

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Level icon */}

                <div
                  className="
                    relative
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-violet-500
                    to-fuchsia-500
                    shadow-lg
                    shadow-violet-200
                    transition-transform
                    duration-500
                    group-hover:rotate-6
                    group-hover:scale-110
                  "
                >
                  <Award
                    size={24}
                    className="text-white"
                    strokeWidth={2}
                  />

                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      h-4
                      w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-amber-400
                      text-[8px]
                      text-white
                    "
                  >
                    ✦
                  </span>
                </div>

                <div>
                  <p
                    className="
                      m-0
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-violet-400
                    "
                  >
                    Your learning journey
                  </p>

                  <div className="mt-0.5 flex items-center gap-2">
                    <h3
                      className="
                        m-0
                        text-xl
                        font-extrabold
                        tracking-tight
                        text-slate-900
                      "
                    >
                      Level {level}
                    </h3>

                    <span
                      className="
                        rounded-full
                        bg-violet-100
                        px-2
                        py-0.5
                        text-[10px]
                        font-bold
                        text-violet-600
                      "
                    >
                      LEARNER
                    </span>
                  </div>
                </div>
              </div>

              {/* XP badge */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-amber-100
                  bg-white
                  px-3
                  py-2
                  shadow-sm
                  transition-transform
                  duration-300
                  group-hover:scale-105
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
                    bg-amber-50
                  "
                >
                  <Zap
                    size={13}
                    className="text-amber-500"
                    fill="currentColor"
                  />
                </div>

                <span className="text-xs font-extrabold text-slate-700">
                  {totalXP.toLocaleString()} XP
                </span>
              </div>
            </div>

            {/* XP Number */}

            <div className="mt-7">
              <div className="flex items-end gap-3">
                <span
                  className="
                    text-4xl
                    font-black
                    tracking-tight
                    text-slate-900
                    sm:text-5xl
                  "
                >
                  {progressXP.toLocaleString()}
                </span>

                <span
                  className="
                    mb-1
                    text-sm
                    font-semibold
                    text-slate-400
                  "
                >
                  / 1,000 XP
                </span>
              </div>

              <p
                className="
                  m-0
                  mt-1
                  text-xs
                  font-medium
                  text-slate-400
                "
              >
                XP earned toward Level {level + 1}
              </p>
            </div>

            {/* =================================================
                XP PROGRESS
            ================================================= */}

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span
                  className="
                    text-xs
                    font-bold
                    text-slate-500
                  "
                >
                  Level progress
                </span>

                <span
                  className="
                    text-xs
                    font-extrabold
                    text-violet-600
                  "
                >
                  {safeProgress}%
                </span>
              </div>

              <div
                className="
                  relative
                  h-3
                  overflow-hidden
                  rounded-full
                  bg-violet-100
                "
              >
                {/* Progress */}

                <div
                  className="
                    relative
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-violet-500
                    via-fuchsia-500
                    to-pink-500
                    shadow-[0_0_14px_rgba(168,85,247,0.35)]
                    transition-all
                    duration-1000
                    ease-out
                  "
                  style={{
                    width: `${safeProgress}%`,
                  }}
                >
                  {/* Moving shine */}

                  <div
                    className="
                      absolute
                      inset-y-0
                      -left-10
                      w-10
                      bg-white/30
                      blur-sm
                      animate-[shimmer_2.5s_infinite]
                    "
                  />
                </div>
              </div>

              {/* Progress information */}

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">
                  Keep going!
                </span>

                <span className="text-[11px] font-bold text-violet-600">
                  {remainingXP.toLocaleString()} XP left
                </span>
              </div>
            </div>

            {/* =================================================
                MOTIVATION CARD
            ================================================= */}

            <div
              className="
                mt-6
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-white
                bg-white/80
                px-4
                py-3.5
                shadow-sm
                backdrop-blur-sm
                transition-all
                duration-300
                group-hover:bg-white
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-violet-50
                "
              >
                <Trophy
                  size={17}
                  className="text-violet-500"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    m-0
                    text-xs
                    font-bold
                    text-slate-700
                  "
                >
                  You're building something great.
                </p>

                <p
                  className="
                    m-0
                    mt-0.5
                    truncate
                    text-[11px]
                    text-slate-400
                  "
                >
                  Complete lectures and achievements to
                  keep earning XP.
                </p>
              </div>

              <ChevronRight
                size={17}
                className="
                  shrink-0
                  text-slate-300
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                  group-hover:text-violet-500
                "
              />
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE — ANIMATED MASCOTS
          ================================================= */}

          <div
            className="
              relative
              hidden
              h-[220px]
              lg:block
            "
          >
            {/* Glow behind mascot */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-40
                w-40
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-violet-200/50
                blur-3xl
                animate-pulse
              "
            />

            {/* Main animal */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                flex
                -translate-x-1/2
                -translate-y-1/2
                flex-col
                items-center
                animate-[float_4s_ease-in-out_infinite]
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
                  border-white
                  bg-white/80
                  text-6xl
                  shadow-xl
                  shadow-violet-200/50
                  backdrop-blur
                  transition-transform
                  duration-500
                  group-hover:scale-110
                "
              >
                🐼
              </div>

              <div
                className="
                  mt-3
                  rounded-full
                  bg-white
                  px-4
                  py-1.5
                  text-[11px]
                  font-bold
                  text-violet-600
                  shadow-sm
                "
              >
                Keep going! 🚀
              </div>
            </div>

            {/* Floating rabbit */}

            <div
              className="
                absolute
                left-1
                top-7
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-white
                text-2xl
                shadow-lg
                animate-[float_3.5s_ease-in-out_infinite]
              "
            >
              🐰
            </div>

            {/* Floating fox */}

            <div
              className="
                absolute
                bottom-7
                right-2
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-white
                text-2xl
                shadow-lg
                animate-[float_4.5s_ease-in-out_infinite]
              "
            >
              🦊
            </div>

            {/* Floating star */}

            <div
              className="
                absolute
                right-5
                top-2
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-amber-50
                text-lg
                shadow-sm
                animate-pulse
              "
            >
              ⭐
            </div>

            {/* Floating XP */}

            <div
              className="
                absolute
                bottom-1
                left-8
                flex
                items-center
                gap-1.5
                rounded-full
                border
                border-amber-100
                bg-white
                px-3
                py-1.5
                text-[10px]
                font-bold
                text-amber-600
                shadow-sm
                animate-[float_3s_ease-in-out_infinite]
              "
            >
              <Zap
                size={12}
                fill="currentColor"
              />

              +XP
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          LEVEL FOOTER
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mt-7
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          border-t
          border-violet-100
          pt-5
        "
      >
        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              bg-emerald-50
            "
          >
            <Sparkles
              size={13}
              className="text-emerald-500"
            />
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Every lesson moves you forward
          </span>
        </div>

        <div
          className="
            flex
            items-center
            gap-1.5
            text-xs
            font-bold
            text-violet-600
          "
        >
          Level {level + 1}

          <ChevronRight size={14} />
        </div>
      </div>

      {/* =====================================================
          ANIMATION KEYFRAMES
      ===================================================== */}

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
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

export default StudentXPCard;