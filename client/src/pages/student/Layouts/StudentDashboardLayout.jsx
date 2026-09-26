import { Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";

import StudentSidebar from "../components/student/StudentSidebar";
import StudentHeader from "../components/student/StudentHeader";

function StudentDashboardLayout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#06080a] text-slate-200">

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
        aria-hidden="true"
      >
        {/* Kingdom glow */}

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
            will-change-transform
          "
        />

        {/* Winter glow */}

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
            will-change-transform
          "
        />

        {/* Vignette */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.18)_70%,rgba(0,0,0,.4)_100%)]
          "
        />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.025]"
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

        {/* Fog */}

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
            will-change-transform
          "
        />
      </div>

      {/* ========================================================
          PARTICLES
      ======================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-[1]
          overflow-hidden
        "
        aria-hidden="true"
      >
        <span
          className="
            absolute
            left-[18%]
            top-[20%]
            h-1
            w-1
            rounded-full
            bg-amber-400/40
            animate-particle-1
            will-change-transform
          "
        />

        <span
          className="
            absolute
            left-[43%]
            top-[65%]
            h-1
            w-1
            rounded-full
            bg-cyan-300/30
            animate-particle-2
            will-change-transform
          "
        />

        <span
          className="
            absolute
            left-[72%]
            top-[28%]
            h-1
            w-1
            rounded-full
            bg-amber-300/30
            animate-particle-3
            will-change-transform
          "
        />

        <span
          className="
            absolute
            left-[86%]
            top-[72%]
            h-1
            w-1
            rounded-full
            bg-cyan-400/30
            animate-particle-1
            will-change-transform
          "
        />

        <span
          className="
            absolute
            left-[55%]
            top-[15%]
            h-1
            w-1
            rounded-full
            bg-white/20
            animate-particle-2
            will-change-transform
          "
        />
      </div>

      {/* ========================================================
          SIDEBAR
      ======================================================== */}

      <StudentSidebar />

      {/* ========================================================
          MAIN AREA
      ======================================================== */}

      <div className="relative z-10 lg:ml-[275px]">

        <StudentHeader />

        <main className="relative pt-[72px]">

          {/* Top content glow */}

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
            aria-hidden="true"
          />

          {/* Page content */}

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
          TOP BORDER
      ======================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          left-0
          right-0
          top-0
          z-[100]
          h-px
          bg-gradient-to-r
          from-transparent
          via-amber-500/60
          to-transparent
          shadow-[0_0_15px_rgba(245,158,11,.25)]
        "
        aria-hidden="true"
      />

      {/* ========================================================
          BOTTOM BORDER
      ======================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          bottom-0
          left-0
          right-0
          z-[100]
          h-px
          bg-gradient-to-r
          from-transparent
          via-cyan-700/30
          to-transparent
        "
        aria-hidden="true"
      />

      {/* ========================================================
          AMBIENT SIGIL
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
        aria-hidden="true"
      >
        <Sparkles
          size={100}
          strokeWidth={0.7}
          className="
            text-amber-400
            animate-sigil
            will-change-transform
          "
        />
      </div>

      {/* ========================================================
          ANIMATIONS
      ======================================================== */}

      <style>{`
        /* ======================================================
           KINGDOM GLOW
        ====================================================== */

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

        /* ======================================================
           WINTER GLOW
        ====================================================== */

        @keyframes winterGlow {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: .25;
          }

          50% {
            transform: translate3d(-30px, -20px, 0) scale(1.1);
            opacity: .5;
          }

          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: .25;
          }
        }

        .animate-winter-glow {
          animation: winterGlow 11s ease-in-out infinite;
        }

        /* ======================================================
           DASHBOARD FOG
        ====================================================== */

        @keyframes dashboardFog {
          0% {
            transform: translate3d(-10%, 0, 0);
            opacity: .15;
          }

          50% {
            transform: translate3d(30%, 0, 0);
            opacity: .3;
          }

          100% {
            transform: translate3d(-10%, 0, 0);
            opacity: .15;
          }
        }

        .animate-dashboard-fog {
          animation: dashboardFog 18s ease-in-out infinite;
        }

        /* ======================================================
           PARTICLE 1
        ====================================================== */

        @keyframes particleOne {
          0% {
            transform: translate3d(0, 20px, 0);
            opacity: 0;
          }

          30% {
            opacity: .6;
          }

          70% {
            opacity: .3;
          }

          100% {
            transform: translate3d(0, -80px, 0);
            opacity: 0;
          }
        }

        .animate-particle-1 {
          animation: particleOne 7s ease-in-out infinite;
        }

        /* ======================================================
           PARTICLE 2
        ====================================================== */

        @keyframes particleTwo {
          0% {
            transform: translate3d(0, 20px, 0);
            opacity: 0;
          }

          40% {
            opacity: .5;
          }

          100% {
            transform: translate3d(30px, -90px, 0);
            opacity: 0;
          }
        }

        .animate-particle-2 {
          animation: particleTwo 10s ease-in-out infinite;
        }

        /* ======================================================
           PARTICLE 3
        ====================================================== */

        @keyframes particleThree {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: .1;
          }

          50% {
            transform: translate3d(0, -50px, 0);
            opacity: .5;
          }

          100% {
            transform: translate3d(0, 0, 0);
            opacity: .1;
          }
        }

        .animate-particle-3 {
          animation: particleThree 8s ease-in-out infinite;
        }

        /* ======================================================
           SIGIL
        ====================================================== */

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

        /* ======================================================
           REDUCED MOTION
        ====================================================== */

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