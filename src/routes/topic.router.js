import express from "express";
import {
  authenticateApp,
  routeProtection,
  isPrivileged,
} from "../middlewares/auth.middleware.js";

import { createTopic } from "../controller/MqttTopicsController.js";

const topicsRouter = express.Router();

topicsRouter.use(routeProtection);

topicsRouter.post("/create", isPrivileged, createTopic);

export default topicsRouter;
