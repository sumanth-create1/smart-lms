import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BookOpen, Menu, X } from "lucide-react";

const C = {
  bg: "#FBFAF7",
  white: "#FFFFFF",
  ink: "#15121F",
  muted: "#655D72",
  indigo: "#4F46E5",
  amber: "#F2A93B",
  teal: "#0EA5A4",
  coral: "#FF5A36",
  border: "rgba(21, 18, 31, 0.10)",
};

const navItems = [
  {
    label: "Home",
    to: "/",
    color: C.indigo,
    route: true,
  },
  {
    label: "Courses",
    to: "/courses",
    color: C.amber,
    route: true,
  },
  {
    label: "Features",
    to: "#features",
    color: C.teal,
    route: false,
  },
  {
    label: "About",
    to: "#about",
    color: C.coral,
    route: false,
  },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: "rgba(251, 250, 247, 0.96)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      {/* =====================================================
          TOP GRADIENT
      ===================================================== */}

      <div
        style={{
          width: "100%",
          height: "3px",
          background:
            "linear-gradient(90deg, #4F46E5 0%, #0EA5A4 35%, #F2A93B 68%, #FF5A36 100%)",
        }}
      />

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <div
        className="w-full border-b"
        style={{
          borderColor: C.border,
        }}
      >
        <div
          className="mx-auto flex w-full max-w-[1400px] items-center justify-between"
          style={{
            height: "72px",
            paddingLeft: "28px",
            paddingRight: "28px",
          }}
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex shrink-0 items-center"
            style={{
              gap: "12px",
            }}
          >
            {/* Logo Icon */}

            <div
              className="relative flex shrink-0 items-center justify-center"
              style={{
                width: "42px",
                height: "42px",
              }}
            >
              <div
                className="absolute inset-0 rounded-[13px] border border-dashed transition-transform duration-300 group-hover:rotate-6"
                style={{
                  borderColor: `${C.indigo}55`,
                }}
              />

              <div
                className="relative flex items-center justify-center rounded-[10px] text-white shadow-sm"
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: C.indigo,
                }}
              >
                <BookOpen
                  size={17}
                  strokeWidth={2.2}
                />
              </div>
            </div>

            {/* Logo Text */}

            <div
              className="leading-none"
              style={{
                fontFamily: "'Sora', sans-serif",
              }}
            >
              <div
                style={{
                  color: C.ink,
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                Smart
                <span
                  style={{
                    color: C.coral,
                  }}
                >
                  LMS
                </span>
              </div>

              <div
                style={{
                  marginTop: "5px",
                  color: "#94A3B8",
                  fontSize: "8px",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                }}
              >
                LEARNING PLATFORM
              </div>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <div className="hidden lg:flex items-center">
            <div
              className="flex items-center rounded-2xl border bg-white/50"
              style={{
                gap: "2px",
                padding: "5px",
                borderColor: C.border,
              }}
            >
              {navItems.map((item) => {
                if (item.route) {
                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      className={({ isActive }) =>
                        `
                        group
                        flex
                        items-center
                        rounded-xl
                        text-[13px]
                        font-medium
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? "bg-white shadow-sm"
                            : "hover:bg-white/70"
                        }
                      `
                      }
                      style={({ isActive }) => ({
                        height: "40px",
                        paddingLeft: "14px",
                        paddingRight: "14px",
                        gap: "8px",
                        color: isActive
                          ? C.ink
                          : C.muted,
                      })}
                    >
                      <span
                        className="shrink-0 rounded-full transition-transform duration-200 group-hover:scale-150"
                        style={{
                          width: "6px",
                          height: "6px",
                          backgroundColor: item.color,
                        }}
                      />

                      {item.label}
                    </NavLink>
                  );
                }

                return (
                  <a
                    key={item.label}
                    href={item.to}
                    className="group flex items-center rounded-xl text-[13px] font-medium transition-all duration-200 hover:bg-white/70"
                    style={{
                      height: "40px",
                      paddingLeft: "14px",
                      paddingRight: "14px",
                      gap: "8px",
                      color: C.muted,
                    }}
                  >
                    <span
                      className="shrink-0 rounded-full transition-transform duration-200 group-hover:scale-150"
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: item.color,
                      }}
                    />

                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* =================================================
              DESKTOP ACTION BUTTONS
          ================================================= */}

          <div
            className="hidden items-center sm:flex"
            style={{
              gap: "14px",
            }}
          >
            {/* LOGIN */}

            <Link
              to="/login"
              className="flex items-center justify-center rounded-xl border text-[13px] font-semibold transition-all duration-200 hover:-translate-y-[1px] hover:bg-white hover:shadow-sm"
              style={{
                height: "46px",
                minWidth: "96px",
                paddingLeft: "28px",
                paddingRight: "28px",
                borderColor: C.border,
                backgroundColor:
                  "rgba(255,255,255,0.65)",
                color: C.ink,
                whiteSpace: "nowrap",
              }}
            >
              Log in
            </Link>

            {/* GET STARTED */}

            <Link
              to="/register"
              className="group flex items-center justify-center rounded-xl text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0"
              style={{
                height: "46px",
                minWidth: "154px",
                paddingLeft: "30px",
                paddingRight: "30px",
                gap: "10px",
                backgroundColor: C.indigo,
                whiteSpace: "nowrap",
              }}
            >
              <span>Get Started</span>

              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen((prev) => !prev)
            }
            className="flex items-center justify-center rounded-xl border lg:hidden"
            style={{
              width: "42px",
              height: "42px",
              borderColor: C.border,
              backgroundColor: C.white,
              color: C.ink,
            }}
            aria-label={
              mobileOpen
                ? "Close navigation"
                : "Open navigation"
            }
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {mobileOpen && (
        <div
          className="border-b bg-white lg:hidden"
          style={{
            borderColor: C.border,
          }}
        >
          <div
            className="mx-auto w-full max-w-[1400px]"
            style={{
              padding: "16px 20px 22px",
            }}
          >
            {/* Mobile Navigation */}

            <div
              className="flex flex-col"
              style={{
                gap: "4px",
              }}
            >
              {navItems.map((item) => {
                if (item.route) {
                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `
                        flex
                        items-center
                        rounded-xl
                        text-sm
                        font-semibold
                        ${
                          isActive
                            ? "bg-indigo-50"
                            : "hover:bg-slate-50"
                        }
                      `
                      }
                      style={{
                        height: "48px",
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        gap: "12px",
                        color: C.ink,
                      }}
                    >
                      <span
                        className="rounded-full"
                        style={{
                          width: "7px",
                          height: "7px",
                          backgroundColor:
                            item.color,
                        }}
                      />

                      {item.label}
                    </NavLink>
                  );
                }

                return (
                  <a
                    key={item.label}
                    href={item.to}
                    onClick={closeMobileMenu}
                    className="flex items-center rounded-xl text-sm font-semibold hover:bg-slate-50"
                    style={{
                      height: "48px",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      gap: "12px",
                      color: C.ink,
                    }}
                  >
                    <span
                      className="rounded-full"
                      style={{
                        width: "7px",
                        height: "7px",
                        backgroundColor:
                          item.color,
                      }}
                    />

                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Mobile Buttons */}

            <div
              className="grid grid-cols-2 border-t"
              style={{
                marginTop: "16px",
                paddingTop: "16px",
                gap: "12px",
                borderColor: C.border,
              }}
            >
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center justify-center rounded-xl border text-sm font-semibold"
                style={{
                  height: "46px",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  borderColor: C.border,
                  color: C.ink,
                }}
              >
                Log in
              </Link>

              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="flex items-center justify-center rounded-xl text-sm font-semibold text-white"
                style={{
                  height: "46px",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  backgroundColor: C.indigo,
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;