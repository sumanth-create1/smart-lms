import { Link } from "react-router-dom";

const C = {
  bg: "#FBFAF7",
  ink: "#15121F",
  muted: "#655D72",
  indigo: "#4F46E5",
  amber: "#F2A93B",
  teal: "#0EA5A4",
  coral: "#FF5A36",
};

function FinalCTA() {
  return (
    <section
      className="w-full border-t border-black/[0.06]"
      style={{
        backgroundColor: C.bg,
      }}
    >
      {/* =====================================================
          FULL WIDTH OUTER CONTAINER
      ====================================================== */}

      <div
        className="
          mx-auto
          flex
          w-full
          items-center
          justify-center
          px-5
          py-16
          sm:px-8
          sm:py-20
          lg:px-10
          lg:py-24
          xl:px-14
        "
      >
        {/* =====================================================
            WIDE CTA BOX
        ====================================================== */}

        <div
          className="
            relative
            w-full
            max-w-[1280px]
            overflow-hidden
            rounded-[32px]
            px-6
            py-12
            sm:px-10
            sm:py-14
            lg:px-16
            lg:py-16
            xl:px-20
            xl:py-18
          "
          style={{
            backgroundColor: C.ink,
          }}
        >
          {/* =================================================
              BACKGROUND DECORATION
          ================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              -right-28
              -top-32
              h-80
              w-80
              rounded-full
              opacity-20
            "
            style={{
              backgroundColor: C.indigo,
              filter: "blur(3px)",
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              -left-28
              h-72
              w-72
              rounded-full
              opacity-15
            "
            style={{
              backgroundColor: C.coral,
            }}
          />

          {/* Decorative dots */}

          <span
            className="
              absolute
              right-16
              top-14
              hidden
              h-2
              w-2
              rounded-full
              sm:block
            "
            style={{
              backgroundColor: C.amber,
            }}
          />

          <span
            className="
              absolute
              right-28
              top-24
              hidden
              h-1.5
              w-1.5
              rounded-full
              sm:block
            "
            style={{
              backgroundColor: C.teal,
            }}
          />

          <span
            className="
              absolute
              bottom-16
              right-20
              hidden
              h-2
              w-2
              rounded-full
              sm:block
            "
            style={{
              backgroundColor: C.coral,
            }}
          />

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <div
            className="
              relative
              mx-auto
              flex
              max-w-[760px]
              flex-col
              items-center
              text-center
            "
          >
            {/* Label */}

            <div className="flex items-center justify-center gap-3">
              <span
                className="h-[2px] w-9 rounded-full"
                style={{
                  backgroundColor: C.amber,
                }}
              />

              <span
                className="
                  font-mono
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                "
                style={{
                  color: C.amber,
                }}
              >
                Start learning
              </span>

              <span
                className="h-[2px] w-9 rounded-full"
                style={{
                  backgroundColor: C.amber,
                }}
              />
            </div>

            {/* Heading */}

            <h2
              className="
                mt-6
                max-w-[760px]
                text-center
                text-3xl
                font-bold
                leading-[1.05]
                tracking-[-0.045em]
                text-white
                sm:text-4xl
                lg:text-[52px]
                xl:text-[56px]
              "
            >
              Your next skill starts
              <span
                className="block"
                style={{
                  color: "#A5B4FC",
                }}
              >
                with one course.
              </span>
            </h2>

            {/* Description */}

            <p
              className="
                mx-auto
                mt-6
                max-w-[620px]
                text-center
                text-sm
                leading-7
                text-white/60
                sm:text-base
              "
            >
              Choose a course, learn at your own pace and let Smart LMS keep
              track of your progress along the way.
            </p>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div
              className="
                mt-9
                flex
                flex-col
                items-center
                justify-center
                gap-3
                sm:flex-row
              "
            >
              <Link
                to="/courses"
                className="
                  inline-flex
                  min-w-[180px]
                  items-center
                  justify-center
                  rounded-xl
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                "
                style={{
                  backgroundColor: "#FFFFFF",
                  color: C.ink,
                }}
              >
                Explore courses
                <span className="ml-2">→</span>
              </Link>

              <Link
                to="/register"
                className="
                  inline-flex
                  min-w-[180px]
                  items-center
                  justify-center
                  rounded-xl
                  border
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-white/10
                "
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                }}
              >
                Create free account
              </Link>
            </div>
          </div>

          {/* =================================================
              BOTTOM STATUS
          ================================================= */}

          <div
            className="
              relative
              mx-auto
              mt-12
              flex
              max-w-[1000px]
              flex-col
              items-center
              justify-center
              gap-3
              border-t
              pt-6
              sm:flex-row
              sm:justify-between
            "
            style={{
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: C.teal,
                }}
              />

              <span className="text-xs text-white/50">
                Learn • Practice • Progress
              </span>
            </div>

            <span className="font-mono text-[10px] text-white/30">
              SMART LMS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;