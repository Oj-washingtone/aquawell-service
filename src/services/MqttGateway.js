import mqtt from "mqtt";

class MqttGateway {
  constructor() {
    this.messageQueue = [];
    this.connected = false;
    this.broker = "mqtt://144.91.79.8:1883";
    this.options = {
      username: "aquawell",
      password: "AquaWell#tools12",
      reconnectPeriod: 1000, // Reconnect every 1 second
      connectTimeout: 30 * 1000, // Connection timeout after 30 seconds
    };

    this.connect();
  }

  connect() {
    this.client = mqtt.connect(this.broker, this.options);

    this.client.on("connect", () => {
      console.log("Connected to MQTT broker");
      this.connected = true;
    });

    this.client.on("error", (error) => {
      console.error("MQTT connection error:", error);
      this.connected = false;
    });

    this.client.on("close", () => {
      console.log("MQTT connection closed");
      this.connected = false;
    });

    this.client.on("reconnect", () => {
      console.log("Reconnecting to MQTT broker");
    });

    this.client.on("offline", () => {
      console.log("MQTT client is offline");
      this.connected = false;
    });
  }

  messageReceived(topic, message) {
    this.client.on("message", (topic, message) => {
      console.log("Received message:", topic, message.toString());
    });
  }

  async publish(topics, message) {
    const timeout = 5000;
    let valveActivated = false;
    let valveDone = false;
    let deviceStatus = [];
    let timeoutId;
    let totalAtempts = 3;
    let response;

    for (let i = 0; i < topics.length; i++) {
      valveActivated = false;

      this.client.publish(topics[i].send, message, { qos: 1 }, (err) => {
        if (err) {
          console.error("Error publishing message:", err);
        }
      });

      // promise to resolve only on message received
      await new Promise((resolve) => {
        // subscribe to response topic
        this.client.subscribe(topics[i].response, { qos: 1 }, (err) => {
          if (err) {
            console.error("Error subscribing to topic:", err);
            return;
          }
        });

        // start timeout
        timeoutId = setTimeout(() => {
          resolve();
        }, timeout);

        this.client.on("message", (topic, message) => {
          if (message) {
            if (message.toString() === "success") {
              valveActivated = true;
            }
            clearTimeout(timeoutId);
            resolve();
          }
        });
      });

      // If valveActivated is still false, move to the next topic
      if (!valveActivated) {
        console.log(
          `${topics[i].send} could not be used, checking for next valve...`
        );
        if (i === topics.length - 1) {
          console.log(
            `All the available ${topics.length} valves failed to open, please check the valves and try again.`
          );
          response = {
            activeValve: "none",
            status: false,
            message: `All the  ${topics.length} available valves could be busy, please check and try again.`,
          };
          break;
        }

        this.client.unsubscribe(topics[i].response);
        this.client.unsubscribe(topics[i].send);

        continue;
      } else {
        response = {
          activeValve: topics[i].send,
          status: true,
          message: `Valve ${topics[i].send} is activated, water flowing`,
        };
        console.log(`using ${topics[i].send}, valve activated, water flowing`);
        this.client.unsubscribe(topics[i].response);

        break;
      }
    }

    return response;
  }
}

export default MqttGateway;
