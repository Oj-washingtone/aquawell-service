import db_config from "../../configs/db.js";
import { DataTypes } from "sequelize";

const PurifiedWaterTankLid = db_config.define("purified_water_tank_lid", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  appId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("open", "closed"),
    allowNull: false,
  },
});

export default PurifiedWaterTankLid;
