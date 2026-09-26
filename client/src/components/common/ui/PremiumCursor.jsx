import { useEffect, useRef } from "react";

function PremiumCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) return;

    const move = (e) => {
      cursor.style.transform =
        `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener("mousemove", move, {
      passive: true,
    });

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="premium-cursor"
      />

      <style>{`

        @media (pointer: fine) {
          html,
          body,
          button,
          a,
          input,
          textarea,
          select {
            cursor: none !important;
          }
        }

        .premium-cursor {
          position: fixed;

          left: 0;
          top: 0;

          width: 20px;
          height: 20px;

          border: 1px solid #fbbf24;

          border-radius: 50%;

          pointer-events: none;

          z-index: 99999;

          transform:
            translate3d(50vw, 50vh, 0)
            translate(-50%, -50%);

          box-shadow:
            0 0 8px
            rgba(249, 115, 22, 0.5);

          will-change: transform;
        }

        .premium-cursor::after {
          content: "";

          position: absolute;

          left: 50%;
          top: 50%;

          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: #fbbf24;

          transform:
            translate(-50%, -50%);
        }

        @media (pointer: coarse) {
          .premium-cursor {
            display: none;
          }
        }

      `}</style>
    </>
  );
}

export default PremiumCursor;