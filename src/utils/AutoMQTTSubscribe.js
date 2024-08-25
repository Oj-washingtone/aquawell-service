import Topics from "../model/Topics.js";
import MqttGateway from "../services/MqttGateway.js";

export default async function subscribeToAllSubTopics() {
  try {
    // Fetch all topics of type 'sub'
    const subTopics = await Topics.findAll({
      where: { type: "sub" },
      attributes: ["topic"],
    });

    const topics = subTopics.map((t) => t.topic);

    // Subscribe to all topics
    if (topics.length > 0) {
      await MqttGateway.subscribeToTopics(topics);
      console.log("Subscribed to all existing sub topics");
    } else {
      console.log("No sub topics found to subscribe to");
    }
  } catch (error) {
    console.error("Error subscribing to all sub topics:", error);
  }
}
