import tokenProvider from "../services/jwtProvider.js";
import App from "../model/Apps.js";
import User from "../model/User.js";
import Organization from "../model/Organization.js";
import { validate } from "uuid";

export function routeProtection(req, res, next) {
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = tokenProvider.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired auth token",
    });
  }
}

// authenticate api keys
export function authenticateApp(req, res, next) {
  const apiKey = req.headers["api-key"];
  const appSecret = req.headers["app-secret"];

  if (!apiKey || !appSecret) {
    return res.status(401).json({
      message: "Unauthorized {apiKey && appSecret}",
    });
  }

  App.findOne({
    where: {
      apiKey: apiKey,
      appSecret: appSecret,
    },
  })
    .then((app) => {
      if (!app) {
        return res.status(401).json({
          message: "Invalid API key or app secret",
        });
      }

      req.authenticatedApp = app.id;
      next();
    })
    .catch((error) => {
      return res.status(500).json({
        message: "Internal server error",
      });
    });
}

// verify user role
export function verifyRoleSystem(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = tokenProvider.verifyToken(token);

    if (decoded.role !== "system") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

// organization admin functions
export async function authorizeOrganisationAdminFunctions(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = tokenProvider.verifyToken(token);
    const userId = decoded.id;
    const userRole = decoded.role;
    const organizationId =
      req.body.organizationId ||
      req.params.organizationId ||
      req.query.organizationId ||
      decoded.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    if (!validate(organizationId)) {
      return res.status(400).json({ message: "Invalid organization ID" });
    }

    // Check if the user is part of the organization
    const user = await User.findOne({ where: { id: userId, organizationId } });

    if (!user) {
      return res
        .status(403)
        .json({ message: "User does not belong to this organization" });
    }

    // Check if the user has an allowed role
    if (userRole !== "system" && !["super_admin", "admin"].includes(userRole)) {
      return res.status(403).json({
        message:
          "User does not have the required rights to manage organization",
      });
    }

    // proceed with organization id
    req.organizationId = organizationId;

    // User is authorized
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export async function authorizeOrganisationMember(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const decoded = tokenProvider.verifyToken(token);
    const userId = decoded.id;
    const userRole = decoded.role;

    const organizationId =
      req.body.organizationId ||
      req.params.organizationId ||
      req.query.organizationId ||
      decoded.organizationId;

    // if system userr
    if (userRole === "system") {
      return next();
    }

    if (!organizationId || !validate(organizationId)) {
      return res
        .status(400)
        .json({ message: "Valid organization ID is required" });
    }

    const user = await User.findOne({ where: { id: userId, organizationId } });

    if (!user) {
      return res
        .status(403)
        .json({ message: "User does not belong to this organization" });
    }

    // continue with organization id
    req.organizationId = organizationId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

// PRIVILAGED USER

export async function isPrivileged(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = tokenProvider.verifyToken(token);
    const userId = decoded.id;
    const userRole = decoded.role;
    const organizationId =
      req.body.organizationId ||
      req.params.organizationId ||
      req.query.organizationId;

    // If the user is a system user, allow them to proceed
    if (userRole === "system") {
      return next();
    }

    // If the user is not a system user, validate the organization they belong to
    if (!organizationId || !validate(organizationId)) {
      return res
        .status(400)
        .json({ message: "Valid organization ID is required" });
    }

    const user = await User.findOne({ where: { id: userId, organizationId } });

    if (!user) {
      return res
        .status(403)
        .json({ message: "User does not belong to this organization" });
    }

    // Check if the user has the required role in the organisation (admin or super_admin)
    if (!["super_admin", "admin"].includes(userRole)) {
      return res.status(403).json({
        message: "User does not have the required privileges",
      });
    }

    // User is authorized
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
