import express from "express";
import {
  routeProtection,
  verifyRoleSystem,
  authorizeOrganisationMember,
  authorizeOrganisationAdminFunctions,
} from "../middlewares/auth.middleware.js";
import { createApp } from "../controller/AppsController.js";

const appsRouter = express.Router();

appsRouter.post("/create", routeProtection, verifyRoleSystem, createApp);

// get apps by organization
appsRouter.get("/:organizationId", routeProtection, (req, res) => {
  res.send("get apps by organization");
});

// get all apps for an organization
appsRouter.get(
  "/:organizationId",
  routeProtection,
  authorizeOrganisationMember,
  (req, res) => {
    res.send("get all apps for an organization");
  }
);

export default appsRouter;
