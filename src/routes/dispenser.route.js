import express from "express";
import {
  routeProtection,
  authorizeOrganisationMember,
} from "../middlewares/auth.middleware.js";

const dispenserRouter = express.Router();

dispenserRouter.get(
  "/",
  routeProtection,
  authorizeOrganisationMember,
  (req, res) => {
    res.send("Dispenser route");
  }
);

export default dispenserRouter;
