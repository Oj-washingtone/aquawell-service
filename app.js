import express from "express";
import morgan from "morgan";
import cors from "cors";
import MqttGateway from "./src/services/MqttGateway.js";
import syncModels from "./src/model/setup.js";
import db_config from "./configs/db.js";

// routes
import topicsRouter from "./src/routes/topic.route.js";

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
    app.listen(app.get("port"), () => {
      console.log("Aquawell service running on port", app.get("port"));
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// connect to mqtt
const mqttGateway = new MqttGateway();

// routes

app.use("/topics", topicsRouter);

export default app;
