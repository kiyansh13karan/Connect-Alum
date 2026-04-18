import express from 'express';
import cors from 'cors'
import userRouter from "./routes/userRoute.js"
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import jobRouter from "./routes/jobRoute.js";
import mentorRoutes from "./routes/mentorRoute.js";
import eventRoutes from "./routes/eventRoutes.js"
import alumniRouter from "./routes/alumniRoute.js";
import mentorshipRouter from "./routes/mentorshipRoute.js";
import forumRouter from "./routes/forumRoute.js";
import notificationRouter from "./routes/notificationRoute.js";
import studentRoutes from "./routes/studentRoutes.js";
import alumniRoutes from "./routes/alumniRoutes.js";
import linkedinRouter from "./routes/linkedinRoute.js";
dotenv.config();


//app config
const app = express()
const port = process.env.PORT || 4000;

//middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cors())

//db connection
connectDB();


//api endpoint
app.use("/api/user", userRouter)
app.use("/api/jobs", jobRouter);
app.use("/api/mentors", mentorRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/alumni", alumniRouter);
app.use("/api/mentorship", mentorshipRouter);
app.use("/api/forum", forumRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/student", studentRoutes);
app.use("/api/alumni-role", alumniRoutes); // Distinct from the existing /api/alumni generic user route
app.use("/api/linkedin", linkedinRouter);

app.get("/", (req, res) => {
    res.send("API working")
})

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})