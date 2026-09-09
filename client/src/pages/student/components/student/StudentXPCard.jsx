import {
  Award,
  ChevronRight,
  Sparkles,
  Trophy,
  Zap,
  Crown,
  Shield,
  Activity,
  CircleDot,
  Flame,
  Sword,
  Castle,
  Snowflake,
  Feather,
  Gem,
  Star,
  Skull,
  Mountain,
  ScrollText,
  Swords,
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

  /*
   * =========================================================
   * GAME OF THRONES INSPIRED RANK TITLES
   * =========================================================
   */

  const getRankTitle = (currentLevel) => {
    if (currentLevel >= 10) return "Ruler of the Realm";
    if (currentLevel >= 8) return "Hand of the Crown";
    if (currentLevel >= 6) return "Lord Commander";
    if (currentLevel >= 4) return "Warden";
    if (currentLevel >= 3) return "Knight";
    if (currentLevel >= 2) return "Sworn Sword";

    return "Newly Sworn";
  };

  const rankTitle = getRankTitle(level);

  /*
   * =========================================================
   * CHARACTER / HOUSE REFERENCES
   * =========================================================
   */

  const character =
    level >= 8
      ? {
          name: "THE CROWN",
          subtitle: "Rule the realm",
          icon: Crown,
        }
      : level >= 6
      ? {
          name: "LORD COMMANDER",
          subtitle: "Defend the realm",
          icon: Shield,
        }
      : level >= 4
      ? {
          name: "THE NORTH",
          subtitle: "Winter is coming",
          icon: Snowflake,
        }
      : level >= 2
      ? {
          name: "THE DRAGON",
          subtitle: "Fire and blood",
          icon: Flame,
        }
      : {
          name: "THE RAVEN",
          subtitle: "Carry the message",
          icon: Feather,
        };

  const CharacterIcon = character.icon;

  return (
    <section
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-[30px]
        border
        border-slate-700/80
        bg-[#080a0b]
        p-6
        shadow-2xl
        shadow-black/40
        transition-all
        duration-700
        hover:-translate-y-1
        hover:border-amber-600/50
        hover:shadow-[0_30px_90px_rgba(0,0,0,0.65)]
        sm:p-7
        lg:p-8
      "
    >

      {/* =====================================================
          CINEMATIC REALM BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Dark medieval atmosphere */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_70%_35%,rgba(180,135,50,0.12),transparent_30%),radial-gradient(circle_at_15%_80%,rgba(60,90,120,0.16),transparent_35%)]
          "
        />

        {/* Moon */}

        <div
          className="
            absolute
            right-[8%]
            top-[8%]
            h-24
            w-24
            rounded-full
            border
            border-slate-300/20
            bg-slate-200/10
            shadow-[0_0_60px_rgba(200,210,220,0.12)]
            animate-[moonGlow_6s_ease-in-out_infinite]
          "
        >
          <div className="absolute inset-2 rounded-full bg-slate-200/5" />
        </div>

        {/* Golden atmospheric glow */}

        <div
          className="
            absolute
            -right-40
            -top-40
            h-[420px]
            w-[420px]
            rounded-full
            bg-amber-700/10
            blur-[100px]
            transition-all
            duration-1000
            group-hover:scale-125
            group-hover:bg-amber-600/15
          "
        />

        {/* Blue North glow */}

        <div
          className="
            absolute
            -bottom-40
            -left-40
            h-[420px]
            w-[420px]
            rounded-full
            bg-sky-950/50
            blur-[100px]
            transition-all
            duration-1000
            group-hover:scale-110
          "
        />

        {/* =================================================
            CASTLE / WINTERFELL SILHOUETTE
        ================================================= */}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-32
            opacity-40
          "
        >

          {/* Mountain */}

          <div
            className="
              absolute
              bottom-0
              left-[5%]
              h-28
              w-44
              rotate-[-8deg]
              bg-gradient-to-t
              from-black
              to-slate-900/60
              [clip-path:polygon(50%_0,100%_100%,0_100%)]
            "
          />

          <div
            className="
              absolute
              bottom-0
              right-[12%]
              h-24
              w-40
              rotate-[7deg]
              bg-gradient-to-t
              from-black
              to-slate-900/50
              [clip-path:polygon(50%_0,100%_100%,0_100%)]
            "
          />

          {/* Castle body */}

          <div
            className="
              absolute
              bottom-0
              left-1/2
              h-20
              w-48
              -translate-x-1/2
              border-x
              border-slate-700/40
              bg-slate-950/90
            "
          />

          {/* Towers */}

          <div
            className="
              absolute
              bottom-0
              left-[calc(50%-100px)]
              h-28
              w-8
              bg-slate-950
              border-x
              border-slate-700/40
            "
          />

          <div
            className="
              absolute
              bottom-0
              left-[calc(50%+70px)]
              h-28
              w-8
              bg-slate-950
              border-x
              border-slate-700/40
            "
          />

          {/* Castle windows */}

          <div
            className="
              absolute
              bottom-8
              left-1/2
              h-2
              w-2
              -translate-x-1/2
              rounded-full
              bg-amber-500/70
              shadow-[0_0_12px_rgba(245,158,11,0.8)]
            "
          />

          <div
            className="
              absolute
              bottom-12
              left-[calc(50%-85px)]
              h-1.5
              w-1.5
              rounded-full
              bg-amber-500/50
            "
          />

          <div
            className="
              absolute
              bottom-12
              left-[calc(50%+78px)]
              h-1.5
              w-1.5
              rounded-full
              bg-amber-500/50
            "
          />
        </div>

        {/* =================================================
            MOVING MIST
        ================================================= */}

        <div
          className="
            absolute
            bottom-5
            -left-[20%]
            h-16
            w-[140%]
            rounded-full
            bg-slate-300/[0.025]
            blur-2xl
            animate-[mistMove_14s_linear_infinite]
          "
        />

        <div
          className="
            absolute
            bottom-14
            -left-[30%]
            h-20
            w-[150%]
            rounded-full
            bg-white/[0.018]
            blur-3xl
            animate-[mistMoveReverse_18s_linear_infinite]
          "
        />

        {/* =================================================
            SNOW PARTICLES
        ================================================= */}

        <Snowflake
          size={12}
          className="
            absolute
            left-[8%]
            top-[20%]
            text-slate-300/30
            animate-[snowFall_7s_linear_infinite]
          "
        />

        <Snowflake
          size={8}
          className="
            absolute
            left-[32%]
            top-[10%]
            text-slate-200/40
            animate-[snowFall_9s_linear_infinite_2s]
          "
        />

        <Snowflake
          size={10}
          className="
            absolute
            right-[30%]
            top-[25%]
            text-slate-200/30
            animate-[snowFall_8s_linear_infinite_1s]
          "
        />

        <Snowflake
          size={7}
          className="
            absolute
            right-[12%]
            top-[15%]
            text-slate-300/30
            animate-[snowFall_10s_linear_infinite_3s]
          "
        />

        {/* =================================================
            DRAGON EMBERS
        ================================================= */}

        <Flame
          size={10}
          className="
            absolute
            right-[40%]
            bottom-[25%]
            text-orange-500/30
            animate-[emberRise_4s_ease-in-out_infinite]
          "
        />

        <Flame
          size={8}
          className="
            absolute
            right-[25%]
            bottom-[15%]
            text-amber-500/40
            animate-[emberRise_5s_ease-in-out_infinite_1s]
          "
        />

        <CircleDot
          size={6}
          className="
            absolute
            right-[50%]
            bottom-[20%]
            text-orange-400/40
            animate-[emberRise_3s_ease-in-out_infinite_2s]
          "
        />

        {/* =================================================
            RAVEN
        ================================================= */}

        <Feather
          size={20}
          className="
            absolute
            left-[45%]
            top-[12%]
            rotate-[-25deg]
            text-slate-600/30
            animate-[ravenFlight_10s_ease-in-out_infinite]
          "
        />

        {/* =================================================
            SUBTLE STONE TEXTURE
        ================================================= */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.045]
            [background-image:linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)]
            [background-size:35px_35px]
          "
        />

        {/* Golden horizon line */}

        <div
          className="
            absolute
            bottom-[18%]
            left-0
            right-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-amber-700/20
            to-transparent
          "
        />
      </div>

      {/* =====================================================
          TOP REALM STATUS
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
            animate-pulse
            rounded-full
            bg-amber-500
            shadow-[0_0_10px_rgba(245,158,11,0.8)]
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
            lg:grid-cols-[1fr_270px]
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

                {/* Medieval emblem */}

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
                    shadow-[0_0_30px_rgba(180,130,40,0.15)]
                    transition-all
                    duration-500
                    group-hover:scale-110
                    group-hover:border-amber-500/70
                    group-hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]
                  "
                >

                  <div
                    className="
                      absolute
                      -inset-1
                      rounded-[14px]
                      border
                      border-dashed
                      border-amber-700/30
                      animate-[realmRing_10s_linear_infinite]
                    "
                  />

                  <CharacterIcon
                    size={26}
                    className="
                      relative
                      z-10
                      text-amber-400
                      drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]
                    "
                  />

                  {/* Crown jewel */}

                  <Gem
                    size={10}
                    className="
                      absolute
                      -right-1
                      -top-1
                      text-red-500
                      animate-pulse
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
                      Level {level}
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
                      {rankTitle}
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
                  bg-black/70
                  px-3
                  py-2
                  shadow-lg
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  group-hover:border-amber-700/60
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
                    bg-amber-950/60
                  "
                >

                  <Zap
                    size={13}
                    className="
                      animate-[goldPulse_2s_ease-in-out_infinite]
                      text-amber-400
                    "
                    fill="currentColor"
                  />

                  <span
                    className="
                      absolute
                      inset-0
                      animate-ping
                      rounded-full
                      bg-amber-500/5
                    "
                  />

                </div>

                <span className="text-xs font-black text-slate-300">
                  {totalXP.toLocaleString()} XP
                </span>

              </div>
            </div>

            {/* =================================================
                CHARACTER REFERENCE
            ================================================= */}

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
                py-3
                backdrop-blur-sm
                transition-all
                duration-500
                group-hover:border-amber-900/50
              "
            >

              <div className="flex -space-x-2">

                {/* Jon Snow */}

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
                    shadow-lg
                  "
                  title="Jon Snow"
                >
                  JS
                </div>

                {/* Daenerys */}

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
                    shadow-lg
                  "
                  title="Daenerys Targaryen"
                >
                  DT
                </div>

                {/* Arya */}

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
                    shadow-lg
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
                    transition-all
                    duration-500
                    group-hover:rotate-12
                    group-hover:text-amber-500
                  "
                />

              </div>

            </div>

            {/* =================================================
                XP NUMBER
            ================================================= */}

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
                  {progressXP.toLocaleString()}
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
                    transition-transform
                    duration-500
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
                  {remainingXP.toLocaleString()} XP until
                  your next ascension
                </p>

              </div>
            </div>

            {/* =================================================
                PROGRESS
            ================================================= */}

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

                <span
                  className="
                    text-xs
                    font-black
                    text-amber-500
                  "
                >
                  {safeProgress}%
                </span>

              </div>

              {/* Medieval progress track */}

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

                {/* Progress */}

                <div
                  className="
                    relative
                    h-full
                    bg-gradient-to-r
                    from-amber-950
                    via-amber-700
                    to-yellow-500
                    shadow-[0_0_22px_rgba(245,158,11,0.35)]
                    transition-all
                    duration-1000
                    ease-out
                  "
                  style={{
                    width: `${safeProgress}%`,
                  }}
                >

                  {/* Banner texture */}

                  <div
                    className="
                      absolute
                      inset-0
                      opacity-20
                      [background-image:repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.25)_6px,transparent_7px)]
                    "
                  />

                  {/* Moving gold shine */}

                  <div
                    className="
                      absolute
                      inset-y-0
                      -left-20
                      w-20
                      -skew-x-12
                      bg-white/20
                      blur-sm
                      animate-[goldShimmer_3s_linear_infinite]
                    "
                  />

                  {/* Endpoint */}

                  {safeProgress > 0 && (
                    <div
                      className="
                        absolute
                        right-0
                        top-1/2
                        h-2.5
                        w-2.5
                        -translate-y-1/2
                        rounded-full
                        bg-yellow-100
                        shadow-[0_0_14px_rgba(253,224,71,1)]
                      "
                    />
                  )}

                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">

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

            {/* =================================================
                MOTIVATION
            ================================================= */}

            <div
              className="
                mt-6
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-slate-800
                bg-black/60
                px-4
                py-3.5
                shadow-inner
                backdrop-blur-sm
                transition-all
                duration-500
                group-hover:border-amber-900/50
                group-hover:bg-black/80
              "
            >

              <div
                className="
                  relative
                  flex
                  h-10
                  w-10
                  shrink-0
                  animate-[trophyFloat_4s_ease-in-out_infinite]
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-amber-800/40
                  bg-amber-950/30
                "
              >

                {isCloseToLevelUp ? (
                  <Crown
                    size={19}
                    className="
                      text-amber-400
                      drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]
                    "
                    fill="currentColor"
                  />
                ) : (
                  <Trophy
                    size={18}
                    className="
                      text-amber-500
                      drop-shadow-[0_0_7px_rgba(245,158,11,0.4)]
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
                    text-yellow-500
                  "
                />

              </div>

              <div className="min-w-0 flex-1">

                <p
                  className="
                    m-0
                    text-xs
                    font-black
                    text-slate-200
                  "
                >
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
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:text-amber-500
                "
              />

            </div>
          </div>

          {/* =================================================
              RIGHT SIDE — REALM SCENE
          ================================================= */}

          <div
            className="
              relative
              hidden
              h-[285px]
              lg:block
            "
          >

            {/* =================================================
                NIGHT KING / NORTH ATMOSPHERE
            ================================================= */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-56
                w-56
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-sky-950/30
                blur-3xl
                animate-pulse
              "
            />

            {/* Outer realm ring */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-56
                w-56
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-amber-800/30
                animate-[realmOrbit_20s_linear_infinite]
              "
            />

            {/* Inner ring */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-44
                w-44
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-dashed
                border-slate-700/60
                animate-[realmOrbitReverse_16s_linear_infinite]
              "
            />

            {/* =================================================
                CENTRAL IRON THRONE
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
                animate-[throneFloat_5s_ease-in-out_infinite]
              "
            >

              {/* Throne */}

              <div
                className="
                  relative
                  flex
                  h-32
                  w-28
                  items-end
                  justify-center
                "
              >

                {/* Back */}

                <div
                  className="
                    absolute
                    bottom-7
                    left-1/2
                    h-24
                    w-14
                    -translate-x-1/2
                    rounded-t-xl
                    border
                    border-slate-600
                    bg-gradient-to-b
                    from-slate-600
                    via-slate-800
                    to-black
                    shadow-[0_0_30px_rgba(0,0,0,0.7)]
                  "
                />

                {/* Swords */}

                <Sword
                  size={45}
                  className="
                    absolute
                    left-0
                    top-0
                    -rotate-[28deg]
                    text-slate-500
                  "
                />

                <Sword
                  size={45}
                  className="
                    absolute
                    right-0
                    top-0
                    rotate-[28deg]
                    text-slate-500
                  "
                />

                <Sword
                  size={48}
                  className="
                    absolute
                    left-1/2
                    top-[-5px]
                    -translate-x-1/2
                    text-slate-400
                  "
                />

                {/* Seat */}

                <div
                  className="
                    absolute
                    bottom-2
                    h-8
                    w-20
                    rounded-lg
                    border
                    border-slate-600
                    bg-slate-800
                    shadow-lg
                  "
                />

                {/* Crown */}

                <Crown
                  size={23}
                  className="
                    absolute
                    bottom-12
                    left-1/2
                    -translate-x-1/2
                    text-amber-400
                    drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]
                    animate-[crownGlow_3s_ease-in-out_infinite]
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
                  border-amber-800/50
                  bg-black/90
                  px-4
                  py-1.5
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.22em]
                  text-amber-500
                  shadow-[0_0_20px_rgba(180,130,40,0.12)]
                "
              >

                <Castle size={11} />

                {isCloseToLevelUp
                  ? "The Throne Awaits"
                  : "The Realm Endures"}

              </div>

            </div>

            {/* =================================================
                JON SNOW REFERENCE
            ================================================= */}

            <div
              className="
                absolute
                left-0
                top-10
                flex
                animate-[characterFloat_4s_ease-in-out_infinite]
                items-center
                gap-2
                rounded-lg
                border
                border-slate-700
                bg-black/80
                px-2.5
                py-2
                shadow-xl
                backdrop-blur-sm
                transition-all
                duration-300
                group-hover:border-slate-500
              "
            >

              <Shield
                size={16}
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

            {/* =================================================
                DAENERYS REFERENCE
            ================================================= */}

            <div
              className="
                absolute
                right-0
                top-4
                flex
                animate-[characterFloatReverse_5s_ease-in-out_infinite]
                items-center
                gap-2
                rounded-lg
                border
                border-amber-800/50
                bg-black/80
                px-2.5
                py-2
                shadow-xl
                backdrop-blur-sm
              "
            >

              <Flame
                size={16}
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

            {/* =================================================
                ARYA REFERENCE
            ================================================= */}

            <div
              className="
                absolute
                bottom-12
                left-2
                flex
                animate-[characterFloat_4.5s_ease-in-out_infinite_1s]
                items-center
                gap-2
                rounded-lg
                border
                border-slate-800
                bg-black/80
                px-2.5
                py-2
                shadow-xl
                backdrop-blur-sm
              "
            >

              <Sword
                size={16}
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

            {/* =================================================
                NIGHT KING REFERENCE
            ================================================= */}

            <div
              className="
                absolute
                bottom-5
                right-0
                flex
                animate-[characterFloatReverse_5s_ease-in-out_infinite_1s]
                items-center
                gap-2
                rounded-lg
                border
                border-sky-900/50
                bg-black/80
                px-2.5
                py-2
                shadow-xl
                backdrop-blur-sm
              "
            >

              <Skull
                size={15}
                className="
                  text-sky-400/70
                  animate-pulse
                "
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

            {/* =================================================
                XP FLOATING BADGE
            ================================================= */}

            <div
              className="
                absolute
                bottom-0
                left-[25%]
                flex
                animate-[xpBadgeFloat_3s_ease-in-out_infinite]
                items-center
                gap-1.5
                rounded-full
                border
                border-amber-800/50
                bg-black/90
                px-3
                py-1.5
                text-[9px]
                font-black
                uppercase
                tracking-wider
                text-amber-500
                shadow-[0_0_18px_rgba(180,130,40,0.12)]
              "
            >

              <Gem
                size={11}
                fill="currentColor"
              />

              + XP HONOR

            </div>

            {/* Raven */}

            <Feather
              size={18}
              className="
                absolute
                right-[20%]
                bottom-[32%]
                rotate-[-25deg]
                text-slate-600
                animate-[ravenFloat_5s_ease-in-out_infinite]
              "
            />

            {/* Mountain */}

            <Mountain
              size={18}
              className="
                absolute
                left-[30%]
                top-[4%]
                text-slate-700/50
                animate-pulse
              "
            />

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
              animate-[iconFloat_3s_ease-in-out_infinite]
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
            className="
              animate-pulse
              text-amber-500
            "
            fill="currentColor"
          />

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

        /* ===================================================
           MOON
        =================================================== */

        @keyframes moonGlow {
          0%, 100% {
            opacity: .55;
            transform: scale(1);
          }

          50% {
            opacity: .85;
            transform: scale(1.04);
          }
        }

        /* ===================================================
           MIST
        =================================================== */

        @keyframes mistMove {

          0% {
            transform: translateX(-10%);
          }

          50% {
            transform: translateX(8%);
          }

          100% {
            transform: translateX(-10%);
          }

        }

        @keyframes mistMoveReverse {

          0% {
            transform: translateX(10%);
          }

          50% {
            transform: translateX(-8%);
          }

          100% {
            transform: translateX(10%);
          }

        }

        /* ===================================================
           SNOW
        =================================================== */

        @keyframes snowFall {

          0% {
            transform:
              translateY(-20px)
              translateX(0)
              rotate(0deg);

            opacity: 0;
          }

          15% {
            opacity: .7;
          }

          50% {
            transform:
              translateY(120px)
              translateX(15px)
              rotate(180deg);

            opacity: .45;
          }

          100% {
            transform:
              translateY(260px)
              translateX(-10px)
              rotate(360deg);

            opacity: 0;
          }

        }

        /* ===================================================
           EMBERS
        =================================================== */

        @keyframes emberRise {

          0%, 100% {
            transform:
              translateY(0)
              scale(.8);

            opacity: 0;
          }

          30% {
            opacity: .7;
          }

          100% {
            transform:
              translateY(-70px)
              translateX(15px)
              scale(1.1);

            opacity: 0;
          }

        }

        /* ===================================================
           RAVEN
        =================================================== */

        @keyframes ravenFlight {

          0% {
            transform:
              translateX(-20px)
              translateY(10px)
              rotate(-25deg);

            opacity: 0;
          }

          25% {
            opacity: .7;
          }

          50% {
            transform:
              translateX(30px)
              translateY(-15px)
              rotate(-5deg);

            opacity: .4;
          }

          100% {
            transform:
              translateX(100px)
              translateY(30px)
              rotate(20deg);

            opacity: 0;
          }

        }

        @keyframes ravenFloat {

          0%, 100% {
            transform:
              translateY(0)
              rotate(-25deg);
          }

          50% {
            transform:
              translateY(-8px)
              rotate(-10deg);
          }

        }

        /* ===================================================
           RINGS
        =================================================== */

        @keyframes realmRing {

          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
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

        /* ===================================================
           THRONE
        =================================================== */

        @keyframes throneFloat {

          0%, 100% {
            transform:
              translate(-50%, -50%)
              translateY(0);
          }

          50% {
            transform:
              translate(-50%, -50%)
              translateY(-6px);
          }

        }

        @keyframes crownGlow {

          0%, 100% {
            filter:
              drop-shadow(
                0 0 5px
                rgba(245,158,11,.3)
              );
          }

          50% {
            filter:
              drop-shadow(
                0 0 16px
                rgba(245,158,11,.8)
              );
          }

        }

        /* ===================================================
           CHARACTER FLOAT
        =================================================== */

        @keyframes characterFloat {

          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-6px);
          }

        }

        @keyframes characterFloatReverse {

          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(6px);
          }

        }

        /* ===================================================
           XP
        =================================================== */

        @keyframes xpBadgeFloat {

          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }

        }

        @keyframes goldPulse {

          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.2);
          }

        }

        @keyframes goldShimmer {

          0% {
            left: -80px;
          }

          100% {
            left: 120%;
          }

        }

        /* ===================================================
           TROPHY
        =================================================== */

        @keyframes trophyFloat {

          0%, 100% {
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

        /* ===================================================
           ICON
        =================================================== */

        @keyframes iconFloat {

          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-3px);
          }

        }

      `}</style>

    </section>
  );
}

export default StudentXPCard;