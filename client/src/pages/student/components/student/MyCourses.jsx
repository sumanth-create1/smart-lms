import {
  BookOpen,
  Clock3,
  ArrowRight,
  Play,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function MyCourses({ courses = [] }) {
  const navigate = useNavigate();

  // =====================================================
  // VIEW ALL COURSES
  // =====================================================

  const handleViewAll = () => {
    navigate("/courses");
  };

  // =====================================================
  // OPEN COURSE
  // =====================================================

  const handleOpenCourse = (course) => {
    if (!course?._id) {
      toast.error("Course information is unavailable.");
      return;
    }

    navigate(`/courses/${course._id}/learn`);
  };

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (courses.length === 0) {
    return (
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              My Courses
            </h2>

            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
              Courses you're currently learning
            </p>
          </div>

          <button
            type="button"
            onClick={handleViewAll}
            className="
              inline-flex
              items-center
              gap-1
              text-xs
              font-semibold
              text-indigo-600
              transition
              hover:text-indigo-700
              sm:text-sm
            "
          >
            View all
            <ArrowRight size={15} />
          </button>
        </div>

        {/* EMPTY STATE */}

        <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <BookOpen
              size={25}
              className="text-indigo-600"
            />
          </div>

          <h3 className="mt-4 text-base font-bold text-slate-900">
            No courses yet
          </h3>

          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-400">
            Enroll in a course to start building your
            learning journey.
          </p>

          <button
            type="button"
            onClick={handleViewAll}
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-indigo-700
            "
          >
            Browse Courses
            <ArrowRight size={15} />
          </button>
        </div>
      </section>
    );
  }

  // =====================================================
  // COURSES
  // =====================================================

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            My Courses
          </h2>

          <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
            Courses you're currently learning
          </p>
        </div>

        <button
          type="button"
          onClick={handleViewAll}
          className="
            inline-flex
            items-center
            gap-1
            text-xs
            font-semibold
            text-indigo-600
            transition
            hover:text-indigo-700
            sm:text-sm
          "
        >
          View all
          <ArrowRight size={15} />
        </button>
      </div>

      {/* =================================================
          COURSE GRID
      ================================================= */}

      <div className="grid grid-cols-1 divide-y divide-slate-100 xl:grid-cols-3 xl:divide-x xl:divide-y-0">
        {courses.map((course) => {
          const title =
            course.courseTitle ||
            course.title ||
            "Untitled Course";

          const instructor =
            course.instructor?.name ||
            "Smart LMS Instructor";

          const category =
            course.category ||
            "Course";

          const level =
            course.courseLevel ||
            "Beginner";

          const progress = Math.min(
            Math.max(
              Number(course.progress ?? 0),
              0
            ),
            100
          );

          const completedLessons = Math.max(
            Number(course.completedLessons ?? 0),
            0
          );

          const totalLessons = Math.max(
            Number(course.totalLessons ?? 0),
            0
          );

          const thumbnail =
            course.courseThumbnail?.url ||
            course.thumbnail ||
            "";

          const isCompleted =
            progress >= 100;

          return (
            <div
              key={course._id}
              className="
                group
                p-5
                transition
                hover:bg-slate-50/70
                sm:p-6
              "
            >
              {/* =================================================
                  COURSE VISUAL
              ================================================= */}

              <div
                className="
                  relative
                  h-32
                  overflow-hidden
                  rounded-2xl
                  bg-gradient-to-br
                  from-indigo-600
                  to-violet-500
                "
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={title}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition
                      duration-300
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <>
                    <div
                      className="
                        absolute
                        -right-8
                        -top-8
                        h-28
                        w-28
                        rounded-full
                        bg-white/10
                      "
                    />

                    <div
                      className="
                        absolute
                        -bottom-10
                        -left-8
                        h-28
                        w-28
                        rounded-full
                        bg-white/10
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <div
                        className="
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          shadow-md
                        "
                      >
                        <BookOpen
                          size={21}
                          className="text-indigo-600"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* DARK OVERLAY */}

                <div className="absolute inset-0 bg-black/5" />

                {/* LEVEL */}

                <span
                  className="
                    absolute
                    left-3
                    top-3
                    rounded-lg
                    bg-black/30
                    px-2
                    py-1
                    text-[10px]
                    font-semibold
                    text-white
                    backdrop-blur-sm
                  "
                >
                  {level}
                </span>

                {/* COMPLETED BADGE */}

                {isCompleted && (
                  <span
                    className="
                      absolute
                      right-3
                      top-3
                      inline-flex
                      items-center
                      gap-1
                      rounded-lg
                      bg-green-500/90
                      px-2
                      py-1
                      text-[10px]
                      font-semibold
                      text-white
                      backdrop-blur-sm
                    "
                  >
                    <CheckCircle2 size={12} />

                    Completed
                  </span>
                )}
              </div>

              {/* =================================================
                  CATEGORY
              ================================================= */}

              <p
                className="
                  mt-5
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-indigo-600
                "
              >
                {category}
              </p>

              {/* =================================================
                  TITLE
              ================================================= */}

              <h3
                className="
                  mt-1
                  line-clamp-1
                  text-base
                  font-bold
                  text-slate-900
                "
                title={title}
              >
                {title}
              </h3>

              {/* =================================================
                  SUBTITLE
              ================================================= */}

              {course.subTitle && (
                <p
                  className="
                    mt-1
                    line-clamp-1
                    text-xs
                    text-slate-400
                  "
                >
                  {course.subTitle}
                </p>
              )}

              {/* =================================================
                  INSTRUCTOR
              ================================================= */}

              <p className="mt-1 text-xs text-slate-400">
                By {instructor}
              </p>

              {/* =================================================
                  PROGRESS
              ================================================= */}

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Progress
                  </span>

                  <span className="text-xs font-bold text-indigo-600">
                    {progress}%
                  </span>
                </div>

                <div
                  className="
                    h-2
                    overflow-hidden
                    rounded-full
                    bg-slate-100
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-indigo-600
                      transition-all
                      duration-500
                    "
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* =================================================
                  META
              ================================================= */}

              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-between
                  text-[11px]
                  text-slate-400
                "
              >
                <span>
                  {completedLessons}/{totalLessons}{" "}
                  lessons
                </span>

                <span className="inline-flex items-center gap-1">
                  <Clock3 size={12} />

                  {isCompleted
                    ? "Completed"
                    : progress > 0
                    ? "In progress"
                    : "Not started"}
                </span>
              </div>

              {/* =================================================
                  BUTTON
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  handleOpenCourse(course)
                }
                className="
                  mt-5
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-xs
                  font-semibold
                  text-slate-700
                  transition
                  hover:border-indigo-200
                  hover:bg-indigo-50
                  hover:text-indigo-600
                  active:scale-[0.99]
                "
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={14} />

                    Review Course
                  </>
                ) : (
                  <>
                    <Play
                      size={14}
                      fill="currentColor"
                    />

                    {progress > 0
                      ? "Continue Learning"
                      : "Start Learning"}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default MyCourses;