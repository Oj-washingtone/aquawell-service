import express from "express";
import {
  routeProtection,
  verifyRoleSystem,
  authorizeOrganisationMember,
  isPrivileged,
  authorizeOrganisationAdminFunctions,
} from "../middlewares/auth.middleware.js";
import {
  createApp,
  getAppsByOrganization,
  refreshAppKey,
} from "../controller/AppsController.js";

const appsRouter = express.Router();

appsRouter.post("/create", routeProtection, verifyRoleSystem, createApp);

// get all apps for an organization
appsRouter.get(
  "/:organizationId",
  routeProtection,
  authorizeOrganisationMember,
  getAppsByOrganization
);

// refresh api key and app secret
appsRouter.post(
  "/refresh",
  routeProtection,
  authorizeOrganisationAdminFunctions,
  refreshAppKey
);

export default appsRouter;
