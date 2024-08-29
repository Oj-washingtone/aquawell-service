import App from "../model/Apps.js";
import Organization from "../model/Organization.js";
import Topics from "../model/Topics.js";
import { validate } from "uuid";
import { createTopicValidator } from "../utils/validators/topics.validator.js";
import MqttGateway from "../services/MqttGateway.js";

export async function createTopic(req, res) {
  const { error } = createTopicValidator(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const { appId, topic, type } = req.body;

  if (!validate(appId)) {
    return res.status(400).json({
      message: "Invalid app id",
    });
  }

  // app exists ?
  const app = await App.findOne({ where: { id: appId } });

  if (!app) {
    return res.status(404).json({
      message: "No such app",
    });
  }

  // check if topic already exists
  const topicExists = await Topics.findOne({
    where: { topic, appId, type },
  });

  if (topicExists) {
    return res.status(400).json({
      message: "A similar topic already exists for the app",
      topicExists,
    });
  }

  if (type === "sub") {
    await MqttGateway.subscribeToTopics([topic]);
  }

  try {
    const newTopic = await Topics.create({
      organizationId,
      appId,
      topic,
      type,
    });

    return res.status(201).json(newTopic);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
