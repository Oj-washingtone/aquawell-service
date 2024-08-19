import db_config from "../../configs/db";
import { DataTypes } from "sequelize";

const Apps = db_config.define("apps", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  siteId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  apiKey: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  appSecret: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Apps;
