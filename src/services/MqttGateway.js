import mqtt from "mqtt";
import { config } from "dotenv";
import subscribeToAllSubTopics from "../utils/AutoMQTTSubscribe.js";

config();

class MqttGateway {
  constructor() {
    if (!MqttGateway.instance) {
      this.client = null;
      this.connected = false;
      this.broker = process.env.MQTT_BROKER;
      this.options = {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        reconnectPeriod: 1000, // Reconnect every 1 second
        connectTimeout: 30 * 1000, // Connection timeout after 30 seconds
        clean: false,
        clientId: "akua_" + Math.random().toString(16).substr(2, 8),
      };

      this.connect(); // Establish connection when the app starts
      MqttGateway.instance = this;
    }

    return MqttGateway.instance;
  }

  connect() {
    if (!this.client) {
      this.client = mqtt.connect(this.broker, this.options);

      this.client.on("connect", () => {
        console.log("Connected to MQTT broker");
      });

      this.client.on("error", (error) => {
        console.error("MQTT connection error:", error);
      });

      this.client.on("close", () => {
        console.log("MQTT connection closed");
      });

      this.client.on("reconnect", () => {
        console.log("Reconnecting to MQTT broker");
      });

      this.client.on("offline", () => {
        console.log("MQTT client is offline");
      });
    }
  }

  async ensureConnection() {
    return new Promise((resolve) => {
      if (this.client && this.client.connected) {
        resolve();
      } else {
        this.client.once("connect", () => {
          resolve();
        });
        this.connect(); // Reattempt connection
      }
    });
  }

  async subscribeToTopics(topics) {
    try {
      await this.ensureConnection(); // Ensure connected before subscribing

      await new Promise((resolve, reject) => {
        this.client.subscribe(topics, { qos: 1 }, (err) => {
          if (err) {
            console.error(`Error subscribing to topics ${topics}:`, err);
            return reject(err);
          }
          console.log(`Subscribed to topics ${topics}`);
          resolve();
        });
      });
    } catch (error) {
      console.error("Subscription error:", error);
      throw error;
    }
  }

  async publish(topics, message) {
    try {
      await this.ensureConnection(); // Ensure connected before publishing

      for (let topic of topics) {
        this.client.publish(topic, message, { qos: 1 }, (err) => {
          if (err) {
            console.error("Error publishing message:", err);
          }
        });
      }
    } catch (error) {
      console.error("Publish error:", error);
      throw error;
    }
  }

  // listen to messages
  onMessage(callback) {
    this.client.on("message", callback);
  }
}

const instance = new MqttGateway();
Object.freeze(instance);

export default instance;
