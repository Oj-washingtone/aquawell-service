import db_config from "../../configs/db.js";
import { DataTypes } from "sequelize";

const MainTank = db_config.define("main_tank", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  appId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  capacity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  currentVolume: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default MainTank;
