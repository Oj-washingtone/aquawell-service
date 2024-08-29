import handle from "mqtt/lib/handlers/index";
import Topics from "../model/Topics.js";
import MqttGateway from "./MqttGateway.js";
import { allowedMessageTypes } from "../../configs/messages.js";

export default function handleMqttMessages() {
  MqttGateway.onMessage(async (topic, message) => {
    const messageObject = JSON.parse(message.toString());

    try {
      // validate message type
      const { isValid, Model } = validateAndLoadModel(messageObject);

      if (!isValid) {
        console.log(
          "Invalid message type '",
          messageObject.type,
          "' discarding message"
        );
        return; // Discard the message
      }

      // get appId by topic
      const app = await Topics.findOne({
        where: { topic },
        attributes: ["appId"],
      });

      if (!app) {
        console.log("No app found for topic:", topic);
        return;
      }

      console.log("App found for topic:", topic, app.appId);

      if (messageObject.type === "purified_water_tank_lid") {
        await handleLidStatus(app.appId, messageObject);
      } else {
        // For other models, just save the message as it is
        const newRecord = new Model({
          ...messageObject,
          appId: app.appId,
        });
        await newRecord.save();

        console.log("Message processed and saved");
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
    console.log("Received message:", topic, messageObject);
  });
}

export function validateAndLoadModel(messageObject) {
  const { type } = messageObject;

  if (allowedMessageTypes[type]) {
    const Model = allowedMessageTypes[type];
    return { isValid: true, Model };
  }

  return { isValid: false, Model: null };
}

async function handleLidStatus(appId, messageObject) {
  const { status } = messageObject;

  const recentLidRecord = await allowedMessageTypes[
    "purified_water_tank_lid"
  ].findOne({
    where: { status: "open", appId },
    order: [["openedAt", "DESC"]],
  });

  if (status === "open") {
    const newLidRecord = new allowedMessageTypes["purified_water_tank_lid"]({
      ...messageObject,
      appId,
      openedAt: new Date(),
      closedAt: null,
    });
    await newLidRecord.save();
  } else if (status === "closed" && recentLidRecord) {
    const closedAt = new Date();
    await recentLidRecord.update({
      status: "closed",
      closedAt,
    });
  } else {
    console.log("No open record found to update with close status.");
  }
}
