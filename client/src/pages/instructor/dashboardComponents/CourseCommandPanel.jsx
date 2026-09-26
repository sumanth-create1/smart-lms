import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Coins,
  Edit3,
  Eye,
  GraduationCap,
  MoreHorizontal,
  Plus,
  ScrollText,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const actionButton =
  "flex h-10 w-10 items-center justify-center rounded-xl border border-stone-800 text-stone-600 transition-all duration-200 hover:border-orange-500/30 hover:bg-orange-500/[0.06] hover:text-orange-300";

function CourseCommandPanel({ courses = [], onDeleteCourse }) {
  return (
    <section className="mt-6 overflow-hidden rounded-[24px] border border-stone-800/80 bg-[#0b0806] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <PanelHeader />

      {courses.length === 0 ? (
        <EmptyCourseState />
      ) : (
        <div className="divide-y divide-stone-800/60">
          {courses.map((course) => (
            <CourseCommandRow
              key={course._id}
              course={course}
              onDeleteCourse={onDeleteCourse}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PanelHeader() {
  return (
    <div className="border-b border-stone-800/70 px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-orange-400" />

            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-orange-400">
              Command Table
            </p>
          </div>

          <h2 className="mt-2 font-serif text-2xl font-semibold text-stone-100">
            Your Courses
          </h2>

          <p className="mt-1 text-xs text-stone-600">
            Manage the courses under your command.
          </p>
        </div>

        <Link
          to="/instructor/create-course"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-500/25 bg-orange-500/[0.07] px-4 py-2.5 text-xs font-bold text-orange-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/50 hover:bg-orange-500/[0.12]"
        >
          <Plus size={15} />
          Forge Course
        </Link>
      </div>
    </div>
  );
}

function CourseCommandRow({ course, onDeleteCourse }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuOpen]);

  const {
    thumbnail,
    title,
    subtitle,
    instructor,
    price,
    students,
    lessons,
    level,
    category,
  } = getCourseData(course);

  const coursePath = `/instructor/courses/${course._id}`;

  const handleDelete = () => {
    setMenuOpen(false);

    if (!onDeleteCourse) return;

    const confirmed = window.confirm(
      `Delete "${title}"? This action cannot be undone.`
    );

    if (confirmed) {
      onDeleteCourse(course._id);
    }
  };

  return (
    <div className="group relative px-5 py-5 transition-all duration-300 hover:bg-orange-500/[0.025] sm:px-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
        <CourseThumbnail
          src={thumbnail}
          title={title}
          category={category}
        />

        <CourseInfo
          title={title}
          subtitle={subtitle}
          instructor={instructor}
          level={level}
        />

        <CourseMetrics
          students={students}
          lessons={lessons}
          price={price}
        />

        <div className="flex items-center gap-2 xl:w-auto">
          <Link
            to={`/courses/${course._id}`}
            title="View course"
            aria-label="View course"
            className={actionButton}
          >
            <Eye size={15} />
          </Link>

          <Link
            to={coursePath}
            title="Edit course"
            aria-label="Edit course"
            className={actionButton}
          >
            <Edit3 size={15} />
          </Link>

          <Link
            to={coursePath}
            className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-orange-500/20 bg-orange-500/[0.05] px-3 text-[10px] font-bold uppercase tracking-wider text-orange-300 transition-all hover:border-orange-400/40 hover:bg-orange-500/[0.1]"
          >
            Manage
            <ChevronRight size={13} />
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              title="More actions"
              aria-label="More actions"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              className={actionButton}
            >
              <MoreHorizontal size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 z-30 w-44 overflow-hidden rounded-xl border border-stone-800 bg-[#110c08] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <Link
                  to={coursePath}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-stone-400 transition hover:bg-orange-500/[0.08] hover:text-orange-300"
                >
                  <Edit3 size={14} />
                  Manage Course
                </Link>

                <Link
                  to={`/courses/${course._id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-stone-400 transition hover:bg-orange-500/[0.08] hover:text-orange-300"
                >
                  <Eye size={14} />
                  View Course
                </Link>

                {onDeleteCourse && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-red-400 transition hover:bg-red-500/[0.08]"
                  >
                    <Trash2 size={14} />
                    Delete Course
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-all duration-500 group-hover:w-3/4" />
    </div>
  );
}

function CourseThumbnail({ src, title, category }) {
  return (
    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl border border-stone-800 bg-stone-950 sm:h-32 sm:w-52">
      {src ? (
        <img
          src={src}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-950 via-stone-950 to-black">
          <BookOpen size={32} className="text-orange-500/40" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      <div className="absolute bottom-2 left-2 rounded-md border border-white/10 bg-black/50 px-2 py-1 backdrop-blur-md">
        <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-orange-300">
          {category}
        </span>
      </div>
    </div>
  );
}

function CourseInfo({ title, subtitle, instructor, level }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/40 bg-emerald-950/20 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-emerald-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Active
        </span>

        <span className="rounded-full border border-stone-800 bg-white/[0.02] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-stone-500">
          {level}
        </span>
      </div>

      <h3 className="mt-3 truncate font-serif text-xl font-semibold text-stone-100 transition-colors group-hover:text-orange-200">
        {title}
      </h3>

      <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-5 text-stone-600">
        {subtitle}
      </p>

      <p className="mt-3 text-[9px] uppercase tracking-[0.15em] text-stone-700">
        Commander: <span className="text-stone-500">{instructor}</span>
      </p>
    </div>
  );
}

function CourseMetrics({ students, lessons, price }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[390px]">
      <Metric icon={GraduationCap} label="Students" value={students} />

      <Metric icon={ScrollText} label="Lessons" value={lessons} />

      <Metric
        icon={Coins}
        label="Price"
        value={
          price === 0
            ? "Free"
            : `₹${price.toLocaleString("en-IN")}`
        }
      />

      <Metric icon={Users} label="Reach" value={students} />
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-stone-800/70 bg-white/[0.015] px-3 py-3 transition duration-300 group-hover:border-stone-700">
      <div className="flex items-center gap-1.5">
        <Icon size={11} className="text-orange-500/60" />

        <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-stone-700">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-semibold text-stone-300">
        {value}
      </p>
    </div>
  );
}

function EmptyCourseState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/15 bg-orange-500/[0.05]">
        <BookOpen size={27} className="text-orange-500/50" />
      </div>

      <h3 className="mt-5 font-serif text-xl font-semibold text-stone-200">
        Your kingdom awaits
      </h3>

      <p className="mt-2 max-w-sm text-xs leading-6 text-stone-600">
        You have not forged any courses yet. Create your first course and
        begin building your learning realm.
      </p>

      <Link
        to="/instructor/create-course"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-xs font-bold text-black shadow-[0_10px_30px_rgba(249,115,22,0.15)] transition-all hover:-translate-y-0.5 hover:bg-orange-400"
      >
        <Plus size={15} />
        Forge Your First Course
      </Link>
    </div>
  );
}

function getCourseData(course) {
  const price = Number(course.coursePrice ?? 0);

  return {
    thumbnail:
      course.courseThumbnail?.url ||
      course.courseThumbnail ||
      "",

    title: course.courseTitle || "Untitled Course",

    subtitle:
      course.subTitle ||
      course.description ||
      "No course description available.",

    instructor:
      course.instructor?.name ||
      "Instructor",

    price: Number.isFinite(price) && price >= 0 ? price : 0,

    students: Number(
      course.studentCount ??
        course.studentsCount ??
        course.totalStudents ??
        course.enrollmentCount ??
        course.enrollments ??
        0
    ),

    lessons: Number(
      course.lectureCount ??
        course.totalLessons ??
        0
    ),

    level: course.courseLevel || "Beginner",

    category: course.category || "General",
  };
}

export default CourseCommandPanel;