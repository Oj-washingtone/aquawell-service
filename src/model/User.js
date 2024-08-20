import db_config from "../../configs/db.js";
import { DataTypes } from "sequelize";

const User = db_config.define("user", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  organizationId: {
    type: DataTypes.UUID,
    allowNull: function () {
      return this.role === "system";
    },
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM("system", "super_admin", "admin", "member"),
    defaultValue: "member",
    allowNull: false,
  },
});

export default User;
