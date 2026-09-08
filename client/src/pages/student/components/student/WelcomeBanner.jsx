import {
  ArrowRight,
  BookOpen,
  Brain,
  Crosshair,
  Shield,
  Sparkles,
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
        min-h-[320px]
        w-full
        overflow-hidden
        rounded-[28px]
        border border-red-950/80
        bg-[#080808]
        px-6 py-7
        shadow-2xl shadow-black/40
        sm:px-8 sm:py-9
        lg:min-h-[340px]
        lg:px-10 lg:py-10
      "
    >
      {/* =====================================================
          CINEMATIC BACKGROUND
      ===================================================== */}

      {/* Red cinematic glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-96
          w-96
          rounded-full
          bg-red-700/20
          blur-[100px]
          transition-all
          duration-[2000ms]
          group-hover:scale-125
          group-hover:bg-red-600/30
        "
      />

      {/* Bottom red glow */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          left-1/3
          h-96
          w-96
          rounded-full
          bg-red-900/20
          blur-[110px]
          animate-pulse
        "
      />

      {/* Center dark smoke */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-72
          w-72
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/[0.02]
          blur-3xl
        "
      />

      {/* =====================================================
          BULLET / TACTICAL DECORATION
      ===================================================== */}

      {/* Horizontal cinematic lines */}
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
          via-red-800/40
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
          via-red-900/30
          to-transparent
        "
      />

      {/* Tactical corner */}
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
          border-red-700/30
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
          border-red-700/30
        "
      />

      {/* Floating red particles */}
      <span
        className="
          absolute
          left-[46%]
          top-12
          h-1.5
          w-1.5
          rounded-full
          bg-red-500
          shadow-[0_0_12px_rgba(239,68,68,0.9)]
          animate-ping
        "
      />

      <span
        className="
          absolute
          left-[57%]
          bottom-16
          h-1
          w-1
          rounded-full
          bg-red-400
          animate-pulse
        "
      />

      <span
        className="
          absolute
          right-[38%]
          top-24
          h-1.5
          w-1.5
          rounded-full
          bg-red-500
          shadow-[0_0_10px_rgba(239,68,68,0.8)]
          animate-pulse
        "
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 max-w-3xl">
        {/* Mission label */}
        <div
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-red-700/40
            bg-red-950/40
            px-3.5
            py-2
            text-xs
            font-bold
            tracking-[0.18em]
            text-red-400
            shadow-[0_0_20px_rgba(127,29,29,0.25)]
            backdrop-blur-md
          "
        >
          <Crosshair
            size={14}
            className="animate-pulse"
          />

          <span>MISSION ACTIVE · STAY FOCUSED</span>
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
          Welcome back,{" "}
          <span
            className="
              text-red-500
              drop-shadow-[0_0_18px_rgba(239,68,68,0.35)]
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
            text-zinc-400
            sm:text-base
            sm:leading-7
          "
        >
          The mission isn't finished.
          <span className="font-semibold text-zinc-200">
            {" "}Learn. Practice. Execute.
          </span>{" "}
          Every lesson puts another weapon in your arsenal.
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
            border-red-600/50
            bg-red-700
            px-5
            py-3
            text-sm
            font-black
            tracking-wide
            text-white
            shadow-lg
            shadow-red-950/50
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-red-600
            hover:shadow-[0_0_30px_rgba(220,38,38,0.35)]
            active:translate-y-0
          "
        >
          {/* Gunfire-style shine */}
          <span
            className="
              absolute
              inset-y-0
              -left-20
              w-10
              rotate-[20deg]
              bg-white/20
              blur-md
              transition-all
              duration-700
              group-hover:left-[120%]
            "
          />

          <Crosshair size={17} />

          <span className="relative">
            CONTINUE THE MISSION
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

        {/* Tactical stats */}
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
            text-zinc-500
          "
        >
          <div className="flex items-center gap-2">
            <div
              className="
                rounded-lg
                border
                border-red-900/40
                bg-red-950/30
                p-2
                text-red-500
              "
            >
              <Brain size={15} />
            </div>

            <span>LEARN</span>
          </div>

          <div className="h-5 w-px bg-zinc-800" />

          <div className="flex items-center gap-2">
            <div
              className="
                rounded-lg
                border
                border-red-900/40
                bg-red-950/30
                p-2
                text-red-500
              "
            >
              <Target size={15} />
            </div>

            <span>AIM</span>
          </div>

          <div className="h-5 w-px bg-zinc-800" />

          <div className="flex items-center gap-2">
            <div
              className="
                rounded-lg
                border
                border-red-900/40
                bg-red-950/30
                p-2
                text-red-500
              "
            >
              <Trophy size={15} />
            </div>

            <span>EXECUTE</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE — TACTICAL MISSION CARD
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
            Main Tactical Card
        ================================================= */}

        <div
          className="
            relative
            flex
            h-48
            w-72
            rotate-[-3deg]
            flex-col
            justify-between
            overflow-hidden
            rounded-2xl
            border
            border-zinc-700/60
            bg-gradient-to-br
            from-zinc-900
            via-[#101010]
            to-black
            p-5
            shadow-2xl
            shadow-black
            transition-all
            duration-700
            group-hover:rotate-0
            group-hover:scale-105
          "
        >
          {/* Red scan line */}
          <div
            className="
              absolute
              left-0
              top-0
              h-px
              w-full
              bg-red-600
              shadow-[0_0_12px_rgba(239,68,68,0.8)]
              animate-pulse
            "
          />

          {/* Card header */}
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
                Mission Status
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
                LOCKED IN
              </p>
            </div>

            <div
              className="
                rounded-xl
                border
                border-red-800/40
                bg-red-950/40
                p-2
                text-red-500
                shadow-[0_0_18px_rgba(127,29,29,0.3)]
              "
            >
              <Crosshair
                size={21}
                className="animate-pulse"
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
              <span>Today's target</span>

              <span className="text-red-500">
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
                  from-red-900
                  via-red-600
                  to-red-400
                  shadow-[0_0_12px_rgba(239,68,68,0.65)]
                "
              >
                {/* Moving bullet/energy */}
                <div
                  className="
                    absolute
                    right-0
                    top-1/2
                    h-3
                    w-3
                    -translate-y-1/2
                    rounded-full
                    bg-white
                    shadow-[0_0_10px_rgba(255,255,255,0.9)]
                    animate-pulse
                  "
                />
              </div>
            </div>
          </div>

          {/* Bottom mission info */}
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
              NO EXCUSES
            </span>

            <div className="flex items-center gap-1.5 text-zinc-500">
              <Zap size={12} className="text-red-500" />
              <span className="text-[10px] font-bold">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            Floating Crosshair
        ================================================= */}

        <div
          className="
            absolute
            -left-12
            -top-10
            rounded-2xl
            border
            border-red-800/40
            bg-black/80
            p-3
            text-red-500
            shadow-xl
            shadow-red-950/30
            backdrop-blur-lg
            animate-bounce
            [animation-duration:3s]
          "
        >
          <Crosshair
            size={23}
            className="
              drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]
            "
          />
        </div>

        {/* =================================================
            Floating Shield
        ================================================= */}

        <div
          className="
            absolute
            -bottom-9
            -left-10
            rounded-2xl
            border
            border-zinc-700
            bg-zinc-950/90
            p-3
            text-zinc-400
            shadow-xl
            animate-pulse
          "
        >
          <Shield size={22} />
        </div>

        {/* =================================================
            Floating Book
        ================================================= */}

        <div
          className="
            absolute
            -right-9
            -top-11
            rounded-2xl
            border
            border-red-900/40
            bg-black/90
            p-3
            text-red-500
            shadow-xl
            shadow-red-950/30
            animate-bounce
            [animation-duration:4s]
          "
        >
          <BookOpen size={22} />
        </div>

        {/* =================================================
            Floating Brain
        ================================================= */}

        <div
          className="
            absolute
            -right-12
            bottom-3
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-950/90
            p-3
            text-zinc-500
            shadow-xl
            animate-pulse
          "
        >
          <Brain size={20} />
        </div>

        {/* Spark */}
        <Sparkles
          size={17}
          className="
            absolute
            -right-14
            bottom-16
            text-red-500
            drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]
            animate-ping
          "
        />

        {/* =================================================
            Bullet-like animated dots
        ================================================= */}

        <span
          className="
            absolute
            -left-20
            top-1/2
            h-1
            w-8
            rounded-full
            bg-red-500
            opacity-0
            shadow-[0_0_10px_rgba(239,68,68,0.8)]
            transition-all
            duration-500
            group-hover:left-[-45px]
            group-hover:opacity-100
          "
        />
      </div>

      {/* =====================================================
          BOTTOM CINEMATIC LINE
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
          via-red-700
          to-transparent
          opacity-60
        "
      />

      {/* Red light sweep */}
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
    </section>
  );
}

export default WelcomeBanner;