import db_config from "../../configs/db.js";
import { DataTypes } from "sequelize";

const WasteWaterModel = db_config.define("waste_water", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  appId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default WasteWaterModel;
