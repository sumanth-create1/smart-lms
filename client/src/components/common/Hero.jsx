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

function Hero() {
  return (
    <section
      className="relative w-full"
      style={{
        backgroundColor: C.bg,
        overflow: "hidden",
      }}
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="pointer-events-none absolute rounded-full blur-3xl"
        style={{
          width: "320px",
          height: "320px",
          left: "-160px",
          top: "100px",
          backgroundColor: `${C.indigo}10`,
        }}
      />

      <div
        className="pointer-events-none absolute rounded-full blur-3xl"
        style={{
          width: "360px",
          height: "360px",
          right: "-180px",
          top: "80px",
          backgroundColor: `${C.coral}08`,
        }}
      />

      {/* =====================================================
          MAIN HERO CONTAINER
      ===================================================== */}

      <div
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "72px 48px 88px",
          position: "relative",
          zIndex: 1,
          boxSizing: "border-box",
        }}
      >
        <div
          className="grid items-center"
          style={{
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            columnGap: "70px",
          }}
        >
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div style={{ minWidth: 0 }}>
            {/* Label */}

            <div
              className="inline-flex items-center rounded-full border"
              style={{
                gap: "9px",
                padding: "7px 14px",
                marginBottom: "24px",
                borderColor: `${C.indigo}25`,
                backgroundColor: `${C.indigo}08`,
              }}
            >
              <span
                className="rounded-full"
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: C.indigo,
                }}
              />

              <span
                style={{
                  color: C.indigo,
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Your learning journey
              </span>
            </div>

            {/* Heading */}

            <h1
              style={{
                margin: 0,
                maxWidth: "680px",
                color: C.ink,
                fontSize: "clamp(52px, 5vw, 72px)",
                fontWeight: 750,
                lineHeight: "0.98",
                letterSpacing: "-0.055em",
              }}
            >
              Learn skills.

              <span
                style={{
                  display: "block",
                  marginTop: "12px",
                  color: C.indigo,
                }}
              >
                Build your future.
              </span>
            </h1>

            {/* Description */}

            <p
              style={{
                margin: "26px 0 0",
                maxWidth: "610px",
                color: C.muted,
                fontSize: "18px",
                lineHeight: "1.75",
              }}
            >
              Smart LMS helps you learn practical technology skills through
              structured courses, hands-on lessons, and progress tracking —
              all in one place.
            </p>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div
              className="flex flex-col sm:flex-row"
              style={{
                gap: "12px",
                marginTop: "30px",
              }}
            >
              <Link
                to="/register"
                className="group inline-flex items-center justify-center rounded-xl text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  height: "50px",
                  minWidth: "175px",
                  padding: "0 25px",
                  backgroundColor: C.indigo,
                  fontSize: "14px",
                  fontWeight: 650,
                  textDecoration: "none",
                  boxShadow: "0 6px 18px rgba(79,70,229,0.18)",
                }}
              >
                Start learning

                <span
                  style={{
                    marginLeft: "8px",
                    transition: "transform 0.2s ease",
                  }}
                >
                  →
                </span>
              </Link>

              <Link
                to="/courses"
                className="inline-flex items-center justify-center rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                style={{
                  height: "50px",
                  minWidth: "175px",
                  padding: "0 25px",
                  borderColor: "rgba(21,18,31,0.13)",
                  color: C.ink,
                  fontSize: "14px",
                  fontWeight: 650,
                  textDecoration: "none",
                }}
              >
                Explore courses
              </Link>
            </div>

            {/* =================================================
                STATS
            ================================================= */}

            <div
              className="flex items-center"
              style={{
                gap: "28px",
                marginTop: "38px",
              }}
            >
              {/* Courses */}

              <div>
                <div
                  style={{
                    color: C.ink,
                    fontSize: "30px",
                    lineHeight: 1,
                    fontWeight: 750,
                  }}
                >
                  50+
                </div>

                <div
                  style={{
                    marginTop: "6px",
                    color: C.muted,
                    fontSize: "12px",
                  }}
                >
                  Courses
                </div>
              </div>

              <div
                style={{
                  width: "1px",
                  height: "38px",
                  backgroundColor: "rgba(21,18,31,0.12)",
                }}
              />

              {/* Learners */}

              <div>
                <div
                  style={{
                    color: C.ink,
                    fontSize: "30px",
                    lineHeight: 1,
                    fontWeight: 750,
                  }}
                >
                  1K+
                </div>

                <div
                  style={{
                    marginTop: "6px",
                    color: C.muted,
                    fontSize: "12px",
                  }}
                >
                  Learners
                </div>
              </div>

              <div
                style={{
                  width: "1px",
                  height: "38px",
                  backgroundColor: "rgba(21,18,31,0.12)",
                }}
              />

              {/* Learning */}

              <div>
                <div
                  style={{
                    color: C.ink,
                    fontSize: "30px",
                    lineHeight: 1,
                    fontWeight: 750,
                  }}
                >
                  24/7
                </div>

                <div
                  style={{
                    marginTop: "6px",
                    color: C.muted,
                    fontSize: "12px",
                  }}
                >
                  Learning
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT — LEARNING PATH CARD
          ================================================= */}

          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "600px",
              justifySelf: "end",
              paddingBottom: "20px",
            }}
          >
            {/* Main Card */}

            <div
              style={{
                position: "relative",
                width: "100%",
                boxSizing: "border-box",
                padding: "28px",
                borderRadius: "28px",
                border: "1px solid rgba(21,18,31,0.08)",
                backgroundColor: "#FFFFFF",
                boxShadow:
                  "0 25px 70px rgba(21,18,31,0.09)",
              }}
            >
              {/* =================================================
                  CARD HEADER
              ================================================= */}

              <div
                className="flex items-start justify-between"
                style={{
                  gap: "20px",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      color: C.muted,
                      fontSize: "10px",
                      fontWeight: 650,
                      letterSpacing: "0.17em",
                      textTransform: "uppercase",
                    }}
                  >
                    Learning path
                  </div>

                  <h2
                    style={{
                      margin: "7px 0 0",
                      color: C.ink,
                      fontSize: "28px",
                      fontWeight: 750,
                      lineHeight: 1.15,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    Full Stack Development
                  </h2>
                </div>

                {/* Percentage */}

                <div
                  className="flex shrink-0 items-center justify-center"
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "17px",
                    backgroundColor: `${C.indigo}10`,
                    color: C.indigo,
                    fontSize: "12px",
                    fontWeight: 750,
                  }}
                >
                  68%
                </div>
              </div>

              {/* =================================================
                  PROGRESS
              ================================================= */}

              <div style={{ marginTop: "22px" }}>
                <div
                  className="flex justify-between"
                  style={{
                    marginBottom: "7px",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ color: C.muted }}>
                    Course progress
                  </span>

                  <span
                    style={{
                      color: C.indigo,
                      fontWeight: 650,
                    }}
                  >
                    68%
                  </span>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    overflow: "hidden",
                    borderRadius: "999px",
                    backgroundColor: "#EEF0F5",
                  }}
                >
                  <div
                    style={{
                      width: "68%",
                      height: "100%",
                      borderRadius: "999px",
                      background:
                        `linear-gradient(90deg, ${C.indigo}, ${C.teal})`,
                    }}
                  />
                </div>
              </div>

              {/* =================================================
                  ROADMAP
              ================================================= */}

              <div style={{ marginTop: "24px" }}>
                <div
                  style={{
                    marginBottom: "13px",
                    color: C.muted,
                    fontSize: "10px",
                    fontWeight: 650,
                    letterSpacing: "0.17em",
                    textTransform: "uppercase",
                  }}
                >
                  Your roadmap
                </div>

                <div style={{ position: "relative" }}>
                  {/* Vertical Line */}

                  <div
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "13px",
                      bottom: "13px",
                      width: "1px",
                      backgroundColor:
                        "rgba(21,18,31,0.11)",
                    }}
                  />

                  {/* STEP 1 */}

                  <div
                    className="flex"
                    style={{
                      position: "relative",
                      gap: "14px",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      className="relative z-10 flex shrink-0 items-center justify-center rounded-full text-white"
                      style={{
                        width: "26px",
                        height: "26px",
                        backgroundColor: C.indigo,
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      ✓
                    </div>

                    <div>
                      <div
                        style={{
                          color: C.ink,
                          fontSize: "14px",
                          fontWeight: 650,
                        }}
                      >
                        HTML & CSS
                      </div>

                      <div
                        style={{
                          marginTop: "3px",
                          color: C.muted,
                          fontSize: "12px",
                        }}
                      >
                        Completed
                      </div>
                    </div>
                  </div>

                  {/* STEP 2 */}

                  <div
                    className="flex"
                    style={{
                      position: "relative",
                      gap: "14px",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      className="relative z-10 flex shrink-0 items-center justify-center rounded-full bg-white"
                      style={{
                        width: "26px",
                        height: "26px",
                        border: `2px solid ${C.teal}`,
                        color: C.teal,
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      2
                    </div>

                    <div>
                      <div
                        style={{
                          color: C.ink,
                          fontSize: "14px",
                          fontWeight: 650,
                        }}
                      >
                        JavaScript
                      </div>

                      <div
                        style={{
                          marginTop: "3px",
                          color: C.muted,
                          fontSize: "12px",
                        }}
                      >
                        In progress · 72%
                      </div>
                    </div>
                  </div>

                  {/* STEP 3 */}

                  <div
                    className="flex"
                    style={{
                      position: "relative",
                      gap: "14px",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      className="relative z-10 flex shrink-0 items-center justify-center rounded-full bg-white"
                      style={{
                        width: "26px",
                        height: "26px",
                        border: `2px solid ${C.amber}`,
                        color: C.amber,
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      3
                    </div>

                    <div>
                      <div
                        style={{
                          color: C.ink,
                          fontSize: "14px",
                          fontWeight: 650,
                        }}
                      >
                        React
                      </div>

                      <div
                        style={{
                          marginTop: "3px",
                          color: C.muted,
                          fontSize: "12px",
                        }}
                      >
                        Upcoming
                      </div>
                    </div>
                  </div>

                  {/* STEP 4 */}

                  <div
                    className="flex"
                    style={{
                      position: "relative",
                      gap: "14px",
                    }}
                  >
                    <div
                      className="relative z-10 flex shrink-0 items-center justify-center rounded-full bg-white"
                      style={{
                        width: "26px",
                        height: "26px",
                        border: `2px solid ${C.coral}`,
                        color: C.coral,
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      4
                    </div>

                    <div>
                      <div
                        style={{
                          color: C.ink,
                          fontSize: "14px",
                          fontWeight: 650,
                        }}
                      >
                        Node.js & MongoDB
                      </div>

                      <div
                        style={{
                          marginTop: "3px",
                          color: C.muted,
                          fontSize: "12px",
                        }}
                      >
                        Upcoming
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  CONTINUE LEARNING
              ================================================= */}

              <div
                className="flex items-center justify-between"
                style={{
                  marginTop: "23px",
                  minHeight: "64px",
                  padding: "12px 13px 12px 15px",
                  borderRadius: "17px",
                  backgroundColor: "#F7F6FB",
                  gap: "15px",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      color: C.muted,
                      fontSize: "10px",
                    }}
                  >
                    Continue learning
                  </div>

                  <div
                    style={{
                      marginTop: "4px",
                      color: C.ink,
                      fontSize: "14px",
                      fontWeight: 650,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    React Fundamentals
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Continue learning"
                  className="flex shrink-0 items-center justify-center rounded-xl text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  style={{
                    width: "42px",
                    height: "42px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: C.coral,
                    fontSize: "16px",
                  }}
                >
                  →
                </button>
              </div>
            </div>

            {/* =================================================
                STREAK BADGE
            ================================================= */}

            <div
              className="hidden sm:block"
              style={{
                position: "absolute",
                left: "28px",
                bottom: "-2px",
                zIndex: 5,
                padding: "10px 15px",
                borderRadius: "16px",
                border: "1px solid rgba(21,18,31,0.08)",
                backgroundColor: "#FFFFFF",
                boxShadow:
                  "0 12px 30px rgba(21,18,31,0.10)",
              }}
            >
              <div className="flex items-center" style={{ gap: "10px" }}>
                <div
                  className="flex shrink-0 items-center justify-center rounded-xl"
                  style={{
                    width: "34px",
                    height: "34px",
                    backgroundColor: `${C.teal}15`,
                    color: C.teal,
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>

                <div>
                  <div
                    style={{
                      color: C.muted,
                      fontSize: "10px",
                    }}
                  >
                    Weekly streak
                  </div>

                  <div
                    style={{
                      marginTop: "2px",
                      color: C.ink,
                      fontSize: "13px",
                      fontWeight: 750,
                    }}
                  >
                    7 days 🔥
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Dot */}

            <div
              style={{
                position: "absolute",
                right: "-10px",
                top: "-10px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                border: `3px solid ${C.bg}`,
                backgroundColor: C.amber,
              }}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          RESPONSIVE OVERRIDES
      ===================================================== */}

      <style>{`
        @media (max-width: 1024px) {
          .hero-main-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .hero-content-wrapper {
            padding: 55px 24px 70px !important;
          }
        }

        @media (max-width: 640px) {
          .hero-content-wrapper {
            padding: 45px 18px 60px !important;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;