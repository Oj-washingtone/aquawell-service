import { validate } from "uuid";
import MainTank from "../model/MainTank.js";
import SmallTank from "../model/SmallTank.js";
import { Op } from "sequelize";
import { mainTankHistory } from "../utils/validators/tank.validator.js";
import PurifiedWaterTankLid from "../model/PurifiedWaterTankLid.js";

export async function getMainTankUsageHistory(req, res) {
  const appId = req.authenticatedApp;

  if (!validate(appId)) {
    return res.status(400).json({
      message: "Invalid app id",
    });
  }

  // validate date range
  const { error } = mainTankHistory(req.query);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const { startDate, endDate } = req.query;

  const adjustedEndDate = new Date(new Date(endDate).setHours(23, 59, 59, 999));

  try {
    const mainTankUsage = await MainTank.findAll({
      where: {
        appId,
        createdAt: {
          [Op.between]: [new Date(startDate), adjustedEndDate],
        },
      },
      attributes: ["id", "capacity", "level", "updatedAt"],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(mainTankUsage);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function getSmallTankUsageHistory(req, res) {
  const appId = req.authenticatedApp;

  if (!validate(appId)) {
    return res.status(400).json({
      message: "Invalid app id",
    });
  }

  // validate date range
  const { error } = mainTankHistory(req.query);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const { startDate, endDate } = req.query;
  const adjustedEndDate = new Date(new Date(endDate).setHours(23, 59, 59, 999));

  try {
    // get the small tank usage history
    const smallTankUsage = await SmallTank.findAll({
      where: {
        appId,
        createdAt: {
          [Op.between]: [new Date(startDate), adjustedEndDate],
        },
      },
      attributes: ["id", "capacity", "level", "updatedAt"],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(smallTankUsage);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
} // takes date range

export async function getMainCurrentVolume(req, res) {
  const appId = req.authenticatedApp;

  if (!validate(appId)) {
    return res.status(400).json({
      message: "Invalid app id",
    });
  }

  // get the latest record on main tank
  const mainTank = await MainTank.findOne({
    where: { appId },
    attributes: ["capacity", "level", "updatedAt"],
    order: [["createdAt", "DESC"]],
  });

  if (!mainTank) {
    return res.status(404).json({
      message: "No main tank record found",
    });
  }

  return res.status(200).json(mainTank);
}

export async function getSmallCurrentVolume(req, res) {
  const appId = req.authenticatedApp;

  if (!validate(appId)) {
    return res.status(400).json({
      message: "Invalid app id",
    });
  }

  // get the latest record on small tank
  const smallTank = await SmallTank.findOne({
    where: { appId },
    attributes: ["capacity", "level", "updatedAt"],
    order: [["createdAt", "DESC"]],
  });

  if (!smallTank) {
    return res.status(404).json({
      message: "No small tank record found",
    });
  }

  return res.status(200).json(smallTank);
}

export async function getLidStatus(req, res) {
  const appId = req.authenticatedApp;

  if (!validate(appId)) {
    return res.status(400).json({
      message: "Invalid app id",
    });
  }

  // get the latest record on small tank
  const lidStatus = await PurifiedWaterTankLid.findOne({
    where: { appId },
    attributes: ["id", "status", "openedAt", "closedAt"],
    order: [["createdAt", "DESC"]],
  });

  if (!lidStatus) {
    return res.status(404).json({
      message: "No lid status record found",
    });
  }

  return res.status(200).json(lidStatus);
}
