import { memo, useMemo } from "react";

import {
  Award,
  ChevronRight,
  Sparkles,
  Trophy,
  Zap,
  Crown,
  Shield,
  CircleDot,
  Flame,
  Sword,
  Castle,
  Snowflake,
  Feather,
  Gem,
  Skull,
  Mountain,
  ScrollText,
  Swords,
} from "lucide-react";

/* =========================================================
   STATIC CHARACTER CONFIG
========================================================= */

const CHARACTER_CONFIG = {
  crown: {
    name: "THE CROWN",
    subtitle: "Rule the realm",
    icon: Crown,
  },

  commander: {
    name: "LORD COMMANDER",
    subtitle: "Defend the realm",
    icon: Shield,
  },

  north: {
    name: "THE NORTH",
    subtitle: "Winter is coming",
    icon: Snowflake,
  },

  dragon: {
    name: "THE DRAGON",
    subtitle: "Fire and blood",
    icon: Flame,
  },

  raven: {
    name: "THE RAVEN",
    subtitle: "Carry the message",
    icon: Feather,
  },
};

/* =========================================================
   STATIC HELPERS
========================================================= */

function getRankTitle(level) {
  if (level >= 10) return "Ruler of the Realm";
  if (level >= 8) return "Hand of the Crown";
  if (level >= 6) return "Lord Commander";
  if (level >= 4) return "Warden";
  if (level >= 3) return "Knight";
  if (level >= 2) return "Sworn Sword";

  return "Newly Sworn";
}

function getCharacter(level) {
  if (level >= 8) return CHARACTER_CONFIG.crown;
  if (level >= 6) return CHARACTER_CONFIG.commander;
  if (level >= 4) return CHARACTER_CONFIG.north;
  if (level >= 2) return CHARACTER_CONFIG.dragon;

  return CHARACTER_CONFIG.raven;
}

function clampProgress(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.min(100, Math.max(0, numeric));
}

/* =========================================================
   REALM BACKGROUND
========================================================= */

const RealmBackground = memo(function RealmBackground({
  isCloseToLevelUp,
}) {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
      "
    >
      {/* Atmospheric background */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_70%_35%,rgba(180,135,50,0.09),transparent_28%),radial-gradient(circle_at_15%_80%,rgba(60,90,120,0.10),transparent_32%)]
        "
      />

      {/* Moon
          Only opacity/transform animation.
          No filter animation.
      */}

      <div
        className="
          absolute
          right-[8%]
          top-[8%]
          h-20
          w-20
          rounded-full
          border
          border-slate-300/15
          bg-slate-200/[0.06]
          shadow-[0_0_35px_rgba(200,210,220,0.08)]
          animate-[xpMoon_8s_ease-in-out_infinite]
        "
      >
        <div className="absolute inset-2 rounded-full bg-slate-200/[0.035]" />
      </div>

      {/* Small gold glow */}

      <div
        className="
          absolute
          -right-28
          -top-28
          h-72
          w-72
          rounded-full
          bg-amber-700/[0.07]
          blur-3xl
        "
      />

      {/* North glow */}

      <div
        className="
          absolute
          -bottom-28
          -left-28
          h-72
          w-72
          rounded-full
          bg-sky-950/30
          blur-3xl
        "
      />

      {/* =====================================================
          MOUNTAINS
      ===================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-24
          opacity-30
        "
      >
        <div
          className="
            absolute
            bottom-0
            left-[5%]
            h-20
            w-36
            rotate-[-8deg]
            bg-gradient-to-t
            from-black
            to-slate-900/50
            [clip-path:polygon(50%_0,100%_100%,0_100%)]
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-[12%]
            h-16
            w-32
            rotate-[7deg]
            bg-gradient-to-t
            from-black
            to-slate-900/40
            [clip-path:polygon(50%_0,100%_100%,0_100%)]
          "
        />

        {/* Castle */}

        <div
          className="
            absolute
            bottom-0
            left-1/2
            h-16
            w-40
            -translate-x-1/2
            border-x
            border-slate-700/30
            bg-slate-950/90
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-[calc(50%-82px)]
            h-22
            w-7
            bg-slate-950
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-[calc(50%+55px)]
            h-22
            w-7
            bg-slate-950
          "
        />

        {/* Windows */}

        <span
          className="
            absolute
            bottom-6
            left-1/2
            h-1.5
            w-1.5
            -translate-x-1/2
            rounded-full
            bg-amber-500/60
          "
        />

        <span
          className="
            absolute
            bottom-9
            left-[calc(50%-68px)]
            h-1
            w-1
            rounded-full
            bg-amber-500/40
          "
        />

        <span
          className="
            absolute
            bottom-9
            left-[calc(50%+62px)]
            h-1
            w-1
            rounded-full
            bg-amber-500/40
          "
        />
      </div>

      {/* =====================================================
          VERY LIGHT MIST
      ===================================================== */}

      <div
        className="
          absolute
          bottom-5
          -left-[15%]
          h-10
          w-[130%]
          rounded-full
          bg-white/[0.012]
          blur-xl
          animate-[xpMist_20s_linear_infinite]
        "
      />

      {/* =====================================================
          STATIC PARTICLES
      ===================================================== */}

      <Snowflake
        size={9}
        className="
          absolute
          left-[10%]
          top-[24%]
          text-slate-300/20
        "
      />

      <Snowflake
        size={7}
        className="
          absolute
          left-[32%]
          top-[12%]
          text-slate-200/20
        "
      />

      <Snowflake
        size={8}
        className="
          absolute
          right-[30%]
          top-[25%]
          text-slate-200/20
        "
      />

      <Snowflake
        size={7}
        className="
          absolute
          right-[12%]
          top-[15%]
          text-slate-300/20
        "
      />

      {/* Ember particles */}

      <CircleDot
        size={5}
        className="
          absolute
          right-[40%]
          bottom-[25%]
          text-orange-400/25
        "
      />

      <CircleDot
        size={5}
        className="
          absolute
          right-[25%]
          bottom-[15%]
          text-amber-400/25
        "
      />

      {/* Raven */}

      <Feather
        size={18}
        className="
          absolute
          left-[45%]
          top-[12%]
          rotate-[-25deg]
          text-slate-600/20
          animate-[xpRaven_14s_ease-in-out_infinite]
        "
      />

      {/* Texture */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.025]
          [background-image:linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)]
          [background-size:35px_35px]
        "
      />

      {/* Horizon */}

      <div
        className="
          absolute
          bottom-[18%]
          left-0
          right-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-amber-700/15
          to-transparent
        "
      />
    </div>
  );
});

/* =========================================================
   CHARACTER REFERENCE BAR
========================================================= */

const CharacterReference = memo(function CharacterReference() {
  return (
    <div
      className="
        mt-6
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-800
        bg-black/40
        px-4
        py-3
        transition-[border-color]
        duration-200
        group-hover:border-amber-900/40
      "
    >
      <div className="flex -space-x-2">
        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-slate-600
            bg-slate-900
            text-[8px]
            font-black
            text-slate-300
          "
          title="Jon Snow"
        >
          JS
        </div>

        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-amber-700/60
            bg-amber-950/60
            text-[8px]
            font-black
            text-amber-400
          "
          title="Daenerys Targaryen"
        >
          DT
        </div>

        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-slate-700
            bg-black
            text-[8px]
            font-black
            text-slate-400
          "
          title="Arya Stark"
        >
          AS
        </div>
      </div>

      <div className="min-w-0">
        <p
          className="
            m-0
            text-[9px]
            font-black
            uppercase
            tracking-[0.18em]
            text-slate-500
          "
        >
          Champions of the Realm
        </p>

        <p className="m-0 mt-0.5 text-[10px] text-slate-600">
          Jon • Daenerys • Arya • Tyrion
        </p>
      </div>

      <div className="ml-auto hidden sm:block">
        <Sword
          size={18}
          className="
            text-slate-600
            transform-gpu
            transition-[transform,color]
            duration-200
            group-hover:rotate-12
            group-hover:text-amber-500
          "
        />
      </div>
    </div>
  );
});

/* =========================================================
   PROGRESS BAR
========================================================= */

const XPProgress = memo(function XPProgress({
  progress,
  remainingXP,
  isCloseToLevelUp,
}) {
  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScrollText
            size={12}
            className="text-slate-600"
          />

          <span
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.18em]
              text-slate-500
            "
          >
            Path to the Crown
          </span>
        </div>

        <span className="text-xs font-black text-amber-500">
          {progress}%
        </span>
      </div>

      <div
        className="
          relative
          h-4
          overflow-hidden
          rounded-sm
          border
          border-slate-700
          bg-black
          shadow-inner
        "
      >
        <div
          className="
            relative
            h-full
            rounded-sm
            bg-gradient-to-r
            from-amber-950
            via-amber-700
            to-yellow-500
            shadow-[0_0_14px_rgba(245,158,11,0.22)]
            transition-[width]
            duration-700
            ease-out
          "
          style={{
            width: `${progress}%`,
          }}
        >
          {/* Static texture */}

          <div
            className="
              absolute
              inset-0
              opacity-15
              [background-image:repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.2)_6px,transparent_7px)]
            "
          />

          {/* Endpoint */}

          {progress > 0 && (
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
                shadow-[0_0_8px_rgba(253,224,71,0.8)]
              "
            />
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <span
          className="
            text-[10px]
            font-medium
            text-slate-600
          "
        >
          {isCloseToLevelUp
            ? "The crown is within reach."
            : "Your journey through the realm continues."}
        </span>

        <span
          className="
            shrink-0
            text-[10px]
            font-black
            uppercase
            tracking-wider
            text-amber-500
          "
        >
          {remainingXP.toLocaleString()} XP
        </span>
      </div>
    </div>
  );
});

/* =========================================================
   MOTIVATION
========================================================= */

const Motivation = memo(function Motivation({
  isCloseToLevelUp,
}) {
  return (
    <div
      className="
        mt-6
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-800
        bg-black/50
        px-4
        py-3.5
        shadow-inner
        transition-[border-color,background-color]
        duration-200
        group-hover:border-amber-900/40
        group-hover:bg-black/70
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
          rounded-lg
          border
          border-amber-800/40
          bg-amber-950/30
          animate-[xpTrophy_5s_ease-in-out_infinite]
        "
      >
        {isCloseToLevelUp ? (
          <Crown
            size={19}
            className="text-amber-400"
            fill="currentColor"
          />
        ) : (
          <Trophy
            size={18}
            className="text-amber-500"
          />
        )}

        <Sparkles
          size={8}
          className="
            absolute
            -right-1
            -top-1
            text-yellow-500/70
          "
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="m-0 text-xs font-black text-slate-200">
          {isCloseToLevelUp
            ? "The throne is almost within your grasp."
            : "A ruler is forged through knowledge."}
        </p>

        <p
          className="
            m-0
            mt-0.5
            truncate
            text-[10px]
            text-slate-600
          "
        >
          Complete lectures, master skills and earn
          achievements to strengthen your claim.
        </p>
      </div>

      <ChevronRight
        size={17}
        className="
          shrink-0
          text-slate-700
          transform-gpu
          transition-[transform,color]
          duration-200
          group-hover:translate-x-1
          group-hover:text-amber-500
        "
      />
    </div>
  );
});

/* =========================================================
   REALM SCENE
========================================================= */

const RealmScene = memo(function RealmScene({
  isCloseToLevelUp,
}) {
  return (
    <div
      className="
        relative
        hidden
        h-[270px]
        lg:block
      "
    >
      {/* Single atmospheric glow */}

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
          bg-sky-950/20
          blur-3xl
        "
      />

      {/* Outer ring */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-52
          w-52
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-amber-800/20
          animate-[realmOrbit_28s_linear_infinite]
        "
      />

      {/* Inner ring */}

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
          border
          border-dashed
          border-slate-700/40
          animate-[realmOrbitReverse_24s_linear_infinite]
        "
      />

      {/* =====================================================
          THRONE
      ===================================================== */}

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
          animate-[throneFloat_6s_ease-in-out_infinite]
        "
      >
        <div
          className="
            relative
            flex
            h-28
            w-24
            items-end
            justify-center
          "
        >
          {/* Throne back */}

          <div
            className="
              absolute
              bottom-6
              left-1/2
              h-20
              w-12
              -translate-x-1/2
              rounded-t-xl
              border
              border-slate-600
              bg-gradient-to-b
              from-slate-600
              via-slate-800
              to-black
              shadow-[0_0_20px_rgba(0,0,0,0.6)]
            "
          />

          {/* Swords */}

          <Sword
            size={40}
            className="
              absolute
              left-0
              top-0
              -rotate-[28deg]
              text-slate-500
            "
          />

          <Sword
            size={40}
            className="
              absolute
              right-0
              top-0
              rotate-[28deg]
              text-slate-500
            "
          />

          <Sword
            size={42}
            className="
              absolute
              left-1/2
              top-[-4px]
              -translate-x-1/2
              text-slate-400
            "
          />

          {/* Seat */}

          <div
            className="
              absolute
              bottom-1
              h-7
              w-16
              rounded-lg
              border
              border-slate-600
              bg-slate-800
              shadow-lg
            "
          />

          {/* Crown */}

          <Crown
            size={21}
            className="
              absolute
              bottom-10
              left-1/2
              -translate-x-1/2
              text-amber-400
            "
            fill="currentColor"
          />
        </div>

        {/* Realm label */}

        <div
          className="
            mt-1
            flex
            items-center
            gap-2
            rounded-full
            border
            border-amber-800/40
            bg-black/90
            px-3
            py-1.5
            text-[8px]
            font-black
            uppercase
            tracking-[0.2em]
            text-amber-500
          "
        >
          <Castle size={10} />

          {isCloseToLevelUp
            ? "The Throne Awaits"
            : "The Realm Endures"}
        </div>
      </div>

      {/* =====================================================
          REFERENCE CARDS
      ===================================================== */}

      <div
        className="
          absolute
          left-0
          top-10
          flex
          items-center
          gap-2
          rounded-lg
          border
          border-slate-700
          bg-black/75
          px-2.5
          py-2
          shadow-lg
          animate-[characterFloat_5s_ease-in-out_infinite]
        "
      >
        <Shield
          size={15}
          className="text-slate-400"
        />

        <div>
          <p
            className="
              m-0
              text-[8px]
              font-black
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            THE NORTH
          </p>

          <p className="m-0 text-[8px] text-slate-600">
            Jon Snow
          </p>
        </div>
      </div>

      <div
        className="
          absolute
          right-0
          top-4
          flex
          items-center
          gap-2
          rounded-lg
          border
          border-amber-800/40
          bg-black/75
          px-2.5
          py-2
          shadow-lg
          animate-[characterFloatReverse_6s_ease-in-out_infinite]
        "
      >
        <Flame
          size={15}
          className="text-orange-500"
        />

        <div>
          <p
            className="
              m-0
              text-[8px]
              font-black
              uppercase
              tracking-wider
              text-orange-500
            "
          >
            DRAGON
          </p>

          <p className="m-0 text-[8px] text-slate-600">
            Daenerys
          </p>
        </div>
      </div>

      <div
        className="
          absolute
          bottom-10
          left-2
          flex
          items-center
          gap-2
          rounded-lg
          border
          border-slate-800
          bg-black/75
          px-2.5
          py-2
          shadow-lg
          animate-[characterFloat_6s_ease-in-out_infinite]
        "
      >
        <Sword
          size={15}
          className="text-slate-400"
        />

        <div>
          <p
            className="
              m-0
              text-[8px]
              font-black
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            THE WOLF
          </p>

          <p className="m-0 text-[8px] text-slate-600">
            Arya Stark
          </p>
        </div>
      </div>

      <div
        className="
          absolute
          bottom-4
          right-0
          flex
          items-center
          gap-2
          rounded-lg
          border
          border-sky-900/40
          bg-black/75
          px-2.5
          py-2
          shadow-lg
          animate-[characterFloatReverse_7s_ease-in-out_infinite]
        "
      >
        <Skull
          size={14}
          className="text-sky-400/70"
        />

        <div>
          <p
            className="
              m-0
              text-[8px]
              font-black
              uppercase
              tracking-wider
              text-sky-400/70
            "
          >
            BEYOND THE WALL
          </p>

          <p className="m-0 text-[8px] text-slate-700">
            The Night King
          </p>
        </div>
      </div>

      {/* XP badge */}

      <div
        className="
          absolute
          bottom-0
          left-[25%]
          flex
          items-center
          gap-1.5
          rounded-full
          border
          border-amber-800/40
          bg-black/90
          px-3
          py-1.5
          text-[9px]
          font-black
          uppercase
          tracking-wider
          text-amber-500
          animate-[xpBadgeFloat_5s_ease-in-out_infinite]
        "
      >
        <Gem
          size={10}
          fill="currentColor"
        />

        + XP HONOR
      </div>

      <Feather
        size={17}
        className="
          absolute
          right-[20%]
          bottom-[32%]
          rotate-[-25deg]
          text-slate-600/70
          animate-[ravenFloat_6s_ease-in-out_infinite]
        "
      />

      <Mountain
        size={17}
        className="
          absolute
          left-[30%]
          top-[4%]
          text-slate-700/40
        "
      />
    </div>
  );
});

/* =========================================================
   MAIN COMPONENT
========================================================= */

function StudentXPCard({ xp }) {
  if (!xp) return null;

  /*
   * Normalize once.
   */

  const data = useMemo(() => {
    const totalXP = Number(xp.totalXP) || 0;
    const level = Math.max(1, Number(xp.level) || 1);
    const progressXP = Number(xp.progressXP) || 0;
    const remainingXP = Math.max(
      0,
      Number(xp.remainingXP) || 0
    );

    const progressPercentage = clampProgress(
      xp.progressPercentage
    );

    return {
      totalXP,
      level,
      progressXP,
      remainingXP,
      progressPercentage,
      rankTitle: getRankTitle(level),
      character: getCharacter(level),
      isCloseToLevelUp: progressPercentage >= 80,
    };
  }, [
    xp.totalXP,
    xp.level,
    xp.progressXP,
    xp.remainingXP,
    xp.progressPercentage,
  ]);

  const CharacterIcon = data.character.icon;

  return (
    <section
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-[28px]
        border
        border-slate-700/70
        bg-[#080a0b]
        p-6
        shadow-xl
        shadow-black/30
        transform-gpu
        transition-[transform,border-color,box-shadow]
        duration-200
        ease-out
        hover:-translate-y-1
        hover:border-amber-600/50
        hover:shadow-2xl
        hover:shadow-black/40
        sm:p-7
        lg:p-8
      "
    >
      {/* Background */}

      <RealmBackground
        isCloseToLevelUp={data.isCloseToLevelUp}
      />

      {/* =====================================================
          STATUS
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
          tracking-[0.28em]
          text-slate-600
          sm:flex
        "
      >
        <Feather size={11} />

        RAVEN'S RECORD

        <span
          className="
            h-1.5
            w-1.5
            rounded-full
            bg-amber-500
          "
        />
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative z-10">
        <div
          className="
            grid
            grid-cols-1
            gap-8
            lg:grid-cols-[1fr_270px]
            lg:items-center
          "
        >
          {/* =================================================
              LEFT
          ================================================= */}

          <div>
            {/* Header */}

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Emblem */}

                <div
                  className="
                    relative
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-amber-700/50
                    bg-gradient-to-br
                    from-amber-800/60
                    via-slate-900
                    to-black
                    shadow-[0_0_20px_rgba(180,130,40,0.12)]
                    transform-gpu
                    transition-[transform,border-color]
                    duration-200
                    group-hover:scale-105
                    group-hover:border-amber-500/70
                  "
                >
                  <div
                    className="
                      absolute
                      -inset-1
                      rounded-[14px]
                      border
                      border-dashed
                      border-amber-700/25
                    "
                  />

                  <CharacterIcon
                    size={26}
                    className="
                      relative
                      z-10
                      text-amber-400
                    "
                  />

                  <Gem
                    size={9}
                    className="
                      absolute
                      -right-1
                      -top-1
                      text-red-500
                    "
                    fill="currentColor"
                  />
                </div>

                <div>
                  <p
                    className="
                      m-0
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.25em]
                      text-amber-500
                    "
                  >
                    Maester's Record
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
                      Level {data.level}
                    </h3>

                    <span
                      className="
                        rounded-sm
                        border
                        border-amber-800/40
                        bg-amber-950/20
                        px-2
                        py-0.5
                        text-[8px]
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-amber-500
                      "
                    >
                      {data.rankTitle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total XP */}

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-slate-700
                  bg-black/60
                  px-3
                  py-2
                  shadow-md
                  transition-[border-color]
                  duration-200
                  group-hover:border-amber-700/50
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
                    bg-amber-950/60
                  "
                >
                  <Zap
                    size={13}
                    className="
                      text-amber-400
                      animate-[xpZap_3s_ease-in-out_infinite]
                    "
                    fill="currentColor"
                  />
                </div>

                <span className="text-xs font-black text-slate-300">
                  {data.totalXP.toLocaleString()} XP
                </span>
              </div>
            </div>

            {/* Character reference */}

            <CharacterReference />

            {/* XP */}

            <div className="mt-7">
              <div className="flex items-end gap-3">
                <span
                  className="
                    bg-gradient-to-r
                    from-amber-300
                    via-yellow-500
                    to-amber-700
                    bg-clip-text
                    text-4xl
                    font-black
                    tracking-tight
                    text-transparent
                    sm:text-5xl
                  "
                >
                  {data.progressXP.toLocaleString()}
                </span>

                <span
                  className="
                    mb-1
                    text-sm
                    font-semibold
                    text-slate-600
                  "
                >
                  / 1,000 XP
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <Swords
                  size={14}
                  className="
                    text-amber-500
                    transform-gpu
                    transition-transform
                    duration-200
                    group-hover:rotate-12
                  "
                />

                <p
                  className="
                    m-0
                    text-xs
                    font-medium
                    text-slate-500
                  "
                >
                  {data.remainingXP.toLocaleString()} XP until
                  your next ascension
                </p>
              </div>
            </div>

            {/* Progress */}

            <XPProgress
              progress={data.progressPercentage}
              remainingXP={data.remainingXP}
              isCloseToLevelUp={data.isCloseToLevelUp}
            />

            {/* Motivation */}

            <Motivation
              isCloseToLevelUp={data.isCloseToLevelUp}
            />
          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <RealmScene
            isCloseToLevelUp={data.isCloseToLevelUp}
          />
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
          border-slate-800
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
              border
              border-amber-800/40
              bg-amber-950/20
            "
          >
            <Feather
              size={13}
              className="text-amber-500"
            />
          </div>

          <span
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-slate-600
            "
          >
            Every lesson strengthens your claim
          </span>
        </div>

        <div
          className="
            flex
            items-center
            gap-1.5
            text-xs
            font-black
            text-amber-500
          "
        >
          <Crown
            size={13}
            className="text-amber-500"
            fill="currentColor"
          />

          Level {data.level + 1}

          <ChevronRight
            size={14}
            className="
              transform-gpu
              transition-transform
              duration-200
              group-hover:translate-x-1
            "
          />
        </div>
      </div>

      {/* =====================================================
          LIGHTWEIGHT ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes xpMoon {
          0%, 100% {
            opacity: .5;
            transform: scale(1);
          }

          50% {
            opacity: .75;
            transform: scale(1.025);
          }
        }

        @keyframes xpMist {
          0%, 100% {
            transform: translateX(-5%);
          }

          50% {
            transform: translateX(5%);
          }
        }

        @keyframes xpRaven {
          0%, 100% {
            transform:
              translateX(-15px)
              translateY(8px)
              rotate(-25deg);
            opacity: .15;
          }

          50% {
            transform:
              translateX(35px)
              translateY(-8px)
              rotate(-5deg);
            opacity: .3;
          }
        }

        @keyframes realmOrbit {
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

        @keyframes realmOrbitReverse {
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

        @keyframes throneFloat {
          0%, 100% {
            transform:
              translate(-50%, -50%)
              translateY(0);
          }

          50% {
            transform:
              translate(-50%, -50%)
              translateY(-4px);
          }
        }

        @keyframes characterFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes characterFloatReverse {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(4px);
          }
        }

        @keyframes xpBadgeFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes xpTrophy {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes xpZap {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.08);
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

export default memo(StudentXPCard);