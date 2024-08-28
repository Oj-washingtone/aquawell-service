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

        console.log("Message processed and saved:", newRecord);
      }

      // const newRecord = new Model({
      //   ...messageObject,
      //   appId: app.appId,
      // });
      // await newRecord.save();

      // console.log("Message processed and saved:", newRecord);
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

// Function to handle the specific case of the lid status
async function handleLidStatus(appId, messageObject) {
  const { status } = messageObject;

  // Find the most recent lid record with status "open" for this app
  const recentLidRecord = await allowedMessageTypes[
    "purified_water_tank_lid"
  ].findOne({
    where: { appId, status: "open" },
    order: [["openedAt", "DESC"]],
  });

  if (status === "open") {
    // If the status is "open", create a new record
    const newLidRecord = new allowedMessageTypes["purified_water_tank_lid"]({
      ...messageObject,
      appId,
      openedAt: new Date(),
      closedAt: null,
    });
    await newLidRecord.save();

    console.log("Lid opened, new record created:", newLidRecord);
  } else if (status === "close" && recentLidRecord) {
    // If the status is "close", update the recent open record with closedAt and duration
    const closedAt = new Date();
    const duration = Math.floor((closedAt - recentLidRecord.openedAt) / 1000); // Duration in seconds

    await recentLidRecord.update({
      status: "close",
      closedAt,
      duration,
    });

    console.log("Lid closed, record updated:", recentLidRecord);
  } else {
    console.log("No open record found to update with close status.");
  }
}
