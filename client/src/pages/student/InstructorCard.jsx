import {
  Mail,
  GraduationCap,
  Users,
} from "lucide-react";

function InstructorCard({ instructors = [] }) {
  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (instructors.length === 0) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <GraduationCap
              size={21}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              My Instructors
            </h2>

            <p className="text-sm text-gray-500">
              Your course instructors
            </p>
          </div>

        </div>

        <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-6 text-center">

          <Users
            size={32}
            className="mx-auto text-gray-300"
          />

          <p className="mt-3 text-sm font-medium text-gray-500">
            No instructors yet
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Enroll in a course to see your instructors.
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
          <GraduationCap
            size={21}
            className="text-indigo-600"
          />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            My Instructors
          </h2>

          <p className="text-sm text-gray-500">
            Your course instructors
          </p>
        </div>

      </div>


      {/* =====================================
          INSTRUCTOR LIST
      ===================================== */}

      <div className="mt-6 space-y-4">

        {instructors.map((instructor) => {

          const name =
            instructor?.name || "Instructor";

          const email =
            instructor?.email || "";

          // Generate initials
          const initials = name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase();

          return (
            <div
              key={instructor?._id}
              className="flex items-center gap-3"
            >

              {/* AVATAR */}

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                {initials || "I"}
              </div>


              {/* DETAILS */}

              <div className="min-w-0 flex-1">

                <h3 className="truncate text-sm font-semibold text-gray-900">
                  {name}
                </h3>

                {email && (
                  <div className="mt-1 flex items-center gap-1">

                    <Mail
                      size={12}
                      className="shrink-0 text-gray-400"
                    />

                    <p className="truncate text-xs text-gray-400">
                      {email}
                    </p>

                  </div>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default InstructorCard;