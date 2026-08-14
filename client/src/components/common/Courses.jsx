import { Link } from "react-router-dom";

const COURSES = [
  {
    id: 1,
    title: "MERN Stack Development",
    description:
      "Learn MongoDB, Express, React and Node.js by building real-world applications.",
    category: "Web Development",
    level: "Intermediate",
    lessons: 42,
    duration: "18h 30m",
    price: "₹1,499",
    color: "#4F46E5",
  },
  {
    id: 2,
    title: "Java Programming",
    description:
      "Build a strong foundation in Java, OOP, collections and problem solving.",
    category: "Programming",
    level: "Beginner",
    lessons: 36,
    duration: "14h 20m",
    price: "₹999",
    color: "#F2A93B",
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    description:
      "Master important DSA patterns and improve your coding problem-solving skills.",
    category: "Computer Science",
    level: "Intermediate",
    lessons: 58,
    duration: "24h 10m",
    price: "₹1,299",
    color: "#0EA5A4",
  },
  {
    id: 4,
    title: "React.js Fundamentals",
    description:
      "Learn React components, hooks, routing, state management and modern frontend development.",
    category: "Frontend",
    level: "Beginner",
    lessons: 31,
    duration: "11h 45m",
    price: "₹899",
    color: "#FF5A36",
  },
  {
    id: 5,
    title: "Node.js & Express",
    description:
      "Create scalable backend APIs using Node.js, Express, MongoDB and authentication.",
    category: "Backend",
    level: "Intermediate",
    lessons: 38,
    duration: "15h 40m",
    price: "₹1,199",
    color: "#7C3AED",
  },
  {
    id: 6,
    title: "SQL & Database Design",
    description:
      "Understand relational databases, SQL queries, joins, normalization and database design.",
    category: "Database",
    level: "Beginner",
    lessons: 28,
    duration: "10h 20m",
    price: "₹799",
    color: "#2563EB",
  },
];

function Courses() {
  return (
    <div className="min-h-screen bg-[#FBFAF7]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="border-b border-black/[0.06]">

        <div className="mx-auto w-full max-w-[1180px] px-6 py-16 sm:px-8 sm:py-20 lg:px-10">

          <div className="max-w-3xl">

            <div className="flex items-center gap-3">

              <span className="h-[2px] w-9 rounded-full bg-[#4F46E5]" />

              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4F46E5]">
                Explore
              </span>

            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-[-0.04em] text-[#15121F] sm:text-5xl lg:text-[56px]">
              Find your next
              <span className="block text-[#655D72]">
                learning path.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#655D72]">
              Explore courses designed to help you build practical skills,
              understand important concepts and keep progressing.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          COURSES
      ===================================================== */}

      <section>

        <div className="mx-auto w-full max-w-[1180px] px-6 py-16 sm:px-8 lg:px-10 lg:py-20">

          {/* Top controls */}

          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-semibold text-[#15121F]">
                Available courses
              </p>

              <p className="mt-1 text-xs text-[#655D72]">
                {COURSES.length} courses available
              </p>
            </div>

            <select
              className="
                w-full
                rounded-xl
                border
                border-black/[0.10]
                bg-white
                px-4
                py-3
                text-sm
                text-[#15121F]
                outline-none
                sm:w-52
              "
            >
              <option>All categories</option>
              <option>Web Development</option>
              <option>Programming</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Database</option>
            </select>

          </div>


          {/* Course grid */}

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

            {COURSES.map((course) => (

              <article
                key={course.id}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border
                  border-black/[0.08]
                  bg-white
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_20px_50px_rgba(21,18,31,0.09)]
                "
              >

                {/* Course visual */}

                <div
                  className="relative h-44 overflow-hidden"
                  style={{
                    backgroundColor: `${course.color}12`,
                  }}
                >

                  <div
                    className="
                      absolute
                      -right-10
                      -top-10
                      h-32
                      w-32
                      rounded-full
                    "
                    style={{
                      backgroundColor: `${course.color}18`,
                    }}
                  />

                  <div
                    className="
                      absolute
                      bottom-5
                      left-6
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      text-lg
                      font-bold
                    "
                    style={{
                      backgroundColor: course.color,
                      color: "white",
                    }}
                  >
                    {course.title.charAt(0)}
                  </div>

                  <span
                    className="
                      absolute
                      right-5
                      top-5
                      rounded-full
                      px-3
                      py-1.5
                      text-[10px]
                      font-semibold
                    "
                    style={{
                      backgroundColor: "white",
                      color: course.color,
                    }}
                  >
                    {course.level}
                  </span>

                </div>


                {/* Content */}

                <div className="p-6">

                  <p
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
                    style={{
                      color: course.color,
                    }}
                  >
                    {course.category}
                  </p>

                  <h2 className="mt-3 min-h-[56px] text-xl font-bold leading-7 tracking-[-0.025em] text-[#15121F]">
                    {course.title}
                  </h2>

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#655D72]">
                    {course.description}
                  </p>


                  {/* Meta */}

                  <div className="mt-5 flex items-center gap-4 border-t border-black/[0.06] pt-5">

                    <span className="text-xs text-[#655D72]">
                      {course.lessons} lessons
                    </span>

                    <span className="h-1 w-1 rounded-full bg-black/20" />

                    <span className="text-xs text-[#655D72]">
                      {course.duration}
                    </span>

                  </div>


                  {/* Bottom */}

                  <div className="mt-6 flex items-center justify-between">

                    <span className="text-lg font-bold text-[#15121F]">
                      {course.price}
                    </span>

                    <Link
                      to={`/courses/${course.id}`}
                      className="
                        rounded-xl
                        px-4
                        py-2.5
                        text-xs
                        font-semibold
                        text-white
                        transition-all
                        hover:-translate-y-0.5
                      "
                      style={{
                        backgroundColor: course.color,
                      }}
                    >
                      View course →
                    </Link>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>

    </div>
  );
}

export default Courses;

