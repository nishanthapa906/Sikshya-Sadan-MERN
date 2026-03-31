import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./src/db/connect.js";

// Routers
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
// import bannerRouter from "./routes/bannerRoutes.js";
// import contactRouter from "./routes/contactRoutes.js";
// import demoRouter from "./routes/demoRoutes.js";
// import reportRouter from "./routes/reportRoutes.js";

const app = express();
const PORT = 9000;

// Database
connectDb();

// Middlewares
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// Static Files
app.use("/uploads", express.static('./public/Images'));

// Base Routes
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
// app.use("/api/banners", bannerRouter);
// app.use("/api/contact", contactRouter);
// app.use("/api/demo-slots", demoRouter);
// app.use("/api/admin/reports", reportRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        status: 200,
        success: true,
        message: "App is running successfully!"
    });
});

app.listen(PORT, () => {
    console.log(`App is running at port number ${PORT}.!`);
});
