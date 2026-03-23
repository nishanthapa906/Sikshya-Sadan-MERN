import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./src/db/connect.js";

// Routers
import authRouter from "./src/routes/authRoutes.js";
 import courseRouter from "./src/routes/courseRoutes.js";
// import studentRouter from "./routes/studentRoutes.js";
// import instructorRouter from "./routes/instructorRoutes.js";
import adminRouter from "./src/routes/adminRoutes.js";
 import enrollmentRouter from "./src/routes/enrollmentRoutes.js";
// import paymentRouter from "./routes/paymentRoutes.js";
// import bannerRouter from "./routes/bannerRoutes.js";
// import statsRouter from "./routes/statsRoutes.js";
// import blogRouter from "./routes/blogRoutes.js";
// import contactRouter from "./routes/contactRoutes.js";
// import publicRouter from "./routes/publicRoutes.js";
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
// app.use("/api/student", studentRouter);
// app.use("/api/instructor", instructorRouter);
app.use("/api/admin", adminRouter);
 app.use("/api/enrollments", enrollmentRouter);
// app.use("/api/payment", paymentRouter);
// app.use("/api/banners", bannerRouter);
// app.use("/api/stats", statsRouter);
// app.use("/api/blogs", blogRouter);
// app.use("/api/contact", contactRouter);
// app.use("/api/public", publicRouter);
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
