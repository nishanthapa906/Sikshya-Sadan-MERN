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
import bannerRouter from "./src/routes/bannerRoutes.js";
import { FRONTEND_URL } from "./src/utils/constants.js";



const app = express();

const isProd = process.env.NODE_ENV === "production";
const uploadPath = isProd ? "/tmp" : "./public/Images";

connectDb();

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
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
app.use("/api/banners", bannerRouter);


app.get("/", (req, res) => res.json({
    success: true,
    message: "Sikshya Sadan API is live!",
    env: process.env.NODE_ENV,
    dbStatus: "Connecting..."
}));

// Only listen locally, NOT on Vercel
if (!isProd) {
    const PORT = process.env.PORT || 9000;
    app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}

export default app;
