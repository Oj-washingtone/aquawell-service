import db_config from "../../configs/db";
import { DataTypes } from "sequelize";

const Topics = db_config.define("topics", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  siteId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Topics;
