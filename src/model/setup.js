import db_config from "../../configs/db.js";
import App from "./Apps.js";
import User from "./User.js";
import Topics from "./Topics.js";
import Organization from "./Organization.js";
import bcrypt from "bcrypt";
import { config } from "dotenv";

config();

// associations

User.belongsTo(Organization, { foreignKey: "organizationId" });
Organization.hasMany(User, { foreignKey: "organizationId" });

Topics.belongsTo(App, { foreignKey: "appId" });
App.hasMany(Topics, { foreignKey: "appId" });

App.belongsTo(Organization, { foreignKey: "organizationId" });
Organization.hasMany(App, { foreignKey: "organizationId" });

// hook to hash password before creating user
User.beforeCreate(async (user, options) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

// create a system user

async function createSystemUser() {
  try {
    const userCount = await User.count();
    if (userCount === 0) {
      const systemUser = await User.create({
        name: process.env.SYSTEM_USER_NAME,
        email: process.env.SYSTEM_USER_EMAIL,
        password: process.env.SYSTEM_USER_PASSWORD,
        role: "system",
      });
      console.log("System user created:", systemUser.email);
    }
  } catch (err) {
    console.log("Error creating system user:", err);
  }
}

async function syncModels() {
  try {
    await db_config.sync({ alter: true }).then(async () => {
      console.log("Database & tables created!");
      await createSystemUser();
    });
  } catch (err) {
    console.log(err);
  }
}

export default syncModels;
