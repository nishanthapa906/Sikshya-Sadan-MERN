import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDb from "./src/db/connect.js";
import authRouter from "./src/routes/authRoutes.js";
import courseRouter from "./src/routes/courseRoutes.js";
import studentRouter from "./src/routes/studentRoutes.js";
import instructorRouter from "./src/routes/instructorRoutes.js";
import adminRouter from "./src/routes/adminRoutes.js";
import enrollmentRouter from "./src/routes/enrollmentRoutes.js";
import paymentRouter from "./src/routes/paymentRoutes.js";
import statsRouter from "./src/routes/statsRoutes.js";
import blogRouter from "./src/routes/blogRoutes.js"; 
import jobRouter from "./src/routes/jobRoutes.js";
import assignmentRouter from "./src/routes/assignmentRoutes.js";
import publicRouter from "./src/routes/publicRoutes.js";

const app = express();

const isProd = process.env.NODE_ENV === "production";
const uploadPath = isProd ? "/tmp" : "./public/Images";

// Connect to DB and handle initial errors
connectDb().catch(err => {
    console.error("CRITICAL: Failed to connect to database during startup:", err.message);
});

// Serverless-aware DB Connection Middleware
app.use(async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        await connectDb();
    }
    next();
});

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// Serve static images from correct folder depending on environment
app.use("/uploads", express.static(uploadPath));

app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/student", studentRouter);
app.use("/api/instructor", instructorRouter);
app.use("/api/stats", statsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/assignments", assignmentRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/public", publicRouter);

app.get("/", (req, res) => res.json({ 
    success: true, 
    message: "Sikshya Sadan API is live!",
    env: process.env.NODE_ENV,
    dbStatus: "Connecting..."
}));

// Only listen locally, NOT on Vercel
if (!isProd) {
    app.listen(9000, () => console.log("Server running locally on port 9000"));
}

export default app;
