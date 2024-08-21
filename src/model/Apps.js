import db_config from "../../configs/db.js";
import { DataTypes } from "sequelize";

const App = db_config.define("apps", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  organizationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("active", "inactive"),
    defaultValue: "active",
    allowNull: false,
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

export default App;
