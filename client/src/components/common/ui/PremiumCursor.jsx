import { useEffect, useRef } from "react";

function PremiumCursor() {
  const cursorRef = useRef(null);
  const auraRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    const aura = auraRef.current;

    if (!cursor || !aura) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let currentX = mouseX;
    let currentY = mouseY;

    let animationFrame;

    // ==========================================
    // MOUSE MOVE
    // ==========================================

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      // Crown follows immediately
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;

      // Large aura follows smoothly
      aura.style.left = `${mouseX}px`;
      aura.style.top = `${mouseY}px`;
    };

    // ==========================================
    // SMOOTH AURA
    // ==========================================

    const animate = () => {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;

      aura.style.transform = `
        translate(-50%, -50%)
        translate(${currentX - mouseX}px, ${currentY - mouseY}px)
      `;

      animationFrame =
        requestAnimationFrame(animate);
    };

    // ==========================================
    // HOVER EFFECT
    // ==========================================

    const handleMouseOver = (event) => {
      const target = event.target.closest(
        "button, a, input, select, textarea, article, [data-cursor]"
      );

      if (!target) return;

      if (
        target.matches(
          "button, a, [data-cursor='action']"
        )
      ) {
        cursor.classList.add(
          "royal-cursor-action"
        );

        aura.classList.add(
          "royal-aura-action"
        );
      } else if (
        target.matches(
          "article, [data-cursor='card']"
        )
      ) {
        cursor.classList.add(
          "royal-cursor-card"
        );

        aura.classList.add(
          "royal-aura-card"
        );
      } else {
        cursor.classList.add(
          "royal-cursor-input"
        );
      }
    };

    // ==========================================
    // HOVER OUT
    // ==========================================

    const handleMouseOut = (event) => {
      const target = event.target.closest(
        "button, a, input, select, textarea, article, [data-cursor]"
      );

      if (!target) return;

      const related = event.relatedTarget;

      if (
        related &&
        target.contains(related)
      ) {
        return;
      }

      cursor.classList.remove(
        "royal-cursor-action",
        "royal-cursor-card",
        "royal-cursor-input"
      );

      aura.classList.remove(
        "royal-aura-action",
        "royal-aura-card"
      );
    };

    // ==========================================
    // CLICK EFFECT
    // ==========================================

    const handleClick = (event) => {
      const burst = document.createElement(
        "div"
      );

      burst.className =
        "royal-cursor-burst";

      burst.style.left =
        `${event.clientX}px`;

      burst.style.top =
        `${event.clientY}px`;

      document.body.appendChild(burst);

      // Add several ember particles
      for (let i = 0; i < 6; i++) {
        const ember =
          document.createElement("span");

        ember.className =
          "royal-cursor-ember";

        ember.style.left =
          `${event.clientX}px`;

        ember.style.top =
          `${event.clientY}px`;

        ember.style.setProperty(
          "--angle",
          `${i * 60}deg`
        );

        document.body.appendChild(
          ember
        );

        setTimeout(() => {
          ember.remove();
        }, 800);
      }

      setTimeout(() => {
        burst.remove();
      }, 700);
    };

    // ==========================================
    // LISTENERS
    // ==========================================

    document.addEventListener(
      "mousemove",
      handleMouseMove
    );

    document.addEventListener(
      "mouseover",
      handleMouseOver
    );

    document.addEventListener(
      "mouseout",
      handleMouseOut
    );

    document.addEventListener(
      "click",
      handleClick
    );

    animationFrame =
      requestAnimationFrame(animate);

    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      document.removeEventListener(
        "mouseover",
        handleMouseOver
      );

      document.removeEventListener(
        "mouseout",
        handleMouseOut
      );

      document.removeEventListener(
        "click",
        handleClick
      );

      cancelAnimationFrame(
        animationFrame
      );
    };
  }, []);

  return (
    <>
      {/* ========================================
          ROYAL CURSOR
      ======================================== */}

      <div
        ref={cursorRef}
        className="royal-cursor"
      >

        {/* Outer rotating sigil */}

        <div className="royal-sigil">

          <span className="sigil-line line-1" />
          <span className="sigil-line line-2" />
          <span className="sigil-line line-3" />
          <span className="sigil-line line-4" />

        </div>

        {/* Crown */}

        <div className="royal-crown">

          <div className="crown-point point-left" />

          <div className="crown-point point-middle" />

          <div className="crown-point point-right" />

          <div className="crown-base" />

        </div>

        {/* Center flame */}

        <div className="royal-flame">
          🔥
        </div>

      </div>

      {/* ========================================
          LARGE AURA
      ======================================== */}

      <div
        ref={auraRef}
        className="royal-cursor-aura"
      />

      {/* ========================================
          STYLES
      ======================================== */}

      <style>{`

        /* =========================================
           HIDE NORMAL CURSOR
        ========================================= */

        @media (pointer: fine) {

          html,
          body,
          button,
          a,
          input,
          select,
          textarea {
            cursor: none !important;
          }

        }

        /* =========================================
           MAIN CURSOR
        ========================================= */

        .royal-cursor {

          position: fixed;

          left: 0;
          top: 0;

          width: 58px;
          height: 58px;

          z-index: 99999;

          pointer-events: none;

          transform:
            translate(-50%, -50%);

          display: flex;

          align-items: center;

          justify-content: center;

          transition:
            width 300ms
              cubic-bezier(.22,1,.36,1),

            height 300ms
              cubic-bezier(.22,1,.36,1),

            filter 300ms ease;

          filter:
            drop-shadow(
              0 0 8px
              rgba(249,115,22,.7)
            )

            drop-shadow(
              0 0 20px
              rgba(245,158,11,.25)
            );
        }

        /* =========================================
           ROTATING SIGIL
        ========================================= */

        .royal-sigil {

          position: absolute;

          inset: 0;

          border-radius: 50%;

          border:
            1px solid
            rgba(251,146,60,.65);

          box-shadow:

            0 0 12px
              rgba(249,115,22,.35),

            inset 0 0 12px
              rgba(249,115,22,.1);

          animation:
            royalSigilRotate
            7s linear infinite;
        }

        @keyframes royalSigilRotate {

          from {
            transform:
              rotate(0deg);
          }

          to {
            transform:
              rotate(360deg);
          }

        }

        /* =========================================
           SIGIL LINES
        ========================================= */

        .sigil-line {

          position: absolute;

          left: 50%;
          top: 50%;

          width: 5px;
          height: 5px;

          border-radius: 50%;

          background:
            #fbbf24;

          box-shadow:
            0 0 7px
            rgba(251,191,36,.9);

          transform-origin:
            center 25px;
        }

        .line-1 {
          transform:
            translate(-50%, -50%)
            rotate(0deg);
        }

        .line-2 {
          transform:
            translate(-50%, -50%)
            rotate(90deg);
        }

        .line-3 {
          transform:
            translate(-50%, -50%)
            rotate(180deg);
        }

        .line-4 {
          transform:
            translate(-50%, -50%)
            rotate(270deg);
        }

        /* =========================================
           CROWN
        ========================================= */

        .royal-crown {

          position: absolute;

          width: 30px;
          height: 24px;

          top: 13px;

          left: 50%;

          transform:
            translateX(-50%);

          filter:
            drop-shadow(
              0 0 6px
              rgba(251,191,36,.8)
            );
        }

        /* =========================================
           CROWN POINTS
        ========================================= */

        .crown-point {

          position: absolute;

          bottom: 6px;

          width: 8px;
          height: 15px;

          background:

            linear-gradient(
              135deg,
              #fff7cc,
              #fbbf24 45%,
              #d97706
            );

          clip-path:
            polygon(
              50% 0%,
              100% 100%,
              0% 100%
            );

          box-shadow:
            0 0 6px
            rgba(251,191,36,.7);
        }

        .point-left {
          left: 0;
        }

        .point-middle {
          left: 11px;

          height: 19px;
        }

        .point-right {
          right: 0;
        }

        /* =========================================
           CROWN BASE
        ========================================= */

        .crown-base {

          position: absolute;

          bottom: 2px;

          left: 1px;

          width: 28px;

          height: 7px;

          border-radius:
            2px 2px 6px 6px;

          background:

            linear-gradient(
              180deg,
              #fde68a,
              #f59e0b,
              #b45309
            );

          box-shadow:

            0 0 8px
              rgba(251,191,36,.8);
        }

        /* =========================================
           CENTER FLAME
        ========================================= */

        .royal-flame {

          position: absolute;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%, -20%);

          font-size: 9px;

          opacity: .8;

          filter:
            drop-shadow(
              0 0 5px
              rgba(249,115,22,.9)
            );

          animation:
            royalFlame 1.2s
            ease-in-out infinite;
        }

        @keyframes royalFlame {

          0%,
          100% {
            transform:
              translate(-50%, -20%)
              scale(.9);
          }

          50% {
            transform:
              translate(-50%, -20%)
              scale(1.15);
          }

        }

        /* =========================================
           AURA
        ========================================= */

        .royal-cursor-aura {

          position: fixed;

          left: 0;
          top: 0;

          width: 150px;
          height: 150px;

          z-index: 99997;

          pointer-events: none;

          transform:
            translate(-50%, -50%);

          border-radius: 50%;

          background:

            radial-gradient(
              circle,
              rgba(249,115,22,.13),
              rgba(249,115,22,.055) 30%,
              transparent 70%
            );

          filter:
            blur(10px);

          opacity: .8;

          transition:

            width 350ms ease,
            height 350ms ease,
            opacity 350ms ease;
        }

        /* =========================================
           BUTTON HOVER
        ========================================= */

        .royal-cursor-action {

          width: 76px !important;
          height: 76px !important;

          filter:

            drop-shadow(
              0 0 12px
              rgba(251,191,36,.95)
            )

            drop-shadow(
              0 0 30px
              rgba(249,115,22,.5)
            );
        }

        .royal-aura-action {

          width: 210px !important;
          height: 210px !important;

          opacity: 1 !important;
        }

        /* =========================================
           CARD HOVER
        ========================================= */

        .royal-cursor-card {

          width: 82px !important;
          height: 82px !important;

          filter:

            drop-shadow(
              0 0 14px
              rgba(249,115,22,.9)
            )

            drop-shadow(
              0 0 35px
              rgba(251,191,36,.35)
            );
        }

        .royal-aura-card {

          width: 240px !important;
          height: 240px !important;

          opacity: 1 !important;
        }

        /* =========================================
           INPUT
        ========================================= */

        .royal-cursor-input {

          width: 44px !important;
          height: 44px !important;
        }

        /* =========================================
           CLICK BURST
        ========================================= */

        .royal-cursor-burst {

          position: fixed;

          width: 15px;
          height: 15px;

          z-index: 99996;

          pointer-events: none;

          transform:
            translate(-50%, -50%);

          border-radius: 50%;

          border:
            1px solid
            rgba(251,191,36,.95);

          box-shadow:

            0 0 10px
              rgba(249,115,22,.8),

            0 0 25px
              rgba(251,191,36,.4);

          animation:
            royalBurst
            700ms
            cubic-bezier(.22,1,.36,1)
            forwards;
        }

        @keyframes royalBurst {

          0% {

            width: 15px;
            height: 15px;

            opacity: 1;
          }

          100% {

            width: 100px;
            height: 100px;

            opacity: 0;
          }

        }

        /* =========================================
           CLICK EMBERS
        ========================================= */

        .royal-cursor-ember {

          position: fixed;

          width: 5px;
          height: 5px;

          z-index: 99995;

          pointer-events: none;

          border-radius: 50%;

          background:
            #fb923c;

          box-shadow:

            0 0 8px
              #f97316,

            0 0 14px
              #f59e0b;

          transform:
            translate(-50%, -50%);

          animation:
            royalEmber
            800ms
            ease-out
            forwards;
        }

        @keyframes royalEmber {

          0% {

            opacity: 1;

            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translateX(0)
              scale(1);
          }

          100% {

            opacity: 0;

            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translateX(45px)
              scale(.2);
          }

        }

        /* =========================================
           TOUCH DEVICES
        ========================================= */

        @media (pointer: coarse) {

          .royal-cursor,
          .royal-cursor-aura {

            display: none;
          }

        }

      `}</style>
    </>
  );
}

export default PremiumCursor;