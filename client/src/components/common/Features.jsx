import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Flame,
  Play,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";

const C = {
  bg: "#070707",
  surface: "#101010",
  surfaceLight: "#161616",
  surfaceHover: "#1B1A18",

  gold: "#C9A45C",
  goldLight: "#E6CC8A",
  goldDark: "#80602F",

  red: "#7E1D1D",
  redBright: "#B52B2B",

  text: "#F0E7D4",
  muted: "#9B9385",
  mutedDark: "#625D54",

  border: "rgba(201,164,92,0.18)",
};

function Features() {
  const roadmap = [
    {
      title: "Begin",
      subtitle: "Choose your path",
      icon: BookOpen,
      completed: true,
    },
    {
      title: "Learn",
      subtitle: "Master the knowledge",
      icon: ScrollText,
      completed: true,
    },
    {
      title: "Practice",
      subtitle: "Prove your skill",
      icon: Swords,
      active: true,
    },
    {
      title: "Conquer",
      subtitle: "Claim mastery",
      icon: Trophy,
    },
  ];

  return (
    <section
      id="features"
      className="got-features relative w-full overflow-hidden"
    >
      {/* =====================================================
          CINEMATIC BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 pointer-events-none">
        <div className="feature-glow feature-glow-left" />
        <div className="feature-glow feature-glow-right" />
        <div className="feature-glow feature-glow-center" />

        <div className="stone-texture" />
        <div className="feature-grid" />

        <div className="castle-shadow castle-one" />
        <div className="castle-shadow castle-two" />
      </div>

      {/* =====================================================
          EMBERS
      ===================================================== */}

      <div className="feature-embers pointer-events-none">
        {Array.from({ length: 32 }).map((_, index) => (
          <span
            key={index}
            className="feature-ember"
            style={{
              left: `${(index * 31) % 100}%`,
              animationDelay: `${(index % 10) * 0.65}s`,
              animationDuration: `${6 + (index % 5)}s`,
            }}
          />
        ))}
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 py-24 sm:px-10 lg:px-14 lg:py-32">
        <div className="mx-auto w-full max-w-[1120px]">

          {/* =================================================
              SECTION HEADER
          ================================================= */}

          <div className="features-header">
            <div className="features-kicker">
              <span className="kicker-line" />

              <Sparkles size={14} />

              <span>THE ART OF LEARNING</span>

              <span className="kicker-line reverse" />
            </div>

            <div className="header-grid">
              <div>
                <h2 className="features-title">
                  Every master
                  <span>needs a path.</span>
                </h2>

                <div className="features-divider">
                  <span />
                  <Shield size={16} />
                  <span />
                </div>
              </div>

              <div className="features-intro">
                <span className="intro-number">THE SMART LMS CODEX</span>

                <p>
                  A focused learning realm designed to take you from your
                  first lesson to real-world mastery — one challenge,
                  one skill, and one victory at a time.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              FEATURE GRID
          ================================================= */}

          <div className="features-grid">

            {/* =================================================
                FEATURE 01 — THE PATH
            ================================================= */}

            <article className="feature-card feature-path group">
              <div className="card-top-line" />

              <div className="card-corner top-left" />
              <div className="card-corner top-right" />
              <div className="card-corner bottom-left" />
              <div className="card-corner bottom-right" />

              {/* Decorative radial */}
              <div className="card-radial" />

              {/* Header */}
              <div className="feature-card-header">
                <div className="feature-index">
                  <span>01</span>
                  <small>THE PATH</small>
                </div>

                <div className="feature-icon-gold">
                  <MapIcon />
                </div>
              </div>

              {/* Content */}
              <div className="path-content">
                <span className="micro-label">
                  KNOWLEDGE IS THE FIRST WEAPON
                </span>

                <h3>
                  Learn with
                  <span>purpose.</span>
                </h3>

                <p>
                  Follow a structured journey where every lesson has
                  a destination. No confusion. No wandering. Just a
                  clear path toward mastery.
                </p>
              </div>

              {/* Medieval Roadmap */}
              <div className="medieval-roadmap">
                <div className="roadmap-line-background" />
                <div className="roadmap-line-active" />

                {roadmap.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className={`roadmap-step ${
                        item.active ? "active" : ""
                      }`}
                    >
                      <div
                        className={`roadmap-node ${
                          item.completed ? "completed" : ""
                        } ${item.active ? "current" : ""}`}
                      >
                        <Icon size={15} />
                      </div>

                      <div className="roadmap-step-text">
                        <strong>{item.title}</strong>
                        <span>{item.subtitle}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom quote */}
              <div className="card-quote">
                <span>✦</span>
                <em>
                  "A journey of a thousand skills begins with one lesson."
                </em>
              </div>
            </article>

            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

            <div className="feature-right-column">

              {/* =================================================
                  FEATURE 02 — PROGRESS
              ================================================= */}

              <article className="feature-card progress-card group">
                <div className="card-top-line red-line" />

                <div className="feature-card-header">
                  <div className="feature-index red-index">
                    <span>02</span>
                    <small>THE CHRONICLE</small>
                  </div>

                  <div className="feature-icon-red">
                    <CheckCircle2 size={20} />
                  </div>
                </div>

                <div className="small-feature-content">
                  <div className="feature-meta">
                    <span>PROGRESS TRACKING</span>

                    <span className="status-online">
                      <i />
                      ACTIVE
                    </span>
                  </div>

                  <h3>
                    Know exactly
                    <span>where you stand.</span>
                  </h3>

                  <p>
                    Every lecture, every milestone and every completed
                    chapter becomes part of your learning chronicle.
                  </p>

                  {/* Course progress panel */}
                  <div className="progress-panel">

                    <div className="progress-course-header">
                      <div className="course-symbol">
                        <Shield size={15} />
                      </div>

                      <div>
                        <span>CURRENT QUEST</span>
                        <strong>MERN Stack Bootcamp</strong>
                      </div>

                      <div className="progress-percent">
                        68<span>%</span>
                      </div>
                    </div>

                    <div className="cinematic-progress">
                      <div className="cinematic-progress-fill">
                        <div className="progress-glint" />
                      </div>
                    </div>

                    <div className="progress-footer">
                      <span>12 Chapters completed</span>
                      <span>Mastery: Rising</span>
                    </div>

                  </div>
                </div>
              </article>

              {/* =================================================
                  FEATURE 03 — RESUME
              ================================================= */}

              <article className="feature-card resume-card group">
                <div className="card-top-line gold-line" />

                <div className="feature-card-header">
                  <div className="feature-index">
                    <span>03</span>
                    <small>THE RETURN</small>
                  </div>

                  <div className="feature-icon-gold">
                    <Flame size={20} />
                  </div>
                </div>

                <div className="small-feature-content">
                  <div className="feature-meta">
                    <span>CONTINUE YOUR QUEST</span>

                    <span className="saved-status">
                      PROGRESS SAVED
                    </span>
                  </div>

                  <h3>
                    Never lose
                    <span>your momentum.</span>
                  </h3>

                  <p>
                    Leave whenever you must. Return whenever you are
                    ready. Smart LMS remembers exactly where your
                    journey stopped.
                  </p>

                  {/* Continue learning */}
                  <div className="continue-quest">

                    <div className="quest-icon">
                      <Play size={16} fill="currentColor" />
                    </div>

                    <div className="quest-info">
                      <span>NEXT CHAPTER</span>
                      <strong>React Fundamentals</strong>
                      <small>Lecture 08 · Components</small>
                    </div>

                    <div className="quest-arrow">
                      <ChevronRight size={19} />
                    </div>

                  </div>

                  {/* Streak */}
                  <div className="resume-footer">

                    <div className="mini-stat">
                      <Flame size={14} />
                      <div>
                        <span>STREAK</span>
                        <strong>7 DAYS</strong>
                      </div>
                    </div>

                    <div className="mini-divider" />

                    <div className="mini-stat">
                      <Trophy size={14} />
                      <div>
                        <span>RANK</span>
                        <strong>WARRIOR</strong>
                      </div>
                    </div>

                  </div>
                </div>
              </article>

            </div>
          </div>

          {/* =================================================
              BOTTOM STATEMENT
          ================================================= */}

          <div className="features-bottom">

            <div className="bottom-emblem">
              <Swords size={18} />
            </div>

            <div className="bottom-copy">
              <span>YOUR JOURNEY AWAITS</span>

              <p>
                From your first line of code to your final project,
                Smart LMS keeps the road ahead visible.
              </p>
            </div>

            <div className="bottom-ornament">
              <span />
              <span>✦</span>
              <span />
            </div>

          </div>

        </div>
      </div>

      {/* Bottom cinematic fade */}
      <div className="features-bottom-fade" />

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           SECTION
        ===================================================== */

        .got-features {
          min-height: 900px;
          background:
            radial-gradient(
              circle at 50% 100%,
              #24130d 0%,
              transparent 38%
            ),
            linear-gradient(
              180deg,
              #080808 0%,
              #0b0b0b 50%,
              #080808 100%
            );
          color: ${C.text};
        }

        /* =====================================================
           BACKGROUND
        ===================================================== */

        .feature-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(110px);
        }

        .feature-glow-left {
          width: 500px;
          height: 500px;
          left: -280px;
          top: 180px;
          background: rgba(126, 29, 29, 0.13);
        }

        .feature-glow-right {
          width: 450px;
          height: 450px;
          right: -250px;
          top: 300px;
          background: rgba(201, 164, 92, 0.07);
        }

        .feature-glow-center {
          width: 500px;
          height: 250px;
          left: 50%;
          bottom: -150px;
          transform: translateX(-50%);
          background: rgba(143, 29, 29, 0.15);
        }

        .stone-texture {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          background-image:
            radial-gradient(
              rgba(255,255,255,0.08) 0.5px,
              transparent 0.5px
            );
          background-size: 5px 5px;
        }

        .feature-grid {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image:
            linear-gradient(
              rgba(201,164,92,0.7) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(201,164,92,0.7) 1px,
              transparent 1px
            );
          background-size: 80px 80px;
        }

        /* =====================================================
           CASTLE SILHOUETTES
        ===================================================== */

        .castle-shadow {
          position: absolute;
          bottom: 0;
          opacity: 0.06;
          background: #000;
        }

        .castle-one {
          left: 4%;
          width: 160px;
          height: 170px;
          clip-path: polygon(
            0 100%,
            0 45%,
            15% 45%,
            15% 22%,
            28% 22%,
            28% 40%,
            42% 40%,
            42% 12%,
            56% 12%,
            56% 40%,
            75% 40%,
            75% 28%,
            88% 28%,
            88% 48%,
            100% 48%,
            100% 100%
          );
        }

        .castle-two {
          right: 5%;
          width: 190px;
          height: 190px;
          clip-path: polygon(
            0 100%,
            0 40%,
            12% 40%,
            12% 15%,
            25% 15%,
            25% 38%,
            40% 38%,
            40% 5%,
            55% 5%,
            55% 38%,
            72% 38%,
            72% 20%,
            86% 20%,
            86% 42%,
            100% 42%,
            100% 100%
          );
        }

        /* =====================================================
           EMBERS
        ===================================================== */

        .feature-ember {
          position: absolute;
          bottom: -20px;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: ${C.goldLight};
          box-shadow:
            0 0 7px ${C.gold},
            0 0 14px rgba(201,164,92,0.4);
          opacity: 0;
          animation: featureRise 8s linear infinite;
        }

        @keyframes featureRise {

          0% {
            transform:
              translateY(0)
              translateX(0)
              scale(0.4);
            opacity: 0;
          }

          15% {
            opacity: 0.65;
          }

          70% {
            opacity: 0.3;
          }

          100% {
            transform:
              translateY(-900px)
              translateX(80px)
              scale(0);
            opacity: 0;
          }

        }

        /* =====================================================
           HEADER
        ===================================================== */

        .features-header {
          margin-bottom: 75px;
        }

        .features-kicker {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: ${C.gold};
          font-family: monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }

        .kicker-line {
          width: 55px;
          height: 1px;
          background:
            linear-gradient(
              90deg,
              transparent,
              ${C.gold}
            );
        }

        .kicker-line.reverse {
          transform: rotate(180deg);
        }

        .header-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 70px;
          align-items: end;
          margin-top: 30px;
        }

        .features-title {
          margin: 0;
          color: ${C.text};
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(48px, 6vw, 76px);
          font-weight: 700;
          line-height: 0.96;
          letter-spacing: -0.045em;
          text-shadow:
            0 4px 35px rgba(0,0,0,0.5);
        }

        .features-title span {
          display: block;
          margin-top: 10px;
          color: transparent;
          background:
            linear-gradient(
              120deg,
              #967033,
              #f0d48c,
              #9a7538
            );
          background-clip: text;
          -webkit-background-clip: text;
        }

        .features-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 270px;
          margin-top: 25px;
          color: ${C.gold};
        }

        .features-divider span {
          height: 1px;
          flex: 1;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(201,164,92,0.5)
            );
        }

        .features-divider span:last-child {
          transform: rotate(180deg);
        }

        .features-intro {
          max-width: 500px;
          padding-bottom: 4px;
        }

        .intro-number {
          color: ${C.gold};
          font-family: monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
        }

        .features-intro p {
          margin: 15px 0 0;
          color: ${C.muted};
          font-size: 16px;
          line-height: 1.85;
        }

        /* =====================================================
           GRID
        ===================================================== */

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: stretch;
        }

        .feature-right-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* =====================================================
           FEATURE CARD
        ===================================================== */

        .feature-card {
          position: relative;
          overflow: hidden;
          border: 1px solid ${C.border};
          background:
            linear-gradient(
              145deg,
              rgba(23,23,23,0.98),
              rgba(10,10,10,0.99)
            );
          box-shadow:
            0 30px 80px rgba(0,0,0,0.4),
            inset 0 1px rgba(255,255,255,0.025);
          transition:
            transform 0.45s ease,
            border-color 0.45s ease,
            box-shadow 0.45s ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(201,164,92,0.38);
          box-shadow:
            0 40px 100px rgba(0,0,0,0.55),
            0 0 40px rgba(201,164,92,0.045);
        }

        .feature-path {
          min-height: 600px;
          padding: 38px;
          border-radius: 8px;
        }

        .progress-card,
        .resume-card {
          padding: 32px;
          border-radius: 8px;
        }

        .card-top-line {
          position: absolute;
          top: 0;
          left: 12%;
          right: 12%;
          height: 1px;
          background:
            linear-gradient(
              90deg,
              transparent,
              ${C.gold},
              transparent
            );
          opacity: 0.7;
        }

        .red-line {
          background:
            linear-gradient(
              90deg,
              transparent,
              ${C.redBright},
              transparent
            );
        }

        .gold-line {
          background:
            linear-gradient(
              90deg,
              transparent,
              ${C.goldLight},
              transparent
            );
        }

        /* =====================================================
           CORNERS
        ===================================================== */

        .card-corner {
          position: absolute;
          width: 18px;
          height: 18px;
          opacity: 0.45;
        }

        .card-corner::before,
        .card-corner::after {
          content: "";
          position: absolute;
          background: ${C.gold};
        }

        .card-corner::before {
          width: 100%;
          height: 1px;
        }

        .card-corner::after {
          width: 1px;
          height: 100%;
        }

        .top-left {
          top: 13px;
          left: 13px;
        }

        .top-right {
          top: 13px;
          right: 13px;
          transform: rotate(90deg);
        }

        .bottom-left {
          bottom: 13px;
          left: 13px;
          transform: rotate(-90deg);
        }

        .bottom-right {
          right: 13px;
          bottom: 13px;
          transform: rotate(180deg);
        }

        /* =====================================================
           RADIAL
        ===================================================== */

        .card-radial {
          position: absolute;
          width: 400px;
          height: 400px;
          right: -180px;
          top: -180px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(201,164,92,0.08),
              transparent 65%
            );
          transition: transform 0.8s ease;
        }

        .feature-card:hover .card-radial {
          transform: scale(1.25);
        }

        /* =====================================================
           CARD HEADER
        ===================================================== */

        .feature-card-header {
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          z-index: 2;
        }

        .feature-index span {
          display: block;
          color: ${C.gold};
          font-family: Georgia, serif;
          font-size: 20px;
        }

        .feature-index small {
          display: block;
          margin-top: 3px;
          color: ${C.mutedDark};
          font-family: monospace;
          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.17em;
        }

        .red-index span {
          color: #B76565;
        }

        .feature-icon-gold,
        .feature-icon-red {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(201,164,92,0.2);
          color: ${C.gold};
          background: rgba(201,164,92,0.055);
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease;
        }

        .feature-icon-red {
          color: #C75B5B;
          border-color: rgba(181,43,43,0.2);
          background: rgba(181,43,43,0.055);
        }

        .feature-card:hover .feature-icon-gold {
          transform: rotate(5deg) scale(1.08);
          box-shadow: 0 0 25px rgba(201,164,92,0.12);
        }

        .feature-card:hover .feature-icon-red {
          transform: rotate(-5deg) scale(1.08);
          box-shadow: 0 0 25px rgba(181,43,43,0.12);
        }

        /* =====================================================
           PATH CONTENT
        ===================================================== */

        .path-content {
          position: relative;
          z-index: 2;
          margin-top: 75px;
        }

        .micro-label {
          color: ${C.goldDark};
          font-family: monospace;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.17em;
        }

        .path-content h3 {
          margin: 10px 0 0;
          color: ${C.text};
          font-family: Georgia, serif;
          font-size: 38px;
          line-height: 1.03;
          letter-spacing: -0.035em;
        }

        .path-content h3 span {
          display: block;
          color: ${C.goldLight};
        }

        .path-content p {
          max-width: 470px;
          margin: 18px 0 0;
          color: ${C.muted};
          font-size: 14px;
          line-height: 1.8;
        }

        /* =====================================================
           ROADMAP
        ===================================================== */

        .medieval-roadmap {
          position: absolute;
          right: 38px;
          bottom: 88px;
          left: 38px;
          display: flex;
          justify-content: space-between;
        }

        .roadmap-line-background,
        .roadmap-line-active {
          position: absolute;
          top: 18px;
          left: 20px;
          right: 20px;
          height: 1px;
        }

        .roadmap-line-background {
          background: rgba(201,164,92,0.12);
        }

        .roadmap-line-active {
          right: 42%;
          background:
            linear-gradient(
              90deg,
              ${C.goldDark},
              ${C.gold}
            );
          box-shadow: 0 0 8px rgba(201,164,92,0.2);
        }

        .roadmap-step {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 23%;
          text-align: center;
        }

        .roadmap-node {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 37px;
          height: 37px;
          border: 1px solid rgba(201,164,92,0.15);
          border-radius: 50%;
          color: ${C.mutedDark};
          background: #0D0D0D;
          transition: all 0.35s ease;
        }

        .roadmap-node.completed {
          color: #16130D;
          border-color: ${C.gold};
          background: ${C.gold};
          box-shadow:
            0 0 18px rgba(201,164,92,0.18);
        }

        .roadmap-node.current {
          color: ${C.goldLight};
          border-color: ${C.gold};
          background: #16130E;
          box-shadow:
            0 0 0 6px rgba(201,164,92,0.045),
            0 0 24px rgba(201,164,92,0.18);
          animation: nodePulse 2.5s ease-in-out infinite;
        }

        @keyframes nodePulse {

          0%,100% {
            box-shadow:
              0 0 0 5px rgba(201,164,92,0.04),
              0 0 18px rgba(201,164,92,0.12);
          }

          50% {
            box-shadow:
              0 0 0 8px rgba(201,164,92,0.025),
              0 0 30px rgba(201,164,92,0.22);
          }

        }

        .roadmap-step-text {
          margin-top: 10px;
        }

        .roadmap-step-text strong {
          display: block;
          color: ${C.text};
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .roadmap-step-text span {
          display: block;
          margin-top: 3px;
          color: ${C.mutedDark};
          font-size: 8px;
          line-height: 1.3;
        }

        /* =====================================================
           QUOTE
        ===================================================== */

        .card-quote {
          position: absolute;
          right: 38px;
          bottom: 32px;
          left: 38px;
          display: flex;
          align-items: center;
          gap: 9px;
          color: ${C.mutedDark};
        }

        .card-quote span {
          color: ${C.gold};
        }

        .card-quote em {
          font-family: Georgia, serif;
          font-size: 10px;
        }

        /* =====================================================
           SMALL CARDS
        ===================================================== */

        .small-feature-content {
          margin-top: 26px;
        }

        .feature-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          color: ${C.gold};
          font-family: monospace;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.16em;
        }

        .status-online {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #798B68;
          font-size: 7px;
        }

        .status-online i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #798B68;
          box-shadow: 0 0 7px #798B68;
        }

        .saved-status {
          color: ${C.mutedDark};
        }

        .small-feature-content h3 {
          margin: 12px 0 0;
          color: ${C.text};
          font-family: Georgia, serif;
          font-size: 27px;
          line-height: 1.08;
          letter-spacing: -0.03em;
        }

        .small-feature-content h3 span {
          display: block;
          color: ${C.goldLight};
        }

        .progress-card .small-feature-content h3 span {
          color: #B76565;
        }

        .small-feature-content > p {
          max-width: 560px;
          margin: 12px 0 0;
          color: ${C.muted};
          font-size: 13px;
          line-height: 1.7;
        }

        /* =====================================================
           PROGRESS PANEL
        ===================================================== */

        .progress-panel {
          margin-top: 21px;
          padding: 15px;
          border: 1px solid rgba(201,164,92,0.11);
          background:
            linear-gradient(
              100deg,
              rgba(201,164,92,0.045),
              rgba(255,255,255,0.012)
            );
        }

        .progress-course-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .course-symbol {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          color: ${C.gold};
          border: 1px solid rgba(201,164,92,0.16);
          background: rgba(201,164,92,0.04);
        }

        .progress-course-header > div:nth-child(2) {
          min-width: 0;
          flex: 1;
        }

        .progress-course-header span {
          display: block;
          color: ${C.mutedDark};
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.13em;
        }

        .progress-course-header strong {
          display: block;
          margin-top: 3px;
          overflow: hidden;
          color: ${C.text};
          font-family: Georgia, serif;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .progress-percent {
          color: ${C.gold};
          font-family: Georgia, serif;
          font-size: 19px;
        }

        .progress-percent span {
          display: inline;
          color: ${C.gold};
          font-family: inherit;
          font-size: 10px;
        }

        .cinematic-progress {
          position: relative;
          height: 6px;
          margin-top: 13px;
          overflow: hidden;
          border-radius: 999px;
          background: #29251F;
        }

        .cinematic-progress-fill {
          position: relative;
          width: 68%;
          height: 100%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              #735526,
              #DDBE72,
              #967237
            );
          box-shadow:
            0 0 12px rgba(201,164,92,0.22);
        }

        .progress-glint {
          position: absolute;
          top: 0;
          right: 0;
          width: 70px;
          height: 100%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.5),
              transparent
            );
          animation: progressGlint 2.8s linear infinite;
        }

        @keyframes progressGlint {
          from {
            transform: translateX(-80px);
          }

          to {
            transform: translateX(80px);
          }
        }

        .progress-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          color: ${C.mutedDark};
          font-size: 8px;
        }

        /* =====================================================
           CONTINUE QUEST
        ===================================================== */

        .continue-quest {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
          padding: 13px;
          border: 1px solid rgba(201,164,92,0.13);
          background:
            linear-gradient(
              90deg,
              rgba(201,164,92,0.065),
              rgba(255,255,255,0.015)
            );
          transition:
            border-color 0.3s ease,
            background 0.3s ease;
        }

        .resume-card:hover .continue-quest {
          border-color: rgba(201,164,92,0.3);
          background:
            linear-gradient(
              90deg,
              rgba(201,164,92,0.09),
              rgba(255,255,255,0.02)
            );
        }

        .quest-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          color: #18130C;
          background: ${C.gold};
        }

        .quest-info {
          min-width: 0;
          flex: 1;
        }

        .quest-info span {
          display: block;
          color: ${C.mutedDark};
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.13em;
        }

        .quest-info strong {
          display: block;
          margin-top: 4px;
          overflow: hidden;
          color: ${C.text};
          font-family: Georgia, serif;
          font-size: 13px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .quest-info small {
          display: block;
          margin-top: 3px;
          color: ${C.mutedDark};
          font-size: 8px;
        }

        .quest-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          flex-shrink: 0;
          color: ${C.gold};
          border: 1px solid rgba(201,164,92,0.18);
          transition: transform 0.3s ease;
        }

        .resume-card:hover .quest-arrow {
          transform: translateX(4px);
        }

        /* =====================================================
           RESUME FOOTER
        ===================================================== */

        .resume-footer {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 17px;
        }

        .mini-stat {
          display: flex;
          align-items: center;
          gap: 8px;
          color: ${C.gold};
        }

        .mini-stat div span {
          display: block;
          color: ${C.mutedDark};
          font-family: monospace;
          font-size: 6px;
          letter-spacing: 0.12em;
        }

        .mini-stat div strong {
          display: block;
          margin-top: 2px;
          color: ${C.text};
          font-family: Georgia, serif;
          font-size: 10px;
        }

        .mini-divider {
          width: 1px;
          height: 26px;
          background: rgba(201,164,92,0.13);
        }

        /* =====================================================
           BOTTOM STATEMENT
        ===================================================== */

        .features-bottom {
          display: flex;
          align-items: center;
          gap: 17px;
          margin-top: 65px;
          padding-top: 27px;
          border-top: 1px solid rgba(201,164,92,0.11);
        }

        .bottom-emblem {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          color: ${C.gold};
          border: 1px solid rgba(201,164,92,0.2);
          background: rgba(201,164,92,0.04);
        }

        .bottom-copy {
          flex: 1;
        }

        .bottom-copy span {
          color: ${C.gold};
          font-family: monospace;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.18em;
        }

        .bottom-copy p {
          max-width: 650px;
          margin: 5px 0 0;
          color: ${C.muted};
          font-size: 13px;
          line-height: 1.6;
        }

        .bottom-ornament {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 180px;
          color: ${C.goldDark};
        }

        .bottom-ornament span:first-child,
        .bottom-ornament span:last-child {
          height: 1px;
          flex: 1;
          background: rgba(201,164,92,0.15);
        }

        /* =====================================================
           FADE
        ===================================================== */

        .features-bottom-fade {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 130px;
          pointer-events: none;
          background:
            linear-gradient(
              transparent,
              #070707
            );
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1000px) {

          .header-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .features-intro {
            max-width: 650px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .feature-path {
            min-height: 560px;
          }

        }

        @media (max-width: 640px) {

          .got-features {
            min-height: auto;
          }

          .features-header {
            margin-bottom: 50px;
          }

          .features-kicker {
            font-size: 8px;
          }

          .kicker-line {
            width: 25px;
          }

          .features-title {
            font-size: 48px;
          }

          .features-intro p {
            font-size: 14px;
          }

          .feature-path {
            min-height: 600px;
            padding: 25px;
          }

          .progress-card,
          .resume-card {
            padding: 25px;
          }

          .path-content {
            margin-top: 65px;
          }

          .path-content h3 {
            font-size: 31px;
          }

          .medieval-roadmap {
            right: 25px;
            bottom: 92px;
            left: 25px;
          }

          .roadmap-step-text span {
            display: none;
          }

          .roadmap-step-text strong {
            font-size: 10px;
          }

          .card-quote {
            right: 25px;
            bottom: 30px;
            left: 25px;
          }

          .card-quote em {
            font-size: 9px;
          }

          .small-feature-content h3 {
            font-size: 24px;
          }

          .progress-footer {
            font-size: 7px;
          }

          .features-bottom {
            align-items: flex-start;
          }

          .bottom-ornament {
            display: none;
          }

        }

        @media (max-width: 480px) {

          .features-title {
            font-size: 42px;
          }

          .feature-card-header {
            gap: 10px;
          }

          .feature-icon-gold,
          .feature-icon-red {
            width: 42px;
            height: 42px;
          }

          .feature-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 7px;
          }

          .progress-course-header strong {
            font-size: 11px;
          }

          .progress-percent {
            font-size: 17px;
          }

          .roadmap-node {
            width: 32px;
            height: 32px;
          }

          .roadmap-line-background,
          .roadmap-line-active {
            top: 15px;
          }

          .roadmap-step-text strong {
            font-size: 9px;
          }

        }

        /* =====================================================
           ACCESSIBILITY
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .feature-ember,
          .roadmap-node.current,
          .progress-glint {
            animation: none;
          }

          .feature-card {
            transition: none;
          }

        }

      `}</style>
    </section>
  );
}

/* =============================================================
   SIMPLE MAP ICON
   ============================================================= */

function MapIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6.5 8 4l8 3 5-2.5v13L16 20l-8-3-5 2.5v-13Z" />
      <path d="M8 4v13" />
      <path d="M16 7v13" />
    </svg>
  );
}

export default Features;