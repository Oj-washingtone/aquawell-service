import { dispenserValidator } from "../utils/validators/dispenser.validator.js";
import Topics from "../model/Topics.js";
import { Op } from "sequelize";
import MqttGateway from "../services/MqttGateway.js";
import DispenModel from "../model/DispenModel.js";

export async function dispenseDisptch(req, res) {
  const { error } = dispenserValidator(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const { amount } = req.body;
  const appId = req.authenticatedApp;

  try {
    const topic = await Topics.findOne({
      where: {
        appId: appId,
        topic: {
          [Op.like]: "%/dispen",
        },

        type: "pub",
      },
    });

    if (!topic) {
      return res.status(404).json({
        message:
          "Dispenser topic not found, lease add a dispenser topic */dispen",
      });
    }

    const poblish = await MqttGateway.publish(
      [topic.topic],
      JSON.stringify({ amount })
    );

    res.status(200).json({
      message: "Dispatch successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function dispenseDisptchHistory(req, res) {
  const appId = req.authenticatedApp;

  try {
    const dispenseHistory = await DispenModel.findAll({
      where: {
        appId,
      },
      attributes: [
        "tap",
        "amountReceived",
        "amountDispensed",
        "status",
        "createdAt",
      ],
    });

    return res.status(200).json(dispenseHistory);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
