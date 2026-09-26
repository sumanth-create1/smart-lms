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

import { memo, useMemo } from "react";
import { useAuth } from "../../../../context/AuthContext";

// =====================================================
// STATIC DATA
// =====================================================

const REALM_STATS = [
  {
    label: "LEARN",
    icon: Brain,
    color:
      "border-sky-800/40 bg-sky-950/30 text-sky-400 hover:border-sky-500/60 hover:shadow-[0_0_15px_rgba(56,189,248,0.18)]",
  },
  {
    label: "TRAIN",
    icon: Shield,
    color:
      "border-amber-800/40 bg-amber-950/30 text-amber-400 hover:border-amber-500/60 hover:shadow-[0_0_15px_rgba(245,158,11,0.18)]",
  },
  {
    label: "CONQUER",
    icon: Trophy,
    color:
      "border-violet-800/40 bg-violet-950/30 text-violet-400 hover:border-violet-500/60 hover:shadow-[0_0_15px_rgba(139,92,246,0.18)]",
  },
];

// =====================================================
// OPTIMIZED DECORATIVE PARTICLES
// =====================================================

const RealmParticles = memo(function RealmParticles() {
  return (
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
          shadow-[0_0_10px_rgba(125,211,252,0.65)]
        "
      />

      <span
        className="
          absolute left-[51%] top-24
          h-1 w-1
          rounded-full
          bg-white/60
          motion-safe:animate-[particleFloat_6s_ease-in-out_infinite]
          transform-gpu
          will-change-transform
        "
      />

      <span
        className="
          absolute left-[61%] top-16
          h-1 w-1
          rounded-full
          bg-amber-400
          shadow-[0_0_7px_rgba(245,158,11,0.55)]
        "
      />

      <span
        className="
          absolute right-[35%] bottom-24
          h-1.5 w-1.5
          rounded-full
          bg-sky-200
          shadow-[0_0_7px_rgba(125,211,252,0.55)]
        "
      />
    </div>
  );
});

// =====================================================
// REALM CARD
// =====================================================

const RealmCard = memo(function RealmCard() {
  return (
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
          transform-gpu
          transition-[transform,border-color]
          duration-700
          motion-safe:group-hover:rotate-0
          motion-safe:group-hover:scale-[1.03]
          group-hover:border-amber-700/50
        "
      >
        {/* Top line */}

        <div
          className="
            absolute left-0 top-0
            h-px w-full
            bg-gradient-to-r
            from-transparent
            via-sky-400/80
            to-transparent
          "
        />

        {/* Bottom line */}

        <div
          className="
            absolute bottom-0 left-0
            h-px w-full
            bg-gradient-to-r
            from-transparent
            via-amber-600/70
            to-transparent
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
            "
          >
            <Crown
              size={21}
              className="
                drop-shadow-[0_0_7px_rgba(251,191,36,0.65)]
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

            <span className="text-amber-400">75%</span>
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
                shadow-[0_0_10px_rgba(245,158,11,0.35)]
              "
            >
              <div
                className="
                  absolute
                  right-0
                  top-1/2
                  h-2
                  w-2
                  -translate-y-1/2
                  rounded-full
                  bg-yellow-100
                  shadow-[0_0_8px_rgba(254,240,138,0.8)]
                "
              />

              {/* Only one small animated element */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  -left-10
                  hidden
                  w-8
                  rotate-12
                  bg-white/20
                  blur-sm
                  motion-safe:group-hover:block
                  motion-safe:group-hover:animate-[realmShimmer_1.6s_linear]
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
              className="text-amber-500"
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
          motion-safe:animate-[crownFloat_7s_ease-in-out_infinite]
          will-change-transform
        "
      >
        <Crown
          size={23}
          className="drop-shadow-[0_0_8px_rgba(251,191,36,0.65)]"
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
          motion-safe:animate-[shieldFloat_8s_ease-in-out_infinite]
          will-change-transform
        "
      >
        <Shield
          size={22}
          className="drop-shadow-[0_0_7px_rgba(56,189,248,0.6)]"
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
          motion-safe:animate-[swordFloat_8s_ease-in-out_infinite]
          will-change-transform
        "
      >
        <Sword
          size={22}
          className="
            rotate-[-20deg]
            drop-shadow-[0_0_7px_rgba(226,232,240,0.45)]
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
          motion-safe:animate-[bookFloat_8s_ease-in-out_infinite]
          will-change-transform
        "
      >
        <BookOpen
          size={20}
          className="drop-shadow-[0_0_7px_rgba(139,92,246,0.6)]"
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
          motion-safe:animate-[ravenFloat_9s_ease-in-out_infinite]
          will-change-transform
        "
      >
        <Feather
          size={18}
          className="
            rotate-[-25deg]
            drop-shadow-[0_0_7px_rgba(148,163,184,0.45)]
          "
        />
      </div>

      {/* Castle */}

      <div
        className="
          absolute -bottom-16 right-20
          text-zinc-700/50
          transform-gpu
          motion-safe:animate-[castlePulse_9s_ease-in-out_infinite]
          will-change-transform
        "
      >
        <Castle size={28} />
      </div>

      {/* Static sparkles */}

      <Sparkles
        size={17}
        className="
          absolute -right-14 bottom-16
          text-amber-400
          drop-shadow-[0_0_8px_rgba(251,191,36,0.65)]
        "
      />

      <Sparkles
        size={12}
        className="
          absolute -left-20 top-1/2
          text-sky-300
          drop-shadow-[0_0_7px_rgba(125,211,252,0.65)]
        "
      />
    </div>
  );
});

// =====================================================
// MAIN COMPONENT
// =====================================================

function WelcomeBanner() {
  const { user } = useAuth();

  const firstName = useMemo(
    () => user?.name?.split(" ")[0] || "Student",
    [user?.name]
  );

  return (
    <section
      className="
        group
        relative
        isolate
        min-h-[340px]
        w-full
        overflow-hidden
        rounded-[28px]
        border
        border-zinc-700/80
        bg-[#090b0d]
        px-6
        py-7
        shadow-2xl
        shadow-black/60
        sm:px-8
        sm:py-9
        lg:min-h-[360px]
        lg:px-10
        lg:py-10
        transform-gpu
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {/* Northern glow */}

        <div
          className="
            absolute
            -right-32
            -top-32
            h-[400px]
            w-[400px]
            rounded-full
            bg-sky-900/15
            blur-[70px]
            transform-gpu
            transition-transform
            duration-1000
            motion-safe:group-hover:scale-110
          "
        />

        {/* Golden glow */}

        <div
          className="
            absolute
            -bottom-40
            left-1/3
            h-[350px]
            w-[350px]
            rounded-full
            bg-amber-700/[0.07]
            blur-[70px]
          "
        />

        {/* Central mist */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-80
            w-80
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-slate-300/[0.02]
            blur-[55px]
          "
        />

        {/* Stone texture */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06)_1px,transparent_1px)]
            opacity-[0.07]
            [background-size:28px_28px]
          "
        />

        {/* Diagonal texture */}

        <div
          className="
            absolute
            inset-0
            bg-[repeating-linear-gradient(135deg,transparent,transparent_12px,rgba(255,255,255,0.06)_13px,transparent_14px)]
            opacity-[0.025]
          "
        />

        {/* Castle silhouette */}

        <div
          className="
            absolute
            bottom-0
            right-0
            h-40
            w-[520px]
            opacity-[0.05]
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

        {/* Cinematic lines */}

        <div
          className="
            absolute
            left-0
            top-16
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-slate-500/20
            to-transparent
          "
        />

        <div
          className="
            absolute
            bottom-16
            left-0
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-amber-600/15
            to-transparent
          "
        />

        {/* Corners */}

        <div
          className="
            absolute
            right-6
            top-6
            h-16
            w-16
            border-r
            border-t
            border-amber-600/25
          "
        />

        <div
          className="
            absolute
            bottom-6
            left-6
            h-16
            w-16
            border-b
            border-l
            border-amber-600/25
          "
        />

        <RealmParticles />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 max-w-3xl">
        {/* Realm status */}

        <div
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-amber-700/40
            bg-amber-950/25
            px-3.5
            py-2
            text-xs
            font-bold
            tracking-[0.18em]
            text-amber-400
            shadow-[0_0_15px_rgba(146,64,14,0.12)]
            backdrop-blur-sm
            transition-colors
            duration-300
            hover:border-amber-500/60
            hover:bg-amber-900/25
          "
        >
          <Crown
            size={14}
            aria-hidden="true"
            className="
              drop-shadow-[0_0_5px_rgba(251,191,36,0.7)]
            "
          />

          <span>
            THE REALM AWAITS · YOUR JOURNEY CONTINUES
          </span>
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
              drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]
            "
          >
            {firstName}
          </span>
          .
        </h1>

        {/* Subtitle */}

        <p
          className="
            m-0
            mt-4
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
            border
            border-amber-600/50
            bg-gradient-to-r
            from-amber-700
            via-amber-600
            to-yellow-600
            px-5
            py-3
            text-sm
            font-black
            tracking-wide
            text-black
            shadow-lg
            shadow-amber-950/40
            transform-gpu
            transition-[transform,box-shadow]
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]
            active:translate-y-0
          "
        >
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              -left-20
              hidden
              w-10
              rotate-[20deg]
              bg-white/30
              blur-md
              motion-safe:group-hover:block
              motion-safe:group-hover:animate-[buttonSweep_700ms_ease-out]
            "
          />

          <Sword
            size={17}
            aria-hidden="true"
            className="relative"
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
            STATS
        ===================================================== */}

        <div
          className="
            mt-7
            flex
            flex-wrap
            items-center
            gap-5
            text-xs
            font-semibold
            tracking-wide
            text-slate-500
          "
        >
          {REALM_STATS.map(
            ({ label, icon: Icon, color }, index) => (
              <div
                key={label}
                className="contents"
              >
                <div className="group/stat flex items-center gap-2">
                  <div
                    className={`
                      rounded-lg
                      border
                      p-2
                      transition-[transform,border-color,box-shadow]
                      duration-300
                      group-hover/stat:-translate-y-1
                      ${color}
                    `}
                  >
                    <Icon
                      size={15}
                      aria-hidden="true"
                    />
                  </div>

                  <span>{label}</span>
                </div>

                {index < REALM_STATS.length - 1 && (
                  <div className="h-5 w-px bg-zinc-800" />
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* =====================================================
          RIGHT CARD
      ===================================================== */}

      <RealmCard />

      {/* =====================================================
          BOTTOM LINE
      ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-[2px]
          w-full
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
          absolute
          inset-y-0
          -left-40
          hidden
          w-20
          skew-x-[-20deg]
          bg-sky-300/[0.07]
          blur-md
          motion-safe:group-hover:block
          motion-safe:group-hover:animate-[lightSweep_1.8s_ease-out]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-y-0
          -left-40
          hidden
          w-8
          skew-x-[-20deg]
          bg-amber-300/[0.07]
          blur-sm
          motion-safe:group-hover:block
          motion-safe:group-hover:animate-[lightSweep_2.2s_ease-out]
        "
      />

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes particleFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: .4;
          }

          50% {
            transform: translate3d(0, -7px, 0);
            opacity: .8;
          }
        }

        @keyframes crownFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-4deg);
          }

          50% {
            transform: translate3d(0, -7px, 0) rotate(4deg);
          }
        }

        @keyframes shieldFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -6px, 0) rotate(-3deg);
          }
        }

        @keyframes swordFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-20deg);
          }

          50% {
            transform: translate3d(0, -7px, 0) rotate(-12deg);
          }
        }

        @keyframes bookFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -7px, 0);
          }
        }

        @keyframes ravenFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-25deg);
          }

          50% {
            transform: translate3d(-7px, -6px, 0) rotate(-15deg);
          }
        }

        @keyframes castlePulse {
          0%, 100% {
            opacity: .25;
          }

          50% {
            opacity: .4;
          }
        }

        @keyframes realmShimmer {
          from {
            transform: translateX(-40px) rotate(12deg);
          }

          to {
            transform: translateX(300px) rotate(12deg);
          }
        }

        @keyframes buttonSweep {
          from {
            transform: translateX(0) rotate(20deg);
          }

          to {
            transform: translateX(260px) rotate(20deg);
          }
        }

        @keyframes lightSweep {
          from {
            left: -10%;
          }

          to {
            left: 110%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .motion-safe\\:animate-\\[particleFloat_6s_ease-in-out_infinite\\],
          .motion-safe\\:animate-\\[crownFloat_7s_ease-in-out_infinite\\],
          .motion-safe\\:animate-\\[shieldFloat_8s_ease-in-out_infinite\\],
          .motion-safe\\:animate-\\[swordFloat_8s_ease-in-out_infinite\\],
          .motion-safe\\:animate-\\[bookFloat_8s_ease-in-out_infinite\\],
          .motion-safe\\:animate-\\[ravenFloat_9s_ease-in-out_infinite\\],
          .motion-safe\\:animate-\\[castlePulse_9s_ease-in-out_infinite\\] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default memo(WelcomeBanner);