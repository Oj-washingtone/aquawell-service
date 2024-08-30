import express from "express";
import {
  routeProtection,
  authorizeOrganisationMember,
  authenticateApp,
} from "../middlewares/auth.middleware.js";
import { dispenseDisptch } from "../controller/DispenserController.js";

const dispenserRouter = express.Router();

dispenserRouter.post(
  "/",
  routeProtection,
  authorizeOrganisationMember,
  authenticateApp,
  dispenseDisptch
);

export default dispenserRouter;
