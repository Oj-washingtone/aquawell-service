import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

// settings
app.set("port", process.env.PORT || 4000);

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// routes

export default app;
