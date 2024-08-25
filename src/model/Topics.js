import db_config from "../../configs/db.js";
import { DataTypes } from "sequelize";

const Topics = db_config.define("topics", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  appId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  type: {
    type: DataTypes.ENUM("sub", "pub"),
  },
});

export default Topics;
