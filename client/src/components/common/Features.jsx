const C = {
  bg: "#FBFAF7",
  surface: "#FFFFFF",
  ink: "#15121F",
  muted: "#655D72",
  soft: "#F3F1EC",
  indigo: "#4F46E5",
  amber: "#F2A93B",
  teal: "#0EA5A4",
  coral: "#FF5A36",
};

function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden border-t border-black/[0.06]"
      style={{
        backgroundColor: C.bg,
        width: "100%",
      }}
    >
      {/* ================= BACKGROUND DECORATION ================= */}

      <div
        className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full"
        style={{
          backgroundColor: `${C.indigo}08`,
          filter: "blur(90px)",
        }}
      />

      <div
        className="pointer-events-none absolute -left-32 bottom-20 h-80 w-80 rounded-full"
        style={{
          backgroundColor: `${C.coral}06`,
          filter: "blur(90px)",
        }}
      />

      {/* ================= MAIN CONTAINER ================= */}

      <div
        style={{
          width: "100%",
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "110px 32px",
          boxSizing: "border-box",
        }}
      >
        {/* ================= HEADER ================= */}

        <div
          style={{
            width: "100%",
            maxWidth: "1080px",
            margin: "0 auto",
          }}
        >
          <div
            className="grid lg:grid-cols-2"
            style={{
              gap: "60px",
              alignItems: "end",
            }}
          >
            {/* LEFT HEADER */}

            <div>
              <div className="flex items-center gap-4">
                <span
                  style={{
                    width: "42px",
                    height: "2px",
                    borderRadius: "999px",
                    backgroundColor: C.indigo,
                    flexShrink: 0,
                  }}
                />

                <span
                  style={{
                    color: C.indigo,
                    fontFamily: "monospace",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  Why Smart LMS
                </span>
              </div>

              <h2
                style={{
                  marginTop: "28px",
                  marginBottom: 0,
                  color: C.ink,
                  fontSize: "clamp(42px, 5vw, 60px)",
                  fontWeight: 700,
                  lineHeight: "1.04",
                  letterSpacing: "-0.045em",
                }}
              >
                Learning should feel

                <span
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: C.muted,
                  }}
                >
                  simple.
                </span>
              </h2>
            </div>

            {/* RIGHT HEADER */}

            <div>
              <p
                style={{
                  maxWidth: "520px",
                  margin: 0,
                  color: C.muted,
                  fontSize: "17px",
                  lineHeight: "1.8",
                }}
              >
                Smart LMS gives students a focused environment to discover
                courses, follow their progress and continue learning without
                unnecessary complexity.
              </p>
            </div>
          </div>
        </div>

        {/* ================= FEATURE GRID ================= */}

        <div
          style={{
            width: "100%",
            maxWidth: "1080px",
            margin: "72px auto 0",
          }}
        >
          <div
            className="grid lg:grid-cols-2"
            style={{
              gap: "24px",
              alignItems: "stretch",
            }}
          >
            {/* ================= FEATURE 01 ================= */}

            <div
              className="group relative overflow-hidden rounded-[28px] border"
              style={{
                minHeight: "500px",
                backgroundColor: C.surface,
                borderColor: "rgba(21,18,31,0.08)",
                boxShadow: "0 18px 55px rgba(21,18,31,0.045)",
                padding: "40px",
                boxSizing: "border-box",
              }}
            >
              {/* Top accent */}

              <div
                className="absolute left-0 right-0 top-0"
                style={{
                  height: "4px",
                  backgroundColor: C.indigo,
                }}
              />

              {/* Decorative circle */}

              <div
                className="pointer-events-none absolute -right-24 -top-24 rounded-full transition-transform duration-700 group-hover:scale-110"
                style={{
                  width: "260px",
                  height: "260px",
                  backgroundColor: `${C.indigo}0F`,
                }}
              />

              {/* Card top */}

              <div className="relative flex items-center justify-between">
                <span
                  style={{
                    color: C.indigo,
                    fontFamily: "monospace",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  01
                </span>

                <div
                  className="flex items-center justify-center rounded-2xl transition-transform duration-300 group-hover:rotate-6"
                  style={{
                    width: "46px",
                    height: "46px",
                    backgroundColor: `${C.indigo}10`,
                    color: C.indigo,
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  ↗
                </div>
              </div>

              {/* Content */}

              <div
                style={{
                  position: "relative",
                  marginTop: "110px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: C.ink,
                    fontSize: "32px",
                    fontWeight: 700,
                    lineHeight: "1.1",
                    letterSpacing: "-0.035em",
                  }}
                >
                  Learn with
                  <span style={{ display: "block" }}>
                    a clear direction.
                  </span>
                </h3>

                <p
                  style={{
                    maxWidth: "520px",
                    marginTop: "20px",
                    color: C.muted,
                    fontSize: "15px",
                    lineHeight: "1.8",
                  }}
                >
                  Courses are organized into meaningful lessons so you can
                  focus on learning instead of figuring out what comes next.
                </p>
              </div>

              {/* Roadmap */}

              <div
                style={{
                  position: "absolute",
                  left: "40px",
                  right: "40px",
                  bottom: "42px",
                }}
              >
                <div className="flex w-full items-center">
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: C.indigo,
                      flexShrink: 0,
                    }}
                  />

                  <div
                    style={{
                      height: "2px",
                      flex: 1,
                      margin: "0 10px",
                      backgroundColor: `${C.indigo}20`,
                    }}
                  />

                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: `${C.indigo}60`,
                      flexShrink: 0,
                    }}
                  />

                  <div
                    style={{
                      height: "2px",
                      flex: 1,
                      margin: "0 10px",
                      backgroundColor: `${C.indigo}20`,
                    }}
                  />

                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: `${C.indigo}40`,
                      flexShrink: 0,
                    }}
                  />

                  <div
                    style={{
                      height: "2px",
                      flex: 1,
                      margin: "0 10px",
                      backgroundColor: `${C.indigo}20`,
                    }}
                  />

                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: `${C.indigo}25`,
                      flexShrink: 0,
                    }}
                  />
                </div>

                <div
                  className="flex justify-between"
                  style={{
                    marginTop: "12px",
                    color: `${C.muted}99`,
                    fontFamily: "monospace",
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  <span>Start</span>
                  <span>Learn</span>
                  <span>Practice</span>
                  <span>Complete</span>
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN ================= */}

            <div
              className="flex flex-col"
              style={{
                gap: "24px",
              }}
            >
              {/* ================= FEATURE 02 ================= */}

              <div
                className="group rounded-[28px] border"
                style={{
                  backgroundColor: C.surface,
                  borderColor: "rgba(21,18,31,0.08)",
                  boxShadow: "0 18px 55px rgba(21,18,31,0.045)",
                  padding: "36px",
                }}
              >
                <div className="flex gap-6">
                  <div
                    className="flex shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: `${C.teal}10`,
                      color: C.teal,
                      fontSize: "20px",
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          color: C.teal,
                          fontFamily: "monospace",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        02
                      </span>

                      <span
                        style={{
                          color: C.muted,
                          fontSize: "12px",
                        }}
                      >
                        Progress tracking
                      </span>
                    </div>

                    <h3
                      style={{
                        marginTop: "18px",
                        marginBottom: 0,
                        color: C.ink,
                        fontSize: "27px",
                        fontWeight: 700,
                        lineHeight: "1.15",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      Always know where you stand.
                    </h3>

                    <p
                      style={{
                        marginTop: "12px",
                        color: C.muted,
                        fontSize: "15px",
                        lineHeight: "1.75",
                      }}
                    >
                      Every lecture you watch contributes to your course
                      progress, giving you a simple view of your learning
                      journey.
                    </p>

                    {/* Progress */}

                    <div style={{ marginTop: "24px" }}>
                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            color: C.muted,
                            fontSize: "12px",
                          }}
                        >
                          MERN Stack Bootcamp
                        </span>

                        <span
                          style={{
                            color: C.teal,
                            fontFamily: "monospace",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          68%
                        </span>
                      </div>

                      <div
                        style={{
                          height: "8px",
                          marginTop: "9px",
                          overflow: "hidden",
                          borderRadius: "999px",
                          backgroundColor: "#F1F0ED",
                        }}
                      >
                        <div
                          style={{
                            width: "68%",
                            height: "100%",
                            borderRadius: "999px",
                            backgroundColor: C.teal,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= FEATURE 03 ================= */}

              <div
                className="group rounded-[28px] border"
                style={{
                  backgroundColor: C.surface,
                  borderColor: "rgba(21,18,31,0.08)",
                  boxShadow: "0 18px 55px rgba(21,18,31,0.045)",
                  padding: "36px",
                }}
              >
                <div className="flex gap-6">
                  <div
                    className="flex shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: `${C.coral}10`,
                      color: C.coral,
                      fontSize: "17px",
                      fontWeight: 700,
                    }}
                  >
                    ▶
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          color: C.coral,
                          fontFamily: "monospace",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        03
                      </span>

                      <span
                        style={{
                          color: C.muted,
                          fontSize: "12px",
                        }}
                      >
                        Resume learning
                      </span>
                    </div>

                    <h3
                      style={{
                        marginTop: "18px",
                        marginBottom: 0,
                        color: C.ink,
                        fontSize: "27px",
                        fontWeight: 700,
                        lineHeight: "1.15",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      Pick up exactly where you stopped.
                    </h3>

                    <p
                      style={{
                        marginTop: "12px",
                        color: C.muted,
                        fontSize: "15px",
                        lineHeight: "1.75",
                      }}
                    >
                      Your lecture progress is saved so you can leave and
                      return whenever it is convenient.
                    </p>

                    {/* Continue learning */}

                    <div
                      className="flex items-center justify-between gap-4 rounded-2xl"
                      style={{
                        marginTop: "22px",
                        padding: "16px 18px",
                        backgroundColor: C.soft,
                      }}
                    >
                      <div className="min-w-0">
                        <p
                          style={{
                            margin: 0,
                            color: C.muted,
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                          }}
                        >
                          Continue learning
                        </p>

                        <p
                          style={{
                            marginTop: "7px",
                            marginBottom: 0,
                            color: C.ink,
                            fontSize: "14px",
                            fontWeight: 600,
                          }}
                        >
                          React Fundamentals
                        </p>
                      </div>

                      <div
                        className="flex shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:translate-x-1"
                        style={{
                          width: "38px",
                          height: "38px",
                          color: C.coral,
                          fontWeight: 700,
                        }}
                      >
                        →
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM STATEMENT ================= */}

        <div
          style={{
            width: "100%",
            maxWidth: "1080px",
            margin: "70px auto 0",
          }}
        >
          <div
            style={{
              height: "1px",
              backgroundColor: "rgba(21,18,31,0.07)",
            }}
          />

          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
            style={{
              gap: "24px",
              paddingTop: "28px",
            }}
          >
            <p
              style={{
                maxWidth: "700px",
                margin: 0,
                color: C.muted,
                fontSize: "14px",
                lineHeight: "1.8",
              }}
            >
              From your first lecture to your final course completion,
              Smart LMS keeps your learning journey organized.
            </p>

            <div className="flex shrink-0 items-center gap-2">
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: C.indigo,
                }}
              />

              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: C.teal,
                }}
              />

              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: C.amber,
                }}
              />

              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: C.coral,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;