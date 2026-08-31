import express from "express";
import { handleAuthIntercept } from "./middleware/authIntercept.js";
import router from "./routes/studentRoute.js";
import notFoundHandler from "./middleware/notFound.js";

const app = express();

app.use(express.json());
app.use(handleAuthIntercept);

// Routes
app.use("/api", router);

// 404 Catch-All Handler
app.use(notFoundHandler);

export default app;
