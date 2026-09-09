import { useEffect, useRef, useState } from "react";
import {
  Award,
  Check,
  ChevronRight,
  Crown,
  Feather,
  Flame,
  Shield,
  Sparkles,
  Star,
  Sword,
  Trophy,
  X,
  Zap,
} from "lucide-react";

/**
 * =========================================================
 * ACHIEVEMENT RARITY
 * =========================================================
 *
 * Rarity controls ONLY visual presentation.
 *
 * XP is controlled by the backend:
 *
 * achievement.xpReward
 *
 * Do NOT calculate XP here.
 */

function getRarity(achievement) {
  const value = Number(
    achievement?.requirementValue || 0
  );

  const type =
    achievement?.requirement ||
    achievement?.requirementType;

  const code =
    achievement?.key ||
    achievement?.code;

  if (
    code === "PERFECT_COURSE" ||
    value >= 50
  ) {
    return {
      name: "LEGENDARY",
      gradient:
        "from-yellow-200 via-amber-400 to-orange-600",
      text: "text-amber-300",
      border: "border-amber-400/40",
      bg: "bg-amber-500/10",
      glow: "bg-amber-400/30",
      icon: Crown,
      sound:
        "/sounds/achievement-legendary.mp3",
      particleCount: 40,
      power: "legendary",
    };
  }

  if (
    code === "FIFTY_HOURS" ||
    value >= 25
  ) {
    return {
      name: "EPIC",
      gradient:
        "from-violet-300 via-purple-500 to-indigo-700",
      text: "text-violet-300",
      border: "border-violet-400/35",
      bg: "bg-violet-500/10",
      glow: "bg-violet-500/25",
      icon: Zap,
      sound:
        "/sounds/achievement-epic.mp3",
      particleCount: 32,
      power: "epic",
    };
  }

  if (
    type === "LECTURES_COMPLETED" &&
    value >= 10
  ) {
    return {
      name: "RARE",
      gradient:
        "from-sky-200 via-blue-400 to-indigo-600",
      text: "text-sky-300",
      border: "border-sky-400/35",
      bg: "bg-sky-500/10",
      glow: "bg-sky-400/25",
      icon: Star,
      sound:
        "/sounds/achievement-rare.mp3",
      particleCount: 25,
      power: "rare",
    };
  }

  if (value >= 5) {
    return {
      name: "UNCOMMON",
      gradient:
        "from-emerald-300 via-teal-500 to-cyan-600",
      text: "text-emerald-300",
      border: "border-emerald-400/30",
      bg: "bg-emerald-500/10",
      glow: "bg-emerald-400/20",
      icon: Shield,
      sound:
        "/sounds/achievement-uncommon.mp3",
      particleCount: 18,
      power: "uncommon",
    };
  }

  return {
    name: "COMMON",
    gradient:
      "from-stone-300 via-stone-400 to-zinc-500",
    text: "text-stone-300",
    border: "border-stone-400/25",
    bg: "bg-stone-500/10",
    glow: "bg-stone-400/15",
    icon: Trophy,
    sound:
      "/sounds/achievement-common.mp3",
    particleCount: 12,
    power: "common",
  };
}

/**
 * =========================================================
 * SOUND
 * =========================================================
 */

function playAchievementSound(
  source,
  volume = 0.65
) {
  if (!source) {
    return;
  }

  try {
    const audio = new Audio(source);

    audio.volume = volume;

    audio.play().catch(() => {
      // Browser autoplay restrictions
      // are intentionally ignored.
    });
  } catch {
    // Ignore audio errors.
  }
}

/**
 * =========================================================
 * ANIMATED XP NUMBER
 * =========================================================
 */

function AnimatedNumber({
  value = 0,
  duration = 1000,
}) {
  const [displayValue, setDisplayValue] =
    useState(0);

  useEffect(() => {
    const target = Number(value || 0);

    let startTime = null;
    let frameId;

    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed =
        timestamp - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      // Ease-out
      const eased =
        1 -
        Math.pow(
          1 - progress,
          4
        );

      setDisplayValue(
        Math.floor(target * eased)
      );

      if (progress < 1) {
        frameId =
          requestAnimationFrame(
            animate
          );
      }
    };

    frameId =
      requestAnimationFrame(
        animate
      );

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [value, duration]);

  return displayValue.toLocaleString();
}

/**
 * =========================================================
 * ACHIEVEMENT UNLOCK CELEBRATION
 * =========================================================
 */

export default function AchievementUnlockCelebration({
  achievements = [],
  onClose,
}) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [visible, setVisible] =
    useState(false);

  const [xpVisible, setXpVisible] =
    useState(false);

  const [flash, setFlash] =
    useState(false);

  const soundPlayedRef =
    useRef(false);

  const achievement =
    achievements[currentIndex];

  /**
   * -------------------------------------------------------
   * BACKEND XP DATA
   * -------------------------------------------------------
   */

  const xpReward = Number(
    achievement?.xpReward || 0
  );

  const totalXP = Number(
    achievement?.totalXP || 0
  );

  const level = Number(
    achievement?.level || 1
  );

  const rarity =
    getRarity(achievement);

  const RarityIcon =
    rarity.icon;

  /**
   * -------------------------------------------------------
   * RESET
   * -------------------------------------------------------
   */

  useEffect(() => {
    setCurrentIndex(0);
  }, [achievements]);

  /**
   * -------------------------------------------------------
   * ENTRY ANIMATION + SOUND
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!achievement) {
      return;
    }

    soundPlayedRef.current = false;

    setVisible(false);
    setXpVisible(false);
    setFlash(false);

    const entryTimer =
      setTimeout(() => {
        setVisible(true);
      }, 80);

    const flashTimer =
      setTimeout(() => {
        setFlash(true);
      }, 180);

    const flashEndTimer =
      setTimeout(() => {
        setFlash(false);
      }, 450);

    const soundTimer =
      setTimeout(() => {
        if (
          !soundPlayedRef.current
        ) {
          playAchievementSound(
            rarity.sound,
            rarity.power ===
              "legendary"
              ? 0.85
              : 0.6
          );

          soundPlayedRef.current =
            true;
        }
      }, 250);

    const xpTimer =
      setTimeout(() => {
        setXpVisible(true);

        if (xpReward > 0) {
          playAchievementSound(
            "/sounds/xp-reward.mp3",
            0.35
          );
        }
      }, 850);

    return () => {
      clearTimeout(entryTimer);
      clearTimeout(flashTimer);
      clearTimeout(flashEndTimer);
      clearTimeout(soundTimer);
      clearTimeout(xpTimer);
    };
  }, [
    achievement,
    rarity.sound,
    rarity.power,
    xpReward,
  ]);

  /**
   * -------------------------------------------------------
   * NOTHING TO SHOW
   * -------------------------------------------------------
   */

  if (!achievement) {
    return null;
  }

  /**
   * -------------------------------------------------------
   * CLOSE
   * -------------------------------------------------------
   */

  const handleClose = () => {
    setVisible(false);

    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  /**
   * -------------------------------------------------------
   * NEXT
   * -------------------------------------------------------
   */

  const handleNext = () => {
    if (
      currentIndex <
      achievements.length - 1
    ) {
      setCurrentIndex(
        (previous) =>
          previous + 1
      );

      return;
    }

    handleClose();
  };

  /**
   * -------------------------------------------------------
   * PARTICLES
   * -------------------------------------------------------
   */

  const particles = Array.from({
    length: rarity.particleCount,
  });

  /**
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <div
      className={`
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        overflow-hidden
        p-4
        transition-all
        duration-500

        ${
          visible
            ? "bg-[#020406]/90 backdrop-blur-md"
            : "bg-transparent"
        }
      `}
      onClick={handleClose}
    >
      {/* ===================================================
          CINEMATIC FLASH
      =================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          z-50
          bg-gradient-to-b
          from-amber-200/20
          via-sky-200/10
          to-transparent
          transition-opacity
          duration-300

          ${
            flash
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      />

      {/* ===================================================
          MEDIEVAL BACKGROUND
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* ===============================================
            MOON
        ================================================ */}

        <div
          className="
            absolute
            right-[12%]
            top-[8%]
            h-32
            w-32
            rounded-full
            bg-slate-100/[0.06]
            shadow-[0_0_100px_rgba(210,230,240,0.08)]
          "
        />

        <div
          className="
            absolute
            right-[11%]
            top-[7%]
            h-32
            w-32
            rounded-full
            border
            border-slate-200/[0.04]
          "
        />

        {/* ===============================================
            NORTHERN BLUE GLOW
        ================================================ */}

        <div
          className={`
            absolute
            left-1/2
            top-1/2
            h-[650px]
            w-[650px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            ${rarity.glow}
            blur-[150px]
            achievement-main-glow
          `}
        />

        {/* ===============================================
            GOLD HORIZON
        ================================================ */}

        <div
          className="
            absolute
            bottom-0
            left-0
            h-40
            w-full
            bg-gradient-to-t
            from-amber-600/[0.04]
            via-transparent
            to-transparent
          "
        />

        {/* ===============================================
            MOUNTAINS
        ================================================ */}

        <div
          className="
            absolute
            bottom-0
            left-0
            h-48
            w-full
            bg-gradient-to-t
            from-black
            via-[#080d10]/95
            to-transparent
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-[5%]
            h-28
            w-52
            rotate-[-12deg]
            bg-[#0b1013]
            opacity-90
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-[4%]
            h-36
            w-64
            rotate-[12deg]
            bg-[#080d10]
            opacity-90
          "
        />

        {/* ===============================================
            CASTLE SILHOUETTE
        ================================================ */}

        <div
          className="
            absolute
            bottom-0
            left-1/2
            h-36
            w-56
            -translate-x-1/2
            opacity-[0.12]
          "
        >
          {/* Main keep */}
          <div
            className="
              absolute
              bottom-0
              left-1/2
              h-28
              w-16
              -translate-x-1/2
              bg-slate-300
            "
          />

          {/* Left tower */}
          <div
            className="
              absolute
              bottom-0
              left-3
              h-20
              w-10
              bg-slate-300
            "
          />

          {/* Right tower */}
          <div
            className="
              absolute
              bottom-0
              right-3
              h-24
              w-10
              bg-slate-300
            "
          />

          {/* Battlements */}
          <div
            className="
              absolute
              bottom-[105px]
              left-1/2
              h-3
              w-16
              -translate-x-1/2
              bg-slate-300
            "
          />

          <div
            className="
              absolute
              bottom-[76px]
              left-3
              h-3
              w-10
              bg-slate-300
            "
          />

          <div
            className="
              absolute
              bottom-[100px]
              right-3
              h-3
              w-10
              bg-slate-300
            "
          />

          {/* Keep window */}
          <div
            className="
              absolute
              bottom-10
              left-1/2
              h-6
              w-3
              -translate-x-1/2
              rounded-t-full
              bg-amber-400/30
            "
          />
        </div>

        {/* ===============================================
            FOG
        ================================================ */}

        <div
          className="
            absolute
            bottom-10
            left-[-10%]
            h-20
            w-[120%]
            rounded-full
            bg-slate-200/[0.035]
            blur-2xl
            achievement-fog
          "
        />

        <div
          className="
            absolute
            bottom-20
            left-[-20%]
            h-16
            w-[120%]
            rounded-full
            bg-sky-200/[0.025]
            blur-3xl
            achievement-fog-two
          "
        />

        {/* ===============================================
            SNOW + EMBERS
        ================================================ */}

        {particles.map((_, index) => (
          <span
            key={index}
            className={`
              achievement-particle
              achievement-particle-${index}
            `}
          />
        ))}

        {/* ===============================================
            RAVEN FEATHERS
        ================================================ */}

        <Feather
          size={25}
          className="
            absolute
            left-[12%]
            top-[22%]
            rotate-[-25deg]
            text-slate-400/10
            achievement-feather-one
          "
        />

        <Feather
          size={18}
          className="
            absolute
            right-[18%]
            top-[34%]
            rotate-[25deg]
            text-slate-300/10
            achievement-feather-two
          "
        />

        {/* ===============================================
            SCANLINES
        ================================================ */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px)]
            [background-size:100%_5px]
          "
        />

        {/* ===============================================
            MEDIEVAL GRID
        ================================================ */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
            [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)]
            [background-size:60px_60px]
          "
        />
      </div>

      {/* ===================================================
          MAIN CARD
      =================================================== */}

      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        className={`
          achievement-card
          relative
          z-20
          w-full
          max-w-md
          overflow-hidden
          rounded-[30px]
          border
          border-[#37372f]
          bg-[#090c0e]
          shadow-[0_30px_100px_rgba(0,0,0,.75)]
          transition-all
          duration-500

          ${
            visible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-10 scale-90 opacity-0"
          }

          ${
            rarity.power ===
            "legendary"
              ? "achievement-legendary"
              : ""
          }
        `}
      >
        {/* =================================================
            TOP GOLD / ICE LINE
        ================================================= */}

        <div
          className={`
            absolute
            left-0
            right-0
            top-0
            h-[3px]
            bg-gradient-to-r
            ${rarity.gradient}
          `}
        />

        {/* =================================================
            CORNER DECORATIONS
        ================================================= */}

        <div
          className="
            absolute
            left-3
            top-3
            h-8
            w-8
            border-l
            border-t
            border-amber-400/20
          "
        />

        <div
          className="
            absolute
            right-3
            top-3
            h-8
            w-8
            border-r
            border-t
            border-amber-400/20
          "
        />

        <div
          className="
            absolute
            bottom-3
            left-3
            h-8
            w-8
            border-b
            border-l
            border-amber-400/10
          "
        />

        <div
          className="
            absolute
            bottom-3
            right-3
            h-8
            w-8
            border-b
            border-r
            border-amber-400/10
          "
        />

        {/* =================================================
            CLOSE
        ================================================= */}

        <button
          type="button"
          onClick={handleClose}
          className="
            absolute
            right-5
            top-5
            z-40
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-white/[0.08]
            bg-black/40
            text-slate-600
            backdrop-blur-md
            transition
            hover:border-red-500/30
            hover:bg-red-500/10
            hover:text-red-400
          "
          aria-label="Close achievement celebration"
        >
          <X size={16} />
        </button>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
            relative
            z-10
            px-6
            pb-7
            pt-10
            text-center
          "
        >
          {/* ===============================================
              RAVEN'S MESSAGE
          ================================================ */}

          <div
            className="
              mx-auto
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-amber-400/20
              bg-amber-400/[0.06]
              px-4
              py-2
            "
          >
            <Feather
              size={13}
              className="text-amber-300"
            />

            <span
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.28em]
                text-amber-300
              "
            >
              The Raven Brings News
            </span>

            <Feather
              size={13}
              className="text-amber-300"
            />
          </div>

          {/* ===============================================
              ACHIEVEMENT UNLOCKED
          ================================================ */}

          <div
            className="
              mt-4
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <span
              className="
                h-px
                w-10
                bg-gradient-to-r
                from-transparent
                to-sky-400/40
              "
            />

            <span
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.35em]
                text-sky-300/80
              "
            >
              Achievement Unlocked
            </span>

            <span
              className="
                h-px
                w-10
                bg-gradient-to-l
                from-transparent
                to-sky-400/40
              "
            />
          </div>

          {/* ===============================================
              BADGE
          ================================================ */}

          <div
            className="
              relative
              mx-auto
              mt-7
              h-48
              w-48
            "
          >
            {/* Outer rune circle */}

            <div
              className="
                absolute
                inset-1
                rounded-full
                border
                border-dashed
                border-slate-400/10
                achievement-rune-ring
              "
            />

            {/* Inner rune circle */}

            <div
              className={`
                absolute
                inset-7
                rounded-full
                border
                ${rarity.border}
                achievement-inner-ring
              `}
            />

            {/* Glow */}

            <div
              className={`
                absolute
                inset-8
                rounded-full
                ${rarity.glow}
                blur-3xl
                achievement-badge-glow
              `}
            />

            {/* Shockwave */}

            <div
              className={`
                absolute
                left-1/2
                top-1/2
                h-28
                w-28
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                ${rarity.border}
                achievement-shockwave
              `}
            />

            <div
              className={`
                absolute
                left-1/2
                top-1/2
                h-28
                w-28
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                ${rarity.border}
                achievement-shockwave-two
              `}
            />

            {/* Badge */}

            <div
              className={`
                achievement-badge-pop
                absolute
                left-1/2
                top-1/2
                flex
                h-32
                w-32
                -translate-x-1/2
                -translate-y-1/2
                items-center
                justify-center
                rounded-[34px]
                border
                border-white/20
                bg-gradient-to-br
                ${rarity.gradient}
                shadow-[0_20px_60px_rgba(0,0,0,.5)]
              `}
            >
              {/* Inner metal border */}

              <div
                className="
                  absolute
                  inset-2
                  rounded-[29px]
                  border
                  border-white/25
                "
              />

              {/* Corner engraving */}

              <div
                className="
                  absolute
                  inset-5
                  rounded-[25px]
                  border
                  border-white/10
                "
              />

              <RarityIcon
                size={57}
                strokeWidth={1.5}
                className="
                  relative
                  z-10
                  text-white
                  drop-shadow-[0_4px_8px_rgba(0,0,0,.35)]
                "
              />

              {/* Small sword */}

              <Sword
                size={22}
                className="
                  absolute
                  bottom-5
                  left-5
                  rotate-[-25deg]
                  text-white/25
                "
              />

              {/* Check */}

              <div
                className="
                  achievement-check
                  absolute
                  -bottom-2
                  -right-2
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border-4
                  border-[#090c0e]
                  bg-emerald-500
                  shadow-[0_5px_20px_rgba(16,185,129,.25)]
                "
              >
                <Check
                  size={19}
                  strokeWidth={3}
                  className="text-white"
                />
              </div>
            </div>
          </div>

          {/* ===============================================
              RARITY
          ================================================ */}

          <div
            className={`
              mx-auto
              mt-2
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              ${rarity.border}
              ${rarity.bg}
              px-4
              py-1.5
            `}
          >
            <Flame
              size={12}
              className={rarity.text}
            />

            <span
              className={`
                text-[9px]
                font-black
                uppercase
                tracking-[0.28em]
                ${rarity.text}
              `}
            >
              {rarity.name}
            </span>
          </div>

          {/* ===============================================
              ACHIEVEMENT TITLE
          ================================================ */}

          <h2
            className="
              mt-5
              text-2xl
              font-black
              uppercase
              tracking-tight
              text-white
              sm:text-3xl
            "
          >
            {achievement?.title ||
              achievement?.name ||
              "New Achievement"}
          </h2>

          {/* ===============================================
              DESCRIPTION
          ================================================ */}

          <p
            className="
              mx-auto
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-zinc-500
            "
          >
            {achievement?.description ||
              "You've reached a new milestone in your journey."}
          </p>

          {/* ===============================================
              XP REWARD
          ================================================ */}

          <div
            className={`
              mt-6
              transition-all
              duration-700
              ${
                xpVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }
            `}
          >
            <div
              className="
                mx-auto
                flex
                max-w-[250px]
                items-center
                justify-center
                gap-3
                rounded-2xl
                border
                border-amber-400/20
                bg-amber-400/[0.04]
                px-5
                py-3
                shadow-[inset_0_1px_0_rgba(255,255,255,.03)]
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-amber-400/20
                  bg-amber-400/10
                "
              >
                <Award
                  size={17}
                  className="text-amber-300"
                />
              </div>

              <div className="text-left">
                <p
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.25em]
                    text-zinc-600
                  "
                >
                  Honor Reward
                </p>

                <p
                  className="
                    mt-0.5
                    text-lg
                    font-black
                    text-amber-300
                  "
                >
                  +{xpReward.toLocaleString()} XP
                </p>
              </div>
            </div>
          </div>

          {/* ===============================================
              XP / LEVEL
          ================================================ */}

          <div
            className="
              mt-5
              grid
              grid-cols-2
              gap-3
            "
          >
            {/* LEVEL */}

            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.025]
                px-4
                py-4
              "
            >
              <div
                className="
                  absolute
                  right-2
                  top-2
                  opacity-[0.04]
                "
              >
                <Shield
                  size={48}
                />
              </div>

              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-zinc-600
                "
              >
                Current Rank
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-black
                  text-white
                "
              >
                Level {level}
              </p>
            </div>

            {/* TOTAL XP */}

            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-sky-400/10
                bg-sky-400/[0.025]
                px-4
                py-4
              "
            >
              <div
                className="
                  absolute
                  right-2
                  top-2
                  opacity-[0.04]
                "
              >
                <Crown
                  size={48}
                />
              </div>

              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-sky-400/50
                "
              >
                Total Honor
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-black
                  text-sky-300
                "
              >
                <AnimatedNumber
                  value={totalXP}
                />
              </p>
            </div>
          </div>

          {/* ===============================================
              NEXT BUTTON
          ================================================ */}

          <button
            type="button"
            onClick={handleNext}
            className="
              achievement-button
              group/btn
              relative
              mt-7
              flex
              w-full
              items-center
              justify-center
              gap-2
              overflow-hidden
              rounded-2xl
              border
              border-amber-400/30
              bg-gradient-to-r
              from-[#6f531d]
              via-[#a77c25]
              to-[#654919]
              px-5
              py-4
              text-sm
              font-black
              uppercase
              tracking-[0.12em]
              text-amber-50
              shadow-[0_10px_35px_rgba(120,80,20,.2)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:from-[#8b6925]
              hover:via-[#c19535]
              hover:to-[#79591d]
              active:scale-[0.98]
            "
          >
            {/* Shine */}

            <span
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-[-35%]
                w-[25%]
                skew-x-[-20deg]
                bg-white/20
                transition-all
                duration-700
                group-hover/btn:left-[120%]
              "
            />

            {/* Sword icon */}

            <Sword
              size={15}
              className="
                relative
                transition-transform
                group-hover/btn:-rotate-12
              "
            />

            <span className="relative">
              {currentIndex <
              achievements.length - 1
                ? "Continue Your Journey"
                : "Claim Your Honor"}
            </span>

            <ChevronRight
              size={16}
              className="
                relative
                transition-transform
                group-hover/btn:translate-x-1
              "
            />
          </button>

          {/* ===============================================
              ACHIEVEMENT COUNTER
          ================================================ */}

          {achievements.length > 1 && (
            <div className="mt-5">
              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {achievements.map(
                  (_, index) => (
                    <span
                      key={index}
                      className={`
                        h-1
                        rounded-full
                        transition-all
                        duration-300
                        ${
                          index ===
                          currentIndex
                            ? "w-8 bg-amber-400"
                            : "w-2 bg-white/10"
                        }
                      `}
                    />
                  )
                )}
              </div>

              <p
                className="
                  mt-3
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-zinc-700
                "
              >
                Deed {currentIndex + 1}{" "}
                of {achievements.length}
              </p>
            </div>
          )}

          {/* ===============================================
              FOOTER
          ================================================ */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <span className="h-px w-8 bg-zinc-800" />

            <span
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.25em]
                text-zinc-700
              "
            >
              Your Chronicle Grows
            </span>

            <span className="h-px w-8 bg-zinc-800" />
          </div>
        </div>

        {/* =================================================
            BOTTOM GOLD LINE
        ================================================= */}

        <div
          className="
            absolute
            bottom-0
            left-0
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-amber-400/50
            to-transparent
          "
        />
      </div>

      {/* ===================================================
          ANIMATION STYLES
      =================================================== */}

      <style>{`

        /* ================================================
           BADGE POP
        ================================================= */

        @keyframes achievementBadgePop {
          0% {
            transform:
              translate(-50%, -50%)
              scale(0)
              rotate(-25deg);
            opacity: 0;
          }

          45% {
            transform:
              translate(-50%, -50%)
              scale(1.18)
              rotate(8deg);
            opacity: 1;
          }

          70% {
            transform:
              translate(-50%, -50%)
              scale(.94)
              rotate(-2deg);
          }

          100% {
            transform:
              translate(-50%, -50%)
              scale(1)
              rotate(0deg);
          }
        }

        .achievement-badge-pop {
          animation:
            achievementBadgePop
            .85s
            cubic-bezier(
              .175,
              .885,
              .32,
              1.275
            )
            forwards;
        }


        /* ================================================
           BADGE GLOW
        ================================================= */

        @keyframes achievementGlow {
          0%,
          100% {
            transform: scale(.85);
            opacity: .2;
          }

          50% {
            transform: scale(1.2);
            opacity: .6;
          }
        }

        .achievement-badge-glow {
          animation:
            achievementGlow
            2.2s
            ease-in-out
            infinite;
        }


        /* ================================================
           MAIN BACKGROUND GLOW
        ================================================= */

        @keyframes mainGlow {
          0%,
          100% {
            transform:
              translate(-50%, -50%)
              scale(.9);
          }

          50% {
            transform:
              translate(-50%, -50%)
              scale(1.15);
          }
        }

        .achievement-main-glow {
          animation:
            mainGlow
            4s
            ease-in-out
            infinite;
        }


        /* ================================================
           RUNE RING
        ================================================= */

        @keyframes runeRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .achievement-rune-ring {
          animation:
            runeRotate
            18s
            linear
            infinite;
        }


        /* ================================================
           INNER RING
        ================================================= */

        @keyframes innerRing {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        .achievement-inner-ring {
          animation:
            innerRing
            10s
            linear
            infinite;
        }


        /* ================================================
           SHOCKWAVE
        ================================================= */

        @keyframes shockwave {
          0% {
            transform:
              translate(-50%, -50%)
              scale(.45);
            opacity: .8;
          }

          100% {
            transform:
              translate(-50%, -50%)
              scale(2.4);
            opacity: 0;
          }
        }

        .achievement-shockwave {
          animation:
            shockwave
            2.4s
            ease-out
            infinite;
        }


        .achievement-shockwave-two {
          animation:
            shockwave
            2.4s
            ease-out
            1.2s
            infinite;
        }


        /* ================================================
           CHECK
        ================================================= */

        @keyframes checkPop {
          0% {
            transform: scale(0)
              rotate(-30deg);
            opacity: 0;
          }

          70% {
            transform: scale(1.2)
              rotate(5deg);
            opacity: 1;
          }

          100% {
            transform: scale(1)
              rotate(0);
          }
        }

        .achievement-check {
          animation:
            checkPop
            .5s
            ease-out
            .65s
            backwards;
        }


        /* ================================================
           FOG
        ================================================= */

        @keyframes fogDrift {
          0% {
            transform:
              translateX(-8%);
          }

          50% {
            transform:
              translateX(5%);
          }

          100% {
            transform:
              translateX(-8%);
          }
        }

        .achievement-fog {
          animation:
            fogDrift
            12s
            ease-in-out
            infinite;
        }


        .achievement-fog-two {
          animation:
            fogDrift
            17s
            ease-in-out
            reverse
            infinite;
        }


        /* ================================================
           FEATHERS
        ================================================= */

        @keyframes featherFloat {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(-25deg);
            opacity: .1;
          }

          50% {
            transform:
              translateY(-25px)
              rotate(10deg);
            opacity: .22;
          }
        }

        .achievement-feather-one {
          animation:
            featherFloat
            5s
            ease-in-out
            infinite;
        }


        .achievement-feather-two {
          animation:
            featherFloat
            7s
            ease-in-out
            reverse
            infinite;
        }


        /* ================================================
           LEGENDARY
        ================================================= */

        @keyframes legendaryPulse {
          0%,
          100% {
            box-shadow:
              0 30px 100px
              rgba(0,0,0,.75),
              0 0 0
              rgba(245,158,11,0);
          }

          50% {
            box-shadow:
              0 30px 100px
              rgba(0,0,0,.75),
              0 0 70px
              rgba(245,158,11,.12);
          }
        }

        .achievement-legendary {
          animation:
            legendaryPulse
            2.5s
            ease-in-out
            infinite;
        }


        /* ================================================
           PARTICLES
        ================================================= */

        @keyframes particleFall {
          0% {
            transform:
              translateY(-40px)
              rotate(0deg)
              scale(.5);
            opacity: 0;
          }

          15% {
            opacity: .8;
          }

          100% {
            transform:
              translateY(110vh)
              rotate(720deg)
              scale(1);
            opacity: 0;
          }
        }

        .achievement-particle {
          position: absolute;

          top: -30px;

          width: 4px;
          height: 9px;

          border-radius: 999px;

          background:
            linear-gradient(
              to bottom,
              rgba(226,232,240,.6),
              rgba(148,163,184,.1)
            );

          box-shadow:
            0 0 10px
            rgba(186,230,253,.25);

          animation:
            particleFall
            4s
            linear
            infinite;
        }


        ${Array.from(
          { length: 40 },
          (_, index) => {
            const left =
              (index * 17) % 100;

            const delay =
              (index % 12) * .35;

            const duration =
              3.5 +
              (index % 6) * .45;

            const isEmber =
              index % 5 === 0;

            return `
              .achievement-particle-${index} {
                left: ${left}%;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
                ${
                  isEmber
                    ? `
                      width: 3px;
                      height: 7px;
                      background:
                        linear-gradient(
                          to bottom,
                          #fbbf24,
                          #b45309
                        );
                      box-shadow:
                        0 0 12px
                        rgba(245,158,11,.5);
                    `
                    : ""
                }
              }
            `;
          }
        ).join("")}


        /* ================================================
           BUTTON
        ================================================= */

        .achievement-button {
          background-size:
            200% 100%;
        }


        /* ================================================
           REDUCE MOTION
        ================================================= */

        @media
        (prefers-reduced-motion: reduce) {

          .achievement-badge-pop,
          .achievement-badge-glow,
          .achievement-main-glow,
          .achievement-rune-ring,
          .achievement-inner-ring,
          .achievement-shockwave,
          .achievement-shockwave-two,
          .achievement-check,
          .achievement-fog,
          .achievement-fog-two,
          .achievement-feather-one,
          .achievement-feather-two,
          .achievement-legendary,
          .achievement-particle {
            animation: none !important;
          }
        }

      `}</style>
    </div>
  );
}