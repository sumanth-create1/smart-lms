import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";

import StudentSidebar from "../components/student/StudentSidebar";
import StudentHeader from "../components/student/StudentHeader";

function StudentDashboardLayout() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  const [cursorVisible, setCursorVisible] = useState(false);

  // ============================================================
  // PREMIUM CURSOR TRACKING
  // ============================================================

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });

      setCursorVisible(true);
    };

    const handleMouseLeave = () => {
      setCursorVisible(false);
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    document.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      document.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#06080a] text-slate-200">
      {/* ========================================================
          PREMIUM CURSOR SYSTEM
      ======================================================== */}

      {/* Main golden spotlight */}

      <div
        className={`
          pointer-events-none
          fixed
          z-[999]
          h-[420px]
          w-[420px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-amber-500/[0.045]
          blur-[90px]
          transition-opacity
          duration-300
          ${cursorVisible ? "opacity-100" : "opacity-0"}
        `}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />

      {/* Secondary icy aura */}

      <div
        className={`
          pointer-events-none
          fixed
          z-[998]
          h-[180px]
          w-[180px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-400/[0.035]
          blur-[60px]
          transition-opacity
          duration-300
          ${cursorVisible ? "opacity-100" : "opacity-0"}
        `}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />

      {/* ========================================================
          CURSOR RING
      ======================================================== */}

      <div
        className={`
          pointer-events-none
          fixed
          z-[1001]
          h-8
          w-8
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-amber-500/40
          transition-opacity
          duration-300
          ${cursorVisible ? "opacity-100" : "opacity-0"}
        `}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      >
        {/* Inner dot */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-1
            w-1
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-amber-400
            shadow-[0_0_12px_rgba(251,191,36,.9)]
          "
        />

        {/* Top crosshair */}

        <span
          className="
            absolute
            left-1/2
            top-[-7px]
            h-2
            w-px
            -translate-x-1/2
            bg-amber-500/50
          "
        />

        {/* Bottom crosshair */}

        <span
          className="
            absolute
            bottom-[-7px]
            left-1/2
            h-2
            w-px
            -translate-x-1/2
            bg-amber-500/50
          "
        />

        {/* Left crosshair */}

        <span
          className="
            absolute
            left-[-7px]
            top-1/2
            h-px
            w-2
            -translate-y-1/2
            bg-amber-500/50
          "
        />

        {/* Right crosshair */}

        <span
          className="
            absolute
            right-[-7px]
            top-1/2
            h-px
            w-2
            -translate-y-1/2
            bg-amber-500/50
          "
        />
      </div>

      {/* ========================================================
          AMBIENT BACKGROUND
      ======================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          overflow-hidden
        "
      >
        {/* Golden atmospheric glow */}

        <div
          className="
            absolute
            -left-40
            top-20
            h-[500px]
            w-[500px]
            rounded-full
            bg-amber-950/[0.08]
            blur-[140px]
            animate-kingdom-glow
          "
        />

        {/* Ice atmospheric glow */}

        <div
          className="
            absolute
            -right-40
            bottom-10
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-950/[0.07]
            blur-[140px]
            animate-winter-glow
          "
        />

        {/* Center darkness */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.18)_70%,rgba(0,0,0,.4)_100%)]
          "
        />

        {/* Stone grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
          "
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,.35) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,.35) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Moving fog */}

        <div
          className="
            absolute
            bottom-0
            left-[-10%]
            h-32
            w-[60%]
            rounded-full
            bg-white/[0.012]
            blur-[80px]
            animate-dashboard-fog
          "
        />
      </div>

      {/* ========================================================
          PARTICLES
      ======================================================== */}

      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        <span className="absolute left-[18%] top-[20%] h-1 w-1 rounded-full bg-amber-400/40 animate-particle-1" />

        <span className="absolute left-[43%] top-[65%] h-1 w-1 rounded-full bg-cyan-300/30 animate-particle-2" />

        <span className="absolute left-[72%] top-[28%] h-1 w-1 rounded-full bg-amber-300/30 animate-particle-3" />

        <span className="absolute left-[86%] top-[72%] h-1 w-1 rounded-full bg-cyan-400/30 animate-particle-1" />

        <span className="absolute left-[55%] top-[15%] h-1 w-1 rounded-full bg-white/20 animate-particle-2" />
      </div>

      {/* ========================================================
          SIDEBAR
      ======================================================== */}

      <StudentSidebar />

      {/* ========================================================
          MAIN AREA
      ======================================================== */}

      <div className="relative z-10 lg:ml-72">
        {/* Header */}

        <StudentHeader />

        {/* ======================================================
            PAGE CONTENT
        ====================================================== */}

        <main className="relative pt-[72px]">
          {/* Content atmosphere */}

          <div
            className="
              pointer-events-none
              absolute
              left-0
              right-0
              top-0
              h-40
              bg-gradient-to-b
              from-amber-950/[0.035]
              to-transparent
            "
          />

          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              px-4
              py-6
              sm:px-6
              lg:px-8
              lg:py-8
            "
          >
            <Outlet />
          </div>
        </main>
      </div>

      {/* ========================================================
          PREMIUM TOP BORDER
      ======================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          left-0
          right-0
          top-0
          z-[100]
          h-[1px]
          bg-gradient-to-r
          from-transparent
          via-amber-500/60
          to-transparent
          shadow-[0_0_15px_rgba(245,158,11,.25)]
        "
      />

      {/* ========================================================
          PREMIUM BOTTOM BORDER
      ======================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          bottom-0
          left-0
          right-0
          z-[100]
          h-[1px]
          bg-gradient-to-r
          from-transparent
          via-cyan-700/30
          to-transparent
        "
      />

      {/* ========================================================
          AMBIENT CORNER SIGIL
      ======================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          bottom-6
          right-6
          z-[5]
          hidden
          opacity-[0.06]
          lg:block
        "
      >
        <Sparkles
          size={100}
          strokeWidth={0.7}
          className="
            text-amber-400
            animate-sigil
          "
        />
      </div>

      {/* ========================================================
          ANIMATIONS
      ======================================================== */}

      <style>{`
        @keyframes kingdomGlow {
          0% {
            transform: scale(1);
            opacity: .35;
          }

          50% {
            transform: scale(1.12);
            opacity: .6;
          }

          100% {
            transform: scale(1);
            opacity: .35;
          }
        }

        .animate-kingdom-glow {
          animation: kingdomGlow 9s ease-in-out infinite;
        }

        @keyframes winterGlow {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: .25;
          }

          50% {
            transform: translate(-30px, -20px) scale(1.1);
            opacity: .5;
          }

          100% {
            transform: translate(0, 0) scale(1);
            opacity: .25;
          }
        }

        .animate-winter-glow {
          animation: winterGlow 11s ease-in-out infinite;
        }

        @keyframes dashboardFog {
          0% {
            transform: translateX(-10%);
            opacity: .15;
          }

          50% {
            transform: translateX(30%);
            opacity: .3;
          }

          100% {
            transform: translateX(-10%);
            opacity: .15;
          }
        }

        .animate-dashboard-fog {
          animation: dashboardFog 18s ease-in-out infinite;
        }

        @keyframes particleOne {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }

          30% {
            opacity: .6;
          }

          70% {
            opacity: .3;
          }

          100% {
            transform: translateY(-80px);
            opacity: 0;
          }
        }

        .animate-particle-1 {
          animation: particleOne 7s ease-in-out infinite;
        }

        @keyframes particleTwo {
          0% {
            transform: translate(0, 20px);
            opacity: 0;
          }

          40% {
            opacity: .5;
          }

          100% {
            transform: translate(30px, -90px);
            opacity: 0;
          }
        }

        .animate-particle-2 {
          animation: particleTwo 10s ease-in-out infinite;
        }

        @keyframes particleThree {
          0% {
            transform: translateY(0);
            opacity: .1;
          }

          50% {
            transform: translateY(-50px);
            opacity: .5;
          }

          100% {
            transform: translateY(0);
            opacity: .1;
          }
        }

        .animate-particle-3 {
          animation: particleThree 8s ease-in-out infinite;
        }

        @keyframes sigil {
          0% {
            transform: rotate(0deg) scale(1);
          }

          50% {
            transform: rotate(180deg) scale(1.05);
          }

          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        .animate-sigil {
          animation: sigil 30s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-kingdom-glow,
          .animate-winter-glow,
          .animate-dashboard-fog,
          .animate-particle-1,
          .animate-particle-2,
          .animate-particle-3,
          .animate-sigil {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default StudentDashboardLayout;