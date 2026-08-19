import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js"
import courseRoutes from "./routes/course.routes.js";
import lectureRoutes from "./routes/lecture.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import studentRoutes from "./routes/student.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import instructorDashboardRoutes from "./routes/instructorDashboard.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Smart LMS API is running"
    });
});

app.use("/api/v1/course", courseRoutes);

app.use("/api/v1/lecture", lectureRoutes);

app.use("/api/v1/enrollment", enrollmentRoutes);

app.use("/api/v1/student", studentRoutes);

app.use("/api/v1/progress", progressRoutes);

app.use("/api/v1/dashboard", dashboardRoutes);

app.use(
  "/api/v1/dashboard",
  instructorDashboardRoutes
);


export default app;