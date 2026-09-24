import express from "express"
import handleError from "./middleware/error.middleware.js";
import authRoute from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use("/api", authRoute)
app.use(handleError);

export default app;
