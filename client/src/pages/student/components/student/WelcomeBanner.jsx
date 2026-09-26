import {
  ArrowRight,
  BookOpen,
  Brain,
  Castle,
  Crown,
  Feather,
  Flame,
  Shield,
  Sparkles,
  Sword,
  Trophy,
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";

function WelcomeBanner() {
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] || "Student";

  return (
    <section
      className="
        group relative isolate
        min-h-[340px] w-full
        overflow-hidden
        rounded-[28px]
        border border-zinc-700/80
        bg-[#090b0d]
        px-6 py-7
        shadow-2xl shadow-black/60
        sm:px-8 sm:py-9
        lg:min-h-[360px]
        lg:px-10 lg:py-10
      "
    >
      {/* =====================================================
          ATMOSPHERIC BACKGROUND
      ===================================================== */}

      {/* Northern glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-32 -top-32
          h-[400px] w-[400px]
          rounded-full
          bg-sky-900/20
          blur-[90px]
          transition-transform
          duration-[1400ms]
          motion-safe:group-hover:scale-125
        "
      />

      {/* Golden glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -bottom-40 left-1/3
          h-[350px] w-[350px]
          rounded-full
          bg-amber-700/10
          blur-[90px]
          motion-safe:animate-[realmGlow_5s_ease-in-out_infinite]
        "
      />

      {/* Central mist */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-1/2 top-1/2
          h-80 w-80
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-slate-300/[0.025]
          blur-[70px]
        "
      />

      {/* Stone texture */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0
          opacity-[0.09]
          bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08)_1px,transparent_1px)]
          [background-size:28px_28px]
        "
      />

      {/* Diagonal texture */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0
          opacity-[0.035]
          bg-[repeating-linear-gradient(
            135deg,
            transparent,
            transparent_12px,
            rgba(255,255,255,0.08)_13px,
            transparent_14px
          )]
        "
      />

      {/* =====================================================
          CASTLE SILHOUETTE
      ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute bottom-0 right-0
          h-40 w-[520px]
          opacity-[0.07]
        "
      >
        <div className="absolute bottom-0 right-10 h-28 w-20 bg-slate-300" />
        <div className="absolute bottom-0 right-36 h-36 w-24 bg-slate-300" />
        <div className="absolute bottom-0 right-64 h-24 w-16 bg-slate-300" />
        <div className="absolute bottom-0 right-80 h-32 w-20 bg-slate-300" />

        <div className="absolute bottom-28 right-10 h-12 w-20 bg-slate-300" />
        <div className="absolute bottom-36 right-36 h-12 w-24 bg-slate-300" />
        <div className="absolute bottom-24 right-64 h-12 w-16 bg-slate-300" />
      </div>

      {/* =====================================================
          CINEMATIC LINES
      ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-0 top-16
          h-px w-full
          bg-gradient-to-r
          from-transparent
          via-slate-500/25
          to-transparent
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute bottom-16 left-0
          h-px w-full
          bg-gradient-to-r
          from-transparent
          via-amber-600/20
          to-transparent
        "
      />

      {/* =====================================================
          MEDIEVAL CORNERS
      ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute right-6 top-6
          h-16 w-16
          border-r border-t
          border-amber-600/30
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute bottom-6 left-6
          h-16 w-16
          border-b border-l
          border-amber-600/30
        "
      />

      {/* =====================================================
          LIGHT PARTICLES
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <span
          className="
            absolute left-[43%] top-12
            h-1.5 w-1.5
            rounded-full
            bg-sky-300
            shadow-[0_0_12px_rgba(125,211,252,0.8)]
            motion-safe:animate-pulse
          "
        />

        <span
          className="
            absolute left-[51%] top-24
            h-1 w-1
            rounded-full
            bg-white/70
            motion-safe:animate-[particleFloat_4s_ease-in-out_infinite]
          "
        />

        <span
          className="
            absolute left-[61%] top-16
            h-1 w-1
            rounded-full
            bg-amber-400
            shadow-[0_0_8px_rgba(245,158,11,0.7)]
            motion-safe:animate-pulse
          "
        />

        <span
          className="
            absolute right-[35%] bottom-24
            h-1.5 w-1.5
            rounded-full
            bg-sky-200
            shadow-[0_0_8px_rgba(125,211,252,0.7)]
            motion-safe:animate-pulse
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 max-w-3xl">

        {/* Realm Status */}
        <div
          className="
            mb-5 inline-flex
            items-center gap-2
            rounded-full
            border border-amber-700/40
            bg-amber-950/30
            px-3.5 py-2
            text-xs font-bold
            tracking-[0.18em]
            text-amber-400
            shadow-[0_0_20px_rgba(146,64,14,0.16)]
            backdrop-blur-sm
            transition-colors
            duration-300
            hover:border-amber-500/70
            hover:bg-amber-900/30
          "
        >
          <Crown
            size={14}
            aria-hidden="true"
            className="
              motion-safe:animate-pulse
              drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]
            "
          />

          <span>THE REALM AWAITS · YOUR JOURNEY CONTINUES</span>
        </div>

        {/* Heading */}
        <h1
          className="
            m-0
            max-w-2xl
            text-3xl
            font-black
            leading-[1.05]
            tracking-tight
            text-white
            sm:text-4xl
            lg:text-5xl
          "
        >
          Welcome back{" "}

          <span
            className="
              bg-gradient-to-r
              from-amber-300
              via-yellow-200
              to-amber-500
              bg-clip-text
              text-transparent
              drop-shadow-[0_0_18px_rgba(245,158,11,0.25)]
              transition-[filter]
              duration-500
              motion-safe:group-hover:drop-shadow-[0_0_25px_rgba(245,158,11,0.45)]
            "
          >
            {firstName}
          </span>
          .
        </h1>

        {/* Subtitle */}
        <p
          className="
            m-0 mt-4
            max-w-xl
            text-sm
            leading-6
            text-slate-400
            sm:text-base
            sm:leading-7
          "
        >
          The road ahead is long and the realm demands strength.

          <span className="font-semibold text-slate-200">
            {" "}Learn. Master. Conquer.
          </span>{" "}

          Every lesson sharpens your blade for the battles ahead.
        </p>

        {/* CTA */}
        <button
          type="button"
          className="
            relative
            mt-7
            inline-flex
            items-center
            gap-3
            overflow-hidden
            rounded-xl
            border border-amber-600/50
            bg-gradient-to-r
            from-amber-700
            via-amber-600
            to-yellow-600
            px-5 py-3
            text-sm font-black
            tracking-wide
            text-black
            shadow-lg shadow-amber-950/40
            transition-[transform,box-shadow]
            duration-300
            hover:-translate-y-1
            hover:scale-[1.02]
            hover:shadow-[0_0_35px_rgba(245,158,11,0.3)]
            active:translate-y-0
            active:scale-100
          "
        >
          {/* Sweep */}
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute inset-y-0 -left-20
              w-10
              rotate-[20deg]
              bg-white/35
              blur-md
              transition-[left]
              duration-700
              motion-safe:group-hover:left-[120%]
            "
          />

          <Sword
            size={17}
            aria-hidden="true"
            className="
              relative
              transition-transform
              duration-500
              motion-safe:group-hover:rotate-[-15deg]
            "
          />

          <span className="relative">
            CONTINUE YOUR QUEST
          </span>

          <ArrowRight
            size={17}
            aria-hidden="true"
            className="
              relative
              transition-transform
              duration-300
              motion-safe:group-hover:translate-x-1
            "
          />
        </button>

        {/* =====================================================
            REALM STATS
        ===================================================== */}

        <div
          className="
            mt-7
            flex flex-wrap
            items-center
            gap-5
            text-xs
            font-semibold
            tracking-wide
            text-slate-500
          "
        >
          {/* Learn */}
          <div className="group/stat flex items-center gap-2">
            <div
              className="
                rounded-lg
                border border-sky-800/40
                bg-sky-950/30
                p-2
                text-sky-400
                transition-[transform,border-color,box-shadow]
                duration-300
                group-hover/stat:-translate-y-1
                group-hover/stat:border-sky-500/60
                group-hover/stat:shadow-[0_0_15px_rgba(56,189,248,0.18)]
              "
            >
              <Brain size={15} aria-hidden="true" />
            </div>

            <span>LEARN</span>
          </div>

          <div className="h-5 w-px bg-zinc-800" />

          {/* Train */}
          <div className="group/stat flex items-center gap-2">
            <div
              className="
                rounded-lg
                border border-amber-800/40
                bg-amber-950/30
                p-2
                text-amber-400
                transition-[transform,border-color,box-shadow]
                duration-300
                group-hover/stat:-translate-y-1
                group-hover/stat:border-amber-500/60
                group-hover/stat:shadow-[0_0_15px_rgba(245,158,11,0.18)]
              "
            >
              <Shield size={15} aria-hidden="true" />
            </div>

            <span>TRAIN</span>
          </div>

          <div className="h-5 w-px bg-zinc-800" />

          {/* Conquer */}
          <div className="group/stat flex items-center gap-2">
            <div
              className="
                rounded-lg
                border border-violet-800/40
                bg-violet-950/30
                p-2
                text-violet-400
                transition-[transform,border-color,box-shadow]
                duration-300
                group-hover/stat:-translate-y-1
                group-hover/stat:border-violet-500/60
                group-hover/stat:shadow-[0_0_15px_rgba(139,92,246,0.18)]
              "
            >
              <Trophy size={15} aria-hidden="true" />
            </div>

            <span>CONQUER</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT REALM CARD
      ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute right-8 top-1/2
          hidden
          -translate-y-1/2
          lg:block
        "
      >
        {/* Main card */}
        <div
          className="
            relative
            flex h-52 w-72
            rotate-[-3deg]
            flex-col
            justify-between
            overflow-hidden
            rounded-2xl
            border border-zinc-700/70
            bg-gradient-to-br
            from-[#17191b]
            via-[#101214]
            to-[#070809]
            p-5
            shadow-2xl shadow-black
            transition-[transform,border-color]
            duration-700
            transform-gpu
            motion-safe:group-hover:rotate-0
            motion-safe:group-hover:scale-105
            group-hover:border-amber-700/50
          "
        >
          {/* Top light */}
          <div
            className="
              absolute left-0 top-0
              h-px w-full
              bg-gradient-to-r
              from-transparent
              via-sky-400
              to-transparent
              opacity-80
            "
          />

          {/* Bottom gold line */}
          <div
            className="
              absolute bottom-0 left-0
              h-px w-full
              bg-gradient-to-r
              from-transparent
              via-amber-600
              to-transparent
              opacity-70
            "
          />

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p
                className="
                  m-0
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-zinc-600
                "
              >
                Realm Status
              </p>

              <p
                className="
                  m-0 mt-1
                  text-xl
                  font-black
                  tracking-tight
                  text-white
                "
              >
                HONOR IN PROGRESS
              </p>
            </div>

            <div
              className="
                rounded-xl
                border border-amber-700/40
                bg-amber-950/30
                p-2
                text-amber-400
                shadow-[0_0_18px_rgba(146,64,14,0.18)]
              "
            >
              <Crown
                size={21}
                className="
                  motion-safe:animate-pulse
                  drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]
                "
              />
            </div>
          </div>

          {/* Progress */}
          <div>
            <div
              className="
                mb-2
                flex justify-between
                text-[10px]
                font-bold
                uppercase
                tracking-widest
                text-zinc-600
              "
            >
              <span>Today's conquest</span>

              <span className="text-amber-400">
                75%
              </span>
            </div>

            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={75}
              aria-label="Today's conquest progress"
              className="
                relative
                h-2
                overflow-hidden
                rounded-full
                bg-zinc-800
              "
            >
              <div
                className="
                  relative
                  h-full
                  w-[75%]
                  overflow-hidden
                  rounded-full
                  bg-gradient-to-r
                  from-amber-900
                  via-amber-600
                  to-yellow-300
                  shadow-[0_0_12px_rgba(245,158,11,0.45)]
                "
              >
                {/* Progress light */}
                <div
                  className="
                    absolute
                    right-0 top-1/2
                    h-2.5 w-2.5
                    -translate-y-1/2
                    rounded-full
                    bg-yellow-100
                    shadow-[0_0_10px_rgba(254,240,138,0.9)]
                  "
                />

                {/* Shimmer */}
                <div
                  className="
                    absolute inset-y-0 -left-10
                    w-8
                    rotate-12
                    bg-white/25
                    blur-sm
                    motion-safe:animate-[realmShimmer_3s_linear_infinite]
                  "
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.15em]
                text-zinc-600
              "
            >
              WINTER IS COMING
            </span>

            <div className="flex items-center gap-1.5 text-zinc-500">
              <Flame
                size={12}
                className="
                  text-amber-500
                  motion-safe:animate-pulse
                "
              />

              <span className="text-[10px] font-bold">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Floating crown */}
        <div
          className="
            absolute -left-12 -top-12
            rounded-2xl
            border border-amber-700/40
            bg-black/80
            p-3
            text-amber-400
            shadow-xl shadow-amber-950/30
            transform-gpu
            motion-safe:animate-[crownFloat_5s_ease-in-out_infinite]
          "
        >
          <Crown
            size={23}
            className="drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
          />
        </div>

        {/* Floating shield */}
        <div
          className="
            absolute -bottom-10 -left-10
            rounded-2xl
            border border-sky-800/50
            bg-zinc-950/90
            p-3
            text-sky-400
            shadow-xl shadow-sky-950/30
            transform-gpu
            motion-safe:animate-[shieldFloat_6s_ease-in-out_infinite]
          "
        >
          <Shield
            size={22}
            className="drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]"
          />
        </div>

        {/* Floating sword */}
        <div
          className="
            absolute -right-9 -top-11
            rounded-2xl
            border border-zinc-700
            bg-black/90
            p-3
            text-slate-300
            shadow-xl shadow-black
            transform-gpu
            motion-safe:animate-[swordFloat_5s_ease-in-out_infinite]
          "
        >
          <Sword
            size={22}
            className="
              rotate-[-20deg]
              drop-shadow-[0_0_8px_rgba(226,232,240,0.5)]
            "
          />
        </div>

        {/* Floating book */}
        <div
          className="
            absolute -right-12 bottom-4
            rounded-2xl
            border border-violet-800/40
            bg-zinc-950/90
            p-3
            text-violet-400
            shadow-xl
            transform-gpu
            motion-safe:animate-[bookFloat_6s_ease-in-out_infinite]
          "
        >
          <BookOpen
            size={20}
            className="drop-shadow-[0_0_8px_rgba(139,92,246,0.7)]"
          />
        </div>

        {/* Raven */}
        <div
          className="
            absolute -right-16 top-1/2
            rounded-full
            border border-zinc-700
            bg-black/80
            p-2.5
            text-slate-400
            shadow-xl
            transform-gpu
            motion-safe:animate-[ravenFloat_7s_ease-in-out_infinite]
          "
        >
          <Feather
            size={18}
            className="
              rotate-[-25deg]
              drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]
            "
          />
        </div>

        {/* Castle */}
        <div
          className="
            absolute -bottom-16 right-20
            text-zinc-700/50
            transform-gpu
            motion-safe:animate-[castlePulse_6s_ease-in-out_infinite]
          "
        >
          <Castle size={28} />
        </div>

        {/* Sparkle */}
        <Sparkles
          size={17}
          className="
            absolute -right-14 bottom-16
            text-amber-400
            drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]
            motion-safe:animate-pulse
          "
        />

        <Sparkles
          size={12}
          className="
            absolute -left-20 top-1/2
            text-sky-300
            drop-shadow-[0_0_8px_rgba(125,211,252,0.8)]
            motion-safe:animate-pulse
          "
        />
      </div>

      {/* =====================================================
          BOTTOM REALM LINE
      ===================================================== */}

      <div
        aria-hidden="true"
        className="
          absolute bottom-0 left-0
          h-[2px] w-full
          bg-gradient-to-r
          from-transparent
          via-amber-700
          to-transparent
          opacity-70
        "
      />

      {/* =====================================================
          LIGHT SWEEP
      ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-y-0 -left-40
          w-24
          skew-x-[-20deg]
          bg-sky-300/10
          blur-lg
          transition-[left]
          duration-[1800ms]
          motion-safe:group-hover:left-[110%]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-y-0 -left-40
          w-8
          skew-x-[-20deg]
          bg-amber-300/10
          blur-md
          transition-[left]
          duration-[2200ms]
          motion-safe:group-hover:left-[120%]
        "
      />

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes realmGlow {
          0%, 100% {
            opacity: 0.55;
            transform: scale(1);
          }

          50% {
            opacity: 0.8;
            transform: scale(1.04);
          }
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.45;
          }

          50% {
            transform: translate3d(0, -8px, 0);
            opacity: 0.9;
          }
        }

        @keyframes crownFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-4deg);
          }

          50% {
            transform: translate3d(0, -8px, 0) rotate(4deg);
          }
        }

        @keyframes shieldFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -7px, 0) rotate(-4deg);
          }
        }

        @keyframes swordFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-20deg);
          }

          50% {
            transform: translate3d(0, -8px, 0) rotate(-12deg);
          }
        }

        @keyframes bookFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -8px, 0);
          }
        }

        @keyframes ravenFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-25deg);
          }

          50% {
            transform: translate3d(-8px, -7px, 0) rotate(-15deg);
          }
        }

        @keyframes castlePulse {
          0%, 100% {
            opacity: 0.3;
            transform: translate3d(0, 0, 0);
          }

          50% {
            opacity: 0.5;
            transform: translate3d(0, -3px, 0);
          }
        }

        @keyframes realmShimmer {
          0% {
            transform: translateX(-40px) rotate(12deg);
          }

          100% {
            transform: translateX(260px) rotate(12deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </section>
  );
}

export default WelcomeBanner;