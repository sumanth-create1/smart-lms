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
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";

function WelcomeBanner() {
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] || "Student";

  return (
    <section
      className="
        group relative
        min-h-[340px]
        w-full
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
          MEDIEVAL REALM BACKGROUND
      ===================================================== */}

      {/* Deep blue northern glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-[420px]
          w-[420px]
          rounded-full
          bg-sky-900/20
          blur-[110px]
          transition-all
          duration-[1800ms]
          group-hover:scale-125
          group-hover:bg-sky-800/30
        "
      />

      {/* Golden throne glow */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          left-1/3
          h-[380px]
          w-[380px]
          rounded-full
          bg-amber-700/10
          blur-[120px]
          animate-pulse
        "
      />

      {/* Central mist */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-96
          w-96
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-slate-300/[0.025]
          blur-[90px]
        "
      />

      {/* Stone texture */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.12]
          bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08)_1px,transparent_1px)]
          [background-size:28px_28px]
        "
      />

      {/* Medieval diagonal texture */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.05]
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
        className="
          pointer-events-none
          absolute
          bottom-0
          right-0
          h-40
          w-[520px]
          opacity-[0.08]
        "
      >
        <div className="absolute bottom-0 right-10 h-28 w-20 bg-slate-300" />

        <div className="absolute bottom-0 right-36 h-36 w-24 bg-slate-300" />

        <div className="absolute bottom-0 right-64 h-24 w-16 bg-slate-300" />

        <div className="absolute bottom-0 right-80 h-32 w-20 bg-slate-300" />

        {/* Towers */}
        <div className="absolute bottom-28 right-10 h-12 w-20 bg-slate-300" />
        <div className="absolute bottom-36 right-36 h-12 w-24 bg-slate-300" />
        <div className="absolute bottom-24 right-64 h-12 w-16 bg-slate-300" />
      </div>

      {/* =====================================================
          CINEMATIC HORIZONTAL LINES
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-16
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-slate-500/30
          to-transparent
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-16
          left-0
          h-px
          w-full
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
        className="
          pointer-events-none
          absolute
          right-6
          top-6
          h-16
          w-16
          border-r
          border-t
          border-amber-600/30
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-6
          left-6
          h-16
          w-16
          border-b
          border-l
          border-amber-600/30
        "
      />

      {/* =====================================================
          FLOATING SNOW / EMBERS
      ===================================================== */}

      <span
        className="
          absolute
          left-[43%]
          top-12
          h-1.5
          w-1.5
          rounded-full
          bg-sky-300
          shadow-[0_0_14px_rgba(125,211,252,0.9)]
          animate-ping
        "
      />

      <span
        className="
          absolute
          left-[51%]
          top-24
          h-1
          w-1
          rounded-full
          bg-white/70
          animate-bounce
          [animation-duration:4s]
        "
      />

      <span
        className="
          absolute
          left-[61%]
          top-16
          h-1
          w-1
          rounded-full
          bg-amber-400
          shadow-[0_0_10px_rgba(245,158,11,0.8)]
          animate-pulse
        "
      />

      <span
        className="
          absolute
          right-[35%]
          bottom-24
          h-1.5
          w-1.5
          rounded-full
          bg-sky-200
          shadow-[0_0_10px_rgba(125,211,252,0.8)]
          animate-pulse
        "
      />

      <span
        className="
          absolute
          right-[48%]
          top-32
          h-1
          w-1
          rounded-full
          bg-white/60
          animate-ping
        "
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 max-w-3xl">

        {/* Realm Status */}
        <div
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-amber-700/40
            bg-amber-950/30
            px-3.5
            py-2
            text-xs
            font-bold
            tracking-[0.18em]
            text-amber-400
            shadow-[0_0_25px_rgba(146,64,14,0.18)]
            backdrop-blur-md
            transition-all
            duration-300
            hover:border-amber-500/70
            hover:bg-amber-900/30
            hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]
          "
        >
          <Crown
            size={14}
            className="
              animate-pulse
              drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]
            "
          />

          <span>THE REALM AWAITS · YOUR JOURNEY CONTINUES</span>
        </div>

        {/* =================================================
            HEADING
        ================================================= */}

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
          Welcome back,{" "}

          <span
            className="
              bg-gradient-to-r
              from-amber-300
              via-yellow-200
              to-amber-500
              bg-clip-text
              text-transparent
              drop-shadow-[0_0_18px_rgba(245,158,11,0.25)]
              transition-all
              duration-500
              group-hover:drop-shadow-[0_0_25px_rgba(245,158,11,0.45)]
            "
          >
            {firstName}
          </span>
          .
        </h1>

        {/* =================================================
            SUBTITLE
        ================================================= */}

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

        {/* =================================================
            CTA
        ================================================= */}

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
            transition-all
            duration-300
            hover:-translate-y-1
            hover:scale-[1.02]
            hover:shadow-[0_0_35px_rgba(245,158,11,0.3)]
            active:translate-y-0
            active:scale-100
          "
        >
          {/* Golden sword sweep */}
          <span
            className="
              absolute
              inset-y-0
              -left-20
              w-10
              rotate-[20deg]
              bg-white/40
              blur-md
              transition-all
              duration-700
              group-hover:left-[120%]
            "
          />

          <Sword
            size={17}
            className="
              relative
              transition-transform
              duration-500
              group-hover:rotate-[-15deg]
            "
          />

          <span className="relative">
            CONTINUE YOUR QUEST
          </span>

          <ArrowRight
            size={17}
            className="
              relative
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </button>

        {/* =================================================
            REALM STATS
        ================================================= */}

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
          {/* Learn */}
          <div className="group/stat flex items-center gap-2">
            <div
              className="
                rounded-lg
                border
                border-sky-800/40
                bg-sky-950/30
                p-2
                text-sky-400
                transition-all
                duration-300
                group-hover/stat:-translate-y-1
                group-hover/stat:border-sky-500/60
                group-hover/stat:shadow-[0_0_15px_rgba(56,189,248,0.2)]
              "
            >
              <Brain size={15} />
            </div>

            <span>LEARN</span>
          </div>

          <div className="h-5 w-px bg-zinc-800" />

          {/* Train */}
          <div className="group/stat flex items-center gap-2">
            <div
              className="
                rounded-lg
                border
                border-amber-800/40
                bg-amber-950/30
                p-2
                text-amber-400
                transition-all
                duration-300
                group-hover/stat:-translate-y-1
                group-hover/stat:border-amber-500/60
                group-hover/stat:shadow-[0_0_15px_rgba(245,158,11,0.2)]
              "
            >
              <Shield size={15} />
            </div>

            <span>TRAIN</span>
          </div>

          <div className="h-5 w-px bg-zinc-800" />

          {/* Conquer */}
          <div className="group/stat flex items-center gap-2">
            <div
              className="
                rounded-lg
                border
                border-violet-800/40
                bg-violet-950/30
                p-2
                text-violet-400
                transition-all
                duration-300
                group-hover/stat:-translate-y-1
                group-hover/stat:border-violet-500/60
                group-hover/stat:shadow-[0_0_15px_rgba(139,92,246,0.2)]
              "
            >
              <Trophy size={15} />
            </div>

            <span>CONQUER</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE — REALM STATUS CARD
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-8
          top-1/2
          hidden
          -translate-y-1/2
          lg:block
        "
      >
        {/* =================================================
            MAIN REALM CARD
        ================================================= */}

        <div
          className="
            relative
            flex
            h-52
            w-72
            rotate-[-3deg]
            flex-col
            justify-between
            overflow-hidden
            rounded-2xl
            border
            border-zinc-700/70
            bg-gradient-to-br
            from-[#17191b]
            via-[#101214]
            to-[#070809]
            p-5
            shadow-2xl
            shadow-black
            transition-all
            duration-700
            group-hover:rotate-0
            group-hover:scale-105
            group-hover:border-amber-700/50
          "
        >
          {/* Moving northern light */}
          <div
            className="
              absolute
              left-0
              top-0
              h-px
              w-full
              bg-gradient-to-r
              from-transparent
              via-sky-400
              to-transparent
              shadow-[0_0_15px_rgba(56,189,248,0.8)]
              animate-pulse
            "
          />

          {/* Gold bottom border */}
          <div
            className="
              absolute
              bottom-0
              left-0
              h-px
              w-full
              bg-gradient-to-r
              from-transparent
              via-amber-600
              to-transparent
              opacity-70
            "
          />

          {/* Card Header */}
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
                  m-0
                  mt-1
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
                relative
                rounded-xl
                border
                border-amber-700/40
                bg-amber-950/30
                p-2
                text-amber-400
                shadow-[0_0_20px_rgba(146,64,14,0.2)]
              "
            >
              <Crown
                size={21}
                className="
                  animate-pulse
                  drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]
                "
              />

              {/* crown glow */}
              <span
                className="
                  absolute
                  inset-0
                  rounded-xl
                  bg-amber-400/10
                  blur-md
                  animate-pulse
                "
              />
            </div>
          </div>

          {/* Progress */}
          <div>
            <div
              className="
                mb-2
                flex
                justify-between
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
                  rounded-full
                  bg-gradient-to-r
                  from-amber-900
                  via-amber-600
                  to-yellow-300
                  shadow-[0_0_14px_rgba(245,158,11,0.55)]
                "
              >
                {/* Moving light */}
                <div
                  className="
                    absolute
                    right-0
                    top-1/2
                    h-3
                    w-3
                    -translate-y-1/2
                    rounded-full
                    bg-yellow-100
                    shadow-[0_0_12px_rgba(254,240,138,0.95)]
                    animate-pulse
                  "
                />

                {/* Shimmer */}
                <div
                  className="
                    absolute
                    inset-y-0
                    -left-10
                    w-8
                    rotate-12
                    bg-white/30
                    blur-sm
                    animate-[realmShimmer_2.5s_infinite]
                  "
                />
              </div>
            </div>
          </div>

          {/* Bottom Info */}
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

            <div
              className="
                flex
                items-center
                gap-1.5
                text-zinc-500
              "
            >
              <Flame
                size={12}
                className="
                  text-amber-500
                  animate-pulse
                "
              />

              <span className="text-[10px] font-bold">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            FLOATING CROWN
        ================================================= */}

        <div
          className="
            absolute
            -left-12
            -top-12
            rounded-2xl
            border
            border-amber-700/40
            bg-black/80
            p-3
            text-amber-400
            shadow-xl
            shadow-amber-950/30
            backdrop-blur-lg
            animate-[crownFloat_4s_ease-in-out_infinite]
          "
        >
          <Crown
            size={23}
            className="
              drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]
            "
          />
        </div>

        {/* =================================================
            FLOATING SHIELD
        ================================================= */}

        <div
          className="
            absolute
            -bottom-10
            -left-10
            rounded-2xl
            border
            border-sky-800/50
            bg-zinc-950/90
            p-3
            text-sky-400
            shadow-xl
            shadow-sky-950/30
            animate-[shieldFloat_5s_ease-in-out_infinite]
          "
        >
          <Shield
            size={22}
            className="
              drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]
            "
          />
        </div>

        {/* =================================================
            FLOATING SWORD
        ================================================= */}

        <div
          className="
            absolute
            -right-9
            -top-11
            rounded-2xl
            border
            border-zinc-700
            bg-black/90
            p-3
            text-slate-300
            shadow-xl
            shadow-black
            animate-[swordFloat_4s_ease-in-out_infinite]
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

        {/* =================================================
            FLOATING BOOK
        ================================================= */}

        <div
          className="
            absolute
            -right-12
            bottom-4
            rounded-2xl
            border
            border-violet-800/40
            bg-zinc-950/90
            p-3
            text-violet-400
            shadow-xl
            animate-[bookFloat_5s_ease-in-out_infinite]
          "
        >
          <BookOpen
            size={20}
            className="
              drop-shadow-[0_0_8px_rgba(139,92,246,0.7)]
            "
          />
        </div>

        {/* =================================================
            FLOATING RAVEN
        ================================================= */}

        <div
          className="
            absolute
            -right-16
            top-1/2
            rounded-full
            border
            border-zinc-700
            bg-black/80
            p-2.5
            text-slate-400
            shadow-xl
            backdrop-blur-md
            animate-[ravenFloat_6s_ease-in-out_infinite]
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

        {/* =================================================
            CASTLE
        ================================================= */}

        <div
          className="
            absolute
            -bottom-16
            right-20
            text-zinc-700/50
            animate-[castlePulse_5s_ease-in-out_infinite]
          "
        >
          <Castle size={28} />
        </div>

        {/* =================================================
            SPARKLES
        ================================================= */}

        <Sparkles
          size={17}
          className="
            absolute
            -right-14
            bottom-16
            text-amber-400
            drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]
            animate-ping
          "
        />

        <Sparkles
          size={12}
          className="
            absolute
            -left-20
            top-1/2
            text-sky-300
            drop-shadow-[0_0_8px_rgba(125,211,252,0.8)]
            animate-pulse
          "
        />
      </div>

      {/* =====================================================
          BOTTOM REALM LINE
      ===================================================== */}

      <div
        className="
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
          ICE LIGHT SWEEP
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          -left-40
          w-24
          skew-x-[-20deg]
          bg-sky-300/10
          blur-xl
          transition-all
          duration-[1800ms]
          group-hover:left-[110%]
        "
      />

      {/* =====================================================
          GOLD LIGHT SWEEP
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          -left-40
          w-8
          skew-x-[-20deg]
          bg-amber-300/10
          blur-md
          transition-all
          duration-[2200ms]
          group-hover:left-[120%]
        "
      />

      {/* =====================================================
          CUSTOM ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes crownFloat {
          0%, 100% {
            transform: translateY(0) rotate(-4deg);
          }

          50% {
            transform: translateY(-10px) rotate(4deg);
          }
        }

        @keyframes shieldFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-8px) rotate(-5deg);
          }
        }

        @keyframes swordFloat {
          0%, 100% {
            transform: translateY(0) rotate(-20deg);
          }

          50% {
            transform: translateY(-9px) rotate(-10deg);
          }
        }

        @keyframes bookFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes ravenFloat {
          0%, 100% {
            transform: translate(0, 0) rotate(-25deg);
          }

          50% {
            transform: translate(-10px, -8px) rotate(-15deg);
          }
        }

        @keyframes castlePulse {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }

          50% {
            opacity: 0.55;
            transform: translateY(-4px);
          }
        }

        @keyframes realmShimmer {
          0% {
            left: -30%;
          }

          100% {
            left: 130%;
          }
        }
      `}</style>
    </section>
  );
}

export default WelcomeBanner;