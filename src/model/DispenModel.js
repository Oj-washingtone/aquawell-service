import db_config from "../../configs/db.js";
import { DataTypes } from "sequelize";

const DispenModel = db_config.define("dispensers", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  appId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  tap: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  amountReceived: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  amountDispensed: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("success", "failed", "interupted"),
    allowNull: false,
  },
});

export default DispenModel;
