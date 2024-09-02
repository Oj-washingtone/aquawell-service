import express from "express";
import {
  routeProtection,
  verifyRoleSystem,
  authorizeOrganisationAdminFunctions,
} from "../middlewares/auth.middleware.js";
import {
  createOrganization,
  getOrganizations,
  updateOrganization,
} from "../controller/OrganisationController.js";

const organisationsRouter = express.Router();

// create organization
organisationsRouter.post(
  "/create",
  routeProtection,
  verifyRoleSystem,
  createOrganization
);

// get all organizations
organisationsRouter.get(
  "/",
  routeProtection,
  verifyRoleSystem,
  getOrganizations
);

// update organization
organisationsRouter.put(
  "/update/:organizationId",
  routeProtection,
  verifyRoleSystem,
  updateOrganization
);

export default organisationsRouter;
