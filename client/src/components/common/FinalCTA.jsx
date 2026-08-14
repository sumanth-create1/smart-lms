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
      className="border-t border-black/[0.06]"
      style={{
        backgroundColor: C.bg,
      }}
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">

        <div
          className="
            relative
            overflow-hidden
            rounded-[32px]
            px-7
            py-14
            sm:px-10
            sm:py-16
            lg:px-16
            lg:py-20
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
              -right-20
              -top-28
              h-72
              w-72
              rounded-full
              opacity-20
            "
            style={{
              backgroundColor: C.indigo,
              filter: "blur(2px)",
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
              -left-16
              h-64
              w-64
              rounded-full
              opacity-15
            "
            style={{
              backgroundColor: C.coral,
            }}
          />

          {/* Small decorative dots */}

          <div
            className="absolute right-16 top-12 hidden h-2 w-2 rounded-full sm:block"
            style={{
              backgroundColor: C.amber,
            }}
          />

          <div
            className="absolute right-28 top-20 hidden h-1.5 w-1.5 rounded-full sm:block"
            style={{
              backgroundColor: C.teal,
            }}
          />

          <div
            className="absolute bottom-12 right-20 hidden h-2 w-2 rounded-full sm:block"
            style={{
              backgroundColor: C.coral,
            }}
          />


          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="relative max-w-3xl">

            <div className="flex items-center gap-3">

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

            </div>


            <h2
              className="
                mt-7
                max-w-3xl
                break-words
                text-3xl
                font-bold
                leading-[1.08]
                tracking-[-0.045em]
                text-white
                sm:text-4xl
                lg:text-[52px]
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


            <p
              className="
                mt-6
                max-w-2xl
                text-sm
                leading-7
                text-white/60
                sm:text-base
              "
            >
              Choose a course, learn at your own pace and let Smart LMS
              keep track of your progress along the way.
            </p>


            {/* Buttons */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/courses"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  transition-all
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
                  items-center
                  justify-center
                  rounded-xl
                  border
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  transition-all
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
              mt-14
              flex
              flex-col
              gap-4
              border-t
              pt-6
              sm:flex-row
              sm:items-center
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

