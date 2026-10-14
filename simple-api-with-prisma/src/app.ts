import express from "express";
import teachersRoutes from "./routes/teachers.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import enrollmentRoutes from "./routes/enrollments.routes.js";
import studentRoutes from "./routes/students.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", teachersRoutes);
app.use("/api", coursesRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api", studentRoutes);

app.get("/", (_req, res) => {
    res.send("Welcome to the student course API");
});

export default app;
