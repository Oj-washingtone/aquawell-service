import handle from "mqtt/lib/handlers/index";
import Topics from "../model/Topics.js";
import MqttGateway from "./MqttGateway.js";
import { allowedMessageTypes } from "../../configs/messages.js";

export default function handleMqttMessages() {
  MqttGateway.onMessage(async (topic, message) => {
    const messageObject = JSON.parse(message.toString());

    try {
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
    } catch (error) {
      console.error("Error handling message:", error);
    }
    console.log("Received message:", topic, messageObject);
  });
}

function validateMessageTypes(messageObject) {
  if (messageObject.type && allowedMessageTypes.includes(messageObject.type)) {
    return true;
  }

  return false;
}
