import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Play,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function MyCourses({ courses = [] }) {
  const navigate = useNavigate();

  return (
    <section
      className="
        mt-8
        w-full
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        sm:p-6
        lg:p-7
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-indigo-50
                text-indigo-600
              "
            >
              <BookOpen size={21} />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                My Courses
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Courses you are currently enrolled in
              </p>
            </div>
          </div>
        </div>

        {/* Course count */}

        <div
          className="
            flex
            w-fit
            items-center
            rounded-full
            border
            border-indigo-100
            bg-indigo-50
            px-4
            py-2
            text-xs
            font-bold
            text-indigo-600
          "
        >
          {courses.length}{" "}
          {courses.length === 1 ? "Course" : "Courses"}
        </div>
      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {courses.length === 0 ? (
        <div
          className="
            mt-7
            rounded-2xl
            border
            border-dashed
            border-slate-200
            bg-slate-50/60
            px-6
            py-12
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-white
              shadow-sm
            "
          >
            <BookOpen
              size={30}
              className="text-slate-300"
            />
          </div>

          <h3 className="mt-5 text-base font-bold text-slate-700">
            No courses yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
            You haven't enrolled in any courses yet.
            Start learning by exploring our available courses.
          </p>

          <button
            onClick={() => navigate("/courses")}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-5
              py-3
              text-sm
              font-bold
              text-white
              shadow-sm
              transition
              hover:bg-indigo-700
              hover:shadow-md
              active:scale-[0.98]
            "
          >
            Browse Courses
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        /* =====================================================
           COURSE LIST
        ===================================================== */

        <div className="mt-7 space-y-5">
          {courses.map((course) => {
            const progress = Math.min(
              Math.max(course.progress ?? 0, 0),
              100
            );

            const completed = progress === 100;

            return (
              <article
                key={course._id}
                className="
                  group
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50/30
                  p-4
                  transition-all
                  duration-200
                  hover:border-indigo-100
                  hover:bg-white
                  hover:shadow-md
                  sm:p-5
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    gap-5
                    lg:flex-row
                    lg:gap-6
                  "
                >
                  {/* =================================================
                      THUMBNAIL
                  ================================================= */}

                  <div
                    className="
                      h-44
                      w-full
                      shrink-0
                      overflow-hidden
                      rounded-2xl
                      bg-slate-100
                      lg:h-32
                      lg:w-44
                    "
                  >
                    {course.courseThumbnail ? (
                      <img
                        src={course.courseThumbnail}
                        alt={course.courseTitle}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-300
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <BookOpen
                          size={34}
                          className="text-slate-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* =================================================
                      COURSE INFORMATION
                  ================================================= */}

                  <div className="min-w-0 flex-1 px-1 sm:px-0">
                    {/* Title + Status */}

                    <div
                      className="
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                      "
                    >
                      <div className="min-w-0">
                        <p
                          className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-indigo-600
                          "
                        >
                          {course.category || "Online Course"}
                        </p>

                        <h3
                          className="
                            mt-2
                            break-words
                            text-base
                            font-bold
                            leading-6
                            text-slate-900
                            sm:text-lg
                          "
                        >
                          {course.courseTitle}
                        </h3>
                      </div>

                      {/* STATUS */}

                      {completed ? (
                        <span
                          className="
                            flex
                            w-fit
                            shrink-0
                            items-center
                            gap-1.5
                            rounded-full
                            bg-emerald-50
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            text-emerald-600
                          "
                        >
                          <CheckCircle2 size={14} />
                          Completed
                        </span>
                      ) : (
                        <span
                          className="
                            w-fit
                            shrink-0
                            rounded-full
                            bg-indigo-50
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            text-indigo-600
                          "
                        >
                          {progress}% Complete
                        </span>
                      )}
                    </div>

                    {/* =================================================
                        META
                    ================================================= */}

                    <div
                      className="
                        mt-4
                        flex
                        flex-wrap
                        items-center
                        gap-x-5
                        gap-y-2
                        text-xs
                        text-slate-400
                      "
                    >
                      {course.courseLevel && (
                        <span>
                          Level:{" "}
                          <strong className="font-semibold text-slate-500">
                            {course.courseLevel}
                          </strong>
                        </span>
                      )}

                      <span>
                        {course.completedLessons ?? 0} /{" "}
                        {course.totalLessons ?? 0} lessons
                      </span>
                    </div>

                    {/* =================================================
                        PROGRESS
                    ================================================= */}

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-slate-400">
                          Course Progress
                        </span>

                        <span className="text-[11px] font-bold text-slate-500">
                          {progress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`
                            h-full
                            rounded-full
                            transition-all
                            duration-500
                            ${
                              completed
                                ? "bg-emerald-500"
                                : "bg-indigo-600"
                            }
                          `}
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div
                      className="
                        mt-5
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >
                      {/* Current lesson */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2
                          text-xs
                          text-slate-400
                        "
                      >
                        <Clock3
                          size={14}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {completed
                            ? "Course completed"
                            : course.currentLesson?.lectureTitle ||
                              "Ready to start"}
                        </span>
                      </div>

                      {/* Button */}

                      <button
                        onClick={() =>
                          navigate(
                            `/course/${course._id}/learn`
                          )
                        }
                        className={`
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          px-5
                          py-2.5
                          text-xs
                          font-bold
                          transition
                          sm:w-auto
                          ${
                            completed
                              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              : "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md"
                          }
                        `}
                      >
                        <Play
                          size={14}
                          fill="currentColor"
                        />

                        {completed
                          ? "Review Course"
                          : "Continue"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MyCourses;