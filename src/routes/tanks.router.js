import express from "express";
import {
  routeProtection,
  authorizeOrganisationMember,
  authenticateApp,
} from "../middlewares/auth.middleware.js";

import {
  getMainCurrentVolume,
  getMainTankUsageHistory,
  getSmallCurrentVolume,
  getSmallTankUsageHistory,
  getLidStatus,
} from "../controller/TanksController.js";

const tanksRouter = express.Router();

tanksRouter.get(
  "/main/volume",
  routeProtection,
  authorizeOrganisationMember,
  authenticateApp,
  getMainCurrentVolume
);

tanksRouter.get(
  "/small/volume",
  routeProtection,
  authorizeOrganisationMember,
  authenticateApp,
  getSmallCurrentVolume
);

tanksRouter.get(
  "/main/usage",
  routeProtection,
  authorizeOrganisationMember,
  authenticateApp,
  getMainTankUsageHistory
);

tanksRouter.get(
  "/small/usage",
  routeProtection,
  authorizeOrganisationMember,
  authenticateApp,
  getSmallTankUsageHistory
);

tanksRouter.get(
  "/purified-tank-lid/status",
  routeProtection,
  authorizeOrganisationMember,
  authenticateApp,
  getLidStatus
);

export default tanksRouter;
