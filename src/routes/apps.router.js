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

export default appsRouter;
