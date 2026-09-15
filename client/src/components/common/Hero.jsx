import { Link } from "react-router-dom";
import {
  ArrowRight,
  Crown,
  Flame,
  Shield,
  Sparkles,
  Sword,
  Trophy,
  CheckCircle2,
  ChevronRight,
  Castle,
  ScrollText,
  Gem,
  Target,
} from "lucide-react";

const C = {
  black: "#050505",
  blackSoft: "#0A0908",
  panel: "#11100F",
  panelLight: "#171513",

  gold: "#C9A45C",
  goldLight: "#F0D58A",
  goldBright: "#FFE7A3",
  goldDark: "#705326",

  crimson: "#721818",
  crimsonBright: "#A82727",

  text: "#F3E9D2",
  muted: "#9C9385",
  mutedDark: "#625D54",

  border: "rgba(201,164,92,0.18)",
};

function Hero() {
  const roadmap = [
    {
      number: "I",
      title: "HTML & CSS",
      description: "Lay the foundations of your kingdom",
      status: "MASTERED",
      completed: true,
    },
    {
      number: "II",
      title: "JavaScript",
      description: "Command the language of the web",
      status: "72% COMPLETE",
      active: true,
    },
    {
      number: "III",
      title: "React",
      description: "Forge powerful interfaces",
      status: "LOCKED",
    },
    {
      number: "IV",
      title: "Node.js & MongoDB",
      description: "Rule the realm of backend",
      status: "LOCKED",
    },
  ];

  return (
    <section className="got-hero">

      {/* =====================================================
          CINEMATIC BACKGROUND
      ===================================================== */}

      <div className="got-background">

        <div className="castle-silhouette">
          <div className="castle-tower tower-one" />
          <div className="castle-tower tower-two" />
          <div className="castle-tower tower-three" />
          <div className="castle-wall" />
        </div>

        <div className="moon" />

        <div className="red-glow red-glow-one" />
        <div className="red-glow red-glow-two" />

        <div className="gold-glow gold-glow-one" />

        <div className="stone-texture" />

        <div className="medieval-grid" />

        <div className="horizon" />

      </div>

      {/* =====================================================
          EMBERS
      ===================================================== */}

      <div className="embers">

        {Array.from({ length: 42 }).map((_, index) => (
          <span
            key={index}
            className="ember"
            style={{
              left: `${(index * 29) % 100}%`,
              animationDelay: `${(index % 12) * 0.45}s`,
              animationDuration: `${5 + (index % 7)}s`,
            }}
          />
        ))}

      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="hero-container">

        <div className="hero-grid">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="hero-left">

            {/* Royal Label */}

            <div className="royal-label">

              <span className="royal-line" />

              <Crown size={15} />

              <span>
                THE REALM OF KNOWLEDGE
              </span>

              <span className="royal-line reverse" />

            </div>

            {/* Small title */}

            <div className="hero-overline">

              <span className="overline-icon">
                ✦
              </span>

              THE PATH OF THE WARRIOR

              <span className="overline-icon">
                ✦
              </span>

            </div>

            {/* Main Heading */}

            <h1 className="hero-title">

              Master the craft.

              <span>
                Forge your destiny.
              </span>

            </h1>

            {/* Sword Divider */}

            <div className="sword-divider">

              <span />

              <div className="sword-icon">
                <Sword size={19} />
              </div>

              <span />

            </div>

            {/* Description */}

            <p className="hero-description">

              Enter a realm where knowledge is earned, skills are
              forged, and every challenge brings you closer to
              mastery.

              <br />

              <strong>
                Train. Build. Conquer.
              </strong>

            </p>

            {/* CTA */}

            <div className="hero-actions">

              <Link
                to="/register"
                className="got-primary group"
              >

                <Crown size={17} />

                <span>
                  Begin Your Quest
                </span>

                <ArrowRight
                  size={17}
                  className="group-hover:translate-x-1 transition-transform"
                />

              </Link>

              <Link
                to="/courses"
                className="got-secondary group"
              >

                <ScrollText size={17} />

                <span>
                  Enter the Library
                </span>

              </Link>

            </div>

            {/* Stats */}

            <div className="kingdom-stats">

              <div className="kingdom-stat">

                <div className="stat-icon">
                  <Trophy size={17} />
                </div>

                <div>
                  <strong>50+</strong>
                  <span>Quests</span>
                </div>

              </div>

              <div className="stat-divider" />

              <div className="kingdom-stat">

                <div className="stat-icon">
                  <Shield size={17} />
                </div>

                <div>
                  <strong>1K+</strong>
                  <span>Warriors</span>
                </div>

              </div>

              <div className="stat-divider" />

              <div className="kingdom-stat">

                <div className="stat-icon">
                  <Flame size={17} />
                </div>

                <div>
                  <strong>24/7</strong>
                  <span>Training</span>
                </div>

              </div>

            </div>

            {/* Quote */}

            <div className="hero-quote">

              <span>
                "
              </span>

              <p>
                A mind without knowledge is a kingdom without a ruler.
              </p>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="hero-right">

            {/* Giant decorative circles */}

            <div className="royal-orbit orbit-one" />
            <div className="royal-orbit orbit-two" />
            <div className="royal-orbit orbit-three" />

            {/* Crown emblem */}

            <div className="floating-crown">

              <Crown size={24} />

            </div>

            {/* Main Realm Card */}

            <div className="realm-card">

              {/* Top decoration */}

              <div className="realm-ornament">

                <span />

                <Castle size={18} />

                <span />

              </div>

              {/* Header */}

              <div className="realm-header">

                <div>

                  <span className="realm-eyebrow">
                    YOUR KINGDOM
                  </span>

                  <h2>
                    Full Stack Development
                  </h2>

                  <p>
                    Forge yourself into a complete developer.
                  </p>

                </div>

                {/* Progress */}

                <div className="progress-emblem">

                  <div className="emblem-ring">

                    <div className="emblem-inner">

                      <strong>
                        68
                      </strong>

                      <span>
                        %
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* XP */}

              <div className="xp-section">

                <div className="xp-header">

                  <div>

                    <span>
                      EXPERIENCE
                    </span>

                    <strong>
                      6,800 XP
                    </strong>

                  </div>

                  <span>
                    NEXT RANK · 10K XP
                  </span>

                </div>

                <div className="xp-track">

                  <div className="xp-fill">

                    <span />

                  </div>

                </div>

              </div>

              {/* Journey */}

              <div className="journey-section">

                <div className="journey-title">

                  <Gem size={13} />

                  THE ROYAL ROAD

                </div>

                <div className="roadmap">

                  <div className="road-line" />

                  {roadmap.map((item) => (

                    <div
                      key={item.number}
                      className={`road-item ${
                        item.active ? "active" : ""
                      }`}
                    >

                      <div
                        className={`road-node ${
                          item.completed
                            ? "completed"
                            : item.active
                            ? "current"
                            : "locked"
                        }`}
                      >

                        {item.completed ? (
                          <CheckCircle2 size={15} />
                        ) : item.active ? (
                          <Target size={14} />
                        ) : (
                          item.number
                        )}

                      </div>

                      <div className="road-content">

                        <div className="road-title">

                          <h3>
                            {item.title}
                          </h3>

                          {item.active && (
                            <span>
                              NOW
                            </span>
                          )}

                        </div>

                        <p>
                          {item.description}
                        </p>

                        <small
                          className={
                            item.completed
                              ? "complete"
                              : item.active
                              ? "progress"
                              : "locked-text"
                          }
                        >

                          {item.completed && "✓ "}
                          {item.status}

                        </small>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

              {/* Continue */}

              <div className="continue-quest">

                <div className="quest-icon">

                  <Sparkles size={18} />

                </div>

                <div className="quest-info">

                  <span>
                    YOUR NEXT QUEST
                  </span>

                  <strong>
                    React Fundamentals
                  </strong>

                </div>

                <Link
                  to="/courses"
                  className="quest-button"
                >

                  <ChevronRight size={20} />

                </Link>

              </div>

              {/* Bottom ornament */}

              <div className="realm-bottom">

                <span />
                <Crown size={12} />
                <span />

              </div>

            </div>

            {/* =================================================
                STREAK
            ================================================= */}

            <div className="floating-card streak">

              <div className="floating-icon">
                <Flame size={17} />
              </div>

              <div>

                <span>
                  WARRIOR STREAK
                </span>

                <strong>
                  7 DAYS
                </strong>

              </div>

              <div className="online-dot" />

            </div>

            {/* =================================================
                RANK
            ================================================= */}

            <div className="floating-card rank">

              <div className="floating-icon">
                <Sword size={16} />
              </div>

              <div>

                <span>
                  CURRENT TITLE
                </span>

                <strong>
                  CODE WARRIOR
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          BOTTOM VIGNETTE
      ===================================================== */}

      <div className="bottom-vignette" />

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        /* =====================================================
           HERO
        ===================================================== */

        .got-hero {
          position: relative;
          min-height: 820px;
          overflow: hidden;

          background:
            radial-gradient(
              circle at 50% 110%,
              rgba(128, 36, 18, 0.35),
              transparent 38%
            ),
            radial-gradient(
              circle at 85% 20%,
              rgba(201,164,92,0.07),
              transparent 30%
            ),
            #050505;

          color: ${C.text};
        }


        /* =====================================================
           BACKGROUND
        ===================================================== */

        .got-background {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }


        .stone-texture {
          position: absolute;
          inset: 0;

          opacity: 0.13;

          background-image:
            radial-gradient(
              rgba(255,255,255,0.15) 0.6px,
              transparent 0.6px
            );

          background-size: 5px 5px;
        }


        .medieval-grid {
          position: absolute;
          inset: 0;

          opacity: 0.025;

          background-image:
            linear-gradient(
              rgba(201,164,92,0.5) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(201,164,92,0.5) 1px,
              transparent 1px
            );

          background-size: 90px 90px;
        }


        /* =====================================================
           MOON
        ===================================================== */

        .moon {
          position: absolute;

          width: 230px;
          height: 230px;

          right: 7%;
          top: 8%;

          border-radius: 50%;

          background:
            radial-gradient(
              circle at 35% 35%,
              #f5df9e,
              #9d7b3e 48%,
              transparent 70%
            );

          opacity: 0.08;

          filter: blur(1px);

          box-shadow:
            0 0 100px rgba(201,164,92,0.12);
        }


        /* =====================================================
           CASTLE SILHOUETTE
        ===================================================== */

        .castle-silhouette {
          position: absolute;

          left: 50%;
          bottom: -20px;

          width: 900px;
          height: 260px;

          transform: translateX(-50%);

          opacity: 0.07;
        }


        .castle-wall {
          position: absolute;

          left: 15%;
          right: 15%;
          bottom: 0;

          height: 150px;

          background: #000;

          clip-path: polygon(
            0 20%,
            8% 20%,
            8% 0,
            14% 0,
            14% 20%,
            25% 20%,
            25% 8%,
            31% 8%,
            31% 20%,
            45% 20%,
            45% 0,
            51% 0,
            51% 20%,
            67% 20%,
            67% 7%,
            73% 7%,
            73% 20%,
            86% 20%,
            86% 0,
            92% 0,
            92% 20%,
            100% 20%,
            100% 100%,
            0 100%
          );
        }


        .castle-tower {
          position: absolute;

          bottom: 0;

          width: 75px;
          height: 230px;

          background: #000;
        }


        .tower-one {
          left: 14%;
        }


        .tower-two {
          left: 46%;
          height: 260px;
        }


        .tower-three {
          right: 14%;
        }


        /* =====================================================
           GLOWS
        ===================================================== */

        .red-glow,
        .gold-glow {
          position: absolute;

          border-radius: 50%;

          filter: blur(110px);
        }


        .red-glow-one {
          width: 500px;
          height: 500px;

          left: -250px;
          top: 180px;

          background: rgba(114,24,24,0.17);
        }


        .red-glow-two {
          width: 420px;
          height: 420px;

          right: -200px;
          bottom: 80px;

          background: rgba(114,24,24,0.12);
        }


        .gold-glow-one {
          width: 300px;
          height: 300px;

          right: 30%;
          top: 20%;

          background: rgba(201,164,92,0.06);
        }


        /* =====================================================
           HORIZON
        ===================================================== */

        .horizon {
          position: absolute;

          left: 0;
          right: 0;
          bottom: 0;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(201,164,92,0.4),
              transparent
            );
        }


        /* =====================================================
           EMBERS
        ===================================================== */

        .embers {
          position: absolute;
          inset: 0;

          overflow: hidden;

          pointer-events: none;
        }


        .ember {
          position: absolute;

          bottom: -20px;

          width: 3px;
          height: 3px;

          border-radius: 50%;

          background: ${C.goldLight};

          box-shadow:
            0 0 8px ${C.gold},
            0 0 18px rgba(201,164,92,0.45);

          opacity: 0;

          animation:
            rise 7s linear infinite;
        }


        @keyframes rise {

          0% {
            transform:
              translateY(0)
              translateX(0)
              scale(0.3);

            opacity: 0;
          }

          15% {
            opacity: 0.8;
          }

          70% {
            opacity: 0.4;
          }

          100% {
            transform:
              translateY(-850px)
              translateX(90px)
              scale(0);

            opacity: 0;
          }

        }


        /* =====================================================
           CONTAINER
        ===================================================== */

        .hero-container {
          position: relative;

          z-index: 10;

          width: 100%;
          max-width: 1550px;

          margin: auto;

          padding:
            110px
            60px
            120px;
        }


        .hero-grid {
          display: grid;

          grid-template-columns:
            0.9fr
            1.1fr;

          align-items: center;

          gap: 90px;
        }


        /* =====================================================
           LEFT
        ===================================================== */

        .hero-left {
          animation:
            heroEnter 1s ease forwards;
        }


        @keyframes heroEnter {

          from {
            opacity: 0;
            transform:
              translateY(30px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }

        }


        /* =====================================================
           LABEL
        ===================================================== */

        .royal-label {

          display: inline-flex;

          align-items: center;

          gap: 10px;

          margin-bottom: 25px;

          color: ${C.gold};

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 0.3em;

        }


        .royal-label svg {
          animation:
            crownGlow 3s ease-in-out infinite;
        }


        .royal-line {
          width: 35px;
          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              ${C.gold}
            );
        }


        .royal-line.reverse {
          transform: rotate(180deg);
        }


        @keyframes crownGlow {

          0%,
          100% {
            filter:
              drop-shadow(
                0 0 0
                transparent
              );
          }

          50% {
            filter:
              drop-shadow(
                0 0 8px
                rgba(201,164,92,0.8)
              );
          }

        }


        /* =====================================================
           OVERLINE
        ===================================================== */

        .hero-overline {

          display: flex;

          align-items: center;

          gap: 8px;

          margin-bottom: 12px;

          color: ${C.mutedDark};

          font-size: 8px;

          font-weight: 700;

          letter-spacing: 0.28em;
        }


        .overline-icon {
          color: ${C.gold};
        }


        /* =====================================================
           TITLE
        ===================================================== */

        .hero-title {

          margin: 0;

          max-width: 760px;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size:
            clamp(
              52px,
              6vw,
              88px
            );

          line-height: 0.92;

          letter-spacing: -0.055em;

          font-weight: 700;

          color: #f3ead8;

          text-shadow:
            0 8px 50px
            rgba(0,0,0,0.65);
        }


        .hero-title span {

          display: block;

          margin-top: 17px;

          color: transparent;

          background:
            linear-gradient(
              110deg,
              #80602d,
              #f2d58c,
              #a17a37,
              #f0d58a
            );

          background-size: 250%;

          background-clip: text;

          -webkit-background-clip: text;

          animation:
            goldFlow 6s ease infinite;
        }


        @keyframes goldFlow {

          0%,
          100% {
            background-position: 0%;
          }

          50% {
            background-position: 100%;
          }

        }


        /* =====================================================
           SWORD DIVIDER
        ===================================================== */

        .sword-divider {

          display: flex;

          align-items: center;

          gap: 13px;

          width: 280px;

          margin-top: 30px;

          color: ${C.gold};
        }


        .sword-divider > span {

          flex: 1;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(201,164,92,0.6)
            );
        }


        .sword-divider > span:last-child {
          transform: rotate(180deg);
        }


        .sword-icon {

          display: flex;

          align-items: center;

          justify-content: center;

          transform:
            rotate(90deg);

          filter:
            drop-shadow(
              0 0 8px
              rgba(201,164,92,0.3)
            );
        }


        /* =====================================================
           DESCRIPTION
        ===================================================== */

        .hero-description {

          max-width: 600px;

          margin-top: 28px;

          color: ${C.muted};

          font-size: 16px;

          line-height: 1.9;
        }


        .hero-description strong {

          display: inline-block;

          margin-top: 8px;

          color: ${C.goldLight};

          font-size: 14px;

          letter-spacing: 0.08em;
        }


        /* =====================================================
           ACTIONS
        ===================================================== */

        .hero-actions {

          display: flex;

          flex-wrap: wrap;

          gap: 13px;

          margin-top: 35px;
        }


        .got-primary,
        .got-secondary {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          min-height: 55px;

          padding:
            0 24px;

          border-radius: 3px;

          text-decoration: none;

          font-size: 11px;

          font-weight: 800;

          letter-spacing: 0.08em;

          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }


        .got-primary {

          color: #16110a;

          background:
            linear-gradient(
              135deg,
              #9c7537,
              #f0d083,
              #a07837
            );

          box-shadow:
            0 15px 35px
            rgba(0,0,0,0.4),

            inset 0 1px
            rgba(255,255,255,0.45);
        }


        .got-primary:hover {

          transform:
            translateY(-4px);

          box-shadow:
            0 20px 45px
            rgba(0,0,0,0.5),

            0 0 30px
            rgba(201,164,92,0.12);
        }


        .got-secondary {

          color: ${C.text};

          border:
            1px solid
            rgba(201,164,92,0.25);

          background:
            rgba(255,255,255,0.025);

          backdrop-filter:
            blur(10px);
        }


        .got-secondary:hover {

          transform:
            translateY(-4px);

          border-color:
            rgba(201,164,92,0.65);

          background:
            rgba(201,164,92,0.06);
        }


        /* =====================================================
           STATS
        ===================================================== */

        .kingdom-stats {

          display: flex;

          align-items: center;

          gap: 25px;

          margin-top: 50px;
        }


        .kingdom-stat {

          display: flex;

          align-items: center;

          gap: 10px;
        }


        .stat-icon {

          display: flex;

          align-items: center;

          justify-content: center;

          width: 36px;
          height: 36px;

          color: ${C.gold};

          border:
            1px solid
            rgba(201,164,92,0.2);

          background:
            rgba(201,164,92,0.035);
        }


        .kingdom-stat strong {

          display: block;

          color: ${C.text};

          font-family: Georgia, serif;

          font-size: 21px;
        }


        .kingdom-stat span {

          display: block;

          margin-top: 2px;

          color: ${C.mutedDark};

          font-size: 8px;

          font-weight: 700;

          letter-spacing: 0.15em;

          text-transform: uppercase;
        }


        .stat-divider {

          width: 1px;

          height: 34px;

          background:
            rgba(201,164,92,0.14);
        }


        /* =====================================================
           QUOTE
        ===================================================== */

        .hero-quote {

          display: flex;

          align-items: center;

          gap: 10px;

          margin-top: 30px;

          color: #625d54;
        }


        .hero-quote > span {

          color: ${C.gold};

          font-family: Georgia, serif;

          font-size: 36px;
        }


        .hero-quote p {

          margin: 0;

          font-family: Georgia, serif;

          font-size: 12px;

          font-style: italic;
        }


        /* =====================================================
           RIGHT
        ===================================================== */

        .hero-right {

          position: relative;

          min-height: 640px;

          display: flex;

          align-items: center;

          justify-content: center;
        }


        /* =====================================================
           ORBITS
        ===================================================== */

        .royal-orbit {

          position: absolute;

          border:
            1px solid
            rgba(201,164,92,0.045);

          border-radius: 50%;

          pointer-events: none;
        }


        .orbit-one {

          width: 720px;
          height: 720px;

          transform:
            rotate(20deg);
        }


        .orbit-two {

          width: 800px;
          height: 470px;

          transform:
            rotate(-15deg);
        }


        .orbit-three {

          width: 560px;
          height: 560px;

          border-style: dashed;

          animation:
            orbitRotate 40s linear infinite;
        }


        @keyframes orbitRotate {

          to {
            transform:
              rotate(360deg);
          }

        }


        /* =====================================================
           FLOATING CROWN
        ===================================================== */

        .floating-crown {

          position: absolute;

          right: 8%;
          top: 5%;

          display: flex;

          align-items: center;

          justify-content: center;

          width: 58px;
          height: 58px;

          color: ${C.goldLight};

          border:
            1px solid
            rgba(201,164,92,0.25);

          background:
            rgba(12,12,12,0.9);

          box-shadow:
            0 20px 50px
            rgba(0,0,0,0.5),

            0 0 30px
            rgba(201,164,92,0.08);

          animation:
            floatCrown 4s ease-in-out infinite;
        }


        @keyframes floatCrown {

          0%,
          100% {
            transform:
              translateY(0)
              rotate(0deg);
          }

          50% {
            transform:
              translateY(-8px)
              rotate(4deg);
          }

        }


        /* =====================================================
           REALM CARD
        ===================================================== */

        .realm-card {

          position: relative;

          z-index: 3;

          width: 100%;

          max-width: 590px;

          padding: 31px;

          overflow: hidden;

          border:
            1px solid
            rgba(201,164,92,0.27);

          border-radius: 5px;

          background:
            linear-gradient(
              145deg,
              rgba(25,24,22,0.98),
              rgba(9,9,9,0.99)
            );

          box-shadow:
            0 45px 120px
            rgba(0,0,0,0.65),

            inset 0 1px
            rgba(255,255,255,0.035);

          animation:
            realmFloat 7s ease-in-out infinite;
        }


        @keyframes realmFloat {

          0%,
          100% {
            transform:
              translateY(0);
          }

          50% {
            transform:
              translateY(-8px);
          }

        }


        .realm-card::before {

          content: "";

          position: absolute;

          inset: 0;

          pointer-events: none;

          background:
            radial-gradient(
              circle at 20% 0%,
              rgba(201,164,92,0.08),
              transparent 30%
            );
        }


        .realm-card::after {

          content: "";

          position: absolute;

          left: 12%;
          right: 12%;
          top: 0;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              ${C.gold},
              transparent
            );
        }


        /* =====================================================
           ORNAMENT
        ===================================================== */

        .realm-ornament {

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          margin-bottom: 22px;

          color: ${C.gold};
        }


        .realm-ornament span {

          width: 70px;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(201,164,92,0.45)
            );
        }


        .realm-ornament span:last-child {
          transform: rotate(180deg);
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .realm-header {

          display: flex;

          justify-content: space-between;

          gap: 20px;
        }


        .realm-eyebrow {

          color: ${C.gold};

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 0.25em;
        }


        .realm-header h2 {

          margin:
            8px 0 0;

          color: #eee4d0;

          font-family: Georgia, serif;

          font-size:
            clamp(
              24px,
              3vw,
              31px
            );

          line-height: 1.1;
        }


        .realm-header p {

          margin:
            8px 0 0;

          color: ${C.mutedDark};

          font-size: 10px;
        }


        /* =====================================================
           PROGRESS EMBLEM
        ===================================================== */

        .progress-emblem {

          flex-shrink: 0;

          width: 82px;
          height: 82px;

          padding: 5px;

          border-radius: 50%;

          background:
            conic-gradient(
              ${C.gold}
              0deg 245deg,

              rgba(201,164,92,0.08)
              245deg 360deg
            );

          box-shadow:
            0 0 30px
            rgba(201,164,92,0.1);
        }


        .emblem-ring {

          display: flex;

          align-items: center;

          justify-content: center;

          width: 100%;
          height: 100%;

          border-radius: 50%;

          background:
            #0c0c0c;
        }


        .emblem-inner {

          display: flex;

          align-items: baseline;

          color: ${C.goldLight};

          font-family: Georgia, serif;
        }


        .emblem-inner strong {

          font-size: 21px;
        }


        .emblem-inner span {

          font-size: 10px;
        }


        /* =====================================================
           XP
        ===================================================== */

        .xp-section {

          margin-top: 29px;

          padding-bottom: 3px;
        }


        .xp-header {

          display: flex;

          justify-content: space-between;

          align-items: flex-end;

          margin-bottom: 9px;
        }


        .xp-header div span {

          display: block;

          color: ${C.mutedDark};

          font-size: 7px;

          letter-spacing: 0.16em;
        }


        .xp-header div strong {

          display: block;

          margin-top: 3px;

          color: ${C.goldLight};

          font-family: Georgia, serif;

          font-size: 13px;
        }


        .xp-header > span {

          color: ${C.mutedDark};

          font-size: 7px;

          letter-spacing: 0.08em;
        }


        .xp-track {

          height: 5px;

          overflow: hidden;

          border-radius: 999px;

          background:
            #24211d;
        }


        .xp-fill {

          position: relative;

          width: 68%;

          height: 100%;

          background:
            linear-gradient(
              90deg,
              #72542a,
              #e5c476,
              #a77c3b
            );

          box-shadow:
            0 0 14px
            rgba(201,164,92,0.25);
        }


        .xp-fill span {

          position: absolute;

          right: 0;

          top: 0;

          width: 60px;

          height: 100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.5),
              transparent
            );

          animation:
            xpShine 2.5s linear infinite;
        }


        @keyframes xpShine {

          from {
            transform:
              translateX(-70px);
          }

          to {
            transform:
              translateX(70px);
          }

        }


        /* =====================================================
           JOURNEY
        ===================================================== */

        .journey-section {

          margin-top: 28px;
        }


        .journey-title {

          display: flex;

          align-items: center;

          gap: 7px;

          margin-bottom: 18px;

          color: ${C.gold};

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 0.2em;
        }


        .roadmap {

          position: relative;
        }


        .road-line {

          position: absolute;

          left: 18px;

          top: 19px;

          bottom: 20px;

          width: 1px;

          background:
            linear-gradient(
              ${C.goldDark},
              rgba(201,164,92,0.04)
            );
        }


        .road-item {

          position: relative;

          display: flex;

          gap: 16px;

          margin-bottom: 18px;
        }


        .road-item:last-child {
          margin-bottom: 0;
        }


        .road-node {

          position: relative;

          z-index: 2;

          display: flex;

          align-items: center;

          justify-content: center;

          width: 37px;
          height: 37px;

          flex-shrink: 0;

          border-radius: 50%;

          border:
            1px solid
            rgba(201,164,92,0.16);

          background:
            #0d0d0d;

          color:
            ${C.mutedDark};

          font-family:
            Georgia, serif;

          font-size: 10px;
        }


        .road-node.completed {

          color: #18130b;

          border-color:
            ${C.gold};

          background:
            ${C.gold};

          box-shadow:
            0 0 18px
            rgba(201,164,92,0.22);
        }


        .road-node.current {

          color:
            ${C.goldLight};

          border-color:
            ${C.gold};

          box-shadow:
            0 0 0 5px
            rgba(201,164,92,0.05),

            0 0 25px
            rgba(201,164,92,0.2);

          animation:
            nodePulse 2.4s ease-in-out infinite;
        }


        .road-node.locked {

          opacity: 0.65;
        }


        @keyframes nodePulse {

          0%,
          100% {
            box-shadow:
              0 0 0 5px
              rgba(201,164,92,0.04),

              0 0 18px
              rgba(201,164,92,0.12);
          }

          50% {
            box-shadow:
              0 0 0 8px
              rgba(201,164,92,0.025),

              0 0 28px
              rgba(201,164,92,0.25);
          }

        }


        .road-content {

          padding-top: 2px;
        }


        .road-title {

          display: flex;

          align-items: center;

          gap: 8px;
        }


        .road-title h3 {

          margin: 0;

          color:
            #e9dfcd;

          font-family:
            Georgia, serif;

          font-size: 13px;
        }


        .road-title span {

          padding:
            3px 6px;

          border:
            1px solid
            rgba(201,164,92,0.3);

          color:
            ${C.gold};

          font-size: 6px;

          font-weight: 800;

          letter-spacing: 0.12em;
        }


        .road-content p {

          margin:
            4px 0 5px;

          color:
            ${C.mutedDark};

          font-size: 9px;
        }


        .road-content small {

          font-size: 8px;

          font-weight: 700;

          letter-spacing: 0.08em;
        }


        .complete {
          color: #8f9d78;
        }


        .progress {
          color: ${C.gold};
        }


        .locked-text {
          color: #514d46;
        }


        /* =====================================================
           NEXT QUEST
        ===================================================== */

        .continue-quest {

          display: flex;

          align-items: center;

          gap: 13px;

          margin-top: 25px;

          padding: 13px;

          border:
            1px solid
            rgba(201,164,92,0.14);

          background:
            linear-gradient(
              90deg,
              rgba(201,164,92,0.06),
              rgba(255,255,255,0.012)
            );

          transition:
            border-color 0.3s ease,
            transform 0.3s ease;
        }


        .continue-quest:hover {

          border-color:
            rgba(201,164,92,0.35);

          transform:
            translateY(-2px);
        }


        .quest-icon {

          display: flex;

          align-items: center;

          justify-content: center;

          width: 39px;
          height: 39px;

          flex-shrink: 0;

          color:
            ${C.gold};

          border:
            1px solid
            rgba(201,164,92,0.2);

          background:
            rgba(201,164,92,0.05);
        }


        .quest-info {

          flex: 1;

          min-width: 0;
        }


        .quest-info span {

          display: block;

          color:
            ${C.mutedDark};

          font-size: 7px;

          letter-spacing: 0.16em;
        }


        .quest-info strong {

          display: block;

          margin-top: 4px;

          overflow: hidden;

          color:
            ${C.text};

          font-family:
            Georgia, serif;

          font-size: 12px;

          white-space: nowrap;

          text-overflow: ellipsis;
        }


        .quest-button {

          display: flex;

          align-items: center;

          justify-content: center;

          width: 39px;
          height: 39px;

          flex-shrink: 0;

          color:
            #16110a;

          background:
            ${C.gold};

          transition:
            transform 0.25s ease;
        }


        .quest-button:hover {

          transform:
            translateX(4px);
        }


        /* =====================================================
           BOTTOM ORNAMENT
        ===================================================== */

        .realm-bottom {

          display: flex;

          align-items: center;

          gap: 10px;

          margin-top: 21px;

          color:
            ${C.goldDark};
        }


        .realm-bottom span {

          flex: 1;

          height: 1px;

          background:
            rgba(201,164,92,0.12);
        }


        /* =====================================================
           FLOATING CARDS
        ===================================================== */

        .floating-card {

          position: absolute;

          z-index: 10;

          display: flex;

          align-items: center;

          gap: 10px;

          padding:
            11px 14px;

          border:
            1px solid
            rgba(201,164,92,0.2);

          background:
            rgba(12,12,12,0.94);

          backdrop-filter:
            blur(18px);

          box-shadow:
            0 20px 50px
            rgba(0,0,0,0.5);
        }


        .streak {

          left: -25px;

          bottom: 55px;

          animation:
            floating 5s ease-in-out infinite;
        }


        .rank {

          right: -25px;

          top: 80px;

          animation:
            floating 5s ease-in-out infinite reverse;
        }


        @keyframes floating {

          0%,
          100% {
            transform:
              translateY(0);
          }

          50% {
            transform:
              translateY(-7px);
          }

        }


        .floating-icon {

          display: flex;

          align-items: center;

          justify-content: center;

          width: 35px;
          height: 35px;

          color:
            ${C.gold};

          border:
            1px solid
            rgba(201,164,92,0.18);

          background:
            rgba(201,164,92,0.05);
        }


        .floating-card span {

          display: block;

          color:
            ${C.mutedDark};

          font-size: 7px;

          font-weight: 800;

          letter-spacing: 0.13em;
        }


        .floating-card strong {

          display: block;

          margin-top: 3px;

          color:
            ${C.text};

          font-family:
            Georgia, serif;

          font-size: 11px;
        }


        .online-dot {

          width: 6px;
          height: 6px;

          margin-left: 4px;

          border-radius: 50%;

          background:
            #8f9d78;

          box-shadow:
            0 0 9px
            #8f9d78;
        }


        /* =====================================================
           BOTTOM VIGNETTE
        ===================================================== */

        .bottom-vignette {

          position: absolute;

          z-index: 20;

          left: 0;
          right: 0;
          bottom: 0;

          height: 150px;

          pointer-events: none;

          background:
            linear-gradient(
              transparent,
              #050505
            );
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1200px) {

          .hero-container {

            padding:
              90px 40px 110px;
          }


          .hero-grid {

            gap: 50px;
          }


          .streak {
            left: 0;
          }


          .rank {
            right: 0;
          }

        }


        /* =====================================================
           1024
        ===================================================== */

        @media (max-width: 1024px) {

          .got-hero {
            min-height: auto;
          }


          .hero-grid {

            grid-template-columns: 1fr;

            gap: 80px;
          }


          .hero-left {

            text-align: center;
          }


          .royal-label,
          .hero-overline,
          .hero-actions,
          .hero-quote {

            justify-content: center;
          }


          .hero-description {

            margin-left: auto;
            margin-right: auto;
          }


          .sword-divider {

            margin-left: auto;
            margin-right: auto;
          }


          .kingdom-stats {

            justify-content: center;
          }


          .hero-right {

            min-height: 650px;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 640px) {

          .hero-container {

            padding:
              75px 20px 90px;
          }


          .hero-grid {

            gap: 50px;
          }


          .hero-title {

            font-size:
              clamp(
                45px,
                14vw,
                62px
              );
          }


          .hero-description {

            font-size: 14px;

            line-height: 1.8;
          }


          .hero-actions {

            flex-direction: column;
          }


          .got-primary,
          .got-secondary {

            width: 100%;
          }


          .kingdom-stats {

            gap: 12px;

            justify-content:
              space-between;
          }


          .stat-icon {

            display: none;
          }


          .kingdom-stat {

            gap: 0;
          }


          .kingdom-stat strong {

            font-size: 18px;
          }


          .realm-card {

            padding: 21px;
          }


          .realm-header {

            gap: 10px;
          }


          .realm-header h2 {

            font-size: 21px;
          }


          .realm-header p {

            max-width: 190px;
          }


          .progress-emblem {

            width: 65px;
            height: 65px;
          }


          .floating-card {

            display: none;
          }


          .royal-orbit {

            display: none;
          }


          .floating-crown {

            display: none;
          }


          .hero-quote {

            display: none;
          }


          .castle-silhouette {

            width: 700px;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 430px) {

          .hero-title {

            font-size: 43px;
          }


          .royal-label {

            font-size: 8px;

            letter-spacing:
              0.2em;
          }


          .royal-line {

            width: 20px;
          }


          .kingdom-stats {

            margin-top: 38px;
          }


          .kingdom-stat strong {

            font-size: 16px;
          }


          .kingdom-stat span {

            font-size: 7px;
          }


          .road-content p {

            max-width: 170px;
          }


          .xp-header > span {

            display: none;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {

            animation-duration: 0.01ms !important;

            animation-iteration-count:
              1 !important;

            scroll-behavior:
              auto !important;
          }

        }

      `}</style>

    </section>
  );
}

export default Hero;