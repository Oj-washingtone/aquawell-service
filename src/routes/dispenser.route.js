import express from "express";
import {
  routeProtection,
  authorizeOrganisationMember,
  authenticateApp,
} from "../middlewares/auth.middleware.js";
import {
  dispenseDisptch,
  dispenseDisptchHistory,
} from "../controller/DispenserController.js";

const dispenserRouter = express.Router();

dispenserRouter.post(
  "/",
  routeProtection,
  authorizeOrganisationMember,
  authenticateApp,
  dispenseDisptch
);

// history of dispensed water
dispenserRouter.get(
  "/history",
  routeProtection,
  authorizeOrganisationMember,
  authenticateApp,
  dispenseDisptchHistory
);

export default dispenserRouter;
