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

      const newRecord = new Model({
        ...messageObject,
        appId: app.appId,
      });
      await newRecord.save();

      console.log("Message processed and saved:", newRecord);
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
