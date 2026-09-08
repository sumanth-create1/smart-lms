import {
  Award,
  ChevronRight,
  Sparkles,
  Trophy,
  Zap,
  Crown,
  Rocket,
  Crosshair,
  Target,
  Shield,
  Activity,
  ScanLine,
  CircleDot,
  Flame,
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

  const isCloseToLevelUp = safeProgress >= 80;

  return (
    <section
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-[28px]
        border
        border-zinc-800
        bg-[#090909]
        p-6
        shadow-2xl
        shadow-black/20
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-red-900/70
        hover:shadow-[0_25px_70px_rgba(0,0,0,0.45)]
        sm:p-7
        lg:p-8
      "
    >
      {/* =====================================================
          TACTICAL BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main red glow */}

        <div
          className="
            absolute
            -right-32
            -top-32
            h-80
            w-80
            rounded-full
            bg-red-950/50
            blur-3xl
            transition-all
            duration-1000
            group-hover:scale-125
            group-hover:bg-red-900/40
          "
        />

        {/* Bottom red glow */}

        <div
          className="
            absolute
            -bottom-32
            left-1/3
            h-72
            w-72
            rounded-full
            bg-red-950/30
            blur-3xl
            transition-transform
            duration-1000
            group-hover:scale-110
          "
        />

        {/* Gold glow */}

        <div
          className="
            absolute
            right-1/4
            top-1/2
            h-32
            w-32
            rounded-full
            bg-amber-900/10
            blur-3xl
            animate-pulse
          "
        />

        {/* Tactical diagonal pattern */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.045]
            [background-image:linear-gradient(135deg,transparent_24%,#ffffff_25%,transparent_26%)]
            [background-size:22px_22px]
          "
        />

        {/* Scan line */}

        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-red-500/50
            to-transparent
            animate-[scanLine_5s_linear_infinite]
          "
        />

        {/* Tactical particles */}

        <CircleDot
          size={9}
          className="
            absolute
            left-[38%]
            top-8
            text-red-500/60
            animate-[particleFloat_4s_ease-in-out_infinite]
          "
        />

        <CircleDot
          size={7}
          className="
            absolute
            right-[35%]
            top-[28%]
            text-red-400/40
            animate-[particleFloat_5s_ease-in-out_infinite_1s]
          "
        />

        <Sparkles
          size={12}
          className="
            absolute
            right-[27%]
            bottom-12
            text-amber-500/50
            animate-[starFloat_3s_ease-in-out_infinite]
          "
        />

        <Target
          size={10}
          className="
            absolute
            left-[25%]
            top-[40%]
            text-red-500/30
            animate-pulse
          "
        />
      </div>

      {/* =====================================================
          TOP TACTICAL LABEL
      ===================================================== */}

      <div
        className="
          absolute
          right-6
          top-5
          hidden
          items-center
          gap-2
          text-[8px]
          font-black
          uppercase
          tracking-[0.25em]
          text-zinc-600
          sm:flex
        "
      >
        <Activity size={10} />

        ACTIVE CONTRACT

        <span
          className="
            h-1.5
            w-1.5
            animate-pulse
            rounded-full
            bg-red-500
            shadow-[0_0_8px_rgba(239,68,68,0.8)]
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10">
        <div
          className="
            grid
            grid-cols-1
            gap-8
            lg:grid-cols-[1fr_250px]
            lg:items-center
          "
        >
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div>
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Tactical level icon */}

                <div
                  className="
                    relative
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-red-800/60
                    bg-gradient-to-br
                    from-red-700
                    via-red-900
                    to-black
                    shadow-[0_0_25px_rgba(220,38,38,0.18)]
                    transition-all
                    duration-500
                    group-hover:scale-110
                    group-hover:rotate-2
                    group-hover:shadow-[0_0_35px_rgba(220,38,38,0.3)]
                  "
                >
                  {/* Rotating tactical ring */}

                  <div
                    className="
                      absolute
                      -inset-1
                      rounded-[18px]
                      border
                      border-dashed
                      border-red-700/40
                      animate-[rotateRing_8s_linear_infinite]
                    "
                  />

                  <Crosshair
                    size={25}
                    className="
                      relative
                      z-10
                      text-red-100
                      drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]
                    "
                    strokeWidth={1.7}
                  />

                  {/* Level indicator */}

                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      z-20
                      flex
                      h-4
                      w-4
                      animate-[badgePulse_2s_ease-in-out_infinite]
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-red-400/30
                      bg-red-600
                      text-[7px]
                      font-black
                      text-white
                      shadow-[0_0_12px_rgba(239,68,68,0.7)]
                    "
                  >
                    +
                  </span>
                </div>

                <div>
                  <p
                    className="
                      m-0
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.25em]
                      text-red-500
                    "
                  >
                    Training Status
                  </p>

                  <div className="mt-0.5 flex items-center gap-2">
                    <h3
                      className="
                        m-0
                        text-xl
                        font-black
                        tracking-tight
                        text-white
                      "
                    >
                      Level {level}
                    </h3>

                    <span
                      className="
                        rounded-sm
                        border
                        border-zinc-700
                        bg-zinc-900
                        px-2
                        py-0.5
                        text-[8px]
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-zinc-400
                      "
                    >
                      Operator
                    </span>
                  </div>
                </div>
              </div>

              {/* =================================================
                  XP BADGE
              ================================================= */}

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-zinc-800
                  bg-zinc-950/90
                  px-3
                  py-2
                  shadow-lg
                  transition-all
                  duration-300
                  group-hover:border-red-900/60
                  group-hover:shadow-[0_0_20px_rgba(220,38,38,0.1)]
                "
              >
                <div
                  className="
                    relative
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-red-950
                  "
                >
                  <Zap
                    size={13}
                    className="
                      animate-[zapPulse_1.5s_ease-in-out_infinite]
                      text-red-500
                    "
                    fill="currentColor"
                  />

                  <span
                    className="
                      absolute
                      inset-0
                      animate-ping
                      rounded-full
                      bg-red-500/10
                    "
                  />
                </div>

                <span className="text-xs font-black text-zinc-300">
                  {totalXP.toLocaleString()} XP
                </span>
              </div>
            </div>

            {/* =================================================
                XP NUMBER
            ================================================= */}

            <div className="mt-7">
              <div className="flex items-end gap-3">
                <span
                  className="
                    text-4xl
                    font-black
                    tracking-tight
                    text-white
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
                    text-zinc-600
                  "
                >
                  / 1,000 XP
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <Rocket
                  size={13}
                  className="
                    text-red-500
                    transition-transform
                    duration-300
                    group-hover:-translate-y-1
                    group-hover:translate-x-1
                  "
                />

                <p
                  className="
                    m-0
                    text-xs
                    font-medium
                    text-zinc-500
                  "
                >
                  XP required to reach Level {level + 1}
                </p>
              </div>
            </div>

            {/* =================================================
                XP PROGRESS
            ================================================= */}

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-zinc-500
                  "
                >
                  Contract Progress
                </span>

                <span
                  className="
                    text-xs
                    font-black
                    text-red-500
                  "
                >
                  {safeProgress}%
                </span>
              </div>

              {/* Tactical progress track */}

              <div
                className="
                  relative
                  h-3
                  overflow-hidden
                  border
                  border-zinc-800
                  bg-zinc-950
                  shadow-inner
                "
              >
                {/* Progress */}

                <div
                  className="
                    relative
                    h-full
                    bg-gradient-to-r
                    from-red-950
                    via-red-700
                    to-red-500
                    shadow-[0_0_20px_rgba(239,68,68,0.45)]
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
                      -left-12
                      w-12
                      -skew-x-12
                      bg-white/20
                      blur-sm
                      animate-[shimmer_2.2s_linear_infinite]
                    "
                  />

                  {/* Progress endpoint */}

                  {safeProgress > 0 && (
                    <div
                      className="
                        absolute
                        right-0
                        top-1/2
                        h-2
                        w-2
                        -translate-y-1/2
                        rounded-full
                        bg-red-100
                        shadow-[0_0_10px_rgba(248,113,113,1)]
                      "
                    />
                  )}
                </div>
              </div>

              {/* Progress information */}

              <div className="mt-2 flex items-center justify-between">
                <span
                  className="
                    text-[10px]
                    font-medium
                    text-zinc-600
                  "
                >
                  {isCloseToLevelUp
                    ? "Target within reach."
                    : "Mission continues."}
                </span>

                <span
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-red-500
                  "
                >
                  {remainingXP.toLocaleString()} XP remaining
                </span>
              </div>
            </div>

            {/* =================================================
                MOTIVATION / CONTRACT CARD
            ================================================= */}

            <div
              className="
                mt-6
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-zinc-800
                bg-zinc-950/80
                px-4
                py-3.5
                shadow-inner
                backdrop-blur-sm
                transition-all
                duration-300
                group-hover:border-red-950
                group-hover:bg-zinc-950
              "
            >
              <div
                className="
                  relative
                  flex
                  h-9
                  w-9
                  shrink-0
                  animate-[trophyFloat_3s_ease-in-out_infinite]
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-red-900/50
                  bg-red-950/40
                "
              >
                {isCloseToLevelUp ? (
                  <Flame
                    size={17}
                    className="
                      text-red-500
                      drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]
                    "
                  />
                ) : (
                  <Trophy
                    size={17}
                    className="
                      text-amber-500
                      drop-shadow-[0_0_5px_rgba(245,158,11,0.35)]
                    "
                  />
                )}

                <Sparkles
                  size={8}
                  className="
                    absolute
                    -right-1
                    -top-1
                    animate-ping
                    text-red-500
                  "
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    m-0
                    text-xs
                    font-black
                    text-zinc-200
                  "
                >
                  {isCloseToLevelUp
                    ? "The next level is almost yours."
                    : "Stay focused. Keep earning."}
                </p>

                <p
                  className="
                    m-0
                    mt-0.5
                    truncate
                    text-[10px]
                    text-zinc-600
                  "
                >
                  Complete lectures and achievements to
                  increase your XP.
                </p>
              </div>

              <ChevronRight
                size={17}
                className="
                  shrink-0
                  text-zinc-700
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:text-red-500
                "
              />
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE — TACTICAL HUD
          ================================================= */}

          <div
            className="
              relative
              hidden
              h-[250px]
              lg:block
            "
          >
            {/* Central red glow */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-48
                w-48
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-red-950/40
                blur-3xl
                animate-pulse
              "
            />

            {/* Outer tactical ring */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-48
                w-48
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-red-900/40
                animate-[orbitSpin_15s_linear_infinite]
              "
            />

            {/* Inner tactical ring */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-36
                w-36
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-dashed
                border-zinc-700
                animate-[orbitSpinReverse_20s_linear_infinite]
              "
            />

            {/* Crosshair */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                flex
                h-40
                w-40
                -translate-x-1/2
                -translate-y-1/2
                items-center
                justify-center
              "
            >
              <div
                className="
                  absolute
                  h-full
                  w-px
                  bg-gradient-to-b
                  from-transparent
                  via-red-800/50
                  to-transparent
                "
              />

              <div
                className="
                  absolute
                  h-px
                  w-full
                  bg-gradient-to-r
                  from-transparent
                  via-red-800/50
                  to-transparent
                "
              />
            </div>

            {/* =================================================
                CENTRAL OPERATOR BADGE
            ================================================= */}

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
                animate-[mascotFloat_4s_ease-in-out_infinite]
              "
            >
              <div
                className="
                  relative
                  flex
                  h-28
                  w-28
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-red-800/70
                  bg-gradient-to-br
                  from-zinc-800
                  via-zinc-950
                  to-black
                  shadow-[0_0_35px_rgba(220,38,38,0.2)]
                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:border-red-600/70
                "
              >
                {/* Inner circle */}

                <div
                  className="
                    absolute
                    inset-3
                    rounded-full
                    border
                    border-zinc-800
                  "
                />

                <Crosshair
                  size={48}
                  strokeWidth={1}
                  className="
                    text-red-500
                    drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]
                  "
                />

                {/* Crown */}

                <Crown
                  size={18}
                  className="
                    absolute
                    right-3
                    top-1
                    animate-[crownFloat_2.5s_ease-in-out_infinite]
                    text-amber-500
                  "
                  fill="currentColor"
                />

                {/* Target dot */}

                <div
                  className="
                    absolute
                    h-2
                    w-2
                    animate-ping
                    rounded-full
                    bg-red-500
                  "
                />
              </div>

              {/* Contract status */}

              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-red-900/60
                  bg-black
                  px-4
                  py-1.5
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-red-500
                  shadow-[0_0_15px_rgba(220,38,38,0.1)]
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    animate-pulse
                    rounded-full
                    bg-red-500
                  "
                />

                {isCloseToLevelUp
                  ? "Target Acquired"
                  : "Mission Active"}
              </div>
            </div>

            {/* =================================================
                TOP LEFT — SHIELD
            ================================================= */}

            <div
              className="
                absolute
                left-1
                top-8
                flex
                h-12
                w-12
                animate-[rabbitFloat_3.5s_ease-in-out_infinite]
                items-center
                justify-center
                rounded-xl
                border
                border-zinc-800
                bg-zinc-950
                shadow-lg
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              <Shield
                size={21}
                className="
                  text-zinc-500
                  transition-colors
                  group-hover:text-red-500
                "
              />
            </div>

            {/* =================================================
                TOP RIGHT — TARGET
            ================================================= */}

            <div
              className="
                absolute
                right-2
                top-2
                flex
                h-9
                w-9
                animate-[starFloat_3s_ease-in-out_infinite]
                items-center
                justify-center
                rounded-lg
                border
                border-red-900/50
                bg-red-950/20
              "
            >
              <Target
                size={17}
                className="text-red-500"
              />
            </div>

            {/* =================================================
                BOTTOM RIGHT — AWARD
            ================================================= */}

            <div
              className="
                absolute
                bottom-8
                right-1
                flex
                h-12
                w-12
                animate-[foxFloat_4.5s_ease-in-out_infinite]
                items-center
                justify-center
                rounded-xl
                border
                border-zinc-800
                bg-zinc-950
                shadow-lg
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              <Award
                size={21}
                className="
                  text-amber-500
                  drop-shadow-[0_0_7px_rgba(245,158,11,0.3)]
                "
              />
            </div>

            {/* =================================================
                XP FLOATING BADGE
            ================================================= */}

            <div
              className="
                absolute
                bottom-1
                left-5
                flex
                animate-[xpFloat_3s_ease-in-out_infinite]
                items-center
                gap-1.5
                rounded-full
                border
                border-red-900/60
                bg-black
                px-3
                py-1.5
                text-[9px]
                font-black
                uppercase
                tracking-wider
                text-red-500
                shadow-[0_0_15px_rgba(220,38,38,0.1)]
              "
            >
              <Zap
                size={11}
                className="animate-pulse"
                fill="currentColor"
              />

              + XP
            </div>

            {/* =================================================
                ROCKET
            ================================================= */}

            <div
              className="
                absolute
                bottom-14
                left-[18%]
                animate-[rocketFloat_4s_ease-in-out_infinite]
              "
            >
              <Rocket
                size={20}
                className="text-zinc-700"
              />
            </div>

            {/* =================================================
                LEVEL BADGE
            ================================================= */}

            <div
              className="
                absolute
                right-[15%]
                top-[45%]
                flex
                items-center
                gap-1.5
                rounded-full
                border
                border-zinc-800
                bg-black
                px-2.5
                py-1.5
                shadow-lg
                animate-[badgeFloat_4s_ease-in-out_infinite]
              "
            >
              <Crown
                size={11}
                className="text-amber-500"
                fill="currentColor"
              />

              <span
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-wider
                  text-zinc-400
                "
              >
                LVL {level}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          FOOTER
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
          border-zinc-800
          pt-5
        "
      >
        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-7
              w-7
              animate-[iconFloat_3s_ease-in-out_infinite]
              items-center
              justify-center
              rounded-lg
              border
              border-red-900/50
              bg-red-950/30
            "
          >
            <Sparkles
              size={13}
              className="text-red-500"
            />
          </div>

          <span
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-zinc-600
            "
          >
            Every lesson moves you forward
          </span>
        </div>

        <div
          className="
            flex
            items-center
            gap-1.5
            text-xs
            font-black
            text-red-500
          "
        >
          Level {level + 1}

          <ChevronRight
            size={14}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </div>
      </div>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes mascotFloat {
          0%,
          100% {
            transform:
              translate(-50%, -50%)
              translateY(0);
          }

          50% {
            transform:
              translate(-50%, -50%)
              translateY(-8px);
          }
        }

        @keyframes rabbitFloat {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(0deg);
          }

          50% {
            transform:
              translateY(-8px)
              rotate(-3deg);
          }
        }

        @keyframes foxFloat {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(0deg);
          }

          50% {
            transform:
              translateY(-7px)
              rotate(3deg);
          }
        }

        @keyframes rocketFloat {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(-5deg);
          }

          50% {
            transform:
              translateY(-10px)
              rotate(4deg);
          }
        }

        @keyframes xpFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes badgeFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes trophyFloat {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(0deg);
          }

          50% {
            transform:
              translateY(-4px)
              rotate(3deg);
          }
        }

        @keyframes crownFloat {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(0deg);
          }

          50% {
            transform:
              translateY(-4px)
              rotate(4deg);
          }
        }

        @keyframes iconFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes particleFloat {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(0deg);
            opacity: 0.3;
          }

          50% {
            transform:
              translateY(-10px)
              rotate(15deg);
            opacity: 1;
          }
        }

        @keyframes starFloat {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(0deg)
              scale(1);
          }

          50% {
            transform:
              translateY(-7px)
              rotate(15deg)
              scale(1.08);
          }
        }

        @keyframes zapPulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.18);
          }
        }

        @keyframes badgePulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.2);
          }
        }

        @keyframes rotateRing {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orbitSpin {
          from {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }
        }

        @keyframes orbitSpinReverse {
          from {
            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }
        }

        @keyframes shimmer {
          0% {
            left: -50px;
          }

          100% {
            left: 110%;
          }
        }

        @keyframes scanLine {
          0% {
            transform: translateY(-5px);
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          50% {
            opacity: 0.7;
          }

          100% {
            transform: translateY(270px);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}

export default StudentXPCard;