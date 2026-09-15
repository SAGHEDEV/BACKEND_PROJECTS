import express from "express";
import handleError from "./middlewares/error.middleware.js";
import bookRoutes from "./routes/booksRoutes.js";
import authorsRoutes from "./routes/authorsRoutes.js";
import borrowingRoutes from "./routes/borrowingRoutes.js";
import membersRoutes from "./routes/membersRoutes.js";
import notFoundHandler from "./middlewares/notfound.middleware.js";
import logRequests from "./middlewares/logger.middleware.js";

const app = express();

app.use(express.json());
app.use(logRequests)
app.use("/api", bookRoutes);
app.use("/api", authorsRoutes);
app.use("/api", borrowingRoutes);
app.use("/api", membersRoutes);
app.use(handleError);
app.use(notFoundHandler);

export default app;
