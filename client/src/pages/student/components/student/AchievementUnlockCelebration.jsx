import { useEffect, useState } from "react";
import {
  Award,
  Check,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

/**
 * =========================================================
 * Achievement Rarity
 * =========================================================
 *
 * Rarity is only responsible for the visual presentation.
 *
 * XP is now controlled by the backend:
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
      badge:
        "from-yellow-300 via-orange-400 to-red-500",
      text: "text-orange-600",
    };
  }

  if (
    code === "FIFTY_HOURS" ||
    value >= 25
  ) {
    return {
      name: "EPIC",
      badge:
        "from-purple-400 via-fuchsia-500 to-pink-500",
      text: "text-purple-600",
    };
  }

  if (
    type === "LECTURES_COMPLETED" &&
    value >= 10
  ) {
    return {
      name: "RARE",
      badge:
        "from-blue-400 via-indigo-500 to-purple-600",
      text: "text-indigo-600",
    };
  }

  if (value >= 5) {
    return {
      name: "UNCOMMON",
      badge:
        "from-emerald-400 via-teal-500 to-cyan-600",
      text: "text-emerald-600",
    };
  }

  return {
    name: "COMMON",
    badge:
      "from-yellow-300 via-yellow-400 to-orange-500",
    text: "text-yellow-600",
  };
}

/**
 * =========================================================
 * Achievement Unlock Celebration
 * =========================================================
 */
export default function AchievementUnlockCelebration({
  achievements = [],
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const achievement =
    achievements[currentIndex];

  /**
   * -------------------------------------------------------
   * Real XP data from backend
   * -------------------------------------------------------
   *
   * The backend now sends:
   *
   * xpReward
   * totalXP
   * level
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

  const rarity = getRarity(achievement);

  /**
   * -------------------------------------------------------
   * Reset popup when achievement list changes
   * -------------------------------------------------------
   */
  useEffect(() => {
    setCurrentIndex(0);
  }, [achievements]);

  /**
   * -------------------------------------------------------
   * Entry animation
   * -------------------------------------------------------
   */
  useEffect(() => {
    if (!achievement) {
      return;
    }

    setVisible(false);

    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [achievement]);

  /**
   * -------------------------------------------------------
   * Nothing to show
   * -------------------------------------------------------
   */
  if (!achievement) {
    return null;
  }

  /**
   * -------------------------------------------------------
   * Close celebration
   * -------------------------------------------------------
   */
  const handleClose = () => {
    setVisible(false);

    setTimeout(() => {
      onClose?.();
    }, 250);
  };

  /**
   * -------------------------------------------------------
   * Next achievement
   * -------------------------------------------------------
   */
  const handleNext = () => {
    if (
      currentIndex <
      achievements.length - 1
    ) {
      setCurrentIndex(
        (prev) => prev + 1
      );

      return;
    }

    handleClose();
  };

  /**
   * =======================================================
   * RENDER
   * =======================================================
   */
  return (
    <div
      className={`
        fixed inset-0 z-[9999]
        flex items-center justify-center
        p-4
        transition-all duration-300
        ${
          visible
            ? "bg-slate-950/50 backdrop-blur-sm"
            : "bg-transparent"
        }
      `}
      onClick={handleClose}
    >
      {/* ==================================================
          CONFETTI
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute inset-0
          overflow-hidden
        "
      >
        {Array.from({ length: 28 }).map(
          (_, index) => (
            <span
              key={index}
              className={`
                achievement-confetti
                achievement-confetti-${index}
              `}
            />
          )
        )}
      </div>

      {/* ==================================================
          CARD
      ================================================== */}

      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        className={`
          relative
          w-full
          max-w-md
          overflow-hidden
          rounded-[32px]
          bg-white
          shadow-2xl
          transition-all
          duration-500
          ${
            visible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-8 scale-90 opacity-0"
          }
        `}
      >
        {/* =================================================
            TOP GRADIENT
        ================================================= */}

        <div
          className={`
            absolute
            left-0
            right-0
            top-0
            h-2
            bg-gradient-to-r
            ${rarity.badge}
          `}
        />

        {/* =================================================
            CLOSE BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={handleClose}
          className="
            absolute
            right-5
            top-5
            z-20
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-slate-100
            text-slate-500
            transition
            hover:bg-slate-200
            hover:text-slate-700
          "
          aria-label="Close achievement celebration"
        >
          <X size={17} />
        </button>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="px-6 pb-6 pt-10 text-center">
          {/* ===============================================
              CELEBRATION HEADER
          =============================================== */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-yellow-50
              px-4
              py-2
              text-xs
              font-black
              tracking-wider
              text-yellow-600
            "
          >
            <Sparkles
              size={15}
              className="animate-pulse"
            />

            ACHIEVEMENT UNLOCKED

            <Sparkles
              size={15}
              className="animate-pulse"
            />
          </div>

          {/* ===============================================
              BADGE
          =============================================== */}

          <div className="relative mx-auto mt-7 h-40 w-40">
            {/* Glow */}

            <div
              className={`
                absolute
                inset-4
                rounded-full
                bg-gradient-to-br
                ${rarity.badge}
                opacity-30
                blur-2xl
                achievement-glow
              `}
            />

            {/* Orbit */}

            <div
              className="
                absolute
                inset-0
                rounded-full
                border
                border-dashed
                border-indigo-200
                achievement-orbit
              "
            />

            {/* Badge */}

            <div
              className={`
                achievement-badge-pop
                absolute
                left-1/2
                top-1/2
                flex
                h-28
                w-28
                -translate-x-1/2
                -translate-y-1/2
                items-center
                justify-center
                rounded-[32px]
                bg-gradient-to-br
                ${rarity.badge}
                shadow-2xl
              `}
            >
              <div
                className="
                  absolute
                  inset-2
                  rounded-[27px]
                  border
                  border-white/30
                "
              />

              <Trophy
                size={54}
                strokeWidth={1.6}
                className="
                  relative
                  text-white
                "
              />

              {/* Check */}

              <div
                className="
                  absolute
                  -bottom-2
                  -right-2
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border-4
                  border-white
                  bg-emerald-500
                  shadow-lg
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
              ACHIEVEMENT NAME
          =============================================== */}

          <h2
            className="
              mt-5
              text-2xl
              font-black
              tracking-tight
              text-slate-900
            "
          >
            {achievement?.title ||
              achievement?.name ||
              "New Achievement"}
          </h2>

          {/* ===============================================
              DESCRIPTION
          =============================================== */}

          <p
            className="
              mx-auto
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-slate-500
            "
          >
            {achievement?.description ||
              "You've reached a new milestone!"}
          </p>

          {/* ===============================================
              RARITY + REAL XP
          =============================================== */}

          <div
            className="
              mx-auto
              mt-6
              flex
              max-w-xs
              items-center
              justify-center
              gap-3
            "
          >
            {/* Rarity */}

            <div
              className={`
                rounded-full
                bg-slate-100
                px-4
                py-2
                text-xs
                font-black
                tracking-wider
                ${rarity.text}
              `}
            >
              {rarity.name}
            </div>

            {/* XP */}

            <div
              className="
                flex
                items-center
                gap-1.5
                rounded-full
                bg-indigo-50
                px-4
                py-2
                text-xs
                font-black
                text-indigo-600
              "
            >
              <Award size={14} />

              +{xpReward} XP
            </div>
          </div>

          {/* ===============================================
              XP SUMMARY
          =============================================== */}

          <div
            className="
              mx-auto
              mt-5
              grid
              max-w-xs
              grid-cols-2
              gap-3
            "
          >
            {/* Level */}

            <div
              className="
                rounded-2xl
                bg-slate-50
                px-4
                py-3
              "
            >
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Level
              </p>

              <p
                className="
                  mt-1
                  text-xl
                  font-black
                  text-slate-900
                "
              >
                {level}
              </p>
            </div>

            {/* Total XP */}

            <div
              className="
                rounded-2xl
                bg-indigo-50
                px-4
                py-3
              "
            >
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-indigo-400
                "
              >
                Total XP
              </p>

              <p
                className="
                  mt-1
                  text-xl
                  font-black
                  text-indigo-600
                "
              >
                {totalXP.toLocaleString()}
              </p>
            </div>
          </div>

          {/* ===============================================
              NEXT BUTTON
          =============================================== */}

          <button
            type="button"
            onClick={handleNext}
            className="
              mt-7
              w-full
              rounded-2xl
              bg-gradient-to-r
              from-indigo-600
              to-violet-600
              px-5
              py-3.5
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-indigo-200
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-xl
            "
          >
            {currentIndex <
            achievements.length - 1
              ? "Continue"
              : "Awesome! 🎉"}
          </button>

          {/* ===============================================
              COUNTER
          =============================================== */}

          {achievements.length > 1 && (
            <p
              className="
                mt-3
                text-xs
                font-medium
                text-slate-400
              "
            >
              {currentIndex + 1} of{" "}
              {achievements.length} achievements
            </p>
          )}
        </div>
      </div>

      {/* ==================================================
          ANIMATION STYLES
      ================================================== */}

      <style>{`
        @keyframes badgePop {
          0% {
            transform:
              translate(-50%, -50%)
              scale(0.3)
              rotate(-20deg);
            opacity: 0;
          }

          60% {
            transform:
              translate(-50%, -50%)
              scale(1.12)
              rotate(5deg);
            opacity: 1;
          }

          100% {
            transform:
              translate(-50%, -50%)
              scale(1)
              rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes glow {
          0%, 100% {
            transform: scale(0.9);
            opacity: 0.2;
          }

          50% {
            transform: scale(1.15);
            opacity: 0.45;
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes confettiFall {
          0% {
            transform:
              translateY(-20vh)
              rotate(0deg);
            opacity: 1;
          }

          100% {
            transform:
              translateY(110vh)
              rotate(720deg);
            opacity: 0;
          }
        }

        .achievement-badge-pop {
          animation:
            badgePop
            0.7s
            cubic-bezier(
              0.175,
              0.885,
              0.32,
              1.275
            )
            forwards;
        }

        .achievement-glow {
          animation:
            glow
            2s
            ease-in-out
            infinite;
        }

        .achievement-orbit {
          animation:
            orbit
            12s
            linear
            infinite;
        }

        .achievement-confetti {
          position: absolute;
          top: -20px;
          width: 8px;
          height: 14px;
          border-radius: 2px;
          animation:
            confettiFall
            2.8s
            linear
            infinite;
        }

        .achievement-confetti-0 {
          left: 5%;
          background: #6366f1;
          animation-delay: 0s;
        }

        .achievement-confetti-1 {
          left: 10%;
          background: #f59e0b;
          animation-delay: .3s;
        }

        .achievement-confetti-2 {
          left: 18%;
          background: #ec4899;
          animation-delay: .8s;
        }

        .achievement-confetti-3 {
          left: 25%;
          background: #10b981;
          animation-delay: .5s;
        }

        .achievement-confetti-4 {
          left: 32%;
          background: #8b5cf6;
          animation-delay: 1.2s;
        }

        .achievement-confetti-5 {
          left: 40%;
          background: #06b6d4;
          animation-delay: .2s;
        }

        .achievement-confetti-6 {
          left: 47%;
          background: #f97316;
          animation-delay: .9s;
        }

        .achievement-confetti-7 {
          left: 54%;
          background: #6366f1;
          animation-delay: .4s;
        }

        .achievement-confetti-8 {
          left: 61%;
          background: #ec4899;
          animation-delay: 1.1s;
        }

        .achievement-confetti-9 {
          left: 68%;
          background: #10b981;
          animation-delay: .7s;
        }

        .achievement-confetti-10 {
          left: 75%;
          background: #f59e0b;
          animation-delay: .1s;
        }

        .achievement-confetti-11 {
          left: 82%;
          background: #8b5cf6;
          animation-delay: .6s;
        }

        .achievement-confetti-12 {
          left: 90%;
          background: #06b6d4;
          animation-delay: 1.3s;
        }

        .achievement-confetti-13 {
          left: 15%;
          background: #f97316;
          animation-delay: 1.5s;
        }

        .achievement-confetti-14 {
          left: 28%;
          background: #6366f1;
          animation-delay: 1.7s;
        }

        .achievement-confetti-15 {
          left: 45%;
          background: #ec4899;
          animation-delay: 1.4s;
        }

        .achievement-confetti-16 {
          left: 58%;
          background: #10b981;
          animation-delay: 1.8s;
        }

        .achievement-confetti-17 {
          left: 73%;
          background: #f59e0b;
          animation-delay: 1.6s;
        }

        .achievement-confetti-18 {
          left: 87%;
          background: #8b5cf6;
          animation-delay: 1.9s;
        }

        .achievement-confetti-19 {
          left: 3%;
          background: #06b6d4;
          animation-delay: 2s;
        }

        .achievement-confetti-20 {
          left: 22%;
          background: #f97316;
          animation-delay: 2.2s;
        }

        .achievement-confetti-21 {
          left: 37%;
          background: #6366f1;
          animation-delay: 2.1s;
        }

        .achievement-confetti-22 {
          left: 51%;
          background: #ec4899;
          animation-delay: 2.4s;
        }

        .achievement-confetti-23 {
          left: 65%;
          background: #10b981;
          animation-delay: 2.3s;
        }

        .achievement-confetti-24 {
          left: 79%;
          background: #f59e0b;
          animation-delay: 2.5s;
        }

        .achievement-confetti-25 {
          left: 94%;
          background: #8b5cf6;
          animation-delay: 2.1s;
        }

        .achievement-confetti-26 {
          left: 42%;
          background: #06b6d4;
          animation-delay: 2.6s;
        }

        .achievement-confetti-27 {
          left: 8%;
          background: #ec4899;
          animation-delay: 2.4s;
        }

        @media (prefers-reduced-motion: reduce) {
          .achievement-badge-pop,
          .achievement-glow,
          .achievement-orbit,
          .achievement-confetti {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}