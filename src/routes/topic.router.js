import express from "express";
import {
  authenticateApp,
  routeProtection,
} from "../middlewares/auth.middleware.js";

const topicsRouter = express.Router();

topicsRouter.use(routeProtection, authenticateApp);

topicsRouter.post("/create", (req, res) => {});

topicsRouter.get("/", (req, res) => {
  res.send("Get all topics");
});

export default topicsRouter;
