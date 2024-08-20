import express from "express";
import {
  routeProtection,
  verifyRoleSystem,
} from "../middlewares/auth.middleware.js";
import {
  createOrganization,
  getOrganizations,
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

export default organisationsRouter;
