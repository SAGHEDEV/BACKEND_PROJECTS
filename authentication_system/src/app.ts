import express from "express"
import handleError from "./middleware/error.middleware.js";

const app = express();


app.use(express.json());
app.use(handleError);

export default app;
