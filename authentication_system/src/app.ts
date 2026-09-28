import express from "express"
import handleError from "./middleware/error.middleware.js";
import authRoute from "./routes/auth.routes.js";
import profileRoute from "./routes/profile.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express();

app.use(express.json());
app.use("/api", authRoute);
app.use("/api", profileRoute);
app.use("/api", usersRoutes);
app.use(handleError);

export default app;
