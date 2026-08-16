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
    <main className="min-h-screen bg-[#FBFAF7]">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="border-b border-black/[0.06]">
        <div className="mx-auto w-full max-w-[1180px] px-6 py-16 sm:px-8 sm:py-20 lg:px-10">

          <div className="max-w-[720px]">

            {/* Label */}

            <div className="flex items-center gap-3">
              <span className="h-[2px] w-10 rounded-full bg-[#4F46E5]" />

              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4F46E5]">
                Explore
              </span>
            </div>

            {/* Heading */}

            <h1 className="mt-6 text-[42px] font-bold leading-[1.05] tracking-[-0.045em] text-[#15121F] sm:text-[52px] lg:text-[58px]">
              Find your next
              <span className="block text-[#655D72]">
                learning path.
              </span>
            </h1>

            {/* Description */}

            <p className="mt-6 max-w-[650px] text-[15px] leading-7 text-[#655D72] sm:text-base">
              Explore courses designed to help you build practical skills,
              understand important concepts and keep progressing.
            </p>

          </div>
        </div>
      </section>


      {/* =====================================================
          COURSE SECTION
      ===================================================== */}

      <section>
        <div className="mx-auto w-full max-w-[1180px] px-6 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">

          {/* =================================================
              TOP CONTROLS
          ================================================= */}

          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-[15px] font-bold tracking-[-0.01em] text-[#15121F]">
                Available courses
              </p>

              <p className="mt-1 text-xs text-[#655D72]">
                {COURSES.length} courses available
              </p>
            </div>

            <select
              className="
                h-11
                w-full
                cursor-pointer
                appearance-none
                rounded-xl
                border
                border-black/[0.09]
                bg-white
                px-4
                text-sm
                font-medium
                text-[#15121F]
                shadow-sm
                outline-none
                transition
                hover:border-black/[0.16]
                focus:border-[#4F46E5]
                sm:w-[210px]
              "
              defaultValue="All categories"
            >
              <option>All categories</option>
              <option>Web Development</option>
              <option>Programming</option>
              <option>Computer Science</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Database</option>
            </select>

          </div>


          {/* =================================================
              COURSE GRID
          ================================================= */}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {COURSES.map((course) => (

              <article
                key={course.id}
                className="
                  group
                  flex
                  min-h-[510px]
                  flex-col
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-black/[0.07]
                  bg-white
                  shadow-[0_4px_20px_rgba(21,18,31,0.035)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_18px_45px_rgba(21,18,31,0.09)]
                "
              >

                {/* =================================================
                    COURSE VISUAL
                ================================================= */}

                <div
                  className="
                    relative
                    h-[170px]
                    shrink-0
                    overflow-hidden
                  "
                  style={{
                    backgroundColor: `${course.color}0D`,
                  }}
                >

                  {/* Large decorative circle */}

                  <div
                    className="
                      absolute
                      -right-12
                      -top-12
                      h-40
                      w-40
                      rounded-full
                      transition-transform
                      duration-500
                      group-hover:scale-110
                    "
                    style={{
                      backgroundColor: `${course.color}20`,
                    }}
                  />

                  {/* Bottom decorative circle */}

                  <div
                    className="
                      absolute
                      -bottom-16
                      -left-10
                      h-32
                      w-32
                      rounded-full
                      border-[14px]
                    "
                    style={{
                      borderColor: `${course.color}12`,
                    }}
                  />

                  {/* Category */}

                  <span
                    className="
                      absolute
                      left-5
                      top-5
                      font-mono
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                    "
                    style={{
                      color: course.color,
                    }}
                  >
                    {course.category}
                  </span>

                  {/* Level */}

                  <span
                    className="
                      absolute
                      right-5
                      top-5
                      rounded-full
                      bg-white
                      px-3
                      py-1.5
                      text-[10px]
                      font-semibold
                      shadow-sm
                    "
                    style={{
                      color: course.color,
                    }}
                  >
                    {course.level}
                  </span>

                  {/* Course icon */}

                  <div
                    className="
                      absolute
                      bottom-5
                      left-5
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white
                      text-base
                      font-bold
                      shadow-[0_6px_18px_rgba(21,18,31,0.08)]
                      transition-transform
                      duration-300
                      group-hover:rotate-3
                    "
                    style={{
                      color: course.color,
                    }}
                  >
                    {course.title.charAt(0)}
                  </div>

                </div>


                {/* =================================================
                    CARD CONTENT
                ================================================= */}

                <div className="flex flex-1 flex-col p-6">

                  {/* Category */}

                  <p
                    className="
                      font-mono
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                    "
                    style={{
                      color: course.color,
                    }}
                  >
                    {course.category}
                  </p>


                  {/* Title */}

                  <h2
                    className="
                      mt-2
                      line-clamp-2
                      min-h-[56px]
                      text-[19px]
                      font-bold
                      leading-7
                      tracking-[-0.025em]
                      text-[#15121F]
                    "
                  >
                    {course.title}
                  </h2>


                  {/* Description */}

                  <p
                    className="
                      mt-3
                      line-clamp-3
                      min-h-[72px]
                      text-[13px]
                      leading-6
                      text-[#655D72]
                    "
                  >
                    {course.description}
                  </p>


                  {/* =================================================
                      META
                  ================================================= */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      gap-3
                      border-t
                      border-black/[0.06]
                      pt-4
                    "
                  >

                    <span className="text-xs text-[#655D72]">
                      {course.lessons} lessons
                    </span>

                    <span className="h-1 w-1 rounded-full bg-black/20" />

                    <span className="text-xs text-[#655D72]">
                      {course.duration}
                    </span>

                  </div>


                  {/* =================================================
                      BOTTOM ACTION
                  ================================================= */}

                  <div
                    className="
                      mt-auto
                      flex
                      items-end
                      justify-between
                      gap-4
                      border-t
                      border-black/[0.06]
                      pt-5
                    "
                  >

                    {/* Price */}

                    <div>
                      <p className="text-[19px] font-bold tracking-[-0.02em] text-[#15121F]">
                        {course.price}
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#655D72]">
                        Course access
                      </p>
                    </div>


                    {/* Button */}

                    <Link
                      to={`/courses/${course.id}`}
                      className="
                        inline-flex
                        h-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        px-4
                        text-xs
                        font-semibold
                        text-white
                        shadow-sm
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:shadow-md
                        active:translate-y-0
                      "
                      style={{
                        backgroundColor: course.color,
                      }}
                    >
                      View course
                      <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </div>
      </section>

    </main>
  );
}

export default Courses;