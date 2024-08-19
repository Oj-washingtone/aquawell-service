import db_config from "../../configs/db.js";
import { DataTypes } from "sequelize";

const Site = db_config.define("site", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  site_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default Site;
