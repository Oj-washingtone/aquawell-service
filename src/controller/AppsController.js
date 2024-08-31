import App from "../model/Apps.js";
import { validate } from "uuid";
import {
  createAppValidator,
  refreshAppKeyValidator,
} from "../utils/validators/app.validator.js";
import Organization from "../model/Organization.js";
import crypto from "crypto";

export async function createApp(req, res) {
  const { error } = createAppValidator(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const { name, organizationId } = req.body;

  if (!validate(organizationId)) {
    return res.status(400).json({
      message: "Invalid organization id",
    });
  }

  // check if organization exists
  const organization = await Organization.findByPk(organizationId);

  if (!organization) {
    return res.status(404).json({
      message: "No such organization",
    });
  }

  // check if app name already exists
  const appExists = await App.findOne({
    where: { name: name.toLowerCase(), organizationId },
  });

  if (appExists) {
    return res.status(400).json({
      message: "An app with similar name already exists",
    });
  }

  // Generate API key and app secret
  const apiKey = crypto
    .randomBytes(16)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 32);

  const appSecret = crypto
    .randomBytes(32)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 64);

  try {
    const app = await App.create({
      name: name.toLowerCase(),
      organizationId,
      apiKey,
      appSecret,
    });

    return res.status(201).json(app);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getAppsByOrganization(req, res) {
  const { organizationId } = req.params;

  if (!validate(organizationId)) {
    return res.status(400).json({
      message: "Invalid organization id",
    });
  }

  try {
    const apps = await App.findAll({
      where: { organizationId },
    });

    const userRole = req.user.role;

    // If the user is a system user, omit apiKey and appSecret
    const response = apps.map((app) => {
      if (userRole === "system") {
        const { apiKey, appSecret, ...safeApp } = app.dataValues;
        return safeApp;
      }
      return app;
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function refreshAppKey(req, res) {
  const { error } = refreshAppKeyValidator(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const { appId, organizationId } = req.body;

  if (!validate(appId)) {
    return res.status(400).json({
      message: "Invalid app id",
    });
  }

  try {
    const app = await App.findOne({
      where: { id: appId, organizationId },
    });

    if (!app) {
      return res.status(404).json({
        message: "No such app",
      });
    }

    // Generate new API key and app secret
    const apiKey = crypto
      .randomBytes(16)
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 32);

    const appSecret = crypto
      .randomBytes(32)
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 64);

    app.apiKey = apiKey;
    app.appSecret = appSecret;

    await app.save();

    return res.status(200).json(app);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
