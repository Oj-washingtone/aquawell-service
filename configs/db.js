import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();

let db_config = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

export default db_config;
