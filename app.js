import express from "express";
import morgan from "morgan";
import cors from "cors";
import MqttGateway from "./src/services/MqttGateway.js";
import syncModels from "./src/model/setup.js";
import db_config from "./configs/db.js";
import AutoMQTTSubscribe from "./src/utils/AutoMQTTSubscribe.js";
import handleMqttMessages from "./src/services/HandleMqttMessages.js";

// routes
import authRouter from "./src/routes/auth.router.js";
import topicsRouter from "./src/routes/topic.router.js";
import organisationsRouter from "./src/routes/organisations.router.js";
import appsRouter from "./src/routes/apps.router.js";
import dispenserRouter from "./src/routes/dispenser.route.js";

const app = express();

// settings
app.set("port", process.env.PORT || 4000);

// middlewares
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

db_config
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
    syncModels();
    AutoMQTTSubscribe();

    app.listen(app.get("port"), () => {
      console.log("Aquawell service running on port", app.get("port"));
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// Handle MQTT messages
handleMqttMessages();

// routes
app.use("/auth", authRouter);
app.use("/topics", topicsRouter);
app.use("/organisations", organisationsRouter);
app.use("/apps", appsRouter);
app.use("/dispenser", dispenserRouter);

export default app;
