import {
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext"

function StudentHeader() {
  const { user } = useAuth();

  return (
    <header
      className="
        fixed
        left-0
        right-0
        top-0
        z-40
        h-[72px]
        border-b
        border-slate-200
        bg-white/95
        backdrop-blur
        lg:left-64
      "
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <div>
          <p className="hidden text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:block">
            Student Dashboard
          </p>

          <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Dashboard
          </h2>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Search */}
          <div className="hidden h-10 w-64 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 md:flex">

            <Search
              size={17}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Search courses..."
              className="
                w-full
                bg-transparent
                text-sm
                text-slate-700
                outline-none
                placeholder:text-slate-400
              "
            />

          </div>

          {/* Notification */}
          <button
            type="button"
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-500
              transition
              hover:bg-slate-50
            "
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>

          {/* User */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
              {user?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-28 truncate text-xs font-semibold text-slate-800">
                {user?.name || "Student"}
              </p>

              <p className="text-[10px] text-slate-400">
                Student
              </p>
            </div>

            <ChevronDown
              size={15}
              className="hidden text-slate-400 sm:block"
            />

          </button>

        </div>
      </div>
    </header>
  );
}

export default StudentHeader;